# Chapter 3: The Offline-First Sync Engine

Schools in remote or low-connectivity environments frequently face network disruptions. To keep our Classroom Manager 100% usable, we design an **Offline-First Synchronization Engine**. 

In this chapter, you will learn how to build an offline local storage layer, run an offline modification queue, perform conflict detection, and merge local updates during database refreshes.

---

## 🏗️ Core Caching with IndexedDB

Standard `localStorage` is slow and limited to 5MB of string data. To store thousands of student profiles and attendance records safely, we use **IndexedDB**—a fast, transactional, asynchronous key-value database built directly into all web browsers.

To make IndexedDB easy to use in your Next.js/React project, install the `idb` package:
`npm install idb`

Here is your local student caching utility:

```typescript
// utils/studentCache.ts
import { openDB, IDBPDatabase } from "idb";
import { Student } from "../types";

const DB_NAME = "school-manager-cache";
const STORE_NAME = "students";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // 'id' is our primary key
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
};

export const studentCache = {
  // Get all cached students
  async getAll(): Promise<Student[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  },

  // Save a batch of student records
  async setBatch(students: Student[]) {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const student of students) {
      tx.store.put(student);
    }
    await tx.done;
  },

  // Clear cache and replace with fresh server records
  async clearAndSet(students: Student[]) {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    await tx.store.clear();
    for (const student of students) {
      tx.store.put(student);
    }
    await tx.done;
  },

  // Delete students from cache
  async deleteBatch(ids: string[]) {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const id of ids) {
      tx.store.delete(id);
    }
    await tx.done;
  }
};
```

---

## 📝 The Offline Change Queue

When a user modifies data (e.g., creating a student) while offline, we cannot write to Supabase directly. Instead, we:
1. Update the UI and the local cache immediately (**Optimistic UI**).
2. Save the transaction to an **Offline Queue** in local storage.
3. Automatically attempt to synchronize the queue when the browser detects a restored network connection.

Here is the data structure for a queued change:

```typescript
export interface OfflineStudentChange {
  id: string; // Change transaction ID
  type: "create" | "update" | "delete";
  studentId: string;
  studentData: Student;
  timestamp: string; // ISO date-time of the change
}
```

### Smart Queue Merging
To prevent our queue from bloat, we implement smart merging rules:
- If a student is **created** offline and then **deleted** offline, they cancel each other out—remove the changes from the queue completely!
- If a student is **created** offline and then **updated** offline, merge the updates directly into the original `create` record.
- If a student is **updated** offline twice, merge the properties together.

---

## 🔄 Preventing Data Loss: The Merging Pattern

A common bug in offline apps is **Reload Data Loss**: when the page reloads, a background routine fetches "fresh" data from the server and overwrites local cache. Since the newly added student is not on the server yet, they vanish from the UI!

To prevent this, we **merge pending offline queue changes with the downloaded server list** BEFORE saving them to the UI state and local cache:

```typescript
// Inside your DataContext fetchAndCacheAll function:
const refreshStudentsFromServer = async () => {
  try {
    // 1. Fetch fresh list from Supabase/Server
    let studentsList = await studentsApi.getAll();

    // 2. Fetch pending offline queue additions, edits, and deletions
    const pendingChanges = await studentSyncManager.getOfflineChanges();

    if (pendingChanges.length > 0) {
      console.log(`Merging ${pendingChanges.length} pending offline changes with server list...`);
      const studentMap = new Map<string, Student>();
      
      // Load server students into a map
      studentsList.forEach(s => studentMap.set(s.id, s));

      // Overwrite map with offline edits/creations, and remove deleted students
      for (const change of pendingChanges) {
        if (change.type === "create") {
          studentMap.set(change.studentId, change.studentData);
        } else if (change.type === "update") {
          const existing = studentMap.get(change.studentId);
          if (existing) {
            studentMap.set(change.studentId, { ...existing, ...change.studentData });
          } else {
            studentMap.set(change.studentId, change.studentData);
          }
        } else if (change.type === "delete") {
          studentMap.delete(change.studentId);
        }
      }
      
      // Convert map back to list
      studentsList = Array.from(studentMap.values());

      // Sort alphabetically by first and last name
      studentsList.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    }

    // 3. Save to React UI state and IndexedDB local cache safely!
    setStudents(studentsList);
    await studentCache.clearAndSet(studentsList);

  } catch (err) {
    console.error("Failed to load or merge student list", err);
  }
};
```

---

## 🥊 Conflict Detection & Resolution

What happens if Teacher A edits Student 1's phone number offline, while Teacher B edits Student 1's spelling online? This is a **Conflict**.

### 1. Conflict Detection
A conflict is detected if the student's `updatedAt` field on the server is **newer** than our local offline change's `timestamp`.

### 2. Conflict Resolution Strategies
Your sync manager must support resolving conflicts using one of three standard strategies:
- **Local Wins (Force Overwrite)**: Save our version to the server regardless of changes. This is the default behavior.
- **Server Wins (Discard Local)**: Discard our local offline change and pull down the newer server version.
- **User Selection (Manual Reconcile)**: Prompt the user with a Dialog showing both versions side-by-side, letting them choose which field to keep.

---

## 🔋 Synchronizing the Queue

When the app goes back online, we iterate over the queue sequentially to process sync actions:

```typescript
// utils/studentSyncManager.ts
export const studentSyncManager = {
  async syncOfflineChanges(): Promise<void> {
    const changes = await this.getOfflineChanges();
    if (changes.length === 0) return;

    for (const change of changes) {
      try {
        // 1. Check for conflicts
        const serverStudent = await studentsApi.getById(change.studentId);
        let conflictDetected = false;

        if (serverStudent && serverStudent.updatedAt) {
          if (new Date(serverStudent.updatedAt) > new Date(change.timestamp)) {
            conflictDetected = true;
          }
        }

        // 2. Resolve or sync
        if (conflictDetected) {
          // Resolve: default to Local Wins, or trigger user prompt UI
          console.warn(`Conflict detected for student ${change.studentId}. Applying Local Wins.`);
        }

        // 3. Send API writes to Supabase
        if (change.type === "create") {
          await studentsApi.create(change.studentData);
        } else if (change.type === "update") {
          await studentsApi.update(change.studentId, change.studentData);
        } else if (change.type === "delete") {
          await studentsApi.delete(change.studentId);
        }

        // 4. Remove this specific change transaction from the queue
        await this.removeOfflineChange(change.id);

      } catch (err) {
        console.error(`Sync transaction failed for change ${change.id}:`, err);
        // Break loop to preserve correct transaction ordering (FIFO)
        break;
      }
    }
  }
};
```

Phenomenal! Your offline engine is designed to handle outages like a professional system. Let's move on to **[Chapter 4: Building Responsive Material UI Interfaces](./04-frontend-modules.md)** to see how we build beautiful layouts for the teachers!

import { studentCache } from "./studentCache";
import { studentsApi } from "../api/students";
import { cache } from "../lib/cache";
import { Student, OfflineStudentChange, ConflictItem } from "../types";

export const studentSyncManager = {
  async getLastSyncTime(): Promise<string | null> {
    return localStorage.getItem("last_profiles_sync_time");
  },

  async setLastSyncTime(time: string) {
    localStorage.setItem("last_profiles_sync_time", time);
  },

  async getNextScheduledRefresh(): Promise<string | null> {
    return localStorage.getItem("next_scheduled_refresh_date");
  },

  async setNextScheduledRefresh() {
    // Generate a random interval between 5 and 9 days (a random week)
    const randomDays = Math.floor(Math.random() * 5) + 5; // 5, 6, 7, 8, 9
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + randomDays);
    localStorage.setItem("next_scheduled_refresh_date", nextDate.toISOString());
  },

  /**
   * Fetches the current queue of offline student changes.
   */
  async getOfflineChanges(): Promise<OfflineStudentChange[]> {
    const changes = await cache.get("offline_student_changes");
    return changes || [];
  },

  /**
   * Clears all offline changes from the queue.
   */
  async clearOfflineChanges(): Promise<void> {
    await cache.remove("offline_student_changes");
  },

  /**
   * Adds an offline student change to the queue with smart merging.
   */
  async addOfflineChange(
    type: "create" | "update" | "delete",
    studentId: string,
    studentData: Student
  ): Promise<void> {
    const changes = await this.getOfflineChanges();
    const existingIndex = changes.findIndex((c) => c.studentId === studentId);

    const newChange: OfflineStudentChange = {
      id: `chg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      studentId,
      studentData,
      timestamp: new Date().toISOString(),
    };

    if (existingIndex > -1) {
      const existing = changes[existingIndex];
      if (type === "delete") {
        if (existing.type === "create") {
          // Created offline and then deleted offline -> cancel each other out
          changes.splice(existingIndex, 1);
          await cache.set("offline_student_changes", changes);
          return;
        } else {
          // Updated offline and then deleted offline -> replace with delete
          changes[existingIndex] = newChange;
        }
      } else if (type === "update") {
        if (existing.type === "create") {
          // Created offline and then updated offline -> keep as create with merged data
          existing.studentData = { ...existing.studentData, ...studentData };
          existing.timestamp = newChange.timestamp;
        } else {
          // Updated offline and updated again -> merge data
          existing.studentData = { ...existing.studentData, ...studentData };
          existing.timestamp = newChange.timestamp;
        }
      }
    } else {
      changes.push(newChange);
    }

    await cache.set("offline_student_changes", changes);
  },

  /**
   * Removes a specific offline change by its change ID.
   */
  async removeOfflineChange(changeId: string): Promise<void> {
    const changes = await this.getOfflineChanges();
    const filtered = changes.filter((c) => c.id !== changeId);
    await cache.set("offline_student_changes", filtered);
  },

  /**
   * Synchronizes all queued offline changes with the server.
   * If onConflict is provided, it can be used to ask the user how to resolve conflicts.
   */
  async syncOfflineChanges(
    onConflict?: (conflict: ConflictItem) => Promise<"local" | "server" | "skip">
  ): Promise<{
    success: boolean;
    syncedCount: number;
    conflictedCount: number;
    errors: string[];
  }> {
    const changes = await this.getOfflineChanges();
    if (changes.length === 0) {
      return { success: true, syncedCount: 0, conflictedCount: 0, errors: [] };
    }

    let syncedCount = 0;
    let conflictedCount = 0;
    const errors: string[] = [];

    // Keep an array to process in order
    const pendingChanges = [...changes];

    for (const change of pendingChanges) {
      try {
        // Fetch server state for conflict detection
        let serverStudent: Student | null = null;
        if (change.type === "update" || change.type === "delete") {
          try {
            serverStudent = await studentsApi.getStudentFromServer(change.studentId);
          } catch (err) {
            console.warn(`Could not fetch server state for student ${change.studentId}:`, err);
          }
        }

        // Conflict Detection:
        // A conflict occurs if the student was updated on the server after our local offline change timestamp.
        let conflictDetected = false;
        if (serverStudent) {
          const serverUpdatedAt = serverStudent.updatedAt || "";
          const localTimestamp = change.timestamp;

          if (serverUpdatedAt && new Date(serverUpdatedAt) > new Date(localTimestamp)) {
            conflictDetected = true;
          }
        } else if (change.type === "update" || change.type === "delete") {
          // Trying to edit or delete, but student doesn't exist on server (deleted by someone else)
          if (change.type === "update") {
            conflictDetected = true; // Conflict: edited locally but deleted on server
          } else {
            // Already deleted on server, so we can just remove our offline change and consider it done
            await this.removeOfflineChange(change.id);
            syncedCount++;
            continue;
          }
        }

        if (conflictDetected && onConflict) {
          conflictedCount++;
          const resolution = await onConflict({
            id: change.studentId,
            studentName: `${change.studentData?.firstName || ""} ${change.studentData?.lastName || ""}`.trim(),
            localVersion: change.studentData,
            serverVersion: serverStudent || ({ id: change.studentId } as Student),
            changeType: change.type,
            timestamp: change.timestamp,
          });

          if (resolution === "local") {
            // Force save our version to server
            if (change.type === "update") {
              const resolvedData = { ...change.studentData, updatedAt: new Date().toISOString() };
              await studentsApi.update(change.studentId, resolvedData);
            } else if (change.type === "delete") {
              await studentsApi.delete(change.studentId);
            }
            await this.removeOfflineChange(change.id);
            syncedCount++;
          } else if (resolution === "server") {
            // Revert local changes by overwriting with server state
            if (serverStudent) {
              const allStudents = await studentCache.getAll();
              const updated = allStudents.map((s) => (s.id === change.studentId ? serverStudent! : s));
              await studentCache.clearAndSet(updated);
              await cache.set("offline_students", updated);
            } else {
              // Deleted on server, delete locally too
              const allStudents = await studentCache.getAll();
              const filtered = allStudents.filter((s) => s.id !== change.studentId);
              await studentCache.clearAndSet(filtered);
              await cache.set("offline_students", filtered);
            }
            await this.removeOfflineChange(change.id);
            syncedCount++;
          } else {
            // Skip resolving this conflict for now, keep it in queue
            continue;
          }
        } else if (conflictDetected) {
          // Default behavior when no conflict handler is present: Local Wins
          if (change.type === "update") {
            const resolvedData = { ...change.studentData, updatedAt: new Date().toISOString() };
            await studentsApi.update(change.studentId, resolvedData);
          } else if (change.type === "delete") {
            await studentsApi.delete(change.studentId);
          }
          await this.removeOfflineChange(change.id);
          syncedCount++;
        } else {
          // Standard sync: no conflicts
          if (change.type === "create") {
            await studentsApi.create(change.studentData);
          } else if (change.type === "update") {
            await studentsApi.update(change.studentId, change.studentData);
          } else if (change.type === "delete") {
            await studentsApi.delete(change.studentId);
          }
          await this.removeOfflineChange(change.id);
          syncedCount++;
        }
      } catch (err: any) {
        console.error(`Failed to synchronize offline change ${change.id}:`, err);
        errors.push(err.message || String(err));
        // Stop sequential execution to prevent cascading dependencies/ordering errors
        break;
      }
    }

    return {
      success: errors.length === 0,
      syncedCount,
      conflictedCount,
      errors,
    };
  },

  async performSync(fullSync = false): Promise<{
    success: boolean;
    syncedCount: number;
    deletedCount: number;
    type: "full" | "incremental";
  }> {
    try {
      const lastSyncTime = await this.getLastSyncTime();
      const isFirstTime = !lastSyncTime;
      const isFull = fullSync || isFirstTime;

      // Run the sync query on the API
      const result = await studentsApi.syncProfiles(isFull ? null : lastSyncTime, isFull);

      if (isFull) {
        // Complete override
        await studentCache.clearAndSet(result.syncedStudents);

        // Update cache (idb-keyval used by DataContext)
        await cache.set("offline_students", result.syncedStudents);

        await this.setLastSyncTime(result.timestamp);
        await this.setNextScheduledRefresh();

        return {
          success: true,
          syncedCount: result.syncedStudents.length,
          deletedCount: 0,
          type: "full",
        };
      } else {
        // Incremental sync
        // Put modified/added
        await studentCache.setBatch(result.syncedStudents);

        // Delete removed
        if (result.deletedIds.length > 0) {
          await studentCache.deleteBatch(result.deletedIds);
        }

        // Sync with offline_students in cache
        const allStudents = await studentCache.getAll();
        await cache.set("offline_students", allStudents);

        await this.setLastSyncTime(result.timestamp);

        // Check if we passed the scheduled date
        const nextScheduledStr = await this.getNextScheduledRefresh();
        if (nextScheduledStr && new Date() >= new Date(nextScheduledStr)) {
          await this.setNextScheduledRefresh();
        }

        return {
          success: true,
          syncedCount: result.syncedStudents.length,
          deletedCount: result.deletedIds.length,
          type: "incremental",
        };
      }
    } catch (err) {
      console.error("Student sync failed:", err);
      return {
        success: false,
        syncedCount: 0,
        deletedCount: 0,
        type: fullSync ? "full" : "incremental",
      };
    }
  },

  async checkAndAutoTriggerSync(): Promise<boolean> {
    const lastSyncTime = await this.getLastSyncTime();

    // Auto trigger initial download on initial sign-in (when no sync has run yet)
    if (!lastSyncTime) {
      console.log("Auto-triggering initial student profile sync...");
      const res = await this.performSync(true);
      return res.success;
    }

    // Auto trigger refresh based on random week scheduled check
    const nextScheduledStr = await this.getNextScheduledRefresh();
    if (nextScheduledStr && new Date() >= new Date(nextScheduledStr)) {
      console.log("Auto-triggering scheduled weekly student profile refresh...");
      const res = await this.performSync(true);
      return res.success;
    }

    return false;
  },
};

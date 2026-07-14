import { openDB, IDBPDatabase } from "idb";
import { Student } from "../types";

const DB_NAME = "classroom-manager-student-cache";
const STORE_NAME = "students";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
};

export const studentCache = {
  async getAll(): Promise<Student[]> {
    const db = await getDB();
    return db.getAll(STORE_NAME);
  },

  async setBatch(students: Student[]) {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    for (const student of students) {
      tx.store.put(student);
    }
    await tx.done;
  },

  async searchLocal(query: string): Promise<Student[]> {
    const students = await this.getAll();
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (s) =>
        s.firstName.toLowerCase().includes(lowerQuery) ||
        s.lastName.toLowerCase().includes(lowerQuery) ||
        s.rollNumber?.toLowerCase().includes(lowerQuery)
    );
  }
};

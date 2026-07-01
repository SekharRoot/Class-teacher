import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { ClassItem } from "../types";

let classesCache: ClassItem[] | null = null;
let classesCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const classesApi = {
  /**
   * Fetches all educational boards and class standard configurations.
   */
  async getAll(forceRefresh = false): Promise<ClassItem[]> {
    if (
      !forceRefresh &&
      classesCache &&
      Date.now() - classesCacheTime < CACHE_DURATION
    ) {
      return classesCache;
    }
    try {
      const classesQuery = query(collection(db, "classes"));
      const classesSnapshot = await getDocs(classesQuery);
      const list: ClassItem[] = [];
      classesSnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ClassItem);
      });

      // Sort alphabetically by board, class level and section
      list.sort((a, b) => {
        const nameA = `${a.board} ${a.classStandard} ${a.section}`;
        const nameB = `${b.board} ${b.classStandard} ${b.section}`;
        return nameA.localeCompare(nameB);
      });

      classesCache = list;
      classesCacheTime = Date.now();
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "classes");
    }
  },

  /**
   * Invalidates the current classes cache.
   */
  invalidateCache() {
    classesCache = null;
  },

  /**
   * Saves a newly created class config.
   */
  async create(classItem: ClassItem): Promise<void> {
    try {
      const classRef = doc(db, "classes", classItem.id);
      await setDoc(classRef, {
        board: classItem.board,
        classStandard: classItem.classStandard,
        section: classItem.section,
        createdAt: classItem.createdAt || new Date().toISOString(),
      });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `classes/${classItem.id}`,
      );
    }
  },

  /**
   * Updates an existing class config.
   */
  async update(classId: string, classItem: ClassItem): Promise<void> {
    try {
      const classRef = doc(db, "classes", classId);
      await setDoc(
        classRef,
        {
          board: classItem.board,
          classStandard: classItem.classStandard,
          section: classItem.section,
          createdAt: classItem.createdAt || new Date().toISOString(),
        },
        { merge: true },
      );
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `classes/${classId}`);
    }
  },

  /**
   * Deletes an existing class standard config.
   */
  async delete(classId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "classes", classId));
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `classes/${classId}`);
    }
  },

  /**
   * Batch seeds demo records of class standards.
   */
  async seedDemo(demoList: ClassItem[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      demoList.forEach((demo) => {
        const classRef = doc(db, "classes", demo.id);
        batch.set(classRef, {
          board: demo.board,
          classStandard: demo.classStandard,
          section: demo.section,
          createdAt: new Date().toISOString(),
        });
      });
      await batch.commit();
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "classes");
    }
  },
};

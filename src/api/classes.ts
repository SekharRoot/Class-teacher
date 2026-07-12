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
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
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
      const activeSchoolId = getActiveSchoolId();
      const classesQuery = query(collection(db, "schools", activeSchoolId, "classes"));
      const classesSnapshot = await getDocs(classesQuery);
      const list: ClassItem[] = [];
      classesSnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ id: doc.id, ...data } as ClassItem);
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
      const activeSchoolId = classItem.schoolId || getActiveSchoolId();
      const classRef = doc(db, "schools", activeSchoolId, "classes", classItem.id);
      await setDoc(classRef, {
        board: classItem.board,
        classStandard: classItem.classStandard,
        section: classItem.section,
        schoolId: activeSchoolId,
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
      const activeSchoolId = classItem.schoolId || getActiveSchoolId();
      const classRef = doc(db, "schools", activeSchoolId, "classes", classId);
      await setDoc(
        classRef,
        {
          board: classItem.board,
          classStandard: classItem.classStandard,
          section: classItem.section,
          schoolId: activeSchoolId,
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
      const activeSchoolId = getActiveSchoolId();
      await deleteDoc(doc(db, "schools", activeSchoolId, "classes", classId));
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
      const activeSchoolId = getActiveSchoolId();
      demoList.forEach((demo) => {
        const classRef = doc(db, "schools", activeSchoolId, "classes", demo.id);
        batch.set(classRef, {
          board: demo.board,
          classStandard: demo.classStandard,
          section: demo.section,
          schoolId: demo.schoolId || activeSchoolId,
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

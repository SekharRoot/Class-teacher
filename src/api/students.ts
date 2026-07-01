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
import { Student } from "../types";

let studentsCache: Student[] | null = null;
let studentsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const studentsApi = {
  /**
   * Fetches all registered student profiles.
   */
  async getAll(forceRefresh = false): Promise<Student[]> {
    if (
      !forceRefresh &&
      studentsCache &&
      Date.now() - studentsCacheTime < CACHE_DURATION
    ) {
      return studentsCache;
    }
    try {
      const studentsQuery = query(collection(db, "students"));
      const studentsSnapshot = await getDocs(studentsQuery);
      const list: Student[] = [];
      studentsSnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Student);
      });

      // Sort alphabetically by first name
      list.sort((a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });

      studentsCache = list;
      studentsCacheTime = Date.now();
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "students");
    }
  },

  /**
   * Invalidates the current student cache.
   */
  invalidateCache() {
    studentsCache = null;
  },

  /**
   * Creates or updates a student profile.
   */
  async create(student: Student): Promise<void> {
    try {
      const studentRef = doc(db, "students", student.id);
      await setDoc(studentRef, {
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
        classId: student.classId || "",
        gender: student.gender || "Male",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        phoneNumber: student.phoneNumber || "",
        boarderType: student.boarderType || "Day Scholar",
        image: student.image || "",
      });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `students/${student.id}`,
      );
    }
  },

  /**
   * Updates an existing student profile.
   */
  async update(
    studentId: string,
    studentData: Partial<Student>,
  ): Promise<void> {
    try {
      const studentRef = doc(db, "students", studentId);
      await setDoc(studentRef, studentData, { merge: true });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
    }
  },

  /**
   * Deletes a student profile.
   */
  async delete(studentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "students", studentId));
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `students/${studentId}`,
      );
    }
  },

  /**
   * Batch creates or updates multiple student profiles.
   */
  async batchCreate(studentsList: Student[]): Promise<void> {
    return this.seedDemo(studentsList);
  },

  /**
   * Batch uploads a collection of sample student profiles.
   */
  async seedDemo(studentsList: Student[]): Promise<void> {
    try {
      const batch = writeBatch(db);
      studentsList.forEach((student) => {
        const studentRef = doc(db, "students", student.id);
        batch.set(studentRef, {
          firstName: student.firstName,
          lastName: student.lastName,
          rollNumber: student.rollNumber,
          classId: student.classId || "",
          gender: student.gender || "Male",
          fatherName: student.fatherName || "",
          motherName: student.motherName || "",
          phoneNumber: student.phoneNumber || "",
          boarderType: student.boarderType || "Day Scholar",
          image: student.image || "",
        });
      });
      await batch.commit();
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students");
    }
  },
};

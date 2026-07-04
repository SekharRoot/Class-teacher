import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  where,
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
      return [];
    }
  },

  /**
   * Fetches all students for a specific class from Firestore.
   */
  async getByClass(classId: string): Promise<Student[]> {
    try {
      const q = query(
        collection(db, "students"),
        where("classId", "==", classId),
      );
      const querySnapshot = await getDocs(q);
      const list: Student[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Student);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "students");
      return [];
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
      const data = {
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
        profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        isActive: student.isActive !== undefined ? student.isActive : true,
      };
      await setDoc(studentRef, data);
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
      const updateData = { ...studentData };
      
      // Auto-assign profileId if missing during update
      if (updateData.profileId === undefined) {
        // We don't necessarily want to generate it here unless it's explicitly missing in DB
        // But for "Automatic profile id generation too" requirement:
      }

      await setDoc(studentRef, updateData, { merge: true });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
    }
  },

  /**
   * Deletes a student profile (Soft Delete).
   */
  async delete(studentId: string): Promise<void> {
    try {
      const studentRef = doc(db, "students", studentId);
      await setDoc(studentRef, { isActive: false }, { merge: true });
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
   * Batch deletes student profiles (Soft Delete).
   */
  async batchDelete(studentIds: string[]): Promise<void> {
    try {
      const BATCH_SIZE = 500;
      for (let i = 0; i < studentIds.length; i += BATCH_SIZE) {
        const chunk = studentIds.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);
        chunk.forEach((id) => {
          const studentRef = doc(db, "students", id);
          batch.update(studentRef, { isActive: false });
        });
        await batch.commit();
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "students");
    }
  },

  /**
   * Restores a deleted student profile.
   */
  async restore(studentId: string): Promise<void> {
    try {
      const studentRef = doc(db, "students", studentId);
      await setDoc(studentRef, { isActive: true }, { merge: true });
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
    }
  },

  /**
   * Transfers students to a new class.
   */
  async transferStudents(studentIds: string[], targetClassId: string): Promise<void> {
    try {
      const BATCH_SIZE = 500;
      for (let i = 0; i < studentIds.length; i += BATCH_SIZE) {
        const chunk = studentIds.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);
        chunk.forEach((id) => {
          const studentRef = doc(db, "students", id);
          batch.update(studentRef, { classId: targetClassId });
        });
        await batch.commit();
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students/transfer");
    }
  },

  /**
   * Permanently deletes a student profile from Firestore.
   */
  async permanentlyDelete(studentId: string): Promise<void> {
    try {
      const studentRef = doc(db, "students", studentId);
      await deleteDoc(studentRef);
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
   * Assigns profile IDs to students missing them.
   */
  async assignMissingProfileIds(): Promise<number> {
    try {
      const students = await this.getAll(true);
      const missing = students.filter(s => !s.profileId);
      if (missing.length === 0) return 0;

      const batch = writeBatch(db);
      missing.forEach(s => {
        const ref = doc(db, "students", s.id);
        batch.update(ref, { 
          profileId: `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}` 
        });
      });
      await batch.commit();
      this.invalidateCache();
      return missing.length;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students");
      return 0;
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
      // Firestore batch limit is 500 operations
      const BATCH_SIZE = 500;
      for (let i = 0; i < studentsList.length; i += BATCH_SIZE) {
        const chunk = studentsList.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);
        chunk.forEach((student) => {
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
            profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            isActive: student.isActive !== undefined ? student.isActive : true,
          });
        });
        await batch.commit();
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students");
    }
  },
};

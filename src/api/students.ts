import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  where,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
import { Student } from "../types";
import { classesApi } from "./classes";

let studentsCache: Student[] | null = null;
let studentsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getStudentDocRef(schoolId: string, classId: string, studentId: string) {
  const cId = classId && classId !== "" ? classId : "unassigned";
  return doc(db, "schools", schoolId, "classes", cId, "students", studentId);
}

async function findStudentClass(studentId: string): Promise<{ schoolId: string, classId: string, data?: any } | null> {
  const activeSchoolId = getActiveSchoolId();
  const cached = studentsCache?.find(s => s.id === studentId);
  if (cached) {
    return { schoolId: cached.schoolId || activeSchoolId, classId: cached.classId || "" };
  }
  const classesList = await classesApi.getAll();
  const classIds = ["unassigned", ...classesList.map(c => c.id)];
  for (const cId of classIds) {
    const ref = doc(db, "schools", activeSchoolId, "classes", cId, "students", studentId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { schoolId: activeSchoolId, classId: cId === "unassigned" ? "" : cId, data: snap.data() };
    }
  }
  return null;
}

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
    const classesList = await classesApi.getAll();
    return this.getAllInParallelChunks(classesList, forceRefresh);
  },

  /**
   * Fetches all registered student profiles in parallel chunks by class.
   */
  async getAllInParallelChunks(classesList: { id: string }[], forceRefresh = false): Promise<Student[]> {
    if (
      !forceRefresh &&
      studentsCache &&
      Date.now() - studentsCacheTime < CACHE_DURATION
    ) {
      return studentsCache;
    }
    try {
      const activeSchoolId = getActiveSchoolId();
      const classIds = ["unassigned", ...classesList.map(c => c.id)];
      const promises = classIds.map(async (cId) => {
        const q = query(collection(db, "schools", activeSchoolId, "classes", cId, "students"));
        const snapshot = await getDocs(q);
        const subList: Student[] = [];
        snapshot.forEach((doc) => {
          subList.push({ id: doc.id, ...doc.data() } as Student);
        });
        return subList;
      });

      const results = await Promise.all(promises);
      const list: Student[] = results.flat();

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
      const activeSchoolId = getActiveSchoolId();
      const cId = classId && classId !== "" ? classId : "unassigned";
      const q = query(
        collection(db, "schools", activeSchoolId, "classes", cId, "students")
      );
      const querySnapshot = await getDocs(q);
      const list: Student[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Student);
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `classes/${classId}/students`);
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
      const activeSchoolId = (student as any).schoolId || getActiveSchoolId();
      const classId = student.classId || "";
      const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);
      const data = {
        firstName: student.firstName,
        lastName: student.lastName,
        rollNumber: student.rollNumber,
        classId: classId,
        gender: student.gender || "Male",
        fatherName: student.fatherName || "",
        motherName: student.motherName || "",
        phoneNumber: student.phoneNumber || "",
        boarderType: student.boarderType || "Day Scholar",
        image: student.image || "",
        profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        isActive: student.isActive !== undefined ? student.isActive : true,
        schoolId: activeSchoolId,
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
      const activeSchoolId = getActiveSchoolId();
      const studentInfo = await findStudentClass(studentId);
      if (!studentInfo) {
        throw new Error(`Student not found: ${studentId}`);
      }

      const oldClassId = studentInfo.classId;
      const targetClassId = studentData.classId !== undefined ? studentData.classId : oldClassId;

      if (oldClassId !== targetClassId) {
        // Transfer to another class
        const oldRef = getStudentDocRef(activeSchoolId, oldClassId, studentId);
        await deleteDoc(oldRef);

        const newRef = getStudentDocRef(activeSchoolId, targetClassId, studentId);
        const mergedData = {
          ...(studentInfo.data || {}),
          ...studentData,
          classId: targetClassId,
        };
        await setDoc(newRef, mergedData);
      } else {
        const ref = getStudentDocRef(activeSchoolId, oldClassId, studentId);
        await setDoc(ref, studentData, { merge: true });
      }
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
      const activeSchoolId = getActiveSchoolId();
      const studentInfo = await findStudentClass(studentId);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await setDoc(studentRef, { isActive: false }, { merge: true });
      }
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
      const activeSchoolId = getActiveSchoolId();
      for (const id of studentIds) {
        const studentInfo = await findStudentClass(id);
        if (studentInfo) {
          const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, id);
          await setDoc(studentRef, { isActive: false }, { merge: true });
        }
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
      const activeSchoolId = getActiveSchoolId();
      const studentInfo = await findStudentClass(studentId);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await setDoc(studentRef, { isActive: true }, { merge: true });
      }
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
      const activeSchoolId = getActiveSchoolId();
      for (const id of studentIds) {
        const studentInfo = await findStudentClass(id);
        if (studentInfo) {
          const oldClassId = studentInfo.classId;
          if (oldClassId !== targetClassId) {
            const oldRef = getStudentDocRef(activeSchoolId, oldClassId, id);
            await deleteDoc(oldRef);

            const newRef = getStudentDocRef(activeSchoolId, targetClassId, id);
            const mergedData = {
              ...(studentInfo.data || {}),
              classId: targetClassId,
            };
            await setDoc(newRef, mergedData);
          }
        }
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students/transfer");
    }
  },

  /**
   * Transfers/assigns students to a new school.
   */
  async transferSchool(studentIds: string[], targetSchoolId: string): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      for (const id of studentIds) {
        const studentInfo = await findStudentClass(id);
        if (studentInfo) {
          const oldRef = getStudentDocRef(activeSchoolId, studentInfo.classId, id);
          await deleteDoc(oldRef);

          const newRef = getStudentDocRef(targetSchoolId, "", id);
          const mergedData = {
            ...(studentInfo.data || {}),
            schoolId: targetSchoolId,
            classId: "",
          };
          await setDoc(newRef, mergedData);
        }
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students/transferSchool");
    }
  },

  /**
   * Permanently deletes a student profile from Firestore.
   */
  async permanentlyDelete(studentId: string): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const studentInfo = await findStudentClass(studentId);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await deleteDoc(studentRef);
      }
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

      const activeSchoolId = getActiveSchoolId();
      const batch = writeBatch(db);
      missing.forEach(s => {
        const ref = getStudentDocRef(activeSchoolId, s.classId || "", s.id);
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
      const activeSchoolId = getActiveSchoolId();
      for (const student of studentsList) {
        const classId = student.classId || "";
        const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);
        await setDoc(studentRef, {
          firstName: student.firstName,
          lastName: student.lastName,
          rollNumber: student.rollNumber,
          classId: classId,
          gender: student.gender || "Male",
          fatherName: student.fatherName || "",
          motherName: student.motherName || "",
          phoneNumber: student.phoneNumber || "",
          boarderType: student.boarderType || "Day Scholar",
          image: student.image || "",
          profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          isActive: student.isActive !== undefined ? student.isActive : true,
          schoolId: student.schoolId || activeSchoolId,
        });
      }
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students");
    }
  },
};

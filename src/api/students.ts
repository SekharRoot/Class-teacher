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
  limit,
  startAfter,
  collectionGroup,
  waitForPendingWrites,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType, getRtdb } from "../lib/firebase";
import { ref as rtdbRef, set as rtdbSet, get as rtdbGet, remove as rtdbRemove } from "firebase/database";
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
import { Student } from "../types";
import { classesApi } from "./classes";

async function waitForSync() {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }
  try {
    const syncPromise = waitForPendingWrites(db);
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
    await Promise.race([syncPromise, timeoutPromise]);
  } catch (err) {
    console.warn("Failed or timed out waiting for pending writes:", err);
  }
}

let studentsCache: Student[] | null = null;
let studentsCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getStudentDocRef(schoolId: string, classId: string, studentId: string) {
  const cId = classId && classId !== "" ? classId : "unassigned";
  return doc(db, "schools", schoolId, "classes", cId, "students", studentId);
}

async function findStudentClass(studentId: string, bypassCache = false): Promise<{ schoolId: string, classId: string, data?: any } | null> {
  const activeSchoolId = getActiveSchoolId();
  if (!bypassCache) {
    const cached = studentsCache?.find(s => s.id === studentId);
    if (cached) {
      return { schoolId: cached.schoolId || activeSchoolId, classId: cached.classId || "", data: cached };
    }
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
    const classesList = await classesApi.getAll();
    return this.getAllInParallelChunks(classesList, forceRefresh);
  },

  /**
   * Fetches a paginated list of students from Firestore.
   */
  async getPaginated(pageSize: number, lastVisible: any = null): Promise<{ students: Student[], lastVisible: any }> {
    try {
      const activeSchoolId = getActiveSchoolId();
      let q = query(
        collectionGroup(db, "students"),
        where("schoolId", "==", activeSchoolId),
        where("isActive", "==", true),
        limit(pageSize)
      );
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }
      const snapshot = await getDocs(q);
      const students: Student[] = [];
      snapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      return { students, lastVisible: snapshot.docs[snapshot.docs.length - 1] || null };
    } catch (error: any) {
      console.warn("Paginated fetch failed (likely missing index). Falling back to manual pagination.", error.message);
      // Fallback: Fetch all active students and paginate manually
      const classesList = await classesApi.getAll();
      const allStudents = await this.getAllInParallelChunks(classesList);
      const activeStudents = allStudents.filter(s => s.isActive !== false && s.schoolId === getActiveSchoolId());
      
      let startIndex = 0;
      if (lastVisible && typeof lastVisible === 'number') {
        startIndex = lastVisible;
      }
      
      const endIndex = startIndex + pageSize;
      const paginatedStudents = activeStudents.slice(startIndex, endIndex);
      
      const nextLastVisible = endIndex < activeStudents.length ? endIndex : null;
      
      return { students: paginatedStudents, lastVisible: nextLastVisible };
    }
  },

  /**
   * Performs server-side search for students.
   */
  async search(searchTerm: string): Promise<Student[]> {
    try {
      const activeSchoolId = getActiveSchoolId();
      // Prefix search on firstName
      const q = query(
        collectionGroup(db, "students"),
        where("schoolId", "==", activeSchoolId),
        where("firstName", ">=", searchTerm),
        where("firstName", "<=", searchTerm + "\uf8ff"),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const students: Student[] = [];
      snapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() } as Student);
      });
      return students;
    } catch (error: any) {
      console.warn("Server-side search failed (likely missing index). Falling back to manual filtering.", error.message);
      // Fallback: Fetch all active students and filter manually
      const classesList = await classesApi.getAll();
      const allStudents = await this.getAllInParallelChunks(classesList);
      const activeStudents = allStudents.filter(s => s.isActive !== false && s.schoolId === getActiveSchoolId());
      
      const termLower = searchTerm.toLowerCase();
      const filtered = activeStudents.filter(s => 
        s.firstName.toLowerCase().startsWith(termLower)
      ).slice(0, 50);
      
      return filtered;
    }
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

      // Performance Optimization: If we have many classes to fetch, it's highly inefficient
      // to make N+1 parallel requests. Fetch all students in a single collectionGroup query instead!
      // But if we only need a few classes (e.g., for a class_teacher), direct class collection queries are faster and cheaper.
      if (classesList.length > 5) {
        const q = query(
          collectionGroup(db, "students"),
          where("schoolId", "==", activeSchoolId)
        );
        const snapshot = await getDocs(q);
        const list: Student[] = [];
        snapshot.forEach((doc) => {
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
      }

      // Otherwise, query only the requested classes directly.
      const classIds = classesList.length === 0 ? ["unassigned"] : ["unassigned", ...classesList.map(c => c.id)];
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
      console.warn("CollectionGroup student fetch failed. Attempting fallback.", error);
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

        list.sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });

        studentsCache = list;
        studentsCacheTime = Date.now();
        return list;
      } catch (fallbackError) {
        handleFirestoreError(fallbackError, OperationType.LIST, "students");
        return [];
      }
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
   * Saves a student profile picture to Firebase Realtime Database.
   */
  async saveStudentImageInRtdb(schoolId: string, studentId: string, base64Image: string): Promise<void> {
    const rtdb = getRtdb();
    if (!rtdb) throw new Error("Realtime Database not initialized");
    const path = `schools/${schoolId}/students/${studentId}/image`;
    await rtdbSet(rtdbRef(rtdb, path), base64Image);
  },

  /**
   * Fetches a student profile picture from Firebase Realtime Database.
   */
  async getStudentImageFromRtdb(schoolId: string, studentId: string): Promise<string> {
    const rtdb = getRtdb();
    if (!rtdb) return "";
    const path = `schools/${schoolId}/students/${studentId}/image`;
    try {
      const snapshot = await rtdbGet(rtdbRef(rtdb, path));
      return snapshot.val() || "";
    } catch (err) {
      console.error(`Failed to get student image from RTDB for student ${studentId}:`, err);
      return "";
    }
  },

  /**
   * Deletes a student profile picture from Firebase Realtime Database.
   */
  async deleteStudentImageFromRtdb(schoolId: string, studentId: string): Promise<void> {
    const rtdb = getRtdb();
    if (!rtdb) return;
    const path = `schools/${schoolId}/students/${studentId}/image`;
    try {
      await rtdbRemove(rtdbRef(rtdb, path));
    } catch (err) {
      console.error(`Failed to delete student image from RTDB for student ${studentId}:`, err);
    }
  },

  /**
   * Creates or updates a student profile.
   */
  async create(student: Student): Promise<void> {
    try {
      const activeSchoolId = (student as any).schoolId || getActiveSchoolId();
      const classId = student.classId || "";
      const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);

      let rtdbImageUrl = student.image || "";
      if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
        try {
          await this.saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
          rtdbImageUrl = "rtdb";
        } catch (rtdbErr) {
          console.error("Failed to save image in Realtime Database during create:", rtdbErr);
        }
      } else if (!rtdbImageUrl) {
        try {
          await this.deleteStudentImageFromRtdb(activeSchoolId, student.id);
        } catch (rtdbErr) {
          console.error("Failed to delete image from Realtime Database during create:", rtdbErr);
        }
      }

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
        image: rtdbImageUrl,
        profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        isActive: student.isActive !== undefined ? student.isActive : true,
        schoolId: activeSchoolId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(studentRef, data);
      await waitForSync();
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
    oldClassIdParam?: string,
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      let oldClassId = oldClassIdParam;
      let studentInfo: any = null;

      if (!oldClassId) {
        studentInfo = await findStudentClass(studentId, true);
        if (!studentInfo) {
          throw new Error(`Student not found: ${studentId}`);
        }
        oldClassId = studentInfo.classId;
      }

      let rtdbImageUrl = studentData.image;
      if (rtdbImageUrl !== undefined) {
        if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
          try {
            await this.saveStudentImageInRtdb(activeSchoolId, studentId, rtdbImageUrl);
            studentData.image = "rtdb";
          } catch (rtdbErr) {
            console.error("Failed to save image in Realtime Database during update:", rtdbErr);
          }
        } else if (!rtdbImageUrl) {
          try {
            await this.deleteStudentImageFromRtdb(activeSchoolId, studentId);
          } catch (rtdbErr) {
            console.error("Failed to delete image from Realtime Database during update:", rtdbErr);
          }
        }
      }

      const targetClassId = studentData.classId !== undefined ? studentData.classId : oldClassId;

      if (oldClassId !== targetClassId) {
        // Transfer to another class
        const oldRef = getStudentDocRef(activeSchoolId, oldClassId, studentId);
        await deleteDoc(oldRef);

        if (!studentInfo) {
          studentInfo = await findStudentClass(studentId, true);
        }

        const newRef = getStudentDocRef(activeSchoolId, targetClassId, studentId);
        const mergedData = {
          ...(studentInfo?.data || {}),
          ...studentData,
          classId: targetClassId,
          updatedAt: new Date().toISOString(),
        };
        await setDoc(newRef, mergedData);
      } else {
        const ref = getStudentDocRef(activeSchoolId, oldClassId, studentId);
        await setDoc(ref, {
          ...studentData,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
      await waitForSync();
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
      const studentInfo = await findStudentClass(studentId, true);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await setDoc(studentRef, { isActive: false, updatedAt: new Date().toISOString() }, { merge: true });
      }
      await waitForSync();
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
        const studentInfo = await findStudentClass(id, true);
        if (studentInfo) {
          const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, id);
          await setDoc(studentRef, { isActive: false, updatedAt: new Date().toISOString() }, { merge: true });
        }
      }
      await waitForSync();
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
      const studentInfo = await findStudentClass(studentId, true);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await setDoc(studentRef, { isActive: true, updatedAt: new Date().toISOString() }, { merge: true });
      }
      await waitForSync();
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
        const studentInfo = await findStudentClass(id, true);
        if (studentInfo) {
          const oldClassId = studentInfo.classId;
          if (oldClassId !== targetClassId) {
            const oldRef = getStudentDocRef(activeSchoolId, oldClassId, id);
            await deleteDoc(oldRef);

            const newRef = getStudentDocRef(activeSchoolId, targetClassId, id);
            const mergedData = {
              ...(studentInfo.data || {}),
              classId: targetClassId,
              updatedAt: new Date().toISOString(),
            };
            await setDoc(newRef, mergedData);
          }
        }
      }
      await waitForSync();
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
        const studentInfo = await findStudentClass(id, true);
        if (studentInfo) {
          const oldRef = getStudentDocRef(activeSchoolId, studentInfo.classId, id);
          await deleteDoc(oldRef);

          const newRef = getStudentDocRef(targetSchoolId, "", id);
          const mergedData = {
            ...(studentInfo.data || {}),
            schoolId: targetSchoolId,
            classId: "",
            updatedAt: new Date().toISOString(),
          };
          await setDoc(newRef, mergedData);
        }
      }
      await waitForSync();
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
      const studentInfo = await findStudentClass(studentId, true);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
        await deleteDoc(studentRef);
        try {
          await this.deleteStudentImageFromRtdb(activeSchoolId, studentId);
        } catch (rtdbErr) {
          console.error("Failed to delete image from Realtime Database during permanentlyDelete:", rtdbErr);
        }
      }
      await waitForSync();
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
          profileId: `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          updatedAt: new Date().toISOString()
        });
      });
      await batch.commit();
      await waitForSync();
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

        let rtdbImageUrl = student.image || "";
        if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
          try {
            await this.saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
            rtdbImageUrl = "rtdb";
          } catch (rtdbErr) {
            console.error("Failed to save image in Realtime Database during seedDemo:", rtdbErr);
          }
        }

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
          image: rtdbImageUrl,
          profileId: student.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          isActive: student.isActive !== undefined ? student.isActive : true,
          schoolId: student.schoolId || activeSchoolId,
          updatedAt: new Date().toISOString(),
        });
      }
      await waitForSync();
      this.invalidateCache();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "students");
    }
  },

  /**
   * Fetches a specific student profile from the server directly.
   */
  async getStudentFromServer(studentId: string): Promise<Student | null> {
    try {
      const studentInfo = await findStudentClass(studentId, true);
      if (studentInfo && studentInfo.data) {
        return { id: studentId, ...studentInfo.data } as Student;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to fetch student ${studentId} from server:`, error);
      return null;
    }
  },

  /**
   * Performs an incremental or full sync of student profiles based on a last-synced timestamp.
   */
  async syncProfiles(lastSyncTime?: string | null, fullSync = false): Promise<{
    syncedStudents: Student[];
    deletedIds: string[];
    timestamp: string;
  }> {
    const activeSchoolId = getActiveSchoolId();
    const currentTimestamp = new Date().toISOString();
    
    if (fullSync || !lastSyncTime) {
      // Full Sync: Fetch ALL students from server
      const classesList = await classesApi.getAll();
      const allServerStudents = await this.getAllInParallelChunks(classesList, true);
      const activeServerStudents = allServerStudents.filter(s => s.schoolId === activeSchoolId);
      
      return {
        syncedStudents: activeServerStudents,
        deletedIds: [],
        timestamp: currentTimestamp,
      };
    } else {
      // Incremental Sync
      try {
        const q = query(
          collectionGroup(db, "students"),
          where("schoolId", "==", activeSchoolId),
          where("updatedAt", ">", lastSyncTime)
        );
        const snapshot = await getDocs(q);
        const syncedStudents: Student[] = [];
        const deletedIds: string[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          const student = { id: doc.id, ...data } as Student;
          if (data.isActive === false) {
            deletedIds.push(doc.id);
          } else {
            syncedStudents.push(student);
          }
        });
        
        return {
          syncedStudents,
          deletedIds,
          timestamp: currentTimestamp,
        };
      } catch (error: any) {
        console.warn("Incremental sync via collectionGroup failed (likely missing index). Falling back to full sync.", error.message);
        const classesList = await classesApi.getAll();
        const allServerStudents = await this.getAllInParallelChunks(classesList, true);
        const activeServerStudents = allServerStudents.filter(s => s.schoolId === activeSchoolId);
        
        const syncedStudents = activeServerStudents.filter(s => (s as any).updatedAt && (s as any).updatedAt > lastSyncTime);
        return {
          syncedStudents,
          deletedIds: [],
          timestamp: currentTimestamp,
        };
      }
    }
  }
};

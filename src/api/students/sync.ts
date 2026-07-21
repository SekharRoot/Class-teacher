import {
  query,
  getDocs,
  where,
  collectionGroup,
  writeBatch,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { Student } from "../../types";
import { classesApi } from "../classes";
import { getStudentDocRef, clearStudentsCache } from "./core";
import { getAllInParallelChunks } from "./getters";

export async function assignMissingProfileIds(): Promise<number> {
  try {
    const classesList = await classesApi.getAll();
    const students = await getAllInParallelChunks(classesList, true);
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
    clearStudentsCache();
    return missing.length;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students");
    return 0;
  }
}

export async function syncProfiles(lastSyncTime?: string | null, fullSync = false): Promise<{
  syncedStudents: Student[];
  deletedIds: string[];
  timestamp: string;
}> {
  const activeSchoolId = getActiveSchoolId();
  const currentTimestamp = new Date().toISOString();
  
  if (fullSync || !lastSyncTime) {
    const classesList = await classesApi.getAll();
    const allServerStudents = await getAllInParallelChunks(classesList, true);
    const activeServerStudents = allServerStudents.filter(s => s.schoolId === activeSchoolId);
    
    return {
      syncedStudents: activeServerStudents,
      deletedIds: [],
      timestamp: currentTimestamp,
    };
  } else {
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
      const allServerStudents = await getAllInParallelChunks(classesList, true);
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

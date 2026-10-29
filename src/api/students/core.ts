import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  collectionGroup,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { Student } from "../../types";
import { classesApi } from "../classes";

export let studentsCache: Student[] | null = null;
export let studentsCacheTime = 0;
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function setStudentsCache(list: Student[] | null, time = Date.now()) {
  studentsCache = list;
  studentsCacheTime = time;
}

export function clearStudentsCache() {
  studentsCache = null;
  studentsCacheTime = 0;
}

export function getStudentDocRef(schoolId: string, classId: string, studentId: string) {
  const cId = classId && classId !== "" ? classId : "unassigned";
  return doc(db, "schools", schoolId, "classes", cId, "students", studentId);
}

export async function findStudentClass(studentId: string): Promise<{ schoolId: string, classId: string, data?: any } | null> {
  const activeSchoolId = getActiveSchoolId();
  
  const cached = studentsCache?.find(s => s.id === studentId);
  if (cached) {
    return { 
      schoolId: cached.schoolId || activeSchoolId, 
      classId: cached.classId || "", 
      data: cached 
    };
  }

  try {
    const classesList = await classesApi.getAll();
    const classIds = Array.from(new Set(["unassigned", ...classesList.map(c => c.id)]));
    
    // Parallel check across class student subcollections for this school
    const checkPromises = classIds.map(async (cId) => {
      try {
        const ref = doc(db, "schools", activeSchoolId, "classes", cId, "students", studentId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          return {
            schoolId: data.schoolId || activeSchoolId,
            classId: cId === "unassigned" ? "" : cId,
            data,
          };
        }
      } catch {
        // ignore per-class check error
      }
      return null;
    });

    const results = await Promise.all(checkPromises);
    const found = results.find(Boolean);
    if (found) {
      return found;
    }
  } catch (err) {
    console.error("findStudentClass lookup error:", err);
  }

  return null;
}

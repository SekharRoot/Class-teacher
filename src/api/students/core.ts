import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  collectionGroup,
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
    const q = query(
      collectionGroup(db, "students")
    );
    const snapshot = await getDocs(q);
    const foundDoc = snapshot.docs.find(d => d.id === studentId);
    
    if (foundDoc) {
      const data = foundDoc.data();
      let classId = data.classId;
      if (classId === undefined) {
        const pathParts = foundDoc.ref.path.split("/");
        if (pathParts.length >= 4) {
          classId = pathParts[3];
        }
      }
      return { 
        schoolId: data.schoolId || activeSchoolId, 
        classId: classId === "unassigned" ? "" : (classId || ""), 
        data: data 
      };
    }
  } catch (err) {
    console.warn("findStudentClass collectionGroup fallback failed:", err);
  }

  try {
    const classesList = await classesApi.getAll();
    const classIds = ["unassigned", ...classesList.map(c => c.id)];
    for (const cId of classIds) {
      const ref = doc(db, "schools", activeSchoolId, "classes", cId, "students", studentId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        return { 
          schoolId: activeSchoolId, 
          classId: cId === "unassigned" ? "" : cId, 
          data: data 
        };
      }
    }
  } catch (err) {
    console.error("findStudentClass iterative fallback failed:", err);
  }

  return null;
}

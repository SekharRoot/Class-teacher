import {
  collection,
  query,
  getDocs,
  where,
  limit,
  startAfter,
  collectionGroup,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { Student } from "../../types";
import { classesApi } from "../classes";
import {
  studentsCache,
  studentsCacheTime,
  CACHE_DURATION,
  setStudentsCache,
  findStudentClass,
} from "./core";

export async function getAllInParallelChunks(classesList: { id: string }[], forceRefresh = false): Promise<Student[]> {
  if (
    !forceRefresh &&
    studentsCache &&
    Date.now() - studentsCacheTime < CACHE_DURATION
  ) {
    return studentsCache;
  }
  try {
    const activeSchoolId = getActiveSchoolId();

    // Collect all class IDs including 'unassigned' and remove duplicates
    const rawClassIds = classesList ? classesList.map((c) => c.id).filter(Boolean) : [];
    const classIds = Array.from(new Set(["unassigned", ...rawClassIds]));

    // Execute parallel subcollection queries for all classes of the specific school
    const promises = classIds.map(async (cId) => {
      try {
        const q = query(collection(db, "schools", activeSchoolId, "classes", cId, "students"));
        const snapshot = await getDocs(q);
        const subList: Student[] = [];
        snapshot.forEach((doc) => {
          subList.push({ id: doc.id, ...doc.data() } as Student);
        });
        return subList;
      } catch (err) {
        console.warn(`Parallel fetch for class ${cId} in school ${activeSchoolId} notice:`, err);
        return [];
      }
    });

    const results = await Promise.all(promises);
    const list: Student[] = results.flat();

    // Remove duplicates if any student document was returned multiple times
    const uniqueMap = new Map<string, Student>();
    list.forEach((s) => {
      if (s && s.id) uniqueMap.set(s.id, s);
    });
    const uniqueList = Array.from(uniqueMap.values());

    uniqueList.sort((a, b) => {
      const nameA = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
      const nameB = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setStudentsCache(uniqueList, Date.now());
    return uniqueList;
  } catch (error) {
    console.error("Parallel collection queries fetch failed:", error);
    handleFirestoreError(error, OperationType.LIST, "students");
    return [];
  }
}

export async function getAll(forceRefresh = false): Promise<Student[]> {
  const classesList = await classesApi.getAll();
  return getAllInParallelChunks(classesList, forceRefresh);
}

export async function getPaginated(pageSize: number, lastVisible: any = null): Promise<{ students: Student[], lastVisible: any }> {
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
    const classesList = await classesApi.getAll();
    const allStudents = await getAllInParallelChunks(classesList);
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
}

export async function search(searchTerm: string): Promise<Student[]> {
  try {
    const activeSchoolId = getActiveSchoolId();
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
    const classesList = await classesApi.getAll();
    const allStudents = await getAllInParallelChunks(classesList);
    const activeStudents = allStudents.filter(s => s.isActive !== false && s.schoolId === getActiveSchoolId());
    
    const termLower = searchTerm.toLowerCase();
    const filtered = activeStudents.filter(s => 
      s.firstName.toLowerCase().startsWith(termLower)
    ).slice(0, 50);
    
    return filtered;
  }
}

export async function getByClass(classId: string): Promise<Student[]> {
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
}

export async function getStudentFromServer(studentId: string): Promise<Student | null> {
  try {
    const studentInfo = await findStudentClass(studentId);
    if (studentInfo && studentInfo.data) {
      return { id: studentId, ...studentInfo.data } as Student;
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch student ${studentId} from server:`, error);
    return null;
  }
}

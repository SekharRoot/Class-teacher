import { writeBatch } from "firebase/firestore";
import { handleFirestoreError, OperationType, db } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { getStudentDocRef, findStudentClass, clearStudentsCache } from "./core";

export async function transferStudents(studentIds: string[], targetClassId: string): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfos = await Promise.all(
      studentIds.map(async (id) => {
        const info = await findStudentClass(id);
        return info ? { id, ...info } : null;
      })
    );

    const validMoves = studentInfos.filter(
      (info): info is { id: string; schoolId: string; classId: string; data?: any } =>
        info !== null && info.classId !== targetClassId
    );

    // Chunk in batches of 200 (max 400 operations per batch)
    const BATCH_SIZE = 200;
    const nowIso = new Date().toISOString();

    for (let i = 0; i < validMoves.length; i += BATCH_SIZE) {
      const chunk = validMoves.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const oldRef = getStudentDocRef(activeSchoolId, item.classId, item.id);
        batch.delete(oldRef);

        const newRef = getStudentDocRef(activeSchoolId, targetClassId, item.id);
        const mergedData = {
          ...(item.data || {}),
          classId: targetClassId,
          schoolId: activeSchoolId,
          updatedAt: nowIso,
        };
        batch.set(newRef, mergedData);
      }

      await batch.commit();
    }

    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students/transfer");
  }
}

export async function transferSchool(studentIds: string[], targetSchoolId: string): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfos = await Promise.all(
      studentIds.map(async (id) => {
        const info = await findStudentClass(id);
        return info ? { id, ...info } : null;
      })
    );

    const validMoves = studentInfos.filter(
      (info): info is { id: string; schoolId: string; classId: string; data?: any } =>
        info !== null
    );

    const BATCH_SIZE = 200;
    const nowIso = new Date().toISOString();

    for (let i = 0; i < validMoves.length; i += BATCH_SIZE) {
      const chunk = validMoves.slice(i, i + BATCH_SIZE);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const oldRef = getStudentDocRef(activeSchoolId, item.classId, item.id);
        batch.delete(oldRef);

        const newRef = getStudentDocRef(targetSchoolId, "", item.id);
        const mergedData = {
          ...(item.data || {}),
          schoolId: targetSchoolId,
          classId: "",
          updatedAt: nowIso,
        };
        batch.set(newRef, mergedData);
      }

      await batch.commit();
    }

    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students/transferSchool");
  }
}

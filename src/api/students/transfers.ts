import { deleteDoc, setDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { getStudentDocRef, findStudentClass, clearStudentsCache } from "./core";

export async function transferStudents(studentIds: string[], targetClassId: string): Promise<void> {
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
            updatedAt: new Date().toISOString(),
          };
          await setDoc(newRef, mergedData);
        }
      }
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students/transfer");
  }
}

export async function transferSchool(studentIds: string[], targetSchoolId: string): Promise<void> {
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
          updatedAt: new Date().toISOString(),
        };
        await setDoc(newRef, mergedData);
      }
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students/transferSchool");
  }
}

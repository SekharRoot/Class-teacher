import { setDoc, deleteDoc } from "firebase/firestore";
import { handleFirestoreError, OperationType } from "../../lib/firebase";
import { getActiveSchoolId } from "../../lib/activeSchoolHelper";
import { Student } from "../../types";
import { getStudentDocRef, findStudentClass, clearStudentsCache } from "./core";
import { saveStudentImageInRtdb, deleteStudentImageFromRtdb } from "./images";

export async function create(student: Student): Promise<void> {
  try {
    const activeSchoolId = (student as any).schoolId || getActiveSchoolId();
    const classId = student.classId || "";
    const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);

    console.log(`[studentsApi] Creating student at path: ${studentRef.path}`, {
      activeSchoolId,
      classId,
      studentId: student.id,
      firstName: student.firstName,
      lastName: student.lastName
    });

    let rtdbImageUrl = student.image || "";
    if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
      try {
        await saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
        rtdbImageUrl = "rtdb";
      } catch (rtdbErr) {
        console.warn("Failed to save image in Realtime Database during create:", rtdbErr);
      }
    } else if (!rtdbImageUrl) {
      try {
        await deleteStudentImageFromRtdb(activeSchoolId, student.id);
      } catch (rtdbErr) {
        console.warn("Failed to delete image from Realtime Database during create:", rtdbErr);
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
    console.log(`[studentsApi] Successfully created student: ${student.id}`);
    clearStudentsCache();
  } catch (error) {
    console.error(`[studentsApi] Create failed for student ${student.id}:`, error);
    handleFirestoreError(
      error,
      OperationType.WRITE,
      `students/${student.id}`,
    );
  }
}

export async function update(
  studentId: string,
  studentData: Partial<Student>,
): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfo = await findStudentClass(studentId);
    if (!studentInfo) {
      throw new Error(`Student not found: ${studentId}`);
    }

    let rtdbImageUrl = studentData.image;
    if (rtdbImageUrl !== undefined) {
      if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
        try {
          await saveStudentImageInRtdb(activeSchoolId, studentId, rtdbImageUrl);
          studentData.image = "rtdb";
        } catch (rtdbErr) {
          console.warn("Failed to save image in Realtime Database during update:", rtdbErr);
        }
      } else if (!rtdbImageUrl) {
        try {
          await deleteStudentImageFromRtdb(activeSchoolId, studentId);
        } catch (rtdbErr) {
          console.warn("Failed to delete image from Realtime Database during update:", rtdbErr);
        }
      }
    }

    const oldClassId = studentInfo.classId;
    const targetClassId = studentData.classId !== undefined ? studentData.classId : oldClassId;

    console.log(`[studentsApi] Updating student ${studentId}. Class transition: ${oldClassId} -> ${targetClassId}`);

    if (oldClassId !== targetClassId) {
      const oldRef = getStudentDocRef(activeSchoolId, oldClassId, studentId);
      console.log(`[studentsApi] Deleting old record at: ${oldRef.path}`);
      await deleteDoc(oldRef);

      const newRef = getStudentDocRef(activeSchoolId, targetClassId, studentId);
      console.log(`[studentsApi] Creating new record at: ${newRef.path}`);

      const mergedData = {
        ...(studentInfo.data || {}),
        ...studentData,
        classId: targetClassId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(newRef, mergedData);
    } else {
      const ref = getStudentDocRef(activeSchoolId, oldClassId, studentId);
      console.log(`[studentsApi] Updating existing record at: ${ref.path}`);
      await setDoc(ref, {
        ...studentData,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
    
    console.log(`[studentsApi] Successfully updated student: ${studentId}`);
    clearStudentsCache();
  } catch (error) {
    console.error(`[studentsApi] Update failed for student ${studentId}:`, error);
    handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
  }
}

export async function deleteStudent(studentId: string): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfo = await findStudentClass(studentId);
    if (studentInfo) {
      const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
      await setDoc(studentRef, { isActive: false, updatedAt: new Date().toISOString() }, { merge: true });
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `students/${studentId}`,
    );
  }
}

export async function batchDelete(studentIds: string[]): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    for (const id of studentIds) {
      const studentInfo = await findStudentClass(id);
      if (studentInfo) {
        const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, id);
        await setDoc(studentRef, { isActive: false, updatedAt: new Date().toISOString() }, { merge: true });
      }
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, "students");
  }
}

export async function restore(studentId: string): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfo = await findStudentClass(studentId);
    if (studentInfo) {
      const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
      await setDoc(studentRef, { isActive: true, updatedAt: new Date().toISOString() }, { merge: true });
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `students/${studentId}`);
  }
}

export async function permanentlyDelete(studentId: string): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const studentInfo = await findStudentClass(studentId);
    if (studentInfo) {
      const studentRef = getStudentDocRef(activeSchoolId, studentInfo.classId, studentId);
      await deleteDoc(studentRef);
      try {
        await deleteStudentImageFromRtdb(activeSchoolId, studentId);
      } catch (rtdbErr) {
        console.warn("Failed to delete image from Realtime Database during permanentlyDelete:", rtdbErr);
      }
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.DELETE,
      `students/${studentId}`,
    );
  }
}

export async function seedDemo(studentsList: Student[]): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    for (const student of studentsList) {
      const classId = student.classId || "";
      const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);

      let rtdbImageUrl = student.image || "";
      if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
        try {
          await saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
          rtdbImageUrl = "rtdb";
        } catch (rtdbErr) {
          console.warn("Failed to save image in Realtime Database during seedDemo:", rtdbErr);
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
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students");
  }
}

export async function batchCreate(studentsList: Student[]): Promise<void> {
  return seedDemo(studentsList);
}

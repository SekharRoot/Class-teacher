import { setDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { handleFirestoreError, OperationType, db } from "../../lib/firebase";
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
        const savedInRtdb = await saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
        if (savedInRtdb) {
          rtdbImageUrl = "rtdb";
        }
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

    const payload = { ...studentData };

    let rtdbImageUrl = payload.image;
    if (rtdbImageUrl !== undefined) {
      if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
        try {
          const savedInRtdb = await saveStudentImageInRtdb(activeSchoolId, studentId, rtdbImageUrl);
          if (savedInRtdb) {
            payload.image = "rtdb";
          }
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
    const targetClassId = payload.classId !== undefined ? payload.classId : oldClassId;

    console.log(`[studentsApi] Updating student ${studentId}. Class transition: ${oldClassId} -> ${targetClassId}`);

    if (oldClassId !== targetClassId) {
      const oldRef = getStudentDocRef(activeSchoolId, oldClassId, studentId);
      console.log(`[studentsApi] Deleting old record at: ${oldRef.path}`);
      await deleteDoc(oldRef);

      const newRef = getStudentDocRef(activeSchoolId, targetClassId, studentId);
      console.log(`[studentsApi] Creating new record at: ${newRef.path}`);

      const mergedData = {
        ...(studentInfo.data || {}),
        ...payload,
        classId: targetClassId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(newRef, mergedData);
    } else {
      const ref = getStudentDocRef(activeSchoolId, oldClassId, studentId);
      console.log(`[studentsApi] Updating existing record at: ${ref.path}`);
      await setDoc(ref, {
        ...payload,
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
    const chunks: Student[][] = [];
    
    // Chunk lists into batches of 500
    for (let i = 0; i < studentsList.length; i += 500) {
      chunks.push(studentsList.slice(i, i + 500));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      
      // Save images to RTDB in parallel before batch commit
      const imagePromises = chunk.map(async (student) => {
        let rtdbImageUrl = student.image || "";
        if (rtdbImageUrl && rtdbImageUrl.startsWith("data:image/")) {
          try {
            const savedInRtdb = await saveStudentImageInRtdb(activeSchoolId, student.id, rtdbImageUrl);
            if (savedInRtdb) return "rtdb";
          } catch (rtdbErr) {
            console.warn("Failed to save image in Realtime Database during seedDemo:", rtdbErr);
          }
        }
        return rtdbImageUrl;
      });

      const resolvedImages = await Promise.all(imagePromises);

      chunk.forEach((student, index) => {
        const classId = student.classId || "";
        const studentRef = getStudentDocRef(activeSchoolId, classId, student.id);
        const rtdbImageUrl = resolvedImages[index];

        batch.set(studentRef, {
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
      });

      await batch.commit();
    }
    clearStudentsCache();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "students");
  }
}

export async function batchCreate(studentsList: Student[]): Promise<void> {
  return seedDemo(studentsList);
}

export async function batchUpdateProfiles(
  updates: { id: string; data: Partial<Student> }[],
  onProgress?: (processed: number, total: number) => void
): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    const total = updates.length;
    if (total === 0) return;

    let processed = 0;
    const chunkSize = 500;

    for (let i = 0; i < total; i += chunkSize) {
      const chunk = updates.slice(i, i + chunkSize);
      const batch = writeBatch(db);

      for (const item of chunk) {
        const studentInfo = await findStudentClass(item.id);
        if (studentInfo) {
          const oldClassId = studentInfo.classId;
          const targetClassId = item.data.classId !== undefined ? item.data.classId : oldClassId;

          if (oldClassId !== targetClassId) {
            const oldRef = getStudentDocRef(activeSchoolId, oldClassId, item.id);
            batch.delete(oldRef);

            const newRef = getStudentDocRef(activeSchoolId, targetClassId, item.id);
            const mergedData = {
              ...(studentInfo.data || {}),
              ...item.data,
              classId: targetClassId,
              schoolId: activeSchoolId,
              updatedAt: new Date().toISOString(),
            };
            batch.set(newRef, mergedData);
          } else {
            const ref = getStudentDocRef(activeSchoolId, oldClassId, item.id);
            batch.set(
              ref,
              {
                ...item.data,
                updatedAt: new Date().toISOString(),
              },
              { merge: true }
            );
          }
        }
        processed++;
        if (onProgress) {
          onProgress(processed, total);
        }
      }

      await batch.commit();
    }

    clearStudentsCache();
  } catch (error) {
    console.error("[studentsApi] batchUpdateProfiles error:", error);
    handleFirestoreError(error, OperationType.WRITE, "students");
  }
}

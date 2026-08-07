import { Student, ClassItem } from "../types";

export function isStudentInClass(student: Student, cls: ClassItem | null | undefined): boolean {
  if (!cls) return false;
  if (!student.classId) return false;
  
  if (student.classId === cls.id) return true;
  
  const normStudentClass = student.classId.replace(/[\s\-_/]/g, '').toLowerCase();
  const normStandardSection = `${cls.classStandard}${cls.section}`.replace(/[\s\-_/]/g, '').toLowerCase();
  const normBoardStandardSection = `${cls.board}${cls.classStandard}${cls.section}`.replace(/[\s\-_/]/g, '').toLowerCase();
  const normStandardOnly = `${cls.classStandard}`.replace(/[\s\-_/]/g, '').toLowerCase();

  return (
    normStudentClass === normStandardSection ||
    normStudentClass === normBoardStandardSection ||
    normStudentClass === normStandardOnly
  );
}

export function findCorrectClassId(studentClassIdStr: string, classesList: ClassItem[]): string | null {
  if (!studentClassIdStr) return null;
  const normStudentClass = studentClassIdStr.replace(/[\s\-_/]/g, '').toLowerCase();
  
  // See if it's already a valid UUID
  const exactMatch = classesList.find(c => c.id === studentClassIdStr);
  if (exactMatch) return exactMatch.id;
  
  // Try to find the class by string matching
  const nameMatch = classesList.find(c => {
    const normStandardSection = `${c.classStandard}${c.section}`.replace(/[\s\-_/]/g, '').toLowerCase();
    const normBoardStandardSection = `${c.board}${c.classStandard}${c.section}`.replace(/[\s\-_/]/g, '').toLowerCase();
    const normStandardOnly = `${c.classStandard}`.replace(/[\s\-_/]/g, '').toLowerCase();

    return (
      normStudentClass === normStandardSection ||
      normStudentClass === normBoardStandardSection ||
      normStudentClass === normStandardOnly
    );
  });
  
  return nameMatch ? nameMatch.id : null;
}

import { studentsApi } from "../api/students";

/**
 * Scans students for invalid string-based classIds and automatically 
 * updates them to their correct class UUIDs in Firestore.
 */
export async function runClassIdMigration(studentsList: Student[], classesList: ClassItem[], setStudents?: (s: Student[]) => void): Promise<number> {
  let migratedCount = 0;
  const updates: Promise<void>[] = [];
  let updatedStudents = [...studentsList];

  for (let i = 0; i < updatedStudents.length; i++) {
    const student = updatedStudents[i];
    if (!student.classId) continue;
    
    // Check if classId is already a valid UUID
    const isValidUUID = classesList.some(c => c.id === student.classId);
    if (isValidUUID) continue;

    // Find the correct UUID using lenient matching
    const correctId = findCorrectClassId(student.classId, classesList);
    
    if (correctId && correctId !== student.classId) {
      console.log(`Migrating student ${student.firstName} ${student.lastName}: ${student.classId} -> ${correctId}`);
      updatedStudents[i] = { ...student, classId: correctId };
      updates.push(
        studentsApi.update(student.id, { ...student, classId: correctId })
      );
      migratedCount++;
    }
  }

  if (migratedCount > 0 && setStudents) {
    setStudents(updatedStudents);
  }

  if (updates.length > 0) {
    await Promise.allSettled(updates);
  }
  
  return migratedCount;
}

export function calculateMonthlyReport(payload: any): any {
  const { docs, month, classId, students } = payload;
  const reportEntries: any[] = [];
  
  const monthDocs = docs.filter((doc: any) => doc.id.startsWith(month));
  const totalWorkingDays = monthDocs.length;

  const studentIdsInDocs = new Set();
  monthDocs.forEach((doc: any) => {
    if (doc.data) {
      Object.entries(doc.data).forEach(([studentId, val]) => {
        const isObj = typeof val === "object" && val !== null;
        const recordClassId = isObj ? (val as any).classId : null;
        if (recordClassId === classId || (!recordClassId && students.find((s: any) => s.id === studentId)?.classId === classId)) {
          studentIdsInDocs.add(studentId);
        }
      });
    }
  });

  const activeClassStudents = students.filter((s: any) => s.classId === classId && s.isActive !== false);
  const activeStudentIds = new Set(activeClassStudents.map((s: any) => s.id));
  
  const allUniqueStudentIds = Array.from(new Set([...Array.from(studentIdsInDocs), ...Array.from(activeStudentIds)]));

  for (const studentId of allUniqueStudentIds) {
    const student = students.find((s: any) => s.id === studentId);
    
    let present = 0;
    let absent = 0;
    let leave = 0;
    let hasAnyRecord = false;

    for (const doc of monthDocs) {
      const val = (doc.data as any)[studentId as string];
      if (!val) continue;

      hasAnyRecord = true;
      const status = (typeof val === "object" ? (val as any).status : val || "").toLowerCase();
      if (status === "present") present++;
      else if (status === "absent") absent++;
      else if (status === "leave") { leave++; absent++; }
    }

    const isActive = student ? (student.isActive !== false) : false;
    if (!isActive && !hasAnyRecord) {
      continue;
    }

    let studentName = "";
    let rollNumber = "";
    if (student) {
      const baseName = student.firstName + " " + student.lastName;
      if (student.isActive === false) {
        studentName = baseName + " (Profile Removed)";
      } else {
        studentName = baseName;
      }
      rollNumber = student.rollNumber || "";
    } else {
      studentName = "[Profile Removed]";
      rollNumber = "-";
    }

    const totalAttended = present;
    const percentage = totalWorkingDays > 0 ? (totalAttended / totalWorkingDays) * 100 : 0;

    reportEntries.push({
      studentId: studentId as string,
      studentName: studentName,
      rollNumber: rollNumber,
      present,
      absent,
      leave,
      totalDays: totalWorkingDays,
      attendancePercentage: Math.round(percentage * 10) / 10
    });
  }

  return {
    month,
    classId,
    entries: reportEntries
  };
}

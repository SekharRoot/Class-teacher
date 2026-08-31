export function calculateMonthlyReport(payload: any): any {
  const {
    docs = [],
    month,
    classId,
    students = [],
    ignoreSundays = false,
    ignoreSaturdays = false,
    studentStatus = "active",
  } = payload;
  const reportEntries: any[] = [];
  
  const monthDocs = docs.filter((doc: any) => {
    if (!doc.id || !doc.id.startsWith(month)) return false;
    const parts = doc.id.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, monthIndex, day);
      if (ignoreSundays && d.getDay() === 0) return false;
      if (ignoreSaturdays && d.getDay() === 6) return false;
    }
    if (doc.data?.isHoliday) return false;
    return true;
  });
  const totalWorkingDays = monthDocs.length;

  const studentIdsInDocs = new Set<string>();
  monthDocs.forEach((doc: any) => {
    if (doc.data) {
      Object.entries(doc.data).forEach(([studentId, val]) => {
        const isObj = typeof val === "object" && val !== null;
        const recordClassId = isObj ? (val as any).classId : null;
        if (
          recordClassId === classId ||
          (!recordClassId && students.find((s: any) => s.id === studentId)?.classId === classId)
        ) {
          studentIdsInDocs.add(studentId);
        }
      });
    }
  });

  const classStudents = students.filter((s: any) => s.classId === classId);
  const classStudentIds = new Set<string>(classStudents.map((s: any) => s.id));
  
  const allUniqueStudentIds = Array.from(
    new Set([...Array.from(studentIdsInDocs), ...Array.from(classStudentIds)])
  );

  const [yearStr, monthStr] = (month || "").split("-");
  const yearNum = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  const monthStartIso = `${month}-01`;
  const lastDay = new Date(yearNum, monthNum, 0).getDate();
  const monthEndIso = `${month}-${String(lastDay).padStart(2, "0")}`;
  const endOfMonthIsoFull = new Date(yearNum, monthNum, 0, 23, 59, 59, 999).toISOString();

  for (const studentId of allUniqueStudentIds) {
    const student = students.find((s: any) => s.id === studentId);
    const isGloballyActive = student ? student.isActive !== false : false;
    const isRecordedInMonth = studentIdsInDocs.has(studentId);
    const belongsToThisClass = student ? student.classId === classId : false;

    // Filter by student status (active | active_entire_month | active_in_month | inactive | all)
    if (studentStatus === "active") {
      if (!isGloballyActive || !belongsToThisClass) continue;
    }
    else if (studentStatus === "active_entire_month") {
      const notDeactivatedBeforeEnd = isGloballyActive || (student?.deactivatedAt && (student.deactivatedAt > monthEndIso || student.deactivatedAt > endOfMonthIsoFull));
      if (!((belongsToThisClass || isRecordedInMonth) && notDeactivatedBeforeEnd)) continue;
    }
    else if (studentStatus === "active_in_month") {
      if (!isRecordedInMonth) {
        const activeInOrAfterMonth = isGloballyActive || (student?.deactivatedAt && student.deactivatedAt >= monthStartIso);
        if (!belongsToThisClass || !activeInOrAfterMonth) continue;
      }
    }
    else if (studentStatus === "inactive") {
      if (student?.deactivatedAt && (student.deactivatedAt > monthEndIso || student.deactivatedAt > endOfMonthIsoFull)) {
        continue; // Was active during this month
      }
      if (isGloballyActive) continue;
      const relevantInMonth = isRecordedInMonth || (belongsToThisClass && student?.deactivatedAt && student.deactivatedAt >= monthStartIso);
      if (!relevantInMonth) continue;
    }
    else if (studentStatus === "all") {
      if (!isRecordedInMonth) {
        if (!isGloballyActive && student?.deactivatedAt && student.deactivatedAt < monthStartIso) {
          continue; // Exclude ghost student
        }
        const activeInOrAfterMonth = isGloballyActive || (student?.deactivatedAt && student.deactivatedAt >= monthStartIso);
        if (!belongsToThisClass || !activeInOrAfterMonth) continue;
      }
    }

    let present = 0;
    let absent = 0;
    let leave = 0;
    let hasAnyRecord = false;

    for (const doc of monthDocs) {
      const val = (doc.data as any)?.[studentId as string];
      if (!val) continue;

      hasAnyRecord = true;
      const rawStatus = (
        typeof val === "object" ? (val as any).status : val || ""
      )
        .toString()
        .toLowerCase()
        .trim();

      if (rawStatus === "present" || rawStatus === "p") {
        present++;
      } else if (rawStatus === "absent" || rawStatus === "a") {
        absent++;
      } else if (rawStatus === "leave" || rawStatus === "l") {
        leave++;
      }
    }

    // If an inactive student has no records for this month and wasn't explicitly requested by class list
    if (!isGloballyActive && !hasAnyRecord && studentStatus !== "inactive" && studentStatus !== "all" && !classStudentIds.has(studentId)) {
      continue;
    }

    let studentName = "";
    let rollNumber = "";
    if (student) {
      const baseName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unnamed Student";
      studentName = student.isActive === false && (studentStatus === "all" || studentStatus === "active_in_month") ? `${baseName} (Inactive)` : baseName;
      rollNumber = student.rollNumber || "-";
    } else {
      studentName = "[Profile Removed]";
      rollNumber = "-";
    }

    const totalAttended = present;
    const percentage = totalWorkingDays > 0 ? (totalAttended / totalWorkingDays) * 100 : 0;

    reportEntries.push({
      studentId: studentId as string,
      studentName,
      rollNumber,
      isActive: isGloballyActive,
      present,
      absent,
      leave,
      totalDays: totalWorkingDays,
      attendancePercentage: Math.round(percentage * 10) / 10,
    });
  }

  // Sort entries: numerical roll numbers first, then alphanumeric, then alphabetical by name
  reportEntries.sort((a, b) => {
    const numA = parseInt(a.rollNumber, 10);
    const numB = parseInt(b.rollNumber, 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    const cmp = a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true });
    if (cmp !== 0) return cmp;
    return a.studentName.localeCompare(b.studentName);
  });

  return {
    month,
    classId,
    totalWorkingDays,
    entries: reportEntries,
  };
}

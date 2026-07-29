function unwrapStatus(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object" && val !== null) {
    if ("status" in val && val.status !== undefined) {
      return unwrapStatus(val.status);
    }
  }
  return String(val || "").trim();
}

export function calculateDashboardStats(payload: any): any {
  const { classes, students, authorizedClassIds, todayRecords } = payload;
  
  const filteredClasses = classes.filter((c: any) =>
    authorizedClassIds.includes(c.id)
  );
  const filteredStudents = students.filter(
    (s: any) => s.classId && authorizedClassIds.includes(s.classId) && s.isActive !== false
  );

  const classesCount = filteredClasses.length;
  const studentsCount = filteredStudents.length;

  let todayPresent = 0;
  let todayTotalMarked = 0;

  if (todayRecords) {
    Object.keys(todayRecords).forEach((studentId) => {
      const belongsToScope = filteredStudents.some((s: any) => s.id === studentId);
      if (!belongsToScope) return;

      const val = todayRecords[studentId];
      const status = unwrapStatus(val);
      if (status) {
        todayTotalMarked++;
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "present") {
          todayPresent++;
        }
      }
    });
  }

  const attendanceRate =
    todayTotalMarked > 0
      ? Math.round((todayPresent / todayTotalMarked) * 100)
      : null;

  const classStats = filteredClasses.map((cls: any) => {
    const activeClassStudents = filteredStudents.filter((s: any) => s.classId === cls.id);
    const activeStudentIds = new Set(activeClassStudents.map((s: any) => s.id));
    const loggedStudents: any[] = [];

    if (todayRecords) {
      Object.entries(todayRecords).forEach(([studentId, val]: [string, any]) => {
        if (activeStudentIds.has(studentId)) return;
        const isObj = typeof val === "object" && val !== null;
        const recordClassId = isObj ? val.classId : null;
        if (
          recordClassId === cls.id ||
          (!recordClassId && students.find((s: any) => s.id === studentId)?.classId === cls.id)
        ) {
          const found = students.find((s: any) => s.id === studentId);
          if (found) loggedStudents.push(found);
          else loggedStudents.push({ id: studentId, classId: cls.id });
        }
      });
    }

    const classStudents = [...activeClassStudents, ...loggedStudents];
    const total = classStudents.length;

    let present = 0;
    let absent = 0;
    let leave = 0;
    let marked = 0;

    classStudents.forEach((student: any) => {
      const record = todayRecords ? todayRecords[student.id] : null;
      const status = unwrapStatus(record);

      if (status) {
        marked++;
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === "present") {
          present++;
        } else if (lowerStatus === "absent") {
          absent++;
        } else if (lowerStatus === "leave") {
          leave++;
        }
      }
    });

    const rate = marked > 0 ? Math.round((present / marked) * 100) : null;

    return {
      classId: cls.id,
      className: cls.classStandard + " " + cls.section + " (" + cls.board + ")",
      totalStudents: total,
      presentCount: present,
      absentCount: absent,
      leaveCount: leave,
      markedCount: marked,
      attendanceRate: rate,
    };
  });

  return {
    stats: {
      totalClasses: classesCount,
      totalStudents: studentsCount,
      todayAttendanceRate: attendanceRate,
      todayPresentCount: todayPresent,
      todayTotalMarked: todayTotalMarked,
    },
    classStats,
  };
}

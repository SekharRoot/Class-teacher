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
      let status = "";
      if (typeof val === "object" && val !== null) {
        status = val.status || "";
      } else {
        status = String(val);
      }
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
    const classStudents = filteredStudents.filter((s: any) => s.classId === cls.id);
    const total = classStudents.length;

    let present = 0;
    let absent = 0;
    let leave = 0;
    let marked = 0;

    classStudents.forEach((student: any) => {
      const record = todayRecords ? todayRecords[student.id] : null;
      let status = "";
      if (record) {
        if (typeof record === "object" && record !== null) {
          status = record.status || "";
        } else {
          status = String(record);
        }
      }

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

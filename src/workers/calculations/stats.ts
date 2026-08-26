import { isStudentInClass } from "../../utils/classUtils";

function unwrapStatus(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val.trim();
  if (typeof val === "object" && val !== null) {
    if ("status" in val && val.status !== undefined) {
      return unwrapStatus(val.status);
    }
  }
  return "";
}

export function calculateDashboardStats(payload: any): any {
  const { classes, students, authorizedClassIds, todayRecords = {} } = payload;
  
  const filteredClasses = classes.filter((c: any) =>
    authorizedClassIds.includes(c.id)
  );

  // Maps to aggregate class-level data
  const classStatsMap = new Map();
  filteredClasses.forEach((cls: any) => {
    classStatsMap.set(cls.id, {
      classId: cls.id,
      className: `${cls.classStandard} ${cls.section} (${cls.board})`,
      totalStudents: 0,
      presentCount: 0,
      absentCount: 0,
      leaveCount: 0,
      markedCount: 0,
    });
  });

  // Filter students to active only for dashboard stats
  const activeStudents = (students || []).filter((s: any) => s.isActive !== false);

  let todayPresent = 0;
  let todayTotalMarked = 0;

  activeStudents.forEach((student: any) => {
    const matchedClass = filteredClasses.find((cls: any) => isStudentInClass(student, cls));
    if (!matchedClass) return;

    const cStats = classStatsMap.get(matchedClass.id);
    cStats.totalStudents++;

    const record = todayRecords[student.id];
    const status = unwrapStatus(record);

    if (status) {
      todayTotalMarked++;
      cStats.markedCount++;

      const lowerStatus = status.toLowerCase();
      if (lowerStatus === "present") {
        todayPresent++;
        cStats.presentCount++;
      } else if (lowerStatus === "absent") {
        cStats.absentCount++;
      } else if (lowerStatus === "leave") {
        cStats.leaveCount++;
      }
    }
  });

  // Calculate rates
  const classStats = Array.from(classStatsMap.values()).map((cStats: any) => {
    cStats.attendanceRate = cStats.markedCount > 0 
      ? Math.round((cStats.presentCount / cStats.markedCount) * 100) 
      : null;
    return cStats;
  });

  const attendanceRate =
    todayTotalMarked > 0
      ? Math.round((todayPresent / todayTotalMarked) * 100)
      : null;

  return {
    stats: {
      totalClasses: filteredClasses.length,
      totalStudents: activeStudents.length,
      actualTotalStudents: activeStudents.length,
      todayAttendanceRate: attendanceRate,
      todayPresentCount: todayPresent,
      todayTotalMarked: todayTotalMarked,
    },
    classStats,
  };
}

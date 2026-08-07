import { isStudentInClass } from "../../utils/classUtils";

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

  // Track unique students in scope for dashboard totals
  const scopeStudentIds = new Set<string>();

  let todayPresent = 0;
  let todayTotalMarked = 0;

  // We need to process each student exactly once.
  const processedStudentIds = new Set<string>();

  const processStudentRecord = (studentId: string, classId: string, studentObj: any = null) => {
    // Only process if the class is in our authorized scope
    if (!classStatsMap.has(classId)) return;
    
    const cStats = classStatsMap.get(classId);
    
    // Determine if we should count this student in the total
    if (studentObj && studentObj.isActive !== false) {
      if (!scopeStudentIds.has(studentId)) {
        scopeStudentIds.add(studentId);
        cStats.totalStudents++;
      }
    } else if (!studentObj && !scopeStudentIds.has(studentId)) {
       // A student marked today but no longer active/present in list counts for today's totals
       scopeStudentIds.add(studentId);
       cStats.totalStudents++;
    }

    // Process attendance
    const record = todayRecords[studentId];
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
  };

  // 1. First process all students that have records today
  Object.keys(todayRecords).forEach((studentId) => {
    const val = todayRecords[studentId];
    const isObj = typeof val === "object" && val !== null;
    const recordClassId = isObj ? val.classId : null;
    
    const student = students.find((s: any) => s.id === studentId);
    
    let targetClassId = null;
    
    if (recordClassId && classStatsMap.has(recordClassId)) {
      targetClassId = recordClassId;
    } else if (student) {
      const matchedClass = filteredClasses.find((cls: any) => isStudentInClass(student, cls));
      if (matchedClass) {
        targetClassId = matchedClass.id;
      }
    }

    if (targetClassId) {
      processedStudentIds.add(studentId);
      processStudentRecord(studentId, targetClassId, student);
    }
  });

  // 2. Process all remaining active students that didn't have records today
  students.forEach((student: any) => {
    if (student.isActive === false) return;
    if (processedStudentIds.has(student.id)) return;

    const matchedClass = filteredClasses.find((cls: any) => isStudentInClass(student, cls));
    if (matchedClass) {
      processedStudentIds.add(student.id);
      processStudentRecord(student.id, matchedClass.id, student);
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

  const activeTotalStudents = students.filter((s: any) => s.isActive !== false).length;

  return {
    stats: {
      totalClasses: filteredClasses.length,
      totalStudents: scopeStudentIds.size, // Assigned and calculated
      actualTotalStudents: activeTotalStudents, // Raw active count
      todayAttendanceRate: attendanceRate,
      todayPresentCount: todayPresent,
      todayTotalMarked: todayTotalMarked,
    },
    classStats,
  };
}

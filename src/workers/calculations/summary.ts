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

export function calculateSummary(payload: any): any {
  const { students, attendance, selectedClassId } = payload;
  
  const activeStudents = (students || []).filter((st: any) => 
    (!selectedClassId || st.classId === selectedClassId) && 
    st.isActive !== false
  );
  
  const activeStudentIds = new Set(activeStudents.map((st: any) => st.id));
  const loggedStudentsMap = new Map<string, any>();

  if (attendance) {
    Object.entries(attendance).forEach(([studentId, val]: [string, any]) => {
      if (activeStudentIds.has(studentId)) return;

      const isObj = typeof val === "object" && val !== null;
      const recordClassId = isObj ? val.classId : null;

      if (
        (selectedClassId && (recordClassId === selectedClassId || (!recordClassId && students.find((s: any) => s.id === studentId)?.classId === selectedClassId))) ||
        !selectedClassId
      ) {
        const foundStudent = students.find((s: any) => s.id === studentId);
        if (foundStudent) {
          loggedStudentsMap.set(studentId, foundStudent);
        } else {
          loggedStudentsMap.set(studentId, {
            id: studentId,
            classId: selectedClassId,
            boarderType: isObj ? val.boarderType || "Day Scholar" : "Day Scholar",
            isActive: false,
          });
        }
      }
    });
  }

  const classStudents = [...activeStudents, ...Array.from(loggedStudentsMap.values())];
  
  const totalCount = classStudents.length;
  const totalDayScholar = classStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const totalDayBoarder = classStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const totalFullBoarder = classStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const presentStudents = classStudents.filter((st: any) => {
    const val = attendance ? attendance[st.id] : null;
    const status = unwrapStatus(val).toLowerCase();
    return status === "present";
  });
  const presentCount = presentStudents.length;
  const presentDayScholar = presentStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const presentDayBoarder = presentStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const presentFullBoarder = presentStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const absentStudents = classStudents.filter((st: any) => {
    const val = attendance ? attendance[st.id] : null;
    const status = unwrapStatus(val).toLowerCase();
    return status === "absent";
  });
  const absentCount = absentStudents.length;
  const absentDayScholar = absentStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const absentDayBoarder = absentStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const absentFullBoarder = absentStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const leaveStudents = classStudents.filter((st: any) => {
    const val = attendance ? attendance[st.id] : null;
    const status = unwrapStatus(val).toLowerCase();
    return status === "leave";
  });
  const leaveCount = leaveStudents.length;
  const leaveDayScholar = leaveStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const leaveDayBoarder = leaveStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const leaveFullBoarder = leaveStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  return {
    totalCount, totalDayScholar, totalDayBoarder, totalFullBoarder,
    presentCount, presentDayScholar, presentDayBoarder, presentFullBoarder,
    absentCount, absentDayScholar, absentDayBoarder, absentFullBoarder,
    leaveCount, leaveDayScholar, leaveDayBoarder, leaveFullBoarder
  };
}

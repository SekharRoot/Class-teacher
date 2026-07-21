export function calculateSummary(payload: any): any {
  const { students, attendance, selectedClassId } = payload;
  const classStudents = students.filter((st: any) => 
    (!selectedClassId || st.classId === selectedClassId) && 
    st.isActive !== false
  );
  
  const totalCount = classStudents.length;
  const totalDayScholar = classStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const totalDayBoarder = classStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const totalFullBoarder = classStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const presentStudents = classStudents.filter((st: any) => {
    const val = attendance[st.id];
    const status = (typeof val === "object" && val !== null ? val.status : val || "").toLowerCase();
    return status === "present";
  });
  const presentCount = presentStudents.length;
  const presentDayScholar = presentStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const presentDayBoarder = presentStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const presentFullBoarder = presentStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const absentStudents = classStudents.filter((st: any) => {
    const val = attendance[st.id];
    const status = (typeof val === "object" && val !== null ? val.status : val || "").toLowerCase();
    return status === "absent" || status === "leave";
  });
  const absentCount = absentStudents.length;
  const absentDayScholar = absentStudents.filter((st: any) => st.boarderType === "Day Scholar").length;
  const absentDayBoarder = absentStudents.filter((st: any) => st.boarderType === "Day Boarder").length;
  const absentFullBoarder = absentStudents.filter((st: any) => st.boarderType === "Full Boarder").length;

  const leaveStudents = classStudents.filter((st: any) => {
    const val = attendance[st.id];
    const status = (typeof val === "object" && val !== null ? val.status : val || "").toLowerCase();
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

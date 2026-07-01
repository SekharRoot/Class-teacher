const fs = require("fs");
let content = fs.readFileSync("src/pages/Dashboard.tsx", "utf8");
const searchString = "  // --- RENDERING TEACHER DASHBOARD VIEW ---";
const index = content.indexOf(searchString);
if (index !== -1) {
  content = content.substring(0, index);
  const newContent =
    content +
    `  // --- RENDERING TEACHER DASHBOARD VIEW ---
  if (isTeacher) {
    return (
      <TeacherDashboard
        userProfile={userProfile}
        teacherClassInfo={teacherClassInfo}
        teacherClassStat={teacherClassStat}
        teacherLeaves={teacherLeaves}
        teacherPendingLeavesCount={teacherPendingLeavesCount}
        studentNameMap={studentNameMap}
      />
    );
  }

  // --- RENDERING OVERSIGHT DASHBOARD VIEW (Admin, Principal, Academic Coordinator) ---
  return (
    <OversightDashboard
      userProfile={userProfile}
      overallAttendanceRate={overallAttendanceRate}
      stats={stats}
      unmarkedClasses={unmarkedClasses}
      oversightPendingLeavesCount={oversightPendingLeavesCount}
      sortedClassStatsByAttendance={sortedClassStatsByAttendance}
      teacherNameForClass={teacherNameForClass}
    />
  );
}
`;
  fs.writeFileSync("src/pages/Dashboard.tsx", newContent);
  console.log("Success");
} else {
  console.log("Not found");
}

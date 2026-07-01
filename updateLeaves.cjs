const fs = require("fs");
let content = fs.readFileSync("src/pages/Leaves.tsx", "utf8");

if (!content.includes("LeaveApplyDialog")) {
  // 1. Add Imports
  content = content.replace(
    "import { leavesApi, studentsApi } from '../api';",
    "import { leavesApi, studentsApi } from '../api';\nimport { LeaveApplyDialog } from '../components/leaves/LeaveApplyDialog';\nimport { LeaveCard } from '../components/leaves/LeaveCard';",
  );
}

// 2. Replace Apply Dialog
const dialogIndex = content.indexOf("      {/* Apply Leave Dialog */}");
const dialogEndIndex = content.indexOf(
  "      {/* Custom Leave Delete Confirmation Dialog */}",
);

if (dialogIndex !== -1 && dialogEndIndex !== -1) {
  const dialogReplacement = `      {/* Apply Leave Dialog */}
      <LeaveApplyDialog
        open={openApplyDialog}
        onClose={() => setOpenApplyDialog(false)}
        onSubmit={handleApplyLeave}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        reason={reason}
        setReason={setReason}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        authorizedClassIds={authorizedClassIds}
        allClasses={allClasses}
        studentsList={studentsList}
      />

`;
  content =
    content.substring(0, dialogIndex) +
    dialogReplacement +
    content.substring(dialogEndIndex);
}

// 3. Replace Grid Cards
const gridStart = "{filteredLeaves.map((leave) => {";
const gridEndIndex = content.indexOf("        </Grid>\n      )}");

if (gridStart !== -1 && gridEndIndex !== -1) {
  const gridStartIndex = content.indexOf(gridStart);
  if (gridStartIndex !== -1) {
    const gridReplacement = `{filteredLeaves.map((leave) => {
            const student = studentsList.find(s => s.id === leave.studentId);
            const cls = allClasses.find(c => c.id === leave.classId);
            return (
              <LeaveCard
                key={leave.id}
                leave={leave}
                student={student}
                cls={cls}
                isReadOnly={isReadOnly}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteRequest}
                getStatusChipColor={getStatusChipColor}
                getStatusIcon={getStatusIcon}
              />
            );
          })}`;
    content =
      content.substring(0, gridStartIndex) +
      gridReplacement +
      content.substring(gridEndIndex);
  }
}

fs.writeFileSync("src/pages/Leaves.tsx", content);
console.log("Leaves Update Success");

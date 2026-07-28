import re

with open("src/pages/Attendance.tsx", "r") as f:
    content = f.read()

start_marker = "  const { userProfile } = useAuth();"
end_marker = "  return ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

extracted = content[start_idx:end_idx]

hook_code = f"""import {{ useState, useEffect, useCallback }} from "react";
import {{ useAuth }} from "../contexts/AuthContext";
import {{ useHierarchyScope }} from "../hooks/useHierarchyScope";
import {{ useAttendanceData }} from "../hooks/useAttendanceData";
import {{ useAttendanceActions }} from "../hooks/useAttendanceActions";

export const useAttendanceLogic = (showToast: (msg: string, severity?: "success" | "error" | "warning" | "info") => void) => {{
{extracted}
  
  return {{
    userProfile,
    authorizedClassIds,
    hierarchyReadOnly,
    allowEditOldAttendance,
    viewMode, setViewMode,
    selectedClassId, setSelectedClassId,
    selectedDate, setSelectedDate,
    openDialog, setOpenDialog,
    editingRecord, setEditingRecord,
    students,
    classes,
    leaves,
    history,
    loading,
    offlineMode,
    isSyncing,
    handleSaveRecord,
    handleConfirmDelete,
    todayAttendance,
    stats,
    handleSaveRow,
    handleToggleHoliday,
    handleBulkMarkAll
  }};
}};
"""

with open("src/hooks/useAttendanceLogic.ts", "w") as f:
    f.write(hook_code)

replacement = """  const {
    userProfile,
    authorizedClassIds,
    hierarchyReadOnly,
    allowEditOldAttendance,
    viewMode, setViewMode,
    selectedClassId, setSelectedClassId,
    selectedDate, setSelectedDate,
    openDialog, setOpenDialog,
    editingRecord, setEditingRecord,
    students,
    classes,
    leaves,
    history,
    loading,
    offlineMode,
    isSyncing,
    handleSaveRecord,
    handleConfirmDelete,
    todayAttendance,
    stats,
    handleSaveRow,
    handleToggleHoliday,
    handleBulkMarkAll
  } = useAttendanceLogic(showToast);

"""
new_content = content[:start_idx] + replacement + content[end_idx:]
import_stmt = 'import { useAttendanceLogic } from "../hooks/useAttendanceLogic";\n'
new_content = import_stmt + new_content

with open("src/pages/Attendance.tsx", "w") as f:
    f.write(new_content)

print("Done")

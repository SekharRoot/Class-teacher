import re

with open("src/pages/Classes.tsx", "r") as f:
    content = f.read()

start_marker = "  const { userProfile } = useAuth();"
end_marker = "  return ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

extracted = content[start_idx:end_idx]

hook_code = f"""import {{ useState, useEffect }} from "react";
import {{ classesApi, studentsApi, schoolsApi }} from "../api";
import {{ ClassItem, School }} from "../types";
import {{ useClassesData }} from "../hooks/useClassesData";
import {{ useAuth }} from "../contexts/AuthContext";
import {{ useHierarchyScope }} from "../hooks/useHierarchyScope";

export const useClassesLogic = () => {{
{extracted}
  
  return {{
    userProfile,
    authorizedClassIds,
    hierarchyReadOnly,
    toastMessage,
    toastSeverity,
    showToast,
    transferSchoolDialogOpen, setTransferSchoolDialogOpen,
    schoolsList, setSchoolsList,
    classToTransfer, setClassToTransfer,
    isOwnerOrSuperAdmin,
    handleTransferClass,
    handleConfirmDelete,
    openDialog, setOpenDialog,
    openDeleteDialog, setOpenDeleteDialog,
    openDetailDialog, setOpenDetailDialog,
    openStudentDialog, setOpenStudentDialog,
    selectedClass, setSelectedClass,
    editingClass, setEditingClass,
    selectedStudent, setSelectedStudent,
    searchQuery, setSearchQuery,
    boardFilter, setBoardFilter,
    loading,
    classesList,
    studentsList,
    offlineMode,
    fetchClasses,
    filteredClasses,
    uniqueBoards,
    handleOpenEditDialog,
    handleOpenDetail,
    handleSaveClass
  }};
}};
"""

with open("src/hooks/useClassesLogic.ts", "w") as f:
    f.write(hook_code)

replacement = """  const {
    userProfile,
    authorizedClassIds,
    hierarchyReadOnly,
    toastMessage,
    toastSeverity,
    showToast,
    transferSchoolDialogOpen, setTransferSchoolDialogOpen,
    schoolsList, setSchoolsList,
    classToTransfer, setClassToTransfer,
    isOwnerOrSuperAdmin,
    handleTransferClass,
    handleConfirmDelete,
    openDialog, setOpenDialog,
    openDeleteDialog, setOpenDeleteDialog,
    openDetailDialog, setOpenDetailDialog,
    openStudentDialog, setOpenStudentDialog,
    selectedClass, setSelectedClass,
    editingClass, setEditingClass,
    selectedStudent, setSelectedStudent,
    searchQuery, setSearchQuery,
    boardFilter, setBoardFilter,
    loading,
    classesList,
    studentsList,
    offlineMode,
    fetchClasses,
    filteredClasses,
    uniqueBoards,
    handleOpenEditDialog,
    handleOpenDetail,
    handleSaveClass
  } = useClassesLogic();

"""
new_content = content[:start_idx] + replacement + content[end_idx:]
import_stmt = 'import { useClassesLogic } from "../hooks/useClassesLogic";\n'
new_content = import_stmt + new_content

with open("src/pages/Classes.tsx", "w") as f:
    f.write(new_content)

print("Done")

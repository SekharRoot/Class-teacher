import { useState, useEffect } from "react";
import { ClassItem, Student } from "../types";
import { useData } from "../contexts/DataContext";

export function useClassesData(
  showToast: (
    msg: string,
    sev?: "success" | "error" | "warning" | "info",
  ) => void,
) {
  const {
    classes: classesList,
    setClasses: setClassesList,
    students: studentsList,
    setStudents: setStudentsList,
    loading,
    setLoading,
    offlineMode,
    fetchInitialData: fetchClasses,
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [classToDelete, setClassToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return {
    classesList,
    setClassesList,
    studentsList,
    setStudentsList,
    loading,
    setLoading,
    offlineMode,
    searchQuery,
    setSearchQuery,
    openDialog,
    setOpenDialog,
    editingClass,
    setEditingClass,
    selectedClass,
    setSelectedClass,
    openDetailDialog,
    setOpenDetailDialog,
    selectedStudent,
    setSelectedStudent,
    classToDelete,
    setClassToDelete,
    fetchClasses,
  };
}

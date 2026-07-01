import { useState, useEffect } from "react";
import { Student, ClassItem } from "../types";
import { useData } from "../contexts/DataContext";

export function useProfilesData(
  showToast: (
    msg: string,
    sev?: "success" | "error" | "warning" | "info",
  ) => void,
) {
  const {
    students,
    setStudents,
    classes,
    setClasses,
    loading,
    setLoading,
    offlineMode,
    fetchInitialData,
  } = useData();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  return {
    students,
    setStudents,
    classes,
    setClasses,
    loading,
    setLoading,
    offlineMode,
    searchQuery,
    setSearchQuery,
    classFilter,
    setClassFilter,
    openDialog,
    setOpenDialog,
    openDetailDialog,
    setOpenDetailDialog,
    selectedStudent,
    setSelectedStudent,
    editingStudent,
    setEditingStudent,
    fetchInitialData,
  };
}

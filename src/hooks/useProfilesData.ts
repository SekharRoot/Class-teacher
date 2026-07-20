import { useState, useCallback } from "react";
import { Student } from "../types";
import { useData } from "../contexts/DataContext";

export function useProfilesData(
  showToast: (
    msg: string,
    sev?: "success" | "error" | "warning" | "info"
  ) => void
) {
  const {
    classes,
    setClasses,
    offlineMode,
    students,
    setStudents,
    loading,
    setLoading,
    fetchInitialData: globalFetchInitialData,
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      await globalFetchInitialData();
    } catch (err) {
      console.error("Failed to load initial profiles", err);
      showToast("Could not synchronize profiles. Displaying cached data.", "warning");
    }
  }, [globalFetchInitialData, showToast]);

  const loadMore = useCallback(async () => {
    // No-op since we load everything in the global context
  }, []);

  const hasMore = false;

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
    loadMore,
    hasMore,
  };
}

import { useState, useCallback, useMemo } from "react";
import { Student } from "../types";
import { studentsApi } from "../api";
import { cache } from "../lib/cache";

export const useProfileActions = (
  students: Student[],
  setStudents: (s: Student[]) => void,
  offlineMode: boolean,
  showToast: (msg: string, sev: any) => void,
  fetchInitialData: () => void
) => {
  const [isMassDeleting, setIsMassDeleting] = useState(false);

  const handleSaveProfileAsync = useCallback(async (
    formData: any,
    editingStudent: Student | null,
    setOpenDialog: (o: boolean) => void,
    setEditingStudent: (s: Student | null) => void
  ): Promise<boolean> => {
    const nameParts = formData.studentName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || ".";
    const studentId = editingStudent?.id || `std_${Date.now()}`;
    const generatedProfileId =
      formData.profileId?.trim() ||
      `PRFL-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        Math.random() * 1000
      )
        .toString(16)
        .toUpperCase()}`;

    const savedStudent: Student = {
      id: studentId,
      profileId: generatedProfileId,
      firstName,
      lastName,
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      classId: formData.classId,
      gender: formData.gender,
      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      boarderType: formData.boarderType,
      image: formData.imageUrl,
    };

    let updatedList = [...students];
    if (editingStudent) {
      updatedList = updatedList.map((s) =>
        s.id === studentId ? savedStudent : s
      );
    } else {
      updatedList.push(savedStudent);
    }

    updatedList.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setStudents(updatedList);
    cache.set("offline_students", updatedList);

    if (offlineMode) {
      showToast(`Profile for "${formData.studentName}" saved offline!`, "success");
      setOpenDialog(false);
      setEditingStudent(null);
      return true;
    }

    showToast("Uploaded!", "success");
    setOpenDialog(false);
    setEditingStudent(null);

    studentsApi
      .create(savedStudent)
      .then(() => {
        fetchInitialData();
      })
      .catch((err: any) => {
        console.error("Error saving student profile in background:", err);
        showToast("Saved to offline cache. Synchronization failed.", "warning");
      });

    return true;
  }, [students, offlineMode, setStudents, showToast, fetchInitialData]);

  const handleConfirmDeleteStudent = useCallback(async (
    studentToDelete: { id: string; name: string } | null,
    setDeleteDialogOpen: (o: boolean) => void,
    setStudentToDelete: (s: any) => void
  ) => {
    if (!studentToDelete) return;
    const { id: studentId, name } = studentToDelete;
    const originalStudents = [...students];
    setDeleteDialogOpen(false);

    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    cache.set("offline_students", updatedList);
    setStudentToDelete(null);

    if (offlineMode) {
      showToast("Profile deleted from offline cache.", "info");
      return;
    }

    try {
      await studentsApi.delete(studentId);
      showToast(`Profile for "${name}" deleted successfully!`, "success");
      fetchInitialData();
    } catch (err) {
      console.error(err);
      showToast("Could not remove from cloud database. Reverting.", "error");
      setStudents(originalStudents);
      fetchInitialData();
    }
  }, [students, offlineMode, setStudents, showToast, fetchInitialData]);

  const handleMassDelete = useCallback(async (
    selectedIds: string[],
    setSelectedIds: (ids: string[]) => void
  ) => {
    if (selectedIds.length === 0) return;

    setIsMassDeleting(true);
    const idsToDelete = [...selectedIds];
    const originalStudents = [...students];

    const updatedList = students.filter((s) => !idsToDelete.includes(s.id));
    setStudents(updatedList);
    cache.set("offline_students", updatedList);
    setSelectedIds([]);

    if (!offlineMode) {
      try {
        if ((studentsApi as any).batchDelete) {
          await (studentsApi as any).batchDelete(idsToDelete);
        } else {
          for (const id of idsToDelete) {
            await studentsApi.delete(id);
          }
        }
        showToast(`Deleted ${idsToDelete.length} profiles successfully!`, "success");
        fetchInitialData();
      } catch (error) {
        console.error("Mass delete error", error);
        showToast("Mass deletion failed. Reverting...", "error");
        setStudents(originalStudents);
      }
    } else {
      showToast(`Deleted ${idsToDelete.length} profiles from offline cache.`, "info");
    }
    setIsMassDeleting(false);
  }, [students, offlineMode, setStudents, showToast, fetchInitialData]);

  return useMemo(() => ({
    isMassDeleting,
    handleSaveProfileAsync,
    handleConfirmDeleteStudent,
    handleMassDelete,
  }), [isMassDeleting, handleSaveProfileAsync, handleConfirmDeleteStudent, handleMassDelete]);
};

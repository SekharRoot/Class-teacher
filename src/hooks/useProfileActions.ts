import { useState, useCallback, useMemo } from "react";
import { Student } from "../types";
import { studentsApi } from "../api";
import { cache } from "../lib/cache";
import { studentCache } from "../utils/studentCache";
import { studentSyncManager } from "../utils/studentSyncManager";
import { useData } from "../contexts/DataContext";

export const useProfileActions = (
  students: Student[],
  setStudents: (s: Student[]) => void,
  offlineMode: boolean,
  showToast: (msg: string, sev: any) => void,
  fetchInitialData: () => void
) => {
  const [isMassDeleting, setIsMassDeleting] = useState(false);
  const { setStudents: setGlobalStudents } = useData();

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

    // Update locally first to make the UI update instantly
    let updatedList = [...students];
    if (editingStudent) {
      updatedList = students.map((s) => (s.id === studentId ? savedStudent : s));
    } else {
      updatedList.push(savedStudent);
    }

    updatedList.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setStudents(updatedList);

    // Update global state as well so other views (like Attendance page) are immediately in sync
    setGlobalStudents((prev) => {
      let updatedGlobal = [...prev];
      if (editingStudent) {
        updatedGlobal = prev.map((s) => (s.id === studentId ? savedStudent : s));
      } else {
        updatedGlobal.push(savedStudent);
      }
      return updatedGlobal;
    });

    // Update the FULL offline list in cache instead of overwriting with the filtered local list
    const fullCachedStudents: Student[] = (await cache.get("offline_students")) || [];
    let updatedFullList = [...fullCachedStudents];
    if (editingStudent) {
      updatedFullList = fullCachedStudents.map((s) => (s.id === studentId ? savedStudent : s));
    } else {
      updatedFullList.push(savedStudent);
    }
    await cache.set("offline_students", updatedFullList);
    await studentCache.setBatch([savedStudent]);

    setOpenDialog(false);
    setEditingStudent(null);

    if (offlineMode) {
      // Add to offline queue
      await studentSyncManager.addOfflineChange(
        editingStudent ? "update" : "create",
        studentId,
        savedStudent
      );
      showToast(
        editingStudent
          ? `Profile for "${formData.studentName}" updated offline (pending sync)!`
          : `Profile for "${formData.studentName}" saved offline (pending sync)!`,
        "info"
      );
      // Fire global event to notify components that queue size has changed
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
      return true;
    }

    // Attempt direct server upload
    try {
      if (editingStudent) {
        await studentsApi.update(studentId, savedStudent);
        showToast(`Profile for "${formData.studentName}" updated successfully!`, "success");
      } else {
        await studentsApi.create(savedStudent);
        showToast(`Profile for "${formData.studentName}" created successfully!`, "success");
      }
      fetchInitialData();
    } catch (err: any) {
      console.error("Server save failed, queueing offline change:", err);
      await studentSyncManager.addOfflineChange(
        editingStudent ? "update" : "create",
        studentId,
        savedStudent
      );
      showToast(`Saved to offline cache. Synchronization pending.`, "warning");
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
    }

    return true;
  }, [students, offlineMode, setStudents, setGlobalStudents, showToast, fetchInitialData]);

  const handleConfirmDeleteStudent = useCallback(async (
    studentToDelete: { id: string; name: string } | null,
    setDeleteDialogOpen: (o: boolean) => void,
    setStudentToDelete: (s: any) => void
  ) => {
    if (!studentToDelete) return;
    const { id: studentId, name } = studentToDelete;
    setDeleteDialogOpen(false);

    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);

    // Update global state
    setGlobalStudents((prev) => prev.filter((s) => s.id !== studentId));

    // Update the FULL offline list in cache
    const fullCachedStudents: Student[] = (await cache.get("offline_students")) || [];
    const updatedFullList = fullCachedStudents.filter((s) => s.id !== studentId);
    await cache.set("offline_students", updatedFullList);

    await studentCache.deleteBatch([studentId]);
    setStudentToDelete(null);

    if (offlineMode) {
      await studentSyncManager.addOfflineChange("delete", studentId, { id: studentId } as Student);
      showToast(`Profile for "${name}" deleted from local cache (pending sync).`, "info");
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
      return;
    }

    try {
      await studentsApi.delete(studentId);
      showToast(`Profile for "${name}" deleted successfully!`, "success");
      fetchInitialData();
    } catch (err) {
      console.error("Server delete failed, queueing offline delete:", err);
      await studentSyncManager.addOfflineChange("delete", studentId, { id: studentId } as Student);
      showToast(`Profile deleted locally. Synchronization pending.`, "warning");
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
    }
  }, [students, offlineMode, setStudents, setGlobalStudents, showToast, fetchInitialData]);

  const handleMassDelete = useCallback(async (
    selectedIds: string[],
    setSelectedIds: (ids: string[]) => void
  ) => {
    if (selectedIds.length === 0) return;

    setIsMassDeleting(true);
    const idsToDelete = [...selectedIds];

    const updatedList = students.filter((s) => !idsToDelete.includes(s.id));
    setStudents(updatedList);

    // Update global state
    setGlobalStudents((prev) => prev.filter((s) => !idsToDelete.includes(s.id)));

    // Update the FULL offline list in cache
    const fullCachedStudents: Student[] = (await cache.get("offline_students")) || [];
    const updatedFullList = fullCachedStudents.filter((s) => !idsToDelete.includes(s.id));
    await cache.set("offline_students", updatedFullList);

    await studentCache.deleteBatch(idsToDelete);
    setSelectedIds([]);

    if (offlineMode) {
      for (const id of idsToDelete) {
        await studentSyncManager.addOfflineChange("delete", id, { id } as Student);
      }
      showToast(`Deleted ${idsToDelete.length} profiles from offline cache (pending sync).`, "info");
      setIsMassDeleting(false);
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
      return;
    }

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
      console.error("Mass delete server error, queueing offline:", error);
      for (const id of idsToDelete) {
        await studentSyncManager.addOfflineChange("delete", id, { id } as Student);
      }
      showToast(`Deleted ${idsToDelete.length} profiles locally. Synchronization pending.`, "warning");
      window.dispatchEvent(new CustomEvent("offline-queue-changed"));
    }
    setIsMassDeleting(false);
  }, [students, offlineMode, setStudents, setGlobalStudents, showToast, fetchInitialData]);

  return useMemo(() => ({
    isMassDeleting,
    handleSaveProfileAsync,
    handleConfirmDeleteStudent,
    handleMassDelete,
  }), [isMassDeleting, handleSaveProfileAsync, handleConfirmDeleteStudent, handleMassDelete]);
};

import { useState, useCallback } from "react";
import { School, UserProfile } from "../types";
import { schoolsApi, usersApi } from "../api";

interface UseAdminSchoolsProps {
  setLoading: (l: boolean) => void;
  setError: (e: string) => void;
  setSuccess: (s: string) => void;
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

export function useAdminSchools({
  setLoading,
  setError,
  setSuccess,
  setUsers,
}: UseAdminSchoolsProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [addSchoolName, setAddSchoolName] = useState("");
  const [newSchoolAddress, setNewSchoolAddress] = useState("");
  const [deleteSchoolConfirmOpen, setDeleteSchoolConfirmOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  // User school transfer states
  const [transferUserDialogOpen, setTransferUserDialogOpen] = useState(false);
  const [userToTransfer, setUserToTransfer] = useState<UserProfile | null>(null);

  const handleAddSchool = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSchoolName.trim()) {
      setError("School name cannot be empty.");
      return;
    }
    try {
      setSchoolsLoading(true);
      setError("");
      const newSch = await schoolsApi.addSchool(
        addSchoolName.trim(),
        newSchoolAddress.trim()
      );
      setSchools((prev) =>
        [...prev, newSch].sort((a, b) => a.name.localeCompare(b.name))
      );
      setAddSchoolName("");
      setNewSchoolAddress("");
      setSuccess("School added successfully!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to add school: " + err.message);
    } finally {
      setSchoolsLoading(false);
    }
  }, [addSchoolName, newSchoolAddress, setError, setSuccess]);

  const handleOpenDeleteSchool = useCallback((school: School) => {
    setSchoolToDelete(school);
    setDeleteSchoolConfirmOpen(true);
  }, []);

  const handleConfirmDeleteSchool = useCallback(async () => {
    if (!schoolToDelete) return;
    try {
      setSchoolsLoading(true);
      setError("");
      await schoolsApi.updateSchool(schoolToDelete.id, { isActive: false });
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolToDelete.id ? { ...s, isActive: false } : s))
      );
      setSuccess(`School "${schoolToDelete.name}" marked as inactive successfully!`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to mark school inactive: " + err.message);
    } finally {
      setSchoolsLoading(false);
      setDeleteSchoolConfirmOpen(false);
      setSchoolToDelete(null);
    }
  }, [schoolToDelete, setError, setSuccess]);

  const handleToggleSchoolActive = useCallback(async (schoolId: string, currentStatus: boolean) => {
    try {
      setSchoolsLoading(true);
      setError("");
      const newStatus = !currentStatus;
      await schoolsApi.updateSchool(schoolId, { isActive: newStatus });
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolId ? { ...s, isActive: newStatus } : s))
      );
      setSuccess(`School active state updated! Now set to: ${newStatus ? "Active" : "Inactive"}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to update school state: " + err.message);
    } finally {
      setSchoolsLoading(false);
    }
  }, [setError, setSuccess]);

  const handleTransferUserSchool = useCallback(async (targetSchoolId: string, targetSchoolName: string) => {
    if (!userToTransfer) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const updatedProfile: Partial<UserProfile> = {
        schoolId: targetSchoolId,
        schoolName: targetSchoolName,
      };

      await usersApi.saveProfile(userToTransfer.uid, updatedProfile);
      
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === userToTransfer.uid
            ? { ...u, schoolId: targetSchoolId, schoolName: targetSchoolName }
            : u
        )
      );

      setSuccess(
        `User "${userToTransfer.displayName || userToTransfer.email}" successfully transferred to "${targetSchoolName}".`
      );
      setTransferUserDialogOpen(false);
      setUserToTransfer(null);
    } catch (err: any) {
      console.error("Failed to transfer user to school", err);
      setError("Failed to transfer user: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [userToTransfer, setError, setSuccess, setLoading, setUsers]);

  return {
    schools,
    setSchools,
    schoolsLoading,
    setSchoolsLoading,
    addSchoolName,
    setAddSchoolName,
    newSchoolAddress,
    setNewSchoolAddress,
    deleteSchoolConfirmOpen,
    setDeleteSchoolConfirmOpen,
    schoolToDelete,
    handleAddSchool,
    handleOpenDeleteSchool,
    handleConfirmDeleteSchool,
    handleToggleSchoolActive,
    handleTransferUserSchool,
    transferUserDialogOpen,
    setTransferUserDialogOpen,
    userToTransfer,
    setUserToTransfer,
  };
}

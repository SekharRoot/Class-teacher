import { useState, useCallback } from "react";
import { UserProfile, UserRole, ClassItem } from "../types";
import { usersApi, classesApi } from "../api";

interface UseAdminUsersProps {
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  userProfile: UserProfile | null;
  setLoading: (l: boolean) => void;
  setError: (e: string) => void;
  setSuccess: (s: string) => void;
  loadData: () => Promise<void>;
}

export function useAdminUsers({
  users,
  setUsers,
  classes,
  setClasses,
  userProfile,
  setLoading,
  setError,
  setSuccess,
  loadData,
}: UseAdminUsersProps) {
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form states for editing
  const [formRole, setFormRole] = useState<UserRole>("class_teacher");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formAssignedClassId, setFormAssignedClassId] = useState<string>("");
  const [formAssignedClassId2, setFormAssignedClassId2] = useState<string>("");
  const [formCoordinatorIds, setFormCoordinatorIds] = useState<string[]>([]);
  const [formPrincipalId, setFormPrincipalId] = useState<string>("");
  const [formHasLeaveFeatureAccess, setFormHasLeaveFeatureAccess] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<"active" | "pending">("active");
  const [formSchoolId, setFormSchoolId] = useState<string>("default_school");
  const [formSchoolName, setFormSchoolName] = useState<string>("Default School");

  // Create User dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("class_teacher");
  const [newHasLeaveFeatureAccess, setNewHasLeaveFeatureAccess] = useState<boolean>(false);
  const [newSchoolId, setNewSchoolId] = useState<string>("default_school");
  const [newSchoolName, setNewSchoolName] = useState<string>("Default School");

  // Deletion states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [deleteStep, setDeleteStep] = useState(1);

  // Collapse states for Hierarchy view
  const [openPrincipal, setOpenPrincipal] = useState<Record<string, boolean>>({});
  const [openCoordinator, setOpenCoordinator] = useState<Record<string, boolean>>({});

  const handleOpenEditDialog = useCallback((user: UserProfile) => {
    setSelectedUser(user);
    setFormRole(user.role);
    setFormDisplayName(user.displayName || "");
    setFormAssignedClassId(user.assignedClassId || "");
    setFormAssignedClassId2(user.assignedClassId2 || "");
    setFormCoordinatorIds(
      user.coordinatorIds || (user.coordinatorId ? [user.coordinatorId] : [])
    );
    setFormPrincipalId(user.principalId || "");
    setFormHasLeaveFeatureAccess(user.hasLeaveFeatureAccess || false);
    setFormStatus(user.status || "active");
    setFormSchoolId(user.schoolId || "default_school");
    setFormSchoolName(user.schoolName || "Default School");
    setEditDialogOpen(true);
  }, []);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSaveUser = useCallback(async () => {
    if (!selectedUser) return;
    const uid = selectedUser.uid;
    const email = selectedUser.email;
    const originalUsers = [...users];

    setError("");
    setSuccess("");
    const updatedData: Partial<UserProfile> = {
      role: formRole,
      displayName: formDisplayName,
      assignedClassId: formRole === "class_teacher" ? formAssignedClassId || null : null,
      assignedClassId2: formRole === "class_teacher" ? formAssignedClassId2 || null : null,
      coordinatorIds: formRole === "class_teacher" ? formCoordinatorIds : [],
      coordinatorId: null,
      principalId: formRole === "academic_coordinator" ? formPrincipalId || null : null,
      hasLeaveFeatureAccess: formHasLeaveFeatureAccess,
      status: formStatus,
      schoolId: formSchoolId,
      schoolName: formSchoolName,
    };

    const updatedUsers = users.map((u) =>
      u.uid === uid ? { ...u, ...updatedData } : u
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${email} successfully updated.`);
    handleCloseEditDialog();

    try {
      await usersApi.saveProfile(uid, updatedData);
      const [fetchedUsers, fetchedClasses] = await Promise.all([
        usersApi.getAll(),
        classesApi.getAll(),
      ]);
      setUsers(fetchedUsers);
      setClasses(fetchedClasses);
    } catch (err: any) {
      setError("Failed to sync updated user to server: " + err.message);
      setUsers(originalUsers);
    }
  }, [
    selectedUser,
    users,
    formRole,
    formDisplayName,
    formAssignedClassId,
    formAssignedClassId2,
    formCoordinatorIds,
    formPrincipalId,
    formHasLeaveFeatureAccess,
    formStatus,
    formSchoolId,
    formSchoolName,
    setError,
    setSuccess,
    handleCloseEditDialog,
    setUsers,
    setClasses,
  ]);

  const handleOpenDeleteConfirm = useCallback((uid: string, email: string | null) => {
    const userToDel = users.find((u) => u.uid === uid);
    if (userToDel?.role === "owner" || email === "sekhar.root@gmail.com") {
      setError("The Primary Owner account cannot be deleted or removed.");
      return;
    }
    setUserToDelete({ uid, email });
    setDeleteStep(1);
    setDeleteConfirmOpen(true);
  }, [users, setError]);

  const handleConfirmDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    const { uid, email } = userToDelete;
    const originalUsers = [...users];

    setDeleteConfirmOpen(false);
    setUserToDelete(null);

    const updatedUsers = users.filter((u) => u.uid !== uid);
    setUsers(updatedUsers);
    setSuccess(`User profile for ${email || "this user"} successfully removed.`);

    try {
      await usersApi.deleteProfile(uid);
      const [fetchedUsers, fetchedClasses] = await Promise.all([
        usersApi.getAll(),
        classesApi.getAll(),
      ]);
      setUsers(fetchedUsers);
      setClasses(fetchedClasses);
    } catch (err: any) {
      setError("Failed to sync user removal to server: " + err.message);
      setUsers(originalUsers);
    }
  }, [userToDelete, users, setError, setSuccess, setUsers, setClasses]);

  const handleApproveUser = useCallback(async (user: UserProfile) => {
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    const updatedUsers = users.map((u) =>
      u.uid === user.uid ? { ...u, status: "active" as const } : u
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${user.email} approved successfully.`);

    try {
      await usersApi.saveProfile(user.uid, { status: "active" });
      const [fetchedUsers, fetchedClasses] = await Promise.all([
        usersApi.getAll(),
        classesApi.getAll(),
      ]);
      setUsers(fetchedUsers);
      setClasses(fetchedClasses);
    } catch (err: any) {
      setError("Failed to sync updated user to server: " + err.message);
      setUsers(originalUsers);
    }
  }, [users, setError, setSuccess, setUsers, setClasses]);

  const handleOpenCreateDialog = useCallback(() => {
    setNewEmail("");
    setNewDisplayName("");
    setNewRole("class_teacher");
    setNewPassword("123456");
    setNewHasLeaveFeatureAccess(false);
    setNewSchoolId(userProfile?.schoolId || "default_school");
    setNewSchoolName(userProfile?.schoolName || "Default School");
    setCreateDialogOpen(true);
  }, [userProfile]);

  const handleCreateUser = useCallback(async () => {
    if (!newEmail) {
      setError("Email is required");
      return;
    }
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    const simulatedUid = "pre_" + Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      uid: simulatedUid,
      email: newEmail.trim().toLowerCase(),
      displayName: newDisplayName || newEmail.split("@")[0],
      role: newRole,
      status: "pending",
      assignedClassId: null,
      coordinatorIds: [],
      coordinatorId: null,
      principalId: null,
      hasLeaveFeatureAccess: newHasLeaveFeatureAccess,
      schoolId: newSchoolId,
      schoolName: newSchoolName,
    };

    setUsers([...users, newProfile]);
    setSuccess(`User record pre-configured for ${newEmail}. When they sign in, they will receive this role.`);
    setCreateDialogOpen(false);

    try {
      await usersApi.saveProfile(simulatedUid, newProfile);
      const [fetchedUsers, fetchedClasses] = await Promise.all([
        usersApi.getAll(),
        classesApi.getAll(),
      ]);
      setUsers(fetchedUsers);
      setClasses(fetchedClasses);
    } catch (err: any) {
      setError("Failed to configure user account on server: " + err.message);
      setUsers(originalUsers);
    }
  }, [
    newEmail,
    newDisplayName,
    newRole,
    newHasLeaveFeatureAccess,
    newSchoolId,
    newSchoolName,
    users,
    setError,
    setSuccess,
    setUsers,
    setClasses,
  ]);

  const handleSeedDemoUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const classIds = classes.map((c) => c.id);
      await usersApi.seedDemoUsers(classIds);
      setSuccess(
        "Standard demo roles and hierarchy successfully configured! Logins initialized: admin@classroom.com, principal@classroom.com, coord1@classroom.com, teacher1@classroom.com (password: 123456)."
      );
      await loadData();
    } catch (err: any) {
      setError("Failed to seed demo users: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [classes, loadData, setError, setSuccess, setLoading]);

  const togglePrincipalCollapse = useCallback((uid: string) => {
    setOpenPrincipal((prev) => ({ ...prev, [uid]: !prev[uid] }));
  }, []);

  const toggleCoordinatorCollapse = useCallback((uid: string) => {
    setOpenCoordinator((prev) => ({ ...prev, [uid]: !prev[uid] }));
  }, []);

  return {
    editDialogOpen,
    setEditDialogOpen,
    selectedUser,
    formRole,
    setFormRole,
    formDisplayName,
    setFormDisplayName,
    formAssignedClassId,
    setFormAssignedClassId,
    formAssignedClassId2,
    setFormAssignedClassId2,
    formCoordinatorIds,
    setFormCoordinatorIds,
    formPrincipalId,
    setFormPrincipalId,
    formHasLeaveFeatureAccess,
    setFormHasLeaveFeatureAccess,
    formStatus,
    setFormStatus,
    formSchoolId,
    setFormSchoolId,
    formSchoolName,
    setFormSchoolName,
    createDialogOpen,
    setCreateDialogOpen,
    newEmail,
    setNewEmail,
    newPassword,
    newDisplayName,
    setNewDisplayName,
    newRole,
    setNewRole,
    newHasLeaveFeatureAccess,
    setNewHasLeaveFeatureAccess,
    newSchoolId,
    setNewSchoolId,
    newSchoolName,
    setNewSchoolName,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    userToDelete,
    deleteStep,
    setDeleteStep,
    openPrincipal,
    openCoordinator,
    handleOpenEditDialog,
    handleCloseEditDialog,
    handleSaveUser,
    handleOpenDeleteConfirm,
    handleConfirmDeleteUser,
    handleApproveUser,
    handleOpenCreateDialog,
    handleCreateUser,
    handleSeedDemoUsers,
    togglePrincipalCollapse,
    toggleCoordinatorCollapse,
  };
}

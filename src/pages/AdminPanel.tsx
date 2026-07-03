import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "../contexts/AuthContext";
import { classesApi, usersApi } from "../api";
import { UserProfile, UserRole, ClassItem } from "../types";
import { cache } from "../lib/cache";
import { RolesTable } from "../components/admin/RolesTable";
import { HierarchyTree } from "../components/admin/HierarchyTree";

export default function AdminPanel() {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Form states for editing
  const [formRole, setFormRole] = useState<UserRole>("class_teacher");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formAssignedClassId, setFormAssignedClassId] = useState<string>("");
  const [formCoordinatorId, setFormCoordinatorId] = useState<string>("");
  const [formPrincipalId, setFormPrincipalId] = useState<string>("");
  const [formHasLeaveFeatureAccess, setFormHasLeaveFeatureAccess] =
    useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<"active" | "pending">("active");

  // Create User dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456"); // default password
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("class_teacher");
  const [newHasLeaveFeatureAccess, setNewHasLeaveFeatureAccess] =
    useState<boolean>(false);

  // Custom two-step deletion state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [deleteStep, setDeleteStep] = useState(1);

  // Collapse states for Hierarchy view
  const [openPrincipal, setOpenPrincipal] = useState<Record<string, boolean>>(
    {},
  );
  const [openCoordinator, setOpenCoordinator] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cachedUsers = await cache.get("offline_users");
      const cachedClasses = await cache.get("offline_classes");

      const hasCache = !!(
        cachedUsers &&
        cachedUsers.length > 0 &&
        cachedClasses &&
        cachedClasses.length > 0
      );
      if (!hasCache) {
        setLoading(true);
      } else {
        setUsers(cachedUsers);
        setClasses(cachedClasses);
        setLoading(false);
      }
      setError("");

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout.")), 15000),
      );

      await Promise.race([
        (async () => {
          const [fetchedUsers, fetchedClasses] = await Promise.all([
            usersApi.getAll(),
            classesApi.getAll(),
          ]);
          setUsers(fetchedUsers);
          setClasses(fetchedClasses);
          setLoading(false);

          Promise.all([
            cache.set("offline_users", fetchedUsers),
            cache.set("offline_classes", fetchedClasses),
          ]).catch((err) => console.error("Error setting cache:", err));
        })(),
        timeoutPromise,
      ]);
    } catch (err: any) {
      setError(
        "Failed to load user administration details. Using offline cache if available.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setFormRole(user.role);
    setFormDisplayName(user.displayName || "");
    setFormAssignedClassId(user.assignedClassId || "");
    setFormCoordinatorId(user.coordinatorId || "");
    setFormPrincipalId(user.principalId || "");
    setFormHasLeaveFeatureAccess(user.hasLeaveFeatureAccess || false);
    setFormStatus(user.status || "active");
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    const uid = selectedUser.uid;
    const email = selectedUser.email;
    const originalUsers = [...users];

    setError("");
    setSuccess("");
    const updatedData: Partial<UserProfile> = {
      role: formRole,
      displayName: formDisplayName,
      assignedClassId:
        formRole === "class_teacher" ? formAssignedClassId || null : null,
      coordinatorId:
        formRole === "class_teacher" ? formCoordinatorId || null : null,
      principalId:
        formRole === "academic_coordinator" ? formPrincipalId || null : null,
      hasLeaveFeatureAccess: formHasLeaveFeatureAccess,
      status: formStatus,
    };

    // Optimistic update
    const updatedUsers = users.map((u) =>
      u.uid === uid ? { ...u, ...updatedData } : u,
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${email} successfully updated.`);
    handleCloseEditDialog();

    // Background API call
    (async () => {
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
    })();
  };

  const handleOpenDeleteConfirm = (uid: string, email: string | null) => {
    const userToDel = users.find((u) => u.uid === uid);
    if (userToDel?.role === "owner" || email === "sekhar.root@gmail.com") {
      setError("The Primary Owner account cannot be deleted or removed.");
      return;
    }
    setUserToDelete({ uid, email });
    setDeleteStep(1);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    const { uid, email } = userToDelete;
    const originalUsers = [...users];

    setDeleteConfirmOpen(false);
    setUserToDelete(null);

    // Optimistic delete
    const updatedUsers = users.filter((u) => u.uid !== uid);
    setUsers(updatedUsers);
    setSuccess(
      `User profile for ${email || "this user"} successfully removed.`,
    );

    // Background API call
    (async () => {
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
    })();
  };

  const handleApproveUser = async (user: UserProfile) => {
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    // Optimistic update
    const updatedUsers = users.map((u) =>
      u.uid === user.uid ? { ...u, status: "active" as "active" } : u,
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${user.email} approved successfully.`);

    // Background API call
    (async () => {
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
    })();
  };

  const handleOpenCreateDialog = () => {
    setNewEmail("");
    setNewDisplayName("");
    setNewRole("class_teacher");
    setNewPassword("123456");
    setNewHasLeaveFeatureAccess(false);
    setCreateDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!newEmail) {
      setError("Email is required");
      return;
    }
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    // Since creating Firebase auth users client-side is restricted (and logs out current user),
    // we pre-create the profile with a deterministic UID. When the teacher logs in or registers
    // with this email, they will automatically match and adopt this pre-assigned role!
    const simulatedUid = "pre_" + Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      uid: simulatedUid,
      email: newEmail.trim().toLowerCase(),
      displayName: newDisplayName || newEmail.split("@")[0],
      role: newRole,
      status: "pending", // Pending real login
      assignedClassId: null,
      coordinatorId: null,
      principalId: null,
      hasLeaveFeatureAccess: newHasLeaveFeatureAccess,
    };

    // Optimistic add
    setUsers([...users, newProfile]);
    setSuccess(
      `User record pre-configured for ${newEmail}. When they sign in, they will receive this role.`,
    );
    setCreateDialogOpen(false);

    // Background API call
    (async () => {
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
    })();
  };

  const handleSeedDemoUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const classIds = classes.map((c) => c.id);
      await usersApi.seedDemoUsers(classIds);
      setSuccess(
        "Standard demo roles and hierarchy successfully configured! Logins initialized: admin@classroom.com, principal@classroom.com, coord1@classroom.com, teacher1@classroom.com (password: 123456).",
      );
      await loadData();
    } catch (err: any) {
      setError("Failed to seed demo users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePrincipalCollapse = (uid: string) => {
    setOpenPrincipal((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const toggleCoordinatorCollapse = (uid: string) => {
    setOpenCoordinator((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  if (userProfile?.role !== "admin" && userProfile?.role !== "owner") {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You must be an administrator or owner to view this
          page.
        </Alert>
      </Box>
    );
  }

  // Group roles for dropdown select links
  const coordinators = users.filter((u) => u.role === "academic_coordinator");
  const principals = users.filter((u) => u.role === "principal");

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.025em" }}
          >
            User Administration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage teacher roles, principal viewing privileges, and link
            structural hierarchies.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={handleSeedDemoUsers}
            disabled={loading}
            startIcon={<StarIcon />}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Seed Demo Accounts
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenCreateDialog}
            startIcon={<AddIcon />}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            borderBottom: 1, 
            borderColor: "divider", 
            px: { xs: 0, sm: 2 },
            "& .MuiTabs-scrollButtons": {
              display: { xs: "flex", sm: "none" }
            }
          }}
        >
          <Tab
            icon={<SupervisorAccountIcon />}
            label={isMobile ? "Roles" : "Manage Roles & Permissions"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AccountTreeIcon />}
            label={isMobile ? "Hierarchy" : "School Hierarchy Tree"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AddIcon />}
            label={isMobile ? "Approvals" : "Pending Approvals"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
        </Tabs>

        {activeTab === 0 && (
          <RolesTable
            users={users.filter((u) => u.status === "active")}
            classes={classes}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteConfirm}
          />
        )}
        {activeTab === 1 && (
          <HierarchyTree
            users={users.filter((u) => u.status === "active")}
            classes={classes}
            openPrincipal={openPrincipal}
            openCoordinator={openCoordinator}
            onTogglePrincipal={togglePrincipalCollapse}
            onToggleCoordinator={toggleCoordinatorCollapse}
          />
        )}
        {activeTab === 2 && (
          <RolesTable
            users={users.filter((u) => u.status === "pending")}
            classes={classes}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteConfirm}
            onApprove={handleApproveUser}
            onDecline={handleOpenDeleteConfirm}
          />
        )}
      </Paper>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Configure Role & Supervisor Hierarchy
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Editing Profile for: {selectedUser.email}
              </Typography>

              <TextField
                label="Full Display Name"
                fullWidth
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel id="role-select-label">Functional Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  label="Functional Role"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                  disabled={
                    selectedUser.email === "sekhar.root@gmail.com"
                  }
                >
                  <MenuItem value="owner">Owner</MenuItem>
                  <MenuItem value="admin">Administrator (Full Scope)</MenuItem>
                  <MenuItem value="principal">
                    Principal (Full Read-Only)
                  </MenuItem>
                  <MenuItem value="academic_coordinator">
                    Academic Coordinator (Full Manager)
                  </MenuItem>
                  <MenuItem value="class_teacher">
                    Class Teacher (Assigned Classroom)
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="status-select-label">Account Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  label="Account Status"
                  value={formStatus}
                  onChange={(e) =>
                    setFormStatus(e.target.value as "active" | "pending")
                  }
                  disabled={
                    selectedUser.role === "owner" ||
                    selectedUser.email === "sekhar.root@gmail.com"
                  }
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>

              {formRole === "class_teacher" && (
                <>
                  <FormControl fullWidth>
                    <InputLabel id="class-select-label">
                      Assigned Classroom
                    </InputLabel>
                    <Select
                      labelId="class-select-label"
                      label="Assigned Classroom"
                      value={formAssignedClassId}
                      onChange={(e) => setFormAssignedClassId(e.target.value)}
                    >
                      <MenuItem value="">-- No Class Assigned --</MenuItem>
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.classStandard} {cls.section} ({cls.board})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="coordinator-select-label">
                      Supervising Academic Coordinator
                    </InputLabel>
                    <Select
                      labelId="coordinator-select-label"
                      label="Supervising Academic Coordinator"
                      value={formCoordinatorId}
                      onChange={(e) => setFormCoordinatorId(e.target.value)}
                    >
                      <MenuItem value="">-- Unassigned --</MenuItem>
                      {coordinators.map((co) => (
                        <MenuItem key={co.uid} value={co.uid}>
                          {co.displayName} ({co.email})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {formRole === "academic_coordinator" && (
                <FormControl fullWidth>
                  <InputLabel id="principal-select-label">
                    Reporting to Principal
                  </InputLabel>
                  <Select
                    labelId="principal-select-label"
                    label="Reporting to Principal"
                    value={formPrincipalId}
                    onChange={(e) => setFormPrincipalId(e.target.value)}
                  >
                    <MenuItem value="">-- No Direct Link --</MenuItem>
                    {principals.map((pr) => (
                      <MenuItem key={pr.uid} value={pr.uid}>
                        {pr.displayName} ({pr.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={formHasLeaveFeatureAccess}
                    onChange={(e) =>
                      setFormHasLeaveFeatureAccess(e.target.checked)
                    }
                    color="primary"
                  />
                }
                label="Enable Leave Requests Feature Access"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveUser}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Save Permissions
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pre-configure New User Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Configure New User Profile
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              Configure a user's details and role in advance. When they register
              or sign in with this email, they will assume this configured
              identity.
            </Typography>
            <TextField
              label="Email Address"
              fullWidth
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="e.g. teacher@school.com"
            />
            <TextField
              label="Display Name"
              fullWidth
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              placeholder="e.g. Mrs. Sharma"
            />
            <FormControl fullWidth>
              <InputLabel id="new-role-select-label">Role</InputLabel>
              <Select
                labelId="new-role-select-label"
                label="Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as UserRole)}
              >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="principal">Principal</MenuItem>
                <MenuItem value="academic_coordinator">
                  Academic Coordinator
                </MenuItem>
                <MenuItem value="class_teacher">Class Teacher</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newHasLeaveFeatureAccess}
                  onChange={(e) =>
                    setNewHasLeaveFeatureAccess(e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Enable Leave Requests Feature Access"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateUser}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Configure Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Two-step User Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: deleteStep === 2 ? "error.main" : "warning.main",
          }}
        >
          <WarningIcon />{" "}
          {deleteStep === 1 ? "Confirm Deletion" : "FINAL WARNING"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {userToDelete && (
            <Box>
              {deleteStep === 1 ? (
                <Typography variant="body1">
                  Are you sure you want to delete the user profile for{" "}
                  <strong>{userToDelete.email}</strong>?
                  <br />
                  <br />
                  This will not delete their authentication account, but will
                  revoke their workspace role permissions.
                </Typography>
              ) : (
                <Typography variant="body1">
                  WARNING: This action is permanent and cannot be undone.
                  <br />
                  <br />
                  Are you absolutely certain you want to proceed and permanently
                  delete the profile for <strong>{userToDelete.email}</strong>?
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          {deleteStep === 1 ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => setDeleteStep(2)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Proceed to Final Step
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleConfirmDeleteUser}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Permanently Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

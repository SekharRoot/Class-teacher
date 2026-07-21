import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StarIcon from "@mui/icons-material/Star";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SchoolIcon from "@mui/icons-material/School";

import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { classesApi, usersApi, schoolsApi } from "../api";
import { UserProfile, ClassItem, School } from "../types";
import { cache } from "../lib/cache";

import { RolesTable } from "../components/admin/RolesTable";
import { HierarchyTree } from "../components/admin/HierarchyTree";
import { TransferUserSchoolDialog } from "../components/admin/TransferUserSchoolDialog";
import { DatabaseOptimizationTab } from "../components/admin/DatabaseOptimizationTab";
import { ManageSchoolsTab } from "../components/admin/ManageSchoolsTab";
import { DatabasesTab } from "../components/admin/DatabasesTab";
import { SchoolMigrationTab } from "../components/admin/SchoolMigrationTab";
import { EditUserDialog } from "../components/admin/EditUserDialog";
import { AddUserDialog } from "../components/admin/AddUserDialog";
import { ConfirmDeleteUserDialog } from "../components/admin/ConfirmDeleteUserDialog";
import { ConfirmDeleteDbDialog } from "../components/admin/ConfirmDeleteDbDialog";

import { useAdminSchools } from "../hooks/useAdminSchools";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminDatabase } from "../hooks/useAdminDatabase";

export default function AdminPanel() {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(() => {
    if (location.state && typeof (location.state as any).activeTab === "number") {
      return (location.state as any).activeTab;
    }
    return 0;
  });

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const adminSchools = useAdminSchools({
    setLoading,
    setError,
    setSuccess,
    setUsers,
  });

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
          const [fetchedUsers, fetchedClasses, fetchedSchools] = await Promise.all([
            usersApi.getAll(),
            classesApi.getAll(),
            schoolsApi.getAll(),
          ]);
          setUsers(fetchedUsers);
          setClasses(fetchedClasses);
          adminSchools.setSchools(fetchedSchools);
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

  useEffect(() => {
    loadData();
  }, []);

  const adminUsers = useAdminUsers({
    users,
    setUsers,
    classes,
    setClasses,
    userProfile,
    setLoading,
    setError,
    setSuccess,
    loadData,
  });

  const adminDatabase = useAdminDatabase({
    schools: adminSchools.schools,
    setError,
    setSuccess,
  });

  const isOwnerOrAdmin =
    userProfile?.role === "owner" ||
    userProfile?.role === "admin" ||
    userProfile?.email === "sekhar.root@gmail.com";
  const isSchoolAdmin = userProfile?.role === "school_admin";
  const isAcademicCoordinator = userProfile?.role === "academic_coordinator";

  const displayUsers = useMemo(() => {
    if (isOwnerOrAdmin) {
      return users;
    }
    if (isSchoolAdmin && userProfile?.schoolId) {
      return users.filter((u) => u.schoolId === userProfile.schoolId);
    }
    if (isAcademicCoordinator && userProfile?.schoolId) {
      return users.filter((u) => u.schoolId === userProfile.schoolId);
    }
    return [];
  }, [users, userProfile, isOwnerOrAdmin, isSchoolAdmin, isAcademicCoordinator]);

  const coordinators = useMemo(() => displayUsers.filter((u) => u.role === "academic_coordinator"), [displayUsers]);
  const principals = useMemo(() => displayUsers.filter((u) => u.role === "principal"), [displayUsers]);

  if (!isOwnerOrAdmin && !isSchoolAdmin && !isAcademicCoordinator) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You must be an administrator, owner, school administrator, or academic coordinator to view this page.
        </Alert>
      </Box>
    );
  }

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
            Manage teacher roles, principal viewing privileges, and link structural hierarchies.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={adminUsers.handleOpenCreateDialog}
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
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<SupervisorAccountIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Active Users"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AccountTreeIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Hierarchy"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<StarIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Pending Approvals"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<SpeedIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Database Optimizer"
            disabled={!isOwnerOrAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<SchoolIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Manage Schools"
            disabled={!isOwnerOrAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<StorageIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="Databases & Backups"
            disabled={!isOwnerOrAdmin && !isSchoolAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AutorenewIcon sx={{ fontSize: "1.15rem" }} />}
            iconPosition="start"
            label="School Migration"
            disabled={!isOwnerOrAdmin && !isSchoolAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
        </Tabs>

        {activeTab === 0 && (
          <RolesTable
            users={displayUsers.filter((u) => u.status === "active")}
            classes={classes}
            onEdit={adminUsers.handleOpenEditDialog}
            onDelete={adminUsers.handleOpenDeleteConfirm}
            onTransferSchool={
              isOwnerOrAdmin
                ? (u) => {
                    adminSchools.setUserToTransfer(u);
                    adminSchools.setTransferUserDialogOpen(true);
                  }
                : undefined
            }
          />
        )}
        {activeTab === 1 && (
          <HierarchyTree
            users={displayUsers.filter((u) => u.status === "active")}
            classes={classes}
            openPrincipal={adminUsers.openPrincipal}
            openCoordinator={adminUsers.openCoordinator}
            onTogglePrincipal={adminUsers.togglePrincipalCollapse}
            onToggleCoordinator={adminUsers.toggleCoordinatorCollapse}
          />
        )}
        {activeTab === 2 && (
          <RolesTable
            users={displayUsers.filter((u) => u.status === "pending")}
            classes={classes}
            onEdit={adminUsers.handleOpenEditDialog}
            onDelete={adminUsers.handleOpenDeleteConfirm}
            onApprove={adminUsers.handleApproveUser}
            onDecline={adminUsers.handleOpenDeleteConfirm}
            onTransferSchool={
              isOwnerOrAdmin
                ? (u) => {
                    adminSchools.setUserToTransfer(u);
                    adminSchools.setTransferUserDialogOpen(true);
                  }
                : undefined
            }
          />
        )}
        {activeTab === 3 && (
          <DatabaseOptimizationTab
            migrationLoading={adminDatabase.migrationLoading}
            migrationProgress={adminDatabase.migrationProgress}
            migrationStatus={adminDatabase.migrationStatus}
            migrationSuccess={adminDatabase.migrationSuccess}
            onRunMigration={adminDatabase.handleRunMigration}
          />
        )}
        {activeTab === 4 && (
          <ManageSchoolsTab
            schools={adminSchools.schools}
            schoolsLoading={adminSchools.schoolsLoading}
            addSchoolName={adminSchools.addSchoolName}
            setAddSchoolName={adminSchools.setAddSchoolName}
            newSchoolAddress={adminSchools.newSchoolAddress}
            setNewSchoolAddress={adminSchools.setNewSchoolAddress}
            onAddSchool={adminSchools.handleAddSchool}
            onToggleSchoolActive={adminSchools.handleToggleSchoolActive}
            onOpenDeleteSchool={adminSchools.handleOpenDeleteSchool}
          />
        )}
        {activeTab === 5 && (
          <DatabasesTab
            schools={adminSchools.schools}
            dbSelectedSchoolId={adminDatabase.dbSelectedSchoolId}
            setDbSelectedSchoolId={adminDatabase.setDbSelectedSchoolId}
            dbSelectedSchoolName={adminDatabase.dbSelectedSchoolName}
            setDbSelectedSchoolName={adminDatabase.setDbSelectedSchoolName}
            onFetchDbCounts={adminDatabase.fetchDbCounts}
            dbCountsLoading={adminDatabase.dbCountsLoading}
            importLoading={adminDatabase.importLoading}
            onExportDatabase={adminDatabase.handleExportDatabase}
            onImportDatabase={adminDatabase.handleImportDatabase}
            onOpenDeleteDbDialog={() => {
              adminDatabase.setDbDeleteStep(1);
              adminDatabase.setStep2Checkboxes({
                students: false,
                users: false,
                leaves: false,
                attendance: false,
              });
              adminDatabase.setStep3Text("");
              adminDatabase.setStep4Select("");
              adminDatabase.setDbDeleteDialogueOpen(true);
            }}
            dbCounts={adminDatabase.dbCounts}
            isOwnerOrAdmin={isOwnerOrAdmin}
            userProfile={userProfile}
            isSchoolAdmin={isSchoolAdmin}
          />
        )}
        {activeTab === 6 && (
          <SchoolMigrationTab
            schools={adminSchools.schools}
            userProfile={userProfile}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        )}
      </Paper>

      <Box sx={{ height: { xs: 120, sm: 160 } }} />

      <Dialog
        open={adminSchools.deleteSchoolConfirmOpen}
        onClose={() => adminSchools.setDeleteSchoolConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" /> Confirm Removal
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
            Are you sure you want to remove "{adminSchools.schoolToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Removing this school will prevent new signups from selecting it. Existing profiles will retain their associated school ID, but the school won't be listed in active registries. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => adminSchools.setDeleteSchoolConfirmOpen(false)}
            disabled={adminSchools.schoolsLoading}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={adminSchools.handleConfirmDeleteSchool}
            disabled={adminSchools.schoolsLoading}
            autoFocus
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            {adminSchools.schoolsLoading ? "Removing..." : "Remove School"}
          </Button>
        </DialogActions>
      </Dialog>

      {isOwnerOrAdmin && (
        <TransferUserSchoolDialog
          open={adminSchools.transferUserDialogOpen}
          onClose={() => {
            adminSchools.setTransferUserDialogOpen(false);
            adminSchools.setUserToTransfer(null);
          }}
          onTransfer={adminSchools.handleTransferUserSchool}
          schools={adminSchools.schools}
          userName={adminSchools.userToTransfer?.displayName || adminSchools.userToTransfer?.email || ""}
        />
      )}

      <EditUserDialog
        open={adminUsers.editDialogOpen}
        onClose={adminUsers.handleCloseEditDialog}
        selectedUser={adminUsers.selectedUser}
        formDisplayName={adminUsers.formDisplayName}
        setFormDisplayName={adminUsers.setFormDisplayName}
        formRole={adminUsers.formRole}
        setFormRole={adminUsers.setFormRole}
        formSchoolId={adminUsers.formSchoolId}
        setFormSchoolId={adminUsers.setFormSchoolId}
        formSchoolName={adminUsers.formSchoolName}
        setFormSchoolName={adminUsers.setFormSchoolName}
        formStatus={adminUsers.formStatus}
        setFormStatus={adminUsers.setFormStatus}
        formAssignedClassId={adminUsers.formAssignedClassId}
        setFormAssignedClassId={adminUsers.setFormAssignedClassId}
        formAssignedClassId2={adminUsers.formAssignedClassId2}
        setFormAssignedClassId2={adminUsers.setFormAssignedClassId2}
        formCoordinatorIds={adminUsers.formCoordinatorIds}
        setFormCoordinatorIds={adminUsers.setFormCoordinatorIds}
        formPrincipalId={adminUsers.formPrincipalId}
        setFormPrincipalId={adminUsers.setFormPrincipalId}
        formHasLeaveFeatureAccess={adminUsers.formHasLeaveFeatureAccess}
        setFormHasLeaveFeatureAccess={adminUsers.setFormHasLeaveFeatureAccess}
        schools={adminSchools.schools}
        classes={classes}
        coordinators={coordinators}
        principals={principals}
        onSave={adminUsers.handleSaveUser}
      />

      <AddUserDialog
        open={adminUsers.createDialogOpen}
        onClose={() => adminUsers.setCreateDialogOpen(false)}
        newEmail={adminUsers.newEmail}
        setNewEmail={adminUsers.setNewEmail}
        newDisplayName={adminUsers.newDisplayName}
        setNewDisplayName={adminUsers.setNewDisplayName}
        newRole={adminUsers.newRole}
        setNewRole={adminUsers.setNewRole}
        newSchoolId={adminUsers.newSchoolId}
        setNewSchoolId={adminUsers.setNewSchoolId}
        newSchoolName={adminUsers.newSchoolName}
        setNewSchoolName={adminUsers.setNewSchoolName}
        newHasLeaveFeatureAccess={adminUsers.newHasLeaveFeatureAccess}
        setNewHasLeaveFeatureAccess={adminUsers.setNewHasLeaveFeatureAccess}
        schools={adminSchools.schools}
        onCreateUser={adminUsers.handleCreateUser}
      />

      <ConfirmDeleteUserDialog
        open={adminUsers.deleteConfirmOpen}
        onClose={() => adminUsers.setDeleteConfirmOpen(false)}
        deleteStep={adminUsers.deleteStep}
        setDeleteStep={adminUsers.setDeleteStep}
        userToDelete={adminUsers.userToDelete}
        onConfirmDelete={adminUsers.handleConfirmDeleteUser}
      />

      <ConfirmDeleteDbDialog
        open={adminDatabase.dbDeleteDialogueOpen}
        onClose={() => !adminDatabase.dbDeleteLoading && adminDatabase.setDbDeleteDialogueOpen(false)}
        dbDeleteStep={adminDatabase.dbDeleteStep}
        setDbDeleteStep={adminDatabase.setDbDeleteStep}
        dbDeleteLoading={adminDatabase.dbDeleteLoading}
        dbSelectedSchoolName={adminDatabase.dbSelectedSchoolName}
        step2Checkboxes={adminDatabase.step2Checkboxes}
        setStep2Checkboxes={adminDatabase.setStep2Checkboxes}
        step3Text={adminDatabase.step3Text}
        setStep3Text={adminDatabase.setStep3Text}
        step4Select={adminDatabase.step4Select}
        setStep4Select={adminDatabase.setStep4Select}
        onConfirmPurge={adminDatabase.handlePurgeDatabase}
      />
    </Box>
  );
}

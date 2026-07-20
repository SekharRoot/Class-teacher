import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  CloudOff,
  Delete,
  FileDownload,
  FileUpload,
  PlaylistAddCheck,
  SwapHoriz,
  Business,
  Sync,
} from "@mui/icons-material";
import { studentSyncManager } from "../utils/studentSyncManager";
import { studentsApi, schoolsApi } from "../api";
import { Student, School } from "../types";
import { imageCache } from "../utils/imageCache";
import { StudentCard } from "../components/StudentCard";
import { StudentDetailDialog } from "../components/StudentDetailDialog";
import { StudentFormDialog } from "../components/StudentFormDialog";
import { StudentDeleteDialog } from "../components/StudentDeleteDialog";
import { TransferClassDialog } from "../components/TransferClassDialog";
import { TransferSchoolDialog } from "../components/TransferSchoolDialog";
import { ProfileFilters } from "../components/ProfileFilters";
import { useProfilesData } from "../hooks/useProfilesData";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { useProfileActions } from "../hooks/useProfileActions";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export default function Profiles() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [massDeleteDialogOpen, setMassDeleteDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const { userProfile } = useAuth();
  const {
    pendingChanges,
    conflicts,
    syncStatus,
    syncOfflineQueue,
    resolveConflict,
  } = useData();
  const [transferSchoolDialogOpen, setTransferSchoolDialogOpen] = useState(false);
  const [schoolsList, setSchoolsList] = useState<School[]>([]);
  const [isSchoolTransferring, setIsSchoolTransferring] = useState(false);

  const isOwnerOrSuperAdmin =
    userProfile?.role === "owner" ||
    userProfile?.role === "admin" ||
    userProfile?.email === "sekhar.root@gmail.com";

  useEffect(() => {
    if (isOwnerOrSuperAdmin) {
      schoolsApi.getAll().then((data) => {
        setSchoolsList(data);
      }).catch((err) => {
        console.error("Error loading schools in profiles", err);
      });
    }
  }, [isOwnerOrSuperAdmin]);

  useEffect(() => {
    // Run image cache cleanup on mount (once a week internally)
    imageCache.cleanup();
  }, []);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [toastDuration, setToastDuration] = useState<number>(4000);
  
  const showToast = useCallback((
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
    duration = 4000,
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastDuration(duration);
  }, []);

  const {
    students,
    setStudents,
    classes,
    loading,
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
  } = useProfilesData(showToast);

  useEffect(() => {
    studentSyncManager.getLastSyncTime().then(setLastSyncTime);
  }, []);

  const handleSync = useCallback(async (forceFull = false) => {
    setIsSyncing(true);
    try {
      const res = await studentSyncManager.performSync(forceFull);
      if (res.success) {
        showToast(
          res.type === "full"
            ? `Successfully downloaded all profiles (${res.syncedCount} profiles cached offline)!`
            : `Successfully refreshed profiles (${res.syncedCount} updated, ${res.deletedCount} deleted)!`,
          "success"
        );
        fetchInitialData();
        const updatedTime = await studentSyncManager.getLastSyncTime();
        setLastSyncTime(updatedTime);
      } else {
        showToast("Failed to sync student profiles. Please check connection.", "error");
      }
    } catch (err) {
      console.error("Manual sync failed:", err);
      showToast("Error during profile synchronization.", "error");
    } finally {
      setIsSyncing(false);
    }
  }, [showToast, fetchInitialData]);

  // Two-step confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteStep, setDeleteStep] = useState(1);

  const { authorizedClassIds, isReadOnly } = useHierarchyScope();

  const isStudentReadOnly = useCallback((student: Student) => {
    return (
      isReadOnly ||
      (userProfile?.role === "class_teacher" &&
        (!student.classId || !authorizedClassIds.includes(student.classId)))
    );
  }, [isReadOnly, userProfile?.role, authorizedClassIds]);

  const [viewType, setViewType] = useState<"grid" | "grid_compact" | "list_image" | "list_details">("list_details");

  const filteredClasses = useMemo(() => classes.filter((c) =>
    authorizedClassIds.includes(c.id),
  ), [classes, authorizedClassIds]);

  const handleOpenEditDialog = useCallback((student: Student) => {
    setEditingStudent(student);
    setOpenDialog(true);
  }, [setEditingStudent, setOpenDialog]);

  const handleOpenDetail = useCallback((student: Student) => {
    setSelectedStudent(student);
    setOpenDetailDialog(true);
  }, [setSelectedStudent, setOpenDetailDialog]);

  const {
    isMassDeleting,
    handleSaveProfileAsync: handleSaveProfileActions,
    handleConfirmDeleteStudent: handleConfirmDeleteActions,
    handleMassDelete: handleMassDeleteActions,
  } = useProfileActions(students, setStudents, offlineMode, showToast, fetchInitialData);

  const handleSaveProfileAsync = useCallback((formData: any) => 
    handleSaveProfileActions(formData, editingStudent, setOpenDialog, setEditingStudent),
    [handleSaveProfileActions, editingStudent, setOpenDialog, setEditingStudent]);

  const handleConfirmDeleteStudent = useCallback(() => 
    handleConfirmDeleteActions(studentToDelete, setDeleteDialogOpen, setStudentToDelete),
    [handleConfirmDeleteActions, studentToDelete, setDeleteDialogOpen, setStudentToDelete]);

  const handleMassDelete = useCallback(() => 
    handleMassDeleteActions(selectedIds, setSelectedIds),
    [handleMassDeleteActions, selectedIds, setSelectedIds]);

  const handleTransferStudents = useCallback(async (targetClassId: string) => {
    setIsTransferring(true);
    try {
      await studentsApi.transferStudents(selectedIds, targetClassId);
      showToast(`Successfully transferred ${selectedIds.length} students!`, "success");
      setSelectedIds([]);
      setTransferDialogOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("Transfer error", error);
      showToast("Failed to transfer students.", "error");
    } finally {
      setIsTransferring(false);
    }
  }, [selectedIds, showToast, fetchInitialData]);

  const handleTransferSchool = useCallback(async (targetSchoolId: string) => {
    setIsSchoolTransferring(true);
    try {
      await studentsApi.transferSchool(selectedIds, targetSchoolId);
      showToast(`Successfully transferred ${selectedIds.length} students to the target school!`, "success");
      setSelectedIds([]);
      setTransferSchoolDialogOpen(false);
      fetchInitialData();
    } catch (error) {
      console.error("School transfer error", error);
      showToast("Failed to transfer students to school.", "error");
    } finally {
      setIsSchoolTransferring(false);
    }
  }, [selectedIds, showToast, fetchInitialData]);

  const handleDeleteProfile = useCallback(async (studentId: string, name: string) => {
    setStudentToDelete({ id: studentId, name });
    setDeleteStep(1);
    setDeleteDialogOpen(true);
  }, []);

  const filteredStudents = useMemo(() => students.filter((s) => {
    // Role-based filtering: permit authorized classes, or unassigned students for admins/owners/principals/class_teachers
    const isClassPermitted =
      userProfile?.role === "class_teacher" ||
      (s.classId && authorizedClassIds.includes(s.classId)) ||
      ((!s.classId || s.classId === "") && (isOwnerOrSuperAdmin || userProfile?.role === "principal"));
    if (!isClassPermitted) return false;

    // Filter out soft-deleted students
    if (s.isActive === false) return false;

    const term = searchQuery.toLowerCase();
    const fullName = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const father = (s.fatherName || "").toLowerCase();
    const mother = (s.motherName || "").toLowerCase();
    const roll = (s.rollNumber || "").toLowerCase();

    const classInfo = classes.find((c) => c.id === s.classId);
    const classString = classInfo
      ? `${classInfo.board} ${classInfo.classStandard} ${classInfo.section}`.toLowerCase()
      : "unassigned";

    const matchesSearch =
      fullName.includes(term) ||
      father.includes(term) ||
      mother.includes(term) ||
      roll.includes(term) ||
      classString.includes(term);

    const matchesFilter =
      classFilter === "ALL" ||
      (classFilter === "UNASSIGNED" && (!s.classId || s.classId === "")) ||
      s.classId === classFilter;

    return matchesSearch && matchesFilter;
  }), [students, authorizedClassIds, searchQuery, classes, classFilter, isOwnerOrSuperAdmin, userProfile?.role]);

  const handleToggleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const editableStudents = filteredStudents.filter((s) => !isStudentReadOnly(s));
      setSelectedIds(editableStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  }, [filteredStudents, isStudentReadOnly]);

  const handleSelectStudent = useCallback((studentId: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, studentId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== studentId));
    }
  }, []);

  const [displayCount, setDisplayCount] = useState(12);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery, classFilter, students.length]);

  const setLoadMoreRef = React.useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (displayCount < filteredStudents.length) {
              setDisplayCount((prev) => prev + 12);
            } else if (hasMore && !loading) {
              loadMore();
            }
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    }
  }, [displayCount, filteredStudents.length, hasMore, loadMore, loading]);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            Student Profiles{" "}
            {offlineMode && (
              <Chip
                label="Offline Cache"
                size="small"
                color="warning"
                icon={<CloudOff />}
              />
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage comprehensive student profile sheets, roll cards, and picture
            directories.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant="outlined"
            color="primary"
            disabled={isSyncing}
            startIcon={isSyncing ? <CircularProgress size={20} color="inherit" /> : <Sync />}
            onClick={() => handleSync(!lastSyncTime)}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {lastSyncTime ? "Refresh Profiles" : "Download All Profiles"}
          </Button>

          {!isReadOnly && (
            <>
              <Button
                variant={editMode ? "contained" : "outlined"}
                color="info"
                startIcon={<PlaylistAddCheck />}
                onClick={() => {
                  setEditMode(!editMode);
                  if (!editMode === false) setSelectedIds([]);
                }}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                {editMode ? "Exit Edit Mode" : "Edit Mode"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={() => {
                  setEditingStudent(null);
                  setOpenDialog(true);
                }}
                sx={{ textTransform: "none", px: 3, py: 1, borderRadius: 2 }}
              >
                Add Student
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Offline Sync Status & Retry Indicator */}
      {pendingChanges.length > 0 && (
        <Alert
          severity={syncStatus === "error" ? "error" : "info"}
          icon={syncStatus === "syncing" ? <CircularProgress size={20} /> : undefined}
          action={
            <Button
              color="inherit"
              size="small"
              disabled={syncStatus === "syncing"}
              onClick={() => syncOfflineQueue()}
              sx={{ fontWeight: "bold" }}
            >
              {syncStatus === "syncing" ? "Syncing..." : "Sync Now"}
            </Button>
          }
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {syncStatus === "syncing" ? (
            "Synchronizing pending local updates back to the server..."
          ) : syncStatus === "error" ? (
            `Failed to sync ${pendingChanges.length} local edits. Please check your internet connection and try again.`
          ) : (
            `You have ${pendingChanges.length} offline student profile change(s) saved locally. Sync now to update the database.`
          )}
        </Alert>
      )}

      {/* Interactive Conflict Resolution Panel */}
      {conflicts.length > 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            border: "1.5px solid",
            borderColor: "warning.main",
            backgroundColor: "warning.lighter",
          }}
        >
          <Typography variant="h6" color="warning.dark" sx={{ fontWeight: "bold", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            ⚠️ Profile Sync Conflict Detected
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            The following student profiles were modified both offline and on the server. Please review and select which version to preserve.
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {conflicts.map((conflict) => (
              <Paper
                key={conflict.id}
                variant="outlined"
                sx={{ p: 2, borderRadius: 1.5, borderColor: "divider" }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Student: {conflict.studentName} ({conflict.changeType.toUpperCase()})
                </Typography>
                
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2, mb: 2 }}>
                  <Box sx={{ p: 1.5, borderRadius: 1, backgroundColor: "action.hover", borderLeft: "4px solid #1976d2" }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: "bold", display: "block" }}>
                      LOCAL OFFLINE VERSION
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Roll Number: {conflict.localVersion?.rollNumber || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Father: {conflict.localVersion?.fatherName || "N/A"} | Mother: {conflict.localVersion?.motherName || "N/A"}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 1.5, borderRadius: 1, backgroundColor: "action.hover", borderLeft: "4px solid #2e7d32" }}>
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: "bold", display: "block" }}>
                      SERVER CLOUD VERSION
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      Roll Number: {conflict.serverVersion?.rollNumber || "N/A"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Father: {conflict.serverVersion?.fatherName || "N/A"} | Mother: {conflict.serverVersion?.motherName || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => resolveConflict(conflict.id, "local")}
                    sx={{ textTransform: "none" }}
                  >
                    Keep Local Version
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => resolveConflict(conflict.id, "server")}
                    sx={{ textTransform: "none" }}
                  >
                    Keep Server Version
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      <ProfileFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        classes={userProfile?.role === "class_teacher" ? classes : filteredClasses}
        viewType={viewType}
        setViewType={setViewType}
        showUnassignedOption={isOwnerOrSuperAdmin || userProfile?.role === "principal" || userProfile?.role === "class_teacher"}
      />

      {editMode && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, px: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                indeterminate={selectedIds.length > 0 && selectedIds.length < filteredStudents.length}
                checked={selectedIds.length > 0 && selectedIds.length === filteredStudents.length}
                onChange={(e) => handleToggleSelectAll(e.target.checked)}
              />
            }
            label={`Select All (${selectedIds.length} selected)`}
          />
          {selectedIds.length > 0 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {isOwnerOrSuperAdmin && (
                <Button
                  id="btn-transfer-school"
                  variant="outlined"
                  color="secondary"
                  startIcon={<Business />}
                  onClick={() => setTransferSchoolDialogOpen(true)}
                  disabled={isSchoolTransferring}
                  sx={{ borderRadius: 2, textTransform: "none" }}
                >
                  Transfer School
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SwapHoriz />}
                onClick={() => setTransferDialogOpen(true)}
                disabled={isTransferring}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Transfer Class
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setMassDeleteDialogOpen(true)}
                disabled={isMassDeleting}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Delete Selected
              </Button>
            </Box>
          )}
        </Box>
      )}

      {loading && students.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "30vh",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Synchronizing student records...
          </Typography>
        </Box>
      ) : filteredStudents.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No student profiles found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || classFilter !== "ALL"
              ? "Try adjusting your search query or class standard filter."
              : "Add custom student profiles manually."}
          </Typography>
          {!searchQuery && classFilter === "ALL" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditingStudent(null);
                setOpenDialog(true);
              }}
              startIcon={<Add />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add First Student Profile
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                viewType === "grid"
                  ? { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }
                  : viewType === "grid_compact"
                    ? { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" }
                    : "1fr",
              gap: viewType === "grid_compact" ? 1.5 : 3,
            }}
          >
            {filteredStudents.slice(0, displayCount).map((item) => (
              <StudentCard
                key={item.id}
                item={item}
                classes={classes}
                onViewDetails={handleOpenDetail}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteProfile}
                readOnly={isStudentReadOnly(item)}
                selected={selectedIds.includes(item.id)}
                onSelect={editMode ? handleSelectStudent : undefined}
                layout={viewType}
              />
            ))}
          </Box>
          {(displayCount < filteredStudents.length || hasMore) && (
            <Box
              ref={setLoadMoreRef}
              sx={{ display: "flex", justifyContent: "center", p: 4, overflowAnchor: "none" }}
            >
              <CircularProgress size={30} />
            </Box>
          )}
        </>
      )}

      <StudentFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingStudent(null);
        }}
        classes={filteredClasses}
        editingStudent={editingStudent}
        onSaveProfile={handleSaveProfileAsync}
        showToast={showToast}
      />
      <StudentDetailDialog
        open={openDetailDialog}
        onClose={() => {
          setOpenDetailDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classes={classes}
      />

      <StudentDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        deleteStep={deleteStep}
        setDeleteStep={setDeleteStep}
        studentToDelete={studentToDelete}
        onConfirm={handleConfirmDeleteStudent}
      />

      <StudentDeleteDialog
        open={massDeleteDialogOpen}
        onClose={() => setMassDeleteDialogOpen(false)}
        deleteStep={deleteStep}
        setDeleteStep={setDeleteStep}
        studentToDelete={{ id: "mass", name: `${selectedIds.length} selected students` }}
        onConfirm={() => {
          handleMassDelete();
          setMassDeleteDialogOpen(false);
        }}
      />

      <TransferClassDialog
        open={transferDialogOpen}
        onClose={() => setTransferDialogOpen(false)}
        onTransfer={handleTransferStudents}
        classes={classes}
        selectedCount={selectedIds.length}
      />

      {isOwnerOrSuperAdmin && (
        <TransferSchoolDialog
          open={transferSchoolDialogOpen}
          onClose={() => setTransferSchoolDialogOpen(false)}
          onTransfer={handleTransferSchool}
          schools={schoolsList}
          selectedCount={selectedIds.length}
        />
      )}

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={toastDuration}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

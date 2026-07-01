import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  Tooltip,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Check,
  Close,
  Delete,
  Search,
  CalendarMonth,
  Event,
  School,
  AccountCircle,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  FilterList,
  Warning,
} from "@mui/icons-material";
import { format, differenceInDays, parseISO, isWithinInterval } from "date-fns";
import { useAuth } from "../contexts/AuthContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { leavesApi } from "../api";
import { LeaveApplyDialog } from "../components/leaves/LeaveApplyDialog";
import { LeaveCard } from "../components/leaves/LeaveCard";
import { LeaveRequest, LeaveStatus } from "../types";
import { useData } from "../contexts/DataContext";

export default function Leaves() {
  const { userProfile } = useAuth();
  const { authorizedClassIds, allClasses, isReadOnly, loadingScope } =
    useHierarchyScope();
  const {
    leaves: leavesList,
    setLeaves: setLeavesList,
    students: studentsList,
    loading: globalLoading,
  } = useData();

  const [loading, setLoading] = useState(true);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [openApplyDialog, setOpenApplyDialog] = useState(false);

  // Custom delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leaveIdToDelete, setLeaveIdToDelete] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  useEffect(() => {
    if (!loadingScope && !globalLoading) {
      setLoading(false);
    }
  }, [loadingScope, globalLoading]);

  // Handle status update (approve/reject)
  const handleUpdateStatus = async (leaveId: string, status: LeaveStatus) => {
    if (isReadOnly) {
      showToast("Access Denied: Read-only profile", "error");
      return;
    }
    const originalLeaves = [...leavesList];
    const updatedLeaves = leavesList.map((leave) =>
      leave.id === leaveId
        ? {
            ...leave,
            status,
            resolvedBy:
              userProfile?.displayName ||
              userProfile?.email ||
              "Authorized Resolver",
            resolvedById: userProfile?.uid,
            resolvedAt: new Date().toISOString(),
          }
        : leave,
    );
    setLeavesList(updatedLeaves);
    showToast(`Leave request marked as ${status}!`, "success");

    // Perform API call in the background
    (async () => {
      try {
        await leavesApi.update(leaveId, {
          status,
          resolvedBy:
            userProfile?.displayName ||
            userProfile?.email ||
            "Authorized Resolver",
          resolvedById: userProfile?.uid,
          resolvedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to update leave status in background:", err);
        showToast("Error syncing status to cloud.", "error");
        setLeavesList(originalLeaves);
      }
    })();
  };

  // Handle delete request
  const handleDeleteRequest = async (leaveId: string) => {
    if (isReadOnly) {
      showToast("Access Denied: Read-only profile", "error");
      return;
    }
    setLeaveIdToDelete(leaveId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteRequest = async () => {
    if (!leaveIdToDelete) return;
    const toDeleteId = leaveIdToDelete;
    setDeleteConfirmOpen(false);
    setLeaveIdToDelete(null);

    const originalLeaves = [...leavesList];
    const updatedLeaves = leavesList.filter((l) => l.id !== toDeleteId);
    setLeavesList(updatedLeaves);
    showToast("Leave request removed successfully.", "success");

    // Background delete API
    (async () => {
      try {
        await leavesApi.delete(toDeleteId);
      } catch (err) {
        console.error("Failed to delete leave request in background:", err);
        showToast("Error removing leave request from server.", "error");
        setLeavesList(originalLeaves);
      }
    })();
  };

  // Handle submit new leave
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedClassId ||
      !selectedStudentId ||
      !reason.trim() ||
      !startDate ||
      !endDate
    ) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    if (differenceInDays(parseISO(endDate), parseISO(startDate)) < 0) {
      showToast("End date cannot be prior to start date.", "error");
      return;
    }

    const newLeave: LeaveRequest = {
      id: `leave_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      studentId: selectedStudentId,
      classId: selectedClassId,
      startDate,
      endDate,
      reason: reason.trim(),
      status: "pending",
      appliedBy: userProfile?.displayName || userProfile?.email || "Teacher",
      appliedById: userProfile?.uid || "",
      appliedAt: new Date().toISOString(),
    };

    const originalLeaves = [...leavesList];
    setLeavesList([newLeave, ...leavesList]);
    showToast("Leave request submitted successfully!", "success");
    setOpenApplyDialog(false);

    // Reset form fields
    setSelectedStudentId("");
    setReason("");
    setStartDate(format(new Date(), "yyyy-MM-dd"));
    setEndDate(format(new Date(), "yyyy-MM-dd"));

    // Perform API call in background
    (async () => {
      try {
        await leavesApi.create(newLeave);
      } catch (err) {
        console.error("Failed to submit leave request in background:", err);
        showToast("Error submitting leave request to server.", "error");
        setLeavesList(originalLeaves);
      }
    })();
  };

  // Filter lists based on roles and selection
  const filteredLeaves = leavesList
    .filter((leave) => authorizedClassIds.includes(leave.classId))
    .filter((leave) => classFilter === "all" || leave.classId === classFilter)
    .filter((leave) => statusFilter === "all" || leave.status === statusFilter)
    .filter((leave) => {
      if (!searchQuery.trim()) return true;
      const student = studentsList.find((s) => s.id === leave.studentId);
      const studentName = student
        ? `${student.firstName} ${student.lastName}`
        : "";
      return (
        studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leave.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const getStatusChipColor = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusIcon = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <CheckCircle fontSize="small" />;
      case "rejected":
        return <Cancel fontSize="small" />;
      default:
        return <HourglassEmpty fontSize="small" />;
    }
  };

  // For the dialog, students filtered by selected class standard
  const dialogFilteredStudents = studentsList.filter(
    (s) => s.classId === selectedClassId,
  );

  // Filter classes for the selectors
  const filteredClassesList = allClasses.filter((c) =>
    authorizedClassIds.includes(c.id),
  );

  // Pre-fill class in Apply Dialog if only one is authorized (e.g. class teacher)
  useEffect(() => {
    if (openApplyDialog && filteredClassesList.length === 1) {
      setSelectedClassId(filteredClassesList[0].id);
    }
  }, [openApplyDialog, filteredClassesList]);

  if (userProfile && !userProfile.hasLeaveFeatureAccess) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You do not have the required permissions to view Leave
          Requests.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6 }}>
      {/* Header Panel */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Leave Requests
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Process student leave claims and track active records
          </Typography>
        </Box>
        {!isReadOnly && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpenApplyDialog(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              py: 1,
              px: 2.5,
            }}
          >
            Apply Leave
          </Button>
        )}
      </Box>

      {/* Filter and Query Controls */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search student or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="class-filter-label">Filter by Class</InputLabel>
              <Select
                labelId="class-filter-label"
                value={classFilter}
                label="Filter by Class"
                onChange={(e) => setClassFilter(e.target.value)}
              >
                <MenuItem value="all">All Authorized Classes</MenuItem>
                {filteredClassesList.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.board} - {c.classStandard} {c.section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="status-filter-label">Filter by Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Filter by Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Requests</MenuItem>
                <MenuItem value="pending">Pending Approval</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Requests Container */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : filteredLeaves.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <CalendarMonth
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            No leave requests match your filters.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredLeaves.map((leave) => {
            const student = studentsList.find((s) => s.id === leave.studentId);
            const cls = allClasses.find((c) => c.id === leave.classId);
            return (
              <LeaveCard
                key={leave.id}
                leave={leave}
                student={student}
                cls={cls}
                isReadOnly={isReadOnly}
                onUpdateStatus={handleUpdateStatus}
                onDelete={handleDeleteRequest}
                getStatusChipColor={getStatusChipColor}
                getStatusIcon={getStatusIcon}
              />
            );
          })}{" "}
        </Grid>
      )}

      {/* Apply Leave Dialog */}
      <LeaveApplyDialog
        open={openApplyDialog}
        onClose={() => setOpenApplyDialog(false)}
        onSubmit={handleApplyLeave}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        reason={reason}
        setReason={setReason}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        authorizedClassIds={authorizedClassIds}
        allClasses={allClasses}
        studentsList={studentsList}
      />

      {/* Custom Leave Delete Confirmation Dialog */}
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
            color: "warning.main",
          }}
        >
          <Warning /> Withdraw Leave Request
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1">
            Are you sure you want to withdraw/delete this leave request? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleConfirmDeleteRequest}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Withdraw Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast message notifications */}
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

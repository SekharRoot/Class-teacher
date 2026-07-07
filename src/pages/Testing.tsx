import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Storage,
  CloudUpload,
  DeleteSweep,
  Warning,
  SwapHoriz,
} from "@mui/icons-material";
import { classesApi, studentsApi, attendanceApi, leavesApi } from "../api";
import {
  MOCK_STUDENTS,
  generateMockHistory,
  generateMockLeaves,
} from "../data/demoData";
import { cache } from "../lib/cache";
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

export default function Testing() {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  // Confirmation dialogs state
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);
  const [wipeStep, setWipeStep] = useState(1);

  // Student Transfer State
  const { classes: classesList, students: studentsList, handleForceSync } = useData();
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);

  const sourceStudents = studentsList.filter((st) => st.classId === sourceClassId);

  const handleSourceClassChange = (classId: string) => {
    setSourceClassId(classId);
    setSelectedStudentIds([]);
    setTargetClassId("");
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(sourceStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleBulkTransfer = async () => {
    if (!sourceClassId || !targetClassId || selectedStudentIds.length === 0) {
      showToast("Please select source class, target class, and at least one student.", "error");
      return;
    }

    setIsTransferring(true);
    try {
      await studentsApi.transferStudents(selectedStudentIds, targetClassId);
      await handleForceSync();
      showToast(`Successfully transferred ${selectedStudentIds.length} students!`, "success");
      setSelectedStudentIds([]);
      setTargetClassId("");
    } catch (error) {
      console.error("Transfer error", error);
      showToast("Failed to transfer students.", "error");
    } finally {
      setIsTransferring(false);
    }
  };

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  const handleSeedDemoData = async () => {
    setSeedConfirmOpen(false);
    try {
      setLoading(true);

      const seedClasses = [
        {
          id: "CBSE_XII_PCB3",
          board: "CBSE",
          classStandard: "XII",
          section: "PCB3",
        },
        { id: "ICSE_X_A", board: "ICSE", classStandard: "X", section: "A" },
      ];
      await cache.set("offline_classes", seedClasses);
      await cache.set("offline_students", MOCK_STUDENTS);

      const mockHistory = generateMockHistory();
      for (const [dateKey, attendanceObj] of Object.entries(mockHistory)) {
        await cache.set(`attendance_${dateKey}`, attendanceObj);
      }

      await classesApi.seedDemo(seedClasses);
      await studentsApi.seedDemo(MOCK_STUDENTS);

      // Upload history sequentially
      for (const [dateKey, attendanceObj] of Object.entries(mockHistory)) {
        await attendanceApi.saveByDate(dateKey, attendanceObj);
      }

      // Seed mock leaves
      const mockLeaves = generateMockLeaves();
      for (const leave of mockLeaves) {
        await leavesApi.create(leave);
      }

      showToast(
        "Test environment created and synchronized successfully!",
        "success",
      );
    } catch (err: any) {
      console.error("Seeding failed:", err);
      showToast(
        "Failed to upload demo data to cloud. Created in local cache instead.",
        "warning",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWipeAllData = async () => {
    setWipeConfirmOpen(false);
    try {
      setLoading(true);

      // Clear offline cache
      await cache.clearAllOffline();

      // Fetch existing data from cloud to delete
      const [classesList, studentsList, leavesList, history] =
        await Promise.all([
          classesApi.getAll(true),
          studentsApi.getAll(true),
          leavesApi.getAll(true),
          attendanceApi.getHistory(),
        ]);

      // Parallel deletion of all cloud resources
      const deletePromises: Promise<any>[] = [];

      // 1. Delete classes
      if (classesList && classesList.length > 0) {
        classesList.forEach((c) =>
          deletePromises.push(classesApi.delete(c.id)),
        );
      }

      // 2. Delete students
      if (studentsList && studentsList.length > 0) {
        studentsList.forEach((s) =>
          deletePromises.push(studentsApi.delete(s.id)),
        );
      }

      // 3. Delete leaves
      if (leavesList && leavesList.length > 0) {
        leavesList.forEach((l) => deletePromises.push(leavesApi.delete(l.id)));
      }

      // 4. Delete attendance history
      if (history && history.length > 0) {
        history.forEach((h) =>
          deletePromises.push(attendanceApi.deleteRecord(h.date)),
        );
      }

      await Promise.all(deletePromises);

      showToast(
        "All local cache and cloud database registers wiped successfully!",
        "success",
      );
    } catch (err: any) {
      console.error("Wiping failed:", err);
      showToast(
        "Local cache wiped, but failed to fully clear cloud database.",
        "warning",
      );
    } finally {
      setLoading(false);
    }
  };

  if (userProfile?.role !== "owner") {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You must be an owner to view this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", pb: 6 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Testing & Debugging
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Utilities to seed, manage, and reset database environments during
        development.
      </Typography>

      <Stack spacing={4}>
        {/* Load Demo Data Card */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Storage color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Demo Data Generation
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Initialize the application with sample classrooms, student profiles,
            and pre-generated 5-day attendance history. This is useful for
            testing charts, history, and offline sync functionality.
          </Typography>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <CloudUpload />
              )
            }
            onClick={() => setSeedConfirmOpen(true)}
            disabled={loading}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {loading ? "Processing..." : "Load Demo Data"}
          </Button>
        </Paper>

        {/* Bulk Student Transfer Card */}
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <SwapHoriz color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Bulk Student Transfer
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Transfer multiple student profiles from one class registry to another in bulk. Select the origin and destination classes below to begin.
          </Typography>

          <Stack spacing={3}>
            {/* Step 1 & 2 Class Selectors */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="source-class-label">Source Class (Origin)</InputLabel>
                <Select
                  labelId="source-class-label"
                  id="source-class-select"
                  value={sourceClassId}
                  label="Source Class (Origin)"
                  onChange={(e) => handleSourceClassChange(e.target.value as string)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None Selected</em>
                  </MenuItem>
                  {classesList.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.board} {cls.classStandard} - {cls.section}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!sourceClassId}>
                <InputLabel id="target-class-label">Target Class (Destination)</InputLabel>
                <Select
                  labelId="target-class-label"
                  id="target-class-select"
                  value={targetClassId}
                  label="Target Class (Destination)"
                  onChange={(e) => setTargetClassId(e.target.value as string)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">
                    <em>None Selected</em>
                  </MenuItem>
                  {classesList
                    .filter((cls) => cls.id !== sourceClassId)
                    .map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.board} {cls.classStandard} - {cls.section}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Step 3 Student Checklist */}
            {sourceClassId && (
              <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, bgcolor: "background.paper" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    Select Students to Transfer
                  </Typography>
                  {sourceStudents.length > 0 && (
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < sourceStudents.length}
                          checked={selectedStudentIds.length > 0 && selectedStudentIds.length === sourceStudents.length}
                          onChange={(e) => handleSelectAllStudents(e.target.checked)}
                        />
                      }
                      label={`Select All (${selectedStudentIds.length}/${sourceStudents.length})`}
                      sx={{ mr: 0, "& .MuiFormControlLabel-label": { fontSize: "0.825rem", fontWeight: "medium" } }}
                    />
                  )}
                </Box>
                <Divider />

                {sourceStudents.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                    No students registered in this class.
                  </Typography>
                ) : (
                  <List sx={{ maxHeight: 240, overflow: "auto", py: 0, mt: 1 }}>
                    {sourceStudents.map((st) => {
                      const isSelected = selectedStudentIds.includes(st.id);
                      const fullName = `${st.firstName} ${st.lastName}`;
                      return (
                        <ListItem
                          key={st.id}
                          dense
                          onClick={() => handleSelectStudent(st.id, !isSelected)}
                          sx={{ borderRadius: 1.5, mb: 0.5, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Checkbox
                              edge="start"
                              checked={isSelected}
                              tabIndex={-1}
                              disableRipple
                              size="small"
                            />
                          </ListItemIcon>
                          <Avatar
                            src={st.image}
                            sx={{ width: 28, height: 28, mr: 1.5, bgcolor: "primary.light", fontSize: "0.875rem" }}
                          >
                            {st.firstName.charAt(0)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                {fullName}
                              </Typography>
                            }
                            secondary={
                              st.rollNumber ? (
                                <Typography variant="caption" color="text.secondary">
                                  Roll: {st.rollNumber}
                                </Typography>
                              ) : undefined
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Box>
            )}

            {/* Submit Transfer Button */}
            {sourceClassId && selectedStudentIds.length > 0 && targetClassId && (
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isTransferring ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SwapHoriz />
                  )
                }
                onClick={handleBulkTransfer}
                disabled={isTransferring}
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                {isTransferring
                  ? "Transferring Students..."
                  : `Transfer ${selectedStudentIds.length} Student${selectedStudentIds.length > 1 ? "s" : ""}`}
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Wipe Data Card */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <DeleteSweep color="error" sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h6" color="error" sx={{ fontWeight: "bold" }}>
              Danger Zone
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Permanently wipe all student profiles, classrooms, attendance logs,
            and leave requests from both local offline cache and Cloud
            Firestore. This action is irreversible.
          </Typography>

          <Button
            variant="contained"
            color="error"
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DeleteSweep />
              )
            }
            onClick={() => {
              setWipeStep(1);
              setWipeConfirmOpen(true);
            }}
            disabled={loading}
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {loading ? "Processing..." : "Wipe All Data"}
          </Button>
        </Paper>
      </Stack>

      {/* Load Demo Data Confirmation Dialog */}
      <Dialog
        open={seedConfirmOpen}
        onClose={() => setSeedConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Storage color="primary" /> Seed Demo Environment
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1">
            This will load sample educational boards, classes, 16 student
            profiles, simulated 5-day attendance histories, and mock student
            leave requests into local cache and Cloud Firestore.
            <br />
            <br />
            Do you want to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setSeedConfirmOpen(false)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSeedDemoData}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Load Demo Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Two-step Wipe All Data Confirmation Dialog */}
      <Dialog
        open={wipeConfirmOpen}
        onClose={() => setWipeConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: wipeStep === 2 ? "error.main" : "warning.main",
          }}
        >
          <Warning
            sx={{ color: wipeStep === 2 ? "error.main" : "warning.main" }}
          />{" "}
          {wipeStep === 1 ? "Wipe Database Registers" : "FINAL WARNING"}
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {wipeStep === 1 ? (
            <Typography variant="body1">
              Are you sure you want to completely wipe the application data?
              <br />
              <br />
              This will delete all classrooms, students, attendance registers,
              and leave requests from the local offline cache and Cloud
              Firestore database.
            </Typography>
          ) : (
            <Typography variant="body1">
              WARNING: This action is permanent and cannot be undone.
              <br />
              <br />
              Are you absolutely certain you want to proceed and permanently
              destroy all database records?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setWipeConfirmOpen(false)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          {wipeStep === 1 ? (
            <Button
              variant="contained"
              color="warning"
              onClick={() => setWipeStep(2)}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Proceed to Final Step
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={handleWipeAllData}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Permanently Wipe
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={6000}
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

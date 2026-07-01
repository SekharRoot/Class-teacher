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
} from "@mui/material";
import {
  Storage,
  CloudUpload,
  DeleteSweep,
  Warning,
} from "@mui/icons-material";
import { classesApi, studentsApi, attendanceApi, leavesApi } from "../api";
import {
  MOCK_STUDENTS,
  generateMockHistory,
  generateMockLeaves,
} from "../data/demoData";
import { cache } from "../lib/cache";
import { useAuth } from "../contexts/AuthContext";

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

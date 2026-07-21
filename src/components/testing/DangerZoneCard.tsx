import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DeleteSweep, Warning } from "@mui/icons-material";
import { classesApi, studentsApi, attendanceApi, leavesApi } from "../../api";
import { cache } from "../../lib/cache";

interface DangerZoneCardProps {
  loading: boolean;
  setLoading: (l: boolean) => void;
  showToast: (msg: string, sev: "success" | "error" | "warning" | "info") => void;
}

export function DangerZoneCard({ loading, setLoading, showToast }: DangerZoneCardProps) {
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);
  const [wipeStep, setWipeStep] = useState(1);

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

  return (
    <>
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
    </>
  );
}

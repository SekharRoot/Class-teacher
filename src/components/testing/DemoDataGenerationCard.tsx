import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Storage, CloudUpload } from "@mui/icons-material";
import { classesApi, studentsApi, attendanceApi, leavesApi, usersApi } from "../../api";
import { MOCK_STUDENTS, generateMockHistory, generateMockLeaves } from "../../data/demoData";
import { cache } from "../../lib/cache";
import { studentCache } from "../../utils/studentCache";

interface DemoDataGenerationCardProps {
  loading: boolean;
  setLoading: (l: boolean) => void;
  showToast: (msg: string, sev: "success" | "error" | "warning" | "info") => void;
}

export function DemoDataGenerationCard({ loading, setLoading, showToast }: DemoDataGenerationCardProps) {
  const [seedConfirmOpen, setSeedConfirmOpen] = useState(false);

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
      await studentCache.clearAndSet(MOCK_STUDENTS);

      const mockHistory = generateMockHistory();
      for (const [dateKey, attendanceObj] of Object.entries(mockHistory)) {
        await cache.set(`attendance_${dateKey}`, attendanceObj);
      }

      await classesApi.seedDemo(seedClasses);
      await studentsApi.seedDemo(MOCK_STUDENTS);

      for (const [dateKey, attendanceObj] of Object.entries(mockHistory)) {
        await attendanceApi.saveByDate(dateKey, attendanceObj);
      }

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

  const handleSeedDemoUsers = async () => {
    try {
      setLoading(true);
      const classesList = await classesApi.getAll();
      const classIds = classesList.map((c) => c.id);
      await usersApi.seedDemoUsers(classIds);
      showToast("Demo user accounts successfully created and populated!", "success");
    } catch (err: any) {
      console.error("Seeding users failed:", err);
      showToast("Failed to seed demo users: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

        <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap", gap: 2 }}>
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

          <Button
            variant="outlined"
            color="primary"
            onClick={handleSeedDemoUsers}
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
            Seed Demo Accounts
          </Button>
        </Stack>
      </Paper>

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
    </>
  );
}

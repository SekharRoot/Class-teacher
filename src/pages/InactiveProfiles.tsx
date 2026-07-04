import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import {
  RestoreFromTrash,
  DeleteForever,
  ArrowBack,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { StudentCard } from "../components/StudentCard";
import { studentsApi } from "../api";
import { Student } from "../types";

export default function InactiveProfiles() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { students, classes, loading, fetchInitialData } = useData();
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const inactiveStudents = students.filter(s => s.isActive === false);

  const canRestore = ["owner", "admin", "academic_coordinator", "principal"].includes(userProfile?.role || "");

  if (userProfile?.role === "class_teacher") {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access Denied. You do not have permission to view this page.
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const handleRestore = async (studentId: string) => {
    try {
      await studentsApi.restore(studentId);
      setToast({ open: true, message: "Profile restored successfully!", severity: "success" });
      fetchInitialData();
    } catch (error) {
      setToast({ open: true, message: "Failed to restore profile.", severity: "error" });
    }
  };

  const handlePermanentDelete = async (studentId: string, name: string) => {
    if (window.confirm(`Are you sure you want to PERMANENTLY delete ${name}? This action cannot be undone and all data will be lost forever.`)) {
      try {
        await studentsApi.permanentlyDelete(studentId);
        setToast({ open: true, message: "Profile deleted permanently!", severity: "success" });
        fetchInitialData();
      } catch (error) {
        setToast({ open: true, message: "Failed to delete profile permanently.", severity: "error" });
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Inactive Profiles
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        This section contains student profiles that have been removed or deactivated. 
        Only administrators can restore these profiles. Past attendance records are preserved.
      </Alert>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : inactiveStudents.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: "center", borderRadius: 4, bgcolor: "background.paper" }}>
          <Typography variant="h6" color="text.secondary">
            No inactive profiles found.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {inactiveStudents.map((student) => (
            <Box 
              key={student.id} 
              sx={{ 
                display: "flex", 
                flexDirection: "column",
                height: "100%",
                gap: 1
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <StudentCard
                  item={student}
                  classes={classes}
                  onViewDetails={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  readOnly={true}
                />
              </Box>
              {canRestore && (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<RestoreFromTrash />}
                    onClick={() => handleRestore(student.id)}
                    sx={{ borderRadius: 2, flexGrow: 2, textTransform: "none" }}
                  >
                    Restore
                  </Button>
                  <Tooltip title="Permanently Delete">
                    <IconButton
                      color="error"
                      onClick={() => handlePermanentDelete(student.id, `${student.firstName} ${student.lastName}`)}
                      sx={{ 
                        bgcolor: "error.50",
                        "&:hover": { bgcolor: "error.100" },
                        borderRadius: 2
                      }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

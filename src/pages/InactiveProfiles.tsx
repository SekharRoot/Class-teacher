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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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
import { cache } from "../lib/cache";

export default function InactiveProfiles() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { students, classes, loading, fetchInitialData, setStudents } = useData();
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  
  // Dialog state for permanent deletion confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);

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
      
      // Optimistically update the state & cache
      const updatedList = students.map((s) => s.id === studentId ? { ...s, isActive: true } : s);
      setStudents(updatedList);
      await cache.set("offline_students", updatedList);

      fetchInitialData();
    } catch (error) {
      setToast({ open: true, message: "Failed to restore profile.", severity: "error" });
    }
  };

  const handleOpenDeleteConfirm = (studentId: string, name: string) => {
    setStudentToDelete({ id: studentId, name });
    setDeleteConfirmOpen(true);
  };

  const handleConfirmPermanentDelete = async () => {
    if (!studentToDelete) return;
    setDeleteConfirmOpen(false);
    const targetId = studentToDelete.id;
    try {
      await studentsApi.permanentlyDelete(targetId);
      setToast({ open: true, message: "Profile deleted permanently!", severity: "success" });
      
      // Optimistically update local state & cache
      const updatedList = students.filter((s) => s.id !== targetId);
      setStudents(updatedList);
      await cache.set("offline_students", updatedList);

      fetchInitialData();
    } catch (error) {
      setToast({ open: true, message: "Failed to delete profile permanently.", severity: "error" });
    } finally {
      setStudentToDelete(null);
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
                      onClick={() => handleOpenDeleteConfirm(student.id, `${student.firstName} ${student.lastName}`)}
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

      {/* Custom MUI Confirmation Dialog instead of restricted window.confirm */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Confirm Permanent Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to PERMANENTLY delete <strong>{studentToDelete?.name}</strong>? This action cannot be undone and all associated student data will be lost forever.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)} 
            variant="outlined" 
            color="inherit"
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmPermanentDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteForever />}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

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

import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Avatar,
  Stack,
  useTheme,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SchoolIcon from "@mui/icons-material/School";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useData } from "../../contexts/DataContext";
import { usersApi } from "../../api/users";
import { cache } from "../../lib/cache";
import { UserProfile, ClassItem } from "../../types";

export function SubstituteAssignmentsManager() {
  const theme = useTheme();
  const { users, setUsers, classes, handleForceSync } = useData();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTeacherUid, setSelectedTeacherUid] = useState("");

  // Find all teachers
  const allTeachers = React.useMemo(() => {
    return users.filter((u) => u.role === "class_teacher" && u.status === "active");
  }, [users]);

  // Find substitutes for a class
  const getSubstitutesForClass = (classId: string) => {
    return allTeachers.filter((t) => t.alternateClassIds?.includes(classId));
  };

  // Find permanent class teacher
  const getRegularTeacher = (classId: string) => {
    return users.find(
      (u) => u.role === "class_teacher" && u.assignedClassId === classId
    );
  };

  const handleOpenAssignDialog = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedTeacherUid("");
    setError("");
    setSuccess("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleAssignSubstitute = async () => {
    if (!selectedClassId || !selectedTeacherUid) {
      setError("Please select both a class and a teacher.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const targetTeacher = allTeachers.find((t) => t.uid === selectedTeacherUid);
      if (!targetTeacher) throw new Error("Selected teacher not found.");

      const currentAlternateClassIds = targetTeacher.alternateClassIds || [];
      if (currentAlternateClassIds.includes(selectedClassId)) {
        throw new Error("This teacher is already assigned to this class as a substitute.");
      }

      const updatedAlternateClassIds = [...currentAlternateClassIds, selectedClassId];

      // Save to Firebase
      await usersApi.saveProfile(selectedTeacherUid, {
        alternateClassIds: updatedAlternateClassIds,
      });

      // Optimistic state update
      const updatedUsers = users.map((u) =>
        u.uid === selectedTeacherUid
          ? { ...u, alternateClassIds: updatedAlternateClassIds }
          : u
      );
      setUsers(updatedUsers);
      await cache.set("offline_users", updatedUsers);

      setSuccess(
        `Successfully assigned ${targetTeacher.displayName || targetTeacher.email} as a substitute teacher.`
      );
      setDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to assign substitute.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubstitute = async (teacherUid: string, classId: string) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const targetTeacher = allTeachers.find((t) => t.uid === teacherUid);
      if (!targetTeacher) throw new Error("Teacher not found.");

      const currentAlternateClassIds = targetTeacher.alternateClassIds || [];
      const updatedAlternateClassIds = currentAlternateClassIds.filter((id) => id !== classId);

      // Save to Firebase
      await usersApi.saveProfile(teacherUid, {
        alternateClassIds: updatedAlternateClassIds,
      });

      // Optimistic state update
      const updatedUsers = users.map((u) =>
        u.uid === teacherUid
          ? { ...u, alternateClassIds: updatedAlternateClassIds }
          : u
      );
      setUsers(updatedUsers);
      await cache.set("offline_users", updatedUsers);

      setSuccess(
        `Successfully removed ${targetTeacher.displayName || targetTeacher.email} from substitute duties.`
      );
    } catch (err: any) {
      setError(err.message || "Failed to remove substitute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>
          Substitute Class Assignments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign classes temporarily to substitute or alternate teachers. Assigned substitute
          teachers will be authorized to view the class roster and submit daily attendance records.
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {classes.map((cls) => {
          const regularTeacher = getRegularTeacher(cls.id);
          const substitutes = getSubstitutesForClass(cls.id);

          return (
            <Grid size={{ xs: 12, md: 6 }} key={cls.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "box-shadow 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
                      <SchoolIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {cls.classStandard} {cls.section}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {cls.board} Board
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: "text.secondary" }}>
                    Regular Class Teacher:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>
                    {regularTeacher
                      ? `${regularTeacher.displayName || regularTeacher.email}`
                      : "No regular teacher assigned"}
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
                    Assigned Substitutes:
                  </Typography>

                  {substitutes.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 2 }}>
                      No substitute teachers assigned
                    </Typography>
                  ) : (
                    <List disablePadding sx={{ mb: 2 }}>
                      {substitutes.map((sub) => (
                        <ListItem
                          key={sub.uid}
                          disableGutters
                          sx={{
                            py: 1,
                            px: 1.5,
                            borderRadius: "8px",
                            mb: 1,
                            bgcolor: theme.palette.action.hover,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {sub.displayName || sub.email}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {sub.email}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="remove substitute"
                              size="small"
                              onClick={() => handleRemoveSubstitute(sub.uid, cls.id)}
                              disabled={loading}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() => handleOpenAssignDialog(cls.id)}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    borderWidth: "1.5px",
                    "&:hover": { borderWidth: "1.5px" },
                  }}
                >
                  Assign Substitute
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Assign Substitute Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: "bold" }}>Assign Substitute Teacher</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="class-select-label">Classroom</InputLabel>
              <Select
                labelId="class-select-label"
                value={selectedClassId}
                label="Classroom"
                disabled // Pre-selected and locked
              >
                {classes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.classStandard} {c.section} ({c.board})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="teacher-select-label">Substitute Teacher</InputLabel>
              <Select
                labelId="teacher-select-label"
                value={selectedTeacherUid}
                label="Substitute Teacher"
                onChange={(e) => setSelectedTeacherUid(e.target.value)}
              >
                {allTeachers
                  .filter((t) => {
                    // Exclude the regular class teacher of the selected class
                    const regularTeacher = getRegularTeacher(selectedClassId);
                    return t.uid !== regularTeacher?.uid;
                  })
                  .map((t) => (
                    <MenuItem key={t.uid} value={t.uid}>
                      {t.displayName || t.email} ({t.email})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseDialog} sx={{ textTransform: "none", fontWeight: "bold" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignSubstitute}
            disabled={loading || !selectedTeacherUid}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            {loading ? <CircularProgress size={24} /> : "Assign Teacher"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Snackbar,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Fingerprint,
  CheckCircle,
  Autorenew,
  FileUpload,
  FileDownload,
  Close,
  Warning,
  Error as ErrorIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { studentsApi, classesApi } from "../api";
import { useData } from "../contexts/DataContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { previewProfileImport, ParsedStudentPreview } from "../utils/csvImport";
import { Student, ClassItem } from "../types";
import { cache } from "../lib/cache";
import { studentCache } from "../utils/studentCache";

export default function Settings() {
  const { currentUser, userProfile } = useAuth();
  const { fetchInitialData, students, setStudents, classes, offlineMode } = useData();
  const { isReadOnly } = useHierarchyScope();
  const [notifications, setNotifications] = useState(true);
  const { mode, toggleTheme } = useContext(ThemeContext);
  
  // Data integrity loading
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; show: boolean }>({ count: 0, show: false });

  // CSV Import States
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewsToImport, setPreviewsToImport] = useState<ParsedStudentPreview[]>([]);
  const [importing, setImporting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setToast({ open: true, message, severity });
  };

  const darkMode = mode === "dark";
  const isAdmin = ["owner", "admin"].includes(userProfile?.role || "");

  const handleFixProfileIds = async () => {
    setLoading(true);
    try {
      const count = await studentsApi.assignMissingProfileIds();
      setResult({ count, show: true });
      fetchInitialData();
      showToast("Triggered Profile ID repair successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to assign profile IDs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      "Roll No",
      "First Name",
      "Last Name",
      "Class ID",
      "Gender",
      "Phone",
      "Boarder Type",
      "Father Name",
      "Mother Name"
    ];
    const exampleRow = [
      "001",
      "John",
      "Doe",
      "CBSE XII PCB3(D)",
      "Male",
      "1234567890",
      "Full Boarder",
      "Robert Doe",
      "Mary Doe"
    ];
    const csvContent = [headers.join(","), exampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Student_Profiles_Template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Downloaded student profiles CSV template with optional headers!", "info");
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (offlineMode) {
      showToast("Importing student profiles is only allowed when you are online.", "warning");
      e.target.value = "";
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        const parsedPreviews = previewProfileImport(text, classes, students);
        if (parsedPreviews.length === 0) {
          showToast("No rows found in the CSV file.", "warning");
          return;
        }
        setPreviewsToImport(parsedPreviews);
        setImportDialogOpen(true);
      } catch (error: any) {
        console.error("Failed to parse CSV", error);
        showToast(error.message || "Failed to parse CSV file.", "error");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = async () => {
    if (offlineMode) {
      showToast("Cannot complete import. You are offline.", "error");
      setImportDialogOpen(false);
      return;
    }
    setImporting(true);
    try {
      const createdClasses: Record<string, string> = {};
      const activeSchoolId = (studentsApi as any).getActiveSchoolId?.() || "default_school";
      
      // Step 1: Create any necessary new classes
      for (const preview of previewsToImport) {
        if (preview.status === "invalid" || preview.status === "duplicate") {
          continue;
        }
        
        const classNameKey = preview.parsedClass.formattedName.toLowerCase();
        
        const existingClass = classes.find(
          (c) => `${c.board} ${c.classStandard} ${c.section}`.toLowerCase() === classNameKey
        );
        
        if (existingClass) {
          createdClasses[classNameKey] = existingClass.id;
        } else if (!createdClasses[classNameKey]) {
          const existingIds = new Set([
            ...classes.map((c) => c.id),
            ...Object.values(createdClasses),
          ]);
          let newClassId = "";
          let attempts = 0;
          do {
            newClassId = Math.floor(1000 + Math.random() * 9000).toString();
            attempts++;
          } while (existingIds.has(newClassId) && attempts < 10000);

          if (attempts >= 10000) {
            newClassId = `cls_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
          }

          const newClass: ClassItem = {
            id: newClassId,
            board: preview.parsedClass.board,
            classStandard: preview.parsedClass.classStandard,
            section: preview.parsedClass.section,
            schoolId: activeSchoolId,
            createdAt: new Date().toISOString(),
          };
          
          await classesApi.create(newClass);
          createdClasses[classNameKey] = newClassId;
        }
      }

      // Step 2: Prepare new student objects
      const studentsToCreate: Student[] = [];
      previewsToImport.forEach((preview, index) => {
        if (preview.status === "invalid" || preview.status === "duplicate") {
          return;
        }

        const classNameKey = preview.parsedClass.formattedName.toLowerCase();
        const resolvedClassId = createdClasses[classNameKey] || "";

        const studentId = `std_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`;
        
        const newStudent: Student = {
          id: studentId,
          profileId: `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          firstName: preview.firstName,
          lastName: preview.lastName || ".",
          rollNumber: preview.rollNumber,
          classId: resolvedClassId,
          schoolId: activeSchoolId,
          gender: preview.gender,
          phoneNumber: preview.phoneNumber,
          boarderType: preview.boarderType,
          fatherName: preview.fatherName,
          motherName: preview.motherName,
          image: "",
          isActive: true,
        };
        
        studentsToCreate.push(newStudent);
      });

      if (studentsToCreate.length === 0) {
        setImportDialogOpen(false);
        showToast("No new student profiles to import.", "info");
        return;
      }

      // Step 3: Save students
      const updatedStudents = [...students, ...studentsToCreate];
      setStudents(updatedStudents);
      await cache.set("offline_students", updatedStudents);
      await studentCache.setBatch(studentsToCreate);

      await studentsApi.batchCreate(studentsToCreate);

      showToast(`Successfully imported ${studentsToCreate.length} student profiles!`, "success");
      setImportDialogOpen(false);
      fetchInitialData();
    } catch (err: any) {
      console.error("Failed to apply CSV import:", err);
      showToast("Error applying CSV import: " + err.message, "error");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 12, px: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure application-wide settings and preferences.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: isAdmin ? 6 : 12 }}>
          <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Account Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Logged in as: {currentUser?.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                }
                label="Enable Push Notifications"
              />
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleTheme} />}
                label="Dark Theme"
              />
            </Box>
          </Paper>
        </Grid>

        {isAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Fingerprint sx={{ mr: 1 }} /> Data Integrity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Automatically generate and assign unique Profile IDs to all student records that are missing one.
              </Typography>
              
              {result.show && (
                <Alert severity={result.count > 0 ? "success" : "info"} sx={{ mb: 2 }}>
                  {result.count > 0 
                    ? `Successfully assigned Profile IDs to ${result.count} students.`
                    : "All students already have valid Profile IDs."}
                </Alert>
              )}

              <Button
                variant="contained"
                onClick={handleFixProfileIds}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                sx={{ borderRadius: 2, textTransform: "none" }}
              >
                Assign Missing Profile IDs
              </Button>
            </Paper>
          </Grid>
        )}

        {!isReadOnly && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <FileUpload sx={{ mr: 1 }} /> Student Roster Import (CSV)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Import multiple student profiles at once. Unrecognized class standards are auto-formatted into "{`{board} {standard} {section}`}" format and created for you.
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2} sx={{ mt: "auto", flexWrap: "wrap", gap: 1.5 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDownloadTemplate}
                  startIcon={<FileDownload />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                >
                  Template
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  component="label"
                  disabled={offlineMode}
                  startIcon={<FileUpload />}
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
                >
                  Import CSV
                  <input
                    type="file"
                    accept=".csv"
                    hidden
                    disabled={offlineMode}
                    onChange={handleImportData}
                  />
                </Button>
              </Stack>
            </Paper>
          </Grid>
        )}

        {isAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Autorenew sx={{ mr: 1 }} /> Historical Migration
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Safely move classes, students, leaves, and attendance records from root collections into nested tenant collections for this school.
              </Typography>
              
              <Button
                variant="outlined"
                component={Link}
                to="/admin"
                state={{ activeTab: 6 }}
                startIcon={<Autorenew />}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold" }}
              >
                Go to Migration Tool
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* CSV Import Preview Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => !importing && setImportDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Review CSV Import Data
          </Typography>
          {!importing && (
            <IconButton onClick={() => setImportDialogOpen(false)}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
              We've analyzed your CSV file. Review the records below. Duplicate rows will be skipped, and unrecognized class standard names will be auto-formatted and created as new classes in <strong>"BOARD STANDARD SECTION"</strong> format (e.g. CBSE XII PCB3(D)).
            </Alert>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              <Chip
                label={`Total Rows: ${previewsToImport.length}`}
                variant="outlined"
                color="primary"
                size="small"
              />
              <Chip
                label={`Valid & New: ${previewsToImport.filter(p => p.status === "new").length}`}
                color="success"
                size="small"
              />
              <Chip
                label={`Duplicates/Ignored: ${previewsToImport.filter(p => p.status === "duplicate" || p.status === "invalid").length}`}
                color="warning"
                size="small"
              />
            </Stack>
          </Box>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class Standard</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Boarder Type</TableCell>
                  <TableCell>Father Name</TableCell>
                  <TableCell>Mother Name</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewsToImport.map((p, idx) => {
                  const isNew = p.status === "new";
                  const isDup = p.status === "duplicate";
                  const isInvalid = p.status === "invalid";
                  
                  return (
                    <TableRow key={idx} hover sx={{ opacity: isNew ? 1 : 0.65 }}>
                      <TableCell>
                        {isNew && (
                          <Chip
                            label="Ready"
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        {isDup && (
                          <Chip
                            label="Duplicate"
                            color="warning"
                            variant="outlined"
                            size="small"
                            title={p.statusReason}
                          />
                        )}
                        {isInvalid && (
                          <Chip
                            label="Invalid"
                            color="error"
                            variant="outlined"
                            size="small"
                            title={p.statusReason}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {p.rollNumber}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {p.firstName} {p.lastName}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {p.parsedClass.formattedName}
                          </Typography>
                          {p.rawClassName !== p.parsedClass.formattedName && (
                            <Typography variant="caption" color="text.secondary">
                              Parsed from "{p.rawClassName}"
                            </Typography>
                          )}
                          {!classes.some(c => `${c.board} ${c.classStandard} ${c.section}`.toLowerCase() === p.parsedClass.formattedName.toLowerCase()) && (
                            <Chip
                              label="New class will be created"
                              size="small"
                              color="info"
                              sx={{ fontSize: "0.65rem", height: 16, mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.boarderType}
                          color={p.boarderType === "Full Boarder" ? "primary" : "secondary"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{p.fatherName || "-"}</TableCell>
                      <TableCell>{p.motherName || "-"}</TableCell>
                      <TableCell>{p.phoneNumber || "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            onClick={() => setImportDialogOpen(false)}
            disabled={importing}
            color="inherit"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmImport}
            disabled={importing || previewsToImport.filter(p => p.status === "new").length === 0}
            variant="contained"
            color="primary"
            startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{ textTransform: "none", px: 3, borderRadius: 2 }}
          >
            {importing ? "Importing..." : `Import ${previewsToImport.filter(p => p.status === "new").length} Profiles`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar alerts */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

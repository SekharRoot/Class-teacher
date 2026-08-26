import { CsvImportDialog } from "../components/settings/CsvImportDialog";
import { MapInvalidClassesDialog } from "../components/MapInvalidClassesDialog";
import React, { useState, useContext, useEffect } from "react";
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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  ZoomIn,
  ZoomOut,
  RestartAlt,
  Build,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { studentsApi, classesApi, attendanceApi } from "../api";
import { useData } from "../contexts/DataContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { previewProfileImport, ParsedStudentPreview } from "../utils/csvImport";
import { Student, ClassItem } from "../types";
import { cache } from "../lib/cache";
import { studentCache } from "../utils/studentCache";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";

export default function Settings() {
  const { currentUser, userProfile } = useAuth();
  const { fetchInitialData, students, setStudents, classes, setClasses, offlineMode, ensureUsersLoaded } = useData();

  useEffect(() => {
    ensureUsersLoaded();
  }, [ensureUsersLoaded]);
  const { isReadOnly } = useHierarchyScope();
  const [notifications, setNotifications] = useState(true);
  const { mode, toggleTheme, translucencyEnabled, toggleTranslucency, zoomLevel, setZoomLevel, coloredNavIconsEnabled, toggleColoredNavIcons } = useContext(ThemeContext);
  
  const [allowEditOldAttendance, setAllowEditOldAttendance] = useState(() => {
    return localStorage.getItem("allow_edit_old_attendance") === "true";
  });

  const [showLeavesView, setShowLeavesView] = useState(() => {
    return localStorage.getItem("show_leaves_view") === "true";
  });

  const [ignoreSundays, setIgnoreSundays] = useState(() => {
    return localStorage.getItem("ignore_sundays") === "true";
  });

  const [ignoreSaturdays, setIgnoreSaturdays] = useState(() => {
    return localStorage.getItem("ignore_saturdays") === "true";
  });

  const handleToggleEditOldAttendance = (val: boolean) => {
    setAllowEditOldAttendance(val);
    localStorage.setItem("allow_edit_old_attendance", val ? "true" : "false");
    showToast(`Old attendance editing is now ${val ? "enabled" : "disabled"}.`, "info");
  };

  const handleToggleLeavesView = (val: boolean) => {
    setShowLeavesView(val);
    localStorage.setItem("show_leaves_view", val ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("leaves_setting_changed"));
    showToast(`Leave Requests view is now ${val ? "enabled" : "disabled"}.`, "info");
  };

  const handleToggleIgnoreSundays = (val: boolean) => {
    setIgnoreSundays(val);
    localStorage.setItem("ignore_sundays", val ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
    showToast(`Ignore Sunday setting is now ${val ? "enabled" : "disabled"}.`, "info");
  };

  const handleToggleIgnoreSaturdays = (val: boolean) => {
    setIgnoreSaturdays(val);
    localStorage.setItem("ignore_saturdays", val ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
    showToast(`Ignore Saturday setting is now ${val ? "enabled" : "disabled"}.`, "info");
  };
  
  // Backfill pre-computed summaries
    
  
  // Data integrity loading
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ count: number; show: boolean }>({ count: 0, show: false });

  // CSV Import States
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewsToImport, setPreviewsToImport] = useState<ParsedStudentPreview[]>([]);
  const [importing, setImporting] = useState(false);
  
  const [mapInvalidClassesDialogOpen, setMapInvalidClassesDialogOpen] = useState(false);

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
  const isOwnerOrSuperAdmin =
    userProfile?.role === "owner" ||
    userProfile?.role === "admin" ||
    userProfile?.email === "sekhar.root@gmail.com";

  const getRoleChip = (role?: string | null) => {
    switch (role) {
      case "principal":
        return (
          <Chip
            label="Principal (Read-Only)"
            color="info"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "owner":
        return (
          <Chip
            label="Owner"
            color="warning"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "admin":
        return (
          <Chip
            label="Admin Mode"
            color="error"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "academic_coordinator":
        return (
          <Chip
            label="Academic Coordinator"
            color="secondary"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      case "class_teacher":
        return (
          <Chip
            label="Class Teacher"
            color="success"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        );
      default:
        return role ? (
          <Chip
            label={role}
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        ) : null;
    }
  };

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
      const newlyCreatedClassObjects: ClassItem[] = [];
      const activeSchoolId = userProfile?.schoolId || getActiveSchoolId() || "default_school";
      
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
          newlyCreatedClassObjects.push(newClass);
        }
      }

      if (newlyCreatedClassObjects.length > 0) {
        const updatedClassesList = [...classes, ...newlyCreatedClassObjects];
        setClasses(updatedClassesList);
        await cache.set("offline_classes", updatedClassesList);
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
          <Paper sx={{ p: 4, borderRadius: "10px", height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Account Preferences
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary">
                Logged in as: <strong>{currentUser?.email}</strong>
              </Typography>
              {getRoleChip(userProfile?.role)}
            </Box>
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
              <FormControlLabel
                control={
                  <Switch
                    checked={translucencyEnabled}
                    onChange={toggleTranslucency}
                  />
                }
                label="Glassmorphism (Default: Off)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={coloredNavIconsEnabled}
                    onChange={toggleColoredNavIcons}
                  />
                }
                label="Colored Floating Bar Icons (Tab Essence)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={allowEditOldAttendance}
                    onChange={(e) => handleToggleEditOldAttendance(e.target.checked)}
                  />
                }
                label="Allow Editing Old Attendance Data"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showLeavesView}
                    onChange={(e) => handleToggleLeavesView(e.target.checked)}
                  />
                }
                label="Enable Leave Requests View & Tab"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={ignoreSundays}
                    onChange={(e) => handleToggleIgnoreSundays(e.target.checked)}
                  />
                }
                label="Ignore Sunday"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={ignoreSaturdays}
                    onChange={(e) => handleToggleIgnoreSaturdays(e.target.checked)}
                  />
                }
                label="Ignore Saturday"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
              Display Zoom
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Adjust the scale of the user interface. Changes are saved automatically in persistent storage.
            </Typography>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => setZoomLevel(zoomLevel - 10)} 
                disabled={zoomLevel <= 50}
                title="Zoom Out"
              >
                <ZoomOut />
              </IconButton>
              
              <Slider
                value={zoomLevel}
                min={50}
                max={200}
                step={10}
                onChange={(_, newValue) => setZoomLevel(newValue as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flexGrow: 1 }}
              />
              
              <IconButton 
                size="small" 
                onClick={() => setZoomLevel(zoomLevel + 10)} 
                disabled={zoomLevel >= 200}
                title="Zoom In"
              >
                <ZoomIn />
              </IconButton>
              
              <Typography variant="body2" sx={{ minWidth: 45, textAlign: "right", fontWeight: "bold" }}>
                {zoomLevel}%
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center", mt: 1.5 }}>
              {[80, 90, 100, 110, 125, 150].map((preset) => (
                <Button
                  key={preset}
                  variant={zoomLevel === preset ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setZoomLevel(preset)}
                  sx={{ 
                    borderRadius: "10px", 
                    textTransform: "none", 
                    py: 0.25, 
                    px: 1.25,
                    minWidth: "unset",
                    fontSize: "0.75rem",
                  }}
                >
                  {preset}%
                </Button>
              ))}
              {zoomLevel !== 100 && (
                <Button
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={() => setZoomLevel(100)}
                  startIcon={<RestartAlt fontSize="small" />}
                  sx={{ 
                    textTransform: "none", 
                    fontSize: "0.75rem",
                    ml: "auto"
                  }}
                >
                  Reset
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      

        {isAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: "10px", height: "100%" }}>
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
                sx={{ borderRadius: "10px", textTransform: "none" }}
              >
                Assign Missing Profile IDs
              </Button>
            </Paper>
          </Grid>
      
        )}

        {!isReadOnly && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: "10px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
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
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
                >
                  Template
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  component="label"
                  disabled={offlineMode}
                  startIcon={<FileUpload />}
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
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
              <Paper sx={{ p: 4, borderRadius: "10px", height: "100%" }}>
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
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
                >
                  Go to Migration Tool
                </Button>
              </Paper>
            </Grid>
        )}
        
        {isOwnerOrSuperAdmin && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 4, borderRadius: "10px", height: "100%" }}>
              <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Build sx={{ mr: 1 }} /> Owner Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Advanced tools for managing data integrity. Use with caution.
              </Typography>
                 
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Build />}
                onClick={() => setMapInvalidClassesDialogOpen(true)}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "bold" }}
              >
                Map Invalid Classes
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      <MapInvalidClassesDialog
        open={mapInvalidClassesDialogOpen}
        onClose={() => setMapInvalidClassesDialogOpen(false)}
        students={students}
        classes={classes}
        onSuccess={(updatedStudents) => {
          showToast(`Successfully mapped ${updatedStudents.length} student${updatedStudents.length !== 1 ? 's' : ''}!`, "success");
          setMapInvalidClassesDialogOpen(false);
          const updatedIds = new Set(updatedStudents.map(s => s.id));
          const updated = students.map(s => updatedIds.has(s.id) ? updatedStudents.find(u => u.id === s.id)! : s);
          setStudents(updated);
          cache.set("offline_students", updated);
        }}
      />
      
      <CsvImportDialog
        open={importDialogOpen}
        onClose={() => !importing && setImportDialogOpen(false)}
        importing={importing}
        previewsToImport={previewsToImport}
        classes={classes}
        onConfirmImport={handleConfirmImport}
      />
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
          sx={{ borderRadius: "10px" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
      <Box sx={{ height: { xs: 120, sm: 160 }, width: "100%" }} />
    </Box>
  );
}

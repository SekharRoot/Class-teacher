import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  MenuItem,
  Tooltip,
} from "@mui/material";
import {
  PictureAsPdf,
  Code,
  Refresh,
  CalendarMonth,
  Calculate,
  Settings,
  ViewColumn,
} from "@mui/icons-material";
import { Student, ClassItem, StudentStatusFilter } from "../types";
import {
  generateMonthlyReportData,
  downloadMonthlyReportJson,
  MonthlyReportMatrixData,
} from "../utils/monthlyReportEngine";
import { generateMonthlyAttendancePdf } from "../utils/monthlyAttendancePdf";
import { useAuth } from "../contexts/AuthContext";
import { studentsApi } from "../api/students";

interface MonthlyReportPdfDialogProps {
  open: boolean;
  onClose: () => void;
  selectedClassId: string;
  classes: ClassItem[];
  students: Student[];
  initialMonth: string; // YYYY-MM
  onShowToast?: (
    msg: string,
    severity?: "success" | "error" | "warning" | "info"
  ) => void;
  initialStudentStatus?: StudentStatusFilter;
  initialIgnoreSundays?: boolean;
  initialIgnoreSaturdays?: boolean;
  initialSchoolName?: string;
  initialAcademicYear?: string;
  initialTermStartMonth?: string;
  initialUseCustomWd?: boolean;
  initialCustomWd?: number;
  initialUseCustomTotalWd?: boolean;
  initialCustomTotalWd?: number;
  initialIncludeTa?: boolean;
  initialIncludeTaPercent?: boolean;
  initialIncludePca?: boolean;
  initialIncludeTca?: boolean;
  initialIncludeTcaPercent?: boolean;
}

export const MonthlyReportPdfDialog: React.FC<MonthlyReportPdfDialogProps> = ({
  open,
  onClose,
  selectedClassId,
  classes,
  students,
  initialMonth,
  onShowToast,
  initialStudentStatus,
  initialIgnoreSundays,
  initialIgnoreSaturdays,
  initialSchoolName,
  initialAcademicYear,
  initialTermStartMonth,
  initialUseCustomWd,
  initialCustomWd,
  initialUseCustomTotalWd,
  initialCustomTotalWd,
  initialIncludeTa,
  initialIncludeTaPercent,
  initialIncludePca,
  initialIncludeTca,
  initialIncludeTcaPercent,
}) => {
  const { userProfile } = useAuth();

  // State configurations
  const [classId, setClassId] = useState<string>(selectedClassId || (classes[0]?.id ?? ""));
  const [month, setMonth] = useState<string>(initialMonth);
  const [academicYear, setAcademicYear] = useState<string>(initialAcademicYear || "");
  const [termStartMonth, setTermStartMonth] = useState<string>(initialTermStartMonth || "");
  const [schoolName, setSchoolName] = useState<string>(
    initialSchoolName || userProfile?.schoolName || "Classroom Attendance Management"
  );
  const [studentStatus, setStudentStatus] = useState<StudentStatusFilter>(
    initialStudentStatus || "active"
  );

  // Weekend toggles
  const [ignoreSundays, setIgnoreSundays] = useState<boolean>(() => {
    if (initialIgnoreSundays !== undefined) return initialIgnoreSundays;
    return typeof window !== "undefined" && localStorage.getItem("ignore_sundays") === "true";
  });
  const [ignoreSaturdays, setIgnoreSaturdays] = useState<boolean>(() => {
    if (initialIgnoreSaturdays !== undefined) return initialIgnoreSaturdays;
    return typeof window !== "undefined" && localStorage.getItem("ignore_saturdays") === "true";
  });

  // Custom overrides
  const [useCustomWd, setUseCustomWd] = useState(initialUseCustomWd ?? false);
  const [customWd, setCustomWd] = useState<number>(initialCustomWd ?? 22);
  const [useCustomTotalWd, setUseCustomTotalWd] = useState(initialUseCustomTotalWd ?? false);
  const [customTotalWd, setCustomTotalWd] = useState<number>(initialCustomTotalWd ?? 100);

  // Modular calculation options (TA, % TA, PCA, TCA, % TCA)
  const [includeTa, setIncludeTa] = useState(initialIncludeTa ?? true);
  const [includeTaPercent, setIncludeTaPercent] = useState(initialIncludeTaPercent ?? true);
  const [includePca, setIncludePca] = useState(initialIncludePca ?? true);
  const [includeTca, setIncludeTca] = useState(initialIncludeTca ?? true);
  const [includeTcaPercent, setIncludeTcaPercent] = useState(initialIncludeTcaPercent ?? true);

  // Data & Execution State
  const [computedData, setComputedData] = useState<MonthlyReportMatrixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculatedForCurrentSettings, setIsCalculatedForCurrentSettings] = useState(false);

  // Initialize academic year and term start month when dialog opens
  useEffect(() => {
    if (open && initialMonth) {
      setMonth(initialMonth);
      if (selectedClassId) {
        setClassId(selectedClassId);
      } else if (classes.length > 0 && !classId) {
        setClassId(classes[0].id);
      }
      if (initialStudentStatus) {
        setStudentStatus(initialStudentStatus);
      }
      if (initialIgnoreSundays !== undefined) {
        setIgnoreSundays(initialIgnoreSundays);
      }
      if (initialIgnoreSaturdays !== undefined) {
        setIgnoreSaturdays(initialIgnoreSaturdays);
      }
      if (initialSchoolName) {
        setSchoolName(initialSchoolName);
      }

      const parts = initialMonth.split("-");
      if (parts.length === 2) {
        const year = parseInt(parts[0], 10);
        const monthNum = parseInt(parts[1], 10);
        const startY = monthNum >= 4 ? year : year - 1;
        setAcademicYear(`${startY} - ${startY + 1}`);
        setTermStartMonth(`${startY}-04`);
      }
      setIsCalculatedForCurrentSettings(false);
      setComputedData(null);
    }
  }, [
    open,
    initialMonth,
    selectedClassId,
    initialStudentStatus,
    initialIgnoreSundays,
    initialIgnoreSaturdays,
    initialSchoolName,
  ]);

  // Mark calculation as outdated when any toggle changes
  const handleOptionChange = () => {
    setIsCalculatedForCurrentSettings(false);
  };

  const selectedClass = classes.find((c) => c.id === classId);
  const classDisplayName = selectedClass
    ? `${selectedClass.classStandard} ${selectedClass.section} (${selectedClass.board})`
    : "Selected Class";

  // Compute / Aggregate monthly data on explicit user action
  const computeDataAsync = async (): Promise<MonthlyReportMatrixData | null> => {
    if (!classId || !month) {
      setError("Please select both a class and month.");
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      // Ensure we have all student records for the selected class from Firestore & state
      let targetStudents: Student[] = students.filter((s) => s.classId === classId);
      try {
        const fresh = await studentsApi.getByClass(classId);
        if (fresh && fresh.length > 0) {
          const map = new Map<string, Student>();
          targetStudents.forEach((s) => map.set(s.id, s));
          fresh.forEach((s) => map.set(s.id, { ...(map.get(s.id) || {}), ...s }));
          targetStudents = Array.from(map.values());
        }
      } catch (e) {
        console.warn("Failed to fetch class students:", e);
      }

      const data = await generateMonthlyReportData(
        classId,
        classDisplayName,
        month,
        targetStudents,
        {
          schoolName,
          academicYear,
          termStartMonth,
          ignoreSundays,
          ignoreSaturdays,
          studentStatus,
          overrideWd: useCustomWd ? customWd : undefined,
          overrideTotalWd: useCustomTotalWd ? customTotalWd : undefined,
          includeTa,
          includeTaPercent,
          includePca,
          includeTca,
          includeTcaPercent,
        }
      );

      setComputedData(data);
      setIsCalculatedForCurrentSettings(true);
      if (!useCustomWd) {
        setCustomWd(data.workingDays);
      }
      if (!useCustomTotalWd) {
        setCustomTotalWd(data.totalWorkingDays);
      }
      return data;
    } catch (err: any) {
      console.error("Failed to compute monthly report:", err);
      setError(err?.message || "Failed to aggregate monthly report data.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleManualCalculate = async () => {
    await computeDataAsync();
  };

  // Actions
  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    setError(null);
    try {
      let data = computedData;
      if (!data || !isCalculatedForCurrentSettings) {
        data = await computeDataAsync();
      }
      if (!data) return;

      generateMonthlyAttendancePdf(data);
      if (onShowToast) {
        onShowToast("Monthly PDF report downloaded successfully!", "success");
      }
    } catch (err: any) {
      console.error("PDF generation error:", err);
      if (onShowToast) {
        onShowToast(`Failed to generate PDF: ${err?.message}`, "error");
      }
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadJson = async () => {
    try {
      let data = computedData;
      if (!data || !isCalculatedForCurrentSettings) {
        data = await computeDataAsync();
      }
      if (!data) return;

      downloadMonthlyReportJson(data);
      if (onShowToast) {
        onShowToast("MonthlyReport.json downloaded successfully!", "success");
      }
    } catch (err: any) {
      console.error("JSON export error:", err);
      if (onShowToast) {
        onShowToast(`Failed to export JSON: ${err?.message}`, "error");
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading || generatingPdf ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <PictureAsPdf color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Export Monthly Attendance PDF Report
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Configure report metrics, working days, and calculate the printable 39-column matrix.
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        {/* 1. Class & Month Selection */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Class"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value);
                handleOptionChange();
              }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.board} - {cls.classStandard} {cls.section}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              type="month"
              fullWidth
              size="small"
              label="Attendance Month"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                handleOptionChange();
              }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>

        {/* 2. Academic Year & Term Configuration */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Academic Year"
              placeholder="e.g. 2025 - 2026"
              value={academicYear}
              onChange={(e) => {
                setAcademicYear(e.target.value);
                handleOptionChange();
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              type="month"
              fullWidth
              size="small"
              label="Term Start (for PCA calculation)"
              value={termStartMonth}
              onChange={(e) => {
                setTermStartMonth(e.target.value);
                handleOptionChange();
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="Previous attendance counted from this month"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Student Profiles"
              value={studentStatus}
              onChange={(e) => {
                setStudentStatus(e.target.value as StudentStatusFilter);
                handleOptionChange();
              }}
            >
              <MenuItem value="active">Active Students (Currently)</MenuItem>
              <MenuItem value="active_entire_month">Active Entire Month</MenuItem>
              <MenuItem value="active_in_month">Active / Recorded During Month</MenuItem>
              <MenuItem value="inactive">Inactive Students Only</MenuItem>
              <MenuItem value="all">All (Active & Inactive)</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* 3. Modular Calculation & Column Toggles */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.04)"
                : "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              mb: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ViewColumn fontSize="small" color="primary" /> Modular Calculation & Column Options
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2.5 }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeTa}
                  onChange={(e) => {
                    setIncludeTa(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Total Attendance (TA)
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeTaPercent}
                  onChange={(e) => {
                    setIncludeTaPercent(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  TA Percentage (% TA)
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includePca}
                  onChange={(e) => {
                    setIncludePca(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Prev Cum. Attendance (PCA)
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeTca}
                  onChange={(e) => {
                    setIncludeTca(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Total Cum. Attendance (TCA)
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={includeTcaPercent}
                  onChange={(e) => {
                    setIncludeTcaPercent(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  TCA Percentage (% TCA)
                </Typography>
              }
            />
          </Box>
        </Paper>

        {/* 4. Working Days & Weekend Rules Card */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.04)"
                : "grey.50",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "bold", mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Calculate fontSize="small" color="primary" /> Working Days & Weekend Rules
          </Typography>

          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={useCustomWd}
                      onChange={(e) => {
                        setUseCustomWd(e.target.checked);
                        handleOptionChange();
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Custom Month WD
                    </Typography>
                  }
                />
                <TextField
                  type="number"
                  size="small"
                  label="Month WD"
                  value={useCustomWd ? customWd : computedData?.workingDays ?? customWd}
                  onChange={(e) => {
                    setCustomWd(Math.max(0, parseInt(e.target.value, 10) || 0));
                    handleOptionChange();
                  }}
                  disabled={!useCustomWd}
                  sx={{ width: 100 }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={useCustomTotalWd}
                      onChange={(e) => {
                        setUseCustomTotalWd(e.target.checked);
                        handleOptionChange();
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Custom Total WD
                    </Typography>
                  }
                />
                <TextField
                  type="number"
                  size="small"
                  label="Total WD (Term)"
                  value={useCustomTotalWd ? customTotalWd : computedData?.totalWorkingDays ?? customTotalWd}
                  onChange={(e) => {
                    setCustomTotalWd(Math.max(0, parseInt(e.target.value, 10) || 0));
                    handleOptionChange();
                  }}
                  disabled={!useCustomTotalWd}
                  sx={{ width: 110 }}
                />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 3, mt: 1.5, flexWrap: "wrap" }}>
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={ignoreSundays}
                  onChange={(e) => {
                    setIgnoreSundays(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={<Typography variant="body2">Ignore Sundays</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  size="small"
                  checked={ignoreSaturdays}
                  onChange={(e) => {
                    setIgnoreSaturdays(e.target.checked);
                    handleOptionChange();
                  }}
                />
              }
              label={<Typography variant="body2">Ignore Saturdays</Typography>}
            />
          </Box>
        </Paper>

        {/* 5. Live Aggregated Summary Preview */}
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 3, gap: 1.5 }}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Calculating daily marks, TA, PCA, and cumulative totals...
            </Typography>
          </Box>
        ) : computedData && isCalculatedForCurrentSettings ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.35)"
                  : "primary.light",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(25, 118, 210, 0.12)"
                  : "primary.50",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}>
              Report Summary Preview:
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Students:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {computedData.rows.length}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Month WD (Working Days):
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {computedData.workingDays}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Total Cumulative WD:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {computedData.totalWorkingDays}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  Cumulative PCA Sum:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {includePca ? computedData.totalPca : "-"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              borderRadius: 2,
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.02)"
                  : "transparent",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Configure options above and click <strong>Calculate & Preview</strong> or directly click <strong>Download PDF Report</strong> to begin calculation.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Calculate />}
            onClick={handleManualCalculate}
            disabled={loading || generatingPdf}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {loading ? "Calculating..." : "Calculate & Preview"}
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<Code />}
            onClick={handleDownloadJson}
            disabled={loading || generatingPdf}
            sx={{ textTransform: "none" }}
          >
            MonthlyReport.json
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button onClick={onClose} disabled={loading || generatingPdf} color="inherit" sx={{ textTransform: "none" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={generatingPdf ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdf />}
            onClick={handleDownloadPdf}
            disabled={loading || generatingPdf}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              borderRadius: 2,
            }}
          >
            {generatingPdf ? "Generating PDF..." : "Download PDF Report"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

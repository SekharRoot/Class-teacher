import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Paper, CircularProgress, Alert, Snackbar } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { attendanceApi, studentsApi } from "../api";
import { MonthlyReport, StudentStatusFilter } from "../types";
import { ReportFilters } from "../components/ReportFilters";
import { ReportSummaryCards } from "../components/ReportSummaryCards";
import { ReportTable } from "../components/ReportTable";
import { MonthlyReportPdfDialog } from "../components/MonthlyReportPdfDialog";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

export default function Reports() {
  const { classId, month } = useParams();
  const navigate = useNavigate();
  const { allClasses, authorizedClassIds } = useHierarchyScope();
  const { students: contextStudents } = useData();
  const { userProfile } = useAuth();

  const [selectedClassId, setSelectedClassId] = useState<string>(classId || "");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    month || format(new Date(), "yyyy-MM"),
  );
  const [studentStatus, setStudentStatus] = useState<StudentStatusFilter>("active");
  const [ignoreSundays, setIgnoreSundays] = useState<boolean>(() => {
    return typeof window !== "undefined" && localStorage.getItem("ignore_sundays") === "true";
  });
  const [ignoreSaturdays, setIgnoreSaturdays] = useState<boolean>(() => {
    return typeof window !== "undefined" && localStorage.getItem("ignore_saturdays") === "true";
  });

  // Advanced PDF Header & Working Days Override state
  const [schoolName, setSchoolName] = useState<string>(
    userProfile?.schoolName || "Classroom Attendance Management"
  );
  const [academicYear, setAcademicYear] = useState<string>("");
  const [termStartMonth, setTermStartMonth] = useState<string>("");
  const [useCustomWd, setUseCustomWd] = useState(false);
  const [customWd, setCustomWd] = useState<number>(22);
  const [useCustomTotalWd, setUseCustomTotalWd] = useState(false);
  const [customTotalWd, setCustomTotalWd] = useState<number>(100);

  // Column Toggles
  const [includeTa, setIncludeTa] = useState(true);
  const [includeTaPercent, setIncludeTaPercent] = useState(true);
  const [includePca, setIncludePca] = useState(true);
  const [includeTca, setIncludeTca] = useState(true);
  const [includeTcaPercent, setIncludeTcaPercent] = useState(true);

  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PDF Dialog state
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error" | "warning" | "info">("success");

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  const filteredClasses = allClasses.filter((c) =>
    authorizedClassIds.includes(c.id),
  );

  useEffect(() => {
    if (classId) {
      setSelectedClassId(classId);
    } else if (filteredClasses.length > 0 && !selectedClassId) {
      const firstId = filteredClasses[0].id;
      setSelectedClassId(firstId);
      updateUrl(firstId, selectedMonth);
    }
  }, [classId, filteredClasses, selectedClassId]);

  useEffect(() => {
    if (month) setSelectedMonth(month);
  }, [month]);

  const updateUrl = (id: string, m: string) => {
    navigate(`/reports/${id}/${m}`);
  };

  const generateReport = useCallback(async () => {
    if (!selectedClassId || !selectedMonth) return;

    setLoading(true);
    setError(null);
    try {
      // Fetch latest class students from API to ensure active & inactive profiles are captured
      let classStudents = [];
      try {
        classStudents = await studentsApi.getByClass(selectedClassId);
      } catch (err) {
        console.warn("Failed to fetch fresh class students, falling back to context:", err);
      }

      // Merge with context students for this class to ensure completeness
      const studentMap = new Map<string, any>();
      contextStudents
        .filter((s) => s.classId === selectedClassId)
        .forEach((s) => studentMap.set(s.id, s));
      classStudents.forEach((s) => studentMap.set(s.id, s));
      const mergedStudents = Array.from(studentMap.values());

      const data = await attendanceApi.getMonthlyReport(
        selectedMonth,
        selectedClassId,
        mergedStudents,
        {
          ignoreSundays,
          ignoreSaturdays,
          studentStatus,
          overrideTotalWd: useCustomWd ? customWd : undefined,
        }
      );
      setReport(data);
    } catch (err: any) {
      console.error("Error generating monthly report:", err);
      setError(err?.message || "Failed to generate monthly report. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    selectedClassId,
    selectedMonth,
    contextStudents,
    ignoreSundays,
    ignoreSaturdays,
    studentStatus,
    useCustomWd,
    customWd,
  ]);

  // Report generation is strictly manual via user action ("Generate Report" / "Calculate & Preview")
  // No auto-generation on mount or state changes.

  const downloadCSV = () => {
    if (!report) return;

    const formatCsvCell = (val: any) =>
      `"${String(val ?? "").replace(/"/g, '""')}"`;

    const headers = [
      "Student Name",
      "Roll Number",
      "Status",
      "Present",
      "Absent",
      "Leave",
      "Total Working Days",
      "Attendance %",
    ];

    const rows = report.entries.map((e) => [
      e.studentName,
      e.rollNumber,
      e.isActive === false ? "Inactive" : "Active",
      e.present,
      e.absent,
      e.leave,
      e.totalDays,
      `${e.attendancePercentage}%`,
    ]);

    const csvContent = [
      headers.map(formatCsvCell).join(","),
      ...rows.map((r) => r.map(formatCsvCell).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Attendance_Report_${selectedMonth}_${selectedClassId}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalDays = report?.totalWorkingDays ?? ((report?.entries && report.entries[0]?.totalDays) || 0);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Assessment sx={{ fontSize: 40, color: "primary.main" }} />
        Monthly Attendance Reports
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: "10px" }}>
        <ReportFilters
          classes={filteredClasses}
          selectedClassId={selectedClassId}
          onClassChange={(id) => {
            setSelectedClassId(id);
            updateUrl(id, selectedMonth);
          }}
          selectedMonth={selectedMonth}
          onMonthChange={(m) => {
            setSelectedMonth(m);
            if (selectedClassId) updateUrl(selectedClassId, m);
          }}
          studentStatus={studentStatus}
          onStatusChange={setStudentStatus}
          ignoreSundays={ignoreSundays}
          onIgnoreSundaysChange={setIgnoreSundays}
          ignoreSaturdays={ignoreSaturdays}
          onIgnoreSaturdaysChange={setIgnoreSaturdays}
          onGenerateReport={generateReport}
          loading={loading}
          schoolName={schoolName}
          onSchoolNameChange={setSchoolName}
          academicYear={academicYear}
          onAcademicYearChange={setAcademicYear}
          termStartMonth={termStartMonth}
          onTermStartMonthChange={setTermStartMonth}
          useCustomWd={useCustomWd}
          onUseCustomWdChange={setUseCustomWd}
          customWd={customWd}
          onCustomWdChange={setCustomWd}
          useCustomTotalWd={useCustomTotalWd}
          onUseCustomTotalWdChange={setUseCustomTotalWd}
          customTotalWd={customTotalWd}
          onCustomTotalWdChange={setCustomTotalWd}
          includeTa={includeTa}
          onIncludeTaChange={setIncludeTa}
          includeTaPercent={includeTaPercent}
          onIncludeTaPercentChange={setIncludeTaPercent}
          includePca={includePca}
          onIncludePcaChange={setIncludePca}
          includeTca={includeTca}
          onIncludeTcaChange={setIncludeTca}
          includeTcaPercent={includeTcaPercent}
          onIncludeTcaPercentChange={setIncludeTcaPercent}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">
            Aggregating attendance data...
          </Typography>
        </Box>
      ) : report ? (
        <Box>
          <ReportSummaryCards
            workingDays={totalDays}
            totalStudents={(report.entries && report.entries.length) || 0}
            onDownloadCSV={downloadCSV}
            onDownloadPdf={() => setPdfDialogOpen(true)}
          />

          <ReportTable entries={report.entries} />
        </Box>
      ) : (
        <Paper
          sx={{
            p: 10,
            textAlign: "center",
            borderRadius: "10px",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Assessment sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select a class and month to generate the attendance report.
          </Typography>
        </Paper>
      )}

      {/* Monthly Attendance Report PDF Dialog */}
      {pdfDialogOpen && (
        <MonthlyReportPdfDialog
          open={pdfDialogOpen}
          onClose={() => setPdfDialogOpen(false)}
          selectedClassId={selectedClassId}
          classes={filteredClasses}
          students={contextStudents}
          initialMonth={selectedMonth}
          onShowToast={showToast}
          initialStudentStatus={studentStatus}
          initialIgnoreSundays={ignoreSundays}
          initialIgnoreSaturdays={ignoreSaturdays}
          initialSchoolName={schoolName}
          initialAcademicYear={academicYear}
          initialTermStartMonth={termStartMonth}
          initialUseCustomWd={useCustomWd}
          initialCustomWd={customWd}
          initialUseCustomTotalWd={useCustomTotalWd}
          initialCustomTotalWd={customTotalWd}
          initialIncludeTa={includeTa}
          initialIncludeTaPercent={includeTaPercent}
          initialIncludePca={includePca}
          initialIncludeTca={includeTca}
          initialIncludeTcaPercent={includeTcaPercent}
        />
      )}

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
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

      {/* Safety buffer for floating bottom navigation bar */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
}


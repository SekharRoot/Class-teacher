import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import { Assessment } from "@mui/icons-material";
import { format } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { attendanceApi } from "../api";
import { MonthlyReport } from "../types";
import { ReportFilters } from "../components/ReportFilters";
import { ReportSummaryCards } from "../components/ReportSummaryCards";
import { ReportTable } from "../components/ReportTable";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { useData } from "../contexts/DataContext";

export default function Reports() {
  const { classId, month } = useParams();
  const navigate = useNavigate();
  const { allClasses, authorizedClassIds, loadingScope } = useHierarchyScope();
  const { students } = useData();

  const [selectedClassId, setSelectedClassId] = useState<string>(classId || "");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    month || format(new Date(), "yyyy-MM"),
  );
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generateReport = async () => {
    if (!selectedClassId || !selectedMonth) return;

    setLoading(true);
    setError(null);
    try {
      const data = await attendanceApi.getMonthlyReport(
        selectedMonth,
        selectedClassId,
        students,
      );
      setReport(data);
    } catch (err) {
      setError("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!report) return;

    const headers = [
      "Student Name",
      "Roll Number",
      "Present",
      "Late",
      "Absent",
      "Leave",
      "Total Working Days",
      "Attendance %",
    ];
    const rows = report.entries.map((e) => [
      e.studentName,
      e.rollNumber,
      e.present,
      e.late || 0,
      e.absent,
      e.leave,
      e.totalDays,
      `${e.attendancePercentage}%`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
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

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
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
          onGenerateReport={generateReport}
          loading={loading}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
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
            workingDays={report.entries[0]?.totalDays || 0}
            totalStudents={report.entries.length}
            onDownloadCSV={downloadCSV}
          />

          <ReportTable entries={report.entries} />
        </Box>
      ) : (
        <Paper
          sx={{
            p: 10,
            textAlign: "center",
            borderRadius: 3,
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
    </Box>
  );
}

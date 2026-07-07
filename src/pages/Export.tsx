import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import { PictureAsPdf, Download } from "@mui/icons-material";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useProfilesData } from "../hooks/useProfilesData";
import { attendanceApi } from "../api/attendance";
import { useHierarchyScope } from "../hooks/useHierarchyScope";

export default function Export() {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  const { classes, students } = useProfilesData(showToast);
  const { authorizedClassIds } = useHierarchyScope();

  const [selectedClassId, setSelectedClassId] = useState<string>("all");
  const filteredExportClasses = classes.filter((c) =>
    authorizedClassIds.includes(c.id),
  );
  const [exportType, setExportType] = useState<string>("date"); // 'date', 'month'
  const [exportTarget, setExportTarget] = useState<string>("attendance"); // 'attendance', 'profiles'
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );

  const handleExport = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      let classFilterName = "All Classes";
      if (selectedClassId !== "all") {
        const classInfo = classes.find((c) => c.id === selectedClassId);
        if (classInfo)
          classFilterName = `${classInfo.board} - ${classInfo.classStandard} ${classInfo.section}`;
      }

      let filteredStudents = students;
      if (selectedClassId !== "all") {
        filteredStudents = students.filter(
          (s) => s.classId === selectedClassId,
        );
      } else {
        filteredStudents = students.filter(
          (s) => s.classId && authorizedClassIds.includes(s.classId),
        );
      }

      if (exportTarget === "profiles") {
        doc.setFontSize(18);
        doc.text("Student Profiles Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Class: ${classFilterName}`, 14, 30);

        const head = [["Roll No", "Name", "Gender", "Phone", "Boarder Type"]];
        const body: any[] = [];

        filteredStudents.forEach((student) => {
          body.push([
            student.rollNumber,
            `${student.firstName} ${student.lastName}`,
            student.gender,
            student.phoneNumber || "N/A",
            student.boarderType || "N/A",
          ]);
        });

        autoTable(doc, {
          startY: 38,
          head: head,
          body: body,
          theme: "grid",
          headStyles: { fillColor: [25, 118, 210] },
        });

        doc.save(
          `Student_Profiles_${selectedClassId === "all" ? "All" : selectedClassId}.pdf`,
        );
        showToast("Profiles PDF exported successfully!");
      } else {
        doc.setFontSize(18);
        doc.text("Attendance Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`Class: ${classFilterName}`, 14, 30);

        const head = [["Roll No", "Name", "Status"]];
        const body: any[] = [];

        if (exportType === "date") {
          doc.text(
            `Date: ${format(parseISO(selectedDate), "dd MMM yyyy")}`,
            14,
            38,
          );
          const records = await attendanceApi.getByDate(selectedDate);

          filteredStudents.forEach((student) => {
            const status = records[student.id] || "N/A";
            body.push([
              student.rollNumber,
              `${student.firstName} ${student.lastName}`,
              status,
            ]);
          });

          autoTable(doc, {
            startY: 45,
            head: head,
            body: body,
            theme: "grid",
            headStyles: { fillColor: [25, 118, 210] },
          });
        } else if (exportType === "month") {
          doc.text(
            `Month: ${format(parseISO(selectedMonth + "-01"), "MMM yyyy")}`,
            14,
            38,
          );

          // Find all history dates
          const history = await attendanceApi.getHistory();
          const monthStart = startOfMonth(parseISO(selectedMonth + "-01"));
          const monthEnd = endOfMonth(parseISO(selectedMonth + "-01"));

          const datesInMonth = history
            .filter((h) => {
              const d = parseISO(h.date);
              return d >= monthStart && d <= monthEnd;
            })
            .map((h) => h.date)
            .sort();

          if (datesInMonth.length === 0) {
            throw new Error(
              "No attendance records found for the selected month.",
            );
          }

          // Fetch records for all dates in month
          const recordsMap: Record<string, Record<string, string>> = {};
          for (const date of datesInMonth) {
            recordsMap[date] = await attendanceApi.getByDate(date);
          }

          const monthHead = [
            [
              "Roll No",
              "Name",
              ...datesInMonth.map((d) => format(parseISO(d), "dd/MM")),
            ],
          ];
          const monthBody: any[] = [];

          filteredStudents.forEach((student) => {
            const row = [
              student.rollNumber,
              `${student.firstName} ${student.lastName}`,
            ];
            datesInMonth.forEach((date) => {
              const status = recordsMap[date][student.id];
              row.push(
                status === "Present"
                  ? "P"
                  : status === "Absent"
                    ? "A"
                    : "-",
              );
            });
            monthBody.push(row);
          });

          autoTable(doc, {
            startY: 45,
            head: monthHead,
            body: monthBody,
            theme: "grid",
            headStyles: { fillColor: [25, 118, 210] },
            styles: { fontSize: 8, cellPadding: 1 },
          });
        }

        doc.save(
          `Attendance_Report_${exportType === "date" ? selectedDate : selectedMonth}.pdf`,
        );
        showToast("Attendance PDF exported successfully!");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to generate PDF.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      let filteredStudents = students;
      if (selectedClassId !== "all") {
        filteredStudents = students.filter(
          (s) => s.classId === selectedClassId,
        );
      } else {
        filteredStudents = students.filter(
          (s) => s.classId && authorizedClassIds.includes(s.classId),
        );
      }

      let csvContent = "";
      let fileName = "";

      if (exportTarget === "profiles") {
        csvContent +=
          "Roll No,First Name,Last Name,Class ID,Gender,Phone,Boarder Type\n";
        filteredStudents.forEach((student) => {
          csvContent += `${student.rollNumber},"${student.firstName}","${student.lastName}",${student.classId},${student.gender},${student.phoneNumber || ""},${student.boarderType || ""}\n`;
        });
        fileName = `Student_Profiles_${selectedClassId === "all" ? "All" : selectedClassId}.csv`;
      } else {
        if (exportType === "date") {
          const records = await attendanceApi.getByDate(selectedDate);

          csvContent += "Roll No,Name,Status\n";

          filteredStudents.forEach((student) => {
            const status = records[student.id] || "N/A";
            const name = `"${student.firstName} ${student.lastName}"`;
            csvContent += `${student.rollNumber},${name},${status}\n`;
          });
          fileName = `Attendance_Report_${selectedDate}.csv`;
        } else if (exportType === "month") {
          const history = await attendanceApi.getHistory();
          const monthStart = startOfMonth(parseISO(selectedMonth + "-01"));
          const monthEnd = endOfMonth(parseISO(selectedMonth + "-01"));

          const datesInMonth = history
            .filter((h) => {
              const d = parseISO(h.date);
              return d >= monthStart && d <= monthEnd;
            })
            .map((h) => h.date)
            .sort();

          if (datesInMonth.length === 0) {
            throw new Error(
              "No attendance records found for the selected month.",
            );
          }

          const recordsMap: Record<string, Record<string, string>> = {};
          for (const date of datesInMonth) {
            recordsMap[date] = await attendanceApi.getByDate(date);
          }

          const dateHeaders = datesInMonth
            .map((d) => format(parseISO(d), "dd/MM"))
            .join(",");
          csvContent += `Roll No,Name,${dateHeaders}\n`;

          filteredStudents.forEach((student) => {
            const name = `"${student.firstName} ${student.lastName}"`;
            let row = `${student.rollNumber},${name}`;

            datesInMonth.forEach((date) => {
              const status = recordsMap[date][student.id];
              row += `,${status === "Present" ? "P" : status === "Absent" ? "A" : "-"}`;
            });

            csvContent += row + "\n";
          });
          fileName = `Attendance_Report_${selectedMonth}.csv`;
        }
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("CSV exported successfully!");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Failed to generate CSV.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "md", mx: "auto", pb: 6 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 4,
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        Export Reports
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Export Data
        </Typography>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Target</InputLabel>
              <Select
                value={exportTarget}
                label="Target"
                onChange={(e) => setExportTarget(e.target.value)}
              >
                <MenuItem value="attendance">Attendance Report</MenuItem>
                <MenuItem value="profiles">Student Profiles</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Class</InputLabel>
              <Select
                value={selectedClassId}
                label="Class"
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <MenuItem value="all">All Permitted Classes</MenuItem>
                {filteredExportClasses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.board} - {c.classStandard} {c.section}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {exportTarget === "attendance" && (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Export Type</InputLabel>
                  <Select
                    value={exportType}
                    label="Export Type"
                    onChange={(e) => setExportType(e.target.value)}
                  >
                    <MenuItem value="date">Specific Date</MenuItem>
                    <MenuItem value="month">Entire Month Summary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                {exportType === "date" ? (
                  <TextField
                    fullWidth
                    label="Select Date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Select Month"
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              </Grid>
            </>
          )}

          <Grid size={{ xs: 12 }} sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PictureAsPdf />
                )
              }
              onClick={handleExport}
              disabled={loading}
              fullWidth
            >
              Generate PDF Report
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Download />
                )
              }
              onClick={handleExportCSV}
              disabled={loading}
              fullWidth
            >
              Download CSV
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

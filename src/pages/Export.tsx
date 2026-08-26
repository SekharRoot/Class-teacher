import React, { useState } from "react";
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
import { Download } from "@mui/icons-material";
import { format, parseISO, getDaysInMonth } from "date-fns";
import { useProfilesData } from "../hooks/useProfilesData";
import { attendanceApi } from "../api/attendance";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { studentsApi } from "../api/students";
import { studentCache } from "../utils/studentCache";
import { Student } from "../types";
import { unwrapStatus } from "../utils/statusHelper";

const getDisplayStatus = (status: string): string => {
  if (!status) return "-";
  const s = status.toLowerCase();
  if (s === "present") return "Present";
  if (s === "absent") return "Absent";
  if (s === "leave") return "Leave";
  return status;
};

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

  const { classes, offlineMode } = useProfilesData(showToast);
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
  const [selectedBoarderType, setSelectedBoarderType] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("active"); // 'active', 'inactive', 'all'

  const getFullStudentsForExport = async (): Promise<Student[]> => {
    if (offlineMode) {
      const allCached = await studentCache.getAll();
      return allCached;
    }

    try {
      if (selectedClassId !== "all") {
        const classStudents = await studentsApi.getByClass(selectedClassId);
        await studentCache.setBatch(classStudents);
        return classStudents;
      } else {
        const permittedClasses = classes.filter((c) => authorizedClassIds.includes(c.id));
        const allStudents = await studentsApi.getAllInParallelChunks(permittedClasses);
        await studentCache.setBatch(allStudents);
        return allStudents;
      }
    } catch (err) {
      console.warn("Failed to fetch fresh students from server for export, falling back to local cache:", err);
      const allCached = await studentCache.getAll();
      return allCached;
    }
  };

  const handleExportCSV = async () => {
    setLoading(true);
    try {
      const fullStudentsList = await getFullStudentsForExport();
      let filteredStudents = fullStudentsList;
      if (selectedClassId !== "all") {
        filteredStudents = fullStudentsList.filter(
          (s) => s.classId === selectedClassId,
        );
      } else {
        filteredStudents = fullStudentsList.filter(
          (s) => s.classId && authorizedClassIds.includes(s.classId),
        );
      }

      if (selectedBoarderType !== "all") {
        filteredStudents = filteredStudents.filter(
          (s) => s.boarderType === selectedBoarderType,
        );
      }
      if (selectedGender !== "all") {
        filteredStudents = filteredStudents.filter(
          (s) => s.gender === selectedGender,
        );
      }
      if (selectedStatus === "active") {
        filteredStudents = filteredStudents.filter((s) => s.isActive !== false);
      } else if (selectedStatus === "inactive") {
        filteredStudents = filteredStudents.filter((s) => s.isActive === false);
      }

      let csvContent = "";
      let fileName = "";

      if (exportTarget === "profiles") {
        const includeStatusCol = selectedStatus === "all";
        csvContent += includeStatusCol
          ? "Roll No,First Name,Last Name,Class ID,Gender,Phone,Boarder Type,Status\n"
          : "Roll No,First Name,Last Name,Class ID,Gender,Phone,Boarder Type\n";
        filteredStudents.forEach((student) => {
          const statusStr = student.isActive !== false ? "Active" : "Inactive";
          csvContent += includeStatusCol
            ? `${student.rollNumber},"${student.firstName}","${student.lastName}",${student.classId},${student.gender},${student.phoneNumber || ""},${student.boarderType || ""},${statusStr}\n`
            : `${student.rollNumber},"${student.firstName}","${student.lastName}",${student.classId},${student.gender},${student.phoneNumber || ""},${student.boarderType || ""}\n`;
        });
        fileName = `Student_Profiles_${selectedStatus}_${selectedClassId === "all" ? "All" : selectedClassId}.csv`;
      } else {
        if (exportType === "date") {
          const records = await attendanceApi.getByDate(
            selectedDate,
            selectedClassId !== "all" ? [selectedClassId] : authorizedClassIds
          );

          csvContent += "Roll No,Name,Status\n";

          filteredStudents.forEach((student) => {
            const statusVal = records[student.id];
            const statusStr = statusVal ? getDisplayStatus(unwrapStatus(statusVal)) : "N/A";
            const name = `"${student.firstName} ${student.lastName}"`;
            csvContent += `${student.rollNumber},${name},${statusStr}\n`;
          });
          fileName = `Attendance_Report_${selectedDate}.csv`;
        } else if (exportType === "month") {
          // Fast range query for the entire month's classwise attendance records
          const classesToFetch = selectedClassId !== "all" ? [selectedClassId] : authorizedClassIds;
          const recordsMap = await attendanceApi.getMonthlyRecords(selectedMonth, classesToFetch);

          const ignoreSundays = localStorage.getItem("ignore_sundays") === "true";
          const ignoreSaturdays = localStorage.getItem("ignore_saturdays") === "true";
          let datesInMonth = Object.keys(recordsMap).sort();
          if (datesInMonth.length === 0) {
            const monthStart = parseISO(selectedMonth + "-01");
            const totalDays = getDaysInMonth(monthStart);
            datesInMonth = Array.from({ length: totalDays }, (_, i) => {
              const day = (i + 1).toString().padStart(2, "0");
              return `${selectedMonth}-${day}`;
            });
          }
          if (ignoreSundays) {
            datesInMonth = datesInMonth.filter((d) => parseISO(d).getDay() !== 0);
          }
          if (ignoreSaturdays) {
            datesInMonth = datesInMonth.filter((d) => parseISO(d).getDay() !== 6);
          }

          const dateHeaders = datesInMonth
            .map((d) => format(parseISO(d), "dd/MM"))
            .join(",");
          csvContent += `Roll No,Name,${dateHeaders},Total Present,Total Absent\n`;

          filteredStudents.forEach((student) => {
            const name = `"${student.firstName} ${student.lastName}"`;
            let row = `${student.rollNumber},${name}`;
            let presentCount = 0;
            let absentCount = 0;

            datesInMonth.forEach((date) => {
              const status = recordsMap[date]?.[student.id];
              const s = status ? status.toLowerCase() : "";
              if (s === "present") presentCount++;
              if (s === "absent") absentCount++;
              row += `,${s === "present" ? "P" : s === "absent" ? "A" : s === "leave" ? "L" : "-"}`;
            });

            row += `,${presentCount},${absentCount}`;
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

      <Paper sx={{ p: 4, borderRadius: "10px" }}>
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

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Boarder Type</InputLabel>
              <Select
                value={selectedBoarderType}
                label="Boarder Type"
                onChange={(e) => setSelectedBoarderType(e.target.value)}
              >
                <MenuItem value="all">All Boarder Types</MenuItem>
                <MenuItem value="Day Scholar">Day Scholar</MenuItem>
                <MenuItem value="Day Boarder">Day Boarder</MenuItem>
                <MenuItem value="Full Boarder">Full Boarder</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={selectedGender}
                label="Gender"
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <MenuItem value="all">All Genders</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Profile Status</InputLabel>
              <Select
                value={selectedStatus}
                label="Profile Status"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="active">Active Profiles Only (Default)</MenuItem>
                <MenuItem value="inactive">Inactive / Removed Profiles Only</MenuItem>
                <MenuItem value="all">All Profiles (Active & Inactive)</MenuItem>
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

          <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
            <Button
              variant="contained"
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
      <Box sx={{ height: { xs: 120, sm: 160 }, width: "100%" }} />
    </Box>
  );
}

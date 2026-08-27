import { isStudentInClass } from "../../utils/classUtils";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { Download, PictureAsPdf } from "@mui/icons-material";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { attendanceApi } from "../../api";
import { Student, ClassItem } from "../../types";
import { unwrapStatus } from "../../utils/statusHelper";

interface DailyStatusReportProps {
  students: Student[];
  classes: ClassItem[];
  authorizedClassIds: string[];
}

interface ClassRowData {
  classId: string;
  className: string;
  total: number;
  totalDB: number;
  totalDS: number;
  totalBoarder: number;
  present: number;
  presentDB: number;
  presentDS: number;
  presentBoarder: number;
  absent: number;
  absentDB: number;
  absentDS: number;
  absentBoarder: number;
}

export const DailyStatusReport = React.memo(({
  students,
  classes,
  authorizedClassIds,
}: DailyStatusReportProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const dateString = format(selectedDate, "yyyy-MM-dd");

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const data = await attendanceApi.getByDate(dateString, authorizedClassIds);
        setAttendance(data || {});
      } catch (error) {
        console.error("Error fetching attendance for report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [dateString, authorizedClassIds]);

  const reportData = useMemo(() => {
    const filteredClasses = classes.filter((c) => authorizedClassIds.includes(c.id));
    const activeStudents = students.filter((s) => {
      const isCurrentlyActive = s.isActive !== false;
      let wasActiveOnDate = isCurrentlyActive;
      if (!isCurrentlyActive && s.deactivatedAt) {
        wasActiveOnDate = s.deactivatedAt >= dateString;
      }
      return wasActiveOnDate && s.classId && filteredClasses.some((c) => isStudentInClass(s, c));
    });

    return filteredClasses.map((cls) => {
      const classStudents = activeStudents.filter((s) => isStudentInClass(s, cls));
      
      const row: ClassRowData = {
        classId: cls.id,
        className: `${cls.classStandard} ${cls.section} (${cls.board})`,
        total: classStudents.length,
        totalDB: classStudents.filter(s => s.boarderType === "Day Boarder").length,
        totalDS: classStudents.filter(s => s.boarderType === "Day Scholar").length,
        totalBoarder: classStudents.filter(s => s.boarderType === "Full Boarder").length,
        present: 0,
        presentDB: 0,
        presentDS: 0,
        presentBoarder: 0,
        absent: 0,
        absentDB: 0,
        absentDS: 0,
        absentBoarder: 0,
      };

      classStudents.forEach((student) => {
        const record = attendance[student.id];
        const status = unwrapStatus(record);

        const normalizedStatus = status.toLowerCase();
        const isPresent = normalizedStatus === "present";
        const isAbsent = normalizedStatus === "absent";

        if (isPresent) {
          row.present++;
          if (student.boarderType === "Day Boarder") row.presentDB++;
          else if (student.boarderType === "Day Scholar") row.presentDS++;
          else if (student.boarderType === "Full Boarder") row.presentBoarder++;
        } else if (isAbsent) {
          row.absent++;
          if (student.boarderType === "Day Boarder") row.absentDB++;
          else if (student.boarderType === "Day Scholar") row.absentDS++;
          else if (student.boarderType === "Full Boarder") row.absentBoarder++;
        }
      });

      return row;
    });
  }, [classes, students, authorizedClassIds, attendance, dateString]);

  const totals = useMemo(() => {
    return reportData.reduce(
      (acc, r) => ({
        total: acc.total + r.total,
        totalDB: acc.totalDB + r.totalDB,
        totalDS: acc.totalDS + r.totalDS,
        totalBoarder: acc.totalBoarder + r.totalBoarder,
        present: acc.present + r.present,
        presentDB: acc.presentDB + r.presentDB,
        presentDS: acc.presentDS + r.presentDS,
        presentBoarder: acc.presentBoarder + r.presentBoarder,
        absent: acc.absent + r.absent,
        absentDB: acc.absentDB + r.absentDB,
        absentDS: acc.absentDS + r.absentDS,
        absentBoarder: acc.absentBoarder + r.absentBoarder,
      }),
      {
        total: 0,
        totalDB: 0,
        totalDS: 0,
        totalBoarder: 0,
        present: 0,
        presentDB: 0,
        presentDS: 0,
        presentBoarder: 0,
        absent: 0,
        absentDB: 0,
        absentDS: 0,
        absentBoarder: 0,
      }
    );
  }, [reportData]);

  const exportToCSV = () => {
    const headers = [
      "Class", "Total Students", "Total DB", "Total DS", "Total BOARDER",
      "Present", "Present DB", "Present DS", "Present Boarders",
      "Absent", "Absent DB", "Absent DS", "Absent Boarders"
    ];
    
    const rows = reportData.map(row => [
      `"${row.className.replace(/"/g, '""')}"`,
      row.total,
      row.totalDB,
      row.totalDS,
      row.totalBoarder,
      row.present,
      row.presentDB,
      row.presentDS,
      row.presentBoarder,
      row.absent,
      row.absentDB,
      row.absentDS,
      row.absentBoarder
    ]);

    rows.push([
      `"TOTAL (${reportData.length} Classes)"`,
      totals.total,
      totals.totalDB,
      totals.totalDS,
      totals.totalBoarder,
      totals.present,
      totals.presentDB,
      totals.presentDS,
      totals.presentBoarder,
      totals.absent,
      totals.absentDB,
      totals.absentDS,
      totals.absentBoarder
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `daily_attendance_${dateString}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // Add title & metadata
    doc.setFontSize(16);
    doc.setTextColor(33, 33, 33);
    doc.text("Daily Attendance Status Report", 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Date: ${dateString}`, 14, 21);
    doc.text(`Generated At: ${new Date().toLocaleString()}`, 14, 26);

    const head = [[
      "Class", "Total", "Total DB", "Total DS", "Total Boarder",
      "Present", "Present DB", "Present DS", "Present Boarders",
      "Absent", "Absent DB", "Absent DS", "Absent Boarders"
    ]];

    const body = reportData.map(row => [
      row.className,
      row.total,
      row.totalDB,
      row.totalDS,
      row.totalBoarder,
      row.present,
      row.presentDB,
      row.presentDS,
      row.presentBoarder,
      row.absent,
      row.absentDB,
      row.absentDS,
      row.absentBoarder
    ]);

    body.push([
      `TOTAL (${reportData.length} Classes)`,
      totals.total,
      totals.totalDB,
      totals.totalDS,
      totals.totalBoarder,
      totals.present,
      totals.presentDB,
      totals.presentDS,
      totals.presentBoarder,
      totals.absent,
      totals.absentDB,
      totals.absentDS,
      totals.absentBoarder
    ]);

    autoTable(doc, {
      startY: 32,
      head: head,
      body: body,
      theme: "grid",
      styles: {
        fontSize: 7.5,
        cellPadding: 1.8,
        halign: "center",
        valign: "middle",
        overflow: "linebreak"
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold", cellWidth: "auto" }
      },
      headStyles: {
        fillColor: [25, 118, 210], // Primary color
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8
      },
      margin: { top: 32, right: 10, bottom: 15, left: 10 }
    });

    doc.save(`daily_attendance_${dateString}.pdf`);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Daily Attendance Status Report
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 2, alignSelf: { xs: "flex-end", sm: "auto" } }}>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            startIcon={<Download />}
            onClick={exportToCSV}
            disabled={loading || reportData.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            size="small"
            color="primary"
            startIcon={<PictureAsPdf />}
            onClick={exportToPDF}
            disabled={loading || reportData.length === 0}
          >
            Export PDF
          </Button>
          <TextField
            type="date"
            label="Select Date"
            value={dateString}
            onChange={(e) => {
              const val = e.target.value;
              if (val) {
                const [y, m, d] = val.split("-").map(Number);
                setSelectedDate(new Date(y, m - 1, d));
              }
            }}
            size="small"
            slotProps={{
              inputLabel: { shrink: true }
            }}
            sx={{ width: 180 }}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "10px",
            boxShadow: "none",
            border: "1px solid",
            borderColor: "divider",
            overflowX: "auto",
            "& .MuiTableCell-root": {
              border: "1px solid",
              borderColor: "divider",
              px: { xs: 0.5, sm: 1 },
              py: { xs: 0.4, sm: 0.6 },
              fontSize: { xs: "0.72rem", sm: "0.8rem" },
            },
          }}
        >
          <Table size="small" stickyHeader sx={{ minWidth: 700, borderCollapse: "collapse" }}>
            <TableHead>
              {/* Tier 1: Category Super Headers */}
              <TableRow>
                <TableCell
                  rowSpan={2}
                  sx={{
                    fontWeight: 800,
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.100"),
                    minWidth: 130,
                    verticalAlign: "middle",
                  }}
                >
                  Class
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{
                    fontWeight: 800,
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.200"),
                    color: "text.primary",
                    borderBottomWidth: "2px",
                  }}
                >
                  Enrolled Strength
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{
                    fontWeight: 800,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.25)" : "#e8f5e9",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "success.light" : "success.dark",
                    borderBottomWidth: "2px",
                  }}
                >
                  Present Today
                </TableCell>
                <TableCell
                  colSpan={4}
                  align="center"
                  sx={{
                    fontWeight: 800,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.25)" : "#ffebee",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "error.light" : "error.dark",
                    borderBottomWidth: "2px",
                  }}
                >
                  Absent Today
                </TableCell>
              </TableRow>

              {/* Tier 2: Sub-headers */}
              <TableRow>
                {/* Strength sub-headers */}
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100") }}>
                  Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100"), color: "text.secondary" }}>
                  DB
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100"), color: "text.secondary" }}>
                  DS
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100"), color: "text.secondary" }}>
                  Bdr
                </TableCell>

                {/* Present sub-headers */}
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.15)" : "#f1f8e9", color: "success.main" }}>
                  Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.15)" : "#f1f8e9", color: "success.main" }}>
                  DB
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.15)" : "#f1f8e9", color: "success.main" }}>
                  DS
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(46, 125, 50, 0.15)" : "#f1f8e9", color: "success.main" }}>
                  Bdr
                </TableCell>

                {/* Absent sub-headers */}
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.15)" : "#fbe9e7", color: "error.main" }}>
                  Total
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.15)" : "#fbe9e7", color: "error.main" }}>
                  DB
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.15)" : "#fbe9e7", color: "error.main" }}>
                  DS
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, bgcolor: (theme) => theme.palette.mode === "dark" ? "rgba(211, 47, 47, 0.15)" : "#fbe9e7", color: "error.main" }}>
                  Bdr
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row, idx) => (
                <TableRow
                  key={row.classId}
                  hover
                  sx={{
                    bgcolor: idx % 2 === 1 ? "action.hover" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontWeight: 600 }}>{row.className}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>{row.total}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalDB}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalDS}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalBoarder}</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: 700, color: "success.main" }}>{row.present}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.85 }}>{row.presentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.85 }}>{row.presentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.85 }}>{row.presentBoarder}</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: 700, color: "error.main" }}>{row.absent}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.85 }}>{row.absentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.85 }}>{row.absentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.85 }}>{row.absentBoarder}</TableCell>
                </TableRow>
              ))}
              {reportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No data available for the selected scope.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {reportData.length > 0 && (
              <TableFooter>
                <TableRow
                  sx={{
                    bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "grey.200"),
                    "& .MuiTableCell-root": {
                      fontWeight: 800,
                      borderTop: "2px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 800 }}>Total ({reportData.length} Classes)</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>{totals.total}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{totals.totalDB}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{totals.totalDS}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{totals.totalBoarder}</TableCell>

                  <TableCell align="center" sx={{ color: "success.main", fontWeight: 800 }}>{totals.present}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main" }}>{totals.presentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main" }}>{totals.presentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main" }}>{totals.presentBoarder}</TableCell>

                  <TableCell align="center" sx={{ color: "error.main", fontWeight: 800 }}>{totals.absent}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main" }}>{totals.absentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main" }}>{totals.absentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main" }}>{totals.absentBoarder}</TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      )}
    </Box>
  );
});

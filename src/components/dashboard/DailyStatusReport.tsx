import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
        const data = await attendanceApi.getByDate(dateString);
        setAttendance(data || {});
      } catch (error) {
        console.error("Error fetching attendance for report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [dateString]);

  const reportData = useMemo(() => {
    const filteredClasses = classes.filter((c) => authorizedClassIds.includes(c.id));
    const activeStudents = students.filter((s) => s.isActive !== false && s.classId && authorizedClassIds.includes(s.classId));

    return filteredClasses.map((cls) => {
      const classStudents = activeStudents.filter((s) => s.classId === cls.id);
      
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
        let status = "";
        if (record) {
          if (typeof record === "object" && record !== null) {
            status = (record as any).status || "";
          } else {
            status = String(record);
          }
        }

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
  }, [classes, students, authorizedClassIds, attendance]);

  const exportToCSV = () => {
    const headers = [
      "Class", "Total Students", "Total DB", "Total DS", "Total BOARDER",
      "Present", "Present DB", "Present DS", "Present Boarders",
      "Absent", "Absent DS", "Absent DB", "Absent Boarders"
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
      row.absentDS,
      row.absentDB,
      row.absentBoarder
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
      "Absent", "Absent DS", "Absent DB", "Absent Boarders"
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
      row.absentDS,
      row.absentDB,
      row.absentBoarder
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
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold", bgcolor: "inherit" }}>Class</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "inherit" }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "inherit" }}>Total DB</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "inherit" }}>Total DS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "inherit" }}>Total BOARDER</TableCell>
                
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "success.light", color: "success.contrastText" }}>Present</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "success.light", color: "success.contrastText" }}>Present DB</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "success.light", color: "success.contrastText" }}>Present DS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "success.light", color: "success.contrastText" }}>Present Boarders</TableCell>
                
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "error.light", color: "error.contrastText" }}>Absent</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "error.light", color: "error.contrastText" }}>Absent DS</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "error.light", color: "error.contrastText" }}>Absent DB</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", bgcolor: "error.light", color: "error.contrastText" }}>Absent Boarders</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.classId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{row.className}</TableCell>
                  <TableCell align="center">{row.total}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalDB}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalDS}</TableCell>
                  <TableCell align="center" sx={{ color: "text.secondary" }}>{row.totalBoarder}</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "success.main" }}>{row.present}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.8 }}>{row.presentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.8 }}>{row.presentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "success.main", opacity: 0.8 }}>{row.presentBoarder}</TableCell>
                  
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "error.main" }}>{row.absent}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.8 }}>{row.absentDS}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.8 }}>{row.absentDB}</TableCell>
                  <TableCell align="center" sx={{ color: "error.main", opacity: 0.8 }}>{row.absentBoarder}</TableCell>
                </TableRow>
              ))}
              {reportData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 4 }}>
                    No data available for the selected scope.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
});

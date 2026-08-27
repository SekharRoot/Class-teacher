import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Student, AttendanceStatus } from "../types";
import { runCalculationWorker } from "../workers/calculator";

interface AttendanceSummaryProps {
  students: Student[];
  attendance: Record<string, AttendanceStatus>;
  selectedClassId: string | null;
}

export const AttendanceSummary: React.FC<AttendanceSummaryProps> = ({
  students,
  attendance,
  selectedClassId,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [showLeavesView, setShowLeavesView] = useState(() => {
    return localStorage.getItem("show_leaves_view") === "true";
  });

  useEffect(() => {
    const handleSettingChange = () => {
      setShowLeavesView(localStorage.getItem("show_leaves_view") === "true");
    };
    window.addEventListener("storage", handleSettingChange);
    window.addEventListener("leaves_setting_changed", handleSettingChange);
    return () => {
      window.removeEventListener("storage", handleSettingChange);
      window.removeEventListener("leaves_setting_changed", handleSettingChange);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const calculate = async () => {
      try {
        const result = await runCalculationWorker("CALCULATE_SUMMARY", {
          students,
          attendance,
          selectedClassId,
        });
        if (active) {
          setStats(result);
        }
      } catch (err) {
        console.error("Worker calculation error:", err);
      }
    };
    calculate();
    return () => {
      active = false;
    };
  }, [students, attendance, selectedClassId]);

  if (!stats) {
    return (
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          mt: 2,
          borderRadius: "10px",
          border: "1px solid",
          borderColor: "divider",
          p: 1,
        }}
      >
        <Skeleton variant="text" width="100%" height={40} />
        <Skeleton variant="rectangular" width="100%" height={120} sx={{ mt: 1, borderRadius: 1 }} />
      </TableContainer>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={1}
      sx={{
        mt: { xs: 1.5, sm: 2 },
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <Table
        size="small"
        sx={{
          width: "100%",
          minWidth: 280,
          "& td, & th": {
            border: "1px solid",
            borderColor: "divider",
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.6, sm: 0.8 },
            fontSize: { xs: "0.75rem", sm: "0.85rem" },
            textAlign: "center",
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: "action.hover" }}>
            <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>Present</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "error.main" }}>Absent</TableCell>
            {showLeavesView && (
              <TableCell sx={{ fontWeight: "bold", color: "info.main" }}>Leave</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ bgcolor: "background.paper" }}>
            <TableCell sx={{ fontWeight: "bold" }}>All</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>{stats.totalCount || 0}</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "success.main" }}>
              {stats.presentCount || 0}
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "error.main" }}>
              {stats.absentCount || 0}
            </TableCell>
            {showLeavesView && (
              <TableCell sx={{ fontWeight: "bold", color: "info.main" }}>
                {stats.leaveCount || 0}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>DS</TableCell>
            <TableCell>{stats.totalDayScholar || 0}</TableCell>
            <TableCell sx={{ color: "success.main", fontWeight: 600 }}>
              {stats.presentDayScholar || 0}
            </TableCell>
            <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
              {stats.absentDayScholar || 0}
            </TableCell>
            {showLeavesView && (
              <TableCell sx={{ color: "info.main", fontWeight: 600 }}>
                {stats.leaveDayScholar || 0}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>DB</TableCell>
            <TableCell>{stats.totalDayBoarder || 0}</TableCell>
            <TableCell sx={{ color: "success.main", fontWeight: 600 }}>
              {stats.presentDayBoarder || 0}
            </TableCell>
            <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
              {stats.absentDayBoarder || 0}
            </TableCell>
            {showLeavesView && (
              <TableCell sx={{ color: "info.main", fontWeight: 600 }}>
                {stats.leaveDayBoarder || 0}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>B</TableCell>
            <TableCell>{stats.totalFullBoarder || 0}</TableCell>
            <TableCell sx={{ color: "success.main", fontWeight: 600 }}>
              {stats.presentFullBoarder || 0}
            </TableCell>
            <TableCell sx={{ color: "error.main", fontWeight: 600 }}>
              {stats.absentFullBoarder || 0}
            </TableCell>
            {showLeavesView && (
              <TableCell sx={{ color: "info.main", fontWeight: 600 }}>
                {stats.leaveFullBoarder || 0}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};


import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
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

  const renderStats = (ds: number, db: number, fb: number, color: string) => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 1.5,
        mt: 1,
        flexWrap: "wrap",
      }}
    >
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        <strong>DS:</strong> {ds || 0}
      </Typography>
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        <strong>DB:</strong> {db || 0}
      </Typography>
      <Typography variant="caption" sx={{ color, fontWeight: 700 }}>
        <strong>B:</strong> {fb || 0}
      </Typography>
    </Box>
  );

  if (!stats) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: showLeavesView
            ? {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              }
            : {
                xs: "repeat(1, 1fr)",
                sm: "repeat(3, 1fr)",
              },
          gap: 2,
          width: "100%",
          mt: 2,
        }}
      >
        {(showLeavesView ? [1, 2, 3, 4] : [1, 2, 3]).map((i) => (
          <Paper
            key={i}
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Skeleton variant="text" width="60%" sx={{ mx: "auto" }} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mx: "auto", my: 0.5 }} />
            <Skeleton variant="text" width="70%" sx={{ mx: "auto" }} />
          </Paper>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: showLeavesView
          ? {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            }
          : {
              xs: "repeat(1, 1fr)",
              sm: "repeat(3, 1fr)",
            },
        gap: 2,
        width: "100%",
        mt: 2,
      }}
    >
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          gridColumn: showLeavesView
            ? { xs: "span 2", sm: "span 1" }
            : "span 1",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: "bold" }}
        >
          Total Students
        </Typography>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: "bold" }}>
          {stats.totalCount || 0}
        </Typography>
        {renderStats(
          stats.totalDayScholar,
          stats.totalDayBoarder,
          stats.totalFullBoarder,
          "text.secondary",
        )}
      </Paper>
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: "success.50",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "success.200",
        }}
      >
        <Typography
          variant="body2"
          color="success.main"
          sx={{ fontWeight: "bold" }}
        >
          Present
        </Typography>
        <Typography variant="h5" color="success.main" sx={{ mt: 1, fontWeight: "bold" }}>
          {stats.presentCount || 0}
        </Typography>
        {renderStats(
          stats.presentDayScholar,
          stats.presentDayBoarder,
          stats.presentFullBoarder,
          "success.main",
        )}
      </Paper>
      <Paper
        sx={{
          p: 2,
          textAlign: "center",
          bgcolor: "error.50",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "error.200",
        }}
      >
        <Typography
          variant="body2"
          color="error.main"
          sx={{ fontWeight: "bold" }}
        >
          Absent
        </Typography>
        <Typography variant="h5" color="error.main" sx={{ mt: 1, fontWeight: "bold" }}>
          {stats.absentCount || 0}
        </Typography>
        {renderStats(
          stats.absentDayScholar,
          stats.absentDayBoarder,
          stats.absentFullBoarder,
          "error.main",
        )}
      </Paper>
      {showLeavesView && (
        <Paper
          sx={{
            p: 2,
            textAlign: "center",
            bgcolor: "info.50",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "info.200",
          }}
        >
          <Typography
            variant="body2"
            color="info.main"
            sx={{ fontWeight: "bold" }}
          >
            Leave
          </Typography>
          <Typography variant="h5" color="info.main" sx={{ mt: 1, fontWeight: "bold" }}>
            {stats.leaveCount || 0}
          </Typography>
          {renderStats(
            stats.leaveDayScholar,
            stats.leaveDayBoarder,
            stats.leaveFullBoarder,
            "info.main",
          )}
        </Paper>
      )}
    </Box>
  );
};

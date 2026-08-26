import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { MonthlyReportEntry } from "../types";

interface ReportTableProps {
  entries: MonthlyReportEntry[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          borderRadius: 2,
          border: "1px dashed",
          borderColor: "divider",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          No student attendance records found matching the selected filters for this month.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: "10px", overflow: "hidden", boxShadow: 2 }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", bgcolor: "action.hover" }}>
              Student Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", bgcolor: "action.hover" }}>
              Roll No.
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "action.hover" }}
            >
              Present
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "action.hover" }}
            >
              Absent
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "action.hover" }}
            >
              Leave
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "action.hover" }}
            >
              Attendance %
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.studentId} hover>
              <TableCell sx={{ fontWeight: "medium" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{entry.studentName}</span>
                  {entry.isActive === false && (
                    <Chip
                      label="Inactive"
                      size="small"
                      color="default"
                      sx={{ height: 20, fontSize: "0.675rem" }}
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell>{entry.rollNumber}</TableCell>
              <TableCell align="center">
                <Chip
                  label={entry.present}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={entry.absent}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={entry.leave}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color:
                      entry.attendancePercentage >= 75
                        ? "success.main"
                        : entry.attendancePercentage >= 50
                          ? "warning.main"
                          : "error.main",
                  }}
                >
                  {entry.attendancePercentage}%
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

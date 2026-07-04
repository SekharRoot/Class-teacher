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
} from "@mui/material";
import { MonthlyReportEntry } from "../types";

interface ReportTableProps {
  entries: MonthlyReportEntry[];
}

export const ReportTable: React.FC<ReportTableProps> = ({ entries }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 3, overflow: "hidden", boxShadow: 3 }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
              Student Name
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", bgcolor: "grey.100" }}>
              Roll No.
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
            >
              Present
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
            >
              Late
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
            >
              Absent
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
            >
              Leave
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", bgcolor: "grey.100" }}
            >
              Attendance %
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.studentId} hover>
              <TableCell sx={{ fontWeight: "medium" }}>
                {entry.studentName}
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
                  label={entry.late || 0}
                  size="small"
                  color="warning"
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
                      entry.attendancePercentage > 75
                        ? "success.main"
                        : entry.attendancePercentage > 50
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

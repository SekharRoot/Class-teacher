import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import { History } from "@mui/icons-material";
import { format } from "date-fns";

interface HistoryRecord {
  date: string;
  present: number;
  absent: number;
  leave: number;
  late: number;
}

interface AttendanceHistoryProps {
  historyDates: HistoryRecord[];
  dateString: string;
  onDateSelect: (date: string) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  historyDates,
  dateString,
  onDateSelect,
}) => {
  return (
    <Box>
      {historyDates.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <History sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No attendance logs found for other dates.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Generate or take attendance on different dates to build a historical
            list.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {historyDates.map((record) => {
            const total =
              record.present +
              record.absent +
              record.leave +
              (record.late || 0);
            const isSelected = record.date === dateString;

            return (
              <Paper
                key={record.date}
                elevation={1}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  borderLeft: isSelected ? "5px solid #1976d2" : "1px solid",
                  borderColor: isSelected ? "primary.main" : "divider",
                  backgroundColor: isSelected
                    ? "rgba(25, 118, 210, 0.04)"
                    : "background.paper",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: 2,
                    backgroundColor: isSelected
                      ? "rgba(25, 118, 210, 0.06)"
                      : "rgba(0,0,0,0.01)",
                  },
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold" }}
                    color="text.primary"
                  >
                    {format(new Date(record.date + "T12:00:00"), "dd/MM/yyyy")}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    Date ID: {record.date} • Total Logged: {total} students
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      size="small"
                      variant="outlined"
                      color="success"
                      label={`P: ${record.present}`}
                      sx={{ fontWeight: 600 }}
                    />
                    <Chip
                      size="small"
                      variant="outlined"
                      color="error"
                      label={`A: ${record.absent}`}
                      sx={{ fontWeight: 600 }}
                    />
                    {record.late > 0 && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="warning"
                        label={`Late: ${record.late}`}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                    {record.leave > 0 && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color="info"
                        label={`Leave: ${record.leave}`}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Button
                    variant={isSelected ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    onClick={() => onDateSelect(record.date)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 4,
                      minWidth: 120,
                      fontWeight: "bold",
                    }}
                  >
                    {isSelected ? "Currently Selected" : "Open Attendance"}
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

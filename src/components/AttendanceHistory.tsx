import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import { History, ExpandMore } from "@mui/icons-material";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

interface HistoryRecord {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

interface AttendanceHistoryProps {
  historyDates: HistoryRecord[];
  dateString: string;
  onDateSelect: (date: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  historyDates,
  dateString,
  onDateSelect,
  onLoadMore,
  hasMore = false,
}) => {
  const [isFetching, setIsFetching] = useState(false);

  const visibleDates = historyDates;

  const handleLoadMore = () => {
    if (isFetching || !onLoadMore) return;
    setIsFetching(true);
    onLoadMore();
    setTimeout(() => {
      setIsFetching(false);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 25 },
    },
  };

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
            No attendance logs found in recent history.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fetch older historical logs from previous dates or take new attendance.
          </Typography>
          {onLoadMore && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoadMore}
              disabled={isFetching}
              startIcon={
                isFetching ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <ExpandMore />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: 4,
                px: 3.5,
                py: 1,
                fontWeight: "bold",
                boxShadow: 2,
              }}
            >
              {isFetching ? "Fetching older logs..." : "Load Older Attendance Data"}
            </Button>
          )}
        </Paper>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {visibleDates.map((record) => {
              const total =
                record.present +
                record.absent +
                record.leave;
              const isSelected = record.date === dateString;

              return (
                <motion.div key={record.date} variants={itemVariants}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 2,
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
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
                        sx={{ fontWeight: "bold", fontSize: { xs: "1.05rem", sm: "1.25rem" } }}
                        color="text.primary"
                      >
                        {format(new Date(record.date + "T12:00:00"), "dd/MM/yyyy")}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontFamily: "monospace", display: "block", mt: 0.25 }}
                      >
                        Date ID: {record.date} • Total Logged: {total} students
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "stretch", sm: "center" },
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: { xs: "space-between", sm: "flex-start" } }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          color="success"
                          label={`P: ${record.present}`}
                          sx={{ fontWeight: 600, flexGrow: { xs: 1, sm: 0 } }}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          color="error"
                          label={`A: ${record.absent}`}
                          sx={{ fontWeight: 600, flexGrow: { xs: 1, sm: 0 } }}
                        />
                        {record.leave > 0 && (
                          <Chip
                            size="small"
                            variant="outlined"
                            color="info"
                            label={`Leave: ${record.leave}`}
                            sx={{ fontWeight: 600, flexGrow: { xs: 1, sm: 0 } }}
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
                          minWidth: { xs: "100%", sm: 120 },
                          fontWeight: "bold",
                        }}
                      >
                        {isSelected ? "Currently Selected" : "Open Attendance"}
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              );
            })}
          </motion.div>

          {hasMore && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 2,
                mb: 4,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLoadMore}
                disabled={isFetching}
                startIcon={
                  isFetching ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <ExpandMore />
                  )
                }
                sx={{
                  textTransform: "none",
                  borderRadius: 4,
                  px: 4,
                  py: 1,
                  fontWeight: "bold",
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                  },
                }}
              >
                {isFetching ? "Fetching previous attendance..." : "Load More"}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

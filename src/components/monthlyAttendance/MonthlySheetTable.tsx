import React from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Tooltip,
  Chip,
} from "@mui/material";
import { format, isToday, isPast, getDay } from "date-fns";
import { Student } from "../../types";
import { ModifiedCell } from "./types";
import { MemoizedAttendanceCell } from "./MemoizedAttendanceCell";

interface MonthlySheetTableProps {
  classStudents: Student[];
  monthDays: Date[];
  dayInfoMap: Record<
    string,
    { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }
  >;
  ignoreSaturday: boolean;
  isDarkMode: boolean;
  allowEditOld: boolean;
  readOnly: boolean;
  modifiedCells: Map<string, ModifiedCell>;
  studentStatsMap: Record<
    string,
    { present: number; absent: number; leave: number; percentage: number }
  >;
  getCellStatus: (studentId: string, dateStr: string) => string;
  onCellClick: (
    e: React.MouseEvent<HTMLElement>,
    studentId: string,
    dateStr: string,
    currentStatus: string,
    studentName: string,
  ) => void;
}

export const MonthlySheetTable: React.FC<MonthlySheetTableProps> = ({
  classStudents,
  monthDays,
  dayInfoMap,
  ignoreSaturday,
  isDarkMode,
  allowEditOld,
  readOnly,
  modifiedCells,
  studentStatsMap,
  getCellStatus,
  onCellClick,
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 2,
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: "70vh",
        transform: "translateZ(0)",
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 1000, tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
            {/* Sticky Student Column */}
            <TableCell
              sx={{
                position: "sticky",
                left: 0,
                zIndex: 10,
                bgcolor: "background.paper",
                width: 200,
                minWidth: 200,
                fontWeight: "bold",
                borderRight: "2px solid",
                borderColor: "divider",
              }}
            >
              Student ({classStudents.length})
            </TableCell>

            {/* Day Columns */}
            {monthDays.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const dayNumber = format(day, "d");
              const dayName = format(day, "EEE");
              const isCurrentDay = isToday(day);
              const dayOfWeek = getDay(day);
              const isSunday = dayOfWeek === 0;
              const isSaturday = dayOfWeek === 6;
              const dayInfo = dayInfoMap[dateStr];
              const isHoliday = !!dayInfo?.isHoliday;

              return (
                <TableCell
                  key={dateStr}
                  align="center"
                  sx={{
                    width: 48,
                    minWidth: 48,
                    px: 0.25,
                    py: 0.75,
                    bgcolor: isCurrentDay
                      ? isDarkMode
                        ? "rgba(25, 118, 210, 0.2)"
                        : "primary.50"
                      : isHoliday
                        ? isDarkMode
                          ? "rgba(237, 108, 2, 0.2)"
                          : "warning.50"
                        : isSunday || (isSaturday && ignoreSaturday)
                          ? "action.hover"
                          : "background.paper",
                    borderBottom: isCurrentDay ? "2px solid" : undefined,
                    borderColor: isCurrentDay ? "primary.main" : "divider",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: isCurrentDay ? "bold" : "medium", fontSize: "0.75rem" }}
                      color={isCurrentDay ? "primary.main" : "text.primary"}
                    >
                      {dayNumber}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={isSunday || isSaturday ? "error.main" : "text.secondary"}
                      sx={{ fontSize: "0.65rem" }}
                    >
                      {dayName}
                    </Typography>

                    {isHoliday && (
                      <Tooltip
                        title={
                          typeof dayInfo?.dayReason === "string" && dayInfo.dayReason.trim()
                            ? dayInfo.dayReason
                            : "Holiday / Off"
                        }
                        arrow
                      >
                        <Box
                          sx={{
                            mt: 0.25,
                            px: 0.4,
                            py: 0.1,
                            bgcolor: "warning.main",
                            color: "warning.contrastText",
                            borderRadius: 0.5,
                            fontSize: "0.55rem",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {typeof dayInfo?.dayReasonType === "string" && dayInfo.dayReasonType === "weekly_off" ? "Off" : "Hol"}
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              );
            })}

            {/* Summary Columns */}
            <TableCell
              align="center"
              sx={{
                bgcolor: "action.hover",
                fontWeight: "bold",
                color: isDarkMode ? "#81c784" : "#1b5e20",
                width: 44,
                minWidth: 44,
                borderLeft: "2px solid",
                borderColor: "divider",
              }}
            >
              P
            </TableCell>
            <TableCell
              align="center"
              sx={{
                bgcolor: "action.hover",
                fontWeight: "bold",
                color: isDarkMode ? "#ef5350" : "#b71c1c",
                width: 44,
                minWidth: 44,
              }}
            >
              A
            </TableCell>
            <TableCell
              align="center"
              sx={{
                bgcolor: "action.hover",
                fontWeight: "bold",
                color: isDarkMode ? "#ffb74d" : "#e65100",
                width: 44,
                minWidth: 44,
              }}
            >
              L
            </TableCell>
            <TableCell
              align="center"
              sx={{ bgcolor: "action.hover", fontWeight: "bold", width: 52, minWidth: 52 }}
            >
              %
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {classStudents.map((student) => {
            const stats = studentStatsMap[student.id] || {
              present: 0,
              absent: 0,
              leave: 0,
              percentage: 0,
            };
            const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim();

            return (
              <TableRow key={student.id} hover sx={{ height: 36 }}>
                {/* Sticky Student Column */}
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 5,
                    bgcolor: "background.paper",
                    borderRight: "2px solid",
                    borderColor: "divider",
                    py: 0.5,
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.825rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 130,
                        }}
                      >
                        {fullName}
                      </Typography>
                      {student.isActive === false && (
                        <Chip
                          label="Inactive"
                          size="small"
                          sx={{ height: 16, fontSize: "0.6rem" }}
                        />
                      )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                        Roll: {student.rollNumber || "-"}
                      </Typography>
                      {student.boarderType && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: "0.6rem",
                            color: "primary.main",
                            bgcolor: isDarkMode ? "rgba(25, 118, 210, 0.2)" : "primary.50",
                            px: 0.5,
                            borderRadius: 0.5,
                            fontWeight: 600,
                          }}
                        >
                          {student.boarderType === "Day Scholar"
                            ? "DS"
                            : student.boarderType === "Day Boarder"
                              ? "DB"
                              : "FB"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {/* Date Cells */}
                {monthDays.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const status = getCellStatus(student.id, dateStr);
                  const isPastDate = isPast(day) && !isToday(day);
                  const key = `${student.id}_${dateStr}`;
                  const isModified = modifiedCells.has(key);
                  const modifiedOriginalStatus = isModified
                    ? modifiedCells.get(key)?.originalStatus
                    : undefined;

                  return (
                    <MemoizedAttendanceCell
                      key={dateStr}
                      studentId={student.id}
                      dateStr={dateStr}
                      status={status}
                      isPastDate={isPastDate}
                      allowEditOld={allowEditOld}
                      isModified={isModified}
                      modifiedOriginalStatus={modifiedOriginalStatus}
                      isDarkMode={isDarkMode}
                      studentName={fullName}
                      readOnly={readOnly}
                      onClick={onCellClick}
                    />
                  );
                })}

                {/* Summary Stats */}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: isDarkMode ? "#81c784" : "#1b5e20",
                    borderLeft: "2px solid",
                    borderColor: "divider",
                    py: 0.5,
                  }}
                >
                  {stats.present}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: isDarkMode ? "#ef5350" : "#b71c1c",
                    py: 0.5,
                  }}
                >
                  {stats.absent}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                    color: isDarkMode ? "#ffb74d" : "#e65100",
                    py: 0.5,
                  }}
                >
                  {stats.leave}
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  <Chip
                    label={`${stats.percentage}%`}
                    size="small"
                    color={
                      stats.percentage >= 75
                        ? "success"
                        : stats.percentage >= 50
                          ? "warning"
                          : "error"
                    }
                    sx={{ height: 20, fontSize: "0.65rem", fontWeight: "bold" }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

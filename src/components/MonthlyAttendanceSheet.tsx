import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Badge,
  useTheme,
} from "@mui/material";
import {
  Save as SaveIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Today as TodayIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Undo as UndoIcon,
  FilterList as FilterListIcon,
  Celebration as CelebrationIcon,
  Weekend as WeekendIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isPast,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { Student, ClassItem, AttendanceStatus } from "../types";
import { attendanceApi } from "../api";
import { unwrapStatus } from "../utils/statusHelper";
import { loadMonthlySheetCache } from "../utils/monthlyAttendanceCache";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";

interface MonthlyAttendanceSheetProps {
  selectedClassId: string | null;
  classes?: ClassItem[];
  students: Student[];
  showToast?: (
    msg: string,
    severity?: "success" | "error" | "warning" | "info",
  ) => void;
  onNavigateSettings?: () => void;
  currentMonthDate?: Date;
  onMonthChange?: (date: Date) => void;
  readOnly?: boolean;
  allowEditOld?: boolean;
  onSaveSuccess?: () => void;
}

interface ModifiedCell {
  studentId: string;
  date: string;
  originalStatus: string;
  currentStatus: string;
}

export const MonthlyAttendanceSheet: React.FC<MonthlyAttendanceSheetProps> = ({
  selectedClassId,
  classes = [],
  students,
  showToast,
  onNavigateSettings,
  currentMonthDate: currentMonthDateProp,
  onMonthChange,
  readOnly = false,
  allowEditOld: allowEditOldProp,
  onSaveSuccess,
}) => {
  const theme = useTheme();

  // Current Month State (YYYY-MM)
  const [internalMonthDate, setInternalMonthDate] = useState<Date>(
    currentMonthDateProp || new Date(),
  );
  const currentMonthDate = currentMonthDateProp || internalMonthDate;
  const monthString = format(currentMonthDate, "yyyy-MM");

  const setMonthDate = (d: Date) => {
    if (onMonthChange) {
      onMonthChange(d);
    }
    setInternalMonthDate(d);
  };

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "all" | "inactive">("active");

  // Data State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recordsMap, setRecordsMap] = useState<Record<string, Record<string, string>>>({});
  const [dayInfoMap, setDayInfoMap] = useState<
    Record<string, { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }>
  >({});

  // Modifications State: key = `${studentId}_${date}`
  const [modifiedCells, setModifiedCells] = useState<Map<string, ModifiedCell>>(new Map());

  // Check Settings
  const [allowEditOldState, setAllowEditOldState] = useState<boolean>(() => {
    return localStorage.getItem("allow_edit_old_attendance") === "true";
  });
  const allowEditOld = allowEditOldProp !== undefined ? allowEditOldProp : allowEditOldState;

  const [ignoreSaturday, setIgnoreSaturday] = useState<boolean>(() => {
    return localStorage.getItem("ignore_saturday") === "true";
  });

  // Re-read settings periodically or when mounted
  useEffect(() => {
    setAllowEditOldState(localStorage.getItem("allow_edit_old_attendance") === "true");
    setIgnoreSaturday(localStorage.getItem("ignore_saturday") === "true");
  }, []);

  // Fetch Monthly Data when month or class changes
  const fetchMonthlyData = async (forceRefresh = false) => {
    if (!selectedClassId) return;

    // 1. Instant local storage cache check
    const activeSchoolId = getActiveSchoolId();
    const cached = loadMonthlySheetCache(activeSchoolId, selectedClassId, monthString);
    if (cached && !forceRefresh) {
      setRecordsMap(cached.recordsMap || {});
      setDayInfoMap(cached.dayInfoMap || {});
      setLoading(false);
    } else if (!cached) {
      setLoading(true);
    }

    try {
      const { recordsMap: fetchedRecords, dayInfoMap: fetchedDayInfo } =
        await attendanceApi.getMonthlyRecordsDetailed(monthString, selectedClassId, {
          forceRefresh,
        });

      setRecordsMap(fetchedRecords);
      setDayInfoMap(fetchedDayInfo);
      setModifiedCells(new Map()); // Reset pending modifications on month/class switch
      if (forceRefresh && showToast) {
        showToast("Monthly attendance synchronized with server", "success");
      }
    } catch (err) {
      console.error("Failed to load monthly records:", err);
      if (!cached) {
        showToast("Failed to load monthly attendance sheet data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyData(false);
  }, [monthString, selectedClassId]);

  // Compute all days in the selected month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonthDate);
    const end = endOfMonth(currentMonthDate);
    return eachDayOfInterval({ start, end });
  }, [currentMonthDate]);

  // Filter students for the selected class
  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students
      .filter((s) => s.classId === selectedClassId)
      .filter((s) => {
        if (statusFilter === "active") return s.isActive !== false;
        if (statusFilter === "inactive") return s.isActive === false;
        return true; // 'all'
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
        const roll = (s.rollNumber || "").toLowerCase();
        return fullName.includes(q) || roll.includes(q);
      })
      .sort((a, b) => {
        // Sort by numeric roll number if available, then by name
        const rollA = parseInt(a.rollNumber, 10);
        const rollB = parseInt(b.rollNumber, 10);
        if (!isNaN(rollA) && !isNaN(rollB)) return rollA - rollB;
        return (a.firstName || "").localeCompare(b.firstName || "");
      });
  }, [students, selectedClassId, statusFilter, searchQuery]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (modifiedCells.size > 0) {
      if (!window.confirm("You have unsaved modifications in the current month. Discard and switch month?")) {
        return;
      }
    }
    setMonthDate(subMonths(currentMonthDate, 1));
  };

  const handleNextMonth = () => {
    if (modifiedCells.size > 0) {
      if (!window.confirm("You have unsaved modifications in the current month. Discard and switch month?")) {
        return;
      }
    }
    setMonthDate(addMonths(currentMonthDate, 1));
  };

  const handleCurrentMonth = () => {
    if (modifiedCells.size > 0) {
      if (!window.confirm("You have unsaved modifications in the current month. Discard and return to today?")) {
        return;
      }
    }
    setMonthDate(new Date());
  };

  // Cell status change handler
  const handleStatusChange = (studentId: string, dateStr: string, newStatus: string) => {
    const isPastDate = isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr));
    if (isPastDate && !allowEditOld) {
      if (showToast) {
        showToast(
          "Modifying historical attendance is locked. Enable 'Allow Editing Old Attendance' in Settings to edit past dates.",
          "warning",
        );
      }
      return;
    }

    const key = `${studentId}_${dateStr}`;
    const original = recordsMap[dateStr]?.[studentId] || "";

    setModifiedCells((prev) => {
      const next = new Map(prev);
      if (newStatus === original) {
        next.delete(key);
      } else {
        next.set(key, {
          studentId,
          date: dateStr,
          originalStatus: original,
          currentStatus: newStatus,
        });
      }
      return next;
    });
  };

  // Discard all changes
  const handleDiscardChanges = () => {
    if (window.confirm("Are you sure you want to discard all unsaved changes in this sheet?")) {
      setModifiedCells(new Map());
      if (showToast) showToast("Changes discarded", "info");
    }
  };

  // Save all modified cells to Firebase
  const handleSaveChanges = async () => {
    if (!selectedClassId || modifiedCells.size === 0) return;
    try {
      setSaving(true);
      const modifications = Array.from(modifiedCells.values()).map((m) => ({
        studentId: m.studentId,
        date: m.date,
        status: m.currentStatus,
      }));

      await attendanceApi.saveMonthlyModifications(selectedClassId, modifications);

      // Update local recordsMap state
      setRecordsMap((prev) => {
        const next = { ...prev };
        modifications.forEach(({ studentId, date, status }) => {
          if (!next[date]) next[date] = {};
          next[date][studentId] = status;
        });
        return next;
      });

      const count = modifiedCells.size;
      setModifiedCells(new Map());
      if (showToast) {
        showToast(`Successfully saved ${count} attendance modification(s) to server!`, "success");
      }
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error("Failed to save modifications:", err);
      if (showToast) showToast("Failed to save modifications to server.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Helper to get effective status for a student on a date
  const getCellStatus = (studentId: string, dateStr: string) => {
    const key = `${studentId}_${dateStr}`;
    if (modifiedCells.has(key)) {
      return modifiedCells.get(key)!.currentStatus;
    }
    return recordsMap[dateStr]?.[studentId] || "";
  };

  // Helper to calculate student monthly statistics
  const getStudentStats = (studentId: string) => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let markedDays = 0;

    monthDays.forEach((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      const status = getCellStatus(studentId, dateStr);
      if (status === "present") {
        present++;
        markedDays++;
      } else if (status === "absent") {
        absent++;
        markedDays++;
      } else if (status === "leave") {
        leave++;
        markedDays++;
      }
    });

    const totalDays = markedDays || 1;
    const percentage = markedDays > 0 ? Math.round((present / markedDays) * 100) : 0;

    return { present, absent, leave, markedDays, percentage };
  };

  const selectedClassName =
    classes.find((c) => c.id === selectedClassId)
      ? `${classes.find((c) => c.id === selectedClassId)?.classStandard} - ${classes.find((c) => c.id === selectedClassId)?.section}`
      : "Class";

  if (!selectedClassId) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Please select a class above to view and manage its Monthly Attendance Sheet.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Top Header Card: Month Navigation, Search, Filters, and Save Button */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 1.25, sm: 2 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1.25, sm: 1.75 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 1.25,
          }}
        >
          {/* Month Navigator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "flex-start" },
              gap: { xs: 0.5, sm: 1 },
              flexWrap: "nowrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="Previous Month">
                <IconButton
                  onClick={handlePrevMonth}
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    p: { xs: 0.5, sm: 0.75 },
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  minWidth: { xs: 110, sm: 140 },
                  textAlign: "center",
                  fontSize: { xs: "0.92rem", sm: "1.05rem" },
                  userSelect: "none",
                }}
              >
                {format(currentMonthDate, "MMM yyyy")}
              </Typography>

              <Tooltip title="Next Month">
                <IconButton
                  onClick={handleNextMonth}
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    p: { xs: 0.5, sm: 0.75 },
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Tooltip title="Jump to current month">
              <Button
                size="small"
                variant="outlined"
                startIcon={<TodayIcon fontSize="small" />}
                onClick={handleCurrentMonth}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  py: 0.4,
                  px: { xs: 1, sm: 1.5 },
                  fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                  whiteSpace: "nowrap",
                }}
              >
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Today
                </Box>
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Current Month
                </Box>
              </Button>
            </Tooltip>
          </Box>

          {/* Action Buttons: Save Modifications & Discard & Refresh */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-end", sm: "flex-end" },
              gap: 1,
              flexWrap: "nowrap",
            }}
          >
            {modifiedCells.size > 0 && (
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<UndoIcon fontSize="small" />}
                onClick={handleDiscardChanges}
                disabled={saving}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  py: 0.4,
                  px: 1.25,
                  fontSize: "0.8125rem",
                  whiteSpace: "nowrap",
                }}
              >
                Discard
              </Button>
            )}

            <Button
              variant="contained"
              color={modifiedCells.size > 0 ? "primary" : "inherit"}
              size="small"
              startIcon={
                saving ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SaveIcon fontSize="small" />
                )
              }
              onClick={handleSaveChanges}
              disabled={modifiedCells.size === 0 || saving}
              sx={{
                borderRadius: 2,
                px: { xs: 1.5, sm: 2 },
                py: 0.5,
                fontWeight: "bold",
                fontSize: "0.8125rem",
                boxShadow: modifiedCells.size > 0 ? 2 : 0,
                textTransform: "none",
                whiteSpace: "nowrap",
              }}
            >
              {saving
                ? "Saving..."
                : modifiedCells.size > 0
                  ? `Save (${modifiedCells.size})`
                  : "Save Changes"}
            </Button>

            <Tooltip title="Sync & refresh sheet data from server">
              <IconButton
                onClick={() => fetchMonthlyData(true)}
                size="small"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  p: { xs: 0.5, sm: 0.75 },
                  borderRadius: 2,
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Filter Controls Row: Search & Active/All/Inactive Status */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 1.25,
            pt: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Search student or roll no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", sm: 240, md: 280 },
              "& .MuiInputBase-root": {
                height: 34,
                fontSize: "0.85rem",
              },
            }}
          />

          {/* Student Status Filter */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              gap: 0.75,
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, mr: 0.25 }}
            >
              Status:
            </Typography>
            <Chip
              label="Active"
              size="small"
              clickable
              color={statusFilter === "active" ? "primary" : "default"}
              variant={statusFilter === "active" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("active")}
              sx={{
                fontWeight: statusFilter === "active" ? 700 : 500,
                fontSize: "0.78rem",
                height: 28,
              }}
            />
            <Chip
              label="All"
              size="small"
              clickable
              color={statusFilter === "all" ? "primary" : "default"}
              variant={statusFilter === "all" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("all")}
              sx={{
                fontWeight: statusFilter === "all" ? 700 : 500,
                fontSize: "0.78rem",
                height: 28,
              }}
            />
            <Chip
              label="Inactive"
              size="small"
              clickable
              color={statusFilter === "inactive" ? "default" : "default"}
              variant={statusFilter === "inactive" ? "filled" : "outlined"}
              onClick={() => setStatusFilter("inactive")}
              sx={{
                fontWeight: statusFilter === "inactive" ? 700 : 500,
                fontSize: "0.78rem",
                height: 28,
                bgcolor:
                  statusFilter === "inactive"
                    ? (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.16)"
                          : "grey.300"
                    : "transparent",
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Lock Warning Banner if Old Attendance Editing is Disabled */}
      {!allowEditOld && (
        <Alert
          severity="info"
          icon={<LockIcon fontSize="inherit" />}
          action={
            onNavigateSettings ? (
              <Button color="inherit" size="small" onClick={onNavigateSettings}>
                Open Settings
              </Button>
            ) : undefined
          }
          sx={{ borderRadius: 2 }}
        >
          <strong>Historical Attendance Lock:</strong> You can only edit today's attendance. To enable editing past attendance dates in this sheet, toggle <strong>"Allow Editing Old Attendance Data"</strong> in Settings.
        </Alert>
      )}

      {/* Sheet Table */}
      {loading ? (
        <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
          <CircularProgress size={36} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Loading monthly attendance records for {selectedClassName}...
          </Typography>
        </Paper>
      ) : classStudents.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No students found in this class matching your filters.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: 2,
            overflowX: "auto",
            overflowY: "visible",
          }}
        >
          <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                {/* Sticky Student Column */}
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                    bgcolor: "background.paper",
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
                        minWidth: 64,
                        px: 0.5,
                        py: 1,
                        bgcolor: isCurrentDay
                          ? "primary.50"
                          : isHoliday
                            ? "warning.50"
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
                          sx={{ fontWeight: isCurrentDay ? "bold" : "medium" }}
                          color={isCurrentDay ? "primary.main" : "text.primary"}
                        >
                          {dayNumber}
                        </Typography>
                        <Typography
                          variant="caption"
                          color={isSunday || isSaturday ? "error.main" : "text.secondary"}
                          sx={{ fontSize: "0.675rem" }}
                        >
                          {dayName}
                        </Typography>

                        {/* Holiday Indicator */}
                        {isHoliday && (
                          <Tooltip title={dayInfo?.dayReason || "Holiday / Off"} arrow>
                            <Box
                              sx={{
                                mt: 0.25,
                                px: 0.5,
                                py: 0.1,
                                bgcolor: "warning.main",
                                color: "warning.contrastText",
                                borderRadius: 1,
                                fontSize: "0.6rem",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {dayInfo?.dayReasonType === "weekly_off" ? "Off" : "Hol"}
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}

                {/* Monthly Summary Statistics Columns */}
                <TableCell
                  align="center"
                  sx={{
                    bgcolor: "action.hover",
                    fontWeight: "bold",
                    color: "#1b5e20",
                    minWidth: 50,
                    borderLeft: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  P
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ bgcolor: "action.hover", fontWeight: "bold", color: "#b71c1c", minWidth: 50 }}
                >
                  A
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ bgcolor: "action.hover", fontWeight: "bold", color: "#e65100", minWidth: 50 }}
                >
                  L
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ bgcolor: "action.hover", fontWeight: "bold", minWidth: 65 }}
                >
                  %
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {classStudents.map((student) => {
                const stats = getStudentStats(student.id);

                return (
                  <TableRow key={student.id} hover>
                    {/* Sticky Student Column */}
                    <TableCell
                      sx={{
                        position: "sticky",
                        left: 0,
                        zIndex: 5,
                        bgcolor: "background.paper",
                        borderRight: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {student.firstName} {student.lastName}
                          </Typography>
                          {student.isActive === false && (
                            <Chip
                              label="Inactive"
                              size="small"
                              sx={{ height: 18, fontSize: "0.625rem" }}
                            />
                          )}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Typography variant="caption" color="text.secondary">
                            Roll: {student.rollNumber || "-"}
                          </Typography>
                          {student.boarderType && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.625rem",
                                color: "primary.main",
                                bgcolor: "primary.50",
                                px: 0.5,
                                borderRadius: 0.5,
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

                    {/* Date Dropdown Cells */}
                    {monthDays.map((day) => {
                      const dateStr = format(day, "yyyy-MM-dd");
                      const status = getCellStatus(student.id, dateStr);
                      const isPastDate = isPast(day) && !isToday(day);
                      const isCellDisabled = isPastDate && !allowEditOld;
                      const isModified = modifiedCells.has(`${student.id}_${dateStr}`);

                      const isDarkMode = theme.palette.mode === "dark";
                      const statusColorStyle =
                        status === "present"
                          ? {
                              color: isDarkMode ? "#81c784" : "#1b5e20", // Leaf Green
                              bgcolor: isDarkMode ? "rgba(46, 125, 50, 0.25)" : "#e8f5e9", // Leaf green background
                              borderColor: isDarkMode ? "#388e3c" : "#81c784",
                              hoverBg: isDarkMode ? "rgba(46, 125, 50, 0.38)" : "#c8e6c9",
                            }
                          : status === "absent"
                            ? {
                                color: isDarkMode ? "#ef5350" : "#b71c1c", // Dark Red
                                bgcolor: isDarkMode ? "rgba(198, 40, 40, 0.25)" : "#ffebee", // Dark red background
                                borderColor: isDarkMode ? "#d32f2f" : "#ef9a9a",
                                hoverBg: isDarkMode ? "rgba(198, 40, 40, 0.38)" : "#ffcdd2",
                              }
                            : status === "leave"
                              ? {
                                  color: isDarkMode ? "#ffb74d" : "#e65100",
                                  bgcolor: isDarkMode ? "rgba(230, 81, 0, 0.25)" : "#fff3e0",
                                  borderColor: isDarkMode ? "#f57c00" : "#ffb74d",
                                  hoverBg: isDarkMode ? "rgba(230, 81, 0, 0.38)" : "#ffe0b2",
                                }
                              : {
                                  color: "text.disabled",
                                  bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "action.hover",
                                  borderColor: "divider",
                                  hoverBg: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "action.selected",
                                };

                      return (
                        <TableCell
                          key={dateStr}
                          align="center"
                          sx={{
                            p: 0.5,
                            bgcolor: isModified
                              ? "info.50"
                              : undefined,
                            border: isModified ? "1px solid" : undefined,
                            borderColor: isModified ? "info.main" : undefined,
                          }}
                        >
                          <Tooltip
                            title={
                              isCellDisabled
                                ? "Past attendance locked. Enable editing old attendance in Settings to change."
                                : isModified
                                  ? `Modified: was ${modifiedCells.get(`${student.id}_${dateStr}`)?.originalStatus || "NA"}`
                                  : ""
                            }
                            arrow
                          >
                            <Box sx={{ display: "inline-block" }}>
                              <Select
                                size="small"
                                value={status || "none"}
                                disabled={isCellDisabled}
                                renderValue={(val) => {
                                  if (val === "present") return <span style={{ fontWeight: 800 }}>P</span>;
                                  if (val === "absent") return <span style={{ fontWeight: 800 }}>A</span>;
                                  if (val === "leave") return <span style={{ fontWeight: 800 }}>L</span>;
                                  return <span style={{ opacity: 0.5 }}>-</span>;
                                }}
                                onChange={(e) =>
                                  handleStatusChange(
                                    student.id,
                                    dateStr,
                                    e.target.value === "none" ? "" : e.target.value,
                                  )
                                }
                                sx={{
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  height: 28,
                                  minWidth: 48,
                                  textAlign: "center",
                                  borderRadius: 1.5,
                                  color: statusColorStyle.color,
                                  bgcolor: statusColorStyle.bgcolor,
                                  border: `1px solid ${statusColorStyle.borderColor}`,
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    border: "none",
                                  },
                                  "&:hover": {
                                    bgcolor: statusColorStyle.hoverBg,
                                  },
                                  "& .MuiSelect-select": {
                                    py: 0.25,
                                    px: 0.75,
                                    pr: "18px !important",
                                    fontWeight: "bold",
                                  },
                                  "& .MuiSelect-icon": {
                                    fontSize: 16,
                                    right: 1,
                                    color: statusColorStyle.color,
                                  },
                                }}
                              >
                                <MenuItem
                                  value="present"
                                  sx={{
                                    color: isDarkMode ? "#81c784" : "#1b5e20",
                                    fontWeight: "bold",
                                    gap: 1,
                                    "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                                      bgcolor: isDarkMode ? "rgba(46, 125, 50, 0.25)" : "#e8f5e9",
                                    },
                                  }}
                                >
                                  <span style={{ fontWeight: 800, width: 16, display: "inline-block" }}>P</span>
                                  <span>(Present)</span>
                                </MenuItem>
                                <MenuItem
                                  value="absent"
                                  sx={{
                                    color: isDarkMode ? "#ef5350" : "#b71c1c",
                                    fontWeight: "bold",
                                    gap: 1,
                                    "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                                      bgcolor: isDarkMode ? "rgba(198, 40, 40, 0.25)" : "#ffebee",
                                    },
                                  }}
                                >
                                  <span style={{ fontWeight: 800, width: 16, display: "inline-block" }}>A</span>
                                  <span>(Absent)</span>
                                </MenuItem>
                                <MenuItem
                                  value="leave"
                                  sx={{
                                    color: isDarkMode ? "#ffb74d" : "#e65100",
                                    fontWeight: "bold",
                                    gap: 1,
                                    "&:hover, &.Mui-selected, &.Mui-selected:hover": {
                                      bgcolor: isDarkMode ? "rgba(230, 81, 0, 0.25)" : "#fff3e0",
                                    },
                                  }}
                                >
                                  <span style={{ fontWeight: 800, width: 16, display: "inline-block" }}>L</span>
                                  <span>(Leave)</span>
                                </MenuItem>
                                <MenuItem value="none" sx={{ color: "text.secondary", gap: 1 }}>
                                  <span style={{ width: 16, display: "inline-block" }}>-</span>
                                  <span>(Clear)</span>
                                </MenuItem>
                              </Select>
                            </Box>
                          </Tooltip>
                        </TableCell>
                      );
                    })}

                    {/* Student Monthly Summary Stats */}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: (theme) => theme.palette.mode === "dark" ? "#81c784" : "#1b5e20",
                        borderLeft: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      {stats.present}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: (theme) => theme.palette.mode === "dark" ? "#ef5350" : "#b71c1c",
                      }}
                    >
                      {stats.absent}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: "bold",
                        color: (theme) => theme.palette.mode === "dark" ? "#ffb74d" : "#e65100",
                      }}
                    >
                      {stats.leave}
                    </TableCell>
                    <TableCell align="center">
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
                        sx={{ height: 22, fontSize: "0.675rem", fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Layout Safety Spacer as per system instructions */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
};

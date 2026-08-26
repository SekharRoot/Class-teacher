import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Box, Paper, Typography, CircularProgress, useTheme } from "@mui/material";
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
} from "date-fns";
import { attendanceApi } from "../api";
import { loadMonthlySheetCache } from "../utils/monthlyAttendanceCache";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";
import { MonthlyAttendanceSheetProps, ModifiedCell, CellMenuState } from "./monthlyAttendance/types";
import { MonthlySheetHeader } from "./monthlyAttendance/MonthlySheetHeader";
import { MonthlySheetTable } from "./monthlyAttendance/MonthlySheetTable";
import { CellStatusMenu } from "./monthlyAttendance/CellStatusMenu";

export const MonthlyAttendanceSheet: React.FC<MonthlyAttendanceSheetProps> = ({
  selectedClassId,
  classes = [],
  students,
  showToast,
  currentMonthDate: currentMonthDateProp,
  onMonthChange,
  readOnly = false,
  allowEditOld: allowEditOldProp,
  onSaveSuccess,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Current Month State
  const [internalMonthDate, setInternalMonthDate] = useState<Date>(
    currentMonthDateProp || new Date(),
  );
  const currentMonthDate = currentMonthDateProp || internalMonthDate;
  const monthString = format(currentMonthDate, "yyyy-MM");

  const setMonthDate = (d: Date) => {
    if (onMonthChange) onMonthChange(d);
    setInternalMonthDate(d);
  };

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "all" | "inactive">("active");

  // Data & Modification State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordsMap, setRecordsMap] = useState<Record<string, Record<string, string>>>({});
  const [dayInfoMap, setDayInfoMap] = useState<
    Record<string, { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }>
  >({});
  const [menuState, setMenuState] = useState<CellMenuState | null>(null);
  const [modifiedCells, setModifiedCells] = useState<Map<string, ModifiedCell>>(new Map());

  const [allowEditOldState, setAllowEditOldState] = useState<boolean>(
    () => localStorage.getItem("allow_edit_old_attendance") === "true",
  );
  const allowEditOld = allowEditOldProp !== undefined ? allowEditOldProp : allowEditOldState;

  const [ignoreSaturday, setIgnoreSaturday] = useState<boolean>(
    () => localStorage.getItem("ignore_saturday") === "true",
  );

  useEffect(() => {
    setAllowEditOldState(localStorage.getItem("allow_edit_old_attendance") === "true");
    setIgnoreSaturday(localStorage.getItem("ignore_saturday") === "true");
  }, []);

  // Fetch Monthly Data
  const fetchMonthlyData = useCallback(
    async (forceRefresh = false) => {
      if (!selectedClassId) return;

      const activeSchoolId = getActiveSchoolId();
      const cached = loadMonthlySheetCache(activeSchoolId, selectedClassId, monthString);

      if (cached && !forceRefresh) {
        setRecordsMap(cached.recordsMap || {});
        setDayInfoMap(cached.dayInfoMap || {});
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const { recordsMap: fetchedRecords, dayInfoMap: fetchedDayInfo } =
          await attendanceApi.getMonthlyRecordsDetailed(monthString, selectedClassId, {
            forceRefresh,
          });

        setRecordsMap(fetchedRecords);
        setDayInfoMap(fetchedDayInfo);
        setModifiedCells(new Map());
        if (forceRefresh && showToast) {
          showToast("Monthly attendance synchronized with server", "success");
        }
      } catch (err) {
        console.error("Failed to load monthly records:", err);
        if (!cached && showToast) {
          showToast("Failed to load monthly attendance sheet data", "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [selectedClassId, monthString, showToast],
  );

  useEffect(() => {
    fetchMonthlyData(false);
  }, [fetchMonthlyData]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonthDate);
    const end = endOfMonth(currentMonthDate);
    return eachDayOfInterval({ start, end });
  }, [currentMonthDate]);

  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return students
      .filter((s) => s.classId === selectedClassId)
      .filter((s) => {
        if (statusFilter === "active") return s.isActive !== false;
        if (statusFilter === "inactive") return s.isActive === false;
        return true;
      })
      .filter((s) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
        const roll = (s.rollNumber || "").toLowerCase();
        return fullName.includes(q) || roll.includes(q);
      })
      .sort((a, b) => {
        const rollA = parseInt(a.rollNumber, 10);
        const rollB = parseInt(b.rollNumber, 10);
        if (!isNaN(rollA) && !isNaN(rollB)) return rollA - rollB;
        return (a.firstName || "").localeCompare(b.firstName || "");
      });
  }, [students, selectedClassId, statusFilter, searchQuery]);

  const handlePrevMonth = () => {
    if (modifiedCells.size > 0 && !window.confirm("Discard unsaved changes and switch month?")) return;
    setMonthDate(subMonths(currentMonthDate, 1));
  };

  const handleNextMonth = () => {
    if (modifiedCells.size > 0 && !window.confirm("Discard unsaved changes and switch month?")) return;
    setMonthDate(addMonths(currentMonthDate, 1));
  };

  const handleCurrentMonth = () => {
    if (modifiedCells.size > 0 && !window.confirm("Discard unsaved changes and return to current month?")) return;
    setMonthDate(new Date());
  };

  const handleStatusChange = useCallback(
    (studentId: string, dateStr: string, newStatus: string) => {
      const isPastDate = isPast(parseISO(dateStr)) && !isToday(parseISO(dateStr));
      if (isPastDate && !allowEditOld) {
        if (showToast) showToast("Editing past attendance dates is currently locked.", "warning");
        return;
      }

      const key = `${studentId}_${dateStr}`;
      const original = recordsMap[dateStr]?.[studentId] || "";

      setModifiedCells((prev) => {
        const next = new Map(prev);
        if (newStatus === original) {
          next.delete(key);
        } else {
          next.set(key, { studentId, date: dateStr, originalStatus: original, currentStatus: newStatus });
        }
        return next;
      });
    },
    [allowEditOld, recordsMap, showToast],
  );

  const handleCellClick = useCallback(
    (e: React.MouseEvent<HTMLElement>, studentId: string, dateStr: string, currentStatus: string, studentName: string) => {
      setMenuState({ anchorEl: e.currentTarget, studentId, dateStr, currentStatus, studentName });
    },
    [],
  );

  const handleDiscardChanges = () => {
    if (window.confirm("Discard all unsaved changes in this sheet?")) {
      setModifiedCells(new Map());
      if (showToast) showToast("Changes discarded", "info");
    }
  };

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
      if (showToast) showToast(`Successfully saved ${count} modification(s)!`, "success");
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error("Failed to save modifications:", err);
      if (showToast) showToast("Failed to save modifications to server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const getCellStatus = useCallback(
    (studentId: string, dateStr: string) => {
      const key = `${studentId}_${dateStr}`;
      return modifiedCells.has(key) ? modifiedCells.get(key)!.currentStatus : recordsMap[dateStr]?.[studentId] || "";
    },
    [modifiedCells, recordsMap],
  );

  const studentStatsMap = useMemo(() => {
    const map: Record<string, { present: number; absent: number; leave: number; percentage: number }> = {};
    classStudents.forEach((student) => {
      let present = 0, absent = 0, leave = 0, markedDays = 0;
      monthDays.forEach((d) => {
        const dateStr = format(d, "yyyy-MM-dd");
        const status = getCellStatus(student.id, dateStr);
        if (status === "present") { present++; markedDays++; }
        else if (status === "absent") { absent++; markedDays++; }
        else if (status === "leave") { leave++; markedDays++; }
      });
      const percentage = markedDays > 0 ? Math.round((present / markedDays) * 100) : 0;
      map[student.id] = { present, absent, leave, percentage };
    });
    return map;
  }, [classStudents, monthDays, getCellStatus]);

  const selectedClassName = classes.find((c) => c.id === selectedClassId)
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
      <MonthlySheetHeader
        currentMonthDate={currentMonthDate}
        modifiedCount={modifiedCells.size}
        saving={saving}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        isDarkMode={isDarkMode}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onCurrentMonth={handleCurrentMonth}
        onDiscardChanges={handleDiscardChanges}
        onSaveChanges={handleSaveChanges}
        onRefresh={() => fetchMonthlyData(true)}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
      />

      {loading ? (
        <Paper
          elevation={1}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 280,
            gap: 2,
          }}
        >
          <CircularProgress size={42} thickness={4} />
          <Typography variant="body1" color="text.primary" sx={{ fontWeight: "bold" }}>
            Fetching Monthly Attendance Sheet...
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Preparing student records for {selectedClassName} ({format(currentMonthDate, "MMMM yyyy")})
          </Typography>
        </Paper>
      ) : classStudents.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No students found in this class matching your filters.
          </Typography>
        </Paper>
      ) : (
        <MonthlySheetTable
          classStudents={classStudents}
          monthDays={monthDays}
          dayInfoMap={dayInfoMap}
          ignoreSaturday={ignoreSaturday}
          isDarkMode={isDarkMode}
          allowEditOld={allowEditOld}
          readOnly={readOnly}
          modifiedCells={modifiedCells}
          studentStatsMap={studentStatsMap}
          getCellStatus={getCellStatus}
          onCellClick={handleCellClick}
        />
      )}

      <CellStatusMenu
        menuState={menuState}
        isDarkMode={isDarkMode}
        onClose={() => setMenuState(null)}
        onSelectStatus={(status) => {
          if (menuState) {
            handleStatusChange(menuState.studentId, menuState.dateStr, status);
            setMenuState(null);
          }
        }}
      />

      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
};

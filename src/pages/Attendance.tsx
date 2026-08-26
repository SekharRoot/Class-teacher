import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, CircularProgress, Snackbar, Alert, Button } from "@mui/material";
import { CloudOff, ChevronLeft } from "@mui/icons-material";
import { format, subDays, addDays, parseISO } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { AttendanceHistory } from "../components/AttendanceHistory";
import { ClassSelectionGrid } from "../components/ClassSelectionGrid";
import { AttendanceStudentList } from "../components/AttendanceStudentList";
import { ClasswiseAbsenteeExport } from "../components/ClasswiseAbsenteeExport";
import { MonthlyAttendanceSheet } from "../components/MonthlyAttendanceSheet";
import { useAttendanceData } from "../hooks/useAttendanceData";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import { useAuth } from "../contexts/AuthContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { AttendanceHeaderControls } from "../components/attendance/AttendanceHeaderControls";
import { AttendanceConnectionError } from "../components/attendance/AttendanceConnectionError";
import { AttendanceTabNavigation } from "../components/attendance/AttendanceTabNavigation";
import { ClassHeaderBreadcrumb } from "../components/attendance/ClassHeaderBreadcrumb";

export default function Attendance() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const {
    classes,
    selectedClassId,
    setSelectedClassId,
    students,
    setStudents,
    attendance,
    setAttendance,
    loading,
    setLoading,
    toastMessage,
    setToastMessage,
    toastSeverity,
    error,
    setError,
    offlineMode,
    setOfflineMode,
    selectedDate,
    setSelectedDate,
    dateString,
    historyDates,
    setHistoryDates,
    historyLimit,
    setHistoryLimit,
    activeTab,
    setActiveTab,
    showToast,
    fetchBaseData,
    fetchHistory,
    leavesList,
    dayInfo,
    fetchDayInfo,
  } = useAttendanceData();

  const { authorizedClassIds, isReadOnly, loadingScope } = useHierarchyScope();

  const isPrincipal = isReadOnly;
  const isTeacher = userProfile?.role === "class_teacher";
  const [isTakeAttendanceMode, setIsTakeAttendanceMode] = useState<boolean>(isTeacher);

  const todayDateString = format(new Date(), "yyyy-MM-dd");
  const isOldData = dateString < todayDateString;
  const allowEditOld = localStorage.getItem("allow_edit_old_attendance") === "true";
  const isLockedOldData = isOldData && !allowEditOld;

  useEffect(() => {
    if (userProfile?.role === "class_teacher") {
      setIsTakeAttendanceMode(true);
    }
  }, [userProfile?.role]);

  useEffect(() => {
    if (!userProfile || loadingScope) return;

    if (classId) {
      if (!authorizedClassIds.includes(classId)) {
        const fallback = userProfile.role === "class_teacher" ? userProfile.assignedClassId || userProfile.assignedClassId2 : null;
        navigate(fallback ? `/attendance/${fallback}` : "/attendance");
      } else {
        setSelectedClassId(classId);
      }
    } else {
      if (userProfile.role === "class_teacher" && (userProfile.assignedClassId || userProfile.assignedClassId2)) {
        navigate(`/attendance/${userProfile.assignedClassId || userProfile.assignedClassId2}`);
      } else {
        setSelectedClassId(null);
      }
    }
  }, [classId, setSelectedClassId, userProfile, navigate, authorizedClassIds, loadingScope]);

  const handleClassSelect = (id: string | null) => {
    navigate(id ? `/attendance/${id}` : "/attendance");
  };

  const { markAttendance, markAllStatus, syncAttendance, assignHoliday } = useAttendanceActions(
    attendance, setAttendance, students, setStudents, dateString, offlineMode, showToast,
    fetchHistory, setLoading, historyDates, setHistoryDates, fetchBaseData, selectedClassId, fetchDayInfo,
  );

  useEffect(() => {
    const handleGlobalSync = () => syncAttendance();
    window.addEventListener("force-sync", handleGlobalSync);
    return () => window.removeEventListener("force-sync", handleGlobalSync);
  }, [syncAttendance]);

  const handleDateShift = (days: number) => {
    setSelectedDate(days > 0 ? addDays(selectedDate, days) : subDays(selectedDate, Math.abs(days)));
  };

  const handleDateSelect = (isoString: string) => {
    setSelectedDate(parseISO(isoString));
    setActiveTab(0);
  };

  const filteredClasses = classes.filter((cls) =>
    userProfile?.role === "class_teacher"
      ? cls.id === userProfile.assignedClassId || cls.id === userProfile.assignedClassId2
      : authorizedClassIds.includes(cls.id),
  );

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1.5 }}>
          Attendance Sheets {offlineMode && <Chip label="Offline Cache Mode" size="small" color="warning" icon={<CloudOff />} />}
        </Typography>
      </Box>

      {error ? (
        <AttendanceConnectionError
          error={error}
          onRetry={fetchBaseData}
          onEnableOfflineMode={() => {
            setOfflineMode(true);
            setError(null);
            showToast("Switched to Offline Mode successfully.", "info");
          }}
        />
      ) : loading && students.length === 0 && !selectedClassId ? (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "40vh", gap: 2 }}>
          <CircularProgress size={50} />
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: "medium" }}>
            Syncing school registers...
          </Typography>
        </Box>
      ) : filteredClasses.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: "10px", border: "1px dashed", borderColor: "divider" }}>
          <Typography variant="h6" color="text.secondary">No assigned classes found.</Typography>
        </Paper>
      ) : !selectedClassId ? (
        <>
          <ClassSelectionGrid classes={filteredClasses} onSelectClass={handleClassSelect} />
          <Box sx={{ mt: 4 }}>
            <ClasswiseAbsenteeExport
              classes={filteredClasses}
              students={students}
              attendance={attendance}
              dateString={dateString}
              onDateChange={setSelectedDate}
              loading={loading}
            />
          </Box>
        </>
      ) : (
        <Box>
          <ClassHeaderBreadcrumb
            selectedClass={selectedClass}
            showChangeClassButton={userProfile?.role !== "class_teacher" || filteredClasses.length > 1}
            onChangeClass={() => handleClassSelect(null)}
          />

          <AttendanceTabNavigation
            activeTab={activeTab}
            historyCount={historyDates.length}
            onTabChange={setActiveTab}
          />

          {activeTab === 0 && (
            <Box>
              <AttendanceHeaderControls
                dateString={dateString}
                selectedDate={selectedDate}
                isTeacher={isTeacher}
                isPrincipal={isPrincipal}
                isTakeAttendanceMode={isTakeAttendanceMode}
                students={students}
                attendance={attendance}
                selectedClassId={selectedClassId}
                onDateShift={handleDateShift}
                onDateSelect={handleDateSelect}
                onSetToday={() => setSelectedDate(new Date())}
                onToggleTakeAttendanceMode={() => setIsTakeAttendanceMode(!isTakeAttendanceMode)}
              />
              <AttendanceStudentList
                students={students}
                attendance={attendance}
                selectedClassId={selectedClassId}
                onBack={() => handleClassSelect(null)}
                onMarkAll={markAllStatus}
                onMarkAttendance={markAttendance}
                onSync={syncAttendance}
                readOnly={!isTakeAttendanceMode || isPrincipal || isLockedOldData}
                leavesList={leavesList}
                dateString={dateString}
                loading={loading}
                dayInfo={dayInfo}
                onAssignHoliday={assignHoliday}
                className={selectedClass ? `${selectedClass.classStandard} ${selectedClass.section}`.trim() : undefined}
              />
              <Box sx={{ mt: 4 }}>
                <ClasswiseAbsenteeExport
                  classes={filteredClasses.filter((c) => c.id === selectedClassId)}
                  students={students}
                  attendance={attendance}
                  dateString={dateString}
                  onDateChange={setSelectedDate}
                  loading={loading}
                />
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {(userProfile?.role !== "class_teacher" || filteredClasses.length > 1) && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    startIcon={<ChevronLeft />}
                    onClick={() => handleClassSelect(null)}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "10px", textTransform: "none" }}
                  >
                    Back to Classes
                  </Button>
                </Box>
              )}
              <AttendanceHistory
                historyDates={historyDates}
                dateString={dateString}
                onDateSelect={handleDateSelect}
                onLoadMore={() => setHistoryLimit((prev) => prev + 6)}
                hasMore={historyDates.length === historyLimit || historyDates.length === 0}
              />
            </Box>
          )}

          {activeTab === 2 && selectedClassId && (
            <Box>
              {(userProfile?.role !== "class_teacher" || filteredClasses.length > 1) && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    startIcon={<ChevronLeft />}
                    onClick={() => handleClassSelect(null)}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: "10px", textTransform: "none" }}
                  >
                    Back to Classes
                  </Button>
                </Box>
              )}
              <MonthlyAttendanceSheet
                students={students}
                selectedClassId={selectedClassId}
                currentMonthDate={selectedDate}
                onMonthChange={(newDate) => setSelectedDate(newDate)}
                readOnly={isPrincipal}
                allowEditOld={allowEditOld}
                onSaveSuccess={() => {
                  fetchBaseData();
                  fetchHistory();
                }}
              />
            </Box>
          )}
        </Box>
      )}

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setToastMessage("")} severity={toastSeverity} sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
}

import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  TextField,
  IconButton,
} from "@mui/material";
import {
  CloudOff,
  Refresh,
  ChevronLeft,
  ChevronRight,
  History,
  ListAlt,
  DeleteSweep,
  ArrowBack,
} from "@mui/icons-material";
import { format, subDays, addDays, parseISO } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { AttendanceHistory } from "../components/AttendanceHistory";
import { AttendanceSummary } from "../components/AttendanceSummary";
import { ClassSelectionGrid } from "../components/ClassSelectionGrid";
import { AttendanceStudentList } from "../components/AttendanceStudentList";
import { ClasswiseAbsenteeExport } from "../components/ClasswiseAbsenteeExport";
import { useAttendanceData } from "../hooks/useAttendanceData";
import { useAttendanceActions } from "../hooks/useAttendanceActions";
import { useAuth } from "../contexts/AuthContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";

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
    activeTab,
    setActiveTab,
    showToast,
    fetchBaseData,
    fetchHistory,
    leavesList,
  } = useAttendanceData();

  const { authorizedClassIds, isReadOnly, loadingScope } = useHierarchyScope();

  const isPrincipal = isReadOnly;
  const isTeacher = userProfile?.role === "class_teacher";
  const [isSubstituteMode, setIsSubstituteMode] = React.useState<boolean>(false);
  const [isTakeAttendanceMode, setIsTakeAttendanceMode] = React.useState<boolean>(isTeacher);

  useEffect(() => {
    if (userProfile) {
      // Teachers always default to take attendance mode
      // Others can toggle, but we initialize it to true for substitute mode or for teachers
      if (userProfile.role === "class_teacher" || isSubstituteMode) {
        setIsTakeAttendanceMode(true);
      }
    }
  }, [userProfile?.role, isSubstituteMode]);

  useEffect(() => {
    if (!userProfile || loadingScope) return;

    if (classId) {
      const isAuthorized = authorizedClassIds.includes(classId) || (isTeacher && isSubstituteMode);
      if (!isAuthorized) {
        if (
          userProfile.role === "class_teacher" &&
          userProfile.assignedClassId &&
          !isSubstituteMode
        ) {
          navigate(`/attendance/${userProfile.assignedClassId}`);
        } else {
          // Check if class exists even if not authorized yet
          const classExists = classes.some(c => c.id === classId);
          if (isSubstituteMode && classExists) {
            setSelectedClassId(classId);
          } else {
            navigate("/attendance");
          }
        }
      } else {
        setSelectedClassId(classId);
      }
    } else {
      if (userProfile.role === "class_teacher" && userProfile.assignedClassId && !isSubstituteMode) {
        navigate(`/attendance/${userProfile.assignedClassId}`);
      } else {
        setSelectedClassId(null);
      }
    }
  }, [
    classId,
    setSelectedClassId,
    userProfile,
    navigate,
    authorizedClassIds,
    loadingScope,
    isSubstituteMode,
    isTeacher,
    classes,
  ]);

  const handleClassSelect = (id: string | null) => {
    if (id) {
      navigate(`/attendance/${id}`);
    } else {
      navigate("/attendance");
    }
  };

  const { markAttendance, markAllStatus, syncAttendance, clearAllData } =
    useAttendanceActions(
      attendance,
      setAttendance,
      students,
      setStudents,
      dateString,
      offlineMode,
      showToast,
      fetchHistory,
      setLoading,
      historyDates,
      setHistoryDates,
      fetchBaseData,
    );

  useEffect(() => {
    const handleGlobalSync = () => {
      syncAttendance();
    };
    window.addEventListener("force-sync", handleGlobalSync);
    return () => window.removeEventListener("force-sync", handleGlobalSync);
  }, [syncAttendance]);

  const handleDateShift = (days: number) => {
    const nextDate =
      days > 0
        ? addDays(selectedDate, days)
        : subDays(selectedDate, Math.abs(days));
    setSelectedDate(nextDate);
  };

  const handleDateSelect = (isoString: string) => {
    setSelectedDate(parseISO(isoString));
    setActiveTab(0);
  };

  const handleEnableOfflineMode = () => {
    setOfflineMode(true);
    setError(null);
    showToast("Switched to Offline Mode successfully.", "info");
  };

  const filteredClasses = classes.filter((cls) =>
    isSubstituteMode ? true : authorizedClassIds.includes(cls.id),
  );

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            Attendance Sheets{" "}
            {offlineMode && (
              <Chip
                label="Offline Cache Mode"
                size="small"
                color="warning"
                icon={<CloudOff />}
              />
            )}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {isTeacher && (
            <Box sx={{ display: "flex", bgcolor: "action.hover", p: 0.5, borderRadius: 2 }}>
              <Button
                size="small"
                variant={!isSubstituteMode ? "contained" : "text"}
                onClick={() => {
                  setIsSubstituteMode(false);
                  if (userProfile.assignedClassId) {
                    navigate(`/attendance/${userProfile.assignedClassId}`);
                  }
                }}
                sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 1.5 }}
              >
                My Class
              </Button>
              <Button
                size="small"
                variant={isSubstituteMode ? "contained" : "text"}
                onClick={() => {
                  setIsSubstituteMode(true);
                  navigate("/attendance");
                }}
                sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 1.5 }}
              >
                Substitute Attendance
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {error ? (
        <Box sx={{ maxWidth: "sm", mx: "auto", mt: 4 }}>
          <Paper
            elevation={3}
            sx={{ p: 4, textAlign: "center", borderRadius: 2 }}
          >
            <CloudOff sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Database Connection Pending
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {error}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={fetchBaseData}
              >
                Retry Connection
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleEnableOfflineMode}
              >
                Work Offline (Demo Mode)
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : loading && students.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
            gap: 2,
          }}
        >
          <CircularProgress size={50} />
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontWeight: "medium" }}
          >
            Syncing school registers...
          </Typography>
        </Box>
      ) : filteredClasses.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No assigned classes found.
          </Typography>
        </Paper>
      ) : !selectedClassId ? (
        <>
          <ClassSelectionGrid
            classes={filteredClasses}
            onSelectClass={handleClassSelect}
          />
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
          {(userProfile?.role !== "class_teacher" || isSubstituteMode) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Button
                startIcon={<ArrowBack />}
                onClick={() => handleClassSelect(null)}
                variant="text"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Change Class
              </Button>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                / {classes.find((c) => c.id === selectedClassId)?.board} -{" "}
                {classes.find((c) => c.id === selectedClassId)?.classStandard}{" "}
                {classes.find((c) => c.id === selectedClassId)?.section}
              </Typography>
            </Box>
          )}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              aria-label="attendance views"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ "& .MuiTabs-flexContainer": { justifyContent: "center" } }}
            >
              <Tab
                icon={<ListAlt fontSize="large" />}
                label="Take Attendance"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 72,
                }}
              />
              <Tab
                icon={<History fontSize="large" />}
                label={`Attendance History (${historyDates.length})`}
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  minHeight: 72,
                }}
              />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Box>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  mb: 3,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "stretch", md: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  borderRadius: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: 1,
                    bgcolor: "action.hover",
                    p: 0.5,
                    borderRadius: 2,
                  }}
                >
                  <IconButton
                    onClick={() => handleDateShift(-1)}
                    size="small"
                    sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <TextField
                    type="date"
                    size="small"
                    value={dateString}
                    onChange={(e) => {
                      if (e.target.value) handleDateSelect(e.target.value);
                    }}
                    sx={{
                      width: 150,
                      "& .MuiInputBase-root": {
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleDateShift(1)}
                    size="small"
                    sx={{ bgcolor: "background.paper", boxShadow: 1 }}
                  >
                    <ChevronRight />
                  </IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setSelectedDate(new Date())}
                    disabled={format(new Date(), "yyyy-MM-dd") === dateString}
                    sx={{
                      ml: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Today
                  </Button>
                  {!isTeacher && !isPrincipal && (
                    <Button
                      variant={isTakeAttendanceMode ? "contained" : "outlined"}
                      color={isTakeAttendanceMode ? "primary" : "secondary"}
                      size="small"
                      startIcon={<ListAlt />}
                      onClick={() => setIsTakeAttendanceMode(!isTakeAttendanceMode)}
                      sx={{
                        ml: 1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                    >
                      {isTakeAttendanceMode ? "View Mode" : "Take Attendance"}
                    </Button>
                  )}
                </Box>
                <AttendanceSummary
                  students={students}
                  attendance={attendance}
                  selectedClassId={selectedClassId}
                />
              </Paper>
            <AttendanceStudentList
                students={students}
                attendance={attendance}
                selectedClassId={selectedClassId}
                onBack={() => handleClassSelect(null)}
                onMarkAll={markAllStatus}
                onMarkAttendance={markAttendance}
                onSync={syncAttendance}
                readOnly={!isTakeAttendanceMode || isPrincipal}
                leavesList={leavesList}
                dateString={dateString}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {userProfile?.role !== "class_teacher" && (
                <Box sx={{ mb: 2 }}>
                  <Button
                    startIcon={<ChevronLeft />}
                    onClick={() => handleClassSelect(null)}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 4, textTransform: "none" }}
                  >
                    Back to Classes
                  </Button>
                </Box>
              )}
              <AttendanceHistory
                historyDates={historyDates}
                dateString={dateString}
                onDateSelect={handleDateSelect}
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
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      {/* Generous bottom spacing safety buffer for floating navigation bar */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
}

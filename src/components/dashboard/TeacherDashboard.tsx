import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Stack,
  Divider,
  CircularProgress,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Select,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import WarningIcon from "@mui/icons-material/Warning";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { format } from "date-fns";
import { LeaveRequest, ClassItem, UserProfile } from "../../types";

interface TeacherDashboardProps {
  userProfile: UserProfile | null;
  teacherClassInfo: ClassItem | null;
  teacherClassStat: any;
  teacherLeaves: LeaveRequest[];
  teacherPendingLeavesCount: number;
  studentNameMap: Record<string, string>;
  selectedClassId?: string;
  onClassChange?: (classId: string) => void;
  availableClasses?: ClassItem[];
}

export const TeacherDashboard = React.memo(({
  userProfile,
  teacherClassInfo,
  teacherClassStat,
  teacherLeaves,
  teacherPendingLeavesCount,
  studentNameMap,
  selectedClassId,
  onClassChange,
  availableClasses,
}: TeacherDashboardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
        Teacher Portal
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Welcome back, {userProfile?.displayName}. Here is today's overview for
        your assigned class.
      </Typography>

      {userProfile && userProfile.assignedClassId2 && availableClasses && availableClasses.length > 0 && (
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Viewing Overview For:
          </Typography>
          <Box sx={{ minWidth: 200 }}>
            <Select
              size="small"
              value={selectedClassId || ""}
              onChange={(e) => onClassChange?.(e.target.value)}
              fullWidth
              sx={{ bgcolor: "background.paper", borderRadius: 2 }}
            >
              {availableClasses.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.classStandard} {cls.section} ({cls.board})
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      )}

      {!userProfile?.assignedClassId && !userProfile?.assignedClassId2 ? (
        <Alert
          severity="warning"
          variant="outlined"
          sx={{ borderRadius: 3, p: 2, borderStyle: "dashed" }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            No Class Assigned
          </Typography>
          <Typography variant="body2">
            You currently do not have a class assigned to you in the system.
            Please reach out to your Academic Coordinator or Administrator in
            the Admin Panel to link your teacher profile to a class standard.
            Once linked, you can record daily attendance, manage student
            rosters, and handle leaves.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={4}>
          {/* Primary Class Summary Widget Card */}
          <Grid size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
                  color: "white",
                }}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        opacity: 0.8,
                        textTransform: "uppercase",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      Assigned Class
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {teacherClassInfo
                        ? `${teacherClassInfo.classStandard} ${teacherClassInfo.section}`
                        : "Loading..."}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Board: {teacherClassInfo?.board || "General"}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 60, opacity: 0.3 }} />
                </Stack>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid
                    size={{ xs: 12, md: 4 }}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: { md: `1px solid ${theme.palette.divider}` },
                    }}
                  >
                    {teacherClassStat && teacherClassStat.markedCount > 0 ? (
                      <Box
                        sx={{
                          position: "relative",
                          display: "inline-flex",
                          mb: 1,
                        }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={teacherClassStat.attendanceRate || 0}
                          size={100}
                          thickness={5}
                          color={
                            (teacherClassStat.attendanceRate || 0) >= 90
                              ? "success"
                              : (teacherClassStat.attendanceRate || 0) >= 75
                                ? "warning"
                                : "error"
                          }
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            variant="h5"
                            component="div"
                            color="text.primary"
                            sx={{ fontWeight: 800 }}
                          >
                            {teacherClassStat.attendanceRate}%
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ p: 2, textAlign: "center", mb: 1 }}>
                        <WarningIcon
                          color="disabled"
                          sx={{ fontSize: 50, mb: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 600 }}
                        >
                          Not Marked Yet
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{
                        fontWeight: 700,
                        textTransform: "uppercase",
                        mt: 1,
                      }}
                    >
                      Attendance Rate Today
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack spacing={2} sx={{ py: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Total Strength
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800 }}
                        >
                          {teacherClassStat?.totalStudents || 0} Students
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Marked Students
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 800 }}
                        >
                          {teacherClassStat?.markedCount || 0} /{" "}
                          {teacherClassStat?.totalStudents || 0}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Present Today
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="success.main"
                          sx={{ fontWeight: 800 }}
                        >
                          {teacherClassStat?.presentCount || 0} Present
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack spacing={2} sx={{ py: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Absent Today
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="error.main"
                          sx={{ fontWeight: 800 }}
                        >
                          {teacherClassStat?.absentCount || 0} Absent
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          On Approved Leave
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="warning.main"
                          sx={{ fontWeight: 800 }}
                        >
                          {teacherClassStat?.leaveCount || 0} On Leave
                        </Typography>
                      </Box>
                      <Divider />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Unmarked Students
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          sx={{ fontWeight: 800 }}
                        >
                          {(teacherClassStat?.totalStudents || 0) -
                            (teacherClassStat?.markedCount || 0)}{" "}
                          Remaining
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 3,
                    pt: 3,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  {teacherClassStat && teacherClassStat.markedCount > 0 ? (
                    <Alert
                      severity="success"
                      icon={<TaskAltIcon />}
                      sx={{ flex: 1, py: 0 }}
                    >
                      All daily logs for today have been submitted. You can edit
                      entries if needed.
                    </Alert>
                  ) : (
                    <Alert
                      severity="warning"
                      icon={<WarningIcon />}
                      sx={{ flex: 1, py: 0 }}
                    >
                      Attendance has not been registered for today.
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/attendance")}
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                  >
                    {teacherClassStat && teacherClassStat.markedCount > 0
                      ? "Edit Attendance"
                      : "Mark Attendance"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions Panel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => navigate("/attendance")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Launch Daily Register
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                    onClick={() => navigate("/profiles")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Manage Students Roster
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<DateRangeIcon />}
                    onClick={() => navigate("/leaves")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    Leave Applications ({teacherPendingLeavesCount} Pending)
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                    onClick={() => navigate("/reports")}
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    View Monthly Reports
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* My Class Leaves Widget */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
                height: "100%",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Class Leave Applications
                  </Typography>
                  {teacherPendingLeavesCount > 0 && (
                    <Chip
                      label={`${teacherPendingLeavesCount} Pending`}
                      color="warning"
                      size="small"
                      sx={{ fontWeight: "bold" }}
                    />
                  )}
                </Box>
                <Divider sx={{ mb: 2 }} />

                {teacherLeaves.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      flexGrow: 1,
                      py: 4,
                    }}
                  >
                    <DateRangeIcon
                      color="disabled"
                      sx={{ fontSize: 40, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No leave applications submitted yet for your class.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ flexGrow: 1 }}>
                    <List disablePadding>
                      {teacherLeaves.slice(0, 4).map((leave) => (
                        <ListItem
                          key={leave.id}
                          disableGutters
                          sx={{
                            py: 1.5,
                            borderBottom: `1px solid ${theme.palette.action.hover}`,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor:
                                  leave.status === "pending"
                                    ? "warning.light"
                                    : leave.status === "approved"
                                      ? "success.light"
                                      : "error.light",
                                color: "white",
                              }}
                            >
                              {studentNameMap[leave.studentId]?.charAt(0) ||
                                "S"}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700 }}
                              >
                                {studentNameMap[leave.studentId] ||
                                  "Loading student..."}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {(() => {
                                  try {
                                    const startStr = leave.startDate ? format(new Date(leave.startDate), "MMM d") : "N/A";
                                    const endStr = leave.endDate ? format(new Date(leave.endDate), "MMM d") : "N/A";
                                    return `${startStr} - ${endStr}`;
                                  } catch (e) {
                                    return "Invalid date range";
                                  }
                                })()} •{" "}
                                {leave.reason}
                              </Typography>
                            }
                          />
                          <Chip
                            label={leave.status.toUpperCase()}
                            size="small"
                            color={
                              leave.status === "approved"
                                ? "success"
                                : leave.status === "pending"
                                  ? "warning"
                                  : "error"
                            }
                            sx={{ fontWeight: "bold", fontSize: "10px" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {teacherLeaves.length > 4 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          mt: 2,
                        }}
                      >
                        <Button
                          variant="text"
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => navigate("/leaves")}
                          sx={{ fontWeight: 600 }}
                        >
                          View All {teacherLeaves.length} Applications
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
});

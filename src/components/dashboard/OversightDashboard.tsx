import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Divider,
  Stack,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { UserProfile } from "../../types";
import { DailyStatusReport } from "./DailyStatusReport";
import { SubstituteAssignmentsManager } from "./SubstituteAssignmentsManager";

interface ClassStat {
  classId: string;
  className: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  markedCount: number;
  attendanceRate: number | null;
}

interface OversightDashboardProps {
  userProfile: UserProfile | null;
  overallAttendanceRate: number | null;
  stats: {
    totalClasses: number;
    totalStudents: number;
  };
  unmarkedClasses: ClassStat[];
  oversightPendingLeavesCount: number;
  sortedClassStatsByAttendance: ClassStat[];
  teacherNameForClass: (classId: string) => string;
  students: any[];
  classes: any[];
  authorizedClassIds: string[];
}

export const OversightDashboard = React.memo(({
  userProfile,
  overallAttendanceRate,
  stats,
  unmarkedClasses,
  oversightPendingLeavesCount,
  sortedClassStatsByAttendance,
  teacherNameForClass,
  students,
  classes,
  authorizedClassIds,
}: OversightDashboardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
        Oversight Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome,{" "}
        {userProfile?.role === "owner"
          ? "Owner"
          : userProfile?.role === "principal"
            ? "Principal"
            : userProfile?.role === "academic_coordinator"
              ? "Academic Coordinator"
              : "Administrator"}
        . School oversight metrics and structural reports for today.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dashboard tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "1rem",
            },
          }}
        >
          <Tab label="School Overview" />
          <Tab label="Daily Status Report" />
          {(userProfile?.role === "admin" ||
            userProfile?.role === "owner" ||
            userProfile?.role === "academic_coordinator") && (
            <Tab label="Substitute Assignments" />
          )}
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          {/* School-Wide KPI Summary Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card 1: School-Wide Attendance Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                  >
                    Overall Attendance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {overallAttendanceRate !== null
                      ? `${overallAttendanceRate}%`
                      : "N/A"}
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "primary.light", color: "primary.main" }}
                >
                  <CheckCircleIcon />
                </Avatar>
              </Box>
              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={overallAttendanceRate || 0}
                  color={
                    (overallAttendanceRate || 0) >= 90
                      ? "success"
                      : (overallAttendanceRate || 0) >= 75
                        ? "warning"
                        : "error"
                  }
                  sx={{ borderRadius: 1, height: 6 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Active Monitored Scope */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                  >
                    Strength & Classes
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stats.totalStudents}
                  </Typography>
                </Box>
                <Avatar
                  sx={{ bgcolor: "secondary.light", color: "secondary.main" }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                Across {stats.totalClasses} Active Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Attendance Alert */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                  >
                    Unmarked Classes
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                      color:
                        unmarkedClasses.length > 0
                          ? "warning.main"
                          : "success.main",
                    }}
                  >
                    {unmarkedClasses.length}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor:
                      unmarkedClasses.length > 0
                        ? "warning.light"
                        : "success.light",
                    color:
                      unmarkedClasses.length > 0
                        ? "warning.main"
                        : "success.main",
                  }}
                >
                  <WarningIcon />
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                {unmarkedClasses.length > 0
                  ? "Pending daily registers"
                  : "Excellent! All logged"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Pending Leaves Queue */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ fontWeight: 700, letterSpacing: 0.5 }}
                  >
                    Pending Leaves
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      mt: 0.5,
                      color:
                        oversightPendingLeavesCount > 0
                           ? "error.main"
                           : "text.primary",
                    }}
                  >
                    {oversightPendingLeavesCount}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor:
                      oversightPendingLeavesCount > 0
                        ? "error.light"
                        : "action.selected",
                    color:
                      oversightPendingLeavesCount > 0
                        ? "error.main"
                        : "text.secondary",
                  }}
                >
                  <PendingActionsIcon />
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                Awaiting your approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Insights Panels */}
      <Grid container spacing={4}>
        {/* Left Side: Attendance Leaderboard / Class Breakdown */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Today's Class-wise Attendance
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ranked breakdown of daily reporting levels for all classes under
                your scope.
              </Typography>

              {sortedClassStatsByAttendance.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No active classes found.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={3.5}>
                  {sortedClassStatsByAttendance.map((cls) => {
                    const isUnmarked = cls.markedCount === 0;
                    const attendancePercentage = cls.attendanceRate || 0;

                    return (
                      <Box key={cls.classId}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.75,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {cls.className}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {isUnmarked ? (
                              <Chip
                                label="Unmarked"
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ fontWeight: "bold" }}
                              />
                            ) : (
                              <>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ fontWeight: 500 }}
                                >
                                  ({cls.presentCount}/{cls.markedCount})
                                </Typography>
                                <Chip
                                  label={`${attendancePercentage}%`}
                                  size="small"
                                  color={
                                    attendancePercentage >= 90
                                      ? "success"
                                      : attendancePercentage >= 75
                                        ? "warning"
                                        : "error"
                                  }
                                  sx={{ fontWeight: "bold", color: "white" }}
                                />
                              </>
                            )}
                          </Box>
                        </Box>
                        <LinearProgress
                          variant={isUnmarked ? "determinate" : "determinate"}
                          value={isUnmarked ? 100 : attendancePercentage}
                          sx={{
                            borderRadius: 1,
                            height: 8,
                            bgcolor: isUnmarked
                              ? theme.palette.action.hover
                              : undefined,
                            "& .MuiLinearProgress-bar": {
                              bgcolor: isUnmarked
                                ? theme.palette.action.disabledBackground
                                : attendancePercentage >= 90
                                  ? theme.palette.success.main
                                  : attendancePercentage >= 75
                                    ? theme.palette.warning.main
                                    : theme.palette.error.main,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side: Alerts and Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={4}>
            {/* Unmarked Attendance Alerts Box */}
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Attendance Alerts
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Classes that have not recorded or submitted their daily
                  register today.
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {unmarkedClasses.length === 0 ? (
                  <Box
                    sx={{
                      py: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "success.light",
                        color: "success.main",
                        mb: 1.5,
                      }}
                    >
                      <TaskAltIcon />
                    </Avatar>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "success.main" }}
                    >
                      All registers up to date!
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", mt: 0.5, px: 2 }}
                    >
                      Every class has successfully submitted logs for today.
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {unmarkedClasses.map((cls) => (
                      <ListItem
                        key={cls.classId}
                        disableGutters
                        sx={{
                          py: 1.5,
                          borderBottom: `1px solid ${theme.palette.action.hover}`,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: "error.light", color: "error.main" }}
                          >
                            <WarningIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              {cls.className}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              Teacher: {teacherNameForClass(cls.classId)}
                            </Typography>
                          }
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={() => navigate("/attendance")}
                          sx={{ textTransform: "none", fontWeight: "bold" }}
                        >
                          Ping
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* Quick Reporting Actions */}
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: "none",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                  Reporting & Approvals
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/reports")}
                    sx={{
                      justifyContent: "space-between",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      color: "text.primary",
                      borderColor: "divider",
                    }}
                  >
                    View School Monthly Reports
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PendingActionsIcon />}
                    endIcon={
                      oversightPendingLeavesCount > 0 ? (
                        <Chip
                          label={oversightPendingLeavesCount}
                          color="error"
                          size="small"
                        />
                      ) : (
                        <ArrowForwardIcon />
                      )
                    }
                    onClick={() => navigate("/leaves")}
                    sx={{
                      justifyContent: "space-between",
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      color: "text.primary",
                      borderColor: "divider",
                    }}
                  >
                    Review Leave Applications
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
      )}

      {activeTab === 1 && (
        <DailyStatusReport
          students={students}
          classes={classes}
          authorizedClassIds={authorizedClassIds}
        />
      )}

      {activeTab === 2 && (userProfile?.role === "admin" ||
        userProfile?.role === "owner" ||
        userProfile?.role === "academic_coordinator") && (
        <SubstituteAssignmentsManager />
      )}
    </Box>
  );
});

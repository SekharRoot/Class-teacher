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
import { getDashboardCardStyle } from "../../utils/navigationColors";

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
  teacherNameForClass: (classId: string) => string;
  students: any[];
  classes: any[];
  authorizedClassIds: string[];
  syncing?: boolean;
}

export const OversightDashboard = React.memo(({
  userProfile,
  overallAttendanceRate,
  stats,
  unmarkedClasses,
  oversightPendingLeavesCount,
  teacherNameForClass,
  students,
  classes,
  authorizedClassIds,
  syncing = false,
}: OversightDashboardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const isDark = theme.palette.mode === "dark";
  const attendanceCardStyle = getDashboardCardStyle("attendance", isDark);
  const studentsCardStyle = getDashboardCardStyle("students", isDark);
  const unmarkedCardStyle = getDashboardCardStyle(
    unmarkedClasses.length > 0 ? "warning" : "success",
    isDark
  );
  const leavesCardStyle = getDashboardCardStyle("leaves", isDark);
  const reportsCardStyle = getDashboardCardStyle("reports", isDark);

  return (
    <Box sx={{ mb: syncing ? 2 : 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Welcome,{" "}
        {userProfile?.displayName ||
          (userProfile?.role === "owner"
            ? "Owner"
            : userProfile?.role === "principal"
              ? "Principal"
              : userProfile?.role === "academic_coordinator"
                ? "Academic Coordinator"
                : "Administrator")}
      </Typography>

      {syncing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            mb: 4,
            borderRadius: "10px",
            bgcolor: "action.hover",
            border: "1px dashed",
            borderColor: "primary.light",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Typography variant="body2" color="primary.main" sx={{ fontWeight: "bold" }}>
              Syncing in progress...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Updating your dashboard silently with the latest school registers
            </Typography>
          </Box>
          <LinearProgress color="primary" sx={{ borderRadius: "10px", height: 4 }} />
        </Box>
      )}

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
              borderRadius: "10px",
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
                  sx={{
                    bgcolor: attendanceCardStyle.avatarBg,
                    color: attendanceCardStyle.iconColor,
                  }}
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
                  sx={{
                    borderRadius: "10px",
                    height: 6,
                    [`& .MuiLinearProgress-bar`]: {
                      transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Active Monitored Scope */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
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
                  sx={{
                    bgcolor: studentsCardStyle.avatarBg,
                    color: studentsCardStyle.iconColor,
                  }}
                >
                  <PeopleIcon />
                </Avatar>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                Assigned to {stats.totalClasses} Active Classes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Attendance Alert */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            sx={{
              borderRadius: "10px",
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
                      color: unmarkedCardStyle.iconColor,
                    }}
                  >
                    {unmarkedClasses.length}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: unmarkedCardStyle.avatarBg,
                    color: unmarkedCardStyle.iconColor,
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
              borderRadius: "10px",
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
                          ? leavesCardStyle.iconColor
                          : "text.primary",
                    }}
                  >
                    {oversightPendingLeavesCount}
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: leavesCardStyle.avatarBg,
                    color: leavesCardStyle.iconColor,
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
        {/* Actions */}
        <Grid size={{ xs: 12 }}>
          <Stack spacing={4}>
            {/* Quick Reporting Actions */}
            <Card
              sx={{
                borderRadius: "10px",
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
                    startIcon={<AssessmentIcon sx={{ color: reportsCardStyle.iconColor }} />}
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/reports")}
                    sx={{
                      justifyContent: "space-between",
                      py: 1.5,
                      borderRadius: "10px",
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
                    startIcon={<PendingActionsIcon sx={{ color: leavesCardStyle.iconColor }} />}
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/reports")}
                    sx={{
                      justifyContent: "space-between",
                      py: 1.5,
                      borderRadius: "10px",
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
                      borderRadius: "10px",
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
    </Box>
  );
});

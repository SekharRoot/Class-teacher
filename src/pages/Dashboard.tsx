import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  useTheme,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import WarningIcon from "@mui/icons-material/Warning";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CancelIcon from "@mui/icons-material/Cancel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { format } from "date-fns";
import { attendanceApi } from "../api";
import { runCalculationWorker } from "../workers/calculator";
import { useAuth } from "../contexts/AuthContext";
import { cache } from "../lib/cache";
import { useHierarchyScope } from "../hooks/useHierarchyScope";
import { LeaveRequest } from "../types";
import { TeacherDashboard } from "../components/dashboard/TeacherDashboard";
import { OversightDashboard } from "../components/dashboard/OversightDashboard";
import { useData } from "../contexts/DataContext";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";

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

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const { authorizedClassIds, isReadOnly, loadingScope, allClasses, allUsers } =
    useHierarchyScope();
  const {
    classes,
    students,
    leaves,
    loading: globalLoading,
  } = useData();

  const [loading, setLoading] = useState(true);
  const [todayRecords, setTodayRecords] = useState<Record<string, any> | null>(null);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    todayAttendanceRate: null as number | null,
    todayPresentCount: 0,
    todayTotalMarked: 0,
  });
  const [classStats, setClassStats] = useState<ClassStat[]>([]);

  const [selectedTeacherClassId, setSelectedTeacherClassId] = useState<string>("");

  useEffect(() => {
    if (userProfile?.assignedClassId && !selectedTeacherClassId) {
      setSelectedTeacherClassId(userProfile.assignedClassId);
    } else if (userProfile?.assignedClassId2 && !userProfile?.assignedClassId && !selectedTeacherClassId) {
      setSelectedTeacherClassId(userProfile.assignedClassId2);
    }
  }, [userProfile, selectedTeacherClassId]);

  const teacherAvailableClasses = useMemo(() => {
    if (!userProfile) return [];
    const classIds = [userProfile.assignedClassId, userProfile.assignedClassId2].filter(Boolean) as string[];
    return allClasses.filter((c) => classIds.includes(c.id));
  }, [userProfile, allClasses]);

  useEffect(() => {
    if (loadingScope || globalLoading) return;

    let active = true;
    let summaryLoaded = false;

    const calculateAndSetStats = async (records: any) => {
      if (!active) return;
      try {
        const result = await runCalculationWorker("CALCULATE_DASHBOARD_STATS", {
          classes,
          students,
          authorizedClassIds,
          todayRecords: records,
        });
        if (active) {
          setStats(result.stats);
          setClassStats(result.classStats);

          // Self-healing: If we calculated the full school-wide stats and didn't find a pre-computed online summary,
          // background-save the computed summary so other devices can load it instantly in 1 request.
          const isOversight =
            userProfile?.role === "owner" ||
            userProfile?.role === "admin" ||
            userProfile?.role === "principal" ||
            userProfile?.role === "academic_coordinator";

          if (isOversight && !summaryLoaded) {
            const todayDateString = format(new Date(), "yyyy-MM-dd");
            attendanceApi.saveSummaryOnly(todayDateString, result.stats, result.classStats).catch(err => {
              console.warn("Background summary save failed:", err);
            });
          }
        }
      } catch (err) {
        console.error("Worker calculation error:", err);
      }
    };

    const loadDashboardData = async () => {
      if (!currentUser) return;

      const todayDateString = format(new Date(), "yyyy-MM-dd");

      // 1. First, check local storage cache for pre-computed summary
      try {
        const cachedSummaryStr = localStorage.getItem(`summary_${todayDateString}`);
        if (cachedSummaryStr) {
          const cachedSummary = JSON.parse(cachedSummaryStr);
          if (cachedSummary && cachedSummary.stats && active) {
            setStats(cachedSummary.stats);
            setClassStats(cachedSummary.classStats);
            setLoading(false);
            summaryLoaded = true;
          }
        }
      } catch (e) {
        console.warn("Error reading local summary cache:", e);
      }

      // 2. Fetch fresh online pre-computed summary
      try {
        const onlineSummary = await attendanceApi.getSummaryByDate(todayDateString);
        if (onlineSummary && onlineSummary.stats && active) {
          setStats(onlineSummary.stats);
          setClassStats(onlineSummary.classStats);
          setLoading(false);
          summaryLoaded = true;

          // Save to local storage cache
          localStorage.setItem(`summary_${todayDateString}`, JSON.stringify(onlineSummary));
        }
      } catch (e) {
        console.warn("Error reading online summary:", e);
      }

      // 3. Fallback: If no pre-computed summary is available, run standard cache & calculation sequence
      let lastProcessedRecords: any = null;

      try {
        const localAttendanceStr = localStorage.getItem(
          `attendance_${todayDateString}`,
        );
        let todayRecordsLocal = localAttendanceStr
          ? JSON.parse(localAttendanceStr)
          : null;
        if (!todayRecordsLocal) {
          todayRecordsLocal = await cache
            .get(`attendance_${todayDateString}`)
            .catch(() => null);
        }

        if (active) {
          if (todayRecordsLocal) {
            setTodayRecords(todayRecordsLocal);
            lastProcessedRecords = todayRecordsLocal;
            if (!summaryLoaded) {
              calculateAndSetStats(todayRecordsLocal);
            }
          }
          setLoading(false);
        }
      } catch (cacheError) {
        console.warn("Error reading dashboard cache:", cacheError);
      }

      // Fetch fresh online attendance
      try {
        // Optimization: Use role-based authorizedClassIds to fetch only relevant records.
        // This is the "correct API" access pattern for different user roles.
        const todayRecordsOnline =
          await attendanceApi.getByDate(todayDateString, authorizedClassIds);

        if (active) {
          if (todayRecordsOnline) {
            const isDifferent = JSON.stringify(todayRecordsOnline) !== JSON.stringify(lastProcessedRecords);
            
            if (isDifferent || summaryLoaded) {
              setTodayRecords(todayRecordsOnline);
              // Always recalculate stats when fresh raw data arrives to ensure accuracy,
              // correcting any potential stale or partial state from the pre-computed summary.
              calculateAndSetStats(todayRecordsOnline);
            }
            
            await cache.set(
              `attendance_${todayDateString}`,
              todayRecordsOnline,
            );
            localStorage.setItem(
              `attendance_${todayDateString}`,
              JSON.stringify(todayRecordsOnline),
            );
          }
        }
      } catch (err) {
        console.error("Dashboard fresh data fetch error:", err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      active = false;
    };
  }, [
    currentUser,
    authorizedClassIds,
    loadingScope,
    globalLoading,
    classes,
    students,
  ]);

  // Helper selectors
  const studentNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    students.forEach((s) => {
      map[s.id] = `${s.firstName} ${s.lastName}`;
    });
    return map;
  }, [students]);

  const classNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    allClasses.forEach((c) => {
      map[c.id] = `${c.classStandard} ${c.section} (${c.board})`;
    });
    return map;
  }, [allClasses]);

  const teacherNameForClass = (classId: string) => {
    const teacher = allUsers.find(
      (u) => u.role === "class_teacher" && (u.assignedClassId === classId || u.assignedClassId2 === classId),
    );
    if (!teacher) return "No assigned teacher";
    return teacher.displayName || teacher.email || "Unassigned Teacher";
  };

  const isTeacher = userProfile?.role === "class_teacher";

  // 1. Calculations for TEACHER view
  const teacherClassStat = useMemo(() => {
    if (!isTeacher || !selectedTeacherClassId) return null;
    return (
      classStats.find((cs) => cs.classId === selectedTeacherClassId) ||
      null
    );
  }, [isTeacher, selectedTeacherClassId, classStats]);

  const teacherClassInfo = useMemo(() => {
    if (!isTeacher || !selectedTeacherClassId) return null;
    return allClasses.find((c) => c.id === selectedTeacherClassId) || null;
  }, [isTeacher, selectedTeacherClassId, allClasses]);

  const teacherLeaves = useMemo(() => {
    if (!isTeacher || !selectedTeacherClassId) return [];
    return leaves.filter((l) => l.classId === selectedTeacherClassId);
  }, [isTeacher, selectedTeacherClassId, leaves]);

  const teacherPendingLeavesCount = useMemo(() => {
    return teacherLeaves.filter((l) => l.status === "pending").length;
  }, [teacherLeaves]);

  // 2. Calculations for OVERSIGHT view (Admin, Principal, Academic Coordinator)
  const oversightAuthorizedLeaves = useMemo(() => {
    if (isTeacher) return [];
    return leaves.filter((l) => authorizedClassIds.includes(l.classId));
  }, [isTeacher, authorizedClassIds, leaves]);

  const oversightPendingLeavesCount = useMemo(() => {
    return oversightAuthorizedLeaves.filter((l) => l.status === "pending")
      .length;
  }, [oversightAuthorizedLeaves]);

  const unmarkedClasses = useMemo(() => {
    if (isTeacher) return [];
    return classStats.filter((cs) => cs.markedCount === 0);
  }, [isTeacher, classStats]);

  const overallAttendanceRate = useMemo(() => {
    let totalPresent = 0;
    let totalMarked = 0;
    classStats.forEach((cs) => {
      totalPresent += cs.presentCount;
      totalMarked += cs.markedCount;
    });
    return totalMarked > 0
      ? Math.round((totalPresent / totalMarked) * 100)
      : null;
  }, [classStats]);

  if (loading || loadingScope) {
    return <DashboardSkeleton />;
  }

  // --- RENDERING TEACHER DASHBOARD VIEW ---
  if (isTeacher) {
    return (
      <TeacherDashboard
        userProfile={userProfile}
        teacherClassInfo={teacherClassInfo}
        teacherClassStat={teacherClassStat}
        teacherLeaves={teacherLeaves}
        teacherPendingLeavesCount={teacherPendingLeavesCount}
        studentNameMap={studentNameMap}
        selectedClassId={selectedTeacherClassId}
        onClassChange={setSelectedTeacherClassId}
        availableClasses={teacherAvailableClasses}
      />
    );
  }

  // --- RENDERING OVERSIGHT DASHBOARD VIEW (Admin, Principal, Academic Coordinator) ---
  return (
    <OversightDashboard
      userProfile={userProfile}
      overallAttendanceRate={overallAttendanceRate}
      stats={stats}
      unmarkedClasses={unmarkedClasses}
      oversightPendingLeavesCount={oversightPendingLeavesCount}
      teacherNameForClass={teacherNameForClass}
      students={students}
      classes={classes}
      authorizedClassIds={authorizedClassIds}
    />
  );
}

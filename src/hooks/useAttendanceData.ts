import { useState, useEffect } from "react";
import { format, subDays, addDays, parseISO } from "date-fns";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";
import { leavesApi, attendanceApi, studentsApi } from "../api";
import { AttendanceStatus, LeaveRequest, Student } from "../types";
import { runCalculationWorker } from "../workers/calculator";
import { cache } from "../lib/cache";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";

export function useAttendanceData() {
  const { authResolved } = useAuth();
  const {
    classes,
    students,
    leaves: contextLeaves,
    loading: globalLoading,
    setStudents,
    offlineMode,
    setOfflineMode,
  } = useData();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateString = format(selectedDate, "yyyy-MM-dd");

  const [leavesList, setLeavesList] = useState<LeaveRequest[]>([]);
  const [historyLimit, setHistoryLimit] = useState(6);
  const [historyDates, setHistoryDates] = useState<
    {
      date: string;
      present: number;
      absent: number;
      leave: number;
    }[]
  >([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!globalLoading) {
      setLoading(false);
    }
  }, [globalLoading]);

  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  const fetchBaseData = async () => {
    await fetchAttendanceForDate(dateString);
  };

  const fetchAttendanceForDate = async (dateStr: string) => {
    if (!authResolved) return;
    if (offlineMode) {
      try {
        setLoading(true);
        const cached = localStorage.getItem(`attendance_${dateStr}`);
        if (cached) {
          unwrapAttendance(JSON.parse(cached), dateStr, true);
        } else {
          setAttendance({});
        }
      } catch (err) {
        console.error("Offline fetch failed:", err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const data = await attendanceApi.getByDate(dateStr);
      if (data && Object.keys(data).length > 0) {
        unwrapAttendance(data, dateStr);
      } else {
        setAttendance({});
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const unwrapAttendance = (
    data: Record<string, any>,
    dateStr: string,
    skipCache = false,
  ) => {
    // Keep the attendance mapping in state
    setAttendance(data);
    if (!skipCache) {
      localStorage.setItem(`attendance_${dateStr}`, JSON.stringify(data));
    }
  };

  const historyCacheKey = `history_cache_${selectedClassId || "all"}_${historyLimit}`;

  const fetchHistory = async () => {
    if (!authResolved) return;
    try {
      // 1. Immediately load cached history if available (SWR)
      const cached = localStorage.getItem(historyCacheKey);
      if (cached) {
        try {
          setHistoryDates(JSON.parse(cached));
        } catch (e) {}
      }

      // Fetch students for the selected class specifically to save reads
      let classStudents: Student[] = [];
      if (selectedClassId) {
        classStudents = await studentsApi.getByClass(selectedClassId);
      } else {
        classStudents = await studentsApi.getAll();
      }

      const classStudentIds = classStudents.map((s) => s.id);

      let datesList: any[] = [];

      if (!offlineMode) {
        // Fetch from Firestore (optimized single-read summary history)
        datesList = await attendanceApi.getHistory(
          classStudentIds,
          selectedClassId || undefined,
          historyLimit,
        );
      } else {
        // Use local storage for offline history
        const localStorageItems: Record<string, string> = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("attendance_")) {
            localStorageItems[key] = localStorage.getItem(key) || "{}";
          }
        }
        datesList = await runCalculationWorker("CALCULATE_LOCAL_HISTORY", {
          localStorageItems,
          classStudentIds,
          selectedClassId,
        });
        datesList = datesList.slice(0, historyLimit);
      }

      setHistoryDates(datesList);
      localStorage.setItem(historyCacheKey, JSON.stringify(datesList));
    } catch (err) {
      console.error("Error calculating history:", err);
    }
  };

  // 1. Initial cached data load on mount to prevent any flash of loading screen
  useEffect(() => {
    let active = true;
    function loadCachedData() {
      const cachedAttendance = localStorage.getItem(`attendance_${dateString}`);
      if (active && cachedAttendance) {
        try {
          unwrapAttendance(JSON.parse(cachedAttendance), dateString, true);
        } catch (e) {
          // ignore
        }
      }
    }
    loadCachedData();
    return () => {
      active = false;
    };
  }, []);

  // 2. Local cache loading on date change (instant)
  useEffect(() => {
    let active = true;
    function loadCachedAttendance() {
      const cached = localStorage.getItem(`attendance_${dateString}`);
      if (active) {
        if (cached) {
          try {
            unwrapAttendance(JSON.parse(cached), dateString, true);
          } catch (e) {
            setAttendance({});
          }
        } else {
          setAttendance({});
        }
      }
    }
    loadCachedAttendance();
    return () => { active = false; };
  }, [dateString]);

  // 4. Background Real-time sync for selected date attendance
  useEffect(() => {
    if (offlineMode || !selectedClassId || !authResolved) return;

    const activeSchoolId = getActiveSchoolId();
    const docRef = doc(db, "schools", activeSchoolId, "classes", selectedClassId, "attendance", dateString);

    const unsubAttendance = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Merge with existing attendance to preserve data for other classes
          setAttendance(prev => ({
            ...prev,  // Keep existing state for other classes
            ...data   // Overwrite with fresh server data for the current class/students
          }));
          let existingCached: Record<string, any> = {};
          try {
            const raw = localStorage.getItem(`attendance_${dateString}`);
            if (raw) existingCached = JSON.parse(raw);
          } catch {
            existingCached = {};
          }
          localStorage.setItem(`attendance_${dateString}`, JSON.stringify({
            ...existingCached,
            ...data
          }));
        }
        setLoading(false);
      },
      (err) => {
        console.error("Attendance live update error:", err);
        setLoading(false);
      },
    );

    return () => {
      unsubAttendance();
    };
  }, [dateString, offlineMode, selectedClassId]);

  // 5. Run connection check and initial sync
  useEffect(() => {
    fetchAttendanceForDate(dateString);
  }, [dateString, authResolved]);

  // 6. Recalculate history whenever selected class, student database, historyLimit, activeTab, or dateString updates (but not on live attendance changes)
  useEffect(() => {
    if (activeTab === 1) {
      fetchHistory();
    }
  }, [selectedClassId, students, dateString, historyLimit, activeTab, authResolved]);

  // Reset history limit when switching class
  useEffect(() => {
    setHistoryLimit(6);
  }, [selectedClassId]);

  // Fetch fresh class students only when switching to a class or if local roster is incomplete/missing images
  useEffect(() => {
    if (!selectedClassId || offlineMode || !authResolved) return;

    // Check if we already have complete student records with images in memory
    const classStudents = students.filter((s) => s.classId === selectedClassId);
    const hasMissingImages = classStudents.length === 0 || classStudents.some((s) => !s.image);

    // If local memory already has complete data for all students in this class, skip network call
    if (!hasMissingImages && classStudents.length > 0) return;

    let active = true;
    studentsApi.getByClass(selectedClassId).then((freshClassStudents) => {
      if (!active || !freshClassStudents || freshClassStudents.length === 0) return;

      setStudents((prev) => {
        const freshMap = new Map(freshClassStudents.map((s) => [s.id, s]));
        let changed = false;
        const updated = prev.map((s) => {
          const fresh = freshMap.get(s.id);
          if (fresh) {
            if (s.image !== fresh.image || s.firstName !== fresh.firstName || s.lastName !== fresh.lastName) {
              changed = true;
            }
            return fresh;
          }
          return s;
        });

        // Add any missing students
        freshClassStudents.forEach((fresh) => {
          if (!prev.some((p) => p.id === fresh.id)) {
            updated.push(fresh);
            changed = true;
          }
        });

        return changed ? updated : prev;
      });
    }).catch((err) => {
      console.warn("Failed to fetch fresh class students for attendance sheet:", err);
    });

    return () => {
      active = false;
    };
  }, [selectedClassId, offlineMode, authResolved, students.length]);

  // 7. Sync leaves from DataContext
  useEffect(() => {
    setLeavesList(contextLeaves || []);
  }, [contextLeaves]);

  // 8. Auto-prefill approved leaves on the daily attendance sheet
  useEffect(() => {
    if (leavesList.length === 0) return;

    setAttendance((prev) => {
      let changed = false;
      const updated = { ...prev };

      leavesList.forEach((l) => {
        if (
          l.status === "approved" &&
          dateString >= l.startDate &&
          dateString <= l.endDate
        ) {
          if (!updated[l.studentId]) {
            updated[l.studentId] = "leave";
            changed = true;
          }
        }
      });

      return changed ? updated : prev;
    });
  }, [leavesList, dateString, students]);

  return {
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
    setToastSeverity,
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
    fetchAttendanceForDate,
    fetchHistory,
    leavesList,
  };
}

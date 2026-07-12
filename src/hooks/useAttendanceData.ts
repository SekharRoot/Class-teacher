import { useState, useEffect } from "react";
import { format, subDays, addDays, parseISO } from "date-fns";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { leavesApi, attendanceApi, studentsApi } from "../api";
import { AttendanceStatus, LeaveRequest, Student } from "../types";
import { runCalculationWorker } from "../workers/calculator";
import { cache } from "../lib/cache";
import { useData } from "../contexts/DataContext";

export function useAttendanceData() {
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
    } catch (err) {
      console.error("Cache check error:", err);
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

  const fetchHistory = async () => {
    try {
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
        // Fetch from Firestore (optimized to last 30 entries/days)
        datesList = await attendanceApi.getHistory(
          classStudentIds,
          selectedClassId || undefined,
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
      }

      setHistoryDates(datesList);
    } catch (err) {
      console.error("Error calculating history:", err);
    }
  };

  // 1. Initial cached data load on mount to prevent any flash of loading screen
  useEffect(() => {
    let active = true;
    async function loadCachedData() {
      const [cachedAttendance] = await Promise.all([
        cache.get(`attendance_${dateString}`),
      ]);
      if (active) {
        if (cachedAttendance)
          unwrapAttendance(cachedAttendance, dateString, true);
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
    async function loadCachedAttendance() {
      const cached = await cache.get(`attendance_${dateString}`);
      if (active && cached) {
        unwrapAttendance(cached, dateString, true);
      }
    }
    loadCachedAttendance();
  }, [dateString]);

  // 4. Background Real-time sync for selected date attendance
  useEffect(() => {
    if (offlineMode) return;

    const unsubAttendance = onSnapshot(
      doc(db, "attendance", dateString),
      (docSnap) => {
        const isUnsynced =
          localStorage.getItem(`unsynced_${dateString}`) === "true";
        if (isUnsynced) {
          // We have local offline changes that haven't been synced yet!
          // Do not overwrite the UI with server data.
          setLoading(false);
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data();
          unwrapAttendance(data, dateString);
        } else {
          setAttendance({});
          localStorage.removeItem(`attendance_${dateString}`);
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
  }, [dateString, offlineMode]);

  // 5. Run connection check and initial sync
  useEffect(() => {
    fetchAttendanceForDate(dateString);
  }, [dateString]);

  // 6. Recalculate history whenever selected class, student database or attendance updates
  useEffect(() => {
    fetchHistory();
  }, [selectedClassId, students, attendance, dateString]);

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
    activeTab,
    setActiveTab,
    showToast,
    fetchBaseData,
    fetchAttendanceForDate,
    fetchHistory,
    leavesList,
  };
}

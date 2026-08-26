import React, { useCallback, useMemo } from "react";
import { AttendanceStatus, DayReasonType, Student } from "../types";
import { attendanceApi, classesApi, studentsApi } from "../api";
import { cache } from "../lib/cache";
import { useAuth } from "../contexts/AuthContext";
import { unwrapStatus } from "../utils/statusHelper";

export function useAttendanceActions(
  attendance: Record<string, AttendanceStatus>,
  setAttendance: React.Dispatch<
    React.SetStateAction<Record<string, AttendanceStatus>>
  >,
  students: Student[],
  setStudents: (st: Student[]) => void,
  dateString: string,
  offlineMode: boolean,
  showToast: (
    msg: string,
    severity?: "success" | "error" | "warning" | "info",
  ) => void,
  fetchHistory: () => void,
  setLoading: (l: boolean) => void,
  historyDates: any[],
  setHistoryDates: (hd: any[]) => void,
  fetchBaseData: () => void,
  selectedClassId?: string | null,
  fetchDayInfo?: (dateStr: string, classId?: string | null) => void,
) {
  const { userProfile } = useAuth();
  const updateLocalCache = useCallback((clientAtt: Record<string, any>) => {
    // Generate enriched records to save
    const enriched: Record<string, any> = {};
    Object.entries(clientAtt).forEach(([sId, val]) => {
      const student = students.find((s) => s.id === sId);
      const statusStr = unwrapStatus(val);
      enriched[sId] = {
        status: statusStr || undefined,
        classId: student?.classId ?? "",
        boarderType: student?.boarderType ?? "",
      };
    });
    cache.set(`attendance_${dateString}`, enriched);
    localStorage.setItem(`unsynced_${dateString}`, "true");
    return enriched;
  }, [students, dateString]);

  const markAttendance = useCallback((
    studentId: string,
    status: AttendanceStatus | null,
  ) => {
    const updated = { ...attendance };
    if (status === null) {
      delete updated[studentId];
    } else {
      updated[studentId] = status;
    }
    setAttendance(updated);
    updateLocalCache(updated);
  }, [attendance, updateLocalCache, setAttendance]);

  const markAllStatus = useCallback((
    status: AttendanceStatus,
    classStudents: Student[],
  ) => {
    if (classStudents.length === 0) return;

    const updated = { ...attendance };
    classStudents.forEach((student) => {
      updated[student.id] = status;
    });

    setAttendance(updated);
    updateLocalCache(updated);
  }, [attendance, updateLocalCache, setAttendance]);

  const syncAttendance = useCallback(async () => {
    if (offlineMode) {
      showToast("Cannot sync while in offline mode.", "warning");
      return;
    }
    try {
      setLoading(true);
      const enriched = updateLocalCache(attendance);
      // Always update the server-side lightweight summary document on sync for correct administrative totals
      await attendanceApi.saveByDate(dateString, enriched, false);
      localStorage.removeItem(`unsynced_${dateString}`);
      localStorage.removeItem(`summary_${dateString}`);
      localStorage.removeItem(`attendance_${dateString}`);

      // Check for any other unsynced offline dates in local storage
      let otherCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("unsynced_") && key !== `unsynced_${dateString}`) {
          const otherDate = key.replace("unsynced_", "");
          if (otherDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const rawCached = localStorage.getItem(`attendance_${otherDate}`);
            if (rawCached) {
              try {
                const parsed = JSON.parse(rawCached);
                await attendanceApi.saveByDate(otherDate, parsed, false);
                localStorage.removeItem(`unsynced_${otherDate}`);
                localStorage.removeItem(`summary_${otherDate}`);
                localStorage.removeItem(`attendance_${otherDate}`);
                otherCount++;
              } catch (e) {
                console.warn(`Could not sync pending offline date ${otherDate}:`, e);
              }
            }
          }
        }
      }

      if (otherCount > 0) {
        showToast(`Synced active attendance and ${otherCount} offline registers to server!`, "success");
      } else {
        showToast("Attendance successfully saved to server!", "success");
      }
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Failed to synchronize with server.", "error");
    } finally {
      setLoading(false);
    }
  }, [attendance, offlineMode, dateString, showToast, fetchHistory, updateLocalCache, setLoading]);

  const chunkProcess = async <T>(items: T[], fn: (item: T) => Promise<any>, chunkSize: number = 20): Promise<void> => {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await Promise.all(chunk.map(fn));
    }
  };

  const clearAllData = useCallback(async () => {
    if (
      !window.confirm(
        "CRITICAL WARNING: This will permanently wipe all students, classes, and attendance registers from the local cache and Firestore database! Do you want to proceed?",
      )
    ) {
      return;
    }
    if (
      !window.confirm(
        "FINAL CONFIRMATION: This action is irreversible and will delete EVERYTHING. Are you 100% certain you want to destroy all data?",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await cache.clearAllOffline();

      setStudents([]);
      setAttendance({});
      setHistoryDates([]);

      if (offlineMode) {
        showToast("Offline local database fully reset.", "info");
        return;
      }

      // Clear attendance records in chunks of 20
      const datesToDelete = [...historyDates.map((h) => h.date), dateString];
      await chunkProcess(datesToDelete, (d) => attendanceApi.deleteRecord(d));

      const [studentsList, classesList] = await Promise.all([
        studentsApi.getAll(),
        classesApi.getAll(),
      ]);

      // Clear students and classes in chunks of 20
      await chunkProcess(studentsList, (s) => studentsApi.delete(s.id));
      await chunkProcess(classesList, (c) => classesApi.delete(c.id));

      showToast(
        "Cloud Firestore and local databases wiped successfully!",
        "success",
      );
      fetchBaseData();
    } catch (err) {
      console.error(err);
      showToast("Could not clear cloud. Local storage wiped.", "warning");
      fetchBaseData();
    } finally {
      setLoading(false);
    }
  }, [
    offlineMode,
    historyDates,
    dateString,
    setLoading,
    setStudents,
    setAttendance,
    setHistoryDates,
    showToast,
    fetchBaseData,
  ]);

  const assignHoliday = useCallback(
    async (dayReasonType: DayReasonType, dayReason: string) => {
      if (!selectedClassId) {
        showToast("Please select a class first.", "warning");
        return;
      }
      try {
        setLoading(true);
        await attendanceApi.assignDayHoliday(
          dateString,
          selectedClassId,
          dayReasonType,
          dayReason,
        );

        if (dayReasonType !== "none") {
          const classStudents = students.filter(
            (s) => s.classId === selectedClassId && s.isActive !== false,
          );
          const updated = { ...attendance };
          classStudents.forEach((st) => {
            updated[st.id] = "absent";
          });
          setAttendance(updated);
          updateLocalCache(updated);
          showToast(
            `Day assigned as ${dayReason || "Holiday"} and saved to server!`,
            "success",
          );
        } else {
          showToast("Holiday revoked. Regular working day restored.", "info");
        }

        if (fetchDayInfo) {
          fetchDayInfo(dateString, selectedClassId);
        }
        fetchHistory();
      } catch (err) {
        console.error("Failed to assign holiday:", err);
        showToast("Failed to assign day status.", "error");
      } finally {
        setLoading(false);
      }
    },
    [
      selectedClassId,
      dateString,
      students,
      attendance,
      updateLocalCache,
      setAttendance,
      showToast,
      fetchDayInfo,
      fetchHistory,
      setLoading,
    ],
  );

  return useMemo(
    () => ({
      markAttendance,
      markAllStatus,
      syncAttendance,
      clearAllData,
      assignHoliday,
    }),
    [
      markAttendance,
      markAllStatus,
      syncAttendance,
      clearAllData,
      assignHoliday,
    ],
  );
}

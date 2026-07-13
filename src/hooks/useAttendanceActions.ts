import React, { useCallback, useMemo } from "react";
import { AttendanceStatus, Student } from "../types";
import { attendanceApi, classesApi, studentsApi } from "../api";
import { cache } from "../lib/cache";

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
) {
  const updateLocalCache = useCallback((clientAtt: Record<string, any>) => {
    // Generate enriched records to save
    const enriched: Record<string, any> = {};
    Object.entries(clientAtt).forEach(([sId, val]) => {
      const student = students.find((s) => s.id === sId);
      const isObj = typeof val === 'object' && val !== null;
      enriched[sId] = {
        status: (isObj ? val.status : val) || undefined,
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
    setAttendance((prev) => {
      const updated = { ...prev };
      if (status === null) {
        delete updated[studentId];
      } else {
        updated[studentId] = status;
      }
      
      // Perform side effect in a microtask to keep updater pure
      Promise.resolve().then(() => {
        updateLocalCache(updated);
      });

      return updated;
    });
  }, [updateLocalCache, setAttendance]);

  const markAllStatus = useCallback((
    status: AttendanceStatus,
    classStudents: Student[],
  ) => {
    if (classStudents.length === 0) return;

    setAttendance((prev) => {
      const updated = { ...prev };
      classStudents.forEach((student) => {
        updated[student.id] = status;
      });

      Promise.resolve().then(() => {
        updateLocalCache(updated);
      });

      return updated;
    });
  }, [updateLocalCache, setAttendance]);

  const syncAttendance = useCallback(async () => {
    if (offlineMode) {
      showToast("Cannot sync while in offline mode.", "warning");
      return;
    }
    try {
      setLoading(true);
      const enriched = updateLocalCache(attendance);
      await attendanceApi.saveByDate(dateString, enriched);
      localStorage.removeItem(`unsynced_${dateString}`);
      showToast("Attendance successfully synced with server!", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Failed to synchronize with server.", "error");
    } finally {
      setLoading(false);
    }
  }, [attendance, offlineMode, dateString, showToast, fetchHistory, updateLocalCache, setLoading]);

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

      // Parallelize deletions where possible
      await Promise.all([
        ...historyDates.map((h) => attendanceApi.deleteRecord(h.date)),
        attendanceApi.deleteRecord(dateString),
      ]);

      const [studentsList, classesList] = await Promise.all([
        studentsApi.getAll(),
        classesApi.getAll(),
      ]);

      await Promise.all([
        ...studentsList.map((s) => studentsApi.delete(s.id)),
        ...classesList.map((c) => classesApi.delete(c.id)),
      ]);

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

  return useMemo(() => ({ markAttendance, markAllStatus, syncAttendance, clearAllData }), [
    markAttendance,
    markAllStatus,
    syncAttendance,
    clearAllData,
  ]);
}

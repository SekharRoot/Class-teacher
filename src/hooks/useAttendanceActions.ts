import React from "react";
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
  const updateLocalCache = (clientAtt: Record<string, AttendanceStatus>) => {
    // Generate enriched records to save
    const enriched: Record<string, any> = {};
    Object.entries(clientAtt).forEach(([sId, status]) => {
      const student = students.find((s) => s.id === sId);
      enriched[sId] = {
        status,
        classId: student?.classId || "",
        boarderType: student?.boarderType || "",
      };
    });
    cache.set(`attendance_${dateString}`, enriched);
    localStorage.setItem(`unsynced_${dateString}`, "true");
    return enriched;
  };

  const markAttendance = (
    studentId: string,
    status: AttendanceStatus | null,
  ) => {
    // 1. Calculate the new attendance state synchronously without side effects in a pure way
    let finalUpdated: Record<string, AttendanceStatus> = {};

    setAttendance((prev) => {
      const updated = { ...prev };
      if (status === null) {
        delete updated[studentId];
      } else {
        updated[studentId] = status;
      }
      // Store reference to the calculated state for our side effects below
      finalUpdated = updated;
      return updated;
    });

    // 2. Perform side effects outside of the setState updater
    // React state updates might be batched, but we can safely use the finalUpdated we just calculated.
    // Ensure we run this on the next microtask so we don't block the React render cycle if there are any immediate side effects.
    Promise.resolve().then(() => {
      updateLocalCache(finalUpdated);
    });
  };

  const markAllStatus = (
    status: AttendanceStatus,
    classStudents: Student[],
  ) => {
    if (classStudents.length === 0) return;

    let finalUpdated: Record<string, AttendanceStatus> = {};

    setAttendance((prev) => {
      const updated = { ...prev };
      classStudents.forEach((student) => {
        updated[student.id] = status;
      });
      finalUpdated = updated;
      return updated;
    });

    Promise.resolve().then(() => {
      updateLocalCache(finalUpdated);
    });
  };

  const syncAttendance = async () => {
    if (offlineMode) {
      showToast("Cannot sync while in offline mode.", "warning");
      return;
    }
    try {
      const enriched = updateLocalCache(attendance);
      await attendanceApi.saveByDate(dateString, enriched);
      localStorage.removeItem(`unsynced_${dateString}`);
      showToast("Attendance successfully synced with server!", "success");
      fetchHistory();
    } catch (err) {
      console.error(err);
      showToast("Failed to synchronize with server.", "error");
    }
  };

  const clearAllData = async () => {
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
  };

  return { markAttendance, markAllStatus, syncAttendance, clearAllData };
}

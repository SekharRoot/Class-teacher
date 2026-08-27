import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  writeBatch,
  orderBy,
  limit,
  where,
  documentId,
  collectionGroup,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
import { AttendanceStatus, StudentStatusFilter } from "../types";
import { runCalculationWorker } from "../workers/calculator";
import { classesApi } from "./classes";
import { studentsApi } from "./students";
import { unwrapStatus } from "../utils/statusHelper";
import {
  loadMonthlySheetCache,
  saveMonthlySheetCache,
  updateMonthlySheetCacheForDate,
  MonthlySheetCache,
  CACHE_TTL_MS,
} from "../utils/monthlyAttendanceCache";

export interface AttendanceRecordSummary {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

export const attendanceApi = {
  /**
   * Fetches attendance statuses mapped by student ID for a given date.
   * Optionally filtered by authorized class IDs.
   */
  async getByDate(dateString: string, authorizedClassIds?: string[]): Promise<Record<string, any>> {
    try {
      const activeSchoolId = getActiveSchoolId();
      let classIds: string[] = [];

      if (authorizedClassIds && authorizedClassIds.length > 0) {
        classIds = authorizedClassIds;
      } else {
        const classesList = await classesApi.getAll();
        classIds = ["unassigned", ...classesList.map(c => c.id)];
      }

      const promises = classIds.map(async (cId) => {
        const ref = doc(db, "schools", activeSchoolId, "classes", cId, "attendance", dateString);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          return snap.data() || {};
        }
        return {};
      });

      const results = await Promise.all(promises);
      const merged: Record<string, any> = {};
      results.forEach((records) => {
        Object.assign(merged, records);
      });
      return merged;
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.GET,
        `attendance/${dateString}`,
      );
      return {};
    }
  },

  /**
   * Persists attendance records for a given date.
   */
  async saveByDate(
    dateString: string,
    records: Record<string, any>,
    skipSummaryUpdate = false,
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      
      // Sanitization: Recursively remove undefined values to prevent Firestore errors
      const sanitize = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(sanitize);
        } else if (obj !== null && typeof obj === 'object') {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = sanitize(value);
            }
            return acc;
          }, {} as any);
        }
        return obj;
      };

      const cleanRecords = sanitize(records);

      // Resolve student classes to partition records correctly
      const studentsList = await studentsApi.getAll();
      const studentToClass: Record<string, string> = {};
      studentsList.forEach(s => {
        studentToClass[s.id] = s.classId || "unassigned";
      });

      // Group records by class
      const metaKeys = new Set(["_meta", "dayReason", "dayReasonType", "isHoliday", "updatedAt", "date", "classId"]);
      const holidayPayload: Record<string, any> = {};
      if (cleanRecords.dayReason !== undefined && typeof cleanRecords.dayReason === "string") {
        holidayPayload.dayReason = cleanRecords.dayReason;
      }
      if (cleanRecords.dayReasonType !== undefined && typeof cleanRecords.dayReasonType === "string") {
        holidayPayload.dayReasonType = cleanRecords.dayReasonType;
      }
      if (cleanRecords.isHoliday !== undefined && typeof cleanRecords.isHoliday === "boolean") {
        holidayPayload.isHoliday = cleanRecords.isHoliday;
      }

      const classIdToRecords: Record<string, Record<string, any>> = {};
      Object.entries(cleanRecords).forEach(([studentId, val]) => {
        if (metaKeys.has(studentId)) return;
        let classId = val && typeof val === "object" ? (val as any).classId : null;
        if (!classId) {
          classId = studentToClass[studentId] || "unassigned";
        }
        if (!classIdToRecords[classId]) {
          classIdToRecords[classId] = {};
        }
        const statusStr = unwrapStatus(val);
        const isObj = typeof val === "object" && val !== null;
        classIdToRecords[classId][studentId] = isObj
          ? { ...val, status: statusStr, classId }
          : { status: statusStr, classId };
      });

      // Save class-level attendance using atomic batch writes
      const nowIso = new Date().toISOString();
      const classEntries = Object.entries(classIdToRecords);
      if (classEntries.length > 0) {
        const BATCH_LIMIT = 450;
        for (let i = 0; i < classEntries.length; i += BATCH_LIMIT) {
          const batch = writeBatch(db);
          const chunk = classEntries.slice(i, i + BATCH_LIMIT);
          for (const [cId, classRecords] of chunk) {
            const ref = doc(
              db,
              "schools",
              activeSchoolId,
              "classes",
              cId,
              "attendance",
              dateString,
            );
            batch.set(ref, { ...classRecords, ...holidayPayload, updatedAt: nowIso }, { merge: true });
          }
          await batch.commit();
        }

        // Update local monthly cache for all affected classes immediately
        for (const [cId, classRecords] of classEntries) {
          const unwrapMap: Record<string, string> = {};
          Object.entries(classRecords).forEach(([sId, sObj]) => {
            unwrapMap[sId] = unwrapStatus(sObj);
          });
          const dayInfo = (holidayPayload.isHoliday || holidayPayload.dayReason || holidayPayload.dayReasonType)
            ? {
                isHoliday: !!holidayPayload.isHoliday,
                dayReasonType: holidayPayload.dayReasonType,
                dayReason: holidayPayload.dayReason,
              }
            : undefined;
          updateMonthlySheetCacheForDate(cId, dateString, unwrapMap, dayInfo, nowIso);
        }
      } else if (Object.keys(holidayPayload).length > 0) {
        // If updating holiday payload directly without student records
        const classesList = await classesApi.getAll();
        const batch = writeBatch(db);
        classesList.forEach((cls) => {
          const ref = doc(db, "schools", activeSchoolId, "classes", cls.id, "attendance", dateString);
          batch.set(ref, { ...holidayPayload, updatedAt: nowIso }, { merge: true });
        });
        await batch.commit();

        classesList.forEach((cls) => {
          updateMonthlySheetCacheForDate(
            cls.id,
            dateString,
            {},
            {
              isHoliday: !!holidayPayload.isHoliday,
              dayReasonType: holidayPayload.dayReasonType,
              dayReason: holidayPayload.dayReason,
            },
            nowIso
          );
        });
      }

      // Automatically pre-compute and save lightweight summary doc for the oversight dashboard
      // Performance Optimization: Skip this for class_teachers who only have local class data context!
      if (!skipSummaryUpdate) {
        await this.generateAndSaveSummary(dateString, cleanRecords);
      }
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `attendance/${dateString}`,
      );
    }
  },

  /**
   * Directly saves a pre-computed attendance summary to Firestore.
   */
  async saveSummaryOnly(
    dateString: string,
    stats: any,
    classStats: any[]
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const summaryDocRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      await setDoc(summaryDocRef, {
        date: dateString,
        schoolId: activeSchoolId,
        stats,
        classStats,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn("Direct summary write failed:", err);
    }
  },

  /**
   * Fetches the pre-computed attendance summary for a given date.
   */
  async getSummaryByDate(dateString: string): Promise<any | null> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const summaryRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      const snap = await getDoc(summaryRef);
      if (snap.exists()) {
        return snap.data();
      }
      return null;
    } catch (error) {
      console.warn("Summary fetch failed or skipped:", error);
      return null;
    }
  },

  /**
   * Pre-computes attendance metrics and saves them to a lightweight summary document.
   */
  async generateAndSaveSummary(
    dateString: string,
    partialRecords: Record<string, any>,
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();

      // 1. Fetch classes & students using local/cached copies to avoid full server downloads
      const classesList = await classesApi.getAll(false);
      const studentsList = await studentsApi.getAll(false);

      const studentToClass: Record<string, string> = {};
      studentsList.forEach(s => {
        studentToClass[s.id] = s.classId || "unassigned";
      });

      // 2. Identify which classes have modified records in partialRecords
      const classIdToRecords: Record<string, Record<string, any>> = {};
      Object.entries(partialRecords).forEach(([studentId, val]) => {
        let classId = val && typeof val === "object" ? (val as any).classId : null;
        if (!classId) {
          classId = studentToClass[studentId] || "unassigned";
        }
        if (!classIdToRecords[classId]) {
          classIdToRecords[classId] = {};
        }
        classIdToRecords[classId][studentId] = val;
      });

      // Helper to resolve boarder type
      const getBoarderType = (studentId: string, val: any) => {
        const s = studentsList.find((st) => st.id === studentId);
        if (s) return s.boarderType;
        if (val && typeof val === "object" && (val as any).boarderType) {
          return (val as any).boarderType;
        }
        return "Day Scholar";
      };

      const newlyComputedClassStats: Record<string, any> = {};

      // 3. For each updated class, compute class-level stats and save them to the attendance_summary subcollection
      const classSummaryPromises = Object.entries(classIdToRecords).map(async ([cId, classRecords]) => {
        const cls = classesList.find((c) => c.id === cId) || {
          id: cId,
          classStandard: "Class",
          section: cId === "unassigned" ? "Unassigned" : cId,
          board: "General"
        };

        // Fetch existing records for this specific class to merge, taking only 1 read
        const classRef = doc(db, "schools", activeSchoolId, "classes", cId, "attendance", dateString);
        const classSnap = await getDoc(classRef);
        const existingClassRecords = classSnap.exists() ? classSnap.data() || {} : {};
        const mergedClassRecords = { ...existingClassRecords, ...classRecords };

        // Find all active students in this class
        const activeClassStudents = studentsList.filter((s) => s.classId === cId && s.isActive !== false);

        // Also find any students who have actual attendance records on this date for this class
        const loggedStudentIds = new Set<string>();
        Object.entries(mergedClassRecords).forEach(([studentId, val]) => {
          const isObj = typeof val === "object" && val !== null;
          const recordClassId = isObj ? (val as any).classId : null;
          if (
            recordClassId === cId ||
            (!recordClassId && studentToClass[studentId] === cId)
          ) {
            loggedStudentIds.add(studentId);
          }
        });

        // Combine active students and student IDs found in attendance records
        const activeStudentIds = new Set(activeClassStudents.map((s) => s.id));
        const allUniqueStudentIds = Array.from(new Set([...Array.from(loggedStudentIds), ...Array.from(activeStudentIds)]));

        const total = allUniqueStudentIds.length;
        const totalDB = allUniqueStudentIds.filter(id => getBoarderType(id, mergedClassRecords[id]) === "Day Boarder").length;
        const totalDS = allUniqueStudentIds.filter(id => getBoarderType(id, mergedClassRecords[id]) === "Day Scholar").length;
        const totalBoarder = allUniqueStudentIds.filter(id => getBoarderType(id, mergedClassRecords[id]) === "Full Boarder").length;

        let present = 0;
        let presentDB = 0;
        let presentDS = 0;
        let presentBoarder = 0;
        let absent = 0;
        let absentDB = 0;
        let absentDS = 0;
        let absentBoarder = 0;
        let leave = 0;
        let leaveDB = 0;
        let leaveDS = 0;
        let leaveBoarder = 0;
        let marked = 0;
        const classAbsentees: any[] = [];

        allUniqueStudentIds.forEach((studentId) => {
          const val = mergedClassRecords[studentId];
          const status = unwrapStatus(val);

          const boarderType = getBoarderType(studentId, val);

          if (status) {
            marked++;
            const lowerStatus = status.toLowerCase();
            if (lowerStatus === "present") {
              present++;
              if (boarderType === "Day Boarder") presentDB++;
              else if (boarderType === "Day Scholar") presentDS++;
              else if (boarderType === "Full Boarder") presentBoarder++;
            } else if (lowerStatus === "absent") {
              absent++;
              if (boarderType === "Day Boarder") absentDB++;
              else if (boarderType === "Day Scholar") absentDS++;
              else if (boarderType === "Full Boarder") absentBoarder++;

              const studentObj = studentsList.find((st) => st.id === studentId);
              const name = studentObj
                ? `${studentObj.firstName} ${studentObj.lastName}`.trim()
                : (typeof val === "object" && val?.name ? val.name : `Student ${studentId}`);
              
              classAbsentees.push({
                id: studentId,
                studentId,
                firstName: studentObj?.firstName || name,
                lastName: studentObj?.lastName || "",
                name,
                rollNo: (studentObj as any)?.rollNo ?? studentObj?.rollNumber ?? (typeof val === "object" ? val?.rollNo : "") ?? "",
                boarderType,
                classId: cId,
                className: `${cls.classStandard} ${cls.section} (${cls.board})`,
              });
            } else if (lowerStatus === "leave") {
              leave++;
              if (boarderType === "Day Boarder") leaveDB++;
              else if (boarderType === "Day Scholar") leaveDS++;
              else if (boarderType === "Full Boarder") leaveBoarder++;
            }
          }
        });

        const rate = total > 0 ? Math.round((present / total) * 100) : 0;

        const classStat = {
          classId: cId,
          className: `${cls.classStandard} ${cls.section} (${cls.board})`,
          totalStudents: total,
          total: total,
          totalDB,
          totalDS,
          totalBoarder,
          present: present,
          presentCount: present,
          presentDB,
          presentDS,
          presentBoarder,
          absent: absent,
          absentCount: absent,
          absentDB,
          absentDS,
          absentBoarder,
          leave: leave,
          leaveCount: leave,
          leaveDB,
          leaveDS,
          leaveBoarder,
          markedCount: marked,
          attendanceRate: rate,
          absentees: classAbsentees,
          date: dateString,
          schoolId: activeSchoolId,
          updatedAt: new Date().toISOString()
        };

        newlyComputedClassStats[cId] = classStat;
      });

      // Write class-level summary documents using atomic batch writes
      const computedEntries = Object.entries(newlyComputedClassStats);
      if (computedEntries.length > 0) {
        const BATCH_LIMIT = 450;
        for (let i = 0; i < computedEntries.length; i += BATCH_LIMIT) {
          const batch = writeBatch(db);
          const chunk = computedEntries.slice(i, i + BATCH_LIMIT);
          for (const [cId, classStat] of chunk) {
            const summaryDocRef = doc(
              db,
              "schools",
              activeSchoolId,
              "classes",
              cId,
              "attendance_summary",
              dateString,
            );
            batch.set(summaryDocRef, classStat, { merge: true });
          }
          await batch.commit();
        }
      }

      // 4. Query all class summaries for this dateString
      const finalClassStatsMap: Record<string, any> = {};

      // Seed with all classes from the classes list to ensure every class has an entry
      classesList.forEach((cls) => {
        finalClassStatsMap[cls.id] = {
          classId: cls.id,
          className: `${cls.classStandard} ${cls.section} (${cls.board})`,
          totalStudents: studentsList.filter(s => s.classId === cls.id && s.isActive !== false).length,
          total: studentsList.filter(s => s.classId === cls.id && s.isActive !== false).length,
          totalDB: studentsList.filter(s => s.classId === cls.id && s.isActive !== false && s.boarderType === "Day Boarder").length,
          totalDS: studentsList.filter(s => s.classId === cls.id && s.isActive !== false && s.boarderType === "Day Scholar").length,
          totalBoarder: studentsList.filter(s => s.classId === cls.id && s.isActive !== false && s.boarderType === "Full Boarder").length,
          present: 0,
          presentCount: 0,
          presentDB: 0,
          presentDS: 0,
          presentBoarder: 0,
          absent: 0,
          absentCount: 0,
          absentDB: 0,
          absentDS: 0,
          absentBoarder: 0,
          leave: 0,
          leaveCount: 0,
          markedCount: 0,
          attendanceRate: null,
          date: dateString,
          schoolId: activeSchoolId
        };
      });

      try {
        const q = query(
          collectionGroup(db, "attendance_summary"),
          where("date", "==", dateString),
          where("schoolId", "==", activeSchoolId)
        );
        const snap = await getDocs(q);
        snap.forEach(docSnap => {
          const data = docSnap.data();
          if (data.classId) {
            finalClassStatsMap[data.classId] = data;
          }
        });
      } catch (cgErr) {
        console.warn("CollectionGroup summary query fallback:", cgErr);
        const fallbackPromises = classesList.map(async (cls) => {
          try {
            const summaryRef = doc(db, "schools", activeSchoolId, "classes", cls.id, "attendance_summary", dateString);
            const snap = await getDoc(summaryRef);
            if (snap.exists()) {
              finalClassStatsMap[cls.id] = snap.data();
            }
          } catch (e) {}
        });
        await Promise.all(fallbackPromises);
      }

      // Override with newly computed class stats to handle latency/updates
      Object.entries(newlyComputedClassStats).forEach(([cId, stat]) => {
        finalClassStatsMap[cId] = stat;
      });

      const finalClassStats = Object.values(finalClassStatsMap);

      // 6. Compute overall school-wide statistics & aggregated absentee list
      let todayPresent = 0;
      let todayTotalMarked = 0;
      let todayAbsent = 0;
      let todayLeave = 0;
      const allSchoolAbsentees: any[] = [];

      finalClassStats.forEach((cs: any) => {
        todayPresent += cs.presentCount || 0;
        todayTotalMarked += cs.markedCount || 0;
        todayAbsent += cs.absentCount || 0;
        todayLeave += cs.leaveCount || 0;
        if (Array.isArray(cs.absentees)) {
          allSchoolAbsentees.push(...cs.absentees);
        }
      });

      const classesCount = classesList.length;
      const studentsCount = finalClassStats.reduce((sum: number, cs: any) => sum + (cs.totalStudents || 0), 0);

      const todayAttendanceRate =
        studentsCount > 0
          ? Math.round((todayPresent / studentsCount) * 100)
          : 0;

      // 7. Save the final aggregated summary and absentee documents using atomic writeBatch
      const batchSummaries = writeBatch(db);
      const schoolSummaryDocRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      const summaryPayload = {
        date: dateString,
        schoolId: activeSchoolId,
        stats: {
          totalClasses: classesCount,
          totalStudents: studentsCount,
          todayAttendanceRate,
          todayPresentCount: todayPresent,
          todayTotalMarked,
          todayAbsentCount: todayAbsent,
          todayLeaveCount: todayLeave,
        },
        classStats: finalClassStats,
        absentees: allSchoolAbsentees,
        updatedAt: new Date().toISOString(),
      };
      batchSummaries.set(schoolSummaryDocRef, summaryPayload);

      // Also save dedicated absentee summary for fast admin export
      const absenteeSummaryRef = doc(db, "schools", activeSchoolId, "absentee_summaries", dateString);
      batchSummaries.set(absenteeSummaryRef, {
        date: dateString,
        schoolId: activeSchoolId,
        totalAbsentees: allSchoolAbsentees.length,
        absentees: allSchoolAbsentees,
        classStats: finalClassStats,
        updatedAt: new Date().toISOString(),
      });
      await batchSummaries.commit();
    } catch (err) {
      console.error("Error pre-computing and saving attendance summary:", err);
    }
  },

  /**
   * Fast-fetches the pre-computed absentee summary for a given date.
   */
  async getAbsenteeSummaryByDate(dateString: string): Promise<any | null> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const absenteeRef = doc(db, "schools", activeSchoolId, "absentee_summaries", dateString);
      const snap = await getDoc(absenteeRef);
      if (snap.exists()) {
        return snap.data();
      }
      
      // Fallback to attendance_summaries if absentee_summaries document isn't generated yet
      const summaryRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      const summarySnap = await getDoc(summaryRef);
      if (summarySnap.exists()) {
        return summarySnap.data();
      }
      return null;
    } catch (error) {
      console.warn("Absentee summary fetch skipped or failed:", error);
      return null;
    }
  },

  /**
   * Backfills pre-computed summaries and absentee lists for all historical dates across all classes.
   */
  async backfillHistoricalSummaries(onProgress?: (msg: string) => void): Promise<{ processedDates: number }> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const classesList = await classesApi.getAll(false);
      const historicalDates = new Set<string>();

      if (onProgress) onProgress("Scanning historical attendance logs across all classes...");

      // Scan all classes for attendance dates
      for (const cls of classesList) {
        try {
          const colRef = collection(db, "schools", activeSchoolId, "classes", cls.id, "attendance");
          const snap = await getDocs(colRef);
          snap.forEach((d) => {
            if (d.id && d.id.match(/^\d{4}-\d{2}-\d{2}$/)) {
              historicalDates.add(d.id);
            }
          });
        } catch (err) {
          console.warn(`Could not read class ${cls.id} attendance collection:`, err);
        }
      }

      const datesArray = Array.from(historicalDates);
      let count = 0;

      for (const dateStr of datesArray) {
        count++;
        if (onProgress) onProgress(`Generating pre-computed summaries for date (${count}/${datesArray.length}): ${dateStr}...`);
        await this.generateAndSaveSummary(dateStr, {});
      }

      if (onProgress) onProgress(`Successfully backfilled pre-computed summaries for ${datesArray.length} historical dates!`);
      return { processedDates: datesArray.length };
    } catch (error) {
      console.error("Historical backfill error:", error);
      throw error;
    }
  },

  /**
   * Fetches a summarized history of all logged dates.
   */
  async getHistory(
    classStudentIds?: string[],
    selectedClassId?: string,
    daysLimit = 30,
  ): Promise<AttendanceRecordSummary[]> {
    try {
      const activeSchoolId = getActiveSchoolId();

      let docs: any[] = [];
      // Fetch deep enough to skip empty days, scale with daysLimit (e.g. 6 limit -> 60 days, 12 limit -> 120 days)
      const SEARCH_DEPTH = Math.max(60, daysLimit * 10);

      if (selectedClassId) {
        // Query specifically for this class
        const colRef = collection(db, "schools", activeSchoolId, "classes", selectedClassId, "attendance");
        const q = query(colRef, orderBy(documentId(), "desc"), limit(SEARCH_DEPTH));
        const snapshot = await getDocs(q);
        docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
      } else {
        // Fetch from all classes and merge by date
        const classesList = await classesApi.getAll();
        const classIds = ["unassigned", ...classesList.map(c => c.id)];

        const classDocsPromises = classIds.map(async (cId) => {
          const colRef = collection(db, "schools", activeSchoolId, "classes", cId, "attendance");
          const q = query(colRef, orderBy(documentId(), "desc"), limit(SEARCH_DEPTH));
          const snap = await getDocs(q);
          return snap.docs.map(doc => ({ date: doc.id, data: doc.data() }));
        });

        const results = await Promise.all(classDocsPromises);
        const mergedByDate: Record<string, Record<string, any>> = {};
        results.forEach((subList) => {
          subList.forEach(({ date, data }) => {
            if (!mergedByDate[date]) {
              mergedByDate[date] = {};
            }
            Object.assign(mergedByDate[date], data);
          });
        });

        docs = Object.entries(mergedByDate).map(([date, data]) => ({
          id: date,
          data,
        }));
      }

      let datesList = await runCalculationWorker("CALCULATE_HISTORY", {
        docs,
        classStudentIds,
        selectedClassId,
      });

      // Limit to the requested days after filtering in the worker
      return datesList.slice(0, daysLimit);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "attendance");
      return [];
    }
  },

  /**
   * Deletes attendance log records for a specific date.
   */
  async deleteRecord(dateString: string): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const classesList = await classesApi.getAll();
      const classIds = ["unassigned", ...classesList.map(c => c.id)];

      const batch = writeBatch(db);
      classIds.forEach((cId) => {
        const ref = doc(db, "schools", activeSchoolId, "classes", cId, "attendance", dateString);
        batch.delete(ref);
        const classSummaryRef = doc(db, "schools", activeSchoolId, "classes", cId, "attendance_summary", dateString);
        batch.delete(classSummaryRef);
      });

      const summaryRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      batch.delete(summaryRef);
      const absenteeSummaryRef = doc(db, "schools", activeSchoolId, "absentee_summaries", dateString);
      batch.delete(absenteeSummaryRef);

      await batch.commit();
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.DELETE,
        `attendance/${dateString}`,
      );
    }
  },

  /**
   * Generates a monthly report for a specific class and month.
   */
  async getMonthlyReport(
    month: string,
    classId: string,
    students: any[],
    options?: {
      ignoreSundays?: boolean;
      ignoreSaturdays?: boolean;
      studentStatus?: StudentStatusFilter;
      overrideTotalWd?: number;
    },
  ): Promise<any> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const classAttendanceColRef = collection(db, "schools", activeSchoolId, "classes", classId, "attendance");
      const qClassDaily = query(
        classAttendanceColRef,
        where(documentId(), ">=", `${month}-01`),
        where(documentId(), "<=", `${month}-31`),
      );
      const snapshotClassDaily = await getDocs(qClassDaily);

      const docs = snapshotClassDaily.docs.map((d) => {
        return {
          id: d.id,
          data: d.data(),
        };
      });

      const defaultIgnoreSundays = typeof window !== "undefined" && localStorage.getItem("ignore_sundays") === "true";
      const defaultIgnoreSaturdays = typeof window !== "undefined" && localStorage.getItem("ignore_saturdays") === "true";

      const ignoreSundays = options?.ignoreSundays !== undefined ? options.ignoreSundays : defaultIgnoreSundays;
      const ignoreSaturdays = options?.ignoreSaturdays !== undefined ? options.ignoreSaturdays : defaultIgnoreSaturdays;
      const studentStatus = options?.studentStatus || "active";

      const report = await runCalculationWorker("CALCULATE_MONTHLY_REPORT", {
        docs,
        month,
        classId,
        students,
        ignoreSundays,
        ignoreSaturdays,
        studentStatus,
      });

      if (report && options?.overrideTotalWd !== undefined && !isNaN(options.overrideTotalWd)) {
        report.totalWorkingDays = options.overrideTotalWd;
      }

      return report;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "attendance");
    }
  },

  /**
   * Fetches all daily attendance records for a given month and classIds in a single/parallel query.
   */
  async getMonthlyRecords(
    month: string,
    classIds: string[]
  ): Promise<Record<string, Record<string, string>>> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const recordsMap: Record<string, Record<string, string>> = {};

      const promises = classIds.map(async (classId) => {
        const colRef = collection(db, "schools", activeSchoolId, "classes", classId, "attendance");
        const q = query(
          colRef,
          where(documentId(), ">=", `${month}-01`),
          where(documentId(), "<=", `${month}-31`)
        );
        const snap = await getDocs(q);
        snap.forEach((docSnap) => {
          const date = docSnap.id;
          const data = docSnap.data();
          if (!recordsMap[date]) {
            recordsMap[date] = {};
          }
          // Extract the unwrapped status string for each student
          Object.entries(data).forEach(([studentId, val]) => {
            if (studentId === "_meta" || studentId === "dayReason" || studentId === "dayReasonType" || studentId === "isHoliday" || studentId === "updatedAt" || studentId === "classId") {
              return;
            }
            recordsMap[date][studentId] = unwrapStatus(val);
          });
        });
      });

      await Promise.all(promises);
      return recordsMap;
    } catch (error) {
      console.error("Error fetching monthly records in bulk:", error);
      return {};
    }
  },

  /**
   * Fetches detailed monthly records including day metadata (holiday / weekly off / reason).
   * Uses localStorage cache with timestamp-based delta sync to avoid redundant Firestore reads.
   */
  async getMonthlyRecordsDetailed(
    month: string,
    classId: string,
    options?: { forceRefresh?: boolean }
  ): Promise<{
    recordsMap: Record<string, Record<string, string>>;
    dayInfoMap: Record<string, { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }>;
  }> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const cached = loadMonthlySheetCache(activeSchoolId, classId, month);
      const isFresh = cached && Date.now() - cached.savedAt < CACHE_TTL_MS;

      // 1. If cache is fresh and not forcing refresh, return immediately (0 Firestore reads)
      if (cached && isFresh && !options?.forceRefresh) {
        return {
          recordsMap: cached.recordsMap,
          dayInfoMap: cached.dayInfoMap,
        };
      }

      // 2. Fetch records from Firestore for the month
      const colRef = collection(db, "schools", activeSchoolId, "classes", classId, "attendance");
      const q = query(
        colRef,
        where(documentId(), ">=", `${month}-01`),
        where(documentId(), "<=", `${month}-31`)
      );
      const snap = await getDocs(q);

      const mergedRecordsMap: Record<string, Record<string, string>> = cached?.recordsMap
        ? { ...cached.recordsMap }
        : {};
      const mergedDayInfoMap: Record<string, { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }> =
        cached?.dayInfoMap ? { ...cached.dayInfoMap } : {};
      const dateTimestamps: Record<string, string> = cached?.dateTimestamps ? { ...cached.dateTimestamps } : {};

      snap.forEach((docSnap) => {
        const date = docSnap.id;
        const data = docSnap.data();
        const docUpdatedAt = data.updatedAt || "";

        // Check if this date was modified on the server
        const cachedUpdatedAt = dateTimestamps[date];
        const needsUpdate =
          !cached || !cachedUpdatedAt || cachedUpdatedAt !== docUpdatedAt || options?.forceRefresh;

        if (needsUpdate) {
          mergedRecordsMap[date] = {};

          if (data.isHoliday || data.dayReason || data.dayReasonType) {
            const dayReason = typeof data.dayReason === "string" ? data.dayReason : "";
            const dayReasonType = typeof data.dayReasonType === "string" ? data.dayReasonType : (data.isHoliday ? "holiday" : undefined);
            mergedDayInfoMap[date] = {
              isHoliday: !!data.isHoliday,
              dayReasonType,
              dayReason,
            };
          } else {
            delete mergedDayInfoMap[date];
          }

          Object.entries(data).forEach(([studentId, val]) => {
            if (
              studentId === "_meta" ||
              studentId === "dayReason" ||
              studentId === "dayReasonType" ||
              studentId === "isHoliday" ||
              studentId === "updatedAt" ||
              studentId === "classId"
            ) {
              return;
            }
            mergedRecordsMap[date][studentId] = unwrapStatus(val);
          });

          dateTimestamps[date] = docUpdatedAt || new Date().toISOString();
        }
      });

      // Save updated cache to localStorage
      const updatedCache: MonthlySheetCache = {
        schoolId: activeSchoolId,
        classId,
        month,
        savedAt: Date.now(),
        dateTimestamps,
        recordsMap: mergedRecordsMap,
        dayInfoMap: mergedDayInfoMap,
      };
      saveMonthlySheetCache(updatedCache);

      return { recordsMap: mergedRecordsMap, dayInfoMap: mergedDayInfoMap };
    } catch (error) {
      console.error("Error fetching detailed monthly records:", error);
      const activeSchoolId = getActiveSchoolId();
      const cached = loadMonthlySheetCache(activeSchoolId, classId, month);
      if (cached) {
        return { recordsMap: cached.recordsMap, dayInfoMap: cached.dayInfoMap };
      }
      return { recordsMap: {}, dayInfoMap: {} };
    }
  },

  /**
   * Retrieves holiday and day reason metadata for a given date and class.
   */
  async getDayInfo(
    dateString: string,
    classId?: string,
  ): Promise<{ isHoliday: boolean; dayReasonType: string; dayReason: string }> {
    try {
      const activeSchoolId = getActiveSchoolId();
      if (classId) {
        const ref = doc(db, "schools", activeSchoolId, "classes", classId, "attendance", dateString);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const dayReason = typeof data.dayReason === "string" ? data.dayReason : "";
          const dayReasonType = typeof data.dayReasonType === "string" ? data.dayReasonType : (data.isHoliday ? "holiday" : "none");
          return {
            isHoliday: !!data.isHoliday,
            dayReasonType,
            dayReason,
          };
        }
      }

      // Check school-wide summary
      const sumRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      const sumSnap = await getDoc(sumRef);
      if (sumSnap.exists()) {
        const data = sumSnap.data();
        const dayReason = typeof data.dayReason === "string" ? data.dayReason : "";
        const dayReasonType = typeof data.dayReasonType === "string" ? data.dayReasonType : (data.isHoliday ? "holiday" : "none");
        return {
          isHoliday: !!data.isHoliday,
          dayReasonType,
          dayReason,
        };
      }

      return { isHoliday: false, dayReasonType: "none", dayReason: "" };
    } catch (error) {
      console.error("Error fetching day info:", error);
      return { isHoliday: false, dayReasonType: "none", dayReason: "" };
    }
  },

  /**
   * Assigns or revokes a holiday/weekly off/other reason for a day.
   * If assigned (not 'none'), automatically marks all students in the class as absent and updates Firebase.
   */
  async assignDayHoliday(
    dateString: string,
    classId: string,
    dayReasonType: string,
    dayReason: string,
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const isHoliday = dayReasonType !== "none";
      const nowIso = new Date().toISOString();

      if (!isHoliday) {
        // Revoke holiday
        const ref = doc(db, "schools", activeSchoolId, "classes", classId, "attendance", dateString);
        await setDoc(
          ref,
          {
            isHoliday: false,
            dayReasonType: "none",
            dayReason: "",
            updatedAt: nowIso,
          },
          { merge: true }
        );
        updateMonthlySheetCacheForDate(
          classId,
          dateString,
          {},
          { isHoliday: false, dayReasonType: "none", dayReason: "" },
          nowIso
        );
        return;
      }

      // Fetch students for this class
      const classStudents = await studentsApi.getByClass(classId);
      const attendancePayload: Record<string, any> = {
        isHoliday: true,
        dayReasonType,
        dayReason: dayReason || (dayReasonType === "weekly_off" ? "Weekly Off" : "Holiday"),
        updatedAt: nowIso,
      };

      const unwrapMap: Record<string, string> = {};
      // Set all active students to 'absent'
      classStudents.forEach((student) => {
        attendancePayload[student.id] = {
          status: "absent",
          classId: student.classId || classId,
          boarderType: student.boarderType || "",
        };
        unwrapMap[student.id] = "absent";
      });

      const ref = doc(db, "schools", activeSchoolId, "classes", classId, "attendance", dateString);
      await setDoc(ref, attendancePayload, { merge: true });

      // Update local monthly cache
      updateMonthlySheetCacheForDate(
        classId,
        dateString,
        unwrapMap,
        {
          isHoliday: true,
          dayReasonType,
          dayReason: attendancePayload.dayReason,
        },
        nowIso
      );

      // Save summary
      await this.generateAndSaveSummary(dateString, attendancePayload);
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `classes/${classId}/attendance/${dateString}/holiday`,
      );
    }
  },

  /**
   * Saves individual cell modifications made from the Monthly Sheet view.
   */
  async saveMonthlyModifications(
    classId: string,
    modifications: { studentId: string; date: string; status: string }[],
  ): Promise<void> {
    try {
      const activeSchoolId = getActiveSchoolId();
      const nowIso = new Date().toISOString();
      // Group modifications by date
      const dateToUpdates: Record<string, Record<string, any>> = {};
      modifications.forEach(({ studentId, date, status }) => {
        if (!dateToUpdates[date]) {
          dateToUpdates[date] = { updatedAt: nowIso };
        }
        if (status === "none" || !status) {
          dateToUpdates[date][studentId] = {
            status: "",
            classId,
          };
        } else {
          dateToUpdates[date][studentId] = {
            status,
            classId,
          };
        }
      });

      const dates = Object.keys(dateToUpdates);
      const BATCH_LIMIT = 400;

      for (let i = 0; i < dates.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        const chunk = dates.slice(i, i + BATCH_LIMIT);
        chunk.forEach((dStr) => {
          const ref = doc(db, "schools", activeSchoolId, "classes", classId, "attendance", dStr);
          batch.set(ref, dateToUpdates[dStr], { merge: true });
        });
        await batch.commit();
      }

      // Update local storage cache for modified dates and monthly cache
      dates.forEach((dStr) => {
        try {
          const cached = localStorage.getItem(`attendance_${dStr}`);
          const parsed = cached ? JSON.parse(cached) : {};
          Object.assign(parsed, dateToUpdates[dStr]);
          localStorage.setItem(`attendance_${dStr}`, JSON.stringify(parsed));
        } catch {
          // ignore local cache error
        }

        const unwrapMap: Record<string, string> = {};
        modifications
          .filter((m) => m.date === dStr)
          .forEach((m) => {
            unwrapMap[m.studentId] = m.status === "none" ? "" : m.status;
          });
        updateMonthlySheetCacheForDate(classId, dStr, unwrapMap, undefined, nowIso);
      });
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `classes/${classId}/attendance/monthly_modifications`,
      );
    }
  },
};

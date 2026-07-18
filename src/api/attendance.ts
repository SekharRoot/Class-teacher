import {
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  orderBy,
  limit,
  where,
  documentId,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { getActiveSchoolId, matchesActiveSchool } from "../lib/activeSchoolHelper";
import { AttendanceStatus } from "../types";
import { runCalculationWorker } from "../workers/calculator";
import { classesApi } from "./classes";
import { studentsApi } from "./students";

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
      const classIdToRecords: Record<string, Record<string, any>> = {};
      Object.entries(cleanRecords).forEach(([studentId, val]) => {
        let classId = val && typeof val === "object" ? (val as any).classId : null;
        if (!classId) {
          classId = studentToClass[studentId] || "unassigned";
        }
        if (!classIdToRecords[classId]) {
          classIdToRecords[classId] = {};
        }
        classIdToRecords[classId][studentId] = val;
      });

      // Save class-level attendance
      const savePromises = Object.entries(classIdToRecords).map(async ([cId, classRecords]) => {
        const ref = doc(db, "schools", activeSchoolId, "classes", cId, "attendance", dateString);
        await setDoc(ref, classRecords, { merge: true });
      });
      await Promise.all(savePromises);

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

      // 1. Fetch existing records for this date and merge with the newly saved partial records.
      // This ensures the summary is complete and doesn't get "wiped" when different teachers save different classes.
      const existingRecords = await this.getByDate(dateString);
      const records = { ...existingRecords, ...partialRecords };

      // 2. Fetch classes
      const classesList = await classesApi.getAll(true);

      // 3. Fetch all students (including inactive ones to see if they have logs on this date)
      const studentsList = await studentsApi.getAll(true);

      // 4. Compute stats
      let todayPresent = 0;
      let todayTotalMarked = 0;
      let todayAbsent = 0;
      let todayLeave = 0;

      const classStats = classesList.map((cls) => {
        // Find all active students in this class
        const activeClassStudents = studentsList.filter((s) => s.classId === cls.id && s.isActive !== false);
        
        // Also find any students (active or inactive) who have actual attendance records on this date for this class
        const loggedStudentIds = new Set<string>();
        Object.entries(records).forEach(([studentId, val]) => {
          const isObj = typeof val === "object" && val !== null;
          const recordClassId = isObj ? (val as any).classId : null;
          if (
            recordClassId === cls.id ||
            (!recordClassId && studentsList.find((s) => s.id === studentId)?.classId === cls.id)
          ) {
            loggedStudentIds.add(studentId);
          }
        });

        // Combine active students and student IDs found in attendance records
        const activeStudentIds = new Set(activeClassStudents.map((s) => s.id));
        const allUniqueStudentIds = Array.from(new Set([...Array.from(loggedStudentIds), ...Array.from(activeStudentIds)]));

        const total = allUniqueStudentIds.length;
        
        // Helper to resolve boarder type
        const getBoarderType = (studentId: string, val: any) => {
          const s = studentsList.find((st) => st.id === studentId);
          if (s) return s.boarderType;
          if (val && typeof val === "object" && (val as any).boarderType) {
            return (val as any).boarderType;
          }
          return "Day Scholar";
        };

        const totalDB = allUniqueStudentIds.filter(id => getBoarderType(id, records[id]) === "Day Boarder").length;
        const totalDS = allUniqueStudentIds.filter(id => getBoarderType(id, records[id]) === "Day Scholar").length;
        const totalBoarder = allUniqueStudentIds.filter(id => getBoarderType(id, records[id]) === "Full Boarder").length;

        let present = 0;
        let presentDB = 0;
        let presentDS = 0;
        let presentBoarder = 0;

        let absent = 0;
        let absentDB = 0;
        let absentDS = 0;
        let absentBoarder = 0;

        let leave = 0;
        let marked = 0;

        allUniqueStudentIds.forEach((studentId) => {
          const val = records[studentId];
          let status = "";
          if (val) {
            if (typeof val === "object" && val !== null) {
              status = val.status || "";
            } else {
              status = String(val);
            }
          }

          const boarderType = getBoarderType(studentId, val);

          if (status) {
            marked++;
            todayTotalMarked++;
            const lowerStatus = status.toLowerCase();
            if (lowerStatus === "present") {
              present++;
              todayPresent++;
              if (boarderType === "Day Boarder") presentDB++;
              else if (boarderType === "Day Scholar") presentDS++;
              else if (boarderType === "Full Boarder") presentBoarder++;
            } else if (lowerStatus === "absent") {
              absent++;
              todayAbsent++;
              if (boarderType === "Day Boarder") absentDB++;
              else if (boarderType === "Day Scholar") absentDS++;
              else if (boarderType === "Full Boarder") absentBoarder++;
            } else if (lowerStatus === "leave") {
              leave++;
              todayLeave++;
            }
          }
        });

        const rate = marked > 0 ? Math.round((present / marked) * 100) : null;

        // Unified Schema containing keys expected by BOTH OversightDashboard/Worker AND DailyStatusReport
        return {
          classId: cls.id,
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
          markedCount: marked,
          attendanceRate: rate,
        };
      });

      const todayAttendanceRate =
        todayTotalMarked > 0
          ? Math.round((todayPresent / todayTotalMarked) * 100)
          : null;

      const classesCount = classesList.length;
      const studentsCount = classStats.reduce((sum, cs) => sum + cs.totalStudents, 0);

      const summaryDocRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      await setDoc(summaryDocRef, {
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
        classStats,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Error pre-computing and saving attendance summary:", err);
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

      if (selectedClassId) {
        // Query specifically for this class
        const colRef = collection(db, "schools", activeSchoolId, "classes", selectedClassId, "attendance");
        const q = query(colRef, orderBy(documentId(), "desc"), limit(daysLimit));
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
          const q = query(colRef, orderBy(documentId(), "desc"), limit(daysLimit));
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

      const datesList = await runCalculationWorker("CALCULATE_HISTORY", {
        docs,
        classStudentIds,
        selectedClassId,
      });

      return datesList;
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

      const promises = classIds.map(async (cId) => {
        const ref = doc(db, "schools", activeSchoolId, "classes", cId, "attendance", dateString);
        await deleteDoc(ref);
      });

      const summaryRef = doc(db, "schools", activeSchoolId, "attendance_summaries", dateString);
      promises.push(deleteDoc(summaryRef));

      await Promise.all(promises);
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

      const report = await runCalculationWorker("CALCULATE_MONTHLY_REPORT", {
        docs,
        month,
        classId,
        students,
      });

      return report;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "attendance");
    }
  },
};

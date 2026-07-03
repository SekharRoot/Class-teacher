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
import { AttendanceStatus } from "../types";
import { runCalculationWorker } from "../workers/calculator";

export interface AttendanceRecordSummary {
  date: string;
  present: number;
  absent: number;
  leave: number;
}

export const attendanceApi = {
  /**
   * Fetches attendance statuses mapped by student ID for a given date.
   */
  async getByDate(dateString: string): Promise<Record<string, any>> {
    try {
      const attendanceRef = doc(db, "attendance", dateString);
      const snap = await getDoc(attendanceRef);
      if (snap.exists()) {
        return snap.data() as Record<string, any>;
      }
      return {};
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.GET,
        `attendance/${dateString}`,
      );
    }
  },

  /**
   * Persists attendance records for a given date.
   */
  async saveByDate(
    dateString: string,
    records: Record<string, any>,
  ): Promise<void> {
    try {
      const attendanceRef = doc(db, "attendance", dateString);
      await setDoc(attendanceRef, records);
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `attendance/${dateString}`,
      );
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
      const attendanceCollectionRef = collection(db, "attendance");
      // Order by document ID (date) descending to get most recent records
      const q = query(
        attendanceCollectionRef,
        orderBy(documentId(), "desc"),
        limit(daysLimit),
      );
      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      const datesList = await runCalculationWorker("CALCULATE_HISTORY", {
        docs,
        classStudentIds,
        selectedClassId,
      });

      return datesList;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, "attendance");
    }
  },

  /**
   * Deletes attendance log records for a specific date.
   */
  async deleteRecord(dateString: string): Promise<void> {
    try {
      const attendanceRef = doc(db, "attendance", dateString);
      await deleteDoc(attendanceRef);
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
      const attendanceCollectionRef = collection(db, "attendance");
      // Filter by document ID range to get only the requested month
      const q = query(
        attendanceCollectionRef,
        where(documentId(), ">=", `${month}-01`),
        where(documentId(), "<=", `${month}-31`),
      );
      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

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

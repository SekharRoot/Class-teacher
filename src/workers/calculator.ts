import { calculateHistory, calculateLocalHistory } from "./calculations/history";
import { calculateSummary } from "./calculations/summary";
import { calculateDashboardStats } from "./calculations/stats";
import { calculateMonthlyReport } from "./calculations/report";

export function runCalculationLocally(type: string, payload: any): any {
  if (type === "CALCULATE_HISTORY") {
    return calculateHistory(payload);
  }
  if (type === "CALCULATE_LOCAL_HISTORY") {
    return calculateLocalHistory(payload);
  }
  if (type === "CALCULATE_SUMMARY") {
    return calculateSummary(payload);
  }
  if (type === "CALCULATE_DASHBOARD_STATS") {
    return calculateDashboardStats(payload);
  }
  if (type === "CALCULATE_MONTHLY_REPORT") {
    return calculateMonthlyReport(payload);
  }
  throw new Error(`Unknown calculation type: ${type}`);
}

export const runCalculationWorker = async (
  type: string,
  payload: any,
): Promise<any> => {
  try {
    return runCalculationLocally(type, payload);
  } catch (error) {
    console.error("Local calculation error:", error);
    return getEmptyResult(type);
  }
};

const getEmptyResult = (type: string): any => {
  if (type === "CALCULATE_HISTORY" || type === "CALCULATE_LOCAL_HISTORY") {
    return [];
  }
  if (type === "CALCULATE_SUMMARY") {
    return {
      totalCount: 0, totalDayScholar: 0, totalDayBoarder: 0, totalFullBoarder: 0,
      presentCount: 0, presentDayScholar: 0, presentDayBoarder: 0, presentFullBoarder: 0,
      absentCount: 0, absentDayScholar: 0, absentDayBoarder: 0, absentFullBoarder: 0,
      leaveCount: 0, leaveDayScholar: 0, leaveDayBoarder: 0, leaveFullBoarder: 0
    };
  }
  if (type === "CALCULATE_DASHBOARD_STATS") {
    return {
      stats: {
        totalClasses: 0,
        totalStudents: 0,
        todayAttendanceRate: null,
        todayPresentCount: 0,
        todayTotalMarked: 0,
      },
      classStats: [],
    };
  }
  if (type === "CALCULATE_MONTHLY_REPORT") {
    return {
      month: "",
      classId: "",
      entries: [],
    };
  }
  return null;
};

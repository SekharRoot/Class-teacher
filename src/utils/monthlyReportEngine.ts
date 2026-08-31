import { format, parseISO, startOfMonth, endOfMonth, getDaysInMonth, subMonths, isBefore } from "date-fns";
import { collection, doc, getDoc, getDocs, setDoc, query, where, documentId } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Student, StudentStatusFilter } from "../types";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";
import { studentsApi } from "../api/students";
import { unwrapStatus } from "./statusHelper";
import { loadMonthlySheetCache } from "./monthlyAttendanceCache";

export interface MonthlyReportMatrixRow {
  sl: number;
  studentId: string;
  studentName: string;
  rollNumber: string;
  isActive: boolean;
  days: Record<number, string>; // 1..31 -> "P" | "A" | "L" | "H" | ""
  ta: number; // Total Attendance (P) for the current month
  taPercentage: number; // (TA / WD) * 100
  pca: number; // Previous Cumulative Attendance (sum of P from term start to previous month)
  tca: number; // Total Cumulative Attendance = TA + PCA
  tcaPercentage: number; // (TCA / Total WD) * 100
}

export interface MonthlyReportMatrixData {
  schoolName: string;
  academicYear: string;
  classId: string;
  className: string;
  month: string; // YYYY-MM
  monthName: string; // e.g. "October 2025"
  daysInMonth: number; // 28..31
  workingDays: number; // WD for the current month
  instructionalDays: number; // ID for current month
  totalWorkingDays: number; // Cumulative Total WD from term start
  totalInstructionalDays: number; // Cumulative Total ID from term start
  avgPca: number;
  totalPca: number;
  rows: MonthlyReportMatrixRow[];
  dayTotals: {
    present: Record<number, number>; // 1..31
    absent: Record<number, number>; // 1..31
    totalStudents: number;
  };
  summaryTotals: {
    totalTa: number;
    totalPca: number;
    totalTca: number;
  };
  holidayDays: Set<number>;
  sundayDays: Set<number>;
  saturdayDays: Set<number>;
  options?: MonthlyReportOptions;
}

export interface MonthlyReportOptions {
  schoolName?: string;
  academicYear?: string;
  termStartMonth?: string; // YYYY-MM e.g. "2025-06" or "2025-04"
  overrideWd?: number;
  overrideTotalWd?: number;
  ignoreSundays?: boolean;
  ignoreSaturdays?: boolean;
  studentStatus?: StudentStatusFilter;
  includeTa?: boolean;
  includeTaPercent?: boolean;
  includePca?: boolean;
  includeTca?: boolean;
  includeTcaPercent?: boolean;
}

/**
 * Calculates complete monthly matrix and cumulative metrics according to academic rules:
 * 1. TA = sum of P for the month
 * 2. TA% = (TA / WD) * 100
 * 3. PCA = sum of P from term start up to previous month (previous month TCA = next month PCA)
 * 4. TCA = TA + PCA
 * 5. Total WD = sum of all WD from term start up to current month (or custom override)
 * 6. % TCA = (TCA / Total WD) * 100
 */
export async function generateMonthlyReportData(
  classId: string,
  className: string,
  month: string, // YYYY-MM
  studentsList: Student[],
  options: MonthlyReportOptions = {}
): Promise<MonthlyReportMatrixData> {
  const activeSchoolId = getActiveSchoolId();
  const currentMonthDate = parseISO(`${month}-01`);
  const totalDaysInMonth = getDaysInMonth(currentMonthDate);
  const monthName = format(currentMonthDate, "MMMM yyyy");

  // Determine Academic Year if not provided (e.g., "2025 - 2026")
  const currentYear = currentMonthDate.getFullYear();
  const currentMonthNum = currentMonthDate.getMonth() + 1; // 1..12
  const startYear = currentMonthNum >= 4 ? currentYear : currentYear - 1;
  const defaultAcademicYear = `${startYear} - ${startYear + 1}`;
  const academicYear = options.academicYear || defaultAcademicYear;

  // Determine Term Start Month (default to April or June of the start year)
  const defaultTermStartMonth = options.termStartMonth || `${startYear}-04`;

  const ignoreSundays = options.ignoreSundays !== undefined ? options.ignoreSundays : true;
  const ignoreSaturdays = options.ignoreSaturdays !== undefined ? options.ignoreSaturdays : false;
  const studentStatus = options.studentStatus || "active";

  // 1. Fetch current month's daily attendance records from Firestore and merge with local cache
  const classAttendanceColRef = collection(
    db,
    "schools",
    activeSchoolId,
    "classes",
    classId,
    "attendance"
  );

  const currentMonthDataByDate: Record<string, any> = {};

  // Fetch full month from Firestore
  try {
    const qCurrentMonth = query(
      classAttendanceColRef,
      where(documentId(), ">=", `${month}-01`),
      where(documentId(), "<=", `${month}-31`)
    );
    const currentMonthSnap = await getDocs(qCurrentMonth);

    currentMonthSnap.forEach((d) => {
      currentMonthDataByDate[d.id] = d.data();
    });
  } catch (err) {
    console.warn("Direct Firestore month fetch failed in report engine, falling back to cache:", err);
  }

  // Merge with local cache (for any un-persisted or locally updated entries)
  const cachedMonth = loadMonthlySheetCache(activeSchoolId, classId, month);
  if (cachedMonth && cachedMonth.recordsMap) {
    Object.entries(cachedMonth.recordsMap).forEach(([dateStr, studentMap]) => {
      if (!currentMonthDataByDate[dateStr]) {
        currentMonthDataByDate[dateStr] = { ...studentMap };
      } else {
        Object.assign(currentMonthDataByDate[dateStr], studentMap);
      }
      if (cachedMonth.dayInfoMap && cachedMonth.dayInfoMap[dateStr]) {
        Object.assign(currentMonthDataByDate[dateStr], cachedMonth.dayInfoMap[dateStr]);
      }
    });
  }

  // Identify holidays, sundays, saturdays in current month
  const holidayDays = new Set<number>();
  const sundayDays = new Set<number>();
  const saturdayDays = new Set<number>();
  const markedDatesSet = new Set<string>();

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayStr = `${month}-${String(day).padStart(2, "0")}`;
    const dObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
    const dayOfWeek = dObj.getDay(); // 0 = Sun, 6 = Sat

    if (dayOfWeek === 0) sundayDays.add(day);
    if (dayOfWeek === 6) saturdayDays.add(day);

    const dayData = currentMonthDataByDate[dayStr];
    if (dayData) {
      if (dayData.isHoliday) {
        holidayDays.add(day);
      }
      // Check if attendance was actually taken for this day
      const hasStudentMarks = Object.keys(dayData).some(
        (k) =>
          k !== "_meta" &&
          k !== "dayReason" &&
          k !== "dayReasonType" &&
          k !== "isHoliday" &&
          k !== "updatedAt" &&
          k !== "classId"
      );
      if (hasStudentMarks && !dayData.isHoliday) {
        let isIgnoredWeekend = false;
        if (ignoreSundays && dayOfWeek === 0) isIgnoredWeekend = true;
        if (ignoreSaturdays && dayOfWeek === 6) isIgnoredWeekend = true;
        if (!isIgnoredWeekend) {
          markedDatesSet.add(dayStr);
        }
      }
    }
  }

  // Calculate Working Days (WD) for the current month
  const autoCalculatedWd = markedDatesSet.size;
  const workingDays =
    options.overrideWd !== undefined && options.overrideWd >= 0
      ? options.overrideWd
      : autoCalculatedWd;

  // 2. Fetch Historical Attendance from Term Start Month up to previous month to calculate PCA & Total WD
  const shouldCalculatePca = options.includePca !== false || options.includeTca !== false;
  let termMonthsList: string[] = [];
  const termStartDate = parseISO(`${defaultTermStartMonth}-01`);
  
  if (shouldCalculatePca && isBefore(termStartDate, currentMonthDate)) {
    let iterDate = termStartDate;
    while (isBefore(iterDate, currentMonthDate)) {
      termMonthsList.push(format(iterDate, "yyyy-MM"));
      iterDate = new Date(iterDate.getFullYear(), iterDate.getMonth() + 1, 1);
    }
  }

  let priorCumulativePresentMap: Record<string, number> = {};
  let priorMonthsWdSum = 0;

  if (shouldCalculatePca && termMonthsList.length > 0) {
    const qPrior = query(
      classAttendanceColRef,
      where(documentId(), ">=", `${termMonthsList[0]}-01`),
      where(documentId(), "<=", `${termMonthsList[termMonthsList.length - 1]}-31`)
    );
    const priorSnap = await getDocs(qPrior);
    const priorMarkedDaysSet = new Set<string>();

    priorSnap.forEach((docSnap) => {
      const dateId = docSnap.id;
      const data = docSnap.data();
      const parts = dateId.split("-");
      if (parts.length === 3) {
        const dObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        const dayOfWeek = dObj.getDay();
        if (ignoreSundays && dayOfWeek === 0) return;
        if (ignoreSaturdays && dayOfWeek === 6) return;
      }

      if (data.isHoliday) return;

      let dayHasMarks = false;
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

        const rawStatus = unwrapStatus(val).toLowerCase();
        if (rawStatus === "present" || rawStatus === "p") {
          priorCumulativePresentMap[studentId] = (priorCumulativePresentMap[studentId] || 0) + 1;
          dayHasMarks = true;
        } else if (rawStatus === "absent" || rawStatus === "a" || rawStatus === "leave" || rawStatus === "l") {
          dayHasMarks = true;
        }
      });

      if (dayHasMarks) {
        priorMarkedDaysSet.add(dateId);
      }
    });

    priorMonthsWdSum = priorMarkedDaysSet.size;
  }

  // Calculate Cumulative Total Working Days (Total WD)
  const autoCalculatedTotalWd = priorMonthsWdSum + workingDays;
  const totalWorkingDays =
    options.overrideTotalWd !== undefined && options.overrideTotalWd >= 0
      ? options.overrideTotalWd
      : autoCalculatedTotalWd;

  // 3. Build comprehensive student roster for this class
  const studentMap = new Map<string, Student>();

  // Add students from provided studentsList matching this classId
  if (Array.isArray(studentsList)) {
    studentsList.forEach((s) => {
      if (s && s.id && s.classId === classId) {
        studentMap.set(s.id, s);
      }
    });
  }

  // Always fetch fresh class students directly from Firestore
  try {
    const freshClassStudents = await studentsApi.getByClass(classId);
    if (freshClassStudents && freshClassStudents.length > 0) {
      freshClassStudents.forEach((s) => {
        if (s && s.id) {
          studentMap.set(s.id, { ...(studentMap.get(s.id) || {}), ...s, classId });
        }
      });
    }
  } catch (e) {
    console.warn("Could not fetch fresh class students in engine:", e);
  }

  // Scan all attendance documents for any student IDs that have attendance records
  const attendanceStudentIds = new Set<string>();
  Object.values(currentMonthDataByDate).forEach((dayDoc: any) => {
    if (dayDoc && typeof dayDoc === "object") {
      Object.keys(dayDoc).forEach((key) => {
        if (
          key !== "_meta" &&
          key !== "dayReason" &&
          key !== "dayReasonType" &&
          key !== "isHoliday" &&
          key !== "updatedAt" &&
          key !== "classId" &&
          !key.startsWith("_")
        ) {
          attendanceStudentIds.add(key);
        }
      });
    }
  });

  // Ensure every student with attendance records is present in the roster
  for (const sId of attendanceStudentIds) {
    if (!studentMap.has(sId)) {
      const matchInGlobal = studentsList.find((s) => s.id === sId);
      if (matchInGlobal) {
        studentMap.set(sId, matchInGlobal);
      } else {
        studentMap.set(sId, {
          id: sId,
          firstName: "Student",
          lastName: sId.length > 8 ? sId.slice(0, 8) : sId,
          rollNumber: "",
          classId: classId,
          isActive: false,
          schoolId: activeSchoolId,
        } as Student);
      }
    }
  }

  const classStudents = Array.from(studentMap.values());

  const [yearStr, monthStr] = month.split("-");
  const yearNum = parseInt(yearStr, 10);
  const monthNum = parseInt(monthStr, 10);
  const monthStartIso = `${month}-01`;
  const lastDay = new Date(yearNum, monthNum, 0).getDate();
  const monthEndIso = `${month}-${String(lastDay).padStart(2, "0")}`;
  const endOfMonthIsoFull = new Date(yearNum, monthNum, 0, 23, 59, 59, 999).toISOString();

  const filteredStudents = classStudents.filter((s) => {
    const isGloballyActive = s.isActive !== false;
    const isRecorded = attendanceStudentIds.has(s.id);
    const belongsToThisClass = s.classId === classId;

    if (studentStatus === "active") {
      return isGloballyActive && belongsToThisClass;
    }
    if (studentStatus === "active_entire_month") {
      const notDeactivatedBeforeEnd = isGloballyActive || (s.deactivatedAt && (s.deactivatedAt > monthEndIso || s.deactivatedAt > endOfMonthIsoFull));
      return (belongsToThisClass || isRecorded) && notDeactivatedBeforeEnd;
    }
    if (studentStatus === "active_in_month") {
      if (isRecorded) return true;
      const activeInOrAfterMonth = isGloballyActive || (s.deactivatedAt && s.deactivatedAt >= monthStartIso);
      return belongsToThisClass && activeInOrAfterMonth;
    }
    if (studentStatus === "inactive") {
      if (s.deactivatedAt && (s.deactivatedAt > monthEndIso || s.deactivatedAt > endOfMonthIsoFull)) {
        return false;
      }
      return !isGloballyActive && (isRecorded || (belongsToThisClass && s.deactivatedAt && s.deactivatedAt >= monthStartIso));
    }
    if (studentStatus === "all") {
      if (isRecorded) return true;
      if (!isGloballyActive && s.deactivatedAt && s.deactivatedAt < monthStartIso) {
        return false;
      }
      const activeInOrAfterMonth = isGloballyActive || (s.deactivatedAt && s.deactivatedAt >= monthStartIso);
      return belongsToThisClass && activeInOrAfterMonth;
    }
    return belongsToThisClass || isRecorded;
  });

  // Sort students: Roll number numerical first, then alphabetical
  filteredStudents.sort((a, b) => {
    const numA = parseInt(a.rollNumber || "", 10);
    const numB = parseInt(b.rollNumber || "", 10);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }
    const cmp = (a.rollNumber || "").localeCompare(b.rollNumber || "", undefined, { numeric: true });
    if (cmp !== 0) return cmp;
    const nameA = `${a.firstName || ""} ${a.lastName || ""}`.trim();
    const nameB = `${b.firstName || ""} ${b.lastName || ""}`.trim();
    return nameA.localeCompare(nameB);
  });

  // 4. Build Matrix Rows
  const rows: MonthlyReportMatrixRow[] = [];
  const dayPresentTotals: Record<number, number> = {};
  const dayAbsentTotals: Record<number, number> = {};

  for (let d = 1; d <= 31; d++) {
    dayPresentTotals[d] = 0;
    dayAbsentTotals[d] = 0;
  }

  let grandTotalTa = 0;
  let grandTotalPca = 0;
  let grandTotalTca = 0;

  filteredStudents.forEach((student, index) => {
    const daysMap: Record<number, string> = {};
    let studentTa = 0;

    for (let day = 1; day <= 31; day++) {
      if (day > totalDaysInMonth) {
        daysMap[day] = "";
        continue;
      }

      const dayStr = `${month}-${String(day).padStart(2, "0")}`;
      const dayDoc = currentMonthDataByDate[dayStr];

      if (!dayDoc) {
        daysMap[day] = "";
        continue;
      }

      if (dayDoc.isHoliday) {
        daysMap[day] = "H";
        continue;
      }

      const rawVal = dayDoc[student.id];
      if (!rawVal) {
        daysMap[day] = "";
        continue;
      }

      const statusStr = unwrapStatus(rawVal).toLowerCase();
      if (statusStr === "present" || statusStr === "p") {
        daysMap[day] = "P";
        studentTa++;
        dayPresentTotals[day] = (dayPresentTotals[day] || 0) + 1;
      } else if (statusStr === "absent" || statusStr === "a") {
        daysMap[day] = "A";
        dayAbsentTotals[day] = (dayAbsentTotals[day] || 0) + 1;
      } else if (statusStr === "leave" || statusStr === "l") {
        daysMap[day] = "L";
        dayAbsentTotals[day] = (dayAbsentTotals[day] || 0) + 1;
      } else {
        daysMap[day] = "";
      }
    }

    const calcTa = options.includeTa !== false ? studentTa : 0;
    const calcTaPercentage =
      options.includeTaPercent !== false && workingDays > 0 ? (studentTa / workingDays) * 100 : 0;
    const studentPca =
      options.includePca !== false ? priorCumulativePresentMap[student.id] || 0 : 0;
    const studentTca =
      options.includeTca !== false ? studentTa + (priorCumulativePresentMap[student.id] || 0) : 0;
    const calcTcaPercentage =
      options.includeTcaPercent !== false && totalWorkingDays > 0
        ? (studentTca / totalWorkingDays) * 100
        : 0;

    grandTotalTa += calcTa;
    grandTotalPca += studentPca;
    grandTotalTca += studentTca;

    const studentFullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Unnamed Student";

    rows.push({
      sl: index + 1,
      studentId: student.id,
      studentName: student.isActive === false ? `${studentFullName} (Inactive)` : studentFullName,
      rollNumber: student.rollNumber || String(index + 1),
      isActive: student.isActive !== false,
      days: daysMap,
      ta: calcTa,
      taPercentage: Math.round(calcTaPercentage * 10) / 10,
      pca: studentPca,
      tca: studentTca,
      tcaPercentage: Math.round(calcTcaPercentage * 10) / 10,
    });
  });

  const totalStudentsCount = filteredStudents.length;
  const avgPca = totalStudentsCount > 0 ? Math.round((grandTotalPca / totalStudentsCount) * 10) / 10 : 0;

  return {
    schoolName: options.schoolName || "Classroom Attendance Management System",
    academicYear,
    classId,
    className,
    month,
    monthName,
    daysInMonth: totalDaysInMonth,
    workingDays,
    instructionalDays: workingDays,
    totalWorkingDays,
    totalInstructionalDays: totalWorkingDays,
    avgPca,
    totalPca: grandTotalPca,
    rows,
    dayTotals: {
      present: dayPresentTotals,
      absent: dayAbsentTotals,
      totalStudents: totalStudentsCount,
    },
    summaryTotals: {
      totalTa: grandTotalTa,
      totalPca: grandTotalPca,
      totalTca: grandTotalTca,
    },
    holidayDays,
    sundayDays,
    saturdayDays,
    options,
  };
}

/**
 * Saves a pre-computed monthly report JSON snapshot to Firestore & localStorage
 */
export async function saveMonthlyReportSnapshot(
  classId: string,
  month: string,
  reportData: MonthlyReportMatrixData
): Promise<void> {
  try {
    const activeSchoolId = getActiveSchoolId();
    // Save to Firestore
    const reportDocRef = doc(
      db,
      "schools",
      activeSchoolId,
      "classes",
      classId,
      "monthly_reports",
      month
    );

    const payload = {
      ...reportData,
      holidayDays: Array.from(reportData.holidayDays),
      sundayDays: Array.from(reportData.sundayDays),
      saturdayDays: Array.from(reportData.saturdayDays),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(reportDocRef, payload, { merge: true });

    // Also cache to localStorage
    try {
      localStorage.setItem(`monthly_report_${classId}_${month}`, JSON.stringify(payload));
    } catch (e) {
      console.warn("Local storage cache write failed:", e);
    }
  } catch (err) {
    console.error("Failed to save monthly report snapshot to Firestore:", err);
    throw err;
  }
}

/**
 * Fetches a saved monthly report JSON snapshot if available
 */
export async function getSavedMonthlyReportSnapshot(
  classId: string,
  month: string
): Promise<MonthlyReportMatrixData | null> {
  try {
    const activeSchoolId = getActiveSchoolId();
    // Try localStorage first for instant response
    try {
      const cached = localStorage.getItem(`monthly_report_${classId}_${month}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...parsed,
          holidayDays: new Set(parsed.holidayDays || []),
          sundayDays: new Set(parsed.sundayDays || []),
          saturdayDays: new Set(parsed.saturdayDays || []),
        };
      }
    } catch {}

    const reportDocRef = doc(
      db,
      "schools",
      activeSchoolId,
      "classes",
      classId,
      "monthly_reports",
      month
    );
    const snap = await getDoc(reportDocRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        ...data,
        holidayDays: new Set(data.holidayDays || []),
        sundayDays: new Set(data.sundayDays || []),
        saturdayDays: new Set(data.saturdayDays || []),
      } as MonthlyReportMatrixData;
    }
    return null;
  } catch (err) {
    console.warn("Failed to fetch monthly report snapshot:", err);
    return null;
  }
}

/**
 * Triggers direct browser download of the MonthlyReport.json file
 */
export function downloadMonthlyReportJson(
  reportData: MonthlyReportMatrixData,
  filename?: string
): void {
  const exportPayload = {
    ...reportData,
    holidayDays: Array.from(reportData.holidayDays),
    sundayDays: Array.from(reportData.sundayDays),
    saturdayDays: Array.from(reportData.saturdayDays),
    exportedAt: new Date().toISOString(),
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    filename || `MonthlyReport_${reportData.className.replace(/\s+/g, "_")}_${reportData.month}.json`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

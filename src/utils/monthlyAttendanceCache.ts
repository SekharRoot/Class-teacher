import { getActiveSchoolId } from "../lib/activeSchoolHelper";

export interface MonthlySheetCache {
  schoolId: string;
  classId: string;
  month: string; // e.g. "2026-08"
  savedAt: number; // timestamp ms (Date.now())
  dateTimestamps: Record<string, string>; // mapping from dateStr (YYYY-MM-DD) to ISO updatedAt timestamp
  recordsMap: Record<string, Record<string, string>>; // dateStr -> studentId -> status (e.g. "present", "absent", "leave")
  dayInfoMap: Record<string, { isHoliday?: boolean; dayReasonType?: string; dayReason?: string }>;
}

const CACHE_PREFIX = "monthly_sheet_cache_";
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh TTL

/**
 * Constructs a unique cache key per school, class, and month.
 */
export function getMonthlySheetCacheKey(
  schoolId: string,
  classId: string,
  month: string
): string {
  return `${CACHE_PREFIX}${schoolId}_${classId}_${month}`;
}

/**
 * Reads the cached monthly sheet from localStorage if available.
 */
export function loadMonthlySheetCache(
  schoolId: string,
  classId: string,
  month: string
): MonthlySheetCache | null {
  if (typeof window === "undefined") return null;
  try {
    const key = getMonthlySheetCacheKey(schoolId, classId, month);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MonthlySheetCache;
    if (parsed && parsed.recordsMap && parsed.month === month && parsed.classId === classId) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn("Failed to parse monthly sheet cache from localStorage:", err);
    return null;
  }
}

/**
 * Saves or overwrites the monthly sheet cache in localStorage.
 */
export function saveMonthlySheetCache(cache: MonthlySheetCache): void {
  if (typeof window === "undefined") return null;
  try {
    const key = getMonthlySheetCacheKey(cache.schoolId, cache.classId, cache.month);
    localStorage.setItem(key, JSON.stringify(cache));
  } catch (err) {
    console.warn("Failed to write monthly sheet cache to localStorage:", err);
  }
}

/**
 * Updates or merges records for a specific date in the local monthly sheet cache.
 * Useful when attendance is taken or modified so subsequent visits have 0-latency and 0 Firestore reads.
 */
export function updateMonthlySheetCacheForDate(
  classId: string,
  dateString: string,
  studentRecords: Record<string, string>,
  dayInfo?: { isHoliday?: boolean; dayReasonType?: string; dayReason?: string },
  updatedAt?: string
): void {
  if (typeof window === "undefined" || !classId || !dateString) return;
  try {
    const schoolId = getActiveSchoolId();
    const month = dateString.substring(0, 7);
    const existing = loadMonthlySheetCache(schoolId, classId, month);
    const nowIso = updatedAt || new Date().toISOString();

    const cache: MonthlySheetCache = existing || {
      schoolId,
      classId,
      month,
      savedAt: Date.now(),
      dateTimestamps: {},
      recordsMap: {},
      dayInfoMap: {},
    };

    cache.savedAt = Date.now();
    cache.dateTimestamps[dateString] = nowIso;

    if (!cache.recordsMap[dateString]) {
      cache.recordsMap[dateString] = {};
    }
    Object.assign(cache.recordsMap[dateString], studentRecords);

    if (dayInfo) {
      if (dayInfo.isHoliday || dayInfo.dayReason || dayInfo.dayReasonType) {
        cache.dayInfoMap[dateString] = dayInfo;
      } else {
        delete cache.dayInfoMap[dateString];
      }
    }

    saveMonthlySheetCache(cache);
  } catch (err) {
    console.warn("Error updating monthly sheet cache for date:", err);
  }
}

/**
 * Invalidates the local cache for a given month and class.
 */
export function clearMonthlySheetCache(classId: string, month: string): void {
  if (typeof window === "undefined") return;
  try {
    const schoolId = getActiveSchoolId();
    const key = getMonthlySheetCacheKey(schoolId, classId, month);
    localStorage.removeItem(key);
  } catch (err) {
    console.warn("Error clearing monthly sheet cache:", err);
  }
}

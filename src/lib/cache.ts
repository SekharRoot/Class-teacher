import { get, set, del, keys } from "idb-keyval";
import { getActiveSchoolId } from "./activeSchoolHelper";

export const cache = {
  get: async (key: string) => {
    const schoolId = getActiveSchoolId();
    return await get(`${schoolId}_${key}`);
  },
  set: async (key: string, value: any) => {
    const schoolId = getActiveSchoolId();
    return await set(`${schoolId}_${key}`, value);
  },
  remove: async (key: string) => {
    const schoolId = getActiveSchoolId();
    return await del(`${schoolId}_${key}`);
  },
  clearAllOffline: async () => {
    const allKeys = await keys();
    const offlineKeys = allKeys.filter(
      (k) =>
        typeof k === "string" &&
        (k.includes("_offline_") ||
          k.includes("_attendance_") ||
          k.startsWith("offline_") ||
          k.startsWith("attendance_")),
    );
    await Promise.all(offlineKeys.map((k) => del(k)));
  },
};

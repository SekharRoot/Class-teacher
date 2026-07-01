import { get, set, del, keys } from "idb-keyval";

export const cache = {
  get: async (key: string) => {
    return await get(key);
  },
  set: async (key: string, value: any) => {
    return await set(key, value);
  },
  remove: async (key: string) => {
    return await del(key);
  },
  clearAllOffline: async () => {
    const allKeys = await keys();
    const offlineKeys = allKeys.filter(
      (k) =>
        typeof k === "string" &&
        (k.startsWith("offline_") || k.startsWith("attendance_")),
    );
    await Promise.all(offlineKeys.map((k) => del(k)));
  },
};

import { studentCache } from "./studentCache";
import { studentsApi } from "../api/students";
import { cache } from "../lib/cache";
import { Student } from "../types";

export const studentSyncManager = {
  async getLastSyncTime(): Promise<string | null> {
    return localStorage.getItem("last_profiles_sync_time");
  },

  async setLastSyncTime(time: string) {
    localStorage.setItem("last_profiles_sync_time", time);
  },

  async getNextScheduledRefresh(): Promise<string | null> {
    return localStorage.getItem("next_scheduled_refresh_date");
  },

  async setNextScheduledRefresh() {
    // Generate a random interval between 5 and 9 days (a random week)
    const randomDays = Math.floor(Math.random() * 5) + 5; // 5, 6, 7, 8, 9
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + randomDays);
    localStorage.setItem("next_scheduled_refresh_date", nextDate.toISOString());
  },

  async performSync(fullSync = false): Promise<{
    success: boolean;
    syncedCount: number;
    deletedCount: number;
    type: "full" | "incremental";
  }> {
    try {
      const lastSyncTime = await this.getLastSyncTime();
      const isFirstTime = !lastSyncTime;
      const isFull = fullSync || isFirstTime;

      // Run the sync query on the API
      const result = await studentsApi.syncProfiles(isFull ? null : lastSyncTime, isFull);
      
      if (isFull) {
        // Complete override
        await studentCache.clearAndSet(result.syncedStudents);

        // Update cache (idb-keyval used by DataContext)
        await cache.set("offline_students", result.syncedStudents);
        
        await this.setLastSyncTime(result.timestamp);
        await this.setNextScheduledRefresh();

        return {
          success: true,
          syncedCount: result.syncedStudents.length,
          deletedCount: 0,
          type: "full",
        };
      } else {
        // Incremental sync
        // Put modified/added
        await studentCache.setBatch(result.syncedStudents);
        
        // Delete removed
        if (result.deletedIds.length > 0) {
          await studentCache.deleteBatch(result.deletedIds);
        }

        // Sync with offline_students in cache
        const allStudents = await studentCache.getAll();
        await cache.set("offline_students", allStudents);

        await this.setLastSyncTime(result.timestamp);

        // Check if we passed the scheduled date
        const nextScheduledStr = await this.getNextScheduledRefresh();
        if (nextScheduledStr && new Date() >= new Date(nextScheduledStr)) {
          await this.setNextScheduledRefresh();
        }

        return {
          success: true,
          syncedCount: result.syncedStudents.length,
          deletedCount: result.deletedIds.length,
          type: "incremental",
        };
      }
    } catch (err) {
      console.error("Student sync failed:", err);
      return {
        success: false,
        syncedCount: 0,
        deletedCount: 0,
        type: fullSync ? "full" : "incremental",
      };
    }
  },

  async checkAndAutoTriggerSync(): Promise<boolean> {
    const lastSyncTime = await this.getLastSyncTime();
    
    // Auto trigger initial download on initial sign-in (when no sync has run yet)
    if (!lastSyncTime) {
      console.log("Auto-triggering initial student profile sync...");
      const res = await this.performSync(true);
      return res.success;
    }

    // Auto trigger refresh based on random week scheduled check
    const nextScheduledStr = await this.getNextScheduledRefresh();
    if (nextScheduledStr && new Date() >= new Date(nextScheduledStr)) {
      console.log("Auto-triggering scheduled weekly student profile refresh...");
      const res = await this.performSync(true);
      return res.success;
    }

    return false;
  }
};

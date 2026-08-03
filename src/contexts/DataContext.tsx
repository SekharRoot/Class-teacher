import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { Student, ClassItem, LeaveRequest, UserProfile, OfflineStudentChange, ConflictItem } from "../types";
import { classesApi, studentsApi, leavesApi } from "../api";
import { usersApi } from "../api/users";
import { cache } from "../lib/cache";
import { useAuth } from "./AuthContext";
import { studentSyncManager } from "../utils/studentSyncManager";
import { studentCache } from "../utils/studentCache";
import { dataObserver } from "../utils/dataObserver";

interface DataContextType {
  students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassItem[]; setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  leaves: LeaveRequest[]; setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  users: UserProfile[]; setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  loading: boolean; setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  offlineMode: boolean; setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
  fetchInitialData: () => Promise<void>; handleForceSync: () => Promise<void>;
  
  // Offline sync queue and conflict properties:
  pendingChanges: OfflineStudentChange[];
  conflicts: ConflictItem[];
  syncStatus: "idle" | "syncing" | "error" | "success";
  syncOfflineQueue: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: "local" | "server") => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { userProfile, currentUser, authResolved } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  // New offline queue and conflict states
  const [pendingChanges, setPendingChanges] = useState<OfflineStudentChange[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "error" | "success">("idle");

  // Register DataObserver subscribers for silent background merging across all collections
  useEffect(() => {
    const unsubStudents = dataObserver.subscribe<Student[]>("students", (fresh) => {
      setStudents(fresh);
    });
    const unsubClasses = dataObserver.subscribe<ClassItem[]>("classes", (fresh) => {
      setClasses(fresh);
    });
    const unsubLeaves = dataObserver.subscribe<LeaveRequest[]>("leaves", (fresh) => {
      setLeaves(fresh);
    });
    const unsubUsers = dataObserver.subscribe<UserProfile[]>("users", (fresh) => {
      setUsers(fresh);
    });

    return () => {
      unsubStudents();
      unsubClasses();
      unsubLeaves();
      unsubUsers();
    };
  }, []);

  const refreshPendingChanges = useCallback(async () => {
    const list = await studentSyncManager.getOfflineChanges();
    setPendingChanges(list);
  }, []);

  const syncOfflineQueue = useCallback(async () => {
    if (syncStatus === "syncing") return;
    setSyncStatus("syncing");

    const tempConflicts: ConflictItem[] = [];

    const onConflictDetected = async (conflict: ConflictItem): Promise<"local" | "server" | "skip"> => {
      tempConflicts.push(conflict);
      setConflicts([...tempConflicts]);
      return "skip"; // Skip resolving immediately so the user can resolve via the UI
    };

    try {
      const res = await studentSyncManager.syncOfflineChanges(onConflictDetected);
      await refreshPendingChanges();

      if (res.errors.length > 0) {
        setSyncStatus("error");
      } else if (tempConflicts.length > 0) {
        setSyncStatus("idle"); // user attention required for conflicts
      } else {
        setSyncStatus("success");
        setTimeout(() => setSyncStatus("idle"), 3000);
      }
    } catch (err) {
      console.error("Queue sync error:", err);
      setSyncStatus("error");
    }
  }, [syncStatus, refreshPendingChanges]);

  const resolveConflict = useCallback(async (conflictId: string, resolution: "local" | "server") => {
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (!conflict) return;

    try {
      const changes = await studentSyncManager.getOfflineChanges();
      const change = changes.find((c) => c.studentId === conflictId);

      if (change) {
        if (resolution === "local") {
          // Local wins: push local version to server
          if (change.type === "update") {
            const resolvedData = { ...change.studentData, updatedAt: new Date().toISOString() };
            await studentsApi.update(conflictId, resolvedData);
          } else if (change.type === "delete") {
            await studentsApi.delete(conflictId);
          }
          await studentSyncManager.removeOfflineChange(change.id);
        } else {
          // Server wins: overwrite local cache and state with server version
          const serverStudent = await studentsApi.getStudentFromServer(conflictId);
          if (serverStudent) {
            const allStudents = await studentCache.getAll();
            const updated = allStudents.map((s) => (s.id === conflictId ? serverStudent : s));
            await studentCache.clearAndSet(updated);
            setStudents(updated);
            await cache.set("offline_students", updated);
          } else {
            // Deleted on server, delete locally too
            const allStudents = await studentCache.getAll();
            const filtered = allStudents.filter((s) => s.id !== conflictId);
            await studentCache.clearAndSet(filtered);
            setStudents(filtered);
            await cache.set("offline_students", filtered);
          }
          await studentSyncManager.removeOfflineChange(change.id);
        }
      }

      setConflicts((prev) => prev.filter((c) => c.id !== conflictId));
      await refreshPendingChanges();
    } catch (err) {
      console.error("Conflict resolution failed:", err);
    }
  }, [conflicts, refreshPendingChanges]);

  // Listener for dynamic offline queue updates
  useEffect(() => {
    refreshPendingChanges();
    const handleQueueChanged = () => {
      refreshPendingChanges();
    };
    window.addEventListener("offline-queue-changed", handleQueueChanged);
    return () => {
      window.removeEventListener("offline-queue-changed", handleQueueChanged);
    };
  }, [refreshPendingChanges]);

  // Automatic online/offline toggler and sync trigger
  useEffect(() => {
    const handleOnline = () => {
      setOfflineMode(false);
      setTimeout(() => {
        syncOfflineQueue();
      }, 1000);
    };

    const handleOffline = () => {
      setOfflineMode(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial value setup
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setOfflineMode(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncOfflineQueue]);

  const fetchAndCacheAll = useCallback(async (forceRefreshStudents: boolean = false) => {
    const canAccessLeaves =
      userProfile?.role === "admin" ||
      userProfile?.role === "owner" ||
      userProfile?.role === "academic_coordinator" ||
      userProfile?.role === "class_teacher" ||
      userProfile?.hasLeaveFeatureAccess;

    // 1. Fetch lightweight meta collections first (Classes, Leaves, Users)
    const promises = [
      classesApi.getAll(true),
      canAccessLeaves ? leavesApi.getAll(true) : Promise.resolve([]),
      usersApi.getAll(),
    ];

    const [classesList, leavesList, usersList] =
      await Promise.all(promises);

    await Promise.all([
      dataObserver.notifyAndCache("classes", classesList || []),
      dataObserver.notifyAndCache("leaves", leavesList || []),
      dataObserver.notifyAndCache("users", usersList || []),
    ]);

    // Check if we already have cached students available locally
    const cachedStudents = await cache.get("offline_students");
    const hasCachedStudents = !!(cachedStudents && cachedStudents.length > 0);

    // If we already have cached students and are not forcing a refresh, set loading false early
    if (hasCachedStudents && !forceRefreshStudents) {
      setLoading(false);
    }

    if (forceRefreshStudents || !hasCachedStudents) {
      // Method 1: If forcing refresh and we already have cached students, perform an incremental sync first
      if (forceRefreshStudents && hasCachedStudents) {
        try {
          console.log("Applying Method 1: Performing timestamp-based incremental sync for students...");
          const syncResult = await studentSyncManager.performSync(false);
          if (syncResult.success) {
            const freshStudents = await cache.get("offline_students");
            if (freshStudents) {
              setStudents(freshStudents);
              console.log(`Incremental sync completed successfully. Synced: ${syncResult.syncedCount}, Deleted: ${syncResult.deletedCount}`);
              setLoading(false);
              return;
            }
          }
        } catch (syncErr) {
          console.warn("Incremental sync failed, falling back to full parallel chunk sync:", syncErr);
        }
      }

      try {
        // Fetch students in highly efficient parallel class-by-class chunks
        const targetClasses = classesList || [];

        const studentsList = await studentsApi.getAllInParallelChunks(targetClasses, true);
        
        // Preserve local students with pending offline changes
        const offlineChanges = await studentSyncManager.getOfflineChanges();
        const pendingIds = new Set(offlineChanges.map(c => c.studentId));
        
        const currentLocalStudents = await studentCache.getAll();
        const studentsToPreserve = currentLocalStudents.filter(s => pendingIds.has(s.id));
        
        // Merge server students with our local pending ones
        const mergedMap = new Map();
        studentsList.forEach(s => mergedMap.set(s.id, s));
        studentsToPreserve.forEach(s => mergedMap.set(s.id, s));
        
        const finalStudents = Array.from(mergedMap.values()) as Student[];
        
        await dataObserver.notifyAndCache("students", finalStudents);
      } catch (err) {
        console.error("Progressive parallel chunk student download failed, trying standard:", err);
        const studentsList = await studentsApi.getAll(true);
        
        // Preserve local students even in fallback
        const offlineChanges = await studentSyncManager.getOfflineChanges();
        const pendingIds = new Set(offlineChanges.map(c => c.studentId));
        const currentLocalStudents = await studentCache.getAll();
        const studentsToPreserve = currentLocalStudents.filter(s => pendingIds.has(s.id));
        
        const mergedMap = new Map();
        studentsList.forEach(s => mergedMap.set(s.id, s));
        studentsToPreserve.forEach(s => mergedMap.set(s.id, s));
        const finalStudents = Array.from(mergedMap.values()) as Student[];

        await dataObserver.notifyAndCache("students", finalStudents);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Mounted with cached student profiles. Triggering on-demand background scan for server data updates...");
      if (cachedStudents) {
        setStudents(cachedStudents);
      }
      setLoading(false);

      // Perform on-demand scan in background if there is updated server data
      studentSyncManager.performSync(false).then(async (syncResult) => {
        if (syncResult.syncedCount > 0 || syncResult.deletedCount > 0) {
          console.log(`[DataContext] On-demand scan synced ${syncResult.syncedCount} new/updated profiles.`);
          const updatedCached = await cache.get("offline_students");
          if (updatedCached) {
            setStudents(updatedCached);
          }
        }
      }).catch((err) => {
        console.warn("[DataContext] On-demand background scan error:", err);
      });
    }
  }, [userProfile]);

  const fetchInitialData = useCallback(async () => {
    if (!currentUser || userProfile?.status !== "active" || !authResolved) return;

    try {
      const cachedStudents = await cache.get("offline_students");
      const hasCache = !!(cachedStudents && cachedStudents.length > 0);
      
      if (!hasCache) {
        setLoading(true);
      }
      
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Connecting to database timed out.")),
          15000,
        ),
      );

      await Promise.race([
        (async () => {
          await fetchAndCacheAll();
          setOfflineMode(false);
        })(),
        timeoutPromise,
      ]);
    } catch (err: any) {
      console.error("Error synchronizing profile data:", err);
      setOfflineMode(true);

      const cachedStudents = await cache.get("offline_students");
      if (cachedStudents) setStudents(cachedStudents);
      const cachedClasses = await cache.get("offline_classes");
      if (cachedClasses) setClasses(cachedClasses);
      const cachedLeaves = await cache.get("offline_leaves");
      if (cachedLeaves) setLeaves(cachedLeaves);
      const cachedUsers = await cache.get("offline_users");
      if (cachedUsers) setUsers(cachedUsers);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userProfile?.status, authResolved, fetchAndCacheAll]);

  useEffect(() => {
    let active = true;
    async function loadCacheAndSync() {
      // 1. Fetch data from IndexedDB local cache first to make the app mount instantly (100ms)
      const [cachedStudents, cachedClasses, cachedLeaves, cachedUsers] =
        await Promise.all([
          cache.get("offline_students"),
          cache.get("offline_classes"),
          cache.get("offline_leaves"),
          cache.get("offline_users"),
        ]);
      
      if (!active) return;

      if (cachedStudents) setStudents(cachedStudents);
      if (cachedClasses) setClasses(cachedClasses);
      if (cachedLeaves) setLeaves(cachedLeaves);
      if (cachedUsers) setUsers(cachedUsers);
      
      if (cachedStudents || cachedClasses) {
        setLoading(false);
      }

      // If Firebase Auth hasn't fully settled, wait before doing network syncs to avoid 'Missing permissions' errors
      if (!authResolved) return;

      // 2. Sequentially trigger server fetch in background to download fresh data
      const lastSync = parseInt(localStorage.getItem("last_global_sync") || "0");
      const now = Date.now();
      const throttleMs = 60000; // 1 minute throttle

      if (now - lastSync > throttleMs) {
        try {
          await fetchAndCacheAll(true);
          localStorage.setItem("last_global_sync", now.toString());
        } catch (err) {
          console.error("Background initial load sync failed:", err);
        }
      }

      // 2.5 Auto-sync pending offline changes on load if online
      if (typeof navigator !== "undefined" && navigator.onLine) {
        try {
          await syncOfflineQueue();
        } catch (queueErr) {
          console.error("Startup offline queue sync failed:", queueErr);
        }
      }

      // 3. Check and auto-trigger offline student profiles sync (initial login & weekly scheduled)
      try {
        const triggered = await studentSyncManager.checkAndAutoTriggerSync();
        if (triggered) {
          if (active) {
            const cachedStudentsAfterSync = await cache.get("offline_students");
            if (cachedStudentsAfterSync) setStudents(cachedStudentsAfterSync);
          }
        } else {
          // If a full sync wasn't auto-triggered, always perform a silent background incremental sync
          // to pull any fresh changes without the user having to click manual refresh!
          console.log("Auto-triggering silent background incremental student profile sync...");
          const res = await studentSyncManager.performSync(false);
          if (res.success && active && (res.syncedCount > 0 || res.deletedCount > 0)) {
            const cachedStudentsAfterSync = await cache.get("offline_students");
            if (cachedStudentsAfterSync) {
              setStudents(cachedStudentsAfterSync);
              console.log(`Silent background sync completed. UI updated with ${res.syncedCount} changes.`);
            }
          }
        }
      } catch (syncErr) {
        console.error("Background student profile sync check failed:", syncErr);
      }
    }

    if (currentUser && userProfile?.status === "active") {
      loadCacheAndSync();
    } else {
      // If not logged in, clear data
      setStudents([]);
      setClasses([]);
      setLeaves([]);
      setUsers([]);
      setLoading(false);
    }

    return () => {
      active = false;
    };
  }, [currentUser, userProfile?.status, authResolved, fetchInitialData, fetchAndCacheAll]);

  const handleForceSync = async () => {
    try {
      setLoading(true);
      
      // Sync offline queue first to prevent losing offline changes
      await syncOfflineQueue();

      await Promise.all([
        cache.remove("offline_students"),
        cache.remove("offline_classes"),
        cache.remove("offline_leaves"),
        cache.remove("offline_users"),
      ]);

      await fetchAndCacheAll(true);
      setOfflineMode(false);
    } catch (err: any) {
      console.error("Force sync failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleGlobalSync = () => handleForceSync();
    window.addEventListener("force-sync", handleGlobalSync);
    return () => window.removeEventListener("force-sync", handleGlobalSync);
  }, [syncOfflineQueue]);

  return (
    <DataContext.Provider
      value={{
        students,
        setStudents,
        classes,
        setClasses,
        leaves,
        setLeaves,
        users,
        setUsers,
        loading,
        setLoading,
        offlineMode,
        setOfflineMode,
        fetchInitialData,
        handleForceSync,
        pendingChanges,
        conflicts,
        syncStatus,
        syncOfflineQueue,
        resolveConflict,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

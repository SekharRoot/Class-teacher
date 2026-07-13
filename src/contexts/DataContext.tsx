import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from "react";
import { Student, ClassItem, LeaveRequest, UserProfile } from "../types";
import { classesApi, studentsApi, leavesApi } from "../api";
import { usersApi } from "../api/users";
import { cache } from "../lib/cache";
import { useAuth } from "./AuthContext";

interface DataContextType {
  students: Student[]; setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassItem[]; setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  leaves: LeaveRequest[]; setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  users: UserProfile[]; setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  loading: boolean; setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  offlineMode: boolean; setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
  fetchInitialData: () => Promise<void>; handleForceSync: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { userProfile, currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const fetchAndCacheAll = useCallback(async () => {
    const canAccessLeaves =
      userProfile?.role === "admin" ||
      userProfile?.role === "owner" ||
      userProfile?.hasLeaveFeatureAccess;

    // 1. Fetch lightweight meta collections first (Classes, Leaves, Users)
    const promises = [
      classesApi.getAll(true),
      canAccessLeaves ? leavesApi.getAll(true) : Promise.resolve([]),
      usersApi.getAll(),
    ];

    const [classesList, leavesList, usersList] =
      await Promise.all(promises);

    setClasses(classesList || []);
    setLeaves(leavesList || []);
    setUsers(usersList || []);

    await Promise.all([
      cache.set("offline_classes", classesList || []),
      cache.set("offline_leaves", leavesList || []),
      cache.set("offline_users", usersList || []),
    ]);

    // 2. Set loading false early once lightweight meta collections are ready,
    // so the main interface renders snapily. Then download profiles progressively.
    setLoading(false);

    try {
      // Fetch students in highly efficient parallel class-by-class chunks
      const studentsList = await studentsApi.getAllInParallelChunks(classesList || [], true);
      setStudents(studentsList || []);
      await cache.set("offline_students", studentsList || []);
    } catch (err) {
      console.error("Progressive parallel chunk student download failed, trying standard:", err);
      const studentsList = await studentsApi.getAll(true);
      setStudents(studentsList || []);
      await cache.set("offline_students", studentsList || []);
    }
  }, [userProfile]);

  const fetchInitialData = useCallback(async () => {
    if (!currentUser || userProfile?.status !== "active") return;

    try {
      const cachedStudents = await cache.get("offline_students");
      const hasCache = !!(cachedStudents && cachedStudents.length > 0);
      
      // If we don't have cached data, show the loading spinner initially while fetching meta-data
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
  }, [currentUser, userProfile?.status, fetchAndCacheAll]);

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

      // 2. Sequentially trigger server fetch in background to download fresh data
      // We use a throttle check to avoid hammering the server if the user switches tabs frequently
      const lastSync = parseInt(localStorage.getItem("last_global_sync") || "0");
      const now = Date.now();
      const throttleMs = 60000; // 1 minute throttle

      if (now - lastSync > throttleMs) {
        try {
          await fetchInitialData();
          localStorage.setItem("last_global_sync", now.toString());
        } catch (err) {
          console.error("Background initial load sync failed:", err);
        }
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
  }, [currentUser, userProfile?.status, fetchInitialData]);

  const handleForceSync = async () => {
    try {
      setLoading(true);
      await Promise.all([
        cache.remove("offline_students"),
        cache.remove("offline_classes"),
        cache.remove("offline_leaves"),
        cache.remove("offline_users"),
      ]);

      await fetchAndCacheAll();
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
  }, []);

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

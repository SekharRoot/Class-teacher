import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { Student, ClassItem, LeaveRequest, UserProfile } from "../types";
import { classesApi, studentsApi, leavesApi } from "../api";
import { usersApi } from "../api/users";
import { cache } from "../lib/cache";
import { useAuth } from "./AuthContext";

interface DataContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  leaves: LeaveRequest[];
  setLeaves: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  offlineMode: boolean;
  setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
  fetchInitialData: () => Promise<void>;
  handleForceSync: () => Promise<void>;
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

  const fetchInitialData = useCallback(async () => {
    if (!currentUser || userProfile?.status !== "active") return;

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
          const canAccessLeaves =
            userProfile?.role === "admin" ||
            userProfile?.role === "owner" ||
            userProfile?.hasLeaveFeatureAccess;

          const promises = [
            classesApi.getAll(),
            studentsApi.getAll(),
            canAccessLeaves ? leavesApi.getAll() : Promise.resolve([]),
            usersApi.getAll(),
          ];

          const [classesList, studentsList, leavesList, usersList] =
            await Promise.all(promises);

          setClasses(classesList);
          setStudents(studentsList);
          setLeaves(leavesList);
          setUsers(usersList);
          setOfflineMode(false);

          Promise.all([
            cache.set("offline_classes", classesList),
            cache.set("offline_students", studentsList),
            cache.set("offline_leaves", leavesList),
            cache.set("offline_users", usersList),
          ]).catch((err) => console.error("Error setting cache:", err));
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
  }, [currentUser, userProfile?.status]);

  useEffect(() => {
    let active = true;
    async function loadCache() {
      const [cachedStudents, cachedClasses, cachedLeaves, cachedUsers] =
        await Promise.all([
          cache.get("offline_students"),
          cache.get("offline_classes"),
          cache.get("offline_leaves"),
          cache.get("offline_users"),
        ]);
      if (active) {
        if (cachedStudents) setStudents(cachedStudents);
        if (cachedClasses) setClasses(cachedClasses);
        if (cachedLeaves) setLeaves(cachedLeaves);
        if (cachedUsers) setUsers(cachedUsers);
        if (cachedStudents || cachedClasses) {
          setLoading(false);
        }
      }
    }

    if (currentUser && userProfile?.status === "active") {
      loadCache();
      fetchInitialData();
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
      await cache.remove("offline_students");
      await cache.remove("offline_classes");
      await cache.remove("offline_leaves");
      await cache.remove("offline_users");

      const canAccessLeaves =
        userProfile?.role === "admin" ||
        userProfile?.role === "owner" ||
        userProfile?.hasLeaveFeatureAccess;

      const promises = [
        classesApi.getAll(),
        studentsApi.getAll(),
        canAccessLeaves ? leavesApi.getAll() : Promise.resolve([]),
        usersApi.getAll(),
      ];

      const [classesList, studentsList, leavesList, usersList] =
        await Promise.all(promises);

      setClasses(classesList);
      await cache.set("offline_classes", classesList);

      setStudents(studentsList);
      await cache.set("offline_students", studentsList);

      setLeaves(leavesList);
      await cache.set("offline_leaves", leavesList);

      setUsers(usersList);
      await cache.set("offline_users", usersList);

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

import { useState, useEffect, useCallback, useRef } from "react";
import { Student } from "../types";
import { useData } from "../contexts/DataContext";
import { studentsApi } from "../api/students";
import { studentCache } from "../utils/studentCache";
import { useAuth } from "../contexts/AuthContext";

export function useProfilesData(
  showToast: (
    msg: string,
    sev?: "success" | "error" | "warning" | "info"
  ) => void
) {
  const {
    classes,
    setClasses,
    offlineMode,
  } = useData();

  const { userProfile, authResolved } = useAuth();

  // Local student state with paginated, cached, and searched data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (userProfile && !hasInitializedRef.current) {
      if (userProfile.role === "class_teacher" && userProfile.assignedClassId) {
        setClassFilter(userProfile.assignedClassId);
      }
      hasInitializedRef.current = true;
    }
  }, [userProfile]);

  // Pagination states for Firestore
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Keep track of search timeout for debouncing server-side search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep a stable ref for showToast to avoid re-triggering fetchInitialData on unstable parent functions
  const showToastRef = useRef(showToast);
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Load the initial dataset (IndexedDB cache first, then first page from Firestore)
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Load from IndexedDB cache first so the UI renders instantly
      const cachedList = await studentCache.getAll();
      if (cachedList && cachedList.length > 0) {
        // Sort cached list alphabetically
        cachedList.sort((a, b) => {
          const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
          const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setStudents(cachedList);
        setLoading(false);
      }

      // 2. Fetch fresh first page from server in the background
      if (!offlineMode && authResolved) {
        const { students: serverStudents, lastVisible: nextLastVisible } =
          await studentsApi.getPaginated(40, null);

        if (serverStudents.length > 0) {
          // Update cache with fresh data
          await studentCache.setBatch(serverStudents);

          // Update state: if we have cachedList, merge them nicely
          setStudents((prev) => {
            const mergedMap = new Map(prev.map((s) => [s.id, s]));
            serverStudents.forEach((s) => mergedMap.set(s.id, s));
            const list = Array.from(mergedMap.values());
            list.sort((a, b) => {
              const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
              const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
              return nameA.localeCompare(nameB);
            });
            return list;
          });
          
          setLastVisible(nextLastVisible);
          setHasMore(serverStudents.length >= 40);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Failed to load initial profiles", err);
      showToastRef.current("Could not synchronize profiles. Displaying cached data.", "warning");
    } finally {
      setLoading(false);
    }
  }, [offlineMode, authResolved]);

  // Load next page on scroll
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || offlineMode || searchQuery || classFilter !== "ALL") return;

    try {
      setLoading(true);
      const { students: nextBatch, lastVisible: nextLastVisible } =
        await studentsApi.getPaginated(40, lastVisible);

      if (nextBatch.length > 0) {
        await studentCache.setBatch(nextBatch);
        setStudents((prev) => {
          const mergedMap = new Map(prev.map((s) => [s.id, s]));
          nextBatch.forEach((s) => mergedMap.set(s.id, s));
          const list = Array.from(mergedMap.values());
          list.sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            return nameA.localeCompare(nameB);
          });
          return list;
        });

        setLastVisible(nextLastVisible);
        setHasMore(nextBatch.length >= 40);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more student profiles", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastVisible, offlineMode, searchQuery, classFilter]);

  // Unified effect for search query and class filtering
  useEffect(() => {
    let isCancelled = false;

    // 1. Search Query active: perform debounced mixed search
    if (searchQuery.trim()) {
      const queryStr = searchQuery.trim();
      const performMixedSearch = async () => {
        setLoading(true);
        try {
          // A. Search locally in IndexedDB
          const localMatches = await studentCache.searchLocal(queryStr);
          if (isCancelled) return;
          setStudents(localMatches);

          // B. Query server for prefix search (if online)
          if (!offlineMode) {
            const serverMatches = await studentsApi.search(queryStr);
            if (isCancelled) return;
            if (serverMatches.length > 0) {
              await studentCache.setBatch(serverMatches);
              setStudents((prev) => {
                const mergedMap = new Map();
                localMatches.forEach((s) => mergedMap.set(s.id, s));
                serverMatches.forEach((s) => mergedMap.set(s.id, s));
                const list = Array.from(mergedMap.values());
                list.sort((a, b) => {
                  const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA.localeCompare(nameB);
                });
                return list;
              });
            }
          }
        } catch (err) {
          console.error("Search failed", err);
        } finally {
          if (!isCancelled) {
            setHasMore(false);
            setLoading(false);
          }
        }
      };

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(performMixedSearch, 300);

      return () => {
        isCancelled = true;
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }

    // 2. No search query: handle class filter
    const handleClassFilter = async () => {
      setLoading(true);
      try {
        if (classFilter === "ALL") {
          await fetchInitialData();
        } else if (classFilter === "UNASSIGNED") {
          const localList = await studentCache.getAll();
          if (isCancelled) return;
          const unassigned = localList.filter(
            (s) => !s.classId || s.classId === "",
          );
          setStudents(unassigned);
          setHasMore(false);
        } else {
          // Specific class filter
          const localList = await studentCache.getAll();
          if (isCancelled) return;
          const localClassStudents = localList.filter(
            (s) => (s.classId || "").trim() === classFilter.trim(),
          );
          if (localClassStudents.length > 0) {
            setStudents(localClassStudents);
          }

          if (!offlineMode && authResolved) {
            const serverClassStudents =
              await studentsApi.getByClass(classFilter);
            if (isCancelled) return;
            setStudents((prev) => {
              const mergedMap = new Map(prev.map((s) => [s.id, s]));
              serverClassStudents.forEach((s) => mergedMap.set(s.id, s));
              const list = Array.from(mergedMap.values()).filter(
                (s) => (s.classId || "").trim() === classFilter.trim(),
              );
              list.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
              });
              return list;
            });
            await studentCache.setBatch(serverClassStudents);
          }
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load class filter data", err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    handleClassFilter();

    return () => {
      isCancelled = true;
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, classFilter, offlineMode, fetchInitialData, authResolved]);

  return {
    students,
    setStudents,
    classes,
    setClasses,
    loading,
    setLoading,
    offlineMode,
    searchQuery,
    setSearchQuery,
    classFilter,
    setClassFilter,
    openDialog,
    setOpenDialog,
    openDetailDialog,
    setOpenDetailDialog,
    selectedStudent,
    setSelectedStudent,
    editingStudent,
    setEditingStudent,
    fetchInitialData,
    loadMore,
    hasMore,
  };
}

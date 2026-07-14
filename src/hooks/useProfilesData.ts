import { useState, useEffect, useCallback, useRef } from "react";
import { Student } from "../types";
import { useData } from "../contexts/DataContext";
import { studentsApi } from "../api/students";
import { studentCache } from "../utils/studentCache";

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

  // Local student state with paginated, cached, and searched data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("ALL");

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
      if (!offlineMode) {
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
      showToast("Could not synchronize profiles. Displaying cached data.", "warning");
    } finally {
      setLoading(false);
    }
  }, [offlineMode, showToast]);

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

  // Execute combined local & server-side search when searchQuery changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Restore default list
      if (classFilter === "ALL") {
        fetchInitialData();
      } else if (classFilter === "UNASSIGNED") {
        setLoading(true);
        studentCache.getAll().then((localList) => {
          const unassigned = localList.filter((s) => !s.classId || s.classId === "");
          setStudents(unassigned);
          setHasMore(false);
          setLoading(false);
        });
      } else {
        // Load the filtered class students
        setLoading(true);
        studentsApi.getByClass(classFilter).then((classStudents) => {
          setStudents(classStudents);
          studentCache.setBatch(classStudents);
          setHasMore(false);
          setLoading(false);
        });
      }
      return;
    }

    const performMixedSearch = async () => {
      setLoading(true);
      const queryStr = searchQuery.trim();

      try {
        // 1. Search locally in IndexedDB (very fast, handles partial/substring matches)
        const localMatches = await studentCache.searchLocal(queryStr);
        setStudents(localMatches);

        // 2. Query server for prefix search (if online)
        if (!offlineMode) {
          const serverMatches = await studentsApi.search(queryStr);
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
        setHasMore(false); // No scrolling pagination during search results
        setLoading(false);
      }
    };

    // Debounce to prevent server-side query on every keystroke
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(performMixedSearch, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, classFilter, offlineMode, fetchInitialData]);

  // Load specific class students on filter select
  useEffect(() => {
    if (searchQuery.trim()) return; // Search query listener handles its own filtering

    if (classFilter === "ALL") {
      fetchInitialData();
    } else if (classFilter === "UNASSIGNED") {
      setLoading(true);
      studentCache.getAll().then((localList) => {
        const unassigned = localList.filter((s) => !s.classId || s.classId === "");
        setStudents(unassigned);
        setHasMore(false);
        setLoading(false);
      });
    } else {
      const loadClassStudents = async () => {
        try {
          setLoading(true);
          // Load only class-specific records on demand
          const classStudents = await studentsApi.getByClass(classFilter);
          setStudents(classStudents);
          await studentCache.setBatch(classStudents);
          setHasMore(false);
        } catch (err) {
          console.error("Failed to load class students", err);
        } finally {
          setLoading(false);
        }
      };
      loadClassStudents();
    }
  }, [classFilter, fetchInitialData, searchQuery]);

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

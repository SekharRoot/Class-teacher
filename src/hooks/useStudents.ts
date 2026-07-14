import { useState, useEffect, useCallback } from "react";
import { Student } from "../types";
import { studentsApi } from "../api/students";
import { studentCache } from "../utils/studentCache";

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);

  // Load initial page + local cache
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const { students: newStudents, lastVisible: nextLastVisible } = 
        await studentsApi.getPaginated(20, lastVisible);
      
      if (newStudents.length < 20) setHasMore(false);
      
      setStudents(prev => [...prev, ...newStudents]);
      setLastVisible(nextLastVisible);
      
      // Update cache
      await studentCache.setBatch(newStudents);
    } catch (e) {
      console.error("Failed to load students", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastVisible]);

  // Search logic
  const searchStudents = async (term: string) => {
    // 1. Local search
    const local = await studentCache.searchLocal(term);
    
    // 2. Server search
    const server = await studentsApi.search(term);
    
    // Merge & unique
    const all = [...local, ...server];
    const unique = Array.from(new Map(all.map(s => [s.id, s])).values());
    
    setStudents(unique);
    setHasMore(false); // Search results are fixed for the query
  };

  useEffect(() => {
    loadMore();
  }, []);

  return { students, loading, hasMore, loadMore, searchStudents };
};

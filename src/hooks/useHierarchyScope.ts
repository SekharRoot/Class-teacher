import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserProfile, ClassItem } from "../types";
import { useData } from "../contexts/DataContext";

export function useHierarchyScope() {
  const { userProfile } = useAuth();
  const {
    users: allUsers,
    classes: allClasses,
    loading: globalLoading,
  } = useData();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!globalLoading) {
      setLoading(false);
    }
  }, [globalLoading]);

  // Compute authorized classes
  const authorizedClassIds = useMemo((): string[] => {
    if (!userProfile) return [];

    if (
      userProfile.role === "owner" ||
      userProfile.role === "admin" ||
      userProfile.role === "principal" ||
      userProfile.role === "academic_coordinator"
    ) {
      return allClasses.map((c) => c.id);
    }

    if (userProfile.role === "class_teacher") {
      const ids: string[] = [];
      if (userProfile.assignedClassId) {
        ids.push(userProfile.assignedClassId);
      }
      if (userProfile.assignedClassId2) {
        ids.push(userProfile.assignedClassId2);
      }
      if (userProfile.alternateClassIds) {
        userProfile.alternateClassIds.forEach((id) => {
          if (id && !ids.includes(id)) {
            ids.push(id);
          }
        });
      }
      return ids;
    }

    return [];
  }, [userProfile, allClasses, allUsers]);

  const isClassAuthorized = useCallback((classId: string): boolean => {
    if (!userProfile) return false;
    if (
      userProfile.role === "owner" ||
      userProfile.role === "admin" ||
      userProfile.role === "principal" ||
      userProfile.role === "academic_coordinator"
    )
      return true;
    return authorizedClassIds.includes(classId);
  }, [userProfile, authorizedClassIds]);

  const isReadOnly = useMemo(() => userProfile?.role === "principal", [userProfile]);

  return {
    allUsers,
    allClasses,
    authorizedClassIds,
    isClassAuthorized,
    isReadOnly,
    loadingScope: loading,
  };
}

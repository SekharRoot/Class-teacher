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
      userProfile.role === "principal"
    ) {
      return allClasses.map((c) => c.id);
    }

    if (userProfile.role === "academic_coordinator") {
      const reportingTeachers = allUsers.filter(
        (u) =>
          u.role === "class_teacher" &&
          (u.coordinatorIds?.includes(userProfile.uid) ||
            u.coordinatorId === userProfile.uid),
      );
      return reportingTeachers
        .map((t) => t.assignedClassId)
        .filter((id): id is string => !!id);
    }

    if (userProfile.role === "class_teacher") {
      return userProfile.assignedClassId ? [userProfile.assignedClassId] : [];
    }

    return [];
  }, [userProfile, allClasses, allUsers]);

  const isClassAuthorized = useCallback((classId: string): boolean => {
    if (!userProfile) return false;
    if (
      userProfile.role === "owner" ||
      userProfile.role === "admin" ||
      userProfile.role === "principal"
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

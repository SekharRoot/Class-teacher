let currentActiveSchoolId = "default_school";

export function getActiveSchoolId(): string {
  // Try reading from multiple common keys for compatibility
  const stored = localStorage.getItem("activeSchoolId") || 
                 localStorage.getItem("active_school_id") ||
                 localStorage.getItem("adminSelectedSchoolId") ||
                 localStorage.getItem("loginSelectedSchoolId");
                 
  if (stored) {
    currentActiveSchoolId = stored;
  }
  return currentActiveSchoolId;
}

export function setActiveSchoolId(schoolId: string) {
  currentActiveSchoolId = schoolId || "default_school";
  localStorage.setItem("activeSchoolId", currentActiveSchoolId);
}

export function matchesActiveSchool(itemSchoolId: string | undefined | null, activeSchoolId: string): boolean {
  if (activeSchoolId === "default_school") {
    return !itemSchoolId || itemSchoolId === "default_school";
  }
  return itemSchoolId === activeSchoolId;
}


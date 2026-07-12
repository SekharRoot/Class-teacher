let currentActiveSchoolId = "default_school";

export function getActiveSchoolId(): string {
  // Try reading from localStorage first
  const stored = localStorage.getItem("activeSchoolId");
  if (stored) {
    currentActiveSchoolId = stored;
  } else {
    const adminStored = localStorage.getItem("adminSelectedSchoolId");
    if (adminStored) {
      currentActiveSchoolId = adminStored;
    }
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


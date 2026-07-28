import re

with open("src/hooks/useAttendanceData.ts", "r") as f:
    content = f.read()

# Make useAttendanceData accept authResolved
content = content.replace(
    "  const { userProfile, activeSchoolId } = useAuth();",
    "  const { userProfile, activeSchoolId, authResolved } = useAuth();"
)

# And avoid onSnapshot until authResolved
content = content.replace(
    "    if (offlineMode || !selectedClassId) return;",
    "    if (offlineMode || !selectedClassId || !authResolved) return;"
)

with open("src/hooks/useAttendanceData.ts", "w") as f:
    f.write(content)
print("Done useAttendanceData")

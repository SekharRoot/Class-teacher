import re

with open("src/hooks/useAttendanceData.ts", "r") as f:
    content = f.read()

# Make sure authResolved is present in useAuth extraction
if "authResolved" not in content and "useAuth" in content:
    content = content.replace(
        "  const { userProfile } = useAuth();",
        "  const { userProfile, authResolved } = useAuth();"
    )

content = content.replace(
    "  const fetchAttendanceForDate = async (dateStr: string) => {",
    "  const fetchAttendanceForDate = async (dateStr: string) => {\n    if (!authResolved) return;"
)

content = content.replace(
    "  const fetchHistory = async () => {",
    "  const fetchHistory = async () => {\n    if (!authResolved) return;"
)

content = content.replace(
    "  // 5. Run connection check and initial sync\n  useEffect(() => {\n    fetchAttendanceForDate(dateString);\n  }, [dateString]);",
    "  // 5. Run connection check and initial sync\n  useEffect(() => {\n    fetchAttendanceForDate(dateString);\n  }, [dateString, authResolved]);"
)

content = content.replace(
    "  }, [selectedClassId, students, dateString, historyLimit, activeTab]);",
    "  }, [selectedClassId, students, dateString, historyLimit, activeTab, authResolved]);"
)

content = content.replace(
    "  // Also fetch history on dateString change to keep track of date-wise history switch\n  useEffect(() => {\n    fetchHistory();\n  }, [dateString]);",
    "  // Also fetch history on dateString change to keep track of date-wise history switch\n  useEffect(() => {\n    fetchHistory();\n  }, [dateString, authResolved]);"
)

with open("src/hooks/useAttendanceData.ts", "w") as f:
    f.write(content)
print("Done patch_use_attendance")

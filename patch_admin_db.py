import re

with open("src/hooks/useAdminDatabase.ts", "r") as f:
    content = f.read()

# Add authResolved to useAuth
if "authResolved" not in content and "useAuth" in content:
    content = content.replace(
        "  const { userProfile } = useAuth();",
        "  const { userProfile, authResolved } = useAuth();"
    )
    content = content.replace(
        "  const { activeSchoolId, activeSchoolName } = useAuth();",
        "  const { activeSchoolId, activeSchoolName, authResolved } = useAuth();"
    )

# And inside fetchDbCounts
content = content.replace(
    "  const fetchDbCounts = useCallback(async (schoolId: string) => {",
    "  const fetchDbCounts = useCallback(async (schoolId: string) => {\n    if (!authResolved) return;"
)

content = content.replace(
    "  }, [setError]);",
    "  }, [setError, authResolved]);"
)

with open("src/hooks/useAdminDatabase.ts", "w") as f:
    f.write(content)
print("Done useAdminDatabase")

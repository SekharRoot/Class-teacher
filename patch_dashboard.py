import re

with open("src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "  const { currentUser, userProfile } = useAuth();",
    "  const { currentUser, userProfile, authResolved } = useAuth();"
)

content = content.replace(
    "    if (loadingScope || globalLoading) return;",
    "    if (loadingScope || globalLoading || !authResolved) return;"
)

with open("src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
print("Done Dashboard")

import re

with open("src/contexts/DataContext.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "  const fetchInitialData = useCallback(async () => {\n    if (!currentUser || userProfile?.status !== \"active\") return;",
    "  const fetchInitialData = useCallback(async () => {\n    if (!currentUser || userProfile?.status !== \"active\" || !authResolved) return;"
)

content = content.replace(
    "  }, [currentUser, userProfile?.status, fetchAndCacheAll]);",
    "  }, [currentUser, userProfile?.status, authResolved, fetchAndCacheAll]);"
)

with open("src/contexts/DataContext.tsx", "w") as f:
    f.write(content)
print("Done fetchInitialData DataContext")

import re

with open("src/hooks/useProfilesData.ts", "r") as f:
    content = f.read()

content = content.replace(
    "  const { userProfile } = useAuth();",
    "  const { userProfile, authResolved } = useAuth();"
)

content = content.replace(
    "      // 2. Fetch fresh first page from server in the background\n      if (!offlineMode) {",
    "      // 2. Fetch fresh first page from server in the background\n      if (!offlineMode && authResolved) {"
)

content = content.replace(
    "            if (!offlineMode) {",
    "            if (!offlineMode && authResolved) {"
)

content = content.replace(
    "          // 2. Load from server\n          if (!offlineMode) {",
    "          // 2. Load from server\n          if (!offlineMode && authResolved) {"
)

# And add authResolved to dependency arrays
content = content.replace(
    "  }, [offlineMode, showToast]);",
    "  }, [offlineMode, showToast, authResolved]);"
)

content = content.replace(
    "  }, [searchQuery, classFilter, offlineMode, fetchInitialData]);",
    "  }, [searchQuery, classFilter, offlineMode, fetchInitialData, authResolved]);"
)

content = content.replace(
    "  }, [classFilter, offlineMode, searchQuery, fetchInitialData]);",
    "  }, [classFilter, offlineMode, searchQuery, fetchInitialData, authResolved]);"
)

with open("src/hooks/useProfilesData.ts", "w") as f:
    f.write(content)
print("Done useProfilesData")

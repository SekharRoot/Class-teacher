import re

with open("src/contexts/DataContext.tsx", "r") as f:
    content = f.read()

# Add authResolved to useAuth
content = content.replace(
    "  const { currentUser, userProfile } = useAuth();",
    "  const { currentUser, userProfile, authResolved } = useAuth();"
)

# Add if (!authResolved) return; before background sync
content = content.replace(
    "      // 2. Sequentially trigger server fetch in background to download fresh data",
    "      // If Firebase Auth hasn't fully settled, wait before doing network syncs to avoid 'Missing permissions' errors\n      if (!authResolved) return;\n\n      // 2. Sequentially trigger server fetch in background to download fresh data"
)

# Add authResolved to dependency array
content = content.replace(
    "  }, [currentUser, userProfile?.status, fetchInitialData, fetchAndCacheAll]);",
    "  }, [currentUser, userProfile?.status, authResolved, fetchInitialData, fetchAndCacheAll]);"
)

with open("src/contexts/DataContext.tsx", "w") as f:
    f.write(content)
print("Done DataContext")

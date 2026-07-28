import re

with open("src/hooks/useHierarchyScope.ts", "r") as f:
    content = f.read()

# Make sure authResolved is injected if not already
if "authResolved" not in content and "useAuth" in content:
    content = content.replace(
        "  const { userProfile } = useAuth();",
        "  const { userProfile, authResolved } = useAuth();"
    )

content = content.replace(
    "  useEffect(() => {\n    const fetchData = async () => {\n      setLoading(true);\n      try {\n        // Try to get from local cache first",
    "  useEffect(() => {\n    const fetchData = async () => {\n      setLoading(true);\n      try {\n        // Try to get from local cache first"
)

content = content.replace(
    "          if (typeof navigator !== 'undefined' && navigator.onLine) {\n            const [serverClasses, serverUsers] = await Promise.all([\n              classesApi.getAll(),\n              usersApi.getAll(),\n            ]);",
    "          if (typeof navigator !== 'undefined' && navigator.onLine && authResolved) {\n            const [serverClasses, serverUsers] = await Promise.all([\n              classesApi.getAll(),\n              usersApi.getAll(),\n            ]);"
)

content = content.replace(
    "  }, []);",
    "  }, [authResolved]);"
)

with open("src/hooks/useHierarchyScope.ts", "w") as f:
    f.write(content)
print("Done useHierarchyScope")

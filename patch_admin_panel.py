import re

with open("src/pages/AdminPanel.tsx", "r") as f:
    content = f.read()

# Replace useAuth
if "authResolved" not in content and "useAuth" in content:
    content = content.replace(
        "  const { userProfile, activeSchoolId } = useAuth();",
        "  const { userProfile, activeSchoolId, authResolved } = useAuth();"
    )
    content = content.replace(
        "  const { userProfile } = useAuth();",
        "  const { userProfile, authResolved } = useAuth();"
    )

content = content.replace(
    "  const loadData = async () => {\n    try {",
    "  const loadData = async () => {\n    if (!authResolved) return;\n    try {"
)

content = content.replace(
    "  useEffect(() => {\n    loadData();\n  }, []);",
    "  useEffect(() => {\n    loadData();\n  }, [authResolved]);"
)

with open("src/pages/AdminPanel.tsx", "w") as f:
    f.write(content)
print("Done patch AdminPanel")

import re

with open("src/pages/Classes.tsx", "r") as f:
    content = f.read()

# Replace useAuth
if "authResolved" not in content and "useAuth" in content:
    content = content.replace(
        "  const { userProfile } = useAuth();",
        "  const { userProfile, authResolved } = useAuth();"
    )
    content = content.replace(
        "  const { userProfile, currentUser } = useAuth();",
        "  const { userProfile, currentUser, authResolved } = useAuth();"
    )

content = content.replace(
    "  useEffect(() => {\n    if (isOwnerOrSuperAdmin) {\n      schoolsApi.getAll().then((data) => {",
    "  useEffect(() => {\n    if (isOwnerOrSuperAdmin && authResolved) {\n      schoolsApi.getAll().then((data) => {"
)

content = content.replace(
    "  }, [isOwnerOrSuperAdmin]);",
    "  }, [isOwnerOrSuperAdmin, authResolved]);"
)

with open("src/pages/Classes.tsx", "w") as f:
    f.write(content)
print("Done patch Classes.tsx")

import re

with open("src/contexts/AuthContext.tsx", "r") as f:
    content = f.read()

# Add authResolved to interface
content = content.replace(
    "  setActiveSchool: (schoolId: string, schoolName: string) => void;\n}",
    "  setActiveSchool: (schoolId: string, schoolName: string) => void;\n  authResolved: boolean;\n}"
)

# Add authResolved to default context
content = content.replace(
    "  setActiveSchool: () => {},\n});",
    "  setActiveSchool: () => {},\n  authResolved: false,\n});"
)

# Add state
state_code = "  const [authResolved, setAuthResolved] = useState(false);"
content = content.replace(
    "  const [loading, setLoading] = useState<boolean>(!hasCachedProfile());",
    "  const [loading, setLoading] = useState<boolean>(!hasCachedProfile());\n  const [authResolved, setAuthResolved] = useState(false);"
)

# Set state on auth state changed
auth_state_code = """
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthResolved(true);
"""
content = content.replace(
    "    const unsubscribe = onAuthStateChanged(auth, async (user) => {",
    auth_state_code
)

# Expose to provider
provider_code = "        activeSchoolName,\n        setActiveSchool,\n        authResolved,\n      }}"
content = content.replace(
    "        activeSchoolName,\n        setActiveSchool,\n      }}",
    provider_code
)

with open("src/contexts/AuthContext.tsx", "w") as f:
    f.write(content)
print("Done AuthContext")

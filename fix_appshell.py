import re

with open("src/layouts/AppShell.tsx", "r") as f:
    content = f.read()

# We need to move `const { primaryMenuItems, secondaryMenuItems } = useNavigationItems(userProfile);`
# up to before `if (isLoggingOut || !currentUser)`

hook_call = "  const { primaryMenuItems, secondaryMenuItems } = useNavigationItems(userProfile);\n"
content = content.replace(hook_call, "")

# Find insertion point
target = "  if (isLoggingOut || !currentUser) {"
content = content.replace(target, hook_call + "\n" + target)

with open("src/layouts/AppShell.tsx", "w") as f:
    f.write(content)

print("Fixed AppShell")

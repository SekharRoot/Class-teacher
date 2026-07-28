import re

with open("src/hooks/useClassesLogic.ts", "r") as f:
    hook_content = f.read()

start_marker = "export const useClassesLogic = () => {\n"
end_marker = "\n  return {"

start_idx = hook_content.find(start_marker) + len(start_marker)
end_idx = hook_content.find(end_marker, start_idx)

extracted = hook_content[start_idx:end_idx]

with open("src/pages/Classes.tsx", "r") as f:
    content = f.read()

# find where it was replaced
start_repl = "  const {\n    userProfile,\n"
end_repl = "  } = useClassesLogic();\n"

start_idx = content.find(start_repl)
end_idx = content.find(end_repl, start_idx) + len(end_repl)

new_content = content[:start_idx] + "  const { userProfile } = useAuth();\n" + extracted + "\n" + content[end_idx:]

# remove import
new_content = new_content.replace('import { useClassesLogic } from "../hooks/useClassesLogic";\n', '')

with open("src/pages/Classes.tsx", "w") as f:
    f.write(new_content)

print("Reverted Classes")

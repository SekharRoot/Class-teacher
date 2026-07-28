import re

with open("src/hooks/useAttendanceLogic.ts", "r") as f:
    hook_content = f.read()

start_marker = 'export const useAttendanceLogic = (showToast: (msg: string, severity?: "success" | "error" | "warning" | "info") => void) => {\n'
end_marker = "\n  return {"

start_idx = hook_content.find(start_marker) + len(start_marker)
end_idx = hook_content.find(end_marker, start_idx)

extracted = hook_content[start_idx:end_idx]

with open("src/pages/Attendance.tsx", "r") as f:
    content = f.read()

start_repl = "  const {\n    userProfile,\n"
end_repl = "  } = useAttendanceLogic(showToast);\n"

start_idx = content.find(start_repl)
end_idx = content.find(end_repl, start_idx) + len(end_repl)

new_content = content[:start_idx] + "  const { userProfile } = useAuth();\n" + extracted + "\n" + content[end_idx:]

new_content = new_content.replace('import { useAttendanceLogic } from "../hooks/useAttendanceLogic";\n', '')

with open("src/pages/Attendance.tsx", "w") as f:
    f.write(new_content)

print("Reverted Attendance")

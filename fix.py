with open("src/pages/Settings.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "{isAdmin && (" in line:
        lines.insert(i+1, "          <>\n            <Grid size={{ xs: 12, md: 6 }}>\n")
        break

with open("src/pages/Settings.tsx", "w") as f:
    f.writelines(lines)

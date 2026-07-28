import re

with open("src/components/admin/SchoolMigrationTab.tsx", "r") as f:
    content = f.read()

start_marker = "  const [counts, setCounts] = useState"
end_marker = "  return ("

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

extracted_logic = content[start_idx:end_idx]

hook_code = f"""import {{ useState, useEffect }} from "react";
import {{ collection, query, getDocs, setDoc, doc, where, deleteDoc }} from "firebase/firestore";
import {{ db }} from "../../../lib/firebase";
import {{ attendanceApi }} from "../../../api/attendance";
import {{ School, UserProfile }} from "../../../types";

export const useSchoolMigration = (schools: School[], userProfile: UserProfile | null) => {{
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>("");

{extracted_logic}

  return {{
    selectedSchoolId, setSelectedSchoolId,
    selectedSchoolName, setSelectedSchoolName,
    counts,
    loadingStats,
    migrationLoading,
    migrationStatus,
    migrationProgress,
    migrationSuccess,
    migrationError,
    purgeLoading,
    purgeSuccess,
    fetchCounts,
    handleMigrate,
    handlePurgeRoot
  }};
}};
"""

with open("src/components/admin/hooks/useSchoolMigration.ts", "w") as f:
    f.write(hook_code)

replacement = """  const {
    selectedSchoolId, setSelectedSchoolId,
    selectedSchoolName, setSelectedSchoolName,
    counts,
    loadingStats,
    migrationLoading,
    migrationStatus,
    migrationProgress,
    migrationSuccess,
    migrationError,
    purgeLoading,
    purgeSuccess,
    fetchCounts,
    handleMigrate,
    handlePurgeRoot
  } = useSchoolMigration(schools, userProfile);

"""

new_content = content[:content.find("  const [selectedSchoolId")] + replacement + content[end_idx:]
# Add the import
import_stmt = 'import { useSchoolMigration } from "./hooks/useSchoolMigration";\n'
new_content = import_stmt + new_content

with open("src/components/admin/SchoolMigrationTab.tsx", "w") as f:
    f.write(new_content)

print("Done")

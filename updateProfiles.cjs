const fs = require("fs");
let content = fs.readFileSync("src/pages/Profiles.tsx", "utf8");

// 1. Add Import
content = content.replace(
  "import { StudentFormDialog } from '../components/StudentFormDialog';",
  "import { StudentFormDialog } from '../components/StudentFormDialog';\nimport { StudentDeleteDialog } from '../components/StudentDeleteDialog';",
);

// 2. Replace the Dialog
const dialogSearch = "{/* Two-step Student Delete Confirmation Dialog */}";
const startIndex = content.indexOf(dialogSearch);
const endIndex = content.indexOf("<Snackbar open={!!toastMessage}");

if (startIndex !== -1 && endIndex !== -1) {
  const newDialog = `<StudentDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        deleteStep={deleteStep}
        setDeleteStep={setDeleteStep}
        studentToDelete={studentToDelete}
        onConfirm={handleConfirmDeleteStudent}
      />\n\n      `;

  content =
    content.substring(0, startIndex) + newDialog + content.substring(endIndex);
  fs.writeFileSync("src/pages/Profiles.tsx", content);
  console.log("Profiles updated");
} else {
  console.log("Not found");
}

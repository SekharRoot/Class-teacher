import re

with open("src/pages/Settings.tsx", "r") as f:
    content = f.read()

start_marker = "{/* CSV Import Preview Dialog */}"
end_marker = "{/* Snackbar alerts */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

extracted = content[start_idx:end_idx]

component = f"""import React from "react";
import {{
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, IconButton, Alert, Stack, Chip, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
}} from "@mui/material";
import {{ Close, CheckCircle }} from "@mui/icons-material";
import {{ ParsedStudentPreview }} from "../../utils/csvImport";
import {{ ClassItem }} from "../../types";

interface CsvImportDialogProps {{
  open: boolean;
  onClose: () => void;
  importing: boolean;
  previewsToImport: ParsedStudentPreview[];
  classes: ClassItem[];
  onConfirmImport: () => void;
}}

export const CsvImportDialog: React.FC<CsvImportDialogProps> = ({{
  open, onClose, importing, previewsToImport, classes, onConfirmImport
}}) => {{
  return (
    {extracted.strip()}
  );
}};
"""

# Replace in Settings.tsx
# In Settings.tsx, the Close icon needs to call onClose.
# Wait, the extracted JSX has `setImportDialogOpen`, `handleConfirmImport`. I should replace them.
component = component.replace("setImportDialogOpen(false)", "onClose()")
component = component.replace("importDialogOpen", "open")
component = component.replace("handleConfirmImport", "onConfirmImport")

with open("src/components/settings/CsvImportDialog.tsx", "w") as f:
    f.write(component)

replacement = """
      <CsvImportDialog
        open={importDialogOpen}
        onClose={() => !importing && setImportDialogOpen(false)}
        importing={importing}
        previewsToImport={previewsToImport}
        classes={classes}
        onConfirmImport={handleConfirmImport}
      />
"""

new_content = content[:start_idx] + replacement + content[end_idx:]
import_stmt = 'import { CsvImportDialog } from "../components/settings/CsvImportDialog";\n'
new_content = import_stmt + new_content

with open("src/pages/Settings.tsx", "w") as f:
    f.write(new_content)

print("Done")

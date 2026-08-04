import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, IconButton, Alert, Stack, Chip, Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { Close, CheckCircle } from "@mui/icons-material";
import { ParsedStudentPreview } from "../../utils/csvImport";
import { ClassItem } from "../../types";

interface CsvImportDialogProps {
  open: boolean;
  onClose: () => void;
  importing: boolean;
  previewsToImport: ParsedStudentPreview[];
  classes: ClassItem[];
  onConfirmImport: () => void;
}

export const CsvImportDialog: React.FC<CsvImportDialogProps> = ({
  open, onClose, importing, previewsToImport, classes, onConfirmImport
}) => {
  return (
    
      <Dialog
        open={open}
        onClose={() => !importing && onClose()}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Review CSV Import Data
          </Typography>
          {!importing && (
            <IconButton onClick={() => onClose()}>
              <Close />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            <Alert severity="info" sx={{ mb: 2, borderRadius: "10px" }}>
              We've analyzed your CSV file. Review the records below. Duplicate rows will be skipped, and unrecognized class standard names will be auto-formatted and created as new classes in <strong>"BOARD STANDARD SECTION"</strong> format (e.g. CBSE XII PCB3(D)).
            </Alert>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
              <Chip
                label={`Total Rows: ${previewsToImport.length}`}
                variant="outlined"
                color="primary"
                size="small"
              />
              <Chip
                label={`Valid & New: ${previewsToImport.filter(p => p.status === "new").length}`}
                color="success"
                size="small"
              />
              <Chip
                label={`Duplicates/Ignored: ${previewsToImport.filter(p => p.status === "duplicate" || p.status === "invalid").length}`}
                color="warning"
                size="small"
              />
            </Stack>
          </Box>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Class Standard</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Boarder Type</TableCell>
                  <TableCell>Father Name</TableCell>
                  <TableCell>Mother Name</TableCell>
                  <TableCell>Phone</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewsToImport.map((p, idx) => {
                  const isNew = p.status === "new";
                  const isDup = p.status === "duplicate";
                  const isInvalid = p.status === "invalid";
                  
                  return (
                    <TableRow key={idx} hover sx={{ opacity: isNew ? 1 : 0.65 }}>
                      <TableCell>
                        {isNew && (
                          <Chip
                            label="Ready"
                            color="success"
                            variant="outlined"
                            size="small"
                          />
                        )}
                        {isDup && (
                          <Chip
                            label="Duplicate"
                            color="warning"
                            variant="outlined"
                            size="small"
                            title={p.statusReason}
                          />
                        )}
                        {isInvalid && (
                          <Chip
                            label="Invalid"
                            color="error"
                            variant="outlined"
                            size="small"
                            title={p.statusReason}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: "bold" }}>
                        {p.rollNumber}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "medium" }}>
                        {p.firstName} {p.lastName}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                            {p.parsedClass.formattedName}
                          </Typography>
                          {p.rawClassName !== p.parsedClass.formattedName && (
                            <Typography variant="caption" color="text.secondary">
                              Parsed from "{p.rawClassName}"
                            </Typography>
                          )}
                          {!classes.some(c => `${c.board} ${c.classStandard} ${c.section}`.toLowerCase() === p.parsedClass.formattedName.toLowerCase()) && (
                            <Chip
                              label="New class will be created"
                              size="small"
                              color="info"
                              sx={{ fontSize: "0.65rem", height: 16, mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{p.gender}</TableCell>
                      <TableCell>
                        <Chip
                          label={p.boarderType}
                          color={p.boarderType === "Full Boarder" ? "primary" : "secondary"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{p.fatherName || "-"}</TableCell>
                      <TableCell>{p.motherName || "-"}</TableCell>
                      <TableCell>{p.phoneNumber || "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
          <Button
            onClick={() => onClose()}
            disabled={importing}
            color="inherit"
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmImport}
            disabled={importing || previewsToImport.filter(p => p.status === "new").length === 0}
            variant="contained"
            color="primary"
            startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
            sx={{ textTransform: "none", px: 3, borderRadius: "10px" }}
          >
            {importing ? "Importing..." : `Import ${previewsToImport.filter(p => p.status === "new").length} Profiles`}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

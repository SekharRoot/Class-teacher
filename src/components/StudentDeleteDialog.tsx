import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

interface StudentDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  deleteStep: number;
  setDeleteStep: (step: number) => void;
  studentToDelete: { id: string; name: string } | null;
  onConfirm: () => void;
}

export function StudentDeleteDialog({
  open,
  onClose,
  deleteStep,
  setDeleteStep,
  studentToDelete,
  onConfirm,
}: StudentDeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: deleteStep === 2 ? "error.main" : "warning.main",
        }}
      >
        <Warning
          sx={{ color: deleteStep === 2 ? "error.main" : "warning.main" }}
        />{" "}
        {deleteStep === 1 ? "Confirm Deletion" : "FINAL WARNING"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {studentToDelete && (
          <Box>
            {deleteStep === 1 ? (
              <Typography variant="body1">
                Are you sure you want to delete student profile{" "}
                <strong>"{studentToDelete.name}"</strong>?
                <br />
                <br />
                This will also delete all their attendance records and
                associated logs.
              </Typography>
            ) : (
              <Typography variant="body1">
                WARNING: This action is permanent and cannot be undone.
                <br />
                <br />
                Are you absolutely certain you want to permanently erase the
                profile for <strong>"{studentToDelete.name}"</strong> and all
                associated data?
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Cancel
        </Button>
        {deleteStep === 1 ? (
          <Button
            variant="contained"
            color="warning"
            onClick={() => setDeleteStep(2)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Proceed to Final Step
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={onConfirm}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Permanently Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

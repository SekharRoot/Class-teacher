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
import { Warning as WarningIcon } from "@mui/icons-material";

interface ConfirmDeleteUserDialogProps {
  open: boolean;
  onClose: () => void;
  deleteStep: number;
  setDeleteStep: (step: number) => void;
  userToDelete: any;
  onConfirmDelete: () => void;
}

export const ConfirmDeleteUserDialog: React.FC<ConfirmDeleteUserDialogProps> = ({
  open,
  onClose,
  deleteStep,
  setDeleteStep,
  userToDelete,
  onConfirmDelete,
}) => {
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
        <WarningIcon />{" "}
        {deleteStep === 1 ? "Confirm Deletion" : "FINAL WARNING"}
      </DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        {userToDelete && (
          <Box>
            {deleteStep === 1 ? (
              <Typography variant="body1">
                Are you sure you want to delete the user profile for{" "}
                <strong>{userToDelete.email}</strong>?
                <br />
                <br />
                This will not delete their authentication account, but will
                revoke their workspace role permissions.
              </Typography>
            ) : (
              <Typography variant="body1">
                WARNING: This action is permanent and cannot be undone.
                <br />
                <br />
                Are you absolutely certain you want to proceed and permanently
                delete the profile for <strong>{userToDelete.email}</strong>?
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
            onClick={onConfirmDelete}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Permanently Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

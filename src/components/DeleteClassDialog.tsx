import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface DeleteClassDialogProps {
  open: boolean;
  onClose: () => void;
  className: string;
  onConfirm: (deleteStudents: boolean) => Promise<void>;
}

export const DeleteClassDialog: React.FC<DeleteClassDialogProps> = ({
  open,
  onClose,
  className,
  onConfirm,
}) => {
  const [deleteOption, setDeleteOption] = useState<"keep" | "delete">("keep");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete the class "${className}"?`,
      )
    ) {
      return;
    }
    if (deleteOption === "delete") {
      if (
        !window.confirm(
          `WARNING: You have selected to delete all students in this class. This is a destructive action that cannot be reversed. Are you absolutely sure?`,
        )
      ) {
        return;
      }
    }
    try {
      setSubmitting(true);
      await onConfirm(deleteOption === "delete");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Delete Class</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          You are about to delete the class <strong>{className}</strong>.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          What would you like to do with the students currently enrolled in this
          class?
        </Typography>
        <RadioGroup
          value={deleteOption}
          onChange={(e) => setDeleteOption(e.target.value as "keep" | "delete")}
        >
          <FormControlLabel
            value="keep"
            control={<Radio />}
            label="Keep students (they will become unassigned)"
          />
          <FormControlLabel
            value="delete"
            control={<Radio color="error" />}
            label="Delete students along with this class"
          />
        </RadioGroup>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={submitting}
        >
          {submitting ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

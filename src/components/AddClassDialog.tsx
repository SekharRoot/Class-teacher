import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { ClassItem } from "../types";

interface ClassFormDialogProps {
  open: boolean;
  onClose: () => void;
  classesList: ClassItem[];
  editingClass?: ClassItem | null;
  onSaveClass: (
    oldId: string | null,
    board: string,
    classStandard: string,
    section: string,
  ) => Promise<boolean>;
}

export const ClassFormDialog: React.FC<ClassFormDialogProps> = ({
  open,
  onClose,
  classesList,
  editingClass,
  onSaveClass,
}) => {
  const [board, setBoard] = useState("");
  const [classStandard, setClassStandard] = useState("");
  const [section, setSection] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (editingClass) {
      setBoard(editingClass.board);
      setClassStandard(editingClass.classStandard);
      setSection(editingClass.section);
    } else {
      setBoard("");
      setClassStandard("");
      setSection("");
    }
    setErrorText("");
  }, [editingClass, open]);

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const trimmedBoard = board.trim().toUpperCase();
    const trimmedStandard = classStandard.trim().toUpperCase();
    const trimmedSection = section.trim().toUpperCase();

    if (!trimmedBoard || !trimmedStandard || !trimmedSection) {
      setErrorText("All fields are required.");
      return;
    }

    const newClassId =
      `${trimmedBoard}_${trimmedStandard}_${trimmedSection}`.replace(
        /\s+/g,
        "_",
      );

    if (
      classesList.some((c) => c.id === newClassId && c.id !== editingClass?.id)
    ) {
      setErrorText(
        `Class "${trimmedBoard} ${trimmedStandard} ${trimmedSection}" already exists!`,
      );
      return;
    }

    try {
      setSubmitting(true);
      const success = await onSaveClass(
        editingClass?.id || null,
        trimmedBoard,
        trimmedStandard,
        trimmedSection,
      );
      if (success) {
        setBoard("");
        setClassStandard("");
        setSection("");
        onClose();
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to save class.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <form onSubmit={handleLocalSubmit}>
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          {editingClass ? "Edit Classroom Config" : "Add New Classroom Config"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Enter educational board, class standard level, and specific section
            details to configure a class.
          </Typography>

          {errorText && (
            <Typography
              variant="body2"
              color="error"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              {errorText}
            </Typography>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              id="input-board"
              fullWidth
              label="Education Board"
              placeholder="e.g. CBSE, ICSE, IB, STATE BOARD"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              required
              variant="outlined"
              size="medium"
              autoFocus
            />

            <TextField
              id="input-standard"
              fullWidth
              label="Class Standard"
              placeholder="e.g. XII, XI, X, IX"
              value={classStandard}
              onChange={(e) => setClassStandard(e.target.value)}
              required
              variant="outlined"
              size="medium"
            />

            <TextField
              id="input-section"
              fullWidth
              label="Section / Stream"
              placeholder="e.g. PCB3, PCM1, A, B, COM"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              variant="outlined"
              size="medium"
            />
          </Box>

          {board && classStandard && section && (
            <Paper
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "primary.50",
                border: "1px solid",
                borderColor: "primary.200",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
              >
                CLASSROOM NAME PREVIEW:
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "primary.dark",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {board.trim().toUpperCase()}{" "}
                {classStandard.trim().toUpperCase()}{" "}
                {section.trim().toUpperCase()}
                <ArrowForward fontSize="small" />
              </Typography>
            </Paper>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            id="btn-dialog-submit"
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            {submitting ? <CircularProgress size={24} /> : "Save Class"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

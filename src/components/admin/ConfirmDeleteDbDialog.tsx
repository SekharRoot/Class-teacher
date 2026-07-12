import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

interface ConfirmDeleteDbDialogProps {
  open: boolean;
  onClose: () => void;
  dbDeleteStep: number;
  setDbDeleteStep: (step: number) => void;
  dbDeleteLoading: boolean;
  dbSelectedSchoolName: string;
  step2Checkboxes: {
    students: boolean;
    users: boolean;
    leaves: boolean;
    attendance: boolean;
  };
  setStep2Checkboxes: React.Dispatch<
    React.SetStateAction<{
      students: boolean;
      users: boolean;
      leaves: boolean;
      attendance: boolean;
    }>
  >;
  step3Text: string;
  setStep3Text: (text: string) => void;
  step4Select: string;
  setStep4Select: (val: string) => void;
  onConfirmPurge: () => void;
}

export const ConfirmDeleteDbDialog: React.FC<ConfirmDeleteDbDialogProps> = ({
  open,
  onClose,
  dbDeleteStep,
  setDbDeleteStep,
  dbDeleteLoading,
  dbSelectedSchoolName,
  step2Checkboxes,
  setStep2Checkboxes,
  step3Text,
  setStep3Text,
  step4Select,
  setStep4Select,
  onConfirmPurge,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "error.main",
        }}
      >
        <WarningIcon /> School Database Deletion: Confirmation {dbDeleteStep}/5
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        {dbDeleteStep === 1 && (
          <Box>
            <Alert severity="error" sx={{ mb: 3, fontWeight: "bold" }}>
              CRITICAL WARNING: THIS ACTION IS COMPLETELY IRREVERSIBLE!
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You are about to permanently purge the entire database records for
              school <strong>"{dbSelectedSchoolName}"</strong>.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will delete all students, classes associations, attendance
              tracking documents, and local profiles assigned to this school. This
              cannot be undone.
            </Typography>
          </Box>
        )}

        {dbDeleteStep === 2 && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              Step 2: Acknowledge individual data modules to delete
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please select and acknowledge each data table that will be cleared:
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step2Checkboxes.students}
                    onChange={(e) =>
                      setStep2Checkboxes((p) => ({
                        ...p,
                        students: e.target.checked,
                      }))
                    }
                  />
                }
                label="I understand that all Student Boarder registrations will be wiped."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step2Checkboxes.users}
                    onChange={(e) =>
                      setStep2Checkboxes((p) => ({
                        ...p,
                        users: e.target.checked,
                      }))
                    }
                  />
                }
                label="I understand that all Coordinator & Teacher profiles will be cleared."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step2Checkboxes.leaves}
                    onChange={(e) =>
                      setStep2Checkboxes((p) => ({
                        ...p,
                        leaves: e.target.checked,
                      }))
                    }
                  />
                }
                label="I understand that all historical Leave logs will be deleted."
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={step2Checkboxes.attendance}
                    onChange={(e) =>
                      setStep2Checkboxes((p) => ({
                        ...p,
                        attendance: e.target.checked,
                      }))
                    }
                  />
                }
                label="I understand that all Daily Attendance Sheet values will be purged."
              />
            </Box>
          </Box>
        )}

        {dbDeleteStep === 3 && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              Step 3: Verification Typing Check
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              To proceed, type the school's exact name{" "}
              <strong>"{dbSelectedSchoolName}"</strong> in the field below:
            </Typography>
            <TextField
              fullWidth
              label="Confirm School Name"
              value={step3Text}
              onChange={(e) => setStep3Text(e.target.value)}
              placeholder={dbSelectedSchoolName}
              autoFocus
            />
          </Box>
        )}

        {dbDeleteStep === 4 && (
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 2 }}>
              Step 4: Role Verification check
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please confirm your authorization role to execute database drop:
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="delete-role-verification-label">
                Select Active Role
              </InputLabel>
              <Select
                labelId="delete-role-verification-label"
                label="Select Active Role"
                value={step4Select}
                onChange={(e) => setStep4Select(e.target.value)}
              >
                <MenuItem value="unauthorized">
                  School Admin (Unauthorized)
                </MenuItem>
                <MenuItem value="authorized_owner">
                  Platform Owner (Authorized)
                </MenuItem>
                <MenuItem value="authorized_admin">
                  Platform Admin (Authorized)
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {dbDeleteStep === 5 && (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography
              variant="h6"
              color="error"
              sx={{ fontWeight: "bold", mb: 2 }}
            >
              FINAL WARNING!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You are about to click the final delete button. All records for{" "}
              <strong>"{dbSelectedSchoolName}"</strong> will be wiped from
              Firestore.
            </Typography>
            <Alert severity="warning" sx={{ mb: 2, textAlign: "left" }}>
              Ensure you have exported a backup file first if there is any chance
              you will need this data back.
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={dbDeleteLoading} sx={{ textTransform: "none", fontWeight: "bold" }}>
          Cancel Deletion
        </Button>

        {dbDeleteStep === 1 && (
          <Button
            variant="contained"
            color="error"
            onClick={() => setDbDeleteStep(2)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Understand & Proceed
          </Button>
        )}

        {dbDeleteStep === 2 && (
          <Button
            variant="contained"
            color="error"
            disabled={
              !step2Checkboxes.students ||
              !step2Checkboxes.users ||
              !step2Checkboxes.leaves ||
              !step2Checkboxes.attendance
            }
            onClick={() => setDbDeleteStep(3)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Proceed to Step 3
          </Button>
        )}

        {dbDeleteStep === 3 && (
          <Button
            variant="contained"
            color="error"
            disabled={step3Text !== dbSelectedSchoolName}
            onClick={() => setDbDeleteStep(4)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Proceed to Step 4
          </Button>
        )}

        {dbDeleteStep === 4 && (
          <Button
            variant="contained"
            color="error"
            disabled={
              step4Select !== "authorized_owner" &&
              step4Select !== "authorized_admin"
            }
            onClick={() => setDbDeleteStep(5)}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Proceed to Step 5
          </Button>
        )}

        {dbDeleteStep === 5 && (
          <Button
            variant="contained"
            color="error"
            onClick={onConfirmPurge}
            disabled={dbDeleteLoading}
            sx={{ textTransform: "none", fontWeight: "bold", px: 4 }}
          >
            {dbDeleteLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "PERMANENTLY ERASE EVERYTHING"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

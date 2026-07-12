import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Business } from "@mui/icons-material";
import { School } from "../../types";

interface TransferUserSchoolDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (targetSchoolId: string, targetSchoolName: string) => void;
  schools: School[];
  userName: string;
}

export const TransferUserSchoolDialog: React.FC<TransferUserSchoolDialogProps> = ({
  open,
  onClose,
  onTransfer,
  schools,
  userName,
}) => {
  const [targetSchoolId, setTargetSchoolId] = useState("");

  const handleConfirm = () => {
    if (targetSchoolId) {
      const selectedSchool = schools.find((s) => s.id === targetSchoolId);
      const schoolName = selectedSchool ? selectedSchool.name : "Default School";
      onTransfer(targetSchoolId, schoolName);
      setTargetSchoolId("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      id="transfer-user-school-dialog"
      maxWidth="xs"
      fullWidth
      sx={{ borderRadius: 3 }}
    >
      <DialogTitle
        id="transfer-user-school-dialog-title"
        sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Business color="primary" />
        Transfer Role / User to School
      </DialogTitle>
      <Divider />
      <DialogContent id="transfer-user-school-dialog-content">
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Transfer user <strong>{userName}</strong> to another school partnership.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="target-school-label">Target School</InputLabel>
            <Select
              labelId="target-school-label"
              id="target-school-select"
              value={targetSchoolId}
              label="Target School"
              onChange={(e) => setTargetSchoolId(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              {schools.filter((school) => school.isActive !== false).map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 2 }}
          >
            Transferring a user to another school will update their authorized scope immediately.
            Only Owners and Administrators can execute this administrative operation.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          id="btn-cancel-transfer-user-school"
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          id="btn-confirm-transfer-user-school"
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!targetSchoolId}
          sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Confirm Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

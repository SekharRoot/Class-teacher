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
import { School } from "../types";

interface TransferClassSchoolDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (targetSchoolId: string) => void;
  schools: School[];
  className: string;
}

export const TransferClassSchoolDialog: React.FC<TransferClassSchoolDialogProps> = ({
  open,
  onClose,
  onTransfer,
  schools,
  className,
}) => {
  const [targetSchoolId, setTargetSchoolId] = useState("");

  const handleConfirm = () => {
    if (targetSchoolId) {
      onTransfer(targetSchoolId);
      setTargetSchoolId("");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      id="transfer-class-school-dialog"
      maxWidth="xs"
      fullWidth
      sx={{ borderRadius: 3 }}
    >
      <DialogTitle
        id="transfer-class-school-dialog-title"
        sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Business color="primary" />
        Transfer Class to School
      </DialogTitle>
      <Divider />
      <DialogContent id="transfer-class-school-dialog-content">
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Transfer class <strong>{className}</strong> to another school.
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
            Transferring this class to another school will automatically move all
            students assigned to this class to the target school as well, keeping
            the classroom's roster and historical calculations intact.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          id="btn-cancel-transfer-class-school"
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          id="btn-confirm-transfer-class-school"
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

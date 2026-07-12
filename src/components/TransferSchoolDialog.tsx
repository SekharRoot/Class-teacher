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

interface TransferSchoolDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (targetSchoolId: string) => void;
  schools: School[];
  selectedCount: number;
}

export const TransferSchoolDialog: React.FC<TransferSchoolDialogProps> = ({
  open,
  onClose,
  onTransfer,
  schools,
  selectedCount,
}) => {
  const [targetSchoolId, setTargetSchoolId] = useState("");

  const handleConfirm = () => {
    if (targetSchoolId) {
      onTransfer(targetSchoolId);
      setTargetSchoolId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} id="transfer-school-dialog" maxWidth="xs" fullWidth sx={{ borderRadius: 3 }}>
      <DialogTitle id="transfer-school-dialog-title" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <Business color="primary" />
        Transfer School
      </DialogTitle>
      <Divider />
      <DialogContent id="transfer-school-dialog-content">
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Transfer / Bulk Assign <strong>{selectedCount}</strong> student{selectedCount !== 1 ? "s" : ""} to another school.
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
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Moving students to another school will update their school association in the database immediately. Only Owner and Super Administrators are authorized to perform this operation.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button id="btn-cancel-transfer-school" onClick={onClose} color="inherit" sx={{ textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          id="btn-confirm-transfer-school"
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

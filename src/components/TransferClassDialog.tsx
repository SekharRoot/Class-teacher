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
import { SwapHoriz } from "@mui/icons-material";
import { ClassItem } from "../types";

interface TransferClassDialogProps {
  open: boolean;
  onClose: () => void;
  onTransfer: (targetClassId: string) => void;
  classes: ClassItem[];
  selectedCount: number;
}

export const TransferClassDialog: React.FC<TransferClassDialogProps> = ({
  open,
  onClose,
  onTransfer,
  classes,
  selectedCount,
}) => {
  const [targetClassId, setTargetClassId] = useState("");

  const handleConfirm = () => {
    if (targetClassId) {
      onTransfer(targetClassId);
      setTargetClassId("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ borderRadius: 3 }}>
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <SwapHoriz color="primary" />
        Transfer Class
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Transfer <strong>{selectedCount}</strong> student{selectedCount !== 1 ? "s" : ""} to another class.
          </Typography>
          
          <FormControl fullWidth>
            <InputLabel id="target-class-label">Target Class</InputLabel>
            <Select
              labelId="target-class-label"
              id="target-class-select"
              value={targetClassId}
              label="Target Class"
              onChange={(e) => setTargetClassId(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.board} {cls.classStandard} - {cls.section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
            Attendance history will be preserved. Today's attendance status will carry forward if already recorded.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={!targetClassId}
          sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
        >
          Confirm Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

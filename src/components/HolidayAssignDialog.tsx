import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  EventBusy as EventBusyIcon,
  Celebration as HolidayIcon,
  Weekend as WeekendIcon,
  EditNote as EditNoteIcon,
  CheckCircleOutlined as WorkingDayIcon,
} from "@mui/icons-material";
import { format, parseISO } from "date-fns";
import { DayReasonType } from "../types";

interface HolidayAssignDialogProps {
  open: boolean;
  onClose: () => void;
  dateString: string;
  className?: string;
  currentReasonType?: DayReasonType;
  currentReason?: string;
  onSave: (reasonType: DayReasonType, reason: string) => Promise<void>;
}

export const HolidayAssignDialog: React.FC<HolidayAssignDialogProps> = ({
  open,
  onClose,
  dateString,
  className,
  currentReasonType = "none",
  currentReason = "",
  onSave,
}) => {
  const [selectedType, setSelectedType] = useState<DayReasonType>(currentReasonType || "none");
  const [customReason, setCustomReason] = useState<string>(currentReason || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedType(currentReasonType || "none");
      setCustomReason(currentReason || "");
      setError(null);
    }
  }, [open, currentReasonType, currentReason]);

  const formattedDate = dateString
    ? format(parseISO(dateString), "EEEE, MMMM do, yyyy")
    : dateString;

  const handleSubmit = async () => {
    let finalReason = "";
    if (selectedType === "holiday") {
      finalReason = customReason.trim() || "Holiday";
    } else if (selectedType === "weekly_off") {
      finalReason = customReason.trim() || "Weekly Off";
    } else if (selectedType === "other") {
      if (!customReason.trim()) {
        setError("Please specify a reason for this holiday/off day.");
        return;
      }
      finalReason = customReason.trim();
    } else {
      finalReason = "";
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(selectedType, finalReason);
      onClose();
    } catch (err: any) {
      console.error("Error saving holiday assignment:", err);
      setError(err?.message || "Failed to update day status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
        <EventBusyIcon color="primary" sx={{ fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} component="div">
            Assign Day Status / Holiday
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formattedDate} {className ? `• ${className}` : ""}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1.5 }}>
          Select Status for this Day:
        </Typography>

        <RadioGroup
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as DayReasonType)}
        >
          {/* Option 1: Holiday */}
          <Box
            onClick={() => setSelectedType("holiday")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              mb: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: selectedType === "holiday" ? "primary.main" : "divider",
              bgcolor: selectedType === "holiday" ? "primary.50" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: "primary.light" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <HolidayIcon color={selectedType === "holiday" ? "primary" : "action"} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: selectedType === "holiday" ? "bold" : "normal" }}>
                  Holiday
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Official public / school holiday or celebration
                </Typography>
              </Box>
            </Box>
            <Radio checked={selectedType === "holiday"} value="holiday" />
          </Box>

          {/* Option 2: Weekly Off */}
          <Box
            onClick={() => setSelectedType("weekly_off")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              mb: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: selectedType === "weekly_off" ? "primary.main" : "divider",
              bgcolor: selectedType === "weekly_off" ? "primary.50" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: "primary.light" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WeekendIcon color={selectedType === "weekly_off" ? "primary" : "action"} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: selectedType === "weekly_off" ? "bold" : "normal" }}>
                  Weekly Off
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Scheduled weekend or weekly break
                </Typography>
              </Box>
            </Box>
            <Radio checked={selectedType === "weekly_off"} value="weekly_off" />
          </Box>

          {/* Option 3: Other */}
          <Box
            onClick={() => setSelectedType("other")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              mb: 1,
              borderRadius: 2,
              border: "1px solid",
              borderColor: selectedType === "other" ? "primary.main" : "divider",
              bgcolor: selectedType === "other" ? "primary.50" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: "primary.light" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <EditNoteIcon color={selectedType === "other" ? "primary" : "action"} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: selectedType === "other" ? "bold" : "normal" }}>
                  Other Reason
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Weather condition, unplanned closure, sports day, or custom event
                </Typography>
              </Box>
            </Box>
            <Radio checked={selectedType === "other"} value="other" />
          </Box>

          {/* Option 4: None / Normal Working Day */}
          <Box
            onClick={() => setSelectedType("none")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: selectedType === "none" ? "success.main" : "divider",
              bgcolor: selectedType === "none" ? "success.50" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              "&:hover": { borderColor: "success.light" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WorkingDayIcon color={selectedType === "none" ? "success" : "action"} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: selectedType === "none" ? "bold" : "normal" }}>
                  None (Regular Working Day)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Revoke holiday and take regular attendance
                </Typography>
              </Box>
            </Box>
            <Radio checked={selectedType === "none"} value="none" color="success" />
          </Box>
        </RadioGroup>

        {/* Text Input for Reason */}
        {selectedType !== "none" && (
          <Box sx={{ mt: 2.5 }}>
            <TextField
              label={
                selectedType === "other"
                  ? "Reason (Required)"
                  : "Reason / Event Name (Optional)"
              }
              fullWidth
              size="small"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder={
                selectedType === "holiday"
                  ? "e.g. Diwali, Independence Day, Christmas"
                  : selectedType === "weekly_off"
                    ? "e.g. Sunday Weekly Off"
                    : "e.g. Heavy Rain Alert, Annual Sports Day"
              }
              helperText={
                selectedType === "other"
                  ? "Specify the reason for not conducting regular classes"
                  : "Provide an optional custom title for this day"
              }
            />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          {selectedType !== "none" ? (
            <Alert severity="warning" sx={{ fontSize: "0.825rem" }}>
              <strong>Notice:</strong> When applied, all students will automatically be marked as <strong>Absent</strong> for this day and immediately updated to the server.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ fontSize: "0.825rem" }}>
              <strong>Notice:</strong> Regular working day. Teachers can take and record normal student attendance.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={selectedType === "none" ? "success" : "primary"}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
        >
          {loading ? "Saving..." : selectedType === "none" ? "Revoke Holiday & Set Working" : "Apply & Save to Server"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

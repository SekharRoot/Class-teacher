import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { ClassItem, Student } from "../../types";

interface LeaveApplyDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  reason: string;
  setReason: (reason: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  authorizedClassIds: string[];
  allClasses: ClassItem[];
  studentsList: Student[];
}

export function LeaveApplyDialog({
  open,
  onClose,
  onSubmit,
  selectedClassId,
  setSelectedClassId,
  selectedStudentId,
  setSelectedStudentId,
  reason,
  setReason,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  authorizedClassIds,
  allClasses,
  studentsList,
}: LeaveApplyDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Submit Leave Application
      </DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Alert severity="info">
              Submitting a leave request will place it in a 'pending' state
              until authorized by a teacher or administrator.
            </Alert>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Class</InputLabel>
                <Select
                  value={selectedClassId}
                  label="Class"
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  {allClasses
                    .filter((c) => authorizedClassIds.includes(c.id))
                    .map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.classStandard} {cls.section}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required disabled={!selectedClassId}>
                <InputLabel>Student</InputLabel>
                <Select
                  value={selectedStudentId}
                  label="Student"
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {studentsList
                    .filter((s) => s.classId === selectedClassId)
                    .map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                label="Reason for Leave"
                multiline
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Briefly describe the reason for absence..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} sx={{ fontWeight: "bold" }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ fontWeight: "bold" }}
            disabled={!selectedClassId || !selectedStudentId || !reason.trim()}
          >
            Submit Application
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

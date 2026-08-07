import React, { useState, useMemo } from "react";
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
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { Build } from "@mui/icons-material";
import { Student, ClassItem } from "../types";
import { studentsApi } from "../api";
import { studentCache } from "../utils/studentCache";

interface MapInvalidClassesDialogProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  classes: ClassItem[];
  onSuccess: (updatedStudents: Student[]) => void;
}

export const MapInvalidClassesDialog: React.FC<MapInvalidClassesDialogProps> = ({
  open,
  onClose,
  students,
  classes,
  onSuccess,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [mappings, setMappings] = useState<Record<string, string>>({});

  // Find all unique invalid classIds
  const invalidClassGroups = useMemo(() => {
    const validClassIds = new Set(classes.map((c) => c.id));
    const groups: Record<string, number> = {};
    
    students.forEach((s) => {
      if (s.classId && !validClassIds.has(s.classId)) {
        groups[s.classId] = (groups[s.classId] || 0) + 1;
      }
    });
    
    return Object.entries(groups).map(([invalidId, count]) => ({
      invalidId,
      count,
    }));
  }, [students, classes]);

  const handleMappingChange = (invalidId: string, validId: string) => {
    setMappings((prev) => ({
      ...prev,
      [invalidId]: validId,
    }));
  };

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      const updates: Promise<void>[] = [];
      const updatedStudents: Student[] = [];

      // Find students that need updating
      for (const student of students) {
        if (student.classId && mappings[student.classId]) {
          const newClassId = mappings[student.classId];
          const updatedStudent = { ...student, classId: newClassId };
          updatedStudents.push(updatedStudent);
          updates.push(studentsApi.update(student.id, { classId: newClassId }));
        }
      }

      await Promise.all(updates);
      await studentCache.setBatch(updatedStudents);
      
      onSuccess(updatedStudents);
      setMappings({});
      onClose();
    } catch (error) {
      console.error("Failed to map invalid classes", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth sx={{ borderRadius: "10px" }}>
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
        <Build color="warning" />
        Map Invalid Class IDs
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Some students have invalid text instead of a proper Class assigned (e.g. from a CSV import). 
            Select the correct class for each invalid text below to fix them in batch.
          </Typography>

          {invalidClassGroups.length === 0 ? (
            <Typography variant="body1" color="success.main" sx={{ mt: 4, textAlign: "center", fontWeight: "bold" }}>
              No invalid class IDs found. All students are correctly assigned!
            </Typography>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {invalidClassGroups.map((group) => (
                <ListItem key={group.invalidId} sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        "{group.invalidId}"
                      </Typography>
                    }
                    secondary={`${group.count} student${group.count !== 1 ? 's' : ''}`}
                    sx={{ flex: 1 }}
                  />
                  <FormControl size="small" sx={{ width: 200 }}>
                    <InputLabel id={`map-label-${group.invalidId}`}>Select Correct Class</InputLabel>
                    <Select
                      labelId={`map-label-${group.invalidId}`}
                      value={mappings[group.invalidId] || ""}
                      label="Select Correct Class"
                      onChange={(e) => handleMappingChange(group.invalidId, e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Ignore</em>
                      </MenuItem>
                      {classes.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.board} {cls.classStandard} {cls.section}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={isUpdating} color="inherit" sx={{ textTransform: "none", borderRadius: "10px" }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={isUpdating || Object.keys(mappings).length === 0 || Object.values(mappings).every(v => !v)}
          sx={{ textTransform: "none", borderRadius: "10px", px: 3 }}
        >
          {isUpdating ? <CircularProgress size={24} color="inherit" /> : "Apply Fixes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

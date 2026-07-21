import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { studentsApi } from "../../api";
import { useData } from "../../contexts/DataContext";
import { Student } from "../../types";
import { resolveStudentImage } from "../../utils/imageCache";

const TestingStudentAvatar = ({ student }: { student: Student }) => {
  const [displayImage, setDisplayImage] = useState("");
  useEffect(() => {
    resolveStudentImage(student).then(setDisplayImage);
  }, [student]);

  return (
    <Avatar
      src={displayImage}
      sx={{ width: 28, height: 28, mr: 1.5, bgcolor: "primary.light", fontSize: "0.875rem" }}
    >
      {student.firstName.charAt(0)}
    </Avatar>
  );
};

interface BulkStudentTransferCardProps {
  showToast: (msg: string, sev: "success" | "error" | "warning" | "info") => void;
}

export function BulkStudentTransferCard({ showToast }: BulkStudentTransferCardProps) {
  const { classes: classesList, students: studentsList, handleForceSync } = useData();
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);

  const sourceStudents = studentsList.filter((st) => st.classId === sourceClassId);

  const handleSourceClassChange = (classId: string) => {
    setSourceClassId(classId);
    setSelectedStudentIds([]);
    setTargetClassId("");
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds((prev) => [...prev, studentId]);
    } else {
      setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const handleSelectAllStudents = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(sourceStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleBulkTransfer = async () => {
    if (!sourceClassId || !targetClassId || selectedStudentIds.length === 0) {
      showToast("Please select source class, target class, and at least one student.", "error");
      return;
    }

    setIsTransferring(true);
    try {
      await studentsApi.transferStudents(selectedStudentIds, targetClassId);
      await handleForceSync();
      showToast(`Successfully transferred ${selectedStudentIds.length} students!`, "success");
      setSelectedStudentIds([]);
      setTargetClassId("");
    } catch (error) {
      console.error("Transfer error", error);
      showToast("Failed to transfer students.", "error");
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <SwapHoriz color="primary" sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Bulk Student Transfer
        </Typography>
      </Box>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Transfer multiple student profiles from one class registry to another in bulk. Select the origin and destination classes below to begin.
      </Typography>

      <Stack spacing={3}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="source-class-label">Source Class (Origin)</InputLabel>
            <Select
              labelId="source-class-label"
              id="source-class-select"
              value={sourceClassId}
              label="Source Class (Origin)"
              onChange={(e) => handleSourceClassChange(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>None Selected</em>
              </MenuItem>
              {classesList.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.board} {cls.classStandard} - {cls.section}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" disabled={!sourceClassId}>
            <InputLabel id="target-class-label">Target Class (Destination)</InputLabel>
            <Select
              labelId="target-class-label"
              id="target-class-select"
              value={targetClassId}
              label="Target Class (Destination)"
              onChange={(e) => setTargetClassId(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">
                <em>None Selected</em>
              </MenuItem>
              {classesList
                .filter((cls) => cls.id !== sourceClassId)
                .map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.board} {cls.classStandard} - {cls.section}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {sourceClassId && (
          <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2, bgcolor: "background.paper" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1, flexWrap: "wrap", gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Select Students to Transfer
              </Typography>
              {sourceStudents.length > 0 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < sourceStudents.length}
                      checked={selectedStudentIds.length > 0 && selectedStudentIds.length === sourceStudents.length}
                      onChange={(e) => handleSelectAllStudents(e.target.checked)}
                    />
                  }
                  label={`Select All (${selectedStudentIds.length}/${sourceStudents.length})`}
                  sx={{ mr: 0, "& .MuiFormControlLabel-label": { fontSize: "0.825rem", fontWeight: "medium" } }}
                />
              )}
            </Box>
            <Divider />

            {sourceStudents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                No students registered in this class.
              </Typography>
            ) : (
              <List sx={{ maxHeight: 240, overflow: "auto", py: 0, mt: 1 }}>
                {sourceStudents.map((st) => {
                  const isSelected = selectedStudentIds.includes(st.id);
                  const fullName = `${st.firstName} ${st.lastName}`;
                  return (
                    <ListItem
                      key={st.id}
                      dense
                      onClick={() => handleSelectStudent(st.id, !isSelected)}
                      sx={{ borderRadius: 1.5, mb: 0.5, cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          tabIndex={-1}
                          disableRipple
                          size="small"
                        />
                      </ListItemIcon>
                      <TestingStudentAvatar student={st} />
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                            {fullName}
                          </Typography>
                        }
                        secondary={
                          st.rollNumber ? (
                            <Typography variant="caption" color="text.secondary">
                              Roll: {st.rollNumber}
                            </Typography>
                          ) : undefined
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        )}

        {sourceClassId && selectedStudentIds.length > 0 && targetClassId && (
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isTransferring ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <SwapHoriz />
              )
            }
            onClick={handleBulkTransfer}
            disabled={isTransferring}
            size="large"
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            {isTransferring
              ? "Transferring Students..."
              : `Transfer ${selectedStudentIds.length} Student${selectedStudentIds.length > 1 ? "s" : ""}`}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}

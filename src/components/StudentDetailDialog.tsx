import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { School, Phone } from "@mui/icons-material";
import { Student, ClassItem } from "../types";
import { StudentDetailHeader } from "./student/StudentDetailHeader";

interface StudentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  classes: ClassItem[];
}

export const StudentDetailDialog: React.FC<StudentDetailDialogProps> = ({
  open,
  onClose,
  student,
  classes,
}) => {
  if (!student) return null;

  const getClassNameFromId = (classId?: string) => {
    if (!classId) return "No Class Assigned";
    const foundClass = classes.find((c) => c.id === classId);
    return foundClass
      ? `${foundClass.board} ${foundClass.classStandard} ${foundClass.section}`
      : "No Class Assigned";
  };

  const className = getClassNameFromId(student.classId);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, overflow: "hidden" },
        },
      }}
    >
      <Box>
        <StudentDetailHeader student={student} onClose={onClose} />

        {/* List details */}
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
              >
                ASSIGNED CLASS STANDARD
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <School color="action" fontSize="small" /> {className}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                >
                  GENDER
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "500" }}>
                  {student.gender || "Not specified"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
                >
                  BOARDER TYPE
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "500" }}>
                  {student.boarderType || "Day Scholar"}
                </Typography>
              </Box>
            </Box>

            <Divider />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: "bold", display: "block", mb: 0.5 }}
              >
                GUARDIAN CONTACT INFO
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Phone color="action" fontSize="small" />{" "}
                {student.phoneNumber || "No contact provided"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ pl: 3 }}>
                Father: <strong>{student.fatherName || "Not recorded"}</strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ pl: 3, mt: 0.5 }}
              >
                Mother: <strong>{student.motherName || "Not recorded"}</strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
          <Button
            onClick={onClose}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Close Profile
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

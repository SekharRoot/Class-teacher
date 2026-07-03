import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import { Close, School, Phone } from "@mui/icons-material";
import { Student, ClassItem } from "../types";
import { fetchAndCacheImage } from "../utils/imageCache";

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
  const [displayImage, setDisplayImage] = useState<string>("");

  useEffect(() => {
    if (student?.image) {
      if (student.image.startsWith("http")) {
        fetchAndCacheImage(student.image).then(setDisplayImage);
      } else {
        setDisplayImage(student.image);
      }
    } else {
      setDisplayImage("");
    }
  }, [student]);

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
        {/* Header with Background Accent */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            p: 3,
            pt: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            boxShadow: "inset 0 -15px 30px rgba(0,0,0,0.05)",
          }}
        >
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "primary.contrastText",
            }}
          >
            <Close />
          </IconButton>

          {displayImage ? (
            <Avatar
              variant="rounded"
              src={displayImage}
              sx={{
                width: 90,
                height: 90,
                borderRadius: "2px",
                border: "3px solid white",
                boxShadow: 3,
                mb: 1.5,
              }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: 90,
                height: 90,
                borderRadius: "2px",
                bgcolor: "primary.light",
                color: "primary.contrastText",
                fontSize: "2rem",
                fontWeight: "bold",
                border: "3px solid white",
                boxShadow: 3,
                mb: 1.5,
              }}
            >
              {student.firstName[0] || ""}
              {student.lastName ? student.lastName[0] : ""}
            </Avatar>
          )}

          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          >
            {student.firstName} {student.lastName}
          </Typography>
          <Typography
            variant="body2"
            sx={{ opacity: 0.9, fontFamily: "monospace" }}
          >
            Roll ID: {student.rollNumber}{" "}
            {student.profileId ? ` | Profile ID: ${student.profileId}` : ""}
          </Typography>
        </Box>

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

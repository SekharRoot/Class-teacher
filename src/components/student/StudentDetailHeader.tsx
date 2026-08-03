import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Avatar, Tooltip } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Student } from "../../types";
import { resolveStudentImage } from "../../utils/imageCache";
import { ImagePreviewDialog } from "../common/ImagePreviewDialog";

interface StudentDetailHeaderProps {
  student: Student;
  onClose: () => void;
}

export const StudentDetailHeader: React.FC<StudentDetailHeaderProps> = ({
  student,
  onClose,
}) => {
  const [displayImage, setDisplayImage] = useState<string>("");
  const [imagePreviewOpen, setImagePreviewOpen] = useState<boolean>(false);

  useEffect(() => {
    resolveStudentImage(student).then(setDisplayImage);
  }, [student]);

  return (
    <>
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
          <Tooltip title="Click to enlarge photo" arrow>
            <Avatar
              variant="rounded"
              src={displayImage}
              onClick={() => setImagePreviewOpen(true)}
              sx={{
                width: 90,
                height: 90,
                borderRadius: "2px",
                border: "3px solid white",
                boxShadow: 3,
                mb: 1.5,
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </Tooltip>
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
          {student.firstName ? student.firstName[0] : ""}
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

    <ImagePreviewDialog
      open={imagePreviewOpen}
      imageUrl={displayImage}
      title={`${student.firstName} ${student.lastName}`}
      subtitle={`Roll ID: ${student.rollNumber}${student.profileId ? ` | Profile ID: ${student.profileId}` : ""}`}
      onClose={() => setImagePreviewOpen(false)}
    />
  </>
  );
};

import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
} from "@mui/material";
import { PhotoCamera, Upload } from "@mui/icons-material";

interface PhotoCaptureSectionProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  studentName: string;
  showCamera: boolean;
  startCamera: () => void;
  stopCameraStream: () => void;
  capturePhoto: () => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  videoRef: React.RefObject<HTMLVideoElement>;
  cameraError: string | null;
}

export const PhotoCaptureSection: React.FC<PhotoCaptureSectionProps> = ({
  imageUrl,
  setImageUrl,
  studentName,
  showCamera,
  startCamera,
  stopCameraStream,
  capturePhoto,
  handleImageUpload,
  videoRef,
  cameraError,
}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          gap: 3,
          justifyContent: "center",
        }}
      >
        <Box sx={{ position: "relative" }}>
          {imageUrl ? (
            <Avatar
              variant="rounded"
              src={imageUrl}
              sx={{
                width: 120,
                height: 120,
                border: "3px solid",
                borderColor: "primary.main",
                borderRadius: "2px",
                boxShadow: 2,
              }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={{
                width: 120,
                height: 120,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                fontSize: "2.5rem",
                fontWeight: "bold",
                borderRadius: "2px",
                boxShadow: 1,
              }}
            >
              {studentName ? studentName.trim()[0].toUpperCase() : "?"}
            </Avatar>
          )}
          {imageUrl && (
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => setImageUrl("")}
              sx={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                borderRadius: 4,
                textTransform: "none",
                px: 1,
                minWidth: "fit-content",
                height: 20,
                fontSize: "0.65rem",
              }}
            >
              Clear Photo
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            Capture snapshot via web camera or upload custom student photo
            file.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              justifyContent: { xs: "center", sm: "flex-start" },
              flexWrap: "wrap",
            }}
          >
            <Button
              id="btn-trigger-camera"
              variant="outlined"
              color="primary"
              startIcon={<PhotoCamera />}
              onClick={showCamera ? capturePhoto : startCamera}
              sx={{ textTransform: "none", borderRadius: 2 }}
              size="small"
            >
              {showCamera ? "Capture Frame" : "Use Camera"}
            </Button>
            <Button
              component="label"
              variant="outlined"
              color="secondary"
              startIcon={<Upload />}
              sx={{ textTransform: "none", borderRadius: 2 }}
              size="small"
            >
              Upload File
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
            </Button>
            {showCamera && (
              <Button
                variant="text"
                color="inherit"
                onClick={stopCameraStream}
                sx={{ textTransform: "none" }}
                size="small"
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {showCamera && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            bgcolor: "#000",
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            width: "100%",
            maxWidth: 320,
            mx: "auto",
            boxShadow: 3,
          }}
        >
          {cameraError ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography color="error" variant="body2">
                {cameraError}
              </Typography>
            </Box>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
              }}
            />
          )}
        </Box>
      )}
    </>
  );
};

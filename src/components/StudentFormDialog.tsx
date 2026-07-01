import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  CircularProgress,
} from "@mui/material";
import { Close, PhotoCamera, Upload } from "@mui/icons-material";
import { Student, ClassItem } from "../types";

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  classes: ClassItem[];
  editingStudent: Student | null;
  onSaveProfile: (profileData: {
    studentName: string;
    rollNumber: string;
    profileId?: string;
    classId: string;
    gender: "Male" | "Female" | "Transgender";
    fatherName: string;
    motherName: string;
    phoneNumber: string;
    boarderType: "Day Boarder" | "Day Scholar" | "Full Boarder";
    imageUrl: string;
  }) => Promise<boolean>;
  showToast: (
    msg: string,
    severity?: "success" | "error" | "warning" | "info",
  ) => void;
}

export const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
  open,
  onClose,
  classes,
  editingStudent,
  onSaveProfile,
  showToast,
}) => {
  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [profileId, setProfileId] = useState("");
  const [classId, setClassId] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Transgender">(
    "Male",
  );
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [boarderType, setBoarderType] = useState<
    "Day Boarder" | "Day Scholar" | "Full Boarder"
  >("Day Scholar");
  const [imageUrl, setImageUrl] = useState<string>(""); // base64 representation
  const [submitting, setSubmitting] = useState(false);

  // Camera capture state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (open) {
      if (editingStudent) {
        setStudentName(
          `${editingStudent.firstName} ${editingStudent.lastName === "." ? "" : editingStudent.lastName}`.trim(),
        );
        setRollNumber(editingStudent.rollNumber);
        setProfileId(editingStudent.profileId || "");
        setClassId(editingStudent.classId || "");
        setGender((editingStudent.gender as any) || "Male");
        setFatherName(editingStudent.fatherName || "");
        setMotherName(editingStudent.motherName || "");
        setPhoneNumber(editingStudent.phoneNumber || "");
        setBoarderType((editingStudent.boarderType as any) || "Day Scholar");
        setImageUrl(editingStudent.image || "");
      } else {
        setStudentName("");
        setRollNumber("");
        setProfileId("");
        setClassId("");
        setGender("Male");
        setFatherName("");
        setMotherName("");
        setPhoneNumber("");
        setBoarderType("Day Scholar");
        setImageUrl("");
      }
      setShowCamera(false);
      setCameraError(null);
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [open, editingStudent]);

  // Camera capture controls
  const startCamera = async () => {
    setCameraError(null);
    setShowCamera(true);
    try {
      if (mediaStreamRef.current) {
        stopCameraStream();
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "environment" },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError(
        "Unable to access camera. Check permissions or upload an image.",
      );
      setShowCamera(false);
    }
  };

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 250;
        canvas.height = 250;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const video = videoRef.current;
          const minDim = Math.min(video.videoWidth, video.videoHeight);
          const sx = (video.videoWidth - minDim) / 2;
          const sy = (video.videoHeight - minDim) / 2;
          ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 250, 250);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setImageUrl(dataUrl);
          showToast("Photo captured successfully!", "success");
          stopCameraStream();
        }
      } catch (err) {
        console.error("Capture failed:", err);
        showToast("Failed to process captured frame.", "error");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800 * 1024) {
        showToast(
          "Image is too large. Please select an image under 800 KB.",
          "error",
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 250;
          canvas.height = 250;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 250, 250);
            const compressed = canvas.toDataURL("image/jpeg", 0.8);
            setImageUrl(compressed);
            showToast("Photo uploaded successfully!", "success");
          }
        };
        img.src = resultUrl;
      };
      reader.onerror = () => {
        showToast("Failed to read selected file.", "error");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !rollNumber.trim() || !classId) {
      showToast(
        "Student Name, Roll Number, and Class Selection are required.",
        "error",
      );
      return;
    }

    try {
      setSubmitting(true);
      const success = await onSaveProfile({
        studentName,
        rollNumber,
        profileId: profileId.trim() || undefined,
        classId,
        gender,
        fatherName,
        motherName,
        phoneNumber,
        boarderType,
        imageUrl,
      });
      if (success) {
        onClose();
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      showToast("Error processing request.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, p: 1 },
        },
      }}
    >
      <form onSubmit={handleLocalSubmit}>
        <DialogTitle
          sx={{
            fontWeight: "bold",
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {editingStudent ? "Edit Student Profile" : "Add New Student Profile"}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* PHOTO CAPTURE & AVATAR BOX */}
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

            {/* LIVE CAMERA ELEMENT */}
            {showCamera && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 1.5,
                  bgcolor: "grey.900",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <video
                  ref={videoRef}
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                    height: "auto",
                    borderRadius: 8,
                    transform: "scaleX(-1)",
                  }}
                  muted
                  playsInline
                />
                <Typography
                  variant="caption"
                  sx={{ color: "grey.400", mt: 1, display: "block" }}
                >
                  Point camera at student face and click "Capture Frame" above
                </Typography>
              </Box>
            )}

            {cameraError && (
              <Typography
                variant="caption"
                color="error"
                sx={{
                  textAlign: "center",
                  display: "block",
                  fontWeight: "bold",
                }}
              >
                {cameraError}
              </Typography>
            )}

            <Divider />

            {/* GENERAL FORM FIELDS */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2.5,
              }}
            >
              <TextField
                id="input-student-name"
                label="Full Name (First and Last Name)"
                placeholder="e.g. Alice Smith"
                required
                fullWidth
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                variant="outlined"
              />

              <TextField
                id="input-roll-number"
                label="Roll Number / Class ID"
                placeholder="e.g. ROLL-04"
                required
                fullWidth
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                variant="outlined"
              />

              <TextField
                id="input-profile-id"
                label="Profile Integration ID (Optional)"
                placeholder="Leave blank to auto-generate"
                helperText="A unique ID will be automatically assigned if left blank."
                fullWidth
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                variant="outlined"
              />

              <FormControl required fullWidth>
                <InputLabel id="select-class-label">
                  Assigned Class Config
                </InputLabel>
                <Select
                  labelId="select-class-label"
                  id="select-class"
                  value={classId}
                  label="Assigned Class Config"
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <MenuItem value="">
                    <em>-- Select Classroom --</em>
                  </MenuItem>
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.board} {cls.classStandard} {cls.section} (ID:{" "}
                      {cls.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="select-boarder-label">
                  Boarding / Housing Type
                </InputLabel>
                <Select
                  labelId="select-boarder-label"
                  id="select-boarder"
                  value={boarderType}
                  label="Boarding / Housing Type"
                  onChange={(e) => setBoarderType(e.target.value as any)}
                >
                  <MenuItem value="Day Scholar">Day Scholar</MenuItem>
                  <MenuItem value="Day Boarder">Day Boarder</MenuItem>
                  <MenuItem value="Full Boarder">Full Boarder</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* RADIOS */}
            <FormControl component="fieldset">
              <FormLabel
                component="legend"
                sx={{ fontWeight: "bold", mb: 0.5, fontSize: "0.9rem" }}
              >
                Gender
              </FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio size="small" />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio size="small" />}
                  label="Female"
                />
                <FormControlLabel
                  value="Transgender"
                  control={<Radio size="small" />}
                  label="Transgender"
                />
              </RadioGroup>
            </FormControl>

            <Divider />

            {/* GUARDIAN & FAMILY INFO */}
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", color: "primary.main", mb: -1.5 }}
            >
              Guardian & Contact Details
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2.5,
              }}
            >
              <TextField
                id="input-father-name"
                label="Father's Name / Primary Guardian"
                placeholder="e.g. John Smith"
                fullWidth
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                variant="outlined"
              />

              <TextField
                id="input-mother-name"
                label="Mother's Name / Secondary Guardian"
                placeholder="e.g. Sarah Smith"
                fullWidth
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                variant="outlined"
              />

              <TextField
                id="input-phone"
                label="Contact Mobile Phone Number"
                placeholder="e.g. +1 (555) 019-2834"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                variant="outlined"
                slotProps={{
                  htmlInput: { type: "tel" },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            id="btn-dialog-profile-submit"
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            {submitting ? (
              <CircularProgress size={24} />
            ) : editingStudent ? (
              "Update Profile"
            ) : (
              "Save Profile"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

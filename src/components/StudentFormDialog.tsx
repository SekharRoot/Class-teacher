import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Student, ClassItem } from "../types";
import { PhotoCaptureSection } from "./student-form/PhotoCaptureSection";
import { GeneralInfoSection } from "./student-form/GeneralInfoSection";
import { FamilyInfoSection } from "./student-form/FamilyInfoSection";
import { resolveStudentImage } from "../utils/imageCache";

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
  const [imageChanged, setImageChanged] = useState(false);
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
        
        // Asynchronously resolve image if it is stored in RTDB or starts with http
        setImageUrl("");
        setImageChanged(false);
        resolveStudentImage(editingStudent).then((resolvedUrl) => {
          setImageUrl(resolvedUrl || "");
        });
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
        setImageChanged(false);
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
          setImageChanged(true);
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
            setImageChanged(true);
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

  const handleSetImageUrl = (url: string) => {
    setImageUrl(url);
    setImageChanged(true);
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
        imageUrl: imageChanged ? imageUrl : (editingStudent?.image || ""),
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
          sx: { borderRadius: "10px", p: 1 },
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
            <PhotoCaptureSection 
              imageUrl={imageUrl} 
              setImageUrl={handleSetImageUrl} 
              studentName={studentName} 
              showCamera={showCamera} 
              startCamera={startCamera} 
              stopCameraStream={stopCameraStream} 
              capturePhoto={capturePhoto} 
              handleImageUpload={handleImageUpload} 
              videoRef={videoRef} 
              cameraError={cameraError} 
            />
            
            <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.04)" }} />
            
            <GeneralInfoSection 
              studentName={studentName} setStudentName={setStudentName}
              rollNumber={rollNumber} setRollNumber={setRollNumber}
              profileId={profileId} setProfileId={setProfileId}
              classId={classId} setClassId={setClassId}
              boarderType={boarderType} setBoarderType={setBoarderType}
              gender={gender} setGender={setGender}
              classes={classes}
            />

            <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.04)" }} />

            <FamilyInfoSection 
              fatherName={fatherName} setFatherName={setFatherName}
              motherName={motherName} setMotherName={setMotherName}
              phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button
            onClick={onClose}
            color="inherit"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Cancel
          </Button>
          <Button
            id="btn-dialog-profile-submit"
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
            sx={{ textTransform: "none", borderRadius: "10px", px: 3 }}
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

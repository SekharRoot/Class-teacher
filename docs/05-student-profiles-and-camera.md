# Student Profiles and Camera Capture Guide
## Interactive Forms, HTML5 Camera Streaming, Canvas Drawing, and Supabase Storage

A core capability of this application is profiling student records with an integrated webcam snapshot tool. Rather than prompting users to manually select or resize files, this feature allows class teachers to capture high-quality profile photos directly inside the web browser.

In this tutorial, you will build the student profiling layout, construct the interactive editing form, program a custom camera capture element using standard browser APIs, and handle binary uploads to Supabase Storage.

---

## 1. Profiles Grid Dashboard Layout

We organize student profiles into two clear, tabbed views: **Active Profiles** and **Inactive/Archived Profiles** (allowing school admins to archive inactive student accounts instead of permanently deleting critical attendance histories).

```tsx
"use client";

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Student } from "@/types";
import StudentFormDialog from "@/components/profiles/StudentFormDialog";

export default function ProfilesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", py: 2 }}>
      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <h1 className="font-sans font-medium tracking-tight text-2xl text-slate-900">
          Student Profiles
        </h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingStudent(undefined);
            setOpenForm(true);
          }}
          sx={{ py: 1, px: 2 }}
        >
          Add Student
        </Button>
      </Box>

      {/* Tabs & Filters Toolbar */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", gap: 2, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Active Students" />
          <Tab label="Archived / Inactive" />
        </Tabs>

        <TextField
          placeholder="Search by name or roll number..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: "100%", sm: 300 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Profile Render list and Layout Safety Buffer */}
      <Box sx={{ minHeight: "60vh" }}>
        {/* Render child components / grids based on tab index here */}
      </Box>

      {/* Crucial Layout Spacer Guard to avoid overlapping floating navigation bar */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} aria-hidden="true" />

      {/* Editing Dialog Modal */}
      <StudentFormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        student={editingStudent}
      />
    </Box>
  );
}
```

---

## 2. Dynamic Camera Capture Component

To build an in-app webcam capture interface without third-party frameworks, use standard HTML5 `<video>` streaming combined with an offscreen HTML5 `<canvas>` to grab image frames.

Create a component named `src/components/profiles/WebcamCapture.tsx`:

```tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";

interface WebcamCaptureProps {
  onCapture: (imageBlob: Blob, dataUrl: string) => void;
}

export default function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    setError(null);
    setCapturedPreview(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      setError("Unable to access camera. Check app permissions in your browser.");
      console.error("Camera access error:", err);
    }
  };

  // Close stream resources on cleanup
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Capture frame of video and write to offscreen canvas
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext("2d");
    if (context) {
      // Draw standard video frame onto canvas grid
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCapturedPreview(dataUrl);
      
      // Convert canvas to binary blob for file system uploading
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob, dataUrl);
          stopCamera();
        }
      }, "image/jpeg", 0.9);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          aspectRatio: "4/3",
          borderRadius: 2,
          overflow: "hidden",
          border: "2px solid",
          borderColor: "divider",
          backgroundColor: "#000",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {capturedPreview ? (
          <img
            src={capturedPreview}
            alt="Captured profile preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraActive ? "block" : "none" }}
            playsInline
            muted
          />
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {capturedPreview ? (
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={startCamera}>
            Retake Photo
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<CameraAltIcon />}
            onClick={handleCaptureSnapshot}
            disabled={!cameraActive}
          >
            Capture Photo
          </Button>
        )}
      </Box>
    </Box>
  );
}
```

---

## 3. Uploading Profile Snapshots to Supabase Storage

Once a teacher captures a snapshot, we upload the raw binary `Blob` directly to a Supabase Storage bucket named `student-images`. We then save the returned public URL in the student's metadata record.

Create a function inside your Repository module:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Uploads a student image blob to Supabase Storage and returns the public CDN URL.
 * @param studentId The ID of the student the image belongs to
 * @param imageBlob The binary blob file captured from camera or file selector
 */
export async function uploadStudentImage(
  studentId: string,
  imageBlob: Blob
): Promise<string> {
  const filePath = `profiles/${studentId}.jpg`;

  // 1. Upload binary blob to 'student-images' bucket (overwrites existing files)
  const { error: uploadError } = await supabase.storage
    .from("student-images")
    .upload(filePath, imageBlob, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload photo asset: ${uploadError.message}`);
  }

  // 2. Fetch public access CDN URL
  const { data } = supabase.storage
    .from("student-images")
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error("Unable to retrieve public link for uploaded image.");
  }

  return data.publicUrl;
}
```

---

## 4. Architectural Tips for the Learner

1. **Stop Camera Streams:** Notice that the `stopCamera` function explicitly calls `track.stop()` on every media track in the stream. If you omit this step, the webcam indicator light will remain green, indicating that your app is still capturing video in the background.
2. **Compress Images Before Uploading:** The second argument in `canvas.toBlob(blob, "image/jpeg", 0.9)` controls the output quality. Using `0.9` compresses the image to ~50kb-100kb, which is perfect for student profiles and avoids uploading massive 5MB raw webcam files.
3. **Use Storage Upserting:** Setting `upsert: true` on Supabase Storage upload requests automatically overwrites old files with the same name, preventing orphaned files from wasting cloud storage space.

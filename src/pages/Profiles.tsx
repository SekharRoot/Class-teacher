import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  CloudOff,
  FileDownload,
  FileUpload,
  Warning,
} from "@mui/icons-material";
import { studentsApi } from "../api";
import { Student } from "../types";
import { cache } from "../lib/cache";
import { StudentCard } from "../components/StudentCard";
import { StudentDetailDialog } from "../components/StudentDetailDialog";
import { StudentFormDialog } from "../components/StudentFormDialog";
import { StudentDeleteDialog } from "../components/StudentDeleteDialog";
import { ProfileFilters } from "../components/ProfileFilters";
import { useProfilesData } from "../hooks/useProfilesData";
import { useHierarchyScope } from "../hooks/useHierarchyScope";

export default function Profiles() {
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [toastDuration, setToastDuration] = useState<number>(4000);
  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
    duration = 4000,
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastDuration(duration);
  };

  const {
    students,
    setStudents,
    classes,
    loading,
    offlineMode,
    searchQuery,
    setSearchQuery,
    classFilter,
    setClassFilter,
    openDialog,
    setOpenDialog,
    openDetailDialog,
    setOpenDetailDialog,
    selectedStudent,
    setSelectedStudent,
    editingStudent,
    setEditingStudent,
    fetchInitialData,
  } = useProfilesData(showToast);

  // Two-step confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteStep, setDeleteStep] = useState(1);

  const { authorizedClassIds, isReadOnly } = useHierarchyScope();

  const filteredClasses = classes.filter((c) =>
    authorizedClassIds.includes(c.id),
  );

  const handleOpenEditDialog = (student: Student) => {
    setEditingStudent(student);
    setOpenDialog(true);
  };

  const handleOpenDetail = (student: Student) => {
    setSelectedStudent(student);
    setOpenDetailDialog(true);
  };

  const handleSaveProfileAsync = async (formData: any): Promise<boolean> => {
    const nameParts = formData.studentName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || ".";
    const studentId = editingStudent?.id || `std_${Date.now()}`;
    const generatedProfileId =
      formData.profileId?.trim() ||
      `PRFL-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString(16)
        .toUpperCase()}`;

    const savedStudent: Student = {
      id: studentId,
      profileId: generatedProfileId,
      firstName,
      lastName,
      rollNumber: formData.rollNumber.trim().toUpperCase(),
      classId: formData.classId,
      gender: formData.gender,
      fatherName: formData.fatherName.trim(),
      motherName: formData.motherName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      boarderType: formData.boarderType,
      image: formData.imageUrl,
    };

    let updatedList = [...students];
    if (editingStudent) {
      updatedList = updatedList.map((s) =>
        s.id === studentId ? savedStudent : s,
      );
    } else {
      updatedList.push(savedStudent);
    }

    updatedList.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setStudents(updatedList);
    cache.set("offline_students", updatedList);

    if (offlineMode) {
      showToast(
        `Profile for "${formData.studentName}" saved offline!`,
        "success",
        2000,
      );
      setOpenDialog(false);
      setEditingStudent(null);
      return true;
    }

    // Immediately trigger background upload, show toast, close dialog, and return true.
    showToast("Uploaded!", "success", 2000);
    setOpenDialog(false);
    setEditingStudent(null);

    // Perform API call in the background
    studentsApi
      .create(savedStudent)
      .then(() => {
        fetchInitialData();
      })
      .catch((err: any) => {
        console.error("Error saving student profile in background:", err);
        showToast("Saved to offline cache. Synchronization failed.", "warning");
      });

    return true;
  };

  const handleDeleteProfile = async (studentId: string, name: string) => {
    setStudentToDelete({ id: studentId, name });
    setDeleteStep(1);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    const { id: studentId, name } = studentToDelete;
    const originalStudents = [...students];
    setDeleteDialogOpen(false);

    const updatedList = students.filter((s) => s.id !== studentId);
    setStudents(updatedList);
    cache.set("offline_students", updatedList);
    setStudentToDelete(null);

    if (offlineMode) {
      showToast("Profile deleted from offline cache.", "info");
      return;
    }

    // Perform database delete in background
    (async () => {
      try {
        await studentsApi.delete(studentId);
        showToast(`Profile for "${name}" deleted successfully!`, "success");
        fetchInitialData();
      } catch (err) {
        console.error(err);
        showToast("Could not remove from cloud database. Reverting.", "error");
        setStudents(originalStudents);
        fetchInitialData();
      }
    })();
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Roll No,First Name,Last Name,Class ID,Gender,Phone,Boarder Type\n001,John,Doe,class_123,Male,1234567890,Full Boarder";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Student_Profiles_Template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      try {
        // More robust CSV splitting that handles quotes
        const parseCSVLine = (line: string) => {
          const result = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && line[i + 1] === '"') {
              current += '"';
              i++;
            } else if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              result.push(current.trim());
              current = "";
            } else {
              current += char;
            }
          }
          result.push(current.trim());
          return result;
        };

        const rows = text.split(/\r?\n/).filter((row) => row.trim());
        if (rows.length < 2) return;

        let importedCount = 0;
        let newStudents: Student[] = [];

        for (let i = 1; i < rows.length; i++) {
          const values = parseCSVLine(rows[i]);
          if (values.length < 4) continue;

          const rollNumber = values[0];
          const firstName = values[1];
          const lastName = values[2] || ".";
          const classId = values[3];
          const gender = (values[4] || "Male") as any;
          const phoneNumber = values[5] || "";
          const boarderType = (values[6] || "Day Scholar") as any;

          const studentId = `std_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;

          const savedStudent: Student = {
            id: studentId,
            firstName,
            lastName,
            rollNumber,
            classId,
            gender,
            fatherName: "",
            motherName: "",
            phoneNumber,
            boarderType,
            image: "",
          };

          newStudents.push(savedStudent);
        }

        if (newStudents.length > 0) {
          const updatedList = [...students, ...newStudents];
          setStudents(updatedList);
          cache.set("offline_students", updatedList);
          importedCount = newStudents.length;

          showToast(
            `Imported ${importedCount} profiles locally! Syncing with server...`,
            "info",
          );

          if (!offlineMode) {
            (async () => {
              try {
                // Use batch update if possible
                if ((studentsApi as any).batchCreate) {
                  await (studentsApi as any).batchCreate(newStudents);
                } else {
                  // Fallback to seedDemo which is a batch update
                  await studentsApi.seedDemo(newStudents);
                }
                showToast(
                  `Successfully imported ${importedCount} profiles!`,
                  "success",
                );
                fetchInitialData();
              } catch (error: any) {
                console.error("Import sync error", error);
                showToast(
                  "Failed to upload imported profiles to cloud. Saved in local cache.",
                  "warning",
                );
              }
            })();
          }
        }
      } catch (error: any) {
        console.error("Import error", error);
        showToast("Error importing profiles. Check CSV format.", "error");
      }

      // Reset input
      e.target.value = "";
    };

    reader.readAsText(file);
  };

  const [displayCount, setDisplayCount] = useState(12);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    setDisplayCount(12);
  }, [searchQuery, classFilter, students.length]);

  const setLoadMoreRef = React.useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setDisplayCount((prev) => prev + 12);
          }
        },
        { threshold: 0.1 }, // Change threshold to 0.1 so it triggers easier
      );
      observerRef.current.observe(node);
    }
  }, []);

  const filteredStudents = students.filter((s) => {
    // Role-based filtering
    const isClassPermitted =
      s.classId && authorizedClassIds.includes(s.classId);
    if (!isClassPermitted) return false;

    const term = searchQuery.toLowerCase();
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const father = (s.fatherName || "").toLowerCase();
    const mother = (s.motherName || "").toLowerCase();
    const roll = s.rollNumber.toLowerCase();

    const classInfo = classes.find((c) => c.id === s.classId);
    const classString = classInfo
      ? `${classInfo.board} ${classInfo.classStandard} ${classInfo.section}`.toLowerCase()
      : "";

    const matchesSearch =
      fullName.includes(term) ||
      father.includes(term) ||
      mother.includes(term) ||
      roll.includes(term) ||
      classString.includes(term);
    const matchesFilter = classFilter === "ALL" || s.classId === classFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", pb: 6 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            Student Profiles{" "}
            {offlineMode && (
              <Chip
                label="Offline Cache"
                size="small"
                color="warning"
                icon={<CloudOff />}
              />
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage comprehensive student profile sheets, roll cards, and picture
            directories.
          </Typography>
        </Box>
        {!isReadOnly && (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<FileDownload />}
              onClick={handleDownloadTemplate}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Template
            </Button>
            <Button
              variant="outlined"
              color="primary"
              component="label"
              startIcon={<FileUpload />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Import
              <input
                type="file"
                accept=".csv"
                hidden
                onChange={handleImportData}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => {
                setEditingStudent(null);
                setOpenDialog(true);
              }}
              sx={{ textTransform: "none", px: 3, py: 1, borderRadius: 2 }}
            >
              Add Student
            </Button>
          </Box>
        )}
      </Box>

      <ProfileFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        classes={filteredClasses}
      />

      {loading && students.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "30vh",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Synchronizing student records...
          </Typography>
        </Box>
      ) : filteredStudents.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No student profiles found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || classFilter !== "ALL"
              ? "Try adjusting your search query or class standard filter."
              : "Add custom student profiles manually."}
          </Typography>
          {!searchQuery && classFilter === "ALL" && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditingStudent(null);
                setOpenDialog(true);
              }}
              startIcon={<Add />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add First Student Profile
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {filteredStudents.slice(0, displayCount).map((item) => (
              <StudentCard
                key={item.id}
                item={item}
                classes={filteredClasses}
                onViewDetails={handleOpenDetail}
                onEdit={handleOpenEditDialog}
                onDelete={handleDeleteProfile}
                readOnly={isReadOnly}
              />
            ))}
          </Box>
          {displayCount < filteredStudents.length && (
            <Box
              ref={setLoadMoreRef}
              sx={{ display: "flex", justifyContent: "center", p: 4 }}
            >
              <CircularProgress size={30} />
            </Box>
          )}
        </>
      )}

      <StudentFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingStudent(null);
        }}
        classes={filteredClasses}
        editingStudent={editingStudent}
        onSaveProfile={handleSaveProfileAsync}
        showToast={showToast}
      />
      <StudentDetailDialog
        open={openDetailDialog}
        onClose={() => {
          setOpenDetailDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classes={filteredClasses}
      />

      <StudentDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        deleteStep={deleteStep}
        setDeleteStep={setDeleteStep}
        studentToDelete={studentToDelete}
        onConfirm={handleConfirmDeleteStudent}
      />

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={toastDuration}
        onClose={() => setToastMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage("")}
          severity={toastSeverity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

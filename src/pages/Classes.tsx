import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  InputAdornment,
  TextField,
  Chip,
} from "@mui/material";
import {
  Add,
  School,
  CloudOff,
  Search,
  ChevronLeft,
} from "@mui/icons-material";
import { classesApi, studentsApi } from "../api";
import { cache } from "../lib/cache";
import { ClassItem } from "../types";
import { ClassCard } from "../components/ClassCard";
import { ClassFormDialog } from "../components/AddClassDialog";
import { DeleteClassDialog } from "../components/DeleteClassDialog";
import { StudentCard } from "../components/StudentCard";
import { StudentDetailDialog } from "../components/StudentDetailDialog";
import { useClassesData } from "../hooks/useClassesData";
import { useAuth } from "../contexts/AuthContext";
import { useHierarchyScope } from "../hooks/useHierarchyScope";

export default function Classes() {
  const { userProfile } = useAuth();
  const { authorizedClassIds, isReadOnly: hierarchyReadOnly } =
    useHierarchyScope();
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const showToast = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "success",
  ) => {
    setToastMessage(message);
    setToastSeverity(severity);
  };

  const {
    classesList,
    setClassesList,
    studentsList,
    loading,
    offlineMode,
    searchQuery,
    setSearchQuery,
    openDialog,
    setOpenDialog,
    editingClass,
    setEditingClass,
    selectedClass,
    setSelectedClass,
    openDetailDialog,
    setOpenDetailDialog,
    selectedStudent,
    setSelectedStudent,
    classToDelete,
    setClassToDelete,
    fetchClasses,
  } = useClassesData(showToast);

  const handleSaveClassAsync = async (
    oldId: string | null,
    trimmedBoard: string,
    trimmedStandard: string,
    trimmedSection: string,
  ): Promise<boolean> => {
    const classId =
      oldId ||
      `${trimmedBoard}_${trimmedStandard}_${trimmedSection}`.replace(
        /\s+/g,
        "_",
      );
    const classItem: ClassItem = {
      id: classId,
      board: trimmedBoard,
      classStandard: trimmedStandard,
      section: trimmedSection,
      createdAt: new Date().toISOString(),
    };
    const originalClasses = [...classesList];

    const updatedList = oldId
      ? classesList.map((c) => (c.id === oldId ? classItem : c))
      : [...classesList, classItem];

    updatedList.sort((a, b) => {
      const nameA = `${a.board} ${a.classStandard} ${a.section}`;
      const nameB = `${b.board} ${b.classStandard} ${b.section}`;
      return nameA.localeCompare(nameB);
    });

    setClassesList(updatedList);
    cache.set("offline_classes", updatedList);

    if (offlineMode) {
      showToast(
        `Class ${oldId ? "updated" : "created"} successfully in offline cache!`,
        "success",
      );
      return true;
    }

    // Run cloud upload in the background
    (async () => {
      try {
        if (oldId) {
          await classesApi.update(oldId, classItem);
          showToast(
            `Class "${trimmedBoard} ${trimmedStandard} ${trimmedSection}" updated successfully!`,
            "success",
          );
        } else {
          await classesApi.create(classItem);
          showToast(
            `Class "${trimmedBoard} ${trimmedStandard} ${trimmedSection}" created successfully!`,
            "success",
          );
        }
        fetchClasses();
      } catch (err: any) {
        console.error("Error saving class in background:", err);
        showToast(
          "Failed to save class to cloud. Saved in local cache.",
          "warning",
        );
        setClassesList(originalClasses);
      }
    })();

    return true;
  };

  const handleDeleteClassRequest = (classId: string, className: string) => {
    setClassToDelete({ id: classId, name: className });
  };

  const handleConfirmDelete = async (deleteStudents: boolean) => {
    if (!classToDelete) return;
    const { id: classId, name: className } = classToDelete;
    const originalClasses = [...classesList];

    const updatedList = classesList.filter((c) => c.id !== classId);
    setClassesList(updatedList);
    cache.set("offline_classes", updatedList);
    setClassToDelete(null);

    if (offlineMode) {
      showToast(`Class "${className}" deleted offline.`, "info");
      return;
    }

    // Run cloud deletion in the background
    (async () => {
      try {
        if (deleteStudents) {
          const studentsInClass = studentsList.filter(
            (s) => s.classId === classId,
          );
          await Promise.all(
            studentsInClass.map((st) => studentsApi.delete(st.id)),
          );
        } else {
          const studentsInClass = studentsList.filter(
            (s) => s.classId === classId,
          );
          await Promise.all(
            studentsInClass.map((st) =>
              studentsApi.update(st.id, { ...st, classId: "" }),
            ),
          );
        }

        await classesApi.delete(classId);
        showToast(`Class "${className}" deleted successfully!`, "success");
        fetchClasses();
      } catch (err: any) {
        console.error("Error deleting class in background:", err);
        showToast(
          "Failed to delete class from cloud database. Reverting.",
          "error",
        );
        setClassesList(originalClasses);
        fetchClasses();
      }
    })();
  };

  const isReadOnly =
    hierarchyReadOnly ||
    (userProfile?.role !== "owner" &&
      userProfile?.role !== "admin" &&
      userProfile?.role !== "academic_coordinator");

  const filteredClasses = classesList
    .filter((c) => authorizedClassIds.includes(c.id))
    .filter((c) =>
      `${c.board} ${c.classStandard} ${c.section}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );

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
            Classes{" "}
            {offlineMode && (
              <Chip
                label="Offline"
                size="small"
                color="warning"
                icon={<CloudOff />}
              />
            )}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure and manage Class Standards, Education Boards, and
            Sections.
          </Typography>
        </Box>
        {!isReadOnly && (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => {
                setEditingClass(null);
                setOpenDialog(true);
              }}
              sx={{ textTransform: "none", px: 3, py: 1, borderRadius: 2 }}
            >
              Add Class
            </Button>
          </Box>
        )}
      </Box>

      {!selectedClass && (
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search classes by Board, Standard, or Section (e.g. CBSE, XII)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          />
        </Box>
      )}

      {selectedClass ? (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Button
              startIcon={<ChevronLeft />}
              onClick={() => setSelectedClass(null)}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 4, textTransform: "none", mr: 2 }}
            >
              Back to Classes
            </Button>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Students in {selectedClass.board} {selectedClass.classStandard}{" "}
              {selectedClass.section}
            </Typography>
          </Box>
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
            {studentsList.filter((s) => s.classId === selectedClass.id)
              .length === 0 ? (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
              >
                No students are currently assigned to this class.
              </Typography>
            ) : (
              studentsList
                .filter((s) => s.classId === selectedClass.id)
                .map((student) => (
                  <StudentCard
                    key={student.id}
                    item={student}
                    classes={classesList}
                    onViewDetails={(st) => {
                      setSelectedStudent(st);
                      setOpenDetailDialog(true);
                    }}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    readOnly={true}
                  />
                ))
            )}
          </Box>
        </Box>
      ) : loading && classesList.length === 0 ? (
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
            Synchronizing class directory...
          </Typography>
        </Box>
      ) : filteredClasses.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <School sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery
              ? "No classes match your search query."
              : "No Classes Registered Yet"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: "sm", mx: "auto" }}
          >
            {searchQuery
              ? "Try modifying your search keywords or clear the filter."
              : "Create your first classroom configuration. You can also populate dummy values for testing instantly."}
          </Typography>
          {!searchQuery && !isReadOnly && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditingClass(null);
                setOpenDialog(true);
              }}
              startIcon={<Add />}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Configure First Class
            </Button>
          )}
        </Paper>
      ) : (
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
          {filteredClasses.map((item) => (
            <ClassCard
              key={item.id}
              item={item}
              onDelete={handleDeleteClassRequest}
              onEdit={(c) => {
                setEditingClass(c);
                setOpenDialog(true);
              }}
              onClick={(cls) => setSelectedClass(cls)}
              readOnly={isReadOnly}
            />
          ))}
        </Box>
      )}

      <ClassFormDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingClass(null);
        }}
        classesList={classesList}
        editingClass={editingClass}
        onSaveClass={handleSaveClassAsync}
      />
      <DeleteClassDialog
        open={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        className={classToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />
      <StudentDetailDialog
        open={openDetailDialog}
        onClose={() => {
          setOpenDetailDialog(false);
          setSelectedStudent(null);
        }}
        student={selectedStudent}
        classes={classesList}
      />

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={4000}
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

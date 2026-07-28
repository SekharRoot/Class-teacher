import React, { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  Box,
  Divider,
  LinearProgress,
  Chip,
  Alert,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Switch,
} from "@mui/material";
import { Edit, People, CheckCircle, ViewList, Layers, Lock, School, Class as ClassIcon } from "@mui/icons-material";
import { Student, ClassItem } from "../types";
import { studentsApi } from "../api";
import { useAuth } from "../contexts/AuthContext";

export type BatchScopeOption = "selected" | "class" | "school";
export type EditModeOption = "bulk" | "individual";

interface BatchEditDialogProps {
  open: boolean;
  onClose: () => void;
  selectedIds: string[];
  allStudents: Student[];
  classes: ClassItem[];
  currentClassFilter: string;
  onSuccess: (updatedCount: number) => void;
}

export const BatchEditDialog: React.FC<BatchEditDialogProps> = ({
  open,
  onClose,
  selectedIds,
  allStudents,
  classes,
  currentClassFilter,
  onSuccess,
}) => {
  const { userProfile } = useAuth();

  // Determine if user has write access to entire school
  const canEditSchool = useMemo(() => {
    if (!userProfile) return true; // Default allow if context pending
    if (userProfile.email === "sekhar.root@gmail.com") return true;
    const role = userProfile.role;
    return role === "owner" || role === "admin" || role === "school_admin" || role === "principal" || role === "academic_coordinator";
  }, [userProfile]);

  // Accessible classes for the current user based on role & assigned classes
  const accessibleClasses = useMemo(() => {
    if (!userProfile) return classes;
    if (
      userProfile.email === "sekhar.root@gmail.com" ||
      userProfile.role === "owner" ||
      userProfile.role === "admin" ||
      userProfile.role === "school_admin" ||
      userProfile.role === "principal" ||
      userProfile.role === "academic_coordinator"
    ) {
      return classes;
    }

    if (userProfile.role === "class_teacher") {
      const assignedIds = [userProfile.assignedClassId, userProfile.assignedClassId2].filter(Boolean) as string[];
      if (assignedIds.length > 0) {
        const matched = classes.filter((c) => assignedIds.includes(c.id));
        if (matched.length > 0) return matched;
      }
    }

    return classes;
  }, [userProfile, classes]);

  // Target class selected when scope === "class"
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  // Mode state: "bulk" (apply same field to all) or "individual" (table-based individual edit)
  const [editMode, setEditMode] = useState<EditModeOption>("bulk");

  // Default Scope
  const defaultScope: BatchScopeOption = useMemo(() => {
    if (selectedIds.length > 0) return "selected";
    return "class";
  }, [selectedIds]);

  const [scope, setScope] = useState<BatchScopeOption>(defaultScope);

  // Initialize selected class whenever dialog opens or accessible classes change
  useEffect(() => {
    if (open) {
      if (currentClassFilter && currentClassFilter !== "ALL") {
        setSelectedClassId(currentClassFilter);
      } else if (accessibleClasses.length > 0) {
        setSelectedClassId(accessibleClasses[0].id);
      }
      if (!canEditSchool && scope === "school") {
        setScope("class");
      }
    }
  }, [open, currentClassFilter, accessibleClasses, canEditSchool, scope]);

  // Bulk Field toggle state
  const [enableBoarderType, setEnableBoarderType] = useState(false);
  const [boarderType, setBoarderType] = useState<"Day Scholar" | "Day Boarder" | "Full Boarder">("Day Scholar");

  const [enableGender, setEnableGender] = useState(false);
  const [gender, setGender] = useState<"Male" | "Female" | "Transgender">("Male");

  const [enableClassId, setEnableClassId] = useState(false);
  const [targetClassId, setTargetClassId] = useState("");

  const [enableIsActive, setEnableIsActive] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [enableFatherName, setEnableFatherName] = useState(false);
  const [fatherName, setFatherName] = useState("");

  const [enableMotherName, setEnableMotherName] = useState(false);
  const [motherName, setMotherName] = useState("");

  const [enablePhoneNumber, setEnablePhoneNumber] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Individual Student Edits state (Map: studentId -> updated fields)
  const [individualEdits, setIndividualEdits] = useState<Record<string, Partial<Student>>>({});

  // Execution & Progress state
  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState<{ processed: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Compute target students based on scope and selected class
  const targetStudents = useMemo(() => {
    if (scope === "selected") {
      const selectedSet = new Set(selectedIds);
      return allStudents.filter((s) => selectedSet.has(s.id));
    } else if (scope === "class") {
      if (selectedClassId === "UNASSIGNED") {
        return allStudents.filter((s) => !s.classId || s.classId === "");
      } else if (selectedClassId) {
        return allStudents.filter((s) => s.classId === selectedClassId);
      }
      return allStudents;
    } else {
      return allStudents;
    }
  }, [scope, selectedIds, selectedClassId, allStudents]);

  // Student count per class helper
  const studentCountByClass = useMemo(() => {
    const counts = new Map<string, number>();
    allStudents.forEach((s) => {
      const cid = s.classId || "UNASSIGNED";
      counts.set(cid, (counts.get(cid) || 0) + 1);
    });
    return counts;
  }, [allStudents]);

  const hasSelectedBulkFields =
    enableBoarderType ||
    enableGender ||
    enableClassId ||
    enableIsActive ||
    enableFatherName ||
    enableMotherName ||
    enablePhoneNumber;

  const individualEditCount = Object.keys(individualEdits).length;

  const handleIndividualFieldChange = (studentId: string, field: keyof Student, value: any) => {
    setIndividualEdits((prev) => {
      const existing = prev[studentId] || {};
      return {
        ...prev,
        [studentId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleApplyUpdate = async () => {
    if (targetStudents.length === 0) {
      setErrorMsg("No student profiles found for the selected target scope.");
      return;
    }

    let updatePayload: { id: string; data: Partial<Student> }[] = [];

    if (editMode === "bulk") {
      if (!hasSelectedBulkFields) {
        setErrorMsg("Please check at least one field to update in bulk mode.");
        return;
      }
      const patchData: Partial<Student> = {};
      if (enableBoarderType) patchData.boarderType = boarderType;
      if (enableGender) patchData.gender = gender;
      if (enableClassId) patchData.classId = targetClassId;
      if (enableIsActive) patchData.isActive = isActive;
      if (enableFatherName) patchData.fatherName = fatherName;
      if (enableMotherName) patchData.motherName = motherName;
      if (enablePhoneNumber) patchData.phoneNumber = phoneNumber;

      updatePayload = targetStudents.map((s) => ({
        id: s.id,
        data: { ...patchData },
      }));
    } else {
      // Individual mode
      if (individualEditCount === 0) {
        setErrorMsg("No profile fields have been modified in individual mode.");
        return;
      }

      updatePayload = Object.entries(individualEdits).map(([studentId, patchData]) => ({
        id: studentId,
        data: patchData,
      }));
    }

    setErrorMsg(null);
    setIsUpdating(true);
    setProgress({ processed: 0, total: updatePayload.length });

    try {
      await studentsApi.batchUpdateProfiles(updatePayload, (processed, total) => {
        setProgress({ processed, total });
      });

      onSuccess(updatePayload.length);
      handleResetAndClose();
    } catch (err: any) {
      console.error("Batch update error:", err);
      setErrorMsg(err.message || "Failed to update profiles in batch.");
      setIsUpdating(false);
    }
  };

  const handleResetAndClose = () => {
    if (isUpdating) return;
    setIsUpdating(false);
    setProgress(null);
    setErrorMsg(null);
    setEnableBoarderType(false);
    setEnableGender(false);
    setEnableClassId(false);
    setEnableIsActive(false);
    setEnableFatherName(false);
    setEnableMotherName(false);
    setEnablePhoneNumber(false);
    setIndividualEdits({});
    onClose();
  };

  const progressPercentage = progress && progress.total > 0 ? Math.round((progress.processed / progress.total) * 100) : 0;

  return (
    <Dialog
      open={open}
      onClose={handleResetAndClose}
      maxWidth={editMode === "individual" ? "md" : "sm"}
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Edit color="primary" />
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Batch Edit Profiles
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<People fontSize="small" />}
            label={`${targetStudents.length} Students Selected`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 2.5 }}>
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Edit Mode Toggle Switch */}
        <Box sx={{ mb: 2.5, display: "flex", justifyContent: "center" }}>
          <ToggleButtonGroup
            value={editMode}
            exclusive
            onChange={(_, val) => val && setEditMode(val)}
            size="small"
            color="primary"
            disabled={isUpdating}
          >
            <ToggleButton value="bulk" sx={{ px: 2.5, textTransform: "none", fontWeight: 600 }}>
              <Layers sx={{ mr: 1, fontSize: 18 }} />
              Bulk Update Same Fields
            </ToggleButton>
            <ToggleButton value="individual" sx={{ px: 2.5, textTransform: "none", fontWeight: 600 }}>
              <ViewList sx={{ mr: 1, fontSize: 18 }} />
              Individual Profile Grid
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Target Scope & Class Selection */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "action.hover" }}>
          <FormControl component="fieldset" fullWidth disabled={isUpdating}>
            <FormLabel component="legend" sx={{ fontWeight: 700, fontSize: "0.875rem", mb: 1.5, color: "text.primary" }}>
              Target Selection Scope
            </FormLabel>
            
            <RadioGroup
              row
              value={scope}
              onChange={(e) => setScope(e.target.value as BatchScopeOption)}
              sx={{ gap: 1, mb: scope === "class" ? 2 : 0 }}
            >
              {selectedIds.length > 0 && (
                <FormControlLabel
                  value="selected"
                  control={<Radio size="small" />}
                  label={`Selected Checkbox Profiles (${selectedIds.length})`}
                />
              )}
              <FormControlLabel
                value="class"
                control={<Radio size="small" />}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <ClassIcon fontSize="small" color="action" />
                    <span>By Class ({accessibleClasses.length} Authorized)</span>
                  </Box>
                }
              />
              <Tooltip
                title={
                  !canEditSchool
                    ? "Class Teachers can only batch edit their assigned classes or selected profiles."
                    : ""
                }
                arrow
              >
                <span>
                  <FormControlLabel
                    value="school"
                    disabled={!canEditSchool}
                    control={<Radio size="small" />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <School fontSize="small" color="action" />
                        <span>Entire School ({allStudents.length})</span>
                        {!canEditSchool && <Lock fontSize="inherit" color="action" />}
                      </Box>
                    }
                  />
                </span>
              </Tooltip>
            </RadioGroup>

            {/* Class Selection Menu for "class" scope */}
            {scope === "class" && (
              <Box sx={{ mt: 1, pt: 1.5, borderTop: "1px dashed", borderColor: "divider" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}>
                  Select Assigned Class to Edit:
                </Typography>

                {accessibleClasses.length <= 4 ? (
                  /* Radio buttons menu for smaller class lists (e.g. Class Teachers with 1-2 classes) */
                  <RadioGroup
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    sx={{ pl: 1 }}
                  >
                    {accessibleClasses.map((cls) => {
                      const count = studentCountByClass.get(cls.id) || 0;
                      return (
                        <FormControlLabel
                          key={cls.id}
                          value={cls.id}
                          control={<Radio size="small" />}
                          label={
                            <Typography variant="body2" sx={{ fontWeight: selectedClassId === cls.id ? 700 : 400 }}>
                              {cls.board ? `${cls.board} ` : ""}{cls.classStandard} - {cls.section}{" "}
                              <Typography component="span" variant="caption" color="text.secondary">
                                ({count} student{count !== 1 ? "s" : ""})
                              </Typography>
                            </Typography>
                          }
                        />
                      );
                    })}
                    <FormControlLabel
                      value="UNASSIGNED"
                      control={<Radio size="small" />}
                      label={
                        <Typography variant="body2" sx={{ fontWeight: selectedClassId === "UNASSIGNED" ? 700 : 400 }}>
                          Unassigned Students{" "}
                          <Typography component="span" variant="caption" color="text.secondary">
                            ({studentCountByClass.get("UNASSIGNED") || 0} students)
                          </Typography>
                        </Typography>
                      }
                    />
                  </RadioGroup>
                ) : (
                  /* Dropdown Select Menu for roles with many classes */
                  <FormControl size="small" fullWidth>
                    <Select
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value as string)}
                      sx={{ borderRadius: 1.5, bg: "background.paper" }}
                    >
                      {accessibleClasses.map((cls) => {
                        const count = studentCountByClass.get(cls.id) || 0;
                        return (
                          <MenuItem key={cls.id} value={cls.id}>
                            {cls.board ? `${cls.board} ` : ""}{cls.classStandard} - {cls.section} ({count} students)
                          </MenuItem>
                        );
                      })}
                      <MenuItem value="UNASSIGNED">
                        Unassigned Students ({studentCountByClass.get("UNASSIGNED") || 0} students)
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              </Box>
            )}
          </FormControl>
        </Paper>

        {editMode === "bulk" ? (
          <>
            <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.primary", fontWeight: "bold" }}>
              Select Fields to Bulk Modify Across All {targetStudents.length} Profiles
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Boarder Type */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableBoarderType ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableBoarderType}
                    onChange={(e) => setEnableBoarderType(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Boarder Type
                  </Typography>
                  <FormControl size="small" fullWidth disabled={!enableBoarderType || isUpdating}>
                    <Select
                      value={boarderType}
                      onChange={(e) => setBoarderType(e.target.value as any)}
                      sx={{ borderRadius: 1.5, bg: "background.paper" }}
                    >
                      <MenuItem value="Day Scholar">Day Scholar</MenuItem>
                      <MenuItem value="Day Boarder">Day Boarder</MenuItem>
                      <MenuItem value="Full Boarder">Full Boarder</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Gender */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableGender ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableGender}
                    onChange={(e) => setEnableGender(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Gender
                  </Typography>
                  <FormControl size="small" fullWidth disabled={!enableGender || isUpdating}>
                    <Select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      sx={{ borderRadius: 1.5, bg: "background.paper" }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Transgender">Transgender</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Target Class */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableClassId ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableClassId}
                    onChange={(e) => setEnableClassId(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Target Class
                  </Typography>
                  <FormControl size="small" fullWidth disabled={!enableClassId || isUpdating}>
                    <InputLabel id="batch-target-class-label">Select Class</InputLabel>
                    <Select
                      labelId="batch-target-class-label"
                      value={targetClassId}
                      label="Select Class"
                      onChange={(e) => setTargetClassId(e.target.value as string)}
                      sx={{ borderRadius: 1.5, bg: "background.paper" }}
                    >
                      {accessibleClasses.map((cls) => (
                        <MenuItem key={cls.id} value={cls.id}>
                          {cls.board ? `${cls.board} ` : ""}{cls.classStandard} - {cls.section}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Status */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableIsActive ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableIsActive}
                    onChange={(e) => setEnableIsActive(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Account Status
                  </Typography>
                  <FormControl size="small" fullWidth disabled={!enableIsActive || isUpdating}>
                    <Select
                      value={isActive ? "active" : "inactive"}
                      onChange={(e) => setIsActive(e.target.value === "active")}
                      sx={{ borderRadius: 1.5, bg: "background.paper" }}
                    >
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Paper>

              {/* Father Name */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableFatherName ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableFatherName}
                    onChange={(e) => setEnableFatherName(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Father Name
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Enter Father's Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    disabled={!enableFatherName || isUpdating}
                    sx={{ bg: "background.paper" }}
                  />
                </Box>
              </Paper>

              {/* Mother Name */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enableMotherName ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enableMotherName}
                    onChange={(e) => setEnableMotherName(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Mother Name
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Enter Mother's Name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    disabled={!enableMotherName || isUpdating}
                    sx={{ bg: "background.paper" }}
                  />
                </Box>
              </Paper>

              {/* Phone Number */}
              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: enablePhoneNumber ? "primary.lighter" : "transparent" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Checkbox
                    checked={enablePhoneNumber}
                    onChange={(e) => setEnablePhoneNumber(e.target.checked)}
                    disabled={isUpdating}
                  />
                  <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 600 }}>
                    Phone Number
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Enter Contact Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={!enablePhoneNumber || isUpdating}
                    sx={{ bg: "background.paper" }}
                  />
                </Box>
              </Paper>
            </Box>
          </>
        ) : (
          /* Individual Student Grid View */
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: "bold" }}>
                Edit Profiles Individually ({individualEditCount} Modified)
              </Typography>
            </Box>

            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 380, borderRadius: 2 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", width: 140 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 130 }}>Boarder Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 110 }}>Gender</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 140 }}>Class</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 120 }}>Father Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 120 }}>Mother Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 120 }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: 90 }}>Active</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {targetStudents.map((s) => {
                    const studentPatch = individualEdits[s.id] || {};
                    const currentBoarder = studentPatch.boarderType !== undefined ? studentPatch.boarderType : s.boarderType || "Day Scholar";
                    const currentGender = studentPatch.gender !== undefined ? studentPatch.gender : s.gender || "Male";
                    const currentClass = studentPatch.classId !== undefined ? studentPatch.classId : s.classId || "";
                    const currentFather = studentPatch.fatherName !== undefined ? studentPatch.fatherName : s.fatherName || "";
                    const currentMother = studentPatch.motherName !== undefined ? studentPatch.motherName : s.motherName || "";
                    const currentPhone = studentPatch.phoneNumber !== undefined ? studentPatch.phoneNumber : s.phoneNumber || "";
                    const currentIsActive = studentPatch.isActive !== undefined ? studentPatch.isActive : s.isActive !== false;

                    const isModified = Object.keys(studentPatch).length > 0;

                    return (
                      <TableRow key={s.id} sx={{ bgcolor: isModified ? "primary.lighter" : "inherit" }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {s.firstName} {s.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Roll: {s.rollNumber || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={currentBoarder}
                            onChange={(e) => handleIndividualFieldChange(s.id, "boarderType", e.target.value)}
                            disabled={isUpdating}
                            sx={{ fontSize: "0.8rem", borderRadius: 1.5 }}
                          >
                            <MenuItem value="Day Scholar">Day Scholar</MenuItem>
                            <MenuItem value="Day Boarder">Day Boarder</MenuItem>
                            <MenuItem value="Full Boarder">Full Boarder</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={currentGender}
                            onChange={(e) => handleIndividualFieldChange(s.id, "gender", e.target.value)}
                            disabled={isUpdating}
                            sx={{ fontSize: "0.8rem", borderRadius: 1.5 }}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Transgender">Transgender</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            size="small"
                            value={currentClass}
                            onChange={(e) => handleIndividualFieldChange(s.id, "classId", e.target.value)}
                            disabled={isUpdating}
                            sx={{ fontSize: "0.8rem", borderRadius: 1.5 }}
                          >
                            <MenuItem value="">Unassigned</MenuItem>
                            {accessibleClasses.map((c) => (
                              <MenuItem key={c.id} value={c.id}>
                                {c.board ? `${c.board} ` : ""}{c.classStandard}-{c.section}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={currentFather}
                            onChange={(e) => handleIndividualFieldChange(s.id, "fatherName", e.target.value)}
                            disabled={isUpdating}
                            sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={currentMother}
                            onChange={(e) => handleIndividualFieldChange(s.id, "motherName", e.target.value)}
                            disabled={isUpdating}
                            sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            value={currentPhone}
                            onChange={(e) => handleIndividualFieldChange(s.id, "phoneNumber", e.target.value)}
                            disabled={isUpdating}
                            sx={{ "& .MuiInputBase-input": { fontSize: "0.8rem" } }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            size="small"
                            checked={currentIsActive}
                            onChange={(e) => handleIndividualFieldChange(s.id, "isActive", e.target.checked)}
                            disabled={isUpdating}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Real-time Progress Bar */}
        {isUpdating && progress && (
          <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: "primary.lighter", border: "1px solid", borderColor: "primary.main" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: "bold" }}>
                Updating Firestore Records in Parallel Batches...
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: "bold" }}>
                {progressPercentage}% ({progress.processed} / {progress.total})
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleResetAndClose} disabled={isUpdating} color="inherit" sx={{ textTransform: "none", borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleApplyUpdate}
          variant="contained"
          color="primary"
          disabled={
            isUpdating ||
            targetStudents.length === 0 ||
            (editMode === "bulk" && !hasSelectedBulkFields) ||
            (editMode === "individual" && individualEditCount === 0)
          }
          startIcon={isUpdating ? undefined : <CheckCircle />}
          sx={{ textTransform: "none", borderRadius: 2, px: 3, fontWeight: 600 }}
        >
          {isUpdating
            ? `Updating (${progressPercentage}%)...`
            : editMode === "bulk"
            ? `Apply Bulk Update (${targetStudents.length})`
            : `Apply Individual Edits (${individualEditCount})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

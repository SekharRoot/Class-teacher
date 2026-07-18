import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { School, UserRole, UserProfile } from "../../types";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  selectedUser: any;
  formDisplayName: string;
  setFormDisplayName: (val: string) => void;
  formRole: UserRole;
  setFormRole: (role: UserRole) => void;
  formSchoolId: string;
  setFormSchoolId: (id: string) => void;
  formSchoolName: string;
  setFormSchoolName: (name: string) => void;
  formStatus: "active" | "pending";
  setFormStatus: (status: "active" | "pending") => void;
  formAssignedClassId: string;
  setFormAssignedClassId: (id: string) => void;
  formAssignedClassId2: string;
  setFormAssignedClassId2: (id: string) => void;
  formCoordinatorIds: string[];
  setFormCoordinatorIds: (ids: string[]) => void;
  formPrincipalId: string;
  setFormPrincipalId: (id: string) => void;
  formHasLeaveFeatureAccess: boolean;
  setFormHasLeaveFeatureAccess: (val: boolean) => void;
  schools: School[];
  classes: any[];
  coordinators: UserProfile[];
  principals: UserProfile[];
  onSave: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onClose,
  selectedUser,
  formDisplayName,
  setFormDisplayName,
  formRole,
  setFormRole,
  formSchoolId,
  setFormSchoolId,
  formSchoolName,
  setFormSchoolName,
  formStatus,
  setFormStatus,
  formAssignedClassId,
  setFormAssignedClassId,
  formAssignedClassId2,
  setFormAssignedClassId2,
  formCoordinatorIds,
  setFormCoordinatorIds,
  formPrincipalId,
  setFormPrincipalId,
  formHasLeaveFeatureAccess,
  setFormHasLeaveFeatureAccess,
  schools,
  classes,
  coordinators,
  principals,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Configure Role & Supervisor Hierarchy
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        {selectedUser && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Editing Profile for: {selectedUser.email}
            </Typography>

            <TextField
              label="Full Display Name"
              fullWidth
              value={formDisplayName}
              onChange={(e) => setFormDisplayName(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Functional Role</InputLabel>
              <Select
                labelId="role-select-label"
                label="Functional Role"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as UserRole)}
                disabled={selectedUser.email === "sekhar.root@gmail.com"}
              >
                <MenuItem value="owner">Owner</MenuItem>
                <MenuItem value="admin">Administrator (Full Scope)</MenuItem>
                <MenuItem value="school_admin">
                  School Administrator (Single School)
                </MenuItem>
                <MenuItem value="principal">Principal (Full Read-Only)</MenuItem>
                <MenuItem value="academic_coordinator">
                  Academic Coordinator (Full Manager)
                </MenuItem>
                <MenuItem value="class_teacher">
                  Class Teacher (Assigned Classroom)
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="school-select-label">
                Assigned School Partnership
              </InputLabel>
              <Select
                labelId="school-select-label"
                label="Assigned School Partnership"
                value={formSchoolId}
                onChange={(e) => {
                  const schId = e.target.value;
                  setFormSchoolId(schId);
                  const matched = schools.find((s) => s.id === schId);
                  if (matched) {
                    setFormSchoolName(matched.name);
                  } else if (schId === "default_school") {
                    setFormSchoolName("Default School");
                  }
                }}
                disabled={selectedUser?.email === "sekhar.root@gmail.com"}
              >
                <MenuItem value="default_school">
                  <em>Default School</em>
                </MenuItem>
                {formSchoolId &&
                  formSchoolId !== "default_school" &&
                  !schools.some((s) => s.id === formSchoolId) && (
                    <MenuItem
                      key={formSchoolId}
                      value={formSchoolId}
                      style={{ display: "none" }}
                    >
                      {formSchoolName || "Loading..."}
                    </MenuItem>
                  )}
                {schools.filter((sch) => sch.isActive !== false).map((sch) => (
                  <MenuItem key={sch.id} value={sch.id}>
                    {sch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="status-select-label">Account Status</InputLabel>
              <Select
                labelId="status-select-label"
                label="Account Status"
                value={formStatus}
                onChange={(e) =>
                  setFormStatus(e.target.value as "active" | "pending")
                }
                disabled={
                  selectedUser.role === "owner" ||
                  selectedUser.email === "sekhar.root@gmail.com"
                }
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>

            {formRole === "class_teacher" && (
              <>
                <FormControl fullWidth>
                  <InputLabel id="class-select-label">
                    Assigned Classroom
                  </InputLabel>
                  <Select
                    labelId="class-select-label"
                    label="Assigned Classroom"
                    value={formAssignedClassId}
                    onChange={(e) => setFormAssignedClassId(e.target.value)}
                  >
                    <MenuItem value="">-- No Class Assigned --</MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id}>
                        {cls.classStandard} {cls.section} ({cls.board})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="class2-select-label">
                    Second Assigned Classroom (Optional)
                  </InputLabel>
                  <Select
                    labelId="class2-select-label"
                    label="Second Assigned Classroom (Optional)"
                    value={formAssignedClassId2}
                    onChange={(e) => setFormAssignedClassId2(e.target.value)}
                  >
                    <MenuItem value="">-- No Second Class Assigned --</MenuItem>
                    {classes.map((cls) => (
                      <MenuItem key={cls.id} value={cls.id} disabled={cls.id === formAssignedClassId}>
                        {cls.classStandard} {cls.section} ({cls.board})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="coordinator-select-label">
                    Supervising Academic Coordinators
                  </InputLabel>
                  <Select
                    labelId="coordinator-select-label"
                    label="Supervising Academic Coordinators"
                    multiple
                    value={formCoordinatorIds}
                    onChange={(e) =>
                      setFormCoordinatorIds(e.target.value as string[])
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected
                          .map((value) => {
                            const coord = coordinators.find(
                              (c) => c.uid === value
                            );
                            return coord ? coord.displayName : value;
                          })
                          .join(", ")}
                      </Box>
                    )}
                  >
                    {coordinators.map((co) => (
                      <MenuItem key={co.uid} value={co.uid}>
                        {co.displayName} ({co.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {formRole === "academic_coordinator" && (
              <FormControl fullWidth>
                <InputLabel id="principal-select-label">
                  Reporting to Principal
                </InputLabel>
                <Select
                  labelId="principal-select-label"
                  label="Reporting to Principal"
                  value={formPrincipalId}
                  onChange={(e) => setFormPrincipalId(e.target.value)}
                >
                  <MenuItem value="">-- No Direct Link --</MenuItem>
                  {principals.map((pr) => (
                    <MenuItem key={pr.uid} value={pr.uid}>
                      {pr.displayName} ({pr.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={formHasLeaveFeatureAccess}
                  onChange={(e) =>
                    setFormHasLeaveFeatureAccess(e.target.checked)
                  }
                  color="primary"
                />
              }
              label="Enable Leave Requests Feature Access"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Save Permissions
        </Button>
      </DialogActions>
    </Dialog>
  );
};

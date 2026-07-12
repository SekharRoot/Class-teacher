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
import { School, UserRole } from "../../types";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  newEmail: string;
  setNewEmail: (email: string) => void;
  newDisplayName: string;
  setNewDisplayName: (name: string) => void;
  newRole: UserRole;
  setNewRole: (role: UserRole) => void;
  newSchoolId: string;
  setNewSchoolId: (id: string) => void;
  newSchoolName: string;
  setNewSchoolName: (name: string) => void;
  newHasLeaveFeatureAccess: boolean;
  setNewHasLeaveFeatureAccess: (val: boolean) => void;
  schools: School[];
  onCreateUser: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onClose,
  newEmail,
  setNewEmail,
  newDisplayName,
  setNewDisplayName,
  newRole,
  setNewRole,
  newSchoolId,
  setNewSchoolId,
  newSchoolName,
  setNewSchoolName,
  newHasLeaveFeatureAccess,
  setNewHasLeaveFeatureAccess,
  schools,
  onCreateUser,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: "bold" }}>
        Configure New User Profile
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Configure a user's details and role in advance. When they register
            or sign in with this email, they will assume this configured
            identity.
          </Typography>
          <TextField
            label="Email Address"
            fullWidth
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="e.g. teacher@school.com"
          />
          <TextField
            label="Display Name"
            fullWidth
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            placeholder="e.g. Mrs. Sharma"
          />
          <FormControl fullWidth>
            <InputLabel id="new-role-select-label">Role</InputLabel>
            <Select
              labelId="new-role-select-label"
              label="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
            >
              <MenuItem value="owner">Owner</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="school_admin">School Administrator</MenuItem>
              <MenuItem value="principal">Principal</MenuItem>
              <MenuItem value="academic_coordinator">
                Academic Coordinator
              </MenuItem>
              <MenuItem value="class_teacher">Class Teacher</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="new-school-select-label">School Partnership</InputLabel>
            <Select
              labelId="new-school-select-label"
              label="School Partnership"
              value={newSchoolId}
              onChange={(e) => {
                const schId = e.target.value;
                setNewSchoolId(schId);
                const matched = schools.find((s) => s.id === schId);
                if (matched) {
                  setNewSchoolName(matched.name);
                } else if (schId === "default_school") {
                  setNewSchoolName("Default School");
                }
              }}
            >
              <MenuItem value="default_school">
                <em>Default School</em>
              </MenuItem>
              {newSchoolId &&
                newSchoolId !== "default_school" &&
                !schools.some((s) => s.id === newSchoolId) && (
                  <MenuItem
                    key={newSchoolId}
                    value={newSchoolId}
                    style={{ display: "none" }}
                  >
                    {newSchoolName || "Loading..."}
                  </MenuItem>
                )}
              {schools.filter((sch) => sch.isActive !== false).map((sch) => (
                <MenuItem key={sch.id} value={sch.id}>
                  {sch.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={newHasLeaveFeatureAccess}
                onChange={(e) => setNewHasLeaveFeatureAccess(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Leave Requests Feature Access"
          />
        </Box>
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
          onClick={onCreateUser}
          sx={{ textTransform: "none", fontWeight: "bold" }}
        >
          Configure Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

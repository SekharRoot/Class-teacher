import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Paper,
  Chip,
} from "@mui/material";
import {
  School as SchoolIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { School } from "../../types";

interface ManageSchoolsTabProps {
  schools: School[];
  schoolsLoading: boolean;
  addSchoolName: string;
  setAddSchoolName: (value: string) => void;
  newSchoolAddress: string;
  setNewSchoolAddress: (value: string) => void;
  onAddSchool: (e: React.FormEvent) => void;
  onToggleSchoolActive: (id: string, currentStatus: boolean) => void;
  onOpenDeleteSchool: (school: School) => void;
}

export const ManageSchoolsTab: React.FC<ManageSchoolsTabProps> = ({
  schools,
  schoolsLoading,
  addSchoolName,
  setAddSchoolName,
  newSchoolAddress,
  setNewSchoolAddress,
  onAddSchool,
  onToggleSchoolActive,
  onOpenDeleteSchool,
}) => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <SchoolIcon color="primary" /> Manage Registered Schools
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add, manage, or remove schools within your unified platform. Users can
          select from these schools when creating a new account.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Add School Form Card */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Add New School
              </Typography>
              <Box
                component="form"
                onSubmit={onAddSchool}
                sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
              >
                <TextField
                  label="School Name"
                  required
                  fullWidth
                  value={addSchoolName}
                  onChange={(e) => setAddSchoolName(e.target.value)}
                  disabled={schoolsLoading}
                  slotProps={{ htmlInput: { id: "new-school-name" } }}
                />
                <TextField
                  label="Address / Location"
                  fullWidth
                  multiline
                  rows={3}
                  value={newSchoolAddress}
                  onChange={(e) => setNewSchoolAddress(e.target.value)}
                  disabled={schoolsLoading}
                  slotProps={{ htmlInput: { id: "new-school-address" } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={schoolsLoading || !addSchoolName.trim()}
                  startIcon={<AddIcon />}
                  sx={{
                    mt: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    py: 1.25,
                    borderRadius: "12px",
                  }}
                >
                  {schoolsLoading ? "Adding..." : "Add School"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Registered Schools List */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Registered Schools ({schools.length})
              </Typography>
              {schools.length === 0 ? (
                <Box sx={{ py: 6, textAlign: "center" }}>
                  <SchoolIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    No schools registered yet
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    Add a school using the form on the left to get started.
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {schools.map((sch) => (
                    <Paper
                      key={sch.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.02)"
                            : "rgba(0,0,0,0.01)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: "primary.light",
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 12px 0 rgba(0,0,0,0.03)",
                        },
                      }}
                    >
                      <Box sx={{ pr: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: "bold", color: "text.primary" }}
                          >
                            {sch.name}
                          </Typography>
                          <Chip
                            label={sch.isActive !== false ? "Active" : "Inactive"}
                            color={sch.isActive !== false ? "success" : "default"}
                            size="small"
                            sx={{
                              fontWeight: "bold",
                              height: 20,
                              fontSize: "0.65rem",
                            }}
                          />
                        </Box>
                        {sch.address && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                          >
                            {sch.address}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          color="text.disabled"
                          sx={{ display: "block", mt: 0.5, fontFamily: "monospace" }}
                        >
                          ID: {sch.id}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Button
                          variant="outlined"
                          color={sch.isActive !== false ? "warning" : "success"}
                          size="small"
                          onClick={() =>
                            onToggleSchoolActive(sch.id, sch.isActive !== false)
                          }
                          disabled={schoolsLoading}
                          sx={{ textTransform: "none", borderRadius: "8px" }}
                        >
                          {sch.isActive !== false ? "Deactivate" : "Activate"}
                        </Button>
                        {sch.isActive !== false && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => onOpenDeleteSchool(sch)}
                            disabled={schoolsLoading}
                            sx={{ textTransform: "none", borderRadius: "8px" }}
                          >
                            Remove
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

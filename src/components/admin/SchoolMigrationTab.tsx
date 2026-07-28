import { useSchoolMigration } from "./hooks/useSchoolMigration";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import {
  Autorenew as AutorenewIcon,
  Storage as StorageIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  DeleteForever as DeleteForeverIcon,
  TrendingFlat as TrendingFlatIcon,
} from "@mui/icons-material";
import { School, UserProfile } from "../../types";
import { collection, query, getDocs, setDoc, doc, where, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { attendanceApi } from "../../api/attendance";

interface SchoolMigrationTabProps {
  schools: School[];
  userProfile: UserProfile | null;
  isOwnerOrAdmin: boolean;
}

export const SchoolMigrationTab: React.FC<SchoolMigrationTabProps> = ({
  schools,
  userProfile,
  isOwnerOrAdmin,
}) => {
  const {
    selectedSchoolId, setSelectedSchoolId,
    selectedSchoolName, setSelectedSchoolName,
    counts,
    loadingStats,
    migrationLoading,
    migrationStatus,
    migrationProgress,
    migrationSuccess,
    migrationError,
    purgeLoading,
    purgeSuccess,
    fetchCounts,
    handleRunSchoolMigration,
    handlePurgeRootData
  } = useSchoolMigration(schools, userProfile);

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
          <AutorenewIcon color="primary" /> School-Targeted Historical Migration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Safely move historical classroom registry, leave request, and attendance records from root-level directories to secure nested school paths. This operates <strong>strictly</strong> for the chosen school without touching others.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, p: 1, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Target School Context
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="migration-school-select-label">Select School</InputLabel>
                <Select
                  labelId="migration-school-select-label"
                  label="Select School"
                  value={selectedSchoolId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedSchoolId(val);
                    const matched = schools.find((s) => s.id === val);
                    setSelectedSchoolName(matched ? matched.name : "Default School");
                  }}
                  disabled={!isOwnerOrAdmin}
                >
                  {(isOwnerOrAdmin || userProfile?.schoolId === "default_school" || !userProfile?.schoolId) && (
                    <MenuItem value="default_school">
                      <em>Default School</em>
                    </MenuItem>
                  )}
                  {schools
                    .filter((sch) => (isOwnerOrAdmin || sch.id === userProfile?.schoolId) && sch.isActive !== false)
                    .map((sch) => (
                      <MenuItem key={sch.id} value={sch.id}>
                        {sch.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This migration tool targets <strong>{selectedSchoolName}</strong> only. It isolated-queries legacy records, partitions them correctly, and writes them into high-speed subcollections under <code>/schools/{selectedSchoolId}</code>.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRunSchoolMigration}
                  disabled={migrationLoading || loadingStats}
                  startIcon={migrationLoading ? <CircularProgress size={20} color="inherit" /> : <AutorenewIcon />}
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    py: 1.5,
                    borderRadius: "10px",
                  }}
                >
                  {migrationLoading ? "Migrating Data..." : "Migrate to Nested Schema"}
                </Button>

                {counts.rootClasses > 0 || counts.rootStudents > 0 || counts.rootLeaves > 0 || counts.rootAttendance > 0 ? (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handlePurgeRootData}
                    disabled={migrationLoading || loadingStats || purgeLoading}
                    startIcon={purgeLoading ? <CircularProgress size={20} color="inherit" /> : <DeleteForeverIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1.5,
                      borderRadius: "10px",
                    }}
                  >
                    {purgeLoading ? "Purging Root..." : "Clean Up Legacy Root Data"}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="success"
                    disabled
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1.5,
                      borderRadius: "10px",
                    }}
                  >
                    Cleaned & Restructured (No Root Data)
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Live Restoration Comparison Audit
              </Typography>

              {loadingStats ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 2 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                    Auditing live unmigrated vs. optimized documents...
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Data Collection</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Legacy Root</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}></TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Nested Path</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          name: "Class Configs",
                          root: counts.rootClasses,
                          nested: counts.nestedClasses,
                        },
                        {
                          name: "Students Registry",
                          root: counts.rootStudents,
                          nested: counts.nestedStudents,
                        },
                        {
                          name: "Leaves Registry",
                          root: counts.rootLeaves,
                          nested: counts.nestedLeaves,
                        },
                        {
                          name: "Attendance Sheets",
                          root: counts.rootAttendance,
                          nested: counts.nestedAttendance,
                        },
                      ].map((row, idx) => {
                        const fullyMigrated = row.root === 0 || row.root <= row.nested;
                        return (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                color={row.root > 0 ? "error.main" : "text.secondary"}
                                sx={{ fontWeight: row.root > 0 ? "bold" : "normal" }}
                              >
                                {row.root}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <TrendingFlatIcon color="disabled" fontSize="small" />
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body2"
                                color={row.nested > 0 ? "success.main" : "text.secondary"}
                                sx={{ fontWeight: "bold" }}
                              >
                                {row.nested}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {fullyMigrated ? (
                                <CheckCircleIcon color="success" fontSize="small" />
                              ) : (
                                <WarningIcon color="warning" fontSize="small" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ mt: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontWeight: "medium" }}>
                  💡 <strong>Safe Migration Strategy:</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", pl: 1 }}>
                  1. Choose your target school and click <strong>Migrate to Nested Schema</strong>.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", pl: 1 }}>
                  2. Wait for successful completion. The <strong>Nested Path</strong> count will match or exceed the Legacy counts.
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", pl: 1, mb: 1 }}>
                  3. Verify school functionality, then click <strong>Clean Up Legacy Root Data</strong> to safely purge unnested duplicates.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {migrationLoading && (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, mb: 4, bgcolor: "action.hover" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            {migrationStatus}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={migrationProgress.current}
            sx={{
              height: 10,
              borderRadius: 5,
              [`& .MuiLinearProgress-bar`]: {
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              },
            }}
          />
        </Paper>
      )}

      {migrationSuccess && (
        <Alert severity="success" sx={{ mb: 4, borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Migration Completed Successfully!
          </Typography>
          All records belonging to "{selectedSchoolName}" have been safely duplicated, converted, and verified under nested tenant collections. You may now clean up root data.
        </Alert>
      )}

      {purgeSuccess && (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Legacy Clean Up Complete
          </Typography>
          Successfully removed root-level duplicate documents for "{selectedSchoolName}". The root directory database is now fully optimized and clean!
        </Alert>
      )}

      {migrationError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {migrationError}
        </Alert>
      )}
    </Box>
  );
};

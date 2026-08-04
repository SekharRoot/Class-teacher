import { useCrossDatabaseMigration } from "./hooks/useCrossDatabaseMigration";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
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
  LinearProgress,
  Checkbox,
  FormControlLabel,
  Divider,
} from "@mui/material";
import {
  Storage as StorageIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapHorizIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import { School } from "../../types";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { firebaseConfig, getFirestoreForDbId } from "../../lib/firebase";

interface DatabasesTabProps {
  schools: School[];
  dbSelectedSchoolId: string;
  setDbSelectedSchoolId: (id: string) => void;
  dbSelectedSchoolName: string;
  setDbSelectedSchoolName: (name: string) => void;
  onFetchDbCounts: (schoolId: string) => void;
  dbCountsLoading: boolean;
  importLoading: boolean;
  onExportDatabase: () => void;
  onImportDatabase: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDeleteDbDialog: () => void;
  dbCounts: {
    students: number;
    users: number;
    leaves: number;
    attendance: number;
    classes: number;
  };
  isOwnerOrAdmin: boolean;
  userProfile: any;
  isSchoolAdmin: boolean;
}

export const DatabasesTab: React.FC<DatabasesTabProps> = ({
  schools,
  dbSelectedSchoolId,
  setDbSelectedSchoolId,
  dbSelectedSchoolName,
  setDbSelectedSchoolName,
  onFetchDbCounts,
  dbCountsLoading,
  importLoading,
  onExportDatabase,
  onImportDatabase,
  onOpenDeleteDbDialog,
  dbCounts,
  isOwnerOrAdmin,
  userProfile,
  isSchoolAdmin,
}) => {
  const {
    configDbs,
    sourceDbId, setSourceDbId,
    targetDbId, setTargetDbId,
    isTransferring,
    transferProgress,
    transferStatus,
    transferLog,
    transferSuccess,
    transferError,
    transferOptions, setTransferOptions,
    handleTransfer
  } = useCrossDatabaseMigration();

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
          <StorageIcon color="primary" /> Databases Management (Firestore)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View, backup, restore, or delete Firestore database tables and
          collections assigned to specific schools.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: "10px", p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Select Target School
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="db-school-select-label">Target School</InputLabel>
                <Select
                  labelId="db-school-select-label"
                  label="Target School"
                  value={dbSelectedSchoolId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDbSelectedSchoolId(val);
                    const matched = schools.find((s) => s.id === val);
                    if (matched) {
                      setDbSelectedSchoolName(matched.name);
                      onFetchDbCounts(val);
                    } else if (val === "default_school") {
                      setDbSelectedSchoolName("Default School");
                      onFetchDbCounts(val);
                    }
                  }}
                >
                  {(isOwnerOrAdmin ||
                    userProfile?.schoolId === "default_school" ||
                    !userProfile?.schoolId) && (
                    <MenuItem value="default_school">
                      <em>Default School</em>
                    </MenuItem>
                  )}
                  {dbSelectedSchoolId &&
                    dbSelectedSchoolId !== "default_school" &&
                    !schools.some((s) => s.id === dbSelectedSchoolId) && (
                      <MenuItem
                        key={dbSelectedSchoolId}
                        value={dbSelectedSchoolId}
                        style={{ display: "none" }}
                      >
                        {dbSelectedSchoolName || "Loading..."}
                      </MenuItem>
                    )}
                  {schools
                    .filter((sch) => isOwnerOrAdmin || sch.id === userProfile?.schoolId)
                    .map((sch) => (
                      <MenuItem key={sch.id} value={sch.id}>
                        {sch.name} {sch.isActive === false ? "(Inactive)" : ""}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {dbSelectedSchoolId ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<CloudDownloadIcon />}
                    disabled={dbCountsLoading || importLoading}
                    onClick={onExportDatabase}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1.25,
                      borderRadius: "10px",
                    }}
                  >
                    Export School Backup
                  </Button>

                  <Button
                    component="label"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    startIcon={
                      importLoading ? (
                        <CircularProgress size={18} />
                      ) : (
                        <CloudUploadIcon />
                      )
                    }
                    disabled={dbCountsLoading || importLoading}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1.25,
                      borderRadius: "10px",
                      textAlign: "center",
                    }}
                  >
                    {importLoading ? "Importing..." : "Import & Merge Backup"}
                    <input
                      type="file"
                      accept=".json"
                      hidden
                      onChange={onImportDatabase}
                    />
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    disabled={dbCountsLoading || importLoading}
                    onClick={onOpenDeleteDbDialog}
                    sx={{
                      textTransform: "none",
                      fontWeight: "bold",
                      py: 1.25,
                      borderRadius: "10px",
                    }}
                  >
                    Delete School Database
                  </Button>
                </Box>
              ) : (
                <Alert severity="info" sx={{ borderRadius: "10px" }}>
                  Please choose a school from the registry dropdown to begin
                  management.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: "10px", p: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
                Live Document Statistics: {dbSelectedSchoolName}
              </Typography>

              {dbSelectedSchoolId ? (
                dbCountsLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 8,
                      gap: 2,
                    }}
                  >
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary">
                      Querying live database records...
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {[
                      {
                        label: "Students Registry",
                        value: dbCounts.students,
                        desc: "Total boarders registered under school tenancy.",
                      },
                      {
                        label: "System Users",
                        value: dbCounts.users,
                        desc: "Teacher, coordinator, principal, and school_admin roles.",
                      },
                      {
                        label: "Leaves Requests",
                        value: dbCounts.leaves,
                        desc: "Leave logs, approvals, and historic records.",
                      },
                      {
                        label: "Attendance Days",
                        value: dbCounts.attendance,
                        desc: "Total single-day attendance sheet documents containing school boarders.",
                      },
                      {
                        label: "Global Classes",
                        value: dbCounts.classes,
                        desc: "Shared classroom categories and grade metrics.",
                      },
                    ].map((item, idx) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 2.5,
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 2.5,
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: "primary.light",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: "10px",
                              bgcolor: "primary.50",
                              color: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <StorageIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )
              ) : (
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                    bgcolor: "action.hover",
                    borderRadius: "10px",
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <StorageIcon
                    sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    No active target school
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Choose a school to inspect live record counts.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CROSS-DATABASE TRANSFER CARD */}
      <Card variant="outlined" sx={{ borderRadius: "10px", p: 1, mt: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <SwapHorizIcon color="secondary" /> Cross-Database Transfer & Schema Migration
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Replicate the entire schema, database entries, nested multi-tenancy schools, classes, students,
            leaves, attendance, and users from one Firestore Database Instance to another.
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="source-db-select-label">Source Database ID</InputLabel>
                <Select
                  labelId="source-db-select-label"
                  label="Source Database ID"
                  value={sourceDbId}
                  onChange={(e) => setSourceDbId(e.target.value)}
                  disabled={isTransferring}
                >
                  {configDbs.map((db: any) => (
                    <MenuItem key={db.id} value={db.id}>
                      {db.name} ({db.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="target-db-select-label">Target Database ID</InputLabel>
                <Select
                  labelId="target-db-select-label"
                  label="Target Database ID"
                  value={targetDbId}
                  onChange={(e) => setTargetDbId(e.target.value)}
                  disabled={isTransferring}
                >
                  {configDbs.map((db: any) => (
                    <MenuItem key={db.id} value={db.id}>
                      {db.name} ({db.id})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
            Select Entities & Collections to Migrate:
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {Object.keys(transferOptions).map((optionKey) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={optionKey}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={(transferOptions as any)[optionKey]}
                      onChange={(e) =>
                        setTransferOptions((prev) => ({
                          ...prev,
                          [optionKey]: e.target.checked,
                        }))
                      }
                      disabled={isTransferring}
                      color="secondary"
                    />
                  }
                  label={<span style={{ textTransform: "capitalize" }}>{optionKey}</span>}
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {transferError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
              {transferError}
            </Alert>
          )}

          {transferSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: "10px" }}>
              {transferSuccess}
            </Alert>
          )}

          {isTransferring && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5, color: "secondary.main" }}>
                Status: {transferStatus}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={transferProgress}
                color="secondary"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 2,
                  [`& .MuiLinearProgress-bar`]: {
                    transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  },
                }}
              />
              
              <Typography variant="caption" sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                <ListAltIcon fontSize="inherit" /> Execution Console Logs:
              </Typography>
              <Box
                sx={{
                  bgcolor: "#121212",
                  color: "#4af626",
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  p: 2,
                  borderRadius: "10px",
                  maxHeight: 220,
                  overflowY: "auto",
                  fontSize: "0.75rem",
                  border: "1px solid #333",
                  lineHeight: 1.5,
                }}
              >
                {transferLog.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handleTransfer}
            disabled={isTransferring}
            startIcon={isTransferring ? <CircularProgress size={20} color="inherit" /> : <SwapHorizIcon />}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "10px",
              py: 1.5,
              px: 4,
            }}
          >
            {isTransferring ? "Executing Transfer..." : "Begin Cross-Database Migration"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Bottom Layout Safety Spacer */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />
    </Box>
  );
};

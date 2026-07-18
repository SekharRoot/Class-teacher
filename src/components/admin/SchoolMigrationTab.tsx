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
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [selectedSchoolName, setSelectedSchoolName] = useState<string>("");

  const [counts, setCounts] = useState<{
    rootClasses: number;
    nestedClasses: number;
    rootStudents: number;
    nestedStudents: number;
    rootLeaves: number;
    nestedLeaves: number;
    rootAttendance: number;
    nestedAttendance: number;
  }>({
    rootClasses: 0,
    nestedClasses: 0,
    rootStudents: 0,
    nestedStudents: 0,
    rootLeaves: 0,
    nestedLeaves: 0,
    rootAttendance: 0,
    nestedAttendance: 0,
  });

  const [loadingStats, setLoadingStats] = useState(false);
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState("");
  const [migrationProgress, setMigrationProgress] = useState({ current: 0, total: 0 });
  const [migrationSuccess, setMigrationSuccess] = useState(false);
  const [migrationError, setMigrationError] = useState("");

  const [purgeLoading, setPurgeLoading] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  // Initialize selected school
  useEffect(() => {
    if (schools.length > 0) {
      const activeSchId = userProfile?.schoolId || "default_school";
      setSelectedSchoolId(activeSchId);
      const matched = schools.find((s) => s.id === activeSchId);
      setSelectedSchoolName(matched ? matched.name : "Default School");
    }
  }, [schools, userProfile]);

  // Load stats when selectedSchoolId changes
  useEffect(() => {
    if (selectedSchoolId) {
      fetchCounts(selectedSchoolId);
    }
  }, [selectedSchoolId]);

  const fetchCounts = async (schoolId: string) => {
    try {
      setLoadingStats(true);
      setMigrationSuccess(false);
      setMigrationError("");
      setPurgeSuccess(false);

      // 1. Root Students vs Nested Students
      const rootStudentsQuery = query(collection(db, "students"), where("schoolId", "==", schoolId));
      const rootStudentsSnap = await getDocs(rootStudentsQuery);
      const studentClassIds = new Set(rootStudentsSnap.docs.map(d => d.data().classId).filter(Boolean));

      // 2. Root Classes vs Nested Classes (matching by schoolId OR missing schoolId but referenced by student)
      const rootClassesSnapAll = await getDocs(collection(db, "classes"));
      const schoolRootClasses = rootClassesSnapAll.docs.filter(doc => {
        const data = doc.data();
        return data.schoolId === schoolId || !data.schoolId || data.schoolId === "default_school" || studentClassIds.has(doc.id);
      });
      const nestedClassesQuery = query(collection(db, "schools", schoolId, "classes"));
      const nestedClassesSnap = await getDocs(nestedClassesQuery);

      const classIds = ["unassigned", ...nestedClassesSnap.docs.map(d => d.id)];
      let nestedStudentsCount = 0;
      let nestedLeavesCount = 0;
      let nestedAttendanceCount = 0;

      await Promise.all(classIds.map(async (cId) => {
        const stdSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "students"));
        nestedStudentsCount += stdSnap.size;

        const lvSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "leaves"));
        nestedLeavesCount += lvSnap.size;

        const attSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "attendance"));
        nestedAttendanceCount += attSnap.size;
      }));

      // 3. Root Leaves
      const rootLeavesQuery = query(collection(db, "leaves"), where("schoolId", "==", schoolId));
      const rootLeavesSnap = await getDocs(rootLeavesQuery);

      // 4. Root Attendance Days containing students of this school
      const schoolStudentIds = new Set(rootStudentsSnap.docs.map(d => d.id));
      const rootAttendanceSnap = await getDocs(collection(db, "attendance"));
      let rootAttendanceCount = 0;

      rootAttendanceSnap.forEach((doc) => {
        const data = doc.data();
        const hasMatchingStudent = Object.keys(data).some(studentId => schoolStudentIds.has(studentId));
        if (hasMatchingStudent) {
          rootAttendanceCount++;
        }
      });

      setCounts({
        rootClasses: schoolRootClasses.length,
        nestedClasses: nestedClassesSnap.size,
        rootStudents: rootStudentsSnap.size,
        nestedStudents: nestedStudentsCount,
        rootLeaves: rootLeavesSnap.size,
        nestedLeaves: nestedLeavesCount,
        rootAttendance: rootAttendanceCount,
        nestedAttendance: nestedAttendanceCount,
      });
    } catch (e: any) {
      console.error("Error fetching school migration stats:", e);
      setMigrationError("Failed to fetch statistics: " + e.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleRunSchoolMigration = async () => {
    if (!selectedSchoolId) return;
    try {
      setMigrationLoading(true);
      setMigrationSuccess(false);
      setMigrationError("");
      setMigrationStatus("Beginning targeted school migration...");
      setMigrationProgress({ current: 0, total: 100 });

      const targetSchoolId = selectedSchoolId;
      const targetSchoolName = selectedSchoolName;

      // Fetch students first to find referenced class IDs
      setMigrationStatus("Scanning registry and class references...");
      const rootStudentsQuery = query(collection(db, "students"), where("schoolId", "==", targetSchoolId));
      const rootStudentsSnap = await getDocs(rootStudentsQuery);
      const rootStudents = rootStudentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const referencedClassIds = new Set(rootStudents.map(s => s.classId).filter(Boolean));

      // Step 1: Migrate Classes
      setMigrationStatus("Migrating classes to school-specific configurations...");
      const rootClassesSnapAll = await getDocs(collection(db, "classes"));
      const rootClassesToMigrate = rootClassesSnapAll.docs.filter(doc => {
        const data = doc.data();
        return data.schoolId === targetSchoolId || !data.schoolId || data.schoolId === "default_school" || referencedClassIds.has(doc.id);
      }).map(doc => ({ id: doc.id, ...doc.data() } as any));

      for (const cls of rootClassesToMigrate) {
        await setDoc(doc(db, "schools", targetSchoolId, "classes", cls.id), {
          board: cls.board || "Standard",
          classStandard: cls.classStandard || "",
          section: cls.section || "",
          schoolId: targetSchoolId,
          createdAt: cls.createdAt || new Date().toISOString(),
        }, { merge: true });
      }
      setMigrationProgress({ current: 20, total: 100 });

      // Step 2: Migrate Students
      setMigrationStatus("Migrating student registry...");
      for (const std of rootStudents) {
        const cId = std.classId || "unassigned";
        await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "students", std.id), {
          firstName: std.firstName || "",
          lastName: std.lastName || "",
          rollNumber: std.rollNumber || "",
          classId: std.classId || "",
          gender: std.gender || "Male",
          fatherName: std.fatherName || "",
          motherName: std.motherName || "",
          phoneNumber: std.phoneNumber || "",
          boarderType: std.boarderType || "Day Scholar",
          image: std.image || "",
          profileId: std.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          isActive: std.isActive !== undefined ? std.isActive : true,
          schoolId: targetSchoolId,
        }, { merge: true });
      }
      setMigrationProgress({ current: 50, total: 100 });

      // Step 3: Migrate Leaves
      setMigrationStatus("Migrating student leaves...");
      const rootLeavesQuery = query(collection(db, "leaves"), where("schoolId", "==", targetSchoolId));
      const rootLeavesSnap = await getDocs(rootLeavesQuery);
      const rootLeaves = rootLeavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      for (const lv of rootLeaves) {
        const cId = lv.classId || "unassigned";
        await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "leaves", lv.id), {
          ...lv,
          schoolId: targetSchoolId,
        }, { merge: true });
      }
      setMigrationProgress({ current: 70, total: 100 });

      // Step 4: Migrate Attendance Records (filtered to this school's students only)
      setMigrationStatus("Migrating historical attendance records...");
      const schoolStudentIds = new Set(rootStudents.map(s => s.id));
      const rootAttendanceSnap = await getDocs(collection(db, "attendance"));
      const allAttendanceDocs = rootAttendanceSnap.docs;

      // Filter to attendance records containing students from this school
      const relevantAttendanceDocs = allAttendanceDocs.filter(d => {
        const data = d.data();
        return Object.keys(data).some(studentId => schoolStudentIds.has(studentId));
      });

      const totalRelevant = relevantAttendanceDocs.length;
      if (totalRelevant > 0) {
        for (let i = 0; i < totalRelevant; i++) {
          const docSnap = relevantAttendanceDocs[i];
          const dateString = docSnap.id;
          const records = docSnap.data();

          setMigrationStatus(`Migrating historical attendance for: ${dateString} (${i + 1}/${totalRelevant})...`);

          // Group school records by classId
          const classGroup: Record<string, Record<string, any>> = {};

          Object.entries(records).forEach(([studentId, val]) => {
            if (schoolStudentIds.has(studentId)) {
              const student = rootStudents.find(s => s.id === studentId);
              const cId = student?.classId || "unassigned";

              const isObj = val && typeof val === "object";
              const status = isObj ? val.status : (val || "");
              const boarderType = isObj ? val.boarderType : (student?.boarderType ?? "Day Scholar");
              const remarks = val?.remarks || "";

              if (!classGroup[cId]) {
                classGroup[cId] = {};
              }

              classGroup[cId][studentId] = {
                status,
                classId: student?.classId || "",
                boarderType,
                remarks,
              };
            }
          });

          // Save to nested paths
          for (const [cId, classRecords] of Object.entries(classGroup)) {
            const ref = doc(db, "schools", targetSchoolId, "classes", cId, "attendance", dateString);
            await setDoc(ref, classRecords, { merge: true });
          }

          // Generate school-specific precomputed daily summary doc
          const flatRecordsForSchool: Record<string, any> = {};
          Object.values(classGroup).forEach((classRecords) => {
            Object.assign(flatRecordsForSchool, classRecords);
          });

          // Set active school context temporarily to save summary doc
          const originalSchoolId = localStorage.getItem("active_school_id");
          localStorage.setItem("active_school_id", targetSchoolId);
          try {
            await attendanceApi.generateAndSaveSummary(dateString, flatRecordsForSchool);
          } catch (err) {
            console.error("Failed to generate summary for school", targetSchoolId, err);
          } finally {
            if (originalSchoolId) {
              localStorage.setItem("active_school_id", originalSchoolId);
            } else {
              localStorage.removeItem("active_school_id");
            }
          }

          const pct = 70 + Math.round((i + 1) / totalRelevant * 30);
          setMigrationProgress({ current: pct, total: 100 });
        }
      } else {
        setMigrationProgress({ current: 100, total: 100 });
      }

      setMigrationStatus(`Successfully migrated and optimized all historical data for "${targetSchoolName}"!`);
      setMigrationSuccess(true);
      await fetchCounts(targetSchoolId);
    } catch (err: any) {
      console.error(" targeted school migration failed:", err);
      setMigrationError("School migration failed: " + err.message);
    } finally {
      setMigrationLoading(false);
    }
  };

  const handlePurgeRootData = async () => {
    if (!window.confirm(`Are you absolutely sure you want to clean up root-level data for "${selectedSchoolName}"? This action is safe only if you have successfully completed the migration and verified the counts below are identical.`)) {
      return;
    }

    try {
      setPurgeLoading(true);
      setMigrationError("");
      setPurgeSuccess(false);

      const targetSchoolId = selectedSchoolId;

      // 1. Purge Classes (matching targetSchoolId OR empty/default schoolId but referenced by students)
      const rootStudentsQuery = query(collection(db, "students"), where("schoolId", "==", targetSchoolId));
      const rootStudentsSnap = await getDocs(rootStudentsQuery);
      const studentIds = new Set(rootStudentsSnap.docs.map(d => d.id));
      const referencedClassIds = new Set(rootStudentsSnap.docs.map(d => d.data().classId).filter(Boolean));

      const rootClassesSnapAll = await getDocs(collection(db, "classes"));
      const rootClassesToPurge = rootClassesSnapAll.docs.filter(doc => {
        const data = doc.data();
        return data.schoolId === targetSchoolId || !data.schoolId || data.schoolId === "default_school" || referencedClassIds.has(doc.id);
      });

      for (const d of rootClassesToPurge) {
        await deleteDoc(d.ref);
      }

      // 2. Purge Students
      for (const d of rootStudentsSnap.docs) {
        await deleteDoc(d.ref);
      }

      // 3. Purge Leaves
      const rootLeavesQuery = query(collection(db, "leaves"), where("schoolId", "==", targetSchoolId));
      const rootLeavesSnap = await getDocs(rootLeavesQuery);
      for (const d of rootLeavesSnap.docs) {
        await deleteDoc(d.ref);
      }

      // 4. Purge root Attendance keys matching this school's students
      const rootAttendanceSnap = await getDocs(collection(db, "attendance"));
      for (const d of rootAttendanceSnap.docs) {
        const data = d.data();
        const updatedRecords = { ...data };
        let modified = false;

        Object.keys(data).forEach((studentId) => {
          if (studentIds.has(studentId)) {
            delete updatedRecords[studentId];
            modified = true;
          }
        });

        if (modified) {
          const ref = doc(db, "attendance", d.id);
          if (Object.keys(updatedRecords).length === 0) {
            await deleteDoc(ref);
          } else {
            await setDoc(ref, updatedRecords);
          }
        }
      }

      setPurgeSuccess(true);
      await fetchCounts(targetSchoolId);
    } catch (err: any) {
      console.error("Purging root data failed:", err);
      setMigrationError("Purging root data failed: " + err.message);
    } finally {
      setPurgeLoading(false);
    }
  };

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

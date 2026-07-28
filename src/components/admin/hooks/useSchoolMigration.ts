import { useState, useEffect } from "react";
import { collection, query, getDocs, setDoc, doc, where, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { attendanceApi } from "../../../api/attendance";
import { School, UserProfile } from "../../../types";

export const useSchoolMigration = (schools: School[], userProfile: UserProfile | null) => {
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



  return {
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
  };
};

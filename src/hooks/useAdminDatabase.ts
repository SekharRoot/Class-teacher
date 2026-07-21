import { useState, useCallback, useEffect } from "react";
import { query, collection, where, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";
import { attendanceApi } from "../api";
import { School, UserProfile } from "../types";

interface UseAdminDatabaseProps {
  schools: School[];
  setError: (e: string) => void;
  setSuccess: (s: string) => void;
}

export function useAdminDatabase({ schools, setError, setSuccess }: UseAdminDatabaseProps) {
  const [dbSelectedSchoolId, setDbSelectedSchoolId] = useState<string>("");
  const [dbSelectedSchoolName, setDbSelectedSchoolName] = useState<string>("Default School");
  const [dbCounts, setDbCounts] = useState<{
    students: number;
    users: number;
    leaves: number;
    attendance: number;
    classes: number;
  }>({ students: 0, users: 0, leaves: 0, attendance: 0, classes: 0 });
  const [dbCountsLoading, setDbCountsLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  // 5-step database deletion states
  const [dbDeleteDialogueOpen, setDbDeleteDialogueOpen] = useState(false);
  const [dbDeleteStep, setDbDeleteStep] = useState(1);
  const [step2Checkboxes, setStep2Checkboxes] = useState({
    students: false,
    attendance: false,
    leaves: false,
    users: false,
  });
  const [step3Text, setStep3Text] = useState("");
  const [step4Select, setStep4Select] = useState("");
  const [dbDeleteLoading, setDbDeleteLoading] = useState(false);

  // Migration states
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState({ current: 0, total: 0 });
  const [migrationStatus, setMigrationStatus] = useState("");
  const [migrationSuccess, setMigrationSuccess] = useState(false);

  const fetchDbCounts = useCallback(async (schoolId: string) => {
    if (!schoolId) return;
    try {
      setDbCountsLoading(true);
      
      const usersQuery = query(collection(db, "users"), where("schoolId", "==", schoolId));
      const usersSnap = await getDocs(usersQuery);

      const classesQuery = query(collection(db, "schools", schoolId, "classes"));
      const classesSnap = await getDocs(classesQuery);
      const classIds = ["unassigned", ...classesSnap.docs.map(d => d.id)];

      let totalStudents = 0;
      let totalLeaves = 0;
      let totalAttendanceDocs = 0;

      await Promise.all(classIds.map(async (cId) => {
        const studentsSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "students"));
        totalStudents += studentsSnap.size;

        const leavesSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "leaves"));
        totalLeaves += leavesSnap.size;

        const attendanceSnap = await getDocs(collection(db, "schools", schoolId, "classes", cId, "attendance"));
        totalAttendanceDocs += attendanceSnap.size;
      }));

      setDbCounts({
        students: totalStudents,
        users: usersSnap.size,
        leaves: totalLeaves,
        attendance: totalAttendanceDocs,
        classes: classesSnap.size,
      });
    } catch (e: any) {
      console.error("Error fetching db counts:", e);
      setError("Failed to fetch statistics: " + e.message);
    } finally {
      setDbCountsLoading(false);
    }
  }, [setError]);

  useEffect(() => {
    if (!dbSelectedSchoolId && schools.length > 0) {
      const activeSchId = getActiveSchoolId() || "default_school";
      setDbSelectedSchoolId(activeSchId);
      const matched = schools.find((s) => s.id === activeSchId);
      if (matched) {
        setDbSelectedSchoolName(matched.name);
        fetchDbCounts(activeSchId);
      } else if (activeSchId === "default_school") {
        setDbSelectedSchoolName("Default School");
        fetchDbCounts(activeSchId);
      }
    }
  }, [schools, dbSelectedSchoolId, fetchDbCounts]);

  const handleExportDatabase = useCallback(async () => {
    if (!dbSelectedSchoolId) {
      setError("Please select a school to export.");
      return;
    }
    try {
      setDbCountsLoading(true);
      setError("");
      setSuccess("");
      
      const classesQuery = query(collection(db, "schools", dbSelectedSchoolId, "classes"));
      const classesSnap = await getDocs(classesQuery);
      const classesData = classesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const classIds = ["unassigned", ...classesData.map(c => c.id)];

      const studentsData: any[] = [];
      const leavesData: any[] = [];
      const attendanceData: any[] = [];

      await Promise.all(classIds.map(async (cId) => {
        const studentsSnap = await getDocs(collection(db, "schools", dbSelectedSchoolId, "classes", cId, "students"));
        studentsSnap.forEach((doc) => {
          studentsData.push({ id: doc.id, ...doc.data() });
        });

        const leavesSnap = await getDocs(collection(db, "schools", dbSelectedSchoolId, "classes", cId, "leaves"));
        leavesSnap.forEach((doc) => {
          leavesData.push({ id: doc.id, ...doc.data() });
        });

        const attendanceSnap = await getDocs(collection(db, "schools", dbSelectedSchoolId, "classes", cId, "attendance"));
        attendanceSnap.forEach((doc) => {
          attendanceData.push({ id: doc.id, records: doc.data() });
        });
      }));

      const usersSnap = await getDocs(query(collection(db, "users"), where("schoolId", "==", dbSelectedSchoolId)));
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      const backup = {
        exportVersion: 1,
        exportedAt: new Date().toISOString(),
        schoolId: dbSelectedSchoolId,
        schoolName: dbSelectedSchoolName,
        tables: {
          students: studentsData,
          users: usersData,
          leaves: leavesData,
          attendance: attendanceData,
          classes: classesData
        }
      };

      const fileData = JSON.stringify(backup, null, 2);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${dbSelectedSchoolName.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_db_backup.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`Database exported successfully for "${dbSelectedSchoolName}"!`);
    } catch (e: any) {
      console.error(e);
      setError("Failed to export database: " + e.message);
    } finally {
      setDbCountsLoading(false);
    }
  }, [dbSelectedSchoolId, dbSelectedSchoolName, setError, setSuccess]);

  const handleImportDatabase = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !dbSelectedSchoolId) return;

    try {
      setImportLoading(true);
      setError("");
      setSuccess("");

      const text = await file.text();
      const backup = JSON.parse(text);

      if (!backup.tables || !backup.schoolId) {
        throw new Error("Invalid database backup file format.");
      }

      const targetSchoolId = dbSelectedSchoolId;
      const targetSchoolName = dbSelectedSchoolName;
      const tables = backup.tables;

      if (tables.classes && Array.isArray(tables.classes)) {
        for (const cls of tables.classes) {
          const { id, ...docData } = cls;
          docData.schoolId = targetSchoolId;
          await setDoc(doc(db, "schools", targetSchoolId, "classes", id), docData, { merge: true });
        }
      }

      if (tables.students && Array.isArray(tables.students)) {
        for (const std of tables.students) {
          const { id, ...docData } = std;
          docData.schoolId = targetSchoolId;
          const cId = docData.classId || "unassigned";
          await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "students", id), docData, { merge: true });
        }
      }

      if (tables.leaves && Array.isArray(tables.leaves)) {
        for (const lv of tables.leaves) {
          const { id, ...docData } = lv;
          docData.schoolId = targetSchoolId;
          const cId = docData.classId || "unassigned";
          await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "leaves", id), docData, { merge: true });
        }
      }

      if (tables.users && Array.isArray(tables.users)) {
        for (const usr of tables.users) {
          const { id, ...docData } = usr;
          docData.schoolId = targetSchoolId;
          docData.schoolName = targetSchoolName;
          await setDoc(doc(db, "users", id), docData, { merge: true });
        }
      }

      if (tables.attendance && Array.isArray(tables.attendance)) {
        for (const record of tables.attendance) {
          const { id, records } = record;
          const classIdToRecords: Record<string, Record<string, any>> = {};
          Object.entries(records).forEach(([studentId, val]) => {
            const student = (tables.students || []).find((s: any) => s.id === studentId);
            const cId = student?.classId || "unassigned";
            if (!classIdToRecords[cId]) {
              classIdToRecords[cId] = {};
            }
            classIdToRecords[cId][studentId] = val;
          });

          for (const [cId, classRecords] of Object.entries(classIdToRecords)) {
            const ref = doc(db, "schools", targetSchoolId, "classes", cId, "attendance", id);
            await setDoc(ref, classRecords, { merge: true });
          }

          await attendanceApi.generateAndSaveSummary(id, records);
        }
      }

      setSuccess(`Database backup imported and merged successfully into "${targetSchoolName}"!`);
      await fetchDbCounts(targetSchoolId);
    } catch (e: any) {
      console.error(e);
      setError("Failed to import database: " + e.message);
    } finally {
      setImportLoading(false);
      event.target.value = "";
    }
  }, [dbSelectedSchoolId, dbSelectedSchoolName, fetchDbCounts, setError, setSuccess]);

  const handlePurgeDatabase = useCallback(async () => {
    if (!dbSelectedSchoolId) return;

    try {
      setDbDeleteLoading(true);
      setError("");
      setSuccess("");

      const targetSchoolId = dbSelectedSchoolId;

      const classesQuery = query(collection(db, "schools", targetSchoolId, "classes"));
      const classesSnap = await getDocs(classesQuery);
      const classIds = ["unassigned", ...classesSnap.docs.map(d => d.id)];

      for (const cId of classIds) {
        const studentsSnap = await getDocs(collection(db, "schools", targetSchoolId, "classes", cId, "students"));
        for (const doc of studentsSnap.docs) {
          await deleteDoc(doc.ref);
        }

        const leavesSnap = await getDocs(collection(db, "schools", targetSchoolId, "classes", cId, "leaves"));
        for (const doc of leavesSnap.docs) {
          await deleteDoc(doc.ref);
        }

        const attendanceSnap = await getDocs(collection(db, "schools", targetSchoolId, "classes", cId, "attendance"));
        for (const doc of attendanceSnap.docs) {
          await deleteDoc(doc.ref);
        }
      }

      for (const doc of classesSnap.docs) {
        await deleteDoc(doc.ref);
      }

      const summariesSnap = await getDocs(collection(db, "schools", targetSchoolId, "attendance_summaries"));
      for (const doc of summariesSnap.docs) {
        await deleteDoc(doc.ref);
      }

      const usersSnap = await getDocs(query(collection(db, "users"), where("schoolId", "==", targetSchoolId)));
      for (const doc of usersSnap.docs) {
        const uData = doc.data();
        const role = uData.role;
        const email = uData.email;
        if (role !== "owner" && role !== "admin" && email !== "sekhar.root@gmail.com") {
          await deleteDoc(doc.ref);
        }
      }

      setSuccess(`All Firestore database records for "${dbSelectedSchoolName}" have been permanently deleted!`);
      setDbDeleteDialogueOpen(false);
      await fetchDbCounts(targetSchoolId);
    } catch (e: any) {
      console.error(e);
      setError("Failed to delete database: " + e.message);
    } finally {
      setDbDeleteLoading(false);
    }
  }, [dbSelectedSchoolId, dbSelectedSchoolName, fetchDbCounts, setError, setSuccess]);

  const handleRunMigration = useCallback(async () => {
    try {
      setMigrationLoading(true);
      setMigrationSuccess(false);
      setMigrationStatus("Beginning database migration to nested schema...");

      setMigrationStatus("Migrating classes to school-specific configurations...");
      const rootClassesSnap = await getDocs(collection(db, "classes"));
      const rootClasses = rootClassesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      
      for (const cls of rootClasses) {
        const schId = cls.schoolId || "default_school";
        await setDoc(doc(db, "schools", schId, "classes", cls.id), {
          board: cls.board,
          classStandard: cls.classStandard,
          section: cls.section,
          schoolId: schId,
          createdAt: cls.createdAt || new Date().toISOString(),
        }, { merge: true });
      }

      setMigrationStatus("Migrating student registry...");
      const rootStudentsSnap = await getDocs(collection(db, "students"));
      const rootStudents = rootStudentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      for (const std of rootStudents) {
        const schId = std.schoolId || "default_school";
        const cId = std.classId || "unassigned";
        await setDoc(doc(db, "schools", schId, "classes", cId, "students", std.id), {
          firstName: std.firstName,
          lastName: std.lastName,
          rollNumber: std.rollNumber,
          classId: std.classId || "",
          gender: std.gender || "Male",
          fatherName: std.fatherName || "",
          motherName: std.motherName || "",
          phoneNumber: std.phoneNumber || "",
          boarderType: std.boarderType || "Day Scholar",
          image: std.image || "",
          profileId: std.profileId || `PRFL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          isActive: std.isActive !== undefined ? std.isActive : true,
          schoolId: schId,
        }, { merge: true });
      }

      setMigrationStatus("Migrating student leaves registry...");
      const rootLeavesSnap = await getDocs(collection(db, "leaves"));
      const rootLeaves = rootLeavesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));

      for (const lv of rootLeaves) {
        const schId = lv.schoolId || "default_school";
        const cId = lv.classId || "unassigned";
        await setDoc(doc(db, "schools", schId, "classes", cId, "leaves", lv.id), {
          ...lv,
          schoolId: schId,
        }, { merge: true });
      }

      setMigrationStatus("Migrating historical attendance records...");
      const rootAttendanceSnap = await getDocs(collection(db, "attendance"));
      const totalDocs = rootAttendanceSnap.size;

      if (totalDocs > 0) {
        setMigrationProgress({ current: 0, total: totalDocs });
        let count = 0;

        for (const d of rootAttendanceSnap.docs) {
          const dateString = d.id;
          const records = d.data();
          setMigrationStatus(`Migrating historical attendance for: ${dateString}...`);

          const group: Record<string, Record<string, Record<string, any>>> = {};

          Object.entries(records).forEach(([studentId, val]) => {
            const student = rootStudents.find(s => s.id === studentId);
            const schId = student?.schoolId || "default_school";
            const cId = student?.classId || "unassigned";

            const isObj = val && typeof val === "object";
            const status = isObj ? val.status : (val || "");
            const boarderType = isObj ? val.boarderType : (student?.boarderType ?? "");
            const remarks = val?.remarks || "";

            if (!group[schId]) {
              group[schId] = {};
            }
            if (!group[schId][cId]) {
              group[schId][cId] = {};
            }

            group[schId][cId][studentId] = {
              status,
              classId: student?.classId || "",
              boarderType,
              remarks,
            };
          });

          for (const [schId, schGroup] of Object.entries(group)) {
            for (const [cId, classRecords] of Object.entries(schGroup)) {
              const ref = doc(db, "schools", schId, "classes", cId, "attendance", dateString);
              await setDoc(ref, classRecords, { merge: true });
            }

            const flatRecords: Record<string, any> = {};
            Object.values(schGroup).forEach((classRecords) => {
              Object.assign(flatRecords, classRecords);
            });

            const originalSchoolId = localStorage.getItem("active_school_id");
            localStorage.setItem("active_school_id", schId);
            try {
              await attendanceApi.generateAndSaveSummary(dateString, flatRecords);
            } catch (err) {
              console.error("Failed to generate summary for school", schId, err);
            } finally {
              if (originalSchoolId) {
                localStorage.setItem("active_school_id", originalSchoolId);
              } else {
                localStorage.removeItem("active_school_id");
              }
            }
          }

          count++;
          setMigrationProgress({ current: count, total: totalDocs });
        }
      }

      setMigrationStatus(`Successfully migrated and optimized all database structures!`);
      setMigrationSuccess(true);
      setSuccess(`Database migration complete! Successfully restructured and verified all records into nested school-specific schemas.`);
    } catch (err: any) {
      console.error("Migration failed:", err);
      setError("Database optimization failed: " + err.message);
    } finally {
      setMigrationLoading(false);
    }
  }, [setError, setSuccess]);

  return {
    dbSelectedSchoolId,
    setDbSelectedSchoolId,
    dbSelectedSchoolName,
    setDbSelectedSchoolName,
    dbCounts,
    dbCountsLoading,
    importLoading,
    dbDeleteDialogueOpen,
    setDbDeleteDialogueOpen,
    dbDeleteStep,
    setDbDeleteStep,
    step2Checkboxes,
    setStep2Checkboxes,
    step3Text,
    setStep3Text,
    step4Select,
    setStep4Select,
    dbDeleteLoading,
    migrationLoading,
    migrationProgress,
    migrationStatus,
    migrationSuccess,
    fetchDbCounts,
    handleExportDatabase,
    handleImportDatabase,
    handlePurgeDatabase,
    handleRunMigration,
  };
}

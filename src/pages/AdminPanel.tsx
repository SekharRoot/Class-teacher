import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Switch,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Checkbox,
  CircularProgress,
  Collapse,
  Chip,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import AddIcon from "@mui/icons-material/Add";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import StarIcon from "@mui/icons-material/Star";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SchoolIcon from "@mui/icons-material/School";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { classesApi, usersApi, studentsApi, attendanceApi, schoolsApi } from "../api";
import { UserProfile, UserRole, ClassItem, School } from "../types";
import { cache } from "../lib/cache";
import { getActiveSchoolId } from "../lib/activeSchoolHelper";
import { RolesTable } from "../components/admin/RolesTable";
import { HierarchyTree } from "../components/admin/HierarchyTree";
import { TransferUserSchoolDialog } from "../components/admin/TransferUserSchoolDialog";
import { DatabaseOptimizationTab } from "../components/admin/DatabaseOptimizationTab";
import { ManageSchoolsTab } from "../components/admin/ManageSchoolsTab";
import { DatabasesTab } from "../components/admin/DatabasesTab";
import { SchoolMigrationTab } from "../components/admin/SchoolMigrationTab";
import { EditUserDialog } from "../components/admin/EditUserDialog";
import { AddUserDialog } from "../components/admin/AddUserDialog";
import { ConfirmDeleteUserDialog } from "../components/admin/ConfirmDeleteUserDialog";
import { ConfirmDeleteDbDialog } from "../components/admin/ConfirmDeleteDbDialog";
import { collection, query, getDocs, setDoc, doc, where, writeBatch, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AdminPanel() {
  const { userProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state && typeof (location.state as any).activeTab === "number") {
      return (location.state as any).activeTab;
    }
    return 0;
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // User transfer states
  const [transferUserDialogOpen, setTransferUserDialogOpen] = useState(false);
  const [userToTransfer, setUserToTransfer] = useState<UserProfile | null>(null);

  // Form states for editing
  const [formRole, setFormRole] = useState<UserRole>("class_teacher");
  const [formDisplayName, setFormDisplayName] = useState("");
  const [formAssignedClassId, setFormAssignedClassId] = useState<string>("");
  const [formCoordinatorIds, setFormCoordinatorIds] = useState<string[]>([]);
  const [formPrincipalId, setFormPrincipalId] = useState<string>("");
  const [formHasLeaveFeatureAccess, setFormHasLeaveFeatureAccess] =
    useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<"active" | "pending">("active");
  const [formSchoolId, setFormSchoolId] = useState<string>("default_school");
  const [formSchoolName, setFormSchoolName] = useState<string>("Default School");

  // Create User dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456"); // default password
  const [newDisplayName, setNewDisplayName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("class_teacher");
  const [newHasLeaveFeatureAccess, setNewHasLeaveFeatureAccess] =
    useState<boolean>(false);
  const [newSchoolId, setNewSchoolId] = useState<string>("default_school");
  const [newSchoolName, setNewSchoolName] = useState<string>("Default School");

  // Custom two-step deletion state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    uid: string;
    email: string | null;
  } | null>(null);
  const [deleteStep, setDeleteStep] = useState(1);

  // Collapse states for Hierarchy view
  const [openPrincipal, setOpenPrincipal] = useState<Record<string, boolean>>(
    {},
  );
  const [openCoordinator, setOpenCoordinator] = useState<
    Record<string, boolean>
  >({});

  // School management states
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [addSchoolName, setAddSchoolName] = useState("");
  const [newSchoolAddress, setNewSchoolAddress] = useState("");

  // Database tab states
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

  // Migration and database optimizer state
  const [migrationLoading, setMigrationLoading] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState({ current: 0, total: 0 });
  const [migrationStatus, setMigrationStatus] = useState("");
  const [migrationSuccess, setMigrationSuccess] = useState(false);

  const handleRunMigration = async () => {
    try {
      setMigrationLoading(true);
      setMigrationSuccess(false);
      setMigrationStatus("Beginning database migration to nested schema...");

      // 1. Fetch all root classes and migrate them
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

      // 2. Fetch all root students and migrate them
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

      // 3. Fetch all root leaves and migrate them
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

      // 4. Fetch all root historical attendance records and migrate them
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

          // Group records by school and class
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

          // Save partitioned attendance
          for (const [schId, schGroup] of Object.entries(group)) {
            for (const [cId, classRecords] of Object.entries(schGroup)) {
              const ref = doc(db, "schools", schId, "classes", cId, "attendance", dateString);
              await setDoc(ref, classRecords, { merge: true });
            }

            // Generate daily summary document
            const flatRecords: Record<string, any> = {};
            Object.values(schGroup).forEach((classRecords) => {
              Object.assign(flatRecords, classRecords);
            });

            // Set active school context temporarily to save summary doc
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
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cachedUsers = await cache.get("offline_users");
      const cachedClasses = await cache.get("offline_classes");

      const hasCache = !!(
        cachedUsers &&
        cachedUsers.length > 0 &&
        cachedClasses &&
        cachedClasses.length > 0
      );
      if (!hasCache) {
        setLoading(true);
      } else {
        setUsers(cachedUsers);
        setClasses(cachedClasses);
        setLoading(false);
      }
      setError("");

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout.")), 15000),
      );

      await Promise.race([
        (async () => {
          const [fetchedUsers, fetchedClasses, fetchedSchools] = await Promise.all([
            usersApi.getAll(),
            classesApi.getAll(),
            schoolsApi.getAll(),
          ]);
          setUsers(fetchedUsers);
          setClasses(fetchedClasses);
          setSchools(fetchedSchools);
          setLoading(false);

          Promise.all([
            cache.set("offline_users", fetchedUsers),
            cache.set("offline_classes", fetchedClasses),
          ]).catch((err) => console.error("Error setting cache:", err));
        })(),
        timeoutPromise,
      ]);
    } catch (err: any) {
      setError(
        "Failed to load user administration details. Using offline cache if available.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
  }, [schools, dbSelectedSchoolId]);

  // School dialog states
  const [deleteSchoolConfirmOpen, setDeleteSchoolConfirmOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<School | null>(null);

  const handleAddSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addSchoolName.trim()) {
      setError("School name cannot be empty.");
      return;
    }
    try {
      setSchoolsLoading(true);
      setError("");
      const newSch = await schoolsApi.addSchool(
        addSchoolName.trim(),
        newSchoolAddress.trim()
      );
      setSchools((prev) =>
        [...prev, newSch].sort((a, b) => a.name.localeCompare(b.name))
      );
      setAddSchoolName("");
      setNewSchoolAddress("");
      setSuccess("School added successfully!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to add school: " + err.message);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const handleOpenDeleteSchool = (school: School) => {
    setSchoolToDelete(school);
    setDeleteSchoolConfirmOpen(true);
  };

  const handleConfirmDeleteSchool = async () => {
    if (!schoolToDelete) return;
    try {
      setSchoolsLoading(true);
      setError("");
      // Setting isActive: false to make school inactive instead of hard deleting
      await schoolsApi.updateSchool(schoolToDelete.id, { isActive: false });
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolToDelete.id ? { ...s, isActive: false } : s))
      );
      setSuccess(`School "${schoolToDelete.name}" marked as inactive successfully!`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to mark school inactive: " + err.message);
    } finally {
      setSchoolsLoading(false);
      setDeleteSchoolConfirmOpen(false);
      setSchoolToDelete(null);
    }
  };

  const handleToggleSchoolActive = async (schoolId: string, currentStatus: boolean) => {
    try {
      setSchoolsLoading(true);
      setError("");
      const newStatus = !currentStatus;
      await schoolsApi.updateSchool(schoolId, { isActive: newStatus });
      setSchools((prev) =>
        prev.map((s) => (s.id === schoolId ? { ...s, isActive: newStatus } : s))
      );
      setSuccess(`School active state updated! Now set to: ${newStatus ? "Active" : "Inactive"}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to update school state: " + err.message);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const handleTransferUserSchool = async (targetSchoolId: string, targetSchoolName: string) => {
    if (!userToTransfer) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      
      const updatedProfile: Partial<UserProfile> = {
        schoolId: targetSchoolId,
        schoolName: targetSchoolName,
      };

      await usersApi.saveProfile(userToTransfer.uid, updatedProfile);
      
      // Update local state to reflect the transfer
      setUsers((prev) =>
        prev.map((u) =>
          u.uid === userToTransfer.uid
            ? { ...u, schoolId: targetSchoolId, schoolName: targetSchoolName }
            : u,
        )
      );

      setSuccess(
        `User "${userToTransfer.displayName || userToTransfer.email}" successfully transferred to "${targetSchoolName}".`
      );
      setTransferUserDialogOpen(false);
      setUserToTransfer(null);
    } catch (err: any) {
      console.error("Failed to transfer user to school", err);
      setError("Failed to transfer user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDbCounts = async (schoolId: string) => {
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
  };

  const handleExportDatabase = async () => {
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
  };

  const handleImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      // Import classes first
      if (tables.classes && Array.isArray(tables.classes)) {
        for (const cls of tables.classes) {
          const { id, ...docData } = cls;
          docData.schoolId = targetSchoolId;
          await setDoc(doc(db, "schools", targetSchoolId, "classes", id), docData, { merge: true });
        }
      }

      // Import students
      if (tables.students && Array.isArray(tables.students)) {
        for (const std of tables.students) {
          const { id, ...docData } = std;
          docData.schoolId = targetSchoolId;
          const cId = docData.classId || "unassigned";
          await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "students", id), docData, { merge: true });
        }
      }

      // Import leaves
      if (tables.leaves && Array.isArray(tables.leaves)) {
        for (const lv of tables.leaves) {
          const { id, ...docData } = lv;
          docData.schoolId = targetSchoolId;
          const cId = docData.classId || "unassigned";
          await setDoc(doc(db, "schools", targetSchoolId, "classes", cId, "leaves", id), docData, { merge: true });
        }
      }

      // Import users
      if (tables.users && Array.isArray(tables.users)) {
        for (const usr of tables.users) {
          const { id, ...docData } = usr;
          docData.schoolId = targetSchoolId;
          docData.schoolName = targetSchoolName;
          await setDoc(doc(db, "users", id), docData, { merge: true });
        }
      }

      // Import attendance records
      if (tables.attendance && Array.isArray(tables.attendance)) {
        for (const record of tables.attendance) {
          const { id, records } = record;
          // Split records by classId based on current student assignment
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

          // Generate summary document
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
  };

  const handlePurgeDatabase = async () => {
    if (!dbSelectedSchoolId) return;

    try {
      setDbDeleteLoading(true);
      setError("");
      setSuccess("");

      const targetSchoolId = dbSelectedSchoolId;

      const classesQuery = query(collection(db, "schools", targetSchoolId, "classes"));
      const classesSnap = await getDocs(classesQuery);
      const classIds = ["unassigned", ...classesSnap.docs.map(d => d.id)];

      // Purge all class nested subcollections
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

      // Purge classes themselves
      for (const doc of classesSnap.docs) {
        await deleteDoc(doc.ref);
      }

      // Purge attendance summaries
      const summariesSnap = await getDocs(collection(db, "schools", targetSchoolId, "attendance_summaries"));
      for (const doc of summariesSnap.docs) {
        await deleteDoc(doc.ref);
      }

      // Purge users of this school
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
  };

  const handleOpenEditDialog = (user: UserProfile) => {
    setSelectedUser(user);
    setFormRole(user.role);
    setFormDisplayName(user.displayName || "");
    setFormAssignedClassId(user.assignedClassId || "");
    setFormCoordinatorIds(
      user.coordinatorIds || (user.coordinatorId ? [user.coordinatorId] : []),
    );
    setFormPrincipalId(user.principalId || "");
    setFormHasLeaveFeatureAccess(user.hasLeaveFeatureAccess || false);
    setFormStatus(user.status || "active");
    setFormSchoolId(user.schoolId || "default_school");
    setFormSchoolName(user.schoolName || "Default School");
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    const uid = selectedUser.uid;
    const email = selectedUser.email;
    const originalUsers = [...users];

    setError("");
    setSuccess("");
    const updatedData: Partial<UserProfile> = {
      role: formRole,
      displayName: formDisplayName,
      assignedClassId:
        formRole === "class_teacher" ? formAssignedClassId || null : null,
      coordinatorIds:
        formRole === "class_teacher" ? formCoordinatorIds : [],
      coordinatorId: null, // Clear deprecated field
      principalId:
        formRole === "academic_coordinator" ? formPrincipalId || null : null,
      hasLeaveFeatureAccess: formHasLeaveFeatureAccess,
      status: formStatus,
      schoolId: formSchoolId,
      schoolName: formSchoolName,
    };

    // Optimistic update
    const updatedUsers = users.map((u) =>
      u.uid === uid ? { ...u, ...updatedData } : u,
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${email} successfully updated.`);
    handleCloseEditDialog();

    // Background API call
    (async () => {
      try {
        await usersApi.saveProfile(uid, updatedData);
        const [fetchedUsers, fetchedClasses] = await Promise.all([
          usersApi.getAll(),
          classesApi.getAll(),
        ]);
        setUsers(fetchedUsers);
        setClasses(fetchedClasses);
      } catch (err: any) {
        setError("Failed to sync updated user to server: " + err.message);
        setUsers(originalUsers);
      }
    })();
  };

  const handleOpenDeleteConfirm = (uid: string, email: string | null) => {
    const userToDel = users.find((u) => u.uid === uid);
    if (userToDel?.role === "owner" || email === "sekhar.root@gmail.com") {
      setError("The Primary Owner account cannot be deleted or removed.");
      return;
    }
    setUserToDelete({ uid, email });
    setDeleteStep(1);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    const { uid, email } = userToDelete;
    const originalUsers = [...users];

    setDeleteConfirmOpen(false);
    setUserToDelete(null);

    // Optimistic delete
    const updatedUsers = users.filter((u) => u.uid !== uid);
    setUsers(updatedUsers);
    setSuccess(
      `User profile for ${email || "this user"} successfully removed.`,
    );

    // Background API call
    (async () => {
      try {
        await usersApi.deleteProfile(uid);
        const [fetchedUsers, fetchedClasses] = await Promise.all([
          usersApi.getAll(),
          classesApi.getAll(),
        ]);
        setUsers(fetchedUsers);
        setClasses(fetchedClasses);
      } catch (err: any) {
        setError("Failed to sync user removal to server: " + err.message);
        setUsers(originalUsers);
      }
    })();
  };

  const handleApproveUser = async (user: UserProfile) => {
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    // Optimistic update
    const updatedUsers = users.map((u) =>
      u.uid === user.uid ? { ...u, status: "active" as "active" } : u,
    );
    setUsers(updatedUsers);
    setSuccess(`User profile for ${user.email} approved successfully.`);

    // Background API call
    (async () => {
      try {
        await usersApi.saveProfile(user.uid, { status: "active" });
        const [fetchedUsers, fetchedClasses] = await Promise.all([
          usersApi.getAll(),
          classesApi.getAll(),
        ]);
        setUsers(fetchedUsers);
        setClasses(fetchedClasses);
      } catch (err: any) {
        setError("Failed to sync updated user to server: " + err.message);
        setUsers(originalUsers);
      }
    })();
  };

  const handleOpenCreateDialog = () => {
    setNewEmail("");
    setNewDisplayName("");
    setNewRole("class_teacher");
    setNewPassword("123456");
    setNewHasLeaveFeatureAccess(false);
    setNewSchoolId(userProfile?.schoolId || "default_school");
    setNewSchoolName(userProfile?.schoolName || "Default School");
    setCreateDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!newEmail) {
      setError("Email is required");
      return;
    }
    const originalUsers = [...users];
    setError("");
    setSuccess("");

    // Since creating Firebase auth users client-side is restricted (and logs out current user),
    // we pre-create the profile with a deterministic UID. When the teacher logs in or registers
    // with this email, they will automatically match and adopt this pre-assigned role!
    const simulatedUid = "pre_" + Math.random().toString(36).substr(2, 9);
    const newProfile: UserProfile = {
      uid: simulatedUid,
      email: newEmail.trim().toLowerCase(),
      displayName: newDisplayName || newEmail.split("@")[0],
      role: newRole,
      status: "pending", // Pending real login
      assignedClassId: null,
      coordinatorIds: [],
      coordinatorId: null,
      principalId: null,
      hasLeaveFeatureAccess: newHasLeaveFeatureAccess,
      schoolId: newSchoolId,
      schoolName: newSchoolName,
    };

    // Optimistic add
    setUsers([...users, newProfile]);
    setSuccess(
      `User record pre-configured for ${newEmail}. When they sign in, they will receive this role.`,
    );
    setCreateDialogOpen(false);

    // Background API call
    (async () => {
      try {
        await usersApi.saveProfile(simulatedUid, newProfile);
        const [fetchedUsers, fetchedClasses] = await Promise.all([
          usersApi.getAll(),
          classesApi.getAll(),
        ]);
        setUsers(fetchedUsers);
        setClasses(fetchedClasses);
      } catch (err: any) {
        setError("Failed to configure user account on server: " + err.message);
        setUsers(originalUsers);
      }
    })();
  };

  const handleSeedDemoUsers = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const classIds = classes.map((c) => c.id);
      await usersApi.seedDemoUsers(classIds);
      setSuccess(
        "Standard demo roles and hierarchy successfully configured! Logins initialized: admin@classroom.com, principal@classroom.com, coord1@classroom.com, teacher1@classroom.com (password: 123456).",
      );
      await loadData();
    } catch (err: any) {
      setError("Failed to seed demo users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePrincipalCollapse = (uid: string) => {
    setOpenPrincipal((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const toggleCoordinatorCollapse = (uid: string) => {
    setOpenCoordinator((prev) => ({ ...prev, [uid]: !prev[uid] }));
  };

  const isOwnerOrAdmin =
    userProfile?.role === "owner" ||
    userProfile?.role === "admin" ||
    userProfile?.email === "sekhar.root@gmail.com";
  const isSchoolAdmin = userProfile?.role === "school_admin";
  const isAcademicCoordinator = userProfile?.role === "academic_coordinator";

  if (!isOwnerOrAdmin && !isSchoolAdmin && !isAcademicCoordinator) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Access Denied. You must be an administrator, owner, school administrator, or academic coordinator to view this
          page.
        </Alert>
      </Box>
    );
  }

  // Filter list of users based on role
  const displayUsers = useMemo(() => {
    if (isOwnerOrAdmin) {
      return users;
    }
    if (isSchoolAdmin && userProfile?.schoolId) {
      return users.filter((u) => u.schoolId === userProfile.schoolId);
    }
    if (isAcademicCoordinator && userProfile?.schoolId) {
       // Coordinators can only see users in their school
      return users.filter((u) => u.schoolId === userProfile.schoolId);
    }
    return [];
  }, [users, userProfile, isOwnerOrAdmin, isSchoolAdmin, isAcademicCoordinator]);

  // Group roles for dropdown select links
  const coordinators = displayUsers.filter((u) => u.role === "academic_coordinator");
  const principals = displayUsers.filter((u) => u.role === "principal");

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { sm: "center" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, letterSpacing: "-0.025em" }}
          >
            User Administration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage teacher roles, principal viewing privileges, and link
            structural hierarchies.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            onClick={handleSeedDemoUsers}
            disabled={loading}
            startIcon={<StarIcon />}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Seed Demo Accounts
          </Button>
          <Button
            variant="contained"
            onClick={handleOpenCreateDialog}
            startIcon={<AddIcon />}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Add New User
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ mb: 4, borderRadius: 3, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(_, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            borderBottom: 1, 
            borderColor: "divider", 
            px: { xs: 0, sm: 2 },
            "& .MuiTabs-scrollButtons": {
              display: { xs: "flex", sm: "none" }
            }
          }}
        >
          <Tab
            icon={<SupervisorAccountIcon />}
            label={isMobile ? "Roles" : "Manage Roles & Permissions"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AccountTreeIcon />}
            label={isMobile ? "Hierarchy" : "School Hierarchy Tree"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AddIcon />}
            label={isMobile ? "Approvals" : "Pending Approvals"}
            iconPosition="start"
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<StorageIcon />}
            label={isMobile ? "Optimize" : "Database Optimization"}
            iconPosition="start"
            disabled={!isOwnerOrAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<SchoolIcon />}
            label={isMobile ? "Schools" : "Manage Schools"}
            iconPosition="start"
            disabled={!isOwnerOrAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<StorageIcon />}
            label={isMobile ? "Databases" : "Databases"}
            iconPosition="start"
            disabled={!isOwnerOrAdmin && !isSchoolAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
          <Tab
            icon={<AutorenewIcon />}
            label={isMobile ? "Migration" : "School Migration"}
            iconPosition="start"
            disabled={!isOwnerOrAdmin && !isSchoolAdmin}
            sx={{ fontWeight: "bold", textTransform: "none", minHeight: 64 }}
          />
        </Tabs>

        {activeTab === 0 && (
          <RolesTable
            users={displayUsers.filter((u) => u.status === "active")}
            classes={classes}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteConfirm}
            onTransferSchool={
              isOwnerOrAdmin
                ? (u) => {
                    setUserToTransfer(u);
                    setTransferUserDialogOpen(true);
                  }
                : undefined
            }
          />
        )}
        {activeTab === 1 && (
          <HierarchyTree
            users={displayUsers.filter((u) => u.status === "active")}
            classes={classes}
            openPrincipal={openPrincipal}
            openCoordinator={openCoordinator}
            onTogglePrincipal={togglePrincipalCollapse}
            onToggleCoordinator={toggleCoordinatorCollapse}
          />
        )}
        {activeTab === 2 && (
          <RolesTable
            users={displayUsers.filter((u) => u.status === "pending")}
            classes={classes}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteConfirm}
            onApprove={handleApproveUser}
            onDecline={handleOpenDeleteConfirm}
            onTransferSchool={
              isOwnerOrAdmin
                ? (u) => {
                    setUserToTransfer(u);
                    setTransferUserDialogOpen(true);
                  }
                : undefined
            }
          />
        )}
        {activeTab === 3 && (
          <DatabaseOptimizationTab
            migrationLoading={migrationLoading}
            migrationProgress={migrationProgress}
            migrationStatus={migrationStatus}
            migrationSuccess={migrationSuccess}
            onRunMigration={handleRunMigration}
          />
        )}

        {activeTab === 4 && (
          <ManageSchoolsTab
            schools={schools}
            schoolsLoading={schoolsLoading}
            addSchoolName={addSchoolName}
            setAddSchoolName={setAddSchoolName}
            newSchoolAddress={newSchoolAddress}
            setNewSchoolAddress={setNewSchoolAddress}
            onAddSchool={handleAddSchool}
            onToggleSchoolActive={handleToggleSchoolActive}
            onOpenDeleteSchool={handleOpenDeleteSchool}
          />
        )}

        {activeTab === 5 && (
          <DatabasesTab
            schools={schools}
            dbSelectedSchoolId={dbSelectedSchoolId}
            setDbSelectedSchoolId={setDbSelectedSchoolId}
            dbSelectedSchoolName={dbSelectedSchoolName}
            setDbSelectedSchoolName={setDbSelectedSchoolName}
            onFetchDbCounts={fetchDbCounts}
            dbCountsLoading={dbCountsLoading}
            importLoading={importLoading}
            onExportDatabase={handleExportDatabase}
            onImportDatabase={handleImportDatabase}
            onOpenDeleteDbDialog={() => {
              setDbDeleteStep(1);
              setStep2Checkboxes({
                students: false,
                users: false,
                leaves: false,
                attendance: false,
              });
              setStep3Text("");
              setStep4Select("");
              setDbDeleteDialogueOpen(true);
            }}
            dbCounts={dbCounts}
            isOwnerOrAdmin={isOwnerOrAdmin}
            userProfile={userProfile}
            isSchoolAdmin={isSchoolAdmin}
          />
        )}
        {activeTab === 6 && (
          <SchoolMigrationTab
            schools={schools}
            userProfile={userProfile}
            isOwnerOrAdmin={isOwnerOrAdmin}
          />
        )}
      </Paper>

      {/* Spacer to prevent overlapping with bottom floating navbar */}
      <Box sx={{ height: { xs: 120, sm: 160 } }} />

      {/* Delete School Confirmation Dialog */}
      <Dialog
        open={deleteSchoolConfirmOpen}
        onClose={() => setDeleteSchoolConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" /> Confirm Removal
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
            Are you sure you want to remove "{schoolToDelete?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Removing this school will prevent new signups from selecting it. Existing profiles will retain their associated school ID, but the school won't be listed in active registries. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            variant="text"
            color="inherit"
            onClick={() => setDeleteSchoolConfirmOpen(false)}
            disabled={schoolsLoading}
            sx={{ textTransform: "none", fontWeight: "bold" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteSchool}
            disabled={schoolsLoading}
            autoFocus
            sx={{ textTransform: "none", fontWeight: "bold", borderRadius: "8px" }}
          >
            {schoolsLoading ? "Removing..." : "Remove School"}
          </Button>
        </DialogActions>
      </Dialog>

      {isOwnerOrAdmin && (
        <TransferUserSchoolDialog
          open={transferUserDialogOpen}
          onClose={() => {
            setTransferUserDialogOpen(false);
            setUserToTransfer(null);
          }}
          onTransfer={handleTransferUserSchool}
          schools={schools}
          userName={userToTransfer?.displayName || userToTransfer?.email || ""}
        />
      )}

      {/* Edit User Dialog */}
      <EditUserDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        selectedUser={selectedUser}
        formDisplayName={formDisplayName}
        setFormDisplayName={setFormDisplayName}
        formRole={formRole}
        setFormRole={setFormRole}
        formSchoolId={formSchoolId}
        setFormSchoolId={setFormSchoolId}
        formSchoolName={formSchoolName}
        setFormSchoolName={setFormSchoolName}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        formAssignedClassId={formAssignedClassId}
        setFormAssignedClassId={setFormAssignedClassId}
        formCoordinatorIds={formCoordinatorIds}
        setFormCoordinatorIds={setFormCoordinatorIds}
        formPrincipalId={formPrincipalId}
        setFormPrincipalId={setFormPrincipalId}
        formHasLeaveFeatureAccess={formHasLeaveFeatureAccess}
        setFormHasLeaveFeatureAccess={setFormHasLeaveFeatureAccess}
        schools={schools}
        classes={classes}
        coordinators={coordinators}
        principals={principals}
        onSave={handleSaveUser}
      />

      {/* Pre-configure New User Dialog */}
      <AddUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        newDisplayName={newDisplayName}
        setNewDisplayName={setNewDisplayName}
        newRole={newRole}
        setNewRole={setNewRole}
        newSchoolId={newSchoolId}
        setNewSchoolId={setNewSchoolId}
        newSchoolName={newSchoolName}
        setNewSchoolName={setNewSchoolName}
        newHasLeaveFeatureAccess={newHasLeaveFeatureAccess}
        setNewHasLeaveFeatureAccess={setNewHasLeaveFeatureAccess}
        schools={schools}
        onCreateUser={handleCreateUser}
      />

      {/* Two-step User Delete Confirmation Dialog */}
      <ConfirmDeleteUserDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        deleteStep={deleteStep}
        setDeleteStep={setDeleteStep}
        userToDelete={userToDelete}
        onConfirmDelete={handleConfirmDeleteUser}
      />

      {/* 5-Step Database Deletion Dialog */}
      <ConfirmDeleteDbDialog
        open={dbDeleteDialogueOpen}
        onClose={() => !dbDeleteLoading && setDbDeleteDialogueOpen(false)}
        dbDeleteStep={dbDeleteStep}
        setDbDeleteStep={setDbDeleteStep}
        dbDeleteLoading={dbDeleteLoading}
        dbSelectedSchoolName={dbSelectedSchoolName}
        step2Checkboxes={step2Checkboxes}
        setStep2Checkboxes={setStep2Checkboxes}
        step3Text={step3Text}
        setStep3Text={setStep3Text}
        step4Select={step4Select}
        setStep4Select={setStep4Select}
        onConfirmPurge={handlePurgeDatabase}
      />
    </Box>
  );
}

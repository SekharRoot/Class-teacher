import { useState } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { firebaseConfig, getFirestoreForDbId } from "../../../lib/firebase";

export const useCrossDatabaseMigration = () => {
  const configDbs = (firebaseConfig as any).alternateDatabases || [
    { id: "ai-studio-classroommanager-8aa49b14-f5c6-4205-880f-741ed7c2c80a", name: "Primary Database (Active)" },
    { id: "ai-studio-classroommanager-alternate-db", name: "Alternate Database (Secondary)" },
    { id: "ai-studio-classroommanager-backup-db", name: "Archive / Backup Database" },
    { id: "(default)", name: "Default Database Instance" }
  ];
  
  const primaryDbId = (firebaseConfig as any).firestoreDatabaseId || "(default)";
  const [sourceDbId, setSourceDbId] = useState<string>(primaryDbId);
  const [targetDbId, setTargetDbId] = useState<string>(() => {
    const secondDb = configDbs.find((db: any) => db.id !== primaryDbId);
    return secondDb ? secondDb.id : (configDbs[1]?.id || "");
  });

  const [isTransferring, setIsTransferring] = useState(false);
  const [transferProgress, setTransferProgress] = useState(0);
  const [transferStatus, setTransferStatus] = useState("");
  const [transferLog, setTransferLog] = useState<string[]>([]);
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferError, setTransferError] = useState("");

  const [transferOptions, setTransferOptions] = useState({
    schools: true,
    classes: true,
    students: true,
    leaves: true,
    attendance: true,
    users: true,
  });

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTransferLog((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleTransfer = async () => {
    if (!sourceDbId || !targetDbId) {
      setTransferError("Please select both source and target databases.");
      return;
    }
    if (sourceDbId === targetDbId) {
      setTransferError("Source and target databases cannot be the same database instance.");
      return;
    }

    setIsTransferring(true);
    setTransferProgress(0);
    setTransferStatus("Initializing connection to databases...");
    setTransferLog([
      `[INFO] Starting cross-database migration...`,
      `[INFO] Source Database: ${sourceDbId}`,
      `[INFO] Target Database: ${targetDbId}`,
      `[INFO] Configurations: ${Object.entries(transferOptions)
        .filter(([_, val]) => val)
        .map(([key]) => key)
        .join(", ")}`,
    ]);
    setTransferSuccess("");
    setTransferError("");

    try {
      addLog("Initializing Source and Target Firestore connections...");
      const srcDb = getFirestoreForDbId(sourceDbId);
      const dstDb = getFirestoreForDbId(targetDbId);

      let progress = 5;
      setTransferProgress(progress);

      // 1. Schools Collection
      let schoolDocs: any[] = [];
      if (transferOptions.schools) {
        setTransferStatus("Fetching schools from source database...");
        addLog("Querying root 'schools' collection in source DB...");
        const schoolsSnap = await getDocs(collection(srcDb, "schools"));
        schoolDocs = schoolsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        addLog(`Found ${schoolDocs.length} schools in source database.`);

        setTransferStatus("Migrating schools to target database...");
        for (const sDoc of schoolDocs) {
          const { id, ...data } = sDoc;
          addLog(`Migrating school document: ${data.name || id}...`);
          await setDoc(doc(dstDb, "schools", id), data, { merge: true });
        }
        addLog("[Success] Root 'schools' collection transferred.");
      } else {
        addLog("Skipping schools collection transfer. Querying source schools list for subcollection context...");
        const schoolsSnap = await getDocs(collection(srcDb, "schools"));
        schoolDocs = schoolsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }
      progress = 25;
      setTransferProgress(progress);

      // 2. Users Collection
      if (transferOptions.users) {
        setTransferStatus("Fetching system users from source database...");
        addLog("Querying root 'users' collection in source DB...");
        const usersSnap = await getDocs(collection(srcDb, "users"));
        const userDocs: any[] = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        addLog(`Found ${userDocs.length} users in source database.`);

        setTransferStatus("Migrating users to target database...");
        for (const uDoc of userDocs) {
          const { id, ...data } = uDoc;
          addLog(`Migrating user document: ${data.email || id}...`);
          await setDoc(doc(dstDb, "users", id), data, { merge: true });
        }
        addLog("[Success] Root 'users' collection transferred.");
      }
      progress = 40;
      setTransferProgress(progress);

      // 3. Subcollection Hierarchy Migration
      const schoolIds = ["default_school", ...schoolDocs.map((s) => s.id)];
      addLog(`Preparing to scan subcollections for ${schoolIds.length} school IDs...`);
      
      let currentStep = 0;
      const totalSteps = schoolIds.length;

      for (const sId of schoolIds) {
        addLog(`Scanning tenancy scope for schoolId: [${sId}]`);
        
        // Classes Collection
        setTransferStatus(`Fetching classes for school tenancy [${sId}]...`);
        const classesSnap = await getDocs(collection(srcDb, "schools", sId, "classes"));
        const classDocs = classesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
        if (transferOptions.classes && classDocs.length > 0) {
          addLog(`Found ${classDocs.length} classes for school [${sId}]. Transferring...`);
          for (const cDoc of classDocs) {
            const { id, ...data } = cDoc;
            await setDoc(doc(dstDb, "schools", sId, "classes", id), data, { merge: true });
          }
        }
        
        const classIds = ["unassigned", ...classDocs.map((c) => c.id)];

        for (const cId of classIds) {
          // Students Subcollection
          if (transferOptions.students) {
            const studentsSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "students"));
            if (!studentsSnap.empty) {
              addLog(`Found ${studentsSnap.size} students in school [${sId}], class [${cId}]. Copying...`);
              for (const stdDoc of studentsSnap.docs) {
                await setDoc(doc(dstDb, "schools", sId, "classes", cId, "students", stdDoc.id), stdDoc.data(), { merge: true });
              }
            }
          }
          
          // Leaves Subcollection
          if (transferOptions.leaves) {
            const leavesSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "leaves"));
            if (!leavesSnap.empty) {
              addLog(`Found ${leavesSnap.size} leave requests in school [${sId}], class [${cId}]. Copying...`);
              for (const lvDoc of leavesSnap.docs) {
                await setDoc(doc(dstDb, "schools", sId, "classes", cId, "leaves", lvDoc.id), lvDoc.data(), { merge: true });
              }
            }
          }

          // Attendance Subcollection
          if (transferOptions.attendance) {
            const attendanceSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "attendance"));
            if (!attendanceSnap.empty) {
              addLog(`Found ${attendanceSnap.size} attendance sheets in school [${sId}], class [${cId}]. Copying...`);
              for (const attDoc of attendanceSnap.docs) {
                await setDoc(doc(dstDb, "schools", sId, "classes", cId, "attendance", attDoc.id), attDoc.data(), { merge: true });
              }
            }
          }
        }
        
        currentStep++;
        const currentProgress = 40 + Math.floor((currentStep / totalSteps) * 55);
        setTransferProgress(currentProgress);
      }

      setTransferProgress(100);
      setTransferStatus("Cross-database migration completed successfully!");
      addLog("[SUCCESS] Database transfer completely executed.");
      setTransferSuccess("The whole database schema, document records, and nested tenancies have been successfully transferred!");
    } catch (err: any) {
      console.error("Migration transfer error:", err);
      addLog(`[ERROR] Transfer failed: ${err.message}`);
      setTransferError("Database transfer failed: " + err.message);
    } finally {
      setIsTransferring(false);
    }
  };

  return {
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
  };
};

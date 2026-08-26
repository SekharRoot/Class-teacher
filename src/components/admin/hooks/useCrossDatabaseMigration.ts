import { useState } from "react";
import { collection, getDocs, writeBatch, doc, Firestore } from "firebase/firestore";
import { firebaseConfig, getFirestoreForDbId } from "../../../lib/firebase";

// Helper function to safely commit writes in batches of 400 (Firestore limit is 500)
async function batchWriteDocs(
  dstDb: Firestore,
  operations: { path: string; id: string; data: any }[],
  onBatchProgress?: (completed: number, total: number) => void
) {
  const BATCH_SIZE = 400;
  const total = operations.length;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const chunk = operations.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(dstDb);
    for (const op of chunk) {
      const docRef = doc(dstDb, op.path, op.id);
      batch.set(docRef, op.data, { merge: true });
    }
    await batch.commit();
    if (onBatchProgress) {
      onBatchProgress(Math.min(i + BATCH_SIZE, total), total);
    }
  }
}

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
        schoolDocs = schoolsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        addLog(`Found ${schoolDocs.length} schools in source database.`);

        if (schoolDocs.length > 0) {
          setTransferStatus("Migrating schools to target database using batch operations...");
          const schoolOps = schoolDocs.map((s) => {
            const { id, ...data } = s;
            return { path: "schools", id, data };
          });
          await batchWriteDocs(dstDb, schoolOps);
          addLog(`[Success] ${schoolDocs.length} root 'schools' records transferred.`);
        }
      } else {
        addLog("Skipping schools collection transfer. Querying source schools list for subcollection context...");
        const schoolsSnap = await getDocs(collection(srcDb, "schools"));
        schoolDocs = schoolsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
      progress = 25;
      setTransferProgress(progress);

      // 2. Users Collection
      if (transferOptions.users) {
        setTransferStatus("Fetching system users from source database...");
        addLog("Querying root 'users' collection in source DB...");
        const usersSnap = await getDocs(collection(srcDb, "users"));
        const userDocs: any[] = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        addLog(`Found ${userDocs.length} users in source database.`);

        if (userDocs.length > 0) {
          setTransferStatus("Migrating users to target database using batch operations...");
          const userOps = userDocs.map((u) => {
            const { id, ...data } = u;
            return { path: "users", id, data };
          });
          await batchWriteDocs(dstDb, userOps);
          addLog(`[Success] ${userDocs.length} root 'users' records transferred.`);
        }
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
        const classDocs = classesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        if (transferOptions.classes && classDocs.length > 0) {
          addLog(`Found ${classDocs.length} classes for school [${sId}]. Transferring in batch...`);
          const classOps = classDocs.map((c) => {
            const { id, ...data } = c;
            return { path: `schools/${sId}/classes`, id, data };
          });
          await batchWriteDocs(dstDb, classOps);
          addLog(`[Success] Transferred ${classDocs.length} classes for [${sId}].`);
        }
        
        const classIds = ["unassigned", ...classDocs.map((c) => c.id)];

        for (const cId of classIds) {
          // Students Subcollection
          if (transferOptions.students) {
            const studentsSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "students"));
            if (!studentsSnap.empty) {
              addLog(`Found ${studentsSnap.size} students in school [${sId}], class [${cId}]. Copying via batch write...`);
              const studentOps = studentsSnap.docs.map((stdDoc) => ({
                path: `schools/${sId}/classes/${cId}/students`,
                id: stdDoc.id,
                data: stdDoc.data()
              }));
              await batchWriteDocs(dstDb, studentOps);
            }
          }
          
          // Leaves Subcollection
          if (transferOptions.leaves) {
            const leavesSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "leaves"));
            if (!leavesSnap.empty) {
              addLog(`Found ${leavesSnap.size} leave requests in school [${sId}], class [${cId}]. Copying via batch write...`);
              const leaveOps = leavesSnap.docs.map((lvDoc) => ({
                path: `schools/${sId}/classes/${cId}/leaves`,
                id: lvDoc.id,
                data: lvDoc.data()
              }));
              await batchWriteDocs(dstDb, leaveOps);
            }
          }

          // Attendance Subcollection
          if (transferOptions.attendance) {
            const attendanceSnap = await getDocs(collection(srcDb, "schools", sId, "classes", cId, "attendance"));
            if (!attendanceSnap.empty) {
              addLog(`Found ${attendanceSnap.size} attendance sheets in school [${sId}], class [${cId}]. Copying via batch write...`);
              const attOps = attendanceSnap.docs.map((attDoc) => ({
                path: `schools/${sId}/classes/${cId}/attendance`,
                id: attDoc.id,
                data: attDoc.data()
              }));
              await batchWriteDocs(dstDb, attOps);
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

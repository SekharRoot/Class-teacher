import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import config from "./firebase-applet-config.json";

async function main() {
  console.log("Initializing firebase-admin with projectId:", config.projectId);
  const app = initializeApp({
    projectId: config.projectId,
  });

  const dbInstance = getFirestore(app, config.firestoreDatabaseId);

  console.log("\nListing all classes in schools/default_school/classes:");
  const classesSnap = await dbInstance.collection("schools").doc("default_school").collection("classes").get();
  console.log(`Found ${classesSnap.size} classes.`);
  
  let found = false;
  for (const classDoc of classesSnap.docs) {
    const classId = classDoc.id;
    console.log(`Checking students in class: ${classId}`);
    const studentsSnap = await dbInstance.collection("schools").doc("default_school").collection("classes").doc(classId).collection("students").get();
    console.log(`- Found ${studentsSnap.size} students.`);
    studentsSnap.forEach((doc) => {
      const data = doc.data();
      const firstName = data.firstName || "";
      const lastName = data.lastName || "";
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      
      if (
        fullName.includes("priyadarshini") ||
        fullName.includes("sahoo") ||
        doc.id.toLowerCase().includes("priyadarshini")
      ) {
        console.log(`\nFOUND MATCHING STUDENT:`);
        console.log(`- Path: ${doc.ref.path}`);
        console.log(`- ID: ${doc.id}`);
        console.log(`- Name: ${firstName} ${lastName}`);
        console.log(`- Data:`, JSON.stringify(data, null, 2));
        found = true;
      }
    });
  }

  // Check unassigned students as well
  console.log("Checking students in class: unassigned");
  const unassignedSnap = await dbInstance.collection("schools").doc("default_school").collection("classes").doc("unassigned").collection("students").get();
  console.log(`- Found ${unassignedSnap.size} students.`);
  unassignedSnap.forEach((doc) => {
    const data = doc.data();
    const firstName = data.firstName || "";
    const lastName = data.lastName || "";
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    
    if (
      fullName.includes("priyadarshini") ||
      fullName.includes("sahoo") ||
      doc.id.toLowerCase().includes("priyadarshini")
    ) {
      console.log(`\nFOUND MATCHING STUDENT (unassigned):`);
      console.log(`- Path: ${doc.ref.path}`);
      console.log(`- ID: ${doc.id}`);
      console.log(`- Name: ${firstName} ${lastName}`);
      console.log(`- Data:`, JSON.stringify(data, null, 2));
      found = true;
    }
  });

  if (!found) {
    console.log("No student matching 'Priyadarshini' or 'Sahoo' found.");
  }
}

main().catch(console.error);

import { initializeApp } from "firebase/app";
import { getFirestore, collection, collectionGroup, getDocs, query, where } from "firebase/firestore";
import config from "./firebase-applet-config.json";

async function main() {
  const app = initializeApp(config);
  const db = getFirestore(app, config.firestoreDatabaseId);

  console.log("Searching for 'Priyadarshini Sahoo' across all students...");
  const qGroup = query(collectionGroup(db, "students"));
  const snapGroup = await getDocs(qGroup);
  
  console.log(`Found ${snapGroup.size} total students.`);
  let found = false;
  snapGroup.forEach((doc) => {
    const data = doc.data();
    const fullName = `${data.firstName || ""} ${data.lastName || ""}`.toLowerCase();
    if (fullName.includes("priyadarshini") || fullName.includes("sahoo") || doc.id.toLowerCase().includes("priyadarshini")) {
      console.log(`MATCHED STUDENT: ID=${doc.id}, Path=${doc.ref.path}`, JSON.stringify(data, null, 2));
      found = true;
    }
  });

  if (!found) {
    console.log("No student matching 'Priyadarshini' or 'Sahoo' was found in the students collection.");
  }

  console.log("\nListing all classes in default_school:");
  const classesSnap = await getDocs(collection(db, "schools", "default_school", "classes"));
  classesSnap.forEach(doc => {
    console.log(`Class ID: ${doc.id}`, JSON.stringify(doc.data(), null, 2));
  });
}

main().catch(console.error);

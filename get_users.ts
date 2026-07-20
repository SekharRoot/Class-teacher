import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import config from "./firebase-applet-config.json";

async function main() {
  console.log("Initializing firebase-admin with projectId:", config.projectId);
  const app = initializeApp({
    projectId: config.projectId,
  });

  const dbInstance = getFirestore(app, config.firestoreDatabaseId);

  console.log("Listing all users:");
  const usersSnap = await dbInstance.collection("users").get();
  console.log(`Found ${usersSnap.size} users.`);
  usersSnap.forEach(doc => {
    console.log(`User ID: ${doc.id}`, JSON.stringify(doc.data(), null, 2));
  });
}

main().catch(console.error);

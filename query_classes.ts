import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-studio-classroommanager-8aa49b14-f5c6-4205-880f-741ed7c2c80a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const querySnapshot = await getDocs(collection(db, "classes"));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  process.exit(0);
}

main().catch(console.error);

const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({
  projectId: "ai-studio-classroommanager-8aa49b14-f5c6-4205-880f-741ed7c2c80a"
});
const db = getFirestore();

async function main() {
  const querySnapshot = await db.collection("classes").get();
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
  
  const querySnapshot2 = await db.collection("students").get();
  console.log("Students:", querySnapshot2.size);
  querySnapshot2.forEach(doc => {
      let data = doc.data();
      if(data.classId && typeof data.classId === 'string' && data.classId.toLowerCase().includes('xii')) {
          console.log("Student in XII: ", doc.id, data.firstName, data.lastName, "classId:", data.classId);
      }
  })
}

main().catch(console.error);

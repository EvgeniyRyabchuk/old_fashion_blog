const admin = require("firebase-admin");
const fs = require("fs");
const { Timestamp } = admin.firestore;


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../json/serviceAccount.json")),
  });
}

const db = admin.firestore();

async function seedDatabase() {
  const data = JSON.parse(fs.readFileSync("./json/seed-data-2.json", "utf8"));
    
  for (const [collectionName, docs] of Object.entries(data)) {
    for (const [docId, docData] of Object.entries(docs)) { 
        docData.createdAt = Timestamp.now();
      await db.collection(collectionName).doc(docId).set(docData);
      console.log(`✅ Inserted ${collectionName}/${docId}`);
    }
  }
  
  console.log("🎉 Seeding complete!");
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error("🔥 Error seeding Firestore:", err);
  process.exit(1);
});

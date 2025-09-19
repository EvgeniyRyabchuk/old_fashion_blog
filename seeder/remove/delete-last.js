require('dotenv').config(); // loads .env file into process.env

const postCount = process.env.POST_COUNT ? parseInt(process.env.POST_COUNT) : 5;


const admin = require("firebase-admin");
const serviceAccount = require("../json/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function deleteLatestDocs(collectionName, n = 5) {
  const snapshot = await db
    .collection(collectionName)
    .orderBy("createdAt", "desc")
    .limit(n)
    .get();

  if (snapshot.empty) {
    console.log("No documents found.");
    return;
  }
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));

  await batch.commit();
  console.log(`✅ Deleted ${snapshot.size} documents from '${collectionName}'`);
}

// Example usage: delete last 3 posts
deleteLatestDocs("posts", postCount)
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

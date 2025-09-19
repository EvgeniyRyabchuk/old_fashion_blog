// seeder/deleteCollection.js
const admin = require("firebase-admin");
require("dotenv").config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../json/serviceAccount.json")),
  });
}

const db = admin.firestore();

/**
 * Delete all documents in a collection
 * @param {string} collectionPath
 * @param {number} batchSize
 */
async function deleteCollection(collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy("__name__").limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve).catch(reject); 
  });
}

async function deleteQueryBatch(query, resolve) {
  const snapshot = await query.get();

  if (snapshot.empty) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // keep deleting until collection is empty
  process.nextTick(() => {
    deleteQueryBatch(query, resolve);
  });
}

// Example: delete "posts" collection

function _delete (colName) {
    deleteCollection(colName)
    .then(() => {
        console.log(`✅ Deleted all docs in '${colName}'`);
        process.exit(0);
    })
    .catch((err) => {
        console.error(`🔥 Error deleting collection ${colName}:`, err);
        process.exit(1);
    });

  }

_delete("comments"); 
_delete("post_tag");
_delete("tags");
_delete("posts");
_delete("categories"); 
_delete("users"); 
_delete("admins"); 

// loads .env file into process.env
require('dotenv').config(); 

const fs = require("fs");

const postCount = process.env.POST_COUNT ? parseInt(process.env.POST_COUNT) : 1;

const tagMinCountToCreateNew = process.env.POST_COUNT ? parseInt(process.env.TAG_MIN_COUNT_TO_CREATE_NEW) : 1;
const tagMinCount = process.env.POST_COUNT ? parseInt(process.env.TAG_MIN_COUNT) : 1; 
const tagMaxCount = process.env.POST_COUNT ? parseInt(process.env.TAG_MAX_COUNT) : 1;

const commentMinCount = process.env.POST_COUNT ? parseInt(process.env.COMMENT_MIN_COUNT) : 1;
const commentMaxCount = process.env.POST_COUNT ? parseInt(process.env.COMMENT_MAX_COUNT) : 1;


const admin = require("firebase-admin");
const { faker } = require("@faker-js/faker");
const serviceAccount = require("../json/serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();



async function getOrCreateTags(tagMinCountToCreateNew = 0) {
  const tagsSnapshot = await db.collection("tags").get();
  let tags = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // if less than 10 tags, create some
  while (tags.length < tagMinCountToCreateNew) {
    const tagRef = db.collection("tags").doc();
    const name = faker.lorem.word();
    await tagRef.set({ name });
    tags.push({ id: tagRef.id, name });
  }
  console.log(tags);
  return tags;
}
async function attachTagsToPost(batch, postRef, tags, tagMinCount, tagMaxCount) {
      // Attach 1-3 random tags
    const numTags = faker.number.int({ min: tagMinCount, max: tagMaxCount });
    const selectedTags = faker.helpers.arrayElements(tags, numTags);
    
    selectedTags.forEach(tag => {
      const postTagRef = db.collection("post_tag").doc();
      batch.set(postTagRef, {
        postId: postRef.id,
        tagId: tag.id,
      });
    });
}
async function createComments(batch, postRef, commentMinCount, commentMaxCount) {
  const usersSnapshot = await db.collection("users").get();
  if (usersSnapshot.empty) {
    console.log("No users found! Please create users first.");
    return;
  }
  const users = usersSnapshot.docs.map(doc => doc.id); // just need IDs
  const numComments = faker.number.int({ min: commentMinCount, max: commentMaxCount });
    
  // ... inside the loop for each post, when creating comments:
  for (let j = 0; j < numComments; j++) {
    const commentRef = db.collection("comments").doc();
    const userId = users[Math.floor(Math.random() * users.length)]; // pick random existing user
    batch.set(commentRef, {
      postId: postRef.id,
      userId,
      content: faker.lorem.sentence(),
      createdAt: admin.firestore.Timestamp.now(),
    });
  }

}

async function getCategoriesOrCreateIfNotExist() {
  let catSnapshot = await db.collection("categories").get();
  
  if (catSnapshot.empty) {
    const staticCategories = JSON.parse(
      fs.readFileSync("./json/categories.json", "utf8")
    );

    const batch = db.batch();
    const catCol = db.collection("categories");

    staticCategories.forEach((sc) => {
      const docRef = catCol.doc();
      batch.set(docRef, { name: sc.name });
    });

    await batch.commit();
    console.log("Categories seeded!");
    catSnapshot = await catCol.get();
  }

  return catSnapshot;
}

async function getUsersAndAdminsOrCreateIfNotExist() {
   const staticData = JSON.parse(
    fs.readFileSync("./json/users.json", "utf8")
  );

  const batch = db.batch();

  // USERS
  const usersCol = db.collection("users");
  for (const [uid, user] of Object.entries(staticData.users)) {
    const docRef = usersCol.doc(uid); // use UID as document ID
    batch.set(docRef, user, { merge: true });
  }

  // ADMINS
  const adminsCol = db.collection("admins");
  for (const [uid, adminData] of Object.entries(staticData.admins)) {
    const docRef = adminsCol.doc(uid); // use UID as document ID
    batch.set(docRef, adminData, { merge: true });
  }

  await batch.commit();
  console.log("✅ Users & Admins seeded");
}

function generateFakePostContent() {
  const title = faker.lorem.sentence();
  const subtitle = faker.lorem.sentence();
  const paragraphs = Array.from({ length: 4 }, () => `<p>${faker.lorem.paragraph()}</p>`).join("\n");

  // Add some random images
  const images = Array.from({ length: 2 }, () => 
    `<img src="https://picsum.photos/800/400?random=${faker.number.int(1000)}" alt="${faker.lorem.word()}">`
  ).join("\n");

  const content = `
    <p>
      <p>
        <h1>${title}</h1>
        <h2>${subtitle}</h2>
        <p class="meta">By ${faker.person.fullName()} • ${faker.date.past().toDateString()}</p>
      </p>
      
      <p>
        ${paragraphs}
        ${images}
        <h3>${faker.lorem.sentence()}</h3>
        <p>${faker.lorem.paragraphs(2, "<br><br>")}</p>
        <blockquote>${faker.lorem.sentence()}</blockquote>
        <p>${faker.lorem.paragraph()}</p>
      </p>
    </p>
  `;

  return content;
}



async function seedPostsWithTagsAndComments(count = 5) {
  const tags = await getOrCreateTags(tagMinCountToCreateNew); 
  
  await getUsersAndAdminsOrCreateIfNotExist(); 
  
  const catSnapshot = await getCategoriesOrCreateIfNotExist();
  const categories = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const batch = db.batch();

  // creating posts 
  for (let i = 0; i < count; i++) {
    const postRef = db.collection("posts").doc();
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const startYear = faker.number.int({ min: 2015, max: 2025 });
    const endYear = faker.number.int({ min: startYear, max: 2030 });

    const title = faker.lorem.sentence();
    const content = generateFakePostContent(); 

    const seed = faker.number.int({
      min: 10000,
      max: 99999
    });
    const coverUrl = `https://picsum.photos/640/480?random=${Math.floor(Math.random() * 1000)}`;
    const wideImgUrl = `https://picsum.photos/1200/600?random=${Math.floor(Math.random() * 1000)}`;
    
    batch.set(postRef, {
      categoryId: category.id,
      content,
      coverUrl,
      wideImgUrl,
      createdAt: admin.firestore.Timestamp.now(),
      date_range_start: startYear,
      date_range_end: endYear,
      title,
      userId: faker.string.alpha({ length: 24 }),
      searchIndex: title.toLowerCase(),
    });

    await attachTagsToPost(batch, postRef, tags, tagMinCount, tagMaxCount); 
    await createComments(batch, postRef, commentMinCount, commentMaxCount);  
  }

  await batch.commit();
  console.log(`✅ Seeded ${count} posts with tags`);
}

seedPostsWithTagsAndComments(postCount)
  .then(() => process.exit())
  .catch(err => {
    console.error("Seeder failed:", err);
    process.exit(1);
  });


  //TODO: user seed 
  //TODO: seed pre-writted categories [Male, Female]
   
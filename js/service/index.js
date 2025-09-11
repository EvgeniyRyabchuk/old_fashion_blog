  // const email = "jeka.rubchuk@gmail.com";
  // const password = "123456789";

// AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64

//  6L2VZqbuQLWfBlm55tUa Document id 

const firebaseConfig = {
  apiKey: "AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64",
  authDomain: "fashion-blog-54f36.firebaseapp.com",
  projectId: "fashion-blog-54f36",
  storageBucket: "fashion-blog-54f36.firebasestorage.app",
  messagingSenderId: "783090657826",
  appId: "1:783090657826:web:c3d249e95efa908788f87b",
  measurementId: "G-YS39H1B7B1"
};

 // Initialize Firebase (namespaced style)
const app = firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore(); 
const storage = firebase.storage();


const fetchDataFirestore = async (colName, page, perPage, options = {}, beforeItemsLoaded, afterItemsLoaded) => {
  await beforeItemsLoaded();
  const orderField = options.orderField || "createdAt"; 
  const lastDocCache = options.lastDocCache || {};

  let filteredQuery = null;
  let ref = null; 

  if(options.filterHandler) {
    ref = await options.filterHandler(); 
  } else {
    ref = db.collection(colName).orderBy(orderField, "desc"); 
  }
 
  ref = ref.limit(perPage);

  // if not the first page, continue after last doc of previous page
  if (page > 1 && lastDocCache[page - 1]) {
    ref = db.collection(colName)
      .startAfter(lastDocCache[page - 1]) 
      .limit(perPage);
  }

  const snap = await ref.get();
  const posts = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
  
  await afterItemsLoaded(posts); 

  // save cursor
  if (snap.docs.length > 0) {
    lastDocCache[page] = snap.docs[snap.docs.length - 1];
  }

  //TODO: why 
  // ⚠️ expensive: counts all docs (better maintain separately!)
  // const totalCountSnap = await db.collection(colName).get(); 
  const totalCount = snap.size; 
  
  return {
    items: posts,
    totalCount,
    lastDocCache
  };
};
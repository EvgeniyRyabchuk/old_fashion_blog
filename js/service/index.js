  // const email = "jeka.rubchuk@gmail.com";
  // const password = "123456789";

// AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64

//  6L2VZqbuQLWfBlm55tUa Document id 

const firebaseConfig = {
  apiKey: "AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64",
  authDomain: "fashion-blog-54f36.firebaseapp.com",
  projectId: "fashion-blog-54f36", 
  storageBucket: "fashion-blog-54f36.firebasestorage.app",
  // storageBucket: "fashion-blog-54f36.appspot.com",
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

const fetchDataFirestore = async (
  colName, 
  page, 
  perPage, 
  cursorHandler, 
  options = {}, 
  beforeItemsLoaded, 
  afterItemsLoaded) => { 
  await beforeItemsLoaded(options.isLoadMore); 
  const orderField = options.orderField || "createdAt";  
  
  // ref for filtered query 
  let ref = null; 
    
  if(options.filterHandler) {
    ref = await options.filterHandler(); 
  } else {
    ref = db.collection(colName).orderBy(orderField, "desc"); 
  }
  
  const params = Object.fromEntries(new URLSearchParams(window.location.search));
  const search = params.search;
  
  if (search) { 
    const filterSortSection = document.getElementById("filterSortSection");
    filterSortSection.style.display = "none"; 
    document.getElementById("mainContentTitle").innerText 
    = `${i18n.translate("search_posts_by")} "${search}"`; 
    
    
    // search only works if you order by the field you want to search on
     ref = db.collection(colName)
      .orderBy("searchIndex") 
      .orderBy("createdAt", "desc")
      .startAt(search.toLowerCase()) 
      .endAt(search.toLowerCase() + "\uf8ff")
  } 
  
  // ref for get total page for pagination 
  let paginatedRef = ref.limit(perPage);

  const lastDocCache = cursorHandler.lastDocCache; 
  // if not the first page, continue after last doc of previous page
  if (page > 1 && lastDocCache[page - 1]) {
    paginatedRef = paginatedRef
      .startAfter(lastDocCache[page - 1]) 
  }
  
  const snap = await paginatedRef.get(); 
  let posts = snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  // save cursor
  if (snap.docs.length > 0) {
    const lastDoc = snap.docs[snap.docs.length - 1];
    cursorHandler.saveCursor(lastDoc, page); 
  }
  
  await afterItemsLoaded(posts); 
  
  //TODO: why 
  // ⚠️ expensive: counts all docs (better maintain separately!)
  const totalCountSnap = await ref.get();
  const totalCount = totalCountSnap.size;
  console.log(`total ${totalCount}`); 
  
  return {
    items: posts,
    totalCount,
  };
};
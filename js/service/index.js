
const fetchDataFirestore = async (colName, page, perPage, options = {}, afterItemsLoaded) => {

  const orderField = options.orderField || "createdAt"; 
  const lastDocCache = options.lastDocCache || {};

  let ref = db.collection(colName).orderBy(orderField, "desc").limit(perPage);

  // if not the first page, continue after last doc of previous page
  if (page > 1 && lastDocCache[page - 1]) {
    ref = db.collection(colName)
      .orderBy(orderField, "desc")
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
  const totalCountSnap = await db.collection(colName).get();
  const totalCount = totalCountSnap.size; 

  return {
    items: posts,
    totalCount,
    lastDocCache
  };
};


const loadCategoriesToCollection = async (collection) => {
    // get categories
  const categoryIds = [...new Set(collection.map(p => p.categoryId).filter(Boolean))];

  // 3. Fetch only related categories (Firestore allows max 10 IDs per query)
  let categories = {};
  for (let i = 0; i < categoryIds.length; i += 10) {
    const batch = categoryIds.slice(i, i + 10);

    const catSnap = await db.collection("categories")
      .where(firebase.firestore.FieldPath.documentId(), "in", batch)
      .get();

    catSnap.forEach(doc => {
      categories[doc.id] = {
        id: doc.id,
        ...doc.data()
      };
    });
  }


  // 4. Join categories into collection
  collection.forEach((d) => {
    d.category = categories[d.categoryId] || null
  });

  console.log(collection);

}
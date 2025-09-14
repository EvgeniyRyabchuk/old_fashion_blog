let selectedCategoryId = null; 

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


const readAllCategoires = async () => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log("Categories:", categories);
    return categories;
  } catch (err) {
    console.error("Error loading categories:", err);
    return [];
  }
}

const loadCategoriesToSelect = async () => {
  const categories = await readAllCategoires();
  const select = document.getElementById("category-select");
  select.innerHTML = ""; // очистить
  select.onchange = async (e) => {
    const categoryId = e.target.value; 
    // const snapshot = await db.collection("categories").doc(categoryId).get();  
    // const category = snapshot.data(); 
    selectedCategoryId = categoryId
    console.log(selectedCategoryId);
  }


  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name; 
    select.appendChild(option);
  });
};



// loadCategoriesToSelect();
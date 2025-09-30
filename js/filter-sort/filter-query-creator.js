

const postFilterQueryCreator = async () => {
  let categories = [...document.querySelectorAll('input[data-type="category"]:checked')].map(el => el.value);
  let tags = [...document.querySelectorAll('input[data-type="tag"]:checked')].map(el => el.value);
  const startDate = document.querySelector('input[data-type="date-range-start"]').value;
  const endDate = document.querySelector('input[data-type="date-range-end"]').value;
  const sort = document.getElementById("sort").value;
  
  queryStrHandler.changePostsFilter({cIds: categories, tIds: tags, startDate, endDate})
  queryStrHandler.changeSort(sort);
  
  
  let query = db.collection("posts");
  
    // because of inequalities trouble 
  if (startDate && startDate != queryStrHandler.defaultStartDate) { 
    query = query.where("date_range_start", ">=", new Date(startDate).getFullYear()); 
    return query; 
  }
  if (endDate && endDate != queryStrHandler.defaultEndDate) {
    query = query.where("date_range_end", "<=",  new Date(endDate).getFullYear());
    return query; 
  }

  if (categories.length > 0) { 
    query = query.where("categoryId", "in", categories);
  }

  console.log(123); 
  if (tags.length > 0) {  
      const snap = await db.collection("post_tag")
      .where("tagId", "in", tags.slice(0, 10))
      .get();

    const postIds = snap.docs.map(d => d.data().postId);
    if (postIds.length === 0) {
      // No matches → return empty query
      // return db.collection("posts").where(firebase.firestore.FieldPath.documentId(), "==", "__none__");

      // impossible expression to returning empty array 
      return db.collection("posts").where("userId", "==", "__impossible__");
    }

    query = query.where(firebase.firestore.FieldPath.documentId(), "in", postIds.slice(0, 10));
  }


  if (sort === "newest") {
    query = query.orderBy("createdAt", "desc");
  } else if (sort === "oldest") {
    query = query.orderBy("createdAt", "asc");
  } else if (sort === "popular") {
    query = query.orderBy("views", "desc"); 
  }

  
  return query; 
}
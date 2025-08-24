



const loadTagsToCollection = async (collection) => {
  // 1. Collect post IDs
  const postIds = collection.map(p => p.id);

  if (postIds.length === 0) return collection;

  // 2. Fetch post_tag docs for these posts (in batches of 10 IDs)
  let postTags = [];
  for (let i = 0; i < postIds.length; i += 10) {
    const batch = postIds.slice(i, i + 10);

    const ptSnap = await db.collection("post_tag")
      .where("postId", "in", batch)
      .get();

    ptSnap.forEach(doc => {
      postTags.push({ id: doc.id, ...doc.data() });
    });
  }

  // 3. Collect unique tagIds
  const tagIds = [...new Set(postTags.map(pt => pt.tagId).filter(Boolean))]; 

  // 4. Fetch all related tags (again in batches of 10 IDs)
  let tags = {};
  for (let i = 0; i < tagIds.length; i += 10) {
    const batch = tagIds.slice(i, i + 10);

    const tagSnap = await db.collection("tags")
      .where(firebase.firestore.FieldPath.documentId(), "in", batch)
      .get();

    tagSnap.forEach(doc => {
      tags[doc.id] = { id: doc.id, ...doc.data() };
    });
  }

  // 5. Attach tags to posts
  collection.forEach(post => {
    const relatedTagIds = postTags
      .filter(pt => pt.postId === post.id)
      .map(pt => pt.tagId);

    post.tags = relatedTagIds.map(tagId => tags[tagId]).filter(Boolean);
  });

  console.log(collection);
  return collection;
};
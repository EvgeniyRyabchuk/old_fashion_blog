import {db} from "@/firebase/config";
import firebase from "firebase/app";

const tagInput = document.getElementById("tagInput");
const tagsContainer = document.getElementById("tagsContainer");

let tags = [];

const tagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.value.trim() !== "") {
        e.preventDefault();
        const newTag = tagInput.value.trim();

        if (!tags.includes(newTag)) {
            tags.push(newTag);
            // renderTags();
        }

        tagInput.value = "";
    }
}

//TODO: fix
try {
// Add tag on Enter
    tagInput.addEventListener("keydown", tagInputKeyDown);
} catch (e) {
    console.log(e);
}



// Remove tag
function removeTag(index) {
    tags.splice(index, 1);
    // renderTags();
}

async function deleteTagsByPostId(postId) {
    const snap = await db.collection("post_tag")
        .where("postId", "==", postId)
        .get();

    if (snap.empty) {
        console.log("No tags found for post:", postId);
        return;
    }

    const batch = db.batch();
    snap.forEach(doc => {
        batch.delete(db.collection("post_tag").doc(doc.id));
    });

    await batch.commit();
    console.log("All tags deleted for post:", postId);
}

async function addTagsIfNotExist(post) {
    const batch = db.batch();
    let existTags = [];

    await deleteTagsByPostId(post.id);
    console.log(tags);

    // const tagsFromHtml = Array.from(document.querySelectorAll('.tag'))
    //   .map(el => el.firstChild.nodeValue.trim());

    console.log(tags);

    for (const tag of tags) {
        const tagRef = db.collection("tags");
        let existing = await tagRef.where("name", "==", tag).limit(1).get();

        if (existing.empty) {
            const newTagRef = db.collection("tags").doc();
            batch.set(newTagRef, {
                name: tag,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            existTags.push(newTagRef.id);
        } else {
            existTags.push(existing.docs[0].id);
        }

        // save post tag if not exist
        batch.set(db.collection("post_tag").doc(),{
            tagId: existTags[existTags.length - 1],
            postId: post.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        },  { merge: true });
    }
    // Commit all new tags in one batch
    await batch.commit();

}


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

const readAllTags = async () => {
    try {
        const snapshot = await db.collection("tags").get();
        const tags = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Categories:", tags);
        return tags;
    } catch (err) {
        console.error("Error loading categories:", err);
        return [];
    }
}

const fetchMostPopularTags = async (count) => {
    const tagCounts = {}; // { tagName: count }

    // Fetch all post-tag documents
    const snapshot = await db.collection("post_tag").get();

    snapshot.forEach(doc => {
        const data = doc.data();
        // assuming each doc has a 'tag' field

        if (data.tagId) {
            tagCounts[data.tagId] = (tagCounts[data.tagId] || 0) + 1;
        }
    });

    // Convert to array and sort by count descending
    const slicedTags = Object.entries(tagCounts)
        .slice(0, count)   // top N tags
        .map(entry => ({ tagId: entry[0], count: entry[1] }));

    const tagsSnap = await db.collection("tags")
        .where(firebase.firestore.FieldPath.documentId(), "in", slicedTags.map(st => st.tagId))
        .get();

    const sortedTagsByCount = tagsSnap.docs.map(ts => ({
        id: ts.id,
        count: slicedTags.find(st => st.tagId === ts.id).count,
        ...ts.data()
    }))
        .sort((a, b) => b.count - a.count)
    console.log(sortedTagsByCount);
    return sortedTagsByCount;
}


export {
    fetchMostPopularTags,

}

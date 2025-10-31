

import firebase from "firebase/app";
import {db} from "@/firebase/config";
import {loadCategoriesToCollection} from "@/services/categories";
import {addTagsIfNotExist, loadTagsToCollection} from "@/services/tags";
import addPostToHistory from "@utils/postHistory";
import {loadToCloudinary} from "@/services/image";
import {defaultCoverUrl, defaultWideImgUrl} from "@/constants/default";
import {buildSearchIndex} from "@utils/format";


// Fetch posts by IDs
const fetchPostsByIds = async (ids) => {
    const postsSnap = await db.collection("posts")
        .where(firebase.firestore.FieldPath.documentId(), "in", ids)
        .get();


    const posts = postsSnap.docs.map(p => ({
        id: p.id,
        ...p.data()
    }));

    // await loadCategoriesToCollection([post]);
    // await loadTagsToCollection([post]);
    // addPostToHistory(post.id);

    return posts;
}

async function fetchPostById(postId) {
    const postSnap = await db.collection('posts').doc(postId).get();
    const post = {
        id: postSnap.id,
        ...postSnap.data()
    }

    await loadCategoriesToCollection([post]);
    await loadTagsToCollection([post]);
    addPostToHistory(post.id);

    return post;

}


const fetchLastPosts = async (count = 10) => {
    const snap =
        await db.collection("posts")
        .orderBy("createdAt", "desc")
        .limit(count)
        .get();
    return snap.docs.map(p => ({ id: p.id, ...p.data() }) )
}

const removePostById = async (pId) => {
    try {
        // delete post itself
        await db.collection("posts").doc(pId).delete();

        // batch delete comments + post_tag
        const batch = db.batch();

        const commentsSnap = await db.collection("comments").where("postId", "==", pId).get();
        commentsSnap.forEach(doc => batch.delete(doc.ref));

        const tagsSnap = await db.collection("post_tag").where("postId", "==", pId).get();
        tagsSnap.forEach(doc => batch.delete(doc.ref));

        await batch.commit();

        // if(postsPaginator) {
        //     await postsPaginator.reload();
        //     if(currentPaginationEnv.lastUrlPart === "create-edit-post.html") {
        //         clearUpTheForm();
        //     }
        // }
        // else {
        //     window.history.back();
        // }
        console.log("Document and related data successfully deleted!");
    } catch (err) {
        console.error("Error deleting document: ", err);
    }
}

const createOrUpdatePost = async (post, user) => {
    const {
        title,
        categoryId,
        content,
        coverUrl,
        wideImgUrl,
        startDate,
        endDate,
        tags
    } = post;

    const postId = post?.id;

    try {
        let createdOrUpdatedPost = null;
        if(!postId) {
            createdOrUpdatedPost = await db.collection("posts").add({
                title,
                content,
                coverUrl,
                wideImgUrl,
                date_range_start: startDate,
                date_range_end: endDate,
                searchIndex: buildSearchIndex(title, tags),
                categoryId,
                userId: user.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            await db.collection("posts").doc(postId).update({
                title: title,
                content: content,
                coverUrl: coverUrl ?? post.coverUrl,
                wideImgUrl: wideImgUrl ?? post.wideImgUrl,
                searchIndex: buildSearchIndex(title, tags),
                date_range_start: startDate,
                date_range_end: endDate,
                categoryId,
                // updateAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            const updatedSnap = await db.collection("posts").doc(postId).get();
            createdOrUpdatedPost = { id: updatedSnap.id, ...updatedSnap.data() };
        }

        await addTagsIfNotExist(createdOrUpdatedPost, tags);

        console.log("Post created!");
    } catch (err) {
        console.error("Error adding document:", err);
        alert("Error: " + err.message);
    }
}


async function fetchPostsBySearch(term) {
    if(term === "" || !term) {
        console.log("No term → return common-nav posts or skip");
        return [];
    }
    const postsRef = db.collection("posts");
    // 1. Search posts by title
    const postsByTitleSnap = await postsRef
        .orderBy("searchIndex")
        .orderBy("createdAt", "desc")
        .startAt(term.toLowerCase())
        .endAt(term.toLowerCase() + "\uf8ff")
        .limit(10)
        .get();

    const posts = postsByTitleSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // renderPostsForSearch(posts);
    return posts;
}

export {
    fetchPostsByIds,
    fetchLastPosts,
    fetchPostById,
    removePostById,
    createOrUpdatePost,
    fetchPostsBySearch
}
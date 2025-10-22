

import firebase from "firebase/app";
import {db} from "@/firebase/config";
import {loadCategoriesToCollection} from "@/services/categories";
import {loadTagsToCollection} from "@/services/tags";
import addPostToHistory from "@utils/postHistory";


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
    const snap = await db.collection("posts").limit(count).get();
    return snap.docs.map(p => ({ id: p.id, ...p.data() }) )


    // const lastPostsSection = document.getElementById("lastPostsSection");

    // posts.forEach(p => {
    //     const article = renderPostsForGrid(p);
    //     lastPostsSection.appendChild(article);
    // })
    //
    // if(posts.length >= 10) {
    //     const link = document.createElement("a");
    //     link.href = "/posts.html";
    //     link.className = "see-more";
    //     link.innerHTML = "See <br/> More... <br/>";
    //
    //     lastPostsSection.appendChild(link);
    // }
    // lastPostsRow.toggleScrollButtons();
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

export {
    fetchPostsByIds,
    fetchLastPosts,
    fetchPostById,
    removePostById
}
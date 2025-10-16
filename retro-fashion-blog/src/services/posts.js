

import firebase from "firebase/app";
import {db} from "@/firebase/config";


// Fetch posts by IDs
const fetchPostsByIds = async (ids) => {
    const postsSnap = await db.collection("posts")
        .where(firebase.firestore.FieldPath.documentId(), "in", ids)
        .get();

    return postsSnap.docs.map(p => ({
        id: p.id,
        ...p.data()
    }));
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

export {
    fetchPostsByIds,
    fetchLastPosts
}
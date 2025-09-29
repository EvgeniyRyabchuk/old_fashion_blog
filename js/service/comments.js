
let commentsForPost = [];
const listCommentContainer = document.querySelector("#listCommentContainer");
const curUserWriteSection = document.querySelector("#curUserWriteSection"); 

const addCommentToPost = async (postId) => {
    const text = document.querySelector('#commentContent')
    const {data: additionUserInfo} = await getUserAddition();
    
    const createdCommentRef = await db.collection("comments").add({
        content: text.value,
        userId: additionUserInfo.userId,
        postId: postId, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    const createdCommenSnap = await createdCommentRef.get(); 
    
    renderComments(
        {id: createdCommenSnap.id, ...createdCommenSnap.data()}, 
        additionUserInfo,
        true
    );
    text.value = ""; 
}

const getAllComments = async () => {
    const commentsSnap = await db.collection("comments").orderBy("createdAt", "desc").get();
    const comments = commentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const user = auth.currentUser.uid;
    const {data: additionUserInfo} = await getUserAddition();
    
    // container.innerHTML = ""; // Clear previous comments 
    for (let comment of comments) {
        renderComments(comment, additionUserInfo); 
    }
}

const getCommentsByPostId = async (postId) => {
    const commentsSnap = await db
        .collection("comments")
        .where("postId", "==", postId)
        .orderBy("createdAt", "desc")
        .get();
    
    const comments = commentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    console.log(comments);
    
    // const additionUserInfo = await getUserAddition();

    listCommentContainer.innerHTML = ""; // clear old comments
    
    for (let comment of comments) {
        const {data: additionUserInfo} = await getUserAddition(comment.userId);
        renderComments(comment, additionUserInfo); 
    }
};


const showCurrentUserInWriteCommentSection = async (additionUserInfo) => {
    const authCommentProtection = document.getElementById("authCommentProtection"); 
    
    if(auth.currentUser) {
        authCommentProtection.classList.remove("is-open"); 
        curUserWriteSection.classList.add("is-open"); 
        const avatar = curUserWriteSection.querySelector("img"); 
        const name = curUserWriteSection.querySelector(".user-name"); 
        avatar.src = additionUserInfo.avatar;
        name.innerText = additionUserInfo.name;
    } else {
        authCommentProtection.classList.add("is-open"); 
        curUserWriteSection.classList.remove("is-open"); 
    }
}




const deleteComment = async (commentId) => {
    // check if comment is user owning  
    const commentSnap = await db.collection("comments").doc(commentId).get();
    const comment = {
        id: commentSnap.id,
        ...commentSnap.data()
    }; 

    if (comment.userId === auth.currentUser.uid) {
        try { 
            await db.collection("comments").doc(commentId).delete();
            console.log("Document successfully updated!");
        } catch (err) {
            console.error("Error deleting document: ", error);
        }
    }
}

const onSendCommentClick = (e) => {
    addCommentToPost(postId); 
}



// getAllComments();

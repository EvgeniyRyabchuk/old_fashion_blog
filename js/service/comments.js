let commentsForPost = [];

const addCommentToPost = async () => {
    const text = document.querySelector('#comment-content').value;
    const additionUserInfo = await getUserAddition();
    
    const createdCommentRef = await db.collection("comments").add({
        content: text,
        userId: additionUserInfo.userId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    const createdCommenSnap = await createdCommentRef.get();

    await addCommentToHtml(
        document.querySelector("#list-comment-container"), 
        createdCommenSnap.data(), 
        additionUserInfo
    );
}

const addCommentToHtml = (container, comment, additionUserInfo) => { 
    const li = document.createElement("li");
    // Create user card
    const userCard = document.createElement("div");
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.innerText = "Remove";
    removeBtn.classList.add("btn-danger");  
    removeBtn.style = `display: block; margin-left: auto`
    removeBtn.onclick = async (e) => {
        const commentId = e.target.closest("li").dataset.commentId;
        await deleteComment(commentId); 
        e.target.closest("li").remove(); 
    }
    
    userCard.className = "user-card-small";

    const avatar = document.createElement("img");
    avatar.src = additionUserInfo.avatar;
    avatar.width = 45; 
    avatar.height = 45;
    avatar.alt = "User Avatar";

    const userName = document.createElement("div");
    userName.className = "user-name";
    userName.textContent = additionUserInfo ? additionUserInfo.name : "Unknown User";
    
    const createdAt = document.createElement("div");
    createdAt.className = "created-at";
    createdAt.textContent = comment.createdAt.toDate().toLocaleString() ;

    userCard.appendChild(avatar);
    userCard.appendChild(userName);
    userCard.appendChild(createdAt);
    
    // Create comment content
    const commentRow = document.createElement("div");
    commentRow.className = "comment-row";
    commentRow.textContent = comment.content || "";

    // Create separator
    const hr = document.createElement("hr");

    // Assemble list item
    li.dataset.commentId = comment.id; 
    li.appendChild(userCard);
    li.appendChild(commentRow); 
    li.appendChild(removeBtn); 
    li.appendChild(hr);
    container.appendChild(li);
}

const getAllComments = async () => {
    const commentsSnap = await db.collection("comments").orderBy("createdAt", "desc").get();
    const comments = commentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const user = auth.currentUser.uid;
    const additionUserInfo = await getUserAddition();

    const container = document.querySelector("#list-comment-container");
    // container.innerHTML = ""; // Clear previous comments 
    for (let comment of comments) {
        addCommentToHtml(container, comment, additionUserInfo);
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
    addCommentToPost();
}

getAllComments();

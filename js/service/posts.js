 
  function createDoc() {
      db.collection("posts").add({
        title: "First Post",
        content: "Hello from Firestore!",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id); 
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    }

    // -------------------
    // 🔹 READ
    // -------------------
    function readDocs() {
        const postsList = document.getElementById("postsList"); 
        db.collection("posts").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => `, doc.data());

            const data = doc.data();
                // Only use title + content
                const li = document.createElement("li");
                li.innerHTML = `
               ${data.title || "Untitled"}: ${data.content || ""}
                `;
                postsList.appendChild(li);

            });
        });
    }

    // -------------------
    // 🔹 UPDATE
    // -------------------
    function updateDoc(id) {
      db.collection("posts").doc(id).update({
        title: "Updated Title 🚀"
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
    }

    // -------------------
    // 🔹 DELETE
    // -------------------
    function deleteDoc(id) {
      db.collection("posts").doc(id).delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
    }


    
readDocs();
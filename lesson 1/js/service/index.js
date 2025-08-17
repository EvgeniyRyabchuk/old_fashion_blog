
// AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64

//  6L2VZqbuQLWfBlm55tUa Document id 

const firebaseConfig = {
  apiKey: "AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64",
  authDomain: "fashion-blog-54f36.firebaseapp.com",
  projectId: "fashion-blog-54f36",
  storageBucket: "fashion-blog-54f36.firebasestorage.app",
  messagingSenderId: "783090657826",
  appId: "1:783090657826:web:c3d249e95efa908788f87b",
  measurementId: "G-YS39H1B7B1"
};


// const firebaseConfig = {
//     apiKey: "AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64",
//     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//     projectId: "YOUR_PROJECT_ID",
//     storageBucket: "YOUR_PROJECT_ID.appspot.com",
//     messagingSenderId: "YOUR_SENDER_ID",
//     appId: "YOUR_APP_ID"
//   };

//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

//   // Example usage
//   const auth = firebase.auth();
//   const db = firebase.firestore();
//   const storage = firebase.storage();


 // Initialize Firebase (namespaced style)
    const app = firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();
   

     function login() {
    //   const email = document.getElementById("email").value;
    //   const password = document.getElementById("password").value;

      const email = "jeka.rubchuk@gmail.com";
      const password = "123456789"

      auth.signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          console.log("Logged in:", userCredential.user.email, "UID:", userCredential.user.uid);
          // addBtn.disabled = false;
          // logoutBtn.disabled = false;
        })
        .catch(error => {
          console.error("Login failed:", error.message);
        });
    };

    login(); 

   
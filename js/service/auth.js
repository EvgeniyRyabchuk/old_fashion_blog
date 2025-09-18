


// let user = null; 
const adminsIds = ["AzkfJd3AjmaD3r3hY1idYRS7HqA3"]; // array of admin user ids
let isAdmin = false; // default value
let userAddition = null; 

//TODO: if admin return isAdmin 
async function getUserAddition(userId = null) {
  let user = null; 
  
  if (userId) {
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      return { id: userDoc.id, ...userDoc.data() }; 
    } 
  } 

  user = firebase.auth().currentUser;
  if (!user) return null;
  let snap = await db.collection("users").where("userId", "==", user.uid).limit(1).get(); 
  if(!snap.docs[0])
    snap = await db.collection("admins").where("userId", "==", user.uid).limit(1).get(); 
  if(!snap.docs[0])
    return null;
  console.log(snap.docs[0]);
  
  return snap.docs[0].data(); 
}

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("✅ User already logged in:", user.email, "UID:", user.uid);

    // You can also check if they're admin again
   isAdmin = adminsIds.includes(user.uid); // check if user is an admin

    if(isAdmin === true) {
     console.log("User is admin.");
     //TODO: set admin ui 
    } else {
      console.log("User is not an admin.");
      //TODO: set user ui 
    }

  } else {
    console.log("❌ No user is logged in.");
  }
});

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    console.log("Logged in:", user.email, "UID:", user.uid);
    
    // addBtn.disabled = false;
    // logoutBtn.disabled = false;
    const doc = await db.collection("users").doc(user.uid).get();
    userAddition = doc.data();
    
    return user;
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // try { 
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user; 

  
  await db.collection("users").doc(user.uid).set({
    name: name,
    email: user.email,
    avatar: '/images/profile.png',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

    const doc = await db.collection("users").doc(user.uid).get();
    userAddition = doc.data();
   
  // const n = await getUserName(); 
  // console.log(n);
  
  
  
  //   document.getElementById("status").innerText = `Registered as: ${user.email}`; 
  // } catch (err) {
  //   document.getElementById("status").innerText = err.message;
  // }
}

const logout = () => {
  auth.signOut().then(() => {
    console.log("User signed out successfully.");
    user = null;
    isAdmin = false; // reset admin status
    // addBtn.disabled = true;
    // logoutBtn.disabled = true;
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}


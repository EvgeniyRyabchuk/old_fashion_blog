


// let user = null; 
const adminsIds = ["AzkfJd3AjmaD3r3hY1idYRS7HqA3"]; // array of admin user ids
let isAdmin = false; // default value
let userAddition = null; 

//TODO: if admin return isAdmin 
async function getUserAddition(userId = null) {
  let user = null; 
  let isAdmin = false; 

  if (userId) {
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      return { data: {id: userDoc.id, ...userDoc.data()}, isAdmin }; 
    } 
  } 
  
  // user = firebase.auth().currentUser;
  // if (!user) return {data: null, isAdmin};
  let snap = await db.collection("users").doc(userId).get(); 
  if(!snap.exists)
    snap = await db.collection("admins").doc(userId).get(); 
  if(!snap.exists)
    return {data: null, isAdmin};
  else 
    isAdmin = true; 

  return { data: snap.data(), isAdmin }; 
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
    window.location.href = "/"; 
    return user;
  } catch (error) {
    console.error("Login failed:", error.message);
  }
}

async function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try { 
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user; 

  
  await db.collection("users").doc(user.uid).set({
    name: name,
    email: user.email,
    avatar: '/images/profile.png',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    userId: user.uid
  });

    const doc = await db.collection("users").doc(user.uid).get();
    userAddition = doc.data();

    window.location.href = "/"; 
  } catch(error) {
     console.error("Rewegiser failed:", error.message);
  }
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


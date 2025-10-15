import {db, auth} from "@/firebase/config";
import firebase from "firebase/app";


const adminsIds = ["AzkfJd3AjmaD3r3hY1idYRS7HqA3"]; // array of admin user ids

async function getAuthUserById(userId = auth.currentUser?.uid) {
    let isAdmin = false;

    if (!userId) return {isAdmin};
    let snap = await db.collection("users").doc(userId).get();
    if (!snap.exists)
        snap = await db.collection("admins").doc(userId).get();
    if (!snap.exists)
        return {isAdmin};
    else
        isAdmin = true;

    return {id: snap.id, ...snap.data(), isAdmin};
}

async function login(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log("Logged in:", user.email, "UID:", user.uid);

        return user;

    } catch (error) {
        console.error("Login failed:", error.message);
    }
}

async function register(name, email, password) {
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

        return user;

    } catch(error) {
        console.error("Rewegiser failed:", error.message);
    }
}

const logout = () => {
    auth.signOut().then(() => {
        console.log("User signed out successfully.");
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
}



export {
    login,
    register,
    logout,
    getAuthUserById
}
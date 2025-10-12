import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBb6ith8jViE5Lgm8O72EkL_iDz6S7nc64",
    authDomain: "fashion-blog-54f36.firebaseapp.com",
    projectId: "fashion-blog-54f36",
    storageBucket: "fashion-blog-54f36.firebasestorage.app",
    // storageBucket: "fashion-blog-54f36.appspot.com",
    messagingSenderId: "783090657826",
    appId: "1:783090657826:web:c3d249e95efa908788f87b",
    measurementId: "G-YS39H1B7B1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export default firebase;

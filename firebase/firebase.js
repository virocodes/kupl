// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH-Kq7gq_q2gUmb6vLiMqLj3fr_M7cOrg",
  authDomain: "kupl-a28a9.firebaseapp.com",
  projectId: "kupl-a28a9",
  storageBucket: "kupl-a28a9.appspot.com",
  messagingSenderId: "869441429455",
  appId: "1:869441429455:web:b2624edab2b94219367cba",
  measurementId: "G-1YXF1DMXJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
});
  

export {app, firestore, auth, googleProvider, storage}
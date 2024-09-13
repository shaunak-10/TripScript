import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMfpW2gXBhTVPJHVLiM6rqTc3s8Xqb-sY",
  authDomain: "tripscript-de12f.firebaseapp.com",
  projectId: "tripscript-de12f",
  storageBucket: "tripscript-de12f.appspot.com",
  messagingSenderId: "150273093388",
  appId: "1:150273093388:web:1604c8c34923f73732e329",
  measurementId: "G-JLN8X9GEQB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };

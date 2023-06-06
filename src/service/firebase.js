import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey:  "AIzaSyDsSMQPtGwRmZW4DGf06AG5-pboWgNmBfM",
  authDomain: "popsto-re.firebaseapp.com",
  projectId: "popsto-re",
  storageBucket: "popsto-re.appspot.com",
  messagingSenderId: "333204054236",
  appId: "1:333204054236:web:dd0a4c9117944690231419",
  measurementId: "G-4Y7EF4KJ2K",
};

// Initialize Firebase

const app = firebase.initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { doc, collection, getDoc, addDoc, getDocs, setDoc, query, where, orderBy, updateDoc, serverTimestamp };
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope("email");
provider.addScope("profile");
export const signInWithGoogle = async () => await signInWithPopup(auth, provider);

export default firebase;

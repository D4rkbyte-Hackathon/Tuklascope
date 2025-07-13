import { initializeApp } from "firebase/app";
import { 
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  confirmPasswordReset,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithCredential,
  deleteUser
} from "firebase/auth";
import { 
  getFirestore,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3KsAAAGn1fBc0B_lWKf63i9Mw9omGIu4",
  authDomain: "test-tuklascope.firebaseapp.com",
  projectId: "test-tuklascope",
  storageBucket: "test-tuklascope.firebasestorage.app",
  messagingSenderId: "1067774868647",
  appId: "1:1067774868647:web:3dbfab4a7a413ef0326f82",
  measurementId: "G-JGW59NRSYV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  getAuth,
  auth,
  db,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  setPersistence,
  onAuthStateChanged,
  browserSessionPersistence,
  sendPasswordResetEmail,
  confirmPasswordReset,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signInWithCredential,
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where
};

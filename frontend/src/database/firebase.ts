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
  deleteUser,
  signOut
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
  signOut,
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

// User Skills Management Functions
export const saveUserSkills = async (userId: string, skills: Array<{skill_name: string, category: string}>) => {
  try {
    const userSkillsRef = doc(db, 'user_skills', userId);
    const existingDoc = await getDoc(userSkillsRef);
    
    if (existingDoc.exists()) {
      // Update existing skills
      const existingSkills: Record<string, any> = existingDoc.data().skills || {};
      
      // Add new skills or update existing ones
      skills.forEach(skill => {
        if (existingSkills[skill.skill_name]) {
          // Increment mastery level if skill already exists
          existingSkills[skill.skill_name] = {
            ...existingSkills[skill.skill_name],
            mastery_level: Math.min(100, existingSkills[skill.skill_name].mastery_level + 10),
            last_updated: new Date().toISOString()
          };
        } else {
          // Add new skill
          existingSkills[skill.skill_name] = {
            skill_name: skill.skill_name,
            category: skill.category,
            mastery_level: 25, // Initial mastery level
            xp_earned: 25,
            date_acquired: new Date().toISOString(),
            last_updated: new Date().toISOString()
          };
        }
      });
      
      await updateDoc(userSkillsRef, { skills: existingSkills });
    } else {
      // Create new user skills document
      const skillsObject: Record<string, any> = {};
      skills.forEach(skill => {
        skillsObject[skill.skill_name] = {
          skill_name: skill.skill_name,
          category: skill.category,
          mastery_level: 25,
          xp_earned: 25,
          date_acquired: new Date().toISOString(),
          last_updated: new Date().toISOString()
        };
      });
      
      await setDoc(userSkillsRef, { skills: skillsObject });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user skills:', error);
    return false;
  }
};

export const getUserSkills = async (userId: string) => {
  try {
    const userSkillsRef = doc(db, 'user_skills', userId);
    const docSnap = await getDoc(userSkillsRef);
    
    if (docSnap.exists()) {
      return docSnap.data().skills || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting user skills:', error);
    return {};
  }
};

export const getUserSkillsRealtime = (userId: string, callback: (skills: any) => void) => {
  const userSkillsRef = doc(db, 'user_skills', userId);
  return onSnapshot(userSkillsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().skills || {});
    } else {
      callback({});
    }
  });
};

// User Discoveries Management Functions
export const saveUserDiscovery = async (userId: string, discovery: {
  id: number;
  image: string;
  timestamp: string;
  fullResult: any;
}) => {
  try {
    const userDiscoveriesRef = doc(db, 'user_discoveries', userId);
    const existingDoc = await getDoc(userDiscoveriesRef);
    
    if (existingDoc.exists()) {
      // Update existing discoveries
      const existingDiscoveries: any[] = existingDoc.data().discoveries || [];
      
      // Remove any existing discovery with the same image to avoid duplicates
      const filteredDiscoveries = existingDiscoveries.filter(d => d.image !== discovery.image);
      
      // Add new discovery at the beginning
      const updatedDiscoveries = [discovery, ...filteredDiscoveries].slice(0, 10); // Keep only 10 most recent
      
      await updateDoc(userDiscoveriesRef, { discoveries: updatedDiscoveries });
    } else {
      // Create new user discoveries document
      await setDoc(userDiscoveriesRef, { discoveries: [discovery] });
    }
    
    return true;
  } catch (error) {
    console.error('Error saving user discovery:', error);
    return false;
  }
};

export const getUserDiscoveries = async (userId: string) => {
  try {
    const userDiscoveriesRef = doc(db, 'user_discoveries', userId);
    const docSnap = await getDoc(userDiscoveriesRef);
    
    if (docSnap.exists()) {
      return docSnap.data().discoveries || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting user discoveries:', error);
    return [];
  }
};

export const getUserDiscoveriesRealtime = (userId: string, callback: (discoveries: any[]) => void) => {
  const userDiscoveriesRef = doc(db, 'user_discoveries', userId);
  return onSnapshot(userDiscoveriesRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data().discoveries || []);
    } else {
      callback([]);
    }
  });
};

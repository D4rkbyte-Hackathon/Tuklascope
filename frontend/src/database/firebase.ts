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
  where,
  increment } from "firebase/firestore";

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
    
    let pointsForNewSkills = 0;
    let pointsForUpdatedSkills = 0;

    if (existingDoc.exists()) {
      // Update existing skills
      const existingSkills: Record<string, any> = existingDoc.data().skills || {};
      
      // Add new skills or update existing ones
      skills.forEach(skill => {
        if (existingSkills[skill.skill_name]) {
          pointsForUpdatedSkills += 5; // +5 points for skill level-up
          // Increment mastery level if skill already exists
          existingSkills[skill.skill_name] = {
            ...existingSkills[skill.skill_name],
            mastery_level: Math.min(100, existingSkills[skill.skill_name].mastery_level + 10),
            xp_earned: existingSkills[skill.skill_name].xp_earned + 10,
            last_updated: new Date().toISOString()
          };
        } else {
          // Add new skill
          pointsForNewSkills += 25;
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
        pointsForNewSkills += 25;
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
    
    // After updating skills, update the total points
    const totalPointsToAdd = pointsForNewSkills + pointsForUpdatedSkills;
    if (totalPointsToAdd > 0) {
      await updateUserStats(userId, totalPointsToAdd);
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

// new function for updating points and streaks
export const updateUserStats = async (userId: string, pointsToAdd: number, isNewDiscovery: boolean = false) => {
  const userRef = doc(db, 'Tuklascope-user', userId);
  
  try {
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      console.error("User document does not exist to update stats.");
      return;
    }

    const userData = userDoc.data();
    const today = new Date().toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD

    const lastLoginDate = userData.lastLoginDate;
    const currentStreak = userData.streak || 0;
    let newStreak = currentStreak;

    if (isNewDiscovery) {
      if (lastLoginDate !== today) {
        // Check if the last login was yesterday to continue the streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastLoginDate === yesterdayStr) {
          newStreak = currentStreak + 1; // Continue streak
        } else {
          newStreak = 1; // Reset streak
        }
        
        await updateDoc(userRef, {
          totalPoints: increment(pointsToAdd),
          streak: newStreak,
          lastLoginDate: today
        });

      } else {
        // Already logged in today, just add points
        await updateDoc(userRef, {
          totalPoints: increment(pointsToAdd)
        });
      }
    } else {
      // Not a new discovery, just add points (e.g., for skill updates)
      await updateDoc(userRef, {
        totalPoints: increment(pointsToAdd)
      });
    }

  } catch (error) {
    console.error("Error updating user stats:", error);
  }
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

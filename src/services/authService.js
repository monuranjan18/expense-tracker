import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';

// Local storage key for demo user when Firebase credentials are not provided
const DEMO_USER_KEY = 'expense_tracker_demo_user';

export const registerWithEmailPassword = async (email, password, displayName) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    return userCredential.user;
  } else {
    // Demo mode fallback
    const mockUser = {
      uid: 'demo_user_' + Date.now(),
      email,
      displayName: displayName || email.split('@')[0],
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
};

export const loginWithEmailPassword = async (email, password) => {
  if (isFirebaseConfigured && auth) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } else {
    // Demo mode fallback
    const mockUser = {
      uid: 'demo_user_default',
      email,
      displayName: email.split('@')[0],
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
};

export const loginWithGoogle = async () => {
  if (isFirebaseConfigured && auth && googleProvider) {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } else {
    // Demo mode fallback
    const mockUser = {
      uid: 'demo_google_user',
      email: 'alex.morgan@example.com',
      displayName: 'Alex Morgan',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      isDemo: true,
    };
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
};

export const logoutUser = async () => {
  if (isFirebaseConfigured && auth) {
    await signOut(auth);
  }
  localStorage.removeItem(DEMO_USER_KEY);
};

export const updateUserProfileData = async (displayName, photoURL) => {
  if (isFirebaseConfigured && auth && auth.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName: displayName || auth.currentUser.displayName,
      photoURL: photoURL !== undefined ? photoURL : auth.currentUser.photoURL,
    });
    return auth.currentUser;
  } else {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const updated = {
        ...parsed,
        displayName: displayName || parsed.displayName,
        photoURL: photoURL !== undefined ? photoURL : parsed.photoURL,
      };
      localStorage.setItem(DEMO_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return null;
  }
};

export const subscribeToAuthChanges = (callback) => {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, (user) => {
      callback(user);
    });
  } else {
    const stored = localStorage.getItem(DEMO_USER_KEY);
    callback(stored ? JSON.parse(stored) : null);
    // Listen for custom storage event
    const handleStorage = () => {
      const current = localStorage.getItem(DEMO_USER_KEY);
      callback(current ? JSON.parse(current) : null);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }
};

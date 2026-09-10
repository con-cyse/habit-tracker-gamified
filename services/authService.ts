import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '@/types/auth';

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(credential.user, { displayName });
  }

  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: displayName || credential.user.displayName || 'Hero',
    photoURL: credential.user.photoURL,
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
}

export async function signInWithEmail(email: string, password: string): Promise<UserProfile> {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName || 'Hero',
    photoURL: credential.user.photoURL,
    isGuest: false,
    createdAt: new Date().toISOString(),
  };
}

export async function signOutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

export function subscribeToAuthState(callback: (user: UserProfile | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || 'Hero',
        photoURL: firebaseUser.photoURL,
        isGuest: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      callback(null);
    }
  });
}

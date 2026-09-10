import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Habit } from '@/types/habit';
import { Achievement } from '@/types/gamification';

export interface CloudUserData {
  stats: {
    xp: number;
    level: number;
    coins: number;
    streakShields: number;
    equippedTitle: string;
    activeTheme: string;
  };
  habits: Habit[];
  achievements: Achievement[];
  updatedAt: string;
}

export async function uploadUserDataToFirestore(
  userId: string,
  data: Omit<CloudUserData, 'updatedAt'>
): Promise<boolean> {
  if (!db) {
    console.warn('Firestore is not initialized, skipping cloud upload.');
    return false;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      stats: data.stats,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Store habits in subcollection
    for (const habit of data.habits) {
      const habitDocRef = doc(db, 'users', userId, 'habits', habit.id);
      await setDoc(habitDocRef, habit, { merge: true });
    }

    // Store achievements
    const achDocRef = doc(db, 'users', userId, 'gamification', 'achievements');
    await setDoc(achDocRef, { achievements: data.achievements }, { merge: true });

    return true;
  } catch (error) {
    console.error('Failed to upload data to Firestore:', error);
    return false;
  }
}

export async function downloadUserDataFromFirestore(userId: string): Promise<CloudUserData | null> {
  if (!db) {
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data();

    // Fetch habits
    const habitsColRef = collection(db, 'users', userId, 'habits');
    const habitsSnap = await getDocs(habitsColRef);
    const habits: Habit[] = [];
    habitsSnap.forEach((docSnap) => {
      habits.push(docSnap.data() as Habit);
    });

    // Fetch achievements
    const achDocRef = doc(db, 'users', userId, 'gamification', 'achievements');
    const achSnap = await getDoc(achDocRef);
    const achievements: Achievement[] = achSnap.exists()
      ? (achSnap.data().achievements as Achievement[])
      : [];

    return {
      stats: userData.stats || {
        xp: 0,
        level: 1,
        coins: 0,
        streakShields: 0,
        equippedTitle: 'Novice Seeker',
        activeTheme: 'default',
      },
      habits,
      achievements,
      updatedAt: userData.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to download data from Firestore:', error);
    return null;
  }
}

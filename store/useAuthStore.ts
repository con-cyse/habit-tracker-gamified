import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '@/types/auth';
import { signInWithEmail, signUpWithEmail, signOutUser } from '@/services/authService';
import { uploadUserDataToFirestore, downloadUserDataFromFirestore } from '@/services/syncService';
import { useHabitStore } from './useHabitStore';
import { useGamificationStore } from './useGamificationStore';

interface AuthStoreState {
  user: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;

  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  register: (email: string, pass: string, name: string) => Promise<boolean>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
  syncWithCloud: () => Promise<boolean>;
  restoreFromCloud: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: {
        uid: 'guest_hero_01',
        email: null,
        displayName: 'Hero Explorer',
        isGuest: true,
        createdAt: new Date().toISOString(),
      },
      isGuest: true,
      isLoading: false,
      error: null,
      syncStatus: 'idle',
      lastSyncedAt: null,

      login: async (email: string, pass: string) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await signInWithEmail(email, pass);
          set({ user: profile, isGuest: false, isLoading: false });
          // Automatically try to restore cloud data if available
          await get().restoreFromCloud();
          return true;
        } catch (err: any) {
          set({ error: err?.message || 'Login failed. Please verify credentials.', isLoading: false });
          return false;
        }
      },

      register: async (email: string, pass: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const profile = await signUpWithEmail(email, pass, name);
          set({ user: profile, isGuest: false, isLoading: false });
          // Initial sync of local habits to cloud for the new user
          await get().syncWithCloud();
          return true;
        } catch (err: any) {
          set({ error: err?.message || 'Registration failed.', isLoading: false });
          return false;
        }
      },

      continueAsGuest: () => {
        set({
          user: {
            uid: `guest_${Date.now()}`,
            email: null,
            displayName: 'Adventurer',
            isGuest: true,
            createdAt: new Date().toISOString(),
          },
          isGuest: true,
          error: null,
        });
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOutUser();
        } catch {}
        set({
          user: {
            uid: 'guest_hero_01',
            email: null,
            displayName: 'Hero Explorer',
            isGuest: true,
            createdAt: new Date().toISOString(),
          },
          isGuest: true,
          isLoading: false,
          syncStatus: 'idle',
        });
      },

      syncWithCloud: async () => {
        const user = get().user;
        if (!user || user.isGuest) return false;

        set({ syncStatus: 'syncing' });
        try {
          const habits = useHabitStore.getState().habits;
          const gamification = useGamificationStore.getState();

          const success = await uploadUserDataToFirestore(user.uid, {
            stats: {
              xp: gamification.xp,
              level: gamification.level,
              coins: gamification.coins,
              streakShields: gamification.streakShields,
              equippedTitle: gamification.equippedTitle,
              activeTheme: gamification.activeTheme,
            },
            habits,
            achievements: gamification.achievements,
          });

          if (success) {
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            set({ syncStatus: 'synced', lastSyncedAt: now });
            return true;
          } else {
            set({ syncStatus: 'error' });
            return false;
          }
        } catch {
          set({ syncStatus: 'error' });
          return false;
        }
      },

      restoreFromCloud: async () => {
        const user = get().user;
        if (!user || user.isGuest) return false;

        set({ syncStatus: 'syncing' });
        try {
          const data = await downloadUserDataFromFirestore(user.uid);
          if (data) {
            if (data.habits && data.habits.length > 0) {
              useHabitStore.setState({ habits: data.habits });
            }
            if (data.stats) {
              useGamificationStore.setState({
                xp: data.stats.xp,
                level: data.stats.level,
                coins: data.stats.coins,
                streakShields: data.stats.streakShields,
                equippedTitle: data.stats.equippedTitle,
                activeTheme: data.stats.activeTheme,
              });
            }
            if (data.achievements && data.achievements.length > 0) {
              useGamificationStore.setState({ achievements: data.achievements });
            }
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            set({ syncStatus: 'synced', lastSyncedAt: now });
            return true;
          }
          set({ syncStatus: 'idle' });
          return false;
        } catch {
          set({ syncStatus: 'error' });
          return false;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

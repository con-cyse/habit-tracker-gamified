import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitCategory, HabitDifficulty, HabitFrequency } from '@/types/habit';
import {
  DIFFICULTY_CONFIG,
  INITIAL_HABITS,
  getStreakMultiplier,
} from '@/constants/gamification';
import { getTodayString, getYesterdayString } from '@/utils/date';
import { useGamificationStore } from './useGamificationStore';

interface HabitState {
  habits: Habit[];

  // Actions
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'totalCompletions' | 'lastCompleted' | 'history' | 'createdAt'>) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, dateString?: string) => { completed: boolean; xpEarned: number; multiplier: number };
  resetHabitsToDefaults: () => void;
  getHabitsByCategory: (category: HabitCategory) => Habit[];
  getCompletionRateForDate: (dateString: string) => number;
}

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: INITIAL_HABITS,

      addHabit: (habitData) => {
        const id = `habit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const diffConfig = DIFFICULTY_CONFIG[habitData.difficulty] || DIFFICULTY_CONFIG.medium;

        const newHabit: Habit = {
          ...habitData,
          id,
          xpValue: habitData.xpValue || diffConfig.xp,
          coinValue: habitData.coinValue || diffConfig.coins,
          streak: 0,
          bestStreak: 0,
          totalCompletions: 0,
          lastCompleted: null,
          history: {},
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          habits: [newHabit, ...state.habits],
        }));

        // Re-evaluate achievements (e.g. Well Rounded 4 categories)
        setTimeout(() => {
          const habits = get().habits;
          const uniqueCats = new Set(habits.map((h) => h.category)).size;
          useGamificationStore.getState().evaluateAchievements({
            totalCompletions: habits.reduce((acc, h) => acc + h.totalCompletions, 0),
            maxStreak: Math.max(0, ...habits.map((h) => h.bestStreak)),
            categoriesCount: uniqueCats,
            epicCount: habits.filter((h) => h.difficulty === 'epic').reduce((acc, h) => acc + h.totalCompletions, 0),
            hasCompletedTodayCount: habits.filter((h) => h.history[getTodayString()]).length,
          });
        }, 100);
      },

      updateHabit: (id, updateData) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updateData } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        }));
      },

      toggleHabitCompletion: (id, targetDate = getTodayString()) => {
        const habit = get().habits.find((h) => h.id === id);
        if (!habit) return { completed: false, xpEarned: 0, multiplier: 1.0 };

        const isAlreadyCompleted = !!habit.history[targetDate];
        const yesterday = getYesterdayString();

        if (isAlreadyCompleted) {
          // Uncomplete habit
          const newHistory = { ...habit.history };
          delete newHistory[targetDate];

          const newCompletions = Math.max(0, habit.totalCompletions - 1);
          const newStreak = Math.max(0, habit.streak - 1);

          const updatedHabit: Habit = {
            ...habit,
            history: newHistory,
            totalCompletions: newCompletions,
            streak: newStreak,
            lastCompleted: targetDate === habit.lastCompleted ? null : habit.lastCompleted,
          };

          set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
          }));

          // Rollback XP & Coins
          useGamificationStore.getState().awardXp(-habit.xpValue);
          useGamificationStore.getState().awardCoins(-habit.coinValue);

          return { completed: false, xpEarned: -habit.xpValue, multiplier: 1.0 };
        } else {
          // Complete habit
          const newHistory = {
            ...habit.history,
            [targetDate]: true,
          };

          // Calculate streak
          let newStreak = 1;
          if (habit.lastCompleted === yesterday || (habit.streak > 0 && targetDate === getTodayString() && habit.lastCompleted === yesterday)) {
            newStreak = habit.streak + 1;
          } else if (habit.lastCompleted === targetDate) {
            newStreak = habit.streak;
          } else if (habit.streak > 0) {
            // Check if streak shield can protect the broken chain
            const shielded = useGamificationStore.getState().useStreakShield();
            if (shielded) {
              newStreak = habit.streak + 1;
            } else {
              newStreak = 1;
            }
          }

          const multiplier = getStreakMultiplier(newStreak);
          const xpEarned = Math.round(habit.xpValue * multiplier);
          const coinsEarned = habit.coinValue;
          const newBestStreak = Math.max(habit.bestStreak, newStreak);
          const newTotalCompletions = habit.totalCompletions + 1;

          const updatedHabit: Habit = {
            ...habit,
            history: newHistory,
            streak: newStreak,
            bestStreak: newBestStreak,
            totalCompletions: newTotalCompletions,
            lastCompleted: targetDate,
          };

          set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
          }));

          // Gamification awards
          const gamification = useGamificationStore.getState();
          gamification.awardXp(xpEarned, `Completed ${habit.name}`);
          gamification.awardCoins(coinsEarned);
          gamification.checkQuestsProgress({
            category: habit.category,
            difficulty: habit.difficulty,
            xpEarned,
          });

          // Check all achievements
          const allHabits = get().habits;
          const completedToday = allHabits.filter(
            (h) => h.id === id || h.history[getTodayString()]
          ).length;
          const uniqueCats = new Set(allHabits.map((h) => h.category)).size;
          const epicCompletions = allHabits
            .filter((h) => h.difficulty === 'epic')
            .reduce((acc, h) => acc + (h.id === id ? h.totalCompletions + 1 : h.totalCompletions), 0);

          gamification.evaluateAchievements({
            totalCompletions: allHabits.reduce(
              (acc, h) => acc + (h.id === id ? h.totalCompletions + 1 : h.totalCompletions),
              0
            ),
            maxStreak: Math.max(newBestStreak, ...allHabits.map((h) => h.bestStreak)),
            categoriesCount: uniqueCats,
            epicCount: epicCompletions,
            hasCompletedTodayCount: completedToday,
          });

          return { completed: true, xpEarned, multiplier };
        }
      },

      resetHabitsToDefaults: () => {
        set({ habits: INITIAL_HABITS });
      },

      getHabitsByCategory: (category) => {
        return get().habits.filter((h) => h.category === category);
      },

      getCompletionRateForDate: (dateString) => {
        const habits = get().habits;
        if (habits.length === 0) return 0;
        const completed = habits.filter((h) => !!h.history[dateString]).length;
        return Math.round((completed / habits.length) * 100);
      },
    }),
    {
      name: 'habits-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

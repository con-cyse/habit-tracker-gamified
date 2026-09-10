import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, CelebrationEvent, DailyQuest, ShopItem } from '@/types/gamification';
import { HabitCategory, HabitDifficulty } from '@/types/habit';
import {
  calculateLevelProgress,
  DEFAULT_SHOP_ITEMS,
  INITIAL_ACHIEVEMENTS,
} from '@/constants/gamification';
import { getTodayString } from '@/utils/date';

interface GamificationState {
  xp: number;
  level: number;
  coins: number;
  gems: number;
  streakShields: number;
  achievements: Achievement[];
  dailyQuests: DailyQuest[];
  activeTheme: string;
  purchasedItemIds: string[];
  equippedTitle: string;
  celebrationQueue: CelebrationEvent[];

  // Actions
  awardXp: (amount: number, reason?: string) => void;
  awardCoins: (amount: number) => void;
  useStreakShield: () => boolean;
  buyShopItem: (item: ShopItem) => boolean;
  setActiveTheme: (themeId: string) => void;
  setEquippedTitle: (title: string) => void;
  refreshDailyQuestsIfNeeded: () => void;
  checkQuestsProgress: (event: {
    category: HabitCategory;
    difficulty: HabitDifficulty;
    xpEarned: number;
  }) => void;
  claimQuestReward: (questId: string) => void;
  evaluateAchievements: (stats: {
    totalCompletions: number;
    maxStreak: number;
    categoriesCount: number;
    epicCount: number;
    hasCompletedTodayCount: number;
  }) => void;
  popCelebration: () => void;
  triggerCelebration: (event: CelebrationEvent) => void;
  resetGamification: () => void;
}

function generateDailyQuests(dateStr: string): DailyQuest[] {
  return [
    {
      id: `quest_complete_3_${dateStr}`,
      title: 'Daily Dedication',
      description: 'Complete 3 habits today.',
      targetType: 'complete_any',
      targetCount: 3,
      currentCount: 0,
      xpReward: 35,
      coinReward: 25,
      isCompleted: false,
      isClaimed: false,
      date: dateStr,
    },
    {
      id: `quest_earn_xp_${dateStr}`,
      title: 'XP Harvester',
      description: 'Earn at least 50 XP today.',
      targetType: 'earn_xp',
      targetCount: 50,
      currentCount: 0,
      xpReward: 45,
      coinReward: 30,
      isCompleted: false,
      isClaimed: false,
      date: dateStr,
    },
    {
      id: `quest_hard_${dateStr}`,
      title: 'Courageous Feat',
      description: 'Complete a Hard or Epic habit.',
      targetType: 'complete_category',
      targetCount: 1,
      currentCount: 0,
      xpReward: 60,
      coinReward: 40,
      isCompleted: false,
      isClaimed: false,
      date: dateStr,
    },
  ];
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 150,
      level: 2,
      coins: 85,
      gems: 5,
      streakShields: 1,
      achievements: INITIAL_ACHIEVEMENTS,
      dailyQuests: generateDailyQuests(getTodayString()),
      activeTheme: 'default',
      purchasedItemIds: ['streak_shield'],
      equippedTitle: 'Novice Seeker',
      celebrationQueue: [],

      awardXp: (amount: number, reason?: string) => {
        const currentXp = get().xp;
        const newXp = Math.max(0, currentXp + amount);
        const oldProgress = calculateLevelProgress(currentXp);
        const newProgress = calculateLevelProgress(newXp);

        const levelUp = newProgress.level > oldProgress.level;

        set((state) => {
          const newQueue = [...state.celebrationQueue];
          if (levelUp) {
            newQueue.push({
              type: 'level_up',
              title: `Level Up! Level ${newProgress.level}`,
              subtitle: `You unlocked the rank of "${newProgress.rankTitle}" and earned 50 bonus coins!`,
              rewardCoins: 50,
              badgeIcon: newProgress.badgeIcon,
            });
          }

          return {
            xp: newXp,
            level: newProgress.level,
            coins: levelUp ? state.coins + 50 : state.coins,
            celebrationQueue: newQueue,
          };
        });
      },

      awardCoins: (amount: number) => {
        set((state) => ({ coins: Math.max(0, state.coins + amount) }));
      },

      useStreakShield: () => {
        const { streakShields } = get();
        if (streakShields > 0) {
          set({ streakShields: streakShields - 1 });
          return true;
        }
        return false;
      },

      buyShopItem: (item: ShopItem) => {
        const { coins, purchasedItemIds, streakShields } = get();
        if (coins < item.cost) return false;

        if (item.type === 'shield') {
          set({
            coins: coins - item.cost,
            streakShields: streakShields + 1,
          });
          return true;
        }

        if (purchasedItemIds.includes(item.id)) return false;

        set({
          coins: coins - item.cost,
          purchasedItemIds: [...purchasedItemIds, item.id],
          ...(item.type === 'theme' ? { activeTheme: item.value } : {}),
          ...(item.type === 'title' ? { equippedTitle: item.value } : {}),
        });

        return true;
      },

      setActiveTheme: (themeId: string) => {
        set({ activeTheme: themeId });
      },

      setEquippedTitle: (title: string) => {
        set({ equippedTitle: title });
      },

      refreshDailyQuestsIfNeeded: () => {
        const today = getTodayString();
        const quests = get().dailyQuests;
        if (!quests || quests.length === 0 || quests[0]?.date !== today) {
          set({ dailyQuests: generateDailyQuests(today) });
        }
      },

      checkQuestsProgress: ({ difficulty, xpEarned }) => {
        get().refreshDailyQuestsIfNeeded();
        const quests = get().dailyQuests;
        let updated = false;

        const updatedQuests = quests.map((q) => {
          if (q.isCompleted) return q;

          let newCount = q.currentCount;
          if (q.targetType === 'complete_any') {
            newCount += 1;
          } else if (q.targetType === 'earn_xp') {
            newCount += xpEarned;
          } else if (
            q.targetType === 'complete_category' &&
            (difficulty === 'hard' || difficulty === 'epic')
          ) {
            newCount += 1;
          }

          if (newCount !== q.currentCount) {
            updated = true;
            const isCompleted = newCount >= q.targetCount;
            return {
              ...q,
              currentCount: Math.min(newCount, q.targetCount),
              isCompleted,
            };
          }
          return q;
        });

        if (updated) {
          set({ dailyQuests: updatedQuests });
        }
      },

      claimQuestReward: (questId: string) => {
        const quests = get().dailyQuests;
        const quest = quests.find((q) => q.id === questId);
        if (!quest || !quest.isCompleted || quest.isClaimed) return;

        set((state) => ({
          dailyQuests: state.dailyQuests.map((q) =>
            q.id === questId ? { ...q, isClaimed: true } : q
          ),
          celebrationQueue: [
            ...state.celebrationQueue,
            {
              type: 'quest_claimed',
              title: 'Quest Completed!',
              subtitle: `Claimed ${quest.xpReward} XP and ${quest.coinReward} Coins for "${quest.title}".`,
              rewardXp: quest.xpReward,
              rewardCoins: quest.coinReward,
            },
          ],
        }));

        get().awardXp(quest.xpReward);
        get().awardCoins(quest.coinReward);
      },

      evaluateAchievements: ({
        totalCompletions,
        maxStreak,
        categoriesCount,
        epicCount,
        hasCompletedTodayCount,
      }) => {
        const { achievements, level, coins } = get();
        let changed = false;
        const newCelebrations: CelebrationEvent[] = [];

        const updated = achievements.map((ach) => {
          if (ach.isUnlocked) return ach;

          let val = ach.currentValue;
          if (ach.id === 'first_step') val = totalCompletions;
          else if (ach.id === 'hat_trick') val = hasCompletedTodayCount;
          else if (ach.id === 'week_warrior' || ach.id === 'fortnight_focus' || ach.id === 'monthly_master') {
            val = maxStreak;
          } else if (ach.id === 'century_club') val = totalCompletions;
          else if (ach.id === 'level_five' || ach.id === 'level_ten') val = level;
          else if (ach.id === 'renaissance') val = categoriesCount;
          else if (ach.id === 'epic_slayer') val = epicCount;
          else if (ach.id === 'collector') val = coins;

          const isNowUnlocked = val >= ach.targetValue;
          if (isNowUnlocked) {
            changed = true;
            newCelebrations.push({
              type: 'achievement',
              title: `Badge Unlocked: ${ach.title}!`,
              subtitle: `${ach.description} (+${ach.xpReward} XP, +${ach.coinReward} Coins)`,
              rewardXp: ach.xpReward,
              rewardCoins: ach.coinReward,
              badgeIcon: ach.icon,
            });
            return {
              ...ach,
              currentValue: val,
              isUnlocked: true,
              unlockedAt: new Date().toISOString(),
            };
          } else if (val !== ach.currentValue) {
            changed = true;
            return {
              ...ach,
              currentValue: val,
            };
          }
          return ach;
        });

        if (changed) {
          set((state) => ({
            achievements: updated,
            celebrationQueue: [...state.celebrationQueue, ...newCelebrations],
          }));

          // award rewards for any newly unlocked achievements
          newCelebrations.forEach((event) => {
            if (event.rewardXp) get().awardXp(event.rewardXp);
            if (event.rewardCoins) get().awardCoins(event.rewardCoins);
          });
        }
      },

      popCelebration: () => {
        set((state) => ({
          celebrationQueue: state.celebrationQueue.slice(1),
        }));
      },

      triggerCelebration: (event: CelebrationEvent) => {
        set((state) => ({
          celebrationQueue: [...state.celebrationQueue, event],
        }));
      },

      resetGamification: () => {
        set({
          xp: 150,
          level: 2,
          coins: 85,
          gems: 5,
          streakShields: 1,
          achievements: INITIAL_ACHIEVEMENTS,
          dailyQuests: generateDailyQuests(getTodayString()),
          activeTheme: 'default',
          purchasedItemIds: ['streak_shield'],
          equippedTitle: 'Novice Seeker',
          celebrationQueue: [],
        });
      },
    }),
    {
      name: 'gamification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

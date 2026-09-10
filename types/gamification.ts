import { HabitCategory } from './habit';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  xpReward: number;
  coinReward: number;
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export type QuestTargetType = 'complete_any' | 'complete_category' | 'earn_xp' | 'maintain_streak';

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetType: QuestTargetType;
  category?: HabitCategory;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  coinReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
  date: string;
}

export type ShopItemType = 'theme' | 'shield' | 'title' | 'avatar';

export interface ShopItem {
  id: string;
  title: string;
  description: string;
  type: ShopItemType;
  cost: number;
  icon: string;
  previewColor?: string;
  value: string;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  league: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  streak: number;
  isCurrentUser?: boolean;
}

export interface UserLevelProgress {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  xpForCurrentLevel: number;
  progressPercent: number;
  rankTitle: string;
  badgeIcon: string;
}

export interface CelebrationEvent {
  type: 'level_up' | 'achievement' | 'quest_claimed';
  title: string;
  subtitle: string;
  rewardXp?: number;
  rewardCoins?: number;
  badgeIcon?: string;
}

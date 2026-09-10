import { CategoryMetadata, Habit, HabitCategory, HabitDifficulty } from '@/types/habit';
import { Achievement, DailyQuest, LeaderboardUser, ShopItem, UserLevelProgress } from '@/types/gamification';

export const CATEGORIES: Record<HabitCategory, CategoryMetadata> = {
  health: {
    id: 'health',
    label: 'Health',
    icon: 'heart-outline',
    color: '#10B981', // Emerald
    gradient: ['#10B981', '#059669'],
  },
  fitness: {
    id: 'fitness',
    label: 'Fitness',
    icon: 'barbell-outline',
    color: '#F97316', // Amber-Orange
    gradient: ['#F97316', '#EA580C'],
  },
  productivity: {
    id: 'productivity',
    label: 'Productivity',
    icon: 'flash-outline',
    color: '#6366F1', // Indigo
    gradient: ['#6366F1', '#4F46E5'],
  },
  mindfulness: {
    id: 'mindfulness',
    label: 'Mindfulness',
    icon: 'leaf-outline',
    color: '#06B6D4', // Cyan
    gradient: ['#06B6D4', '#0891B2'],
  },
  learning: {
    id: 'learning',
    label: 'Learning',
    icon: 'book-outline',
    color: '#8B5CF6', // Purple
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  creativity: {
    id: 'creativity',
    label: 'Creativity',
    icon: 'color-palette-outline',
    color: '#EC4899', // Pink
    gradient: ['#EC4899', '#DB2777'],
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    icon: 'wallet-outline',
    color: '#EAB308', // Gold
    gradient: ['#EAB308', '#CA8A04'],
  },
};

export const DIFFICULTY_CONFIG: Record<HabitDifficulty, { xp: number; coins: number; label: string; color: string }> = {
  easy: { xp: 10, coins: 5, label: 'Easy', color: '#10B981' },
  medium: { xp: 20, coins: 10, label: 'Medium', color: '#3B82F6' },
  hard: { xp: 35, coins: 20, label: 'Hard', color: '#F59E0B' },
  epic: { xp: 50, coins: 35, label: 'Epic', color: '#EF4444' },
};

/**
 * Calculates level from total XP based on the proposal formula:
 * level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevelProgress(xp: number): UserLevelProgress {
  const currentLevel = Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
  const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
  const progressInLevel = Math.max(0, xp - xpForCurrentLevel);
  const range = xpForNextLevel - xpForCurrentLevel;
  const progressPercent = Math.min(100, Math.round((progressInLevel / (range || 100)) * 100));

  let rankTitle = 'Novice Wanderer';
  let badgeIcon = 'shield-outline';

  if (currentLevel >= 21) {
    rankTitle = 'Mythic Ascendant';
    badgeIcon = 'planet-outline';
  } else if (currentLevel >= 16) {
    rankTitle = 'Grand Champion';
    badgeIcon = 'trophy-outline';
  } else if (currentLevel >= 11) {
    rankTitle = 'Master of Routine';
    badgeIcon = 'star-outline';
  } else if (currentLevel >= 8) {
    rankTitle = 'Iron Disciplinarian';
    badgeIcon = 'medal-outline';
  } else if (currentLevel >= 5) {
    rankTitle = 'Habit Warrior';
    badgeIcon = 'flame-outline';
  } else if (currentLevel >= 3) {
    rankTitle = 'Dedicated Apprentice';
    badgeIcon = 'sparkles-outline';
  }

  return {
    level: currentLevel,
    currentLevelXp: progressInLevel,
    nextLevelXp: range,
    xpForCurrentLevel,
    progressPercent,
    rankTitle,
    badgeIcon,
  };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 2.0;
  if (streak >= 14) return 1.5;
  if (streak >= 7) return 1.25;
  if (streak >= 3) return 1.1;
  return 1.0;
}

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first habit to begin your epic journey.',
    icon: 'footsteps-outline',
    tier: 'bronze',
    xpReward: 25,
    coinReward: 20,
    targetValue: 1,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'hat_trick',
    title: 'Hat Trick',
    description: 'Complete 3 habits in a single day.',
    icon: 'flame-outline',
    tier: 'bronze',
    xpReward: 40,
    coinReward: 35,
    targetValue: 3,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'week_warrior',
    title: 'Week of Willpower',
    description: 'Maintain a 7-day streak on any habit.',
    icon: 'calendar-outline',
    tier: 'silver',
    xpReward: 75,
    coinReward: 60,
    targetValue: 7,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'fortnight_focus',
    title: 'Iron Fortnight',
    description: 'Maintain a 14-day streak on any habit.',
    icon: 'shield-checkmark-outline',
    tier: 'silver',
    xpReward: 150,
    coinReward: 120,
    targetValue: 14,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'monthly_master',
    title: 'Habit Titan',
    description: 'Reach a legendary 30-day streak.',
    icon: 'trophy-outline',
    tier: 'gold',
    xpReward: 350,
    coinReward: 300,
    targetValue: 30,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Reach 100 total habit completions.',
    icon: 'ribbon-outline',
    tier: 'gold',
    xpReward: 300,
    coinReward: 250,
    targetValue: 100,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'level_five',
    title: 'Ascendant Warrior',
    description: 'Reach Player Level 5.',
    icon: 'sparkles-outline',
    tier: 'bronze',
    xpReward: 80,
    coinReward: 50,
    targetValue: 5,
    currentValue: 1,
    isUnlocked: false,
  },
  {
    id: 'level_ten',
    title: 'Discipline Master',
    description: 'Reach Player Level 10.',
    icon: 'diamond-outline',
    tier: 'silver',
    xpReward: 200,
    coinReward: 150,
    targetValue: 10,
    currentValue: 1,
    isUnlocked: false,
  },
  {
    id: 'renaissance',
    title: 'Well Rounded',
    description: 'Have active habits in at least 4 distinct categories.',
    icon: 'shapes-outline',
    tier: 'silver',
    xpReward: 90,
    coinReward: 75,
    targetValue: 4,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'epic_slayer',
    title: 'Challenge Accepted',
    description: 'Complete an Epic difficulty habit 5 times.',
    icon: 'skull-outline',
    tier: 'silver',
    xpReward: 120,
    coinReward: 100,
    targetValue: 5,
    currentValue: 0,
    isUnlocked: false,
  },
  {
    id: 'collector',
    title: 'Treasury Raider',
    description: 'Accumulate 250 virtual coins.',
    icon: 'cash-outline',
    tier: 'silver',
    xpReward: 100,
    coinReward: 50,
    targetValue: 250,
    currentValue: 50,
    isUnlocked: false,
  },
  {
    id: 'flawless_streak',
    title: 'Perfect Week',
    description: 'Complete 100% of scheduled daily habits 7 days in a row.',
    icon: 'sunny-outline',
    tier: 'platinum',
    xpReward: 500,
    coinReward: 500,
    targetValue: 7,
    currentValue: 0,
    isUnlocked: false,
  },
];

export const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'streak_shield',
    title: 'Streak Freeze Shield',
    description: 'Protects your longest streak if you miss a scheduled day.',
    type: 'shield',
    cost: 75,
    icon: 'shield-half-outline',
    previewColor: '#3B82F6',
    value: 'shield_1',
  },
  {
    id: 'theme_cyberpunk',
    title: 'Cyberpunk Neon',
    description: 'High-contrast electric violet and neon cyan interface.',
    type: 'theme',
    cost: 150,
    icon: 'color-filter-outline',
    previewColor: '#8B5CF6',
    value: 'cyberpunk',
  },
  {
    id: 'theme_emerald',
    title: 'Emerald Sanctuary',
    description: 'Calming botanical jade and moss greens.',
    type: 'theme',
    cost: 120,
    icon: 'leaf-outline',
    previewColor: '#10B981',
    value: 'emerald',
  },
  {
    id: 'theme_sunset',
    title: 'Sunset Blaze',
    description: 'Vibrant golden hour orange and crimson glow.',
    type: 'theme',
    cost: 120,
    icon: 'flame-outline',
    previewColor: '#F97316',
    value: 'sunset',
  },
  {
    id: 'title_routine_god',
    title: 'Title: "Master of Habit"',
    description: 'Equip an exclusive title next to your player name.',
    type: 'title',
    cost: 100,
    icon: 'text-outline',
    previewColor: '#F59E0B',
    value: 'Master of Habit',
  },
  {
    id: 'title_unstoppable',
    title: 'Title: "The Unstoppable"',
    description: 'Show everyone in the leaderboard that you never yield.',
    type: 'title',
    cost: 200,
    icon: 'flash-outline',
    previewColor: '#EC4899',
    value: 'The Unstoppable',
  },
];

export const SEED_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user_1',
    rank: 1,
    username: 'AuraWalker',
    avatar: '👑',
    level: 15,
    xp: 23400,
    league: 'Diamond',
    streak: 42,
  },
  {
    id: 'user_2',
    rank: 2,
    username: 'ZenithFocus',
    avatar: '⚡',
    level: 13,
    xp: 18200,
    league: 'Diamond',
    streak: 35,
  },
  {
    id: 'user_3',
    rank: 3,
    username: 'IronWill_99',
    avatar: '🛡️',
    level: 11,
    xp: 13500,
    league: 'Gold',
    streak: 28,
  },
  {
    id: 'user_4',
    rank: 4,
    username: 'HabitSamurai',
    avatar: '⚔️',
    level: 9,
    xp: 8900,
    league: 'Gold',
    streak: 21,
  },
  {
    id: 'user_5',
    rank: 5,
    username: 'PixelRunner',
    avatar: '🎮',
    level: 7,
    xp: 5200,
    league: 'Silver',
    streak: 14,
  },
  {
    id: 'user_6',
    rank: 6,
    username: 'SolarFlare',
    avatar: '☀️',
    level: 5,
    xp: 2800,
    league: 'Silver',
    streak: 9,
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit_1',
    name: 'Hydrate 2 Liters',
    description: 'Drink fresh water throughout the day to stay energized',
    category: 'health',
    icon: 'water-outline',
    color: '#06B6D4',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    reminderTime: '08:00 AM',
    difficulty: 'easy',
    xpValue: 10,
    coinValue: 5,
    streak: 3,
    bestStreak: 7,
    totalCompletions: 12,
    lastCompleted: null,
    history: {},
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
  {
    id: 'habit_2',
    name: 'Morning Meditation',
    description: '10 minutes of mindfulness and controlled breathing',
    category: 'mindfulness',
    icon: 'flower-outline',
    color: '#10B981',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    reminderTime: '07:30 AM',
    difficulty: 'medium',
    xpValue: 20,
    coinValue: 10,
    streak: 2,
    bestStreak: 5,
    totalCompletions: 8,
    lastCompleted: null,
    history: {},
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'habit_3',
    name: '30-Min Gym Workout',
    description: 'Strength training or cardio endurance session',
    category: 'fitness',
    icon: 'barbell-outline',
    color: '#F97316',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    reminderTime: '05:30 PM',
    difficulty: 'hard',
    xpValue: 35,
    coinValue: 20,
    streak: 5,
    bestStreak: 10,
    totalCompletions: 18,
    lastCompleted: null,
    history: {},
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  },
  {
    id: 'habit_4',
    name: 'Read 20 Pages',
    description: 'Read a book to expand knowledge and discipline',
    category: 'learning',
    icon: 'book-outline',
    color: '#8B5CF6',
    frequency: 'daily',
    targetDaysPerWeek: 7,
    reminderTime: '09:00 PM',
    difficulty: 'medium',
    xpValue: 20,
    coinValue: 10,
    streak: 1,
    bestStreak: 4,
    totalCompletions: 6,
    lastCompleted: null,
    history: {},
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'habit_5',
    name: 'Code Deep Work (1hr)',
    description: 'Uninterrupted programming on key architectural features',
    category: 'productivity',
    icon: 'code-slash-outline',
    color: '#6366F1',
    frequency: 'daily',
    targetDaysPerWeek: 5,
    reminderTime: '10:00 AM',
    difficulty: 'epic',
    xpValue: 50,
    coinValue: 35,
    streak: 4,
    bestStreak: 6,
    totalCompletions: 14,
    lastCompleted: null,
    history: {},
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

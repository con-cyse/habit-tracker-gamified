export type HabitCategory = 
  | 'health' 
  | 'fitness' 
  | 'productivity' 
  | 'mindfulness' 
  | 'learning' 
  | 'creativity' 
  | 'finance';

export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: HabitCategory;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetDaysPerWeek: number;
  reminderTime?: string | null;
  difficulty: HabitDifficulty;
  xpValue: number;
  coinValue: number;
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  lastCompleted: string | null; // ISO YYYY-MM-DD
  history: Record<string, boolean>; // key: YYYY-MM-DD
  createdAt: string;
  archived?: boolean;
}

export interface CategoryMetadata {
  id: HabitCategory;
  label: string;
  icon: string;
  color: string;
  gradient: [string, string];
}

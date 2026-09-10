import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Habit } from '@/types/habit';
import { CATEGORIES, DIFFICULTY_CONFIG, getStreakMultiplier } from '@/constants/gamification';
import { getTodayString } from '@/utils/date';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
}

export function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const isCompletedToday = !!habit.history[getTodayString()];
  const categoryMeta = CATEGORIES[habit.category] || CATEGORIES.health;
  const diffConfig = DIFFICULTY_CONFIG[habit.difficulty] || DIFFICULTY_CONFIG.medium;
  const multiplier = getStreakMultiplier(habit.streak);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Haptics.impactAsync(
      isCompletedToday ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Heavy
    );

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle(habit.id);
  };

  return (
    <Animated.View style={[styles.cardWrapper, { transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={
          isCompletedToday
            ? ['#162822', '#111827', '#0F172A']
            : ['#1F2430', '#181B26', '#12141D']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          isCompletedToday && styles.completedBorder,
        ]}
      >
        <View style={styles.contentRow}>
          {/* Category Icon */}
          <View style={[styles.iconContainer, { backgroundColor: `${categoryMeta.color}22` }]}>
            <Ionicons
              name={(habit.icon as any) || (categoryMeta.icon as any)}
              size={22}
              color={categoryMeta.color}
            />
          </View>

          {/* Details */}
          <View style={styles.textDetails}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.habitTitle,
                  isCompletedToday && styles.completedHabitTitle,
                ]}
                numberOfLines={1}
              >
                {habit.name}
              </Text>
            </View>

            {habit.description ? (
              <Text style={styles.habitDescription} numberOfLines={1}>
                {habit.description}
              </Text>
            ) : null}

            {/* Badges row: streak, difficulty, XP */}
            <View style={styles.badgesRow}>
              {/* Streak */}
              <View
                style={[
                  styles.streakBadge,
                  habit.streak > 0 && styles.activeStreakBadge,
                ]}
              >
                <Ionicons
                  name={habit.streak > 0 ? 'flame' : 'flame-outline'}
                  size={13}
                  color={habit.streak > 0 ? '#F97316' : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.streakText,
                    habit.streak > 0 && styles.activeStreakText,
                  ]}
                >
                  {habit.streak}d
                </Text>
                {multiplier > 1.0 && (
                  <Text style={styles.multiplierText}>{multiplier}x</Text>
                )}
              </View>

              {/* Difficulty Tag */}
              <View
                style={[
                  styles.diffBadge,
                  { backgroundColor: `${diffConfig.color}1E` },
                ]}
              >
                <Text style={[styles.diffText, { color: diffConfig.color }]}>
                  {diffConfig.label}
                </Text>
              </View>

              {/* XP Value */}
              <View style={styles.xpBadge}>
                <Ionicons name="sparkles" size={11} color="#A78BFA" />
                <Text style={styles.xpText}>+{Math.round(habit.xpValue * multiplier)} XP</Text>
              </View>

              {habit.reminderTime ? (
                <View style={styles.timeBadge}>
                  <Ionicons name="time-outline" size={11} color="#9CA3AF" />
                  <Text style={styles.timeText}>{habit.reminderTime}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* Complete Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleToggle}
            style={[
              styles.checkboxButton,
              isCompletedToday && styles.completedCheckbox,
            ]}
          >
            {isCompletedToday ? (
              <Ionicons name="checkmark-sharp" size={22} color="#FFF" />
            ) : (
              <View style={styles.emptyCircle} />
            )}
          </TouchableOpacity>
        </View>

        {/* Quick actions row */}
        <View style={styles.actionsBar}>
          <TouchableOpacity
            onPress={() => onEdit?.(habit)}
            style={styles.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={14} color="#6B7280" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete?.(habit.id)}
            style={styles.actionBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  completedBorder: {
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitTitle: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  completedHabitTitle: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  habitDescription: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  activeStreakBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderWidth: 0.5,
  },
  streakText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
  },
  activeStreakText: {
    color: '#FB923C',
  },
  multiplierText: {
    color: '#F59E0B',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 1,
  },
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '700',
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  xpText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '700',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  timeText: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
  checkboxButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  completedCheckbox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
  },
});

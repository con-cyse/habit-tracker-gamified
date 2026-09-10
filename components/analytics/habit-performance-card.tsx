import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Habit } from '@/types/habit';
import { CATEGORIES } from '@/constants/gamification';

interface HabitPerformanceCardProps {
  habit: Habit;
}

export function HabitPerformanceCard({ habit }: HabitPerformanceCardProps) {
  const meta = CATEGORIES[habit.category] || CATEGORIES.health;
  const daysTracked = Math.max(
    1,
    Math.round(
      (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  const consistencyRate = Math.min(
    100,
    Math.round((habit.totalCompletions / daysTracked) * 100)
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: `${meta.color}22` }]}>
          <Ionicons name={(meta.icon as any) || 'sparkles'} size={18} color={meta.color} />
        </View>

        <View style={styles.titleInfo}>
          <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
          <Text style={styles.category}>{meta.label} • {habit.frequency}</Text>
        </View>

        <View style={styles.rateBadge}>
          <Text style={styles.rateText}>{consistencyRate}%</Text>
          <Text style={styles.rateLabel}>rate</Text>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Current Streak</Text>
          <View style={styles.metricValRow}>
            <Ionicons name="flame" size={13} color="#F97316" />
            <Text style={styles.metricVal}>{habit.streak} days</Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Best Streak</Text>
          <View style={styles.metricValRow}>
            <Ionicons name="trophy" size={13} color="#FBBF24" />
            <Text style={styles.metricVal}>{habit.bestStreak} days</Text>
          </View>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Completed</Text>
          <View style={styles.metricValRow}>
            <Ionicons name="checkmark-circle" size={13} color="#10B981" />
            <Text style={styles.metricVal}>{habit.totalCompletions}x</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E2330',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleInfo: {
    flex: 1,
  },
  name: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  category: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  rateBadge: {
    alignItems: 'flex-end',
  },
  rateText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '800',
  },
  rateLabel: {
    color: '#6B7280',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  metricItem: {
    alignItems: 'flex-start',
  },
  metricLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricVal: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '700',
  },
});

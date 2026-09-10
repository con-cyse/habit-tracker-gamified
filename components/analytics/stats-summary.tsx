import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StatsSummaryProps {
  completionRateToday: number;
  bestStreak: number;
  totalCompletions: number;
  totalXp: number;
}

export function StatsSummary({
  completionRateToday,
  bestStreak,
  totalCompletions,
  totalXp,
}: StatsSummaryProps) {
  const metrics = [
    {
      label: "Today's Rate",
      value: `${completionRateToday}%`,
      icon: 'pie-chart-outline',
      color: '#10B981',
      gradient: ['#10B981', '#059669'] as [string, string],
    },
    {
      label: 'Best Streak',
      value: `${bestStreak}d`,
      icon: 'flame-outline',
      color: '#F97316',
      gradient: ['#F97316', '#EA580C'] as [string, string],
    },
    {
      label: 'Completions',
      value: `${totalCompletions}`,
      icon: 'checkmark-done-outline',
      color: '#6366F1',
      gradient: ['#6366F1', '#4F46E5'] as [string, string],
    },
    {
      label: 'Total XP',
      value: `${totalXp.toLocaleString()}`,
      icon: 'sparkles-outline',
      color: '#8B5CF6',
      gradient: ['#8B5CF6', '#7C3AED'] as [string, string],
    },
  ];

  return (
    <View style={styles.grid}>
      {metrics.map((m, idx) => (
        <LinearGradient
          key={idx}
          colors={['#1F2330', '#141720']}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: `${m.color}22` }]}>
              <Ionicons name={m.icon as any} size={16} color={m.color} />
            </View>
            <Text style={styles.cardLabel}>{m.label}</Text>
          </View>
          <Text style={[styles.cardValue, { color: m.color }]}>{m.value}</Text>
        </LinearGradient>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  iconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
});

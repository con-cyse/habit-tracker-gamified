import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Habit, HabitCategory } from '@/types/habit';
import { CATEGORIES } from '@/constants/gamification';

interface CategoryDistributionProps {
  habits: Habit[];
}

export function CategoryDistribution({ habits }: CategoryDistributionProps) {
  const categoryCounts: Partial<Record<HabitCategory, number>> = {};
  habits.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const total = habits.length || 1;
  const activeCategories = (Object.keys(categoryCounts) as HabitCategory[]).sort(
    (a, b) => (categoryCounts[b] || 0) - (categoryCounts[a] || 0)
  );

  return (
    <LinearGradient
      colors={['#1F2330', '#151720']}
      style={styles.container}
    >
      <Text style={styles.title}>Category Breakdown</Text>

      {activeCategories.length === 0 ? (
        <Text style={styles.emptyText}>No habits created yet</Text>
      ) : (
        activeCategories.map((catKey) => {
          const meta = CATEGORIES[catKey];
          const count = categoryCounts[catKey] || 0;
          const percent = Math.round((count / total) * 100);

          return (
            <View key={catKey} style={styles.catRow}>
              <View style={styles.rowHeader}>
                <View style={styles.labelGroup}>
                  <Ionicons name={meta.icon as any} size={15} color={meta.color} />
                  <Text style={styles.catName}>{meta.label}</Text>
                </View>
                <Text style={styles.countText}>
                  {count} {count === 1 ? 'habit' : 'habits'} ({percent}%)
                </Text>
              </View>

              <View style={styles.track}>
                <LinearGradient
                  colors={meta.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.fill, { width: `${percent}%` }]}
                />
              </View>
            </View>
          );
        })
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 13,
  },
  catRow: {
    marginBottom: 12,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catName: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
  countText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});

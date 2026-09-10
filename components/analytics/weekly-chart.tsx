import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Habit } from '@/types/habit';
import { getPastNDays, getTodayString } from '@/utils/date';

interface WeeklyChartProps {
  habits: Habit[];
}

export function WeeklyChart({ habits }: WeeklyChartProps) {
  const days = getPastNDays(7);
  const todayStr = getTodayString();

  return (
    <LinearGradient
      colors={['#1F2330', '#151720']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Consistency</Text>
        <Text style={styles.subtitle}>Past 7 Days</Text>
      </View>

      <View style={styles.chartRow}>
        {days.map((d) => {
          const completedCount = habits.filter((h) => !!h.history[d.dateString]).length;
          const totalHabits = habits.length || 1;
          const rate = Math.round((completedCount / totalHabits) * 100);
          const isToday = d.dateString === todayStr;

          return (
            <View key={d.dateString} style={styles.dayCol}>
              <Text style={styles.rateLabel}>{rate > 0 ? `${rate}%` : '-'}</Text>

              {/* Bar track */}
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={rate >= 80 ? ['#10B981', '#34D399'] : ['#8B5CF6', '#EC4899']}
                  style={[styles.barFill, { height: `${Math.max(6, rate)}%` }]}
                />
              </View>

              {/* Day Label */}
              <View style={[styles.dayBadge, isToday && styles.todayBadge]}>
                <Text style={[styles.dayText, isToday && styles.todayText]}>
                  {d.dayLabel}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  dayCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  rateLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 6,
  },
  barTrack: {
    width: 14,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  dayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  todayBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  dayText: {
    color: '#6B7280',
    fontSize: 11,
    fontWeight: '600',
  },
  todayText: {
    color: '#DDD6FE',
    fontWeight: '800',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useHabitStore } from '@/store/useHabitStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { StatsSummary } from '@/components/analytics/stats-summary';
import { WeeklyChart } from '@/components/analytics/weekly-chart';
import { CategoryDistribution } from '@/components/analytics/category-distribution';
import { HabitPerformanceCard } from '@/components/analytics/habit-performance-card';
import { getTodayString } from '@/utils/date';

export default function AnalyticsScreen() {
  const habits = useHabitStore((state) => state.habits);
  const xp = useGamificationStore((state) => state.xp);

  const todayStr = getTodayString();
  const completedToday = habits.filter((h) => !!h.history[todayStr]).length;
  const totalHabits = habits.length || 1;
  const completionRateToday = Math.round((completedToday / totalHabits) * 100);

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Actionable Insights</Text>
          <Text style={styles.subtitle}>Track behavioral patterns and habit consistency</Text>
        </View>

        {/* 4 Metric Summary Cards */}
        <StatsSummary
          completionRateToday={completionRateToday}
          bestStreak={bestStreak}
          totalCompletions={totalCompletions}
          totalXp={xp}
        />

        {/* 7-Day Consistency Chart */}
        <WeeklyChart habits={habits} />

        {/* Category Breakdown */}
        <CategoryDistribution habits={habits} />

        {/* Individual Habit Performance Breakdown */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Individual Habit Performance</Text>
        </View>

        {habits.map((habit) => (
          <HabitPerformanceCard key={habit.id} habit={habit} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F1117',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  contentContainer: {
    paddingBottom: 90,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '700',
  },
});

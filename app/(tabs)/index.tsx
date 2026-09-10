import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useHabitStore } from '@/store/useHabitStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { HabitCard } from '@/components/habit/habit-card';
import { XpBar } from '@/components/gamification/xp-bar';
import { CATEGORIES } from '@/constants/gamification';
import { HabitCategory } from '@/types/habit';
import { getTodayString } from '@/utils/date';

export default function DashboardScreen() {
  const router = useRouter();
  const habits = useHabitStore((state) => state.habits);
  const toggleHabitCompletion = useHabitStore((state) => state.toggleHabitCompletion);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);
  const resetHabits = useHabitStore((state) => state.resetHabitsToDefaults);

  const dailyQuests = useGamificationStore((state) => state.dailyQuests);
  const uncompletedQuests = dailyQuests.filter((q) => !q.isClaimed);

  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');

  const todayStr = getTodayString();
  const completedTodayCount = habits.filter((h) => !!h.history[todayStr]).length;
  const totalHabitsCount = habits.length;

  const filteredHabits = selectedCategory === 'all'
    ? habits
    : habits.filter((h) => h.category === selectedCategory);

  const handleCategorySelect = (cat: HabitCategory | 'all') => {
    Haptics.selectionAsync();
    setSelectedCategory(cat);
  };

  const handleToggle = (id: string) => {
    toggleHabitCompletion(id);
  };

  const handleEdit = (habit: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/modal',
      params: { editId: habit.id },
    });
  };

  const handleDelete = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    deleteHabit(id);
  };

  const handleCreateNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/modal');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* App Bar Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Ready for Adventure?</Text>
            <Text style={styles.dateSubtitle}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleCreateNew}
            style={styles.headerAddBtn}
          >
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.addBtnGradient}
            >
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.addBtnText}>New Habit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Hero Gamification XP & Level Banner */}
        <XpBar
          onPressProfile={() => router.push('/(tabs)/profile' as any)}
          onPressShop={() => router.push('/(tabs)/gamification' as any)}
        />

        {/* Daily Quests Teaser Card */}
        {uncompletedQuests.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)/gamification' as any)}
            style={styles.questTeaser}
          >
            <LinearGradient
              colors={['#1E1B4B', '#111827']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.questTeaserGradient}
            >
              <View style={styles.questIconBox}>
                <Ionicons name="sparkles" size={16} color="#A78BFA" />
              </View>
              <View style={styles.questTextCol}>
                <Text style={styles.questTeaserTitle}>Daily Quests Active</Text>
                <Text style={styles.questTeaserSubtitle}>
                  {uncompletedQuests[0]?.title} • +{uncompletedQuests[0]?.xpReward} XP reward
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Category Filters */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleCategorySelect('all')}
              style={[
                styles.categoryChip,
                selectedCategory === 'all' && styles.categoryChipActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === 'all' && styles.categoryChipTextActive,
                ]}
              >
                All Habits
              </Text>
            </TouchableOpacity>

            {(Object.keys(CATEGORIES) as HabitCategory[]).map((catKey) => {
              const meta = CATEGORIES[catKey];
              const isSelected = selectedCategory === catKey;
              return (
                <TouchableOpacity
                  key={catKey}
                  activeOpacity={0.7}
                  onPress={() => handleCategorySelect(catKey)}
                  style={[
                    styles.categoryChip,
                    isSelected && {
                      backgroundColor: `${meta.color}22`,
                      borderColor: meta.color,
                    },
                  ]}
                >
                  <Ionicons
                    name={meta.icon as any}
                    size={14}
                    color={isSelected ? meta.color : '#9CA3AF'}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && { color: meta.color, fontWeight: '700' },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Section Header with completion status */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? "Today's Quests" : `${CATEGORIES[selectedCategory]?.label} Quests`}
          </Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusText}>
              {completedTodayCount} of {totalHabitsCount} done
            </Text>
          </View>
        </View>

        {/* Habit Cards */}
        {filteredHabits.length > 0 ? (
          filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No habits found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategory === 'all'
                ? 'Create a new habit or restore the default starter quests.'
                : 'No habits in this category yet.'}
            </Text>

            <View style={styles.emptyBtnRow}>
              <TouchableOpacity
                onPress={handleCreateNew}
                style={styles.emptyAddBtn}
              >
                <Text style={styles.emptyAddBtnText}>+ Add New Habit</Text>
              </TouchableOpacity>

              {habits.length === 0 && (
                <TouchableOpacity
                  onPress={resetHabits}
                  style={styles.emptyResetBtn}
                >
                  <Text style={styles.emptyResetBtnText}>Restore Defaults</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dateSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  headerAddBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  questTeaser: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
  },
  questTeaserGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    borderRadius: 14,
  },
  questIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  questTextCol: {
    flex: 1,
  },
  questTeaserTitle: {
    color: '#DDD6FE',
    fontSize: 12,
    fontWeight: '700',
  },
  questTeaserSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 1,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  categoryChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#DDD6FE',
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '700',
  },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  emptyBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyAddBtn: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyAddBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyResetBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyResetBtnText: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 13,
  },
});

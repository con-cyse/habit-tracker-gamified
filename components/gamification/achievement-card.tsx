import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Achievement, AchievementTier } from '@/types/gamification';

interface AchievementCardProps {
  achievement: Achievement;
}

const TIER_COLORS: Record<AchievementTier, { gradient: [string, string]; border: string; label: string }> = {
  bronze: {
    gradient: ['#B45309', '#78350F'],
    border: '#D97706',
    label: 'Bronze',
  },
  silver: {
    gradient: ['#64748B', '#334155'],
    border: '#94A3B8',
    label: 'Silver',
  },
  gold: {
    gradient: ['#F59E0B', '#B45309'],
    border: '#FBBF24',
    label: 'Gold',
  },
  platinum: {
    gradient: ['#0284C7', '#4F46E5'],
    border: '#38BDF8',
    label: 'Platinum',
  },
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const tierMeta = TIER_COLORS[achievement.tier] || TIER_COLORS.bronze;
  const percent = Math.min(100, Math.round((achievement.currentValue / achievement.targetValue) * 100));

  return (
    <LinearGradient
      colors={
        achievement.isUnlocked
          ? ['#1E2230', '#151924']
          : ['#171922', '#11131A']
      }
      style={[
        styles.card,
        achievement.isUnlocked && { borderColor: `${tierMeta.border}66` },
      ]}
    >
      <View style={styles.topRow}>
        {/* Tier badge icon */}
        <LinearGradient
          colors={achievement.isUnlocked ? tierMeta.gradient : ['#262936', '#1A1C24']}
          style={[
            styles.badgeCircle,
            { borderColor: achievement.isUnlocked ? tierMeta.border : 'rgba(255, 255, 255, 0.1)' },
          ]}
        >
          <Ionicons
            name={(achievement.icon as any) || 'trophy'}
            size={24}
            color={achievement.isUnlocked ? '#FFF' : '#6B7280'}
          />
        </LinearGradient>

        <View style={styles.detailsCol}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                !achievement.isUnlocked && styles.lockedTitle,
              ]}
              numberOfLines={1}
            >
              {achievement.title}
            </Text>
            <View style={[styles.tierTag, { backgroundColor: `${tierMeta.border}22` }]}>
              <Text style={[styles.tierTagText, { color: tierMeta.border }]}>
                {tierMeta.label}
              </Text>
            </View>
          </View>

          <Text style={styles.description}>{achievement.description}</Text>
        </View>
      </View>

      {/* Progress or Unlocked Banner */}
      {achievement.isUnlocked ? (
        <View style={styles.unlockedRow}>
          <View style={styles.unlockedStatus}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.unlockedText}>Unlocked</Text>
          </View>

          <View style={styles.rewardsRow}>
            <Text style={styles.rewardTag}>+{achievement.xpReward} XP</Text>
            <Text style={styles.rewardTagCoin}>+{achievement.coinReward} Coins</Text>
          </View>
        </View>
      ) : (
        <View style={styles.progressSection}>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>Progress</Text>
            <Text style={styles.progressCount}>
              {achievement.currentValue} / {achievement.targetValue} ({percent}%)
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 12,
  },
  detailsCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  lockedTitle: {
    color: '#9CA3AF',
  },
  tierTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  description: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
  unlockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  unlockedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  rewardTag: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
  },
  rewardTagCoin: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  progressSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '600',
  },
  progressCount: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
});

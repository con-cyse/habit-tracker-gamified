import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DailyQuest } from '@/types/gamification';

interface DailyQuestCardProps {
  quest: DailyQuest;
  onClaim: (questId: string) => void;
}

export function DailyQuestCard({ quest, onClaim }: DailyQuestCardProps) {
  const percent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

  const handleClaim = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClaim(quest.id);
  };

  return (
    <LinearGradient
      colors={
        quest.isClaimed
          ? ['#131B20', '#0E1417']
          : quest.isCompleted
          ? ['#1C2333', '#161D2B']
          : ['#1A1D27', '#13151D']
      }
      style={[
        styles.container,
        quest.isCompleted && !quest.isClaimed && styles.readyBorder,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleInfo}>
          <Text
            style={[
              styles.questTitle,
              quest.isClaimed && styles.claimedText,
            ]}
          >
            {quest.title}
          </Text>
          <Text style={styles.questDescription}>{quest.description}</Text>
        </View>

        {/* Claim or Status Badge */}
        {quest.isClaimed ? (
          <View style={styles.claimedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.claimedBadgeText}>Claimed</Text>
          </View>
        ) : quest.isCompleted ? (
          <TouchableOpacity activeOpacity={0.8} onPress={handleClaim} style={styles.claimBtn}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.claimBtnGradient}
            >
              <Text style={styles.claimBtnText}>Claim</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.progressCounter}>
            <Text style={styles.progressCounterText}>
              {quest.currentCount}/{quest.targetCount}
            </Text>
          </View>
        )}
      </View>

      {/* Progress bar */}
      {!quest.isClaimed && (
        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={quest.isCompleted ? ['#10B981', '#34D399'] : ['#6366F1', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${percent}%` }]}
          />
        </View>
      )}

      {/* Reward tags */}
      <View style={styles.rewardsRow}>
        <View style={styles.rewardChip}>
          <Ionicons name="sparkles" size={11} color="#A78BFA" />
          <Text style={styles.rewardChipText}>+{quest.xpReward} XP</Text>
        </View>
        <View style={[styles.rewardChip, styles.coinChip]}>
          <Ionicons name="cash" size={12} color="#FBBF24" />
          <Text style={[styles.rewardChipText, { color: '#FDE047' }]}>+{quest.coinReward} Coins</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  readyBorder: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleInfo: {
    flex: 1,
    marginRight: 10,
  },
  questTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  claimedText: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  questDescription: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  claimedBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  claimBtn: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  claimBtnGradient: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  claimBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  progressCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  progressCounterText: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  coinChip: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
  },
  rewardChipText: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '700',
  },
});

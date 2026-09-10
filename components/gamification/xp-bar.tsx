import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { calculateLevelProgress } from '@/constants/gamification';
import { useGamificationStore } from '@/store/useGamificationStore';
import * as Haptics from 'expo-haptics';

interface XpBarProps {
  onPressProfile?: () => void;
  onPressShop?: () => void;
}

export function XpBar({ onPressProfile, onPressShop }: XpBarProps) {
  const xp = useGamificationStore((state) => state.xp);
  const coins = useGamificationStore((state) => state.coins);
  const streakShields = useGamificationStore((state) => state.streakShields);
  const equippedTitle = useGamificationStore((state) => state.equippedTitle);

  const progress = calculateLevelProgress(xp);

  return (
    <LinearGradient
      colors={['#1F1D36', '#141226', '#0F0E17']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPressProfile?.();
          }}
          style={styles.levelBadgeContainer}
        >
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.levelBadge}
          >
            <Ionicons name="sparkles" size={14} color="#FFF" />
            <Text style={styles.levelNumber}>Lv {progress.level}</Text>
          </LinearGradient>
          <View style={styles.titleWrapper}>
            <Text style={styles.rankTitle}>{progress.rankTitle}</Text>
            {equippedTitle ? <Text style={styles.customTitle}>{equippedTitle}</Text> : null}
          </View>
        </TouchableOpacity>

        <View style={styles.currencyRow}>
          {streakShields > 0 && (
            <View style={styles.currencyPill}>
              <Ionicons name="shield-checkmark" size={14} color="#60A5FA" />
              <Text style={[styles.currencyText, { color: '#93C5FD' }]}>{streakShields}</Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onPressShop?.();
            }}
            style={[styles.currencyPill, styles.coinPill]}
          >
            <Ionicons name="cash" size={15} color="#FBBF24" />
            <Text style={styles.coinText}>{coins}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.xpLabelRow}>
          <Text style={styles.xpDetail}>
            {progress.currentLevelXp} / {progress.nextLevelXp} XP
          </Text>
          <Text style={styles.xpPercent}>{progress.progressPercent}% to Lv {progress.level + 1}</Text>
        </View>

        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${Math.max(5, progress.progressPercent)}%` }]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  levelBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  levelNumber: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  titleWrapper: {
    marginLeft: 10,
    flex: 1,
  },
  rankTitle: {
    color: '#F3F4F6',
    fontWeight: '700',
    fontSize: 14,
  },
  customTitle: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  coinPill: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
  },
  currencyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  coinText: {
    color: '#FDE047',
    fontSize: 13,
    fontWeight: '800',
  },
  progressSection: {
    marginTop: 2,
  },
  xpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  xpDetail: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  xpPercent: {
    color: '#C4B5FD',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
});

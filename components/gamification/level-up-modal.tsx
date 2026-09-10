import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGamificationStore } from '@/store/useGamificationStore';

const { width } = Dimensions.get('window');

export function CelebrationModal() {
  const celebrationQueue = useGamificationStore((state) => state.celebrationQueue);
  const popCelebration = useGamificationStore((state) => state.popCelebration);

  const currentEvent = celebrationQueue[0];
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentEvent) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
    }
  }, [currentEvent, opacityAnim, scaleAnim]);

  if (!currentEvent) return null;

  const isLevelUp = currentEvent.type === 'level_up';
  const isAchievement = currentEvent.type === 'achievement';

  const handleClaim = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      popCelebration();
    });
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={handleClaim}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={
              isLevelUp
                ? ['#2E1065', '#1E1B4B', '#0F172A']
                : isAchievement
                ? ['#312E81', '#1E293B', '#0F172A']
                : ['#14532D', '#064E3B', '#022C22']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Celebration Icon */}
            <View style={styles.iconCircleWrapper}>
              <LinearGradient
                colors={
                  isLevelUp
                    ? ['#EC4899', '#8B5CF6']
                    : isAchievement
                    ? ['#F59E0B', '#EF4444']
                    : ['#10B981', '#06B6D4']
                }
                style={styles.iconCircle}
              >
                <Ionicons
                  name={
                    (currentEvent.badgeIcon as any) ||
                    (isLevelUp ? 'trophy' : isAchievement ? 'ribbon' : 'checkmark-circle')
                  }
                  size={42}
                  color="#FFF"
                />
              </LinearGradient>
            </View>

            {/* Titles */}
            <Text style={styles.title}>{currentEvent.title}</Text>
            <Text style={styles.subtitle}>{currentEvent.subtitle}</Text>

            {/* Rewards */}
            {(currentEvent.rewardCoins || currentEvent.rewardXp) && (
              <View style={styles.rewardsRow}>
                {currentEvent.rewardXp ? (
                  <View style={styles.rewardChip}>
                    <Ionicons name="sparkles" size={16} color="#A78BFA" />
                    <Text style={styles.rewardText}>+{currentEvent.rewardXp} XP</Text>
                  </View>
                ) : null}

                {currentEvent.rewardCoins ? (
                  <View style={[styles.rewardChip, styles.coinChip]}>
                    <Ionicons name="cash" size={16} color="#FBBF24" />
                    <Text style={[styles.rewardText, { color: '#FDE047' }]}>
                      +{currentEvent.rewardCoins} Coins
                    </Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* Claim button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.claimButton}
              onPress={handleClaim}
            >
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Claim Rewards</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrapper: {
    width: Math.min(width - 48, 380),
    borderRadius: 28,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  card: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  iconCircleWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  rewardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  rewardChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  coinChip: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: 'rgba(251, 191, 36, 0.4)',
  },
  rewardText: {
    color: '#DDD6FE',
    fontSize: 13,
    fontWeight: '700',
  },
  claimButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

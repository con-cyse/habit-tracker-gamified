import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LeaderboardUser } from '@/types/gamification';

interface LeaderboardRowProps {
  user: LeaderboardUser;
}

export function LeaderboardRow({ user }: LeaderboardRowProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', color: '#F59E0B' };
    if (rank === 2) return { icon: '🥈', color: '#94A3B8' };
    if (rank === 3) return { icon: '🥉', color: '#B45309' };
    return { icon: `#${rank}`, color: '#6B7280' };
  };

  const badge = getRankBadge(user.rank);

  return (
    <View style={[styles.row, user.isCurrentUser && styles.currentUserRow]}>
      <View style={styles.rankCol}>
        {user.rank <= 3 ? (
          <Text style={styles.medalEmoji}>{badge.icon}</Text>
        ) : (
          <Text style={[styles.rankNumber, { color: badge.color }]}>{badge.icon}</Text>
        )}
      </View>

      <View style={styles.avatarCircle}>
        <Text style={styles.avatarEmoji}>{user.avatar}</Text>
      </View>

      <View style={styles.nameCol}>
        <View style={styles.nameRow}>
          <Text style={[styles.username, user.isCurrentUser && styles.currentUsername]}>
            {user.username}
          </Text>
          {user.isCurrentUser && (
            <View style={styles.youBadge}>
              <Text style={styles.youBadgeText}>YOU</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.levelText}>Lv {user.level}</Text>
          <View style={styles.streakTag}>
            <Ionicons name="flame" size={11} color="#F97316" />
            <Text style={styles.streakText}>{user.streak}d</Text>
          </View>
          <Text style={styles.leagueText}>{user.league}</Text>
        </View>
      </View>

      <View style={styles.xpCol}>
        <Text style={styles.xpText}>{user.xp.toLocaleString()}</Text>
        <Text style={styles.xpLabel}>XP</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  currentUserRow: {
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  rankCol: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalEmoji: {
    fontSize: 18,
  },
  rankNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  nameCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    color: '#F3F4F6',
    fontSize: 14,
    fontWeight: '700',
  },
  currentUsername: {
    color: '#DDD6FE',
  },
  youBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  youBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 8,
  },
  levelText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  streakText: {
    color: '#F97316',
    fontSize: 11,
    fontWeight: '700',
  },
  leagueText: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  xpCol: {
    alignItems: 'flex-end',
  },
  xpText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  xpLabel: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
});

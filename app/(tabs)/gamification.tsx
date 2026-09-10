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
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useGamificationStore } from '@/store/useGamificationStore';
import { DailyQuestCard } from '@/components/gamification/daily-quest-card';
import { AchievementCard } from '@/components/gamification/achievement-card';
import { ShopItemCard } from '@/components/gamification/shop-item-card';
import { LeaderboardRow } from '@/components/gamification/leaderboard-row';
import { DEFAULT_SHOP_ITEMS, SEED_LEADERBOARD } from '@/constants/gamification';
import { LeaderboardUser, ShopItem } from '@/types/gamification';

type GamificationSubTab = 'quests' | 'badges' | 'shop' | 'leaderboard';

export default function GamificationScreen() {
  const [activeTab, setActiveTab] = useState<GamificationSubTab>('quests');

  const dailyQuests = useGamificationStore((state) => state.dailyQuests);
  const achievements = useGamificationStore((state) => state.achievements);
  const coins = useGamificationStore((state) => state.coins);
  const activeTheme = useGamificationStore((state) => state.activeTheme);
  const equippedTitle = useGamificationStore((state) => state.equippedTitle);
  const purchasedItemIds = useGamificationStore((state) => state.purchasedItemIds);
  const xp = useGamificationStore((state) => state.xp);
  const level = useGamificationStore((state) => state.level);

  const claimQuestReward = useGamificationStore((state) => state.claimQuestReward);
  const buyShopItem = useGamificationStore((state) => state.buyShopItem);
  const setActiveTheme = useGamificationStore((state) => state.setActiveTheme);
  const setEquippedTitle = useGamificationStore((state) => state.setEquippedTitle);

  const handleTabChange = (tab: GamificationSubTab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const handleBuy = (item: ShopItem) => {
    buyShopItem(item);
  };

  const handleEquip = (item: ShopItem) => {
    if (item.type === 'theme') {
      setActiveTheme(item.value);
    } else if (item.type === 'title') {
      setEquippedTitle(item.value);
    }
  };

  // Prepare leaderboard with current user inserted
  const currentUserEntry: LeaderboardUser = {
    id: 'current_user',
    rank: 4,
    username: 'You (Hero)',
    avatar: '🌟',
    level,
    xp,
    league: level >= 10 ? 'Gold' : 'Silver',
    streak: 5,
    isCurrentUser: true,
  };

  const fullLeaderboard = [...SEED_LEADERBOARD];
  fullLeaderboard.splice(3, 0, currentUserEntry);
  // Re-rank
  const rankedUsers = fullLeaderboard.map((u, i) => ({ ...u, rank: i + 1 }));

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Quests & Rewards</Text>
            <Text style={styles.subtitle}>Unlock achievements and upgrade your hero</Text>
          </View>

          <View style={styles.coinBadge}>
            <Ionicons name="cash" size={15} color="#FBBF24" />
            <Text style={styles.coinText}>{coins}</Text>
          </View>
        </View>

        {/* Sub-tab pills */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('quests')}
            style={[styles.tabBtn, activeTab === 'quests' && styles.tabBtnActive]}
          >
            <Ionicons
              name="flash-outline"
              size={14}
              color={activeTab === 'quests' ? '#DDD6FE' : '#9CA3AF'}
            />
            <Text style={[styles.tabText, activeTab === 'quests' && styles.tabTextActive]}>
              Quests
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('badges')}
            style={[styles.tabBtn, activeTab === 'badges' && styles.tabBtnActive]}
          >
            <Ionicons
              name="trophy-outline"
              size={14}
              color={activeTab === 'badges' ? '#DDD6FE' : '#9CA3AF'}
            />
            <Text style={[styles.tabText, activeTab === 'badges' && styles.tabTextActive]}>
              Badges ({unlockedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('shop')}
            style={[styles.tabBtn, activeTab === 'shop' && styles.tabBtnActive]}
          >
            <Ionicons
              name="cart-outline"
              size={14}
              color={activeTab === 'shop' ? '#DDD6FE' : '#9CA3AF'}
            />
            <Text style={[styles.tabText, activeTab === 'shop' && styles.tabTextActive]}>
              Shop
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleTabChange('leaderboard')}
            style={[styles.tabBtn, activeTab === 'leaderboard' && styles.tabBtnActive]}
          >
            <Ionicons
              name="podium-outline"
              size={14}
              color={activeTab === 'leaderboard' ? '#DDD6FE' : '#9CA3AF'}
            />
            <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.tabTextActive]}>
              Ranks
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* TAB 1: DAILY QUESTS */}
          {activeTab === 'quests' && (
            <View>
              <View style={styles.tabSectionHeader}>
                <Text style={styles.tabSectionTitle}>{"Today's Challenges"}</Text>
                <Text style={styles.tabSectionSubtitle}>Refreshed every 24 hours</Text>
              </View>

              {dailyQuests.map((quest) => (
                <DailyQuestCard
                  key={quest.id}
                  quest={quest}
                  onClaim={claimQuestReward}
                />
              ))}
            </View>
          )}

          {/* TAB 2: ACHIEVEMENTS & BADGES */}
          {activeTab === 'badges' && (
            <View>
              <View style={styles.tabSectionHeader}>
                <Text style={styles.tabSectionTitle}>Hero Trophies</Text>
                <Text style={styles.tabSectionSubtitle}>
                  {unlockedCount} of {achievements.length} achievements unlocked
                </Text>
              </View>

              {achievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </View>
          )}

          {/* TAB 3: REWARDS SHOP */}
          {activeTab === 'shop' && (
            <View>
              <View style={styles.tabSectionHeader}>
                <Text style={styles.tabSectionTitle}>Virtual Market</Text>
                <Text style={styles.tabSectionSubtitle}>
                  Spend hard-earned coins on cosmetics & streak shields
                </Text>
              </View>

              {DEFAULT_SHOP_ITEMS.map((item) => {
                const isOwned = purchasedItemIds.includes(item.id);
                const isEquipped =
                  (item.type === 'theme' && activeTheme === item.value) ||
                  (item.type === 'title' && equippedTitle === item.value);

                return (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    userCoins={coins}
                    isOwned={isOwned}
                    isEquipped={isEquipped}
                    onBuy={handleBuy}
                    onEquip={handleEquip}
                  />
                );
              })}
            </View>
          )}

          {/* TAB 4: LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <View>
              <View style={styles.tabSectionHeader}>
                <Text style={styles.tabSectionTitle}>Weekly Division Rivals</Text>
                <Text style={styles.tabSectionSubtitle}>
                  Compete with fellow adventurers across leagues
                </Text>
              </View>

              {rankedUsers.map((user) => (
                <LeaderboardRow key={user.id} user={user} />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  coinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  coinText: {
    color: '#FDE047',
    fontSize: 14,
    fontWeight: '800',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  tabBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  tabText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#DDD6FE',
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 90,
  },
  tabSectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 4,
  },
  tabSectionTitle: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '700',
  },
  tabSectionSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
});

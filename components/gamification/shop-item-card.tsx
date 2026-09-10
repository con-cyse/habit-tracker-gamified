import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ShopItem } from '@/types/gamification';

interface ShopItemCardProps {
  item: ShopItem;
  userCoins: number;
  isOwned: boolean;
  isEquipped: boolean;
  onBuy: (item: ShopItem) => void;
  onEquip?: (item: ShopItem) => void;
}

export function ShopItemCard({
  item,
  userCoins,
  isOwned,
  isEquipped,
  onBuy,
  onEquip,
}: ShopItemCardProps) {
  const canAfford = userCoins >= item.cost;

  const handleAction = () => {
    if (isOwned) {
      if (item.type === 'shield') {
        // Shields are consumable stackables
        if (canAfford) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onBuy(item);
        }
      } else if (!isEquipped) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onEquip?.(item);
      }
    } else {
      if (canAfford) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onBuy(item);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#1F2330', '#151821']}
      style={[
        styles.card,
        isEquipped && styles.equippedCard,
      ]}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${item.previewColor || '#8B5CF6'}22` },
          ]}
        >
          <Ionicons
            name={(item.icon as any) || 'gift-outline'}
            size={24}
            color={item.previewColor || '#A78BFA'}
          />
        </View>

        <View style={styles.infoCol}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        {/* Cost Tag */}
        <View style={styles.costBadge}>
          <Ionicons name="cash" size={14} color="#FBBF24" />
          <Text style={styles.costText}>{item.cost} Coins</Text>
        </View>

        {/* Action Button */}
        {isEquipped ? (
          <View style={styles.equippedBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text style={styles.equippedText}>Active</Text>
          </View>
        ) : isOwned && item.type !== 'shield' ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleAction}
            style={styles.equipBtn}
          >
            <Text style={styles.equipBtnText}>Equip</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAction}
            disabled={!canAfford}
            style={[styles.buyBtn, !canAfford && styles.buyBtnDisabled]}
          >
            <LinearGradient
              colors={canAfford ? ['#8B5CF6', '#EC4899'] : ['#374151', '#1F2937']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buyBtnGradient}
            >
              <Text style={[styles.buyBtnText, !canAfford && styles.buyBtnTextDisabled]}>
                {item.type === 'shield' && isOwned ? '+ Buy More' : 'Unlock'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
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
  equippedCard: {
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  costText: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '700',
  },
  equippedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  equippedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '700',
  },
  equipBtn: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  equipBtnText: {
    color: '#DDD6FE',
    fontSize: 12,
    fontWeight: '700',
  },
  buyBtn: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  buyBtnDisabled: {
    opacity: 0.6,
  },
  buyBtnGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  buyBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  buyBtnTextDisabled: {
    color: '#9CA3AF',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '@/store/useAuthStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { useHabitStore } from '@/store/useHabitStore';
import { calculateLevelProgress } from '@/constants/gamification';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const isGuest = useAuthStore((state) => state.isGuest);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const syncStatus = useAuthStore((state) => state.syncStatus);
  const lastSyncedAt = useAuthStore((state) => state.lastSyncedAt);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const syncWithCloud = useAuthStore((state) => state.syncWithCloud);
  const restoreFromCloud = useAuthStore((state) => state.restoreFromCloud);
  const clearError = useAuthStore((state) => state.clearError);

  const xp = useGamificationStore((state) => state.xp);
  const coins = useGamificationStore((state) => state.coins);
  const equippedTitle = useGamificationStore((state) => state.equippedTitle);
  const activeTheme = useGamificationStore((state) => state.activeTheme);
  const setActiveTheme = useGamificationStore((state) => state.setActiveTheme);
  const resetGamification = useGamificationStore((state) => state.resetGamification);
  const resetHabits = useHabitStore((state) => state.resetHabitsToDefaults);

  const progress = calculateLevelProgress(xp);

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleAuthSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter email and password.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (authMode === 'signup') {
      await register(email.trim(), password.trim(), displayName.trim());
    } else {
      await login(email.trim(), password.trim());
    }
  };

  const handleSync = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const ok = await syncWithCloud();
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const ok = await restoreFromCloud();
    if (ok) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Restored', 'Your data was synchronized from Firebase Cloud Firestore.');
    } else {
      Alert.alert('Notice', 'No previous cloud backup found for this account.');
    }
  };

  const handleResetDemo = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    resetHabits();
    resetGamification();
    Alert.alert('Demo Reset', 'Default habits and gamification stats have been restored.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hero Profile</Text>
          <Text style={styles.subtitle}>Character stats and synchronization</Text>
        </View>

        {/* Hero Card */}
        <LinearGradient
          colors={['#2E1065', '#1E1B4B', '#111827']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.avatarRow}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmoji}>⚔️</Text>
            </View>

            <View style={styles.heroDetails}>
              <Text style={styles.heroName}>
                {user?.displayName || (isGuest ? 'Hero Explorer' : 'Adventurer')}
              </Text>
              <Text style={styles.heroRank}>{progress.rankTitle}</Text>
              {equippedTitle ? (
                <View style={styles.equippedTag}>
                  <Text style={styles.equippedTagText}>{equippedTitle}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>Lv {progress.level}</Text>
            </View>
          </View>

          {/* Mini Stats Row */}
          <View style={styles.miniStatsRow}>
            <View style={styles.miniStat}>
              <Text style={styles.miniStatVal}>{xp}</Text>
              <Text style={styles.miniStatLabel}>Total XP</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={[styles.miniStatVal, { color: '#FDE047' }]}>{coins}</Text>
              <Text style={styles.miniStatLabel}>Coins</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={[styles.miniStatVal, { color: '#60A5FA' }]}>
                {isGuest ? 'Offline' : 'Cloud'}
              </Text>
              <Text style={styles.miniStatLabel}>Sync</Text>
            </View>
          </View>
        </LinearGradient>

        {/* CLOUD & AUTH SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Firebase Cloud Sync & Account</Text>

          {isGuest ? (
            <View style={styles.authCard}>
              <View style={styles.guestNotice}>
                <Ionicons name="cloud-offline-outline" size={20} color="#F59E0B" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.guestNoticeTitle}>Offline Guest Mode Active</Text>
                  <Text style={styles.guestNoticeText}>
                    All your habits, XP, and badges are securely saved locally. Sign in with Firebase to enable cross-device cloud sync.
                  </Text>
                </View>
              </View>

              {/* Mode Toggle */}
              <View style={styles.authToggleRow}>
                <TouchableOpacity
                  onPress={() => {
                    clearError();
                    setAuthMode('signin');
                  }}
                  style={[styles.authToggleBtn, authMode === 'signin' && styles.authToggleBtnActive]}
                >
                  <Text style={[styles.authToggleText, authMode === 'signin' && styles.authToggleTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    clearError();
                    setAuthMode('signup');
                  }}
                  style={[styles.authToggleBtn, authMode === 'signup' && styles.authToggleBtnActive]}
                >
                  <Text style={[styles.authToggleText, authMode === 'signup' && styles.authToggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

              {authMode === 'signup' && (
                <TextInput
                  style={styles.authInput}
                  placeholder="Hero Name"
                  placeholderTextColor="#6B7280"
                  value={displayName}
                  onChangeText={setDisplayName}
                />
              )}

              <TextInput
                style={styles.authInput}
                placeholder="Email Address"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                style={styles.authInput}
                placeholder="Password"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAuthSubmit}
                disabled={isLoading}
                style={styles.authSubmitBtn}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.authGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.authSubmitText}>
                      {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authCard}>
              <View style={styles.userRow}>
                <Ionicons name="cloud-done-outline" size={24} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <Text style={styles.syncStatusText}>
                    Status:{' '}
                    {syncStatus === 'syncing'
                      ? 'Syncing with Firestore...'
                      : syncStatus === 'synced'
                      ? `Synced at ${lastSyncedAt || 'just now'}`
                      : syncStatus === 'error'
                      ? 'Offline / Check Connection'
                      : 'Connected'}
                  </Text>
                </View>
              </View>

              <View style={styles.syncBtnRow}>
                <TouchableOpacity
                  onPress={handleSync}
                  style={styles.syncBtn}
                >
                  <Ionicons name="cloud-upload-outline" size={16} color="#8B5CF6" />
                  <Text style={styles.syncBtnText}>Backup to Cloud</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRestore}
                  style={styles.syncBtn}
                >
                  <Ionicons name="cloud-download-outline" size={16} color="#10B981" />
                  <Text style={[styles.syncBtnText, { color: '#10B981' }]}>Restore</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                <Text style={styles.logoutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ACTIVE THEME SELECTOR */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Theme Skin</Text>
          <View style={styles.themeGrid}>
            {[
              { id: 'default', name: 'Default Dark', color: '#8B5CF6' },
              { id: 'cyberpunk', name: 'Cyberpunk', color: '#EC4899' },
              { id: 'emerald', name: 'Emerald', color: '#10B981' },
              { id: 'sunset', name: 'Sunset Blaze', color: '#F97316' },
            ].map((t) => {
              const isCurrent = activeTheme === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setActiveTheme(t.id);
                  }}
                  style={[
                    styles.themeCard,
                    isCurrent && { borderColor: t.color, backgroundColor: `${t.color}15` },
                  ]}
                >
                  <View style={[styles.themeDot, { backgroundColor: t.color }]} />
                  <Text style={[styles.themeName, isCurrent && { color: '#FFF', fontWeight: '700' }]}>
                    {t.name}
                  </Text>
                  {isCurrent && <Ionicons name="checkmark-circle" size={14} color={t.color} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RESET & TESTING ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Demo & Reset Controls</Text>
          <TouchableOpacity onPress={handleResetDemo} style={styles.resetBtn}>
            <Ionicons name="refresh-outline" size={16} color="#D1D5DB" />
            <Text style={styles.resetBtnText}>Restore Default Starter Habits & Quests</Text>
          </TouchableOpacity>
        </View>
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
  heroCard: {
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarEmoji: {
    fontSize: 26,
  },
  heroDetails: {
    flex: 1,
  },
  heroName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  heroRank: {
    color: '#DDD6FE',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  equippedTag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  equippedTagText: {
    color: '#F472B6',
    fontSize: 10,
    fontWeight: '700',
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  miniStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatVal: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  miniStatLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  authCard: {
    backgroundColor: '#1E2330',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  guestNotice: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  guestNoticeTitle: {
    color: '#FBBF24',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  guestNoticeText: {
    color: '#D1D5DB',
    fontSize: 11,
    lineHeight: 16,
  },
  authToggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    padding: 3,
    marginBottom: 12,
  },
  authToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  authToggleBtnActive: {
    backgroundColor: '#8B5CF6',
  },
  authToggleText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  authToggleTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  authInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 14,
    marginBottom: 10,
  },
  authSubmitBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  authGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authSubmitText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  userEmail: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  syncStatusText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  syncBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  syncBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  syncBtnText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  themeCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2330',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  themeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  themeName: {
    color: '#9CA3AF',
    fontSize: 12,
    flex: 1,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  resetBtnText: {
    color: '#D1D5DB',
    fontSize: 13,
    fontWeight: '600',
  },
});

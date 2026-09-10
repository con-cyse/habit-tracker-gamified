# Habit Tracker with Gamification ⚔️✨

A cross-platform mobile application built with **React Native (Expo SDK 54)** that transforms daily habit formation into an RPG-style quest adventure. Maintain streaks, gain experience points (XP), level up, unlock achievement badges, spend coins in the virtual reward shop, and analyze your behavioral trends with visual analytics.

---

## 🌟 Key Features

### 1. Robust Habit & Quest Management
- **Define & Customize**: Create habits with title, description, category (Health, Fitness, Productivity, Mindfulness, Learning, Creativity, Finance), frequency, reminder times, and accent colors.
- **Difficulty Tiers & Rewards**: Easy (+10 XP, +5 Coins), Medium (+20 XP, +10 Coins), Hard (+35 XP, +20 Coins), Epic (+50 XP, +35 Coins).
- **One-Tap Completion**: Interactive checkbox buttons with animated feedback and haptic responses (`expo-haptics`).
- **Streak Continuity Engine**: Tracks daily streaks and all-time best streaks. Multiplier bonuses (up to 2.0x XP) reward consistent habit completion.

### 2. Deep Gamification Mechanics
- **Leveling Formula**: Calculates character levels from accumulated XP (`level = floor(sqrt(xp / 100)) + 1`) with rank titles ranging from *Novice Wanderer* to *Mythic Ascendant*.
- **Level-Up Celebrations**: Full-screen modal celebration with rewards breakdown, rank title advancements, and coin grants.
- **Daily Quests**: Dynamic daily challenges (e.g. *Daily Dedication*, *XP Harvester*, *Courageous Feat*) that reset every 24 hours with claimable XP and coin bonuses.
- **Trophies & Badges**: 12 diverse achievements spanning Bronze, Silver, Gold, and Platinum tiers with live progress tracking and unlock notifications.
- **Virtual Market & Shop**: Spend earned virtual coins on UI themes (*Cyberpunk Neon*, *Emerald Sanctuary*, *Sunset Blaze*), *Streak Freeze Shields*, and exclusive player titles.
- **Division Leaderboards**: Compete with rivals across weekly competitive leagues (Bronze, Silver, Gold, Diamond).

### 3. Actionable Insights & Data Visualization
- **Overview Metrics**: Today's completion rate percentage, best streak, total lifetime completions, and total XP earned.
- **Weekly Consistency Chart**: 7-day visual consistency bar chart with daily completion rates.
- **Category Distribution**: Breakdown of active habits across lifestyle categories with percentage progress bars.
- **Habit Performance Cards**: Detailed consistency rates, current streaks, and completion counts per habit.

### 4. Offline-First & Firebase Synchronization
- **Zero-Friction Offline Mode**: Powered by `@react-native-async-storage/async-storage` and Zustand, allowing the app to run instantly out of the box with zero setup.
- **Firebase Authentication & Firestore Sync**: Email/password authentication, guest mode, and bi-directional backup/restore with Google Cloud Firestore (`users/{uid}/habits`, `users/{uid}/stats`, `users/{uid}/gamification`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Expo CLI (`npx expo`)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npx expo start
```

Press:
- `w` to open in your web browser
- `a` to open in an Android Emulator
- `i` to open in an iOS Simulator
- Scan the QR code with the **Expo Go** app on your physical mobile device

### 3. (Optional) Configure Firebase Cloud Sync
If you wish to enable live cloud sync to your own Firebase project:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password) and **Firestore Database**.
3. Create an `.env` file in the root directory:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Architecture

```
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom navigation tabs configuration
│   │   ├── index.tsx         # Habit Dashboard (XP hero banner, habit list, FAB)
│   │   ├── analytics.tsx     # Actionable insights & weekly consistency charts
│   │   ├── gamification.tsx  # Daily quests, badges, virtual shop, leaderboard
│   │   └── profile.tsx       # Hero stats, theme skins, Firebase Auth & sync
│   ├── _layout.tsx           # Root navigation stack & celebration modal overlay
│   └── modal.tsx             # Habit creation & editing modal
├── components/
│   ├── analytics/            # Stats summary, weekly charts, category breakdowns
│   ├── gamification/         # XP bar, celebration modals, quest cards, badges, shop
│   └── habit/                # Habit card with streak indicators, habit form
├── constants/
│   └── gamification.ts       # Level formulas, badge definitions, shop catalog, seed data
├── services/
│   ├── firebase.ts           # Firebase SDK initialization
│   ├── authService.ts        # Sign up, sign in, sign out, auth state listener
│   └── syncService.ts        # Firestore cloud upload & download
├── store/
│   ├── useHabitStore.ts      # Zustand store for habit CRUD and streak tracking
│   ├── useGamificationStore.ts # Zustand store for XP, level, quests, coins, badges
│   └── useAuthStore.ts       # Zustand store for user session and cloud sync
├── types/
│   ├── habit.ts              # Habit, Category, Difficulty interfaces
│   ├── gamification.ts       # Gamification, Quest, Badge, Shop interfaces
│   └── auth.ts               # User profile and session interfaces
└── utils/
    └── date.ts               # Date formatting and streak calculation helpers
```

---

## 🧪 Testing & Validation

```bash
# Validate TypeScript types
npx tsc --noEmit

# Validate code formatting & linting
npm run lint

# Validate web production bundle
npx expo export --platform web
```

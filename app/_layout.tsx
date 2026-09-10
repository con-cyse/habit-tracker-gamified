import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { CelebrationModal } from '@/components/gamification/level-up-modal';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#11131A',
          },
          headerTintColor: '#FFF',
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: '#0F1117',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Configure Quest',
            headerStyle: {
              backgroundColor: '#161924',
            },
            headerTintColor: '#FFF',
          }}
        />
      </Stack>
      <CelebrationModal />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

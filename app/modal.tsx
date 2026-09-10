import React from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHabitStore } from '@/store/useHabitStore';
import { HabitForm } from '@/components/habit/habit-form';

export default function HabitModalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ editId?: string }>();
  const editId = params.editId;

  const habits = useHabitStore((state) => state.habits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const updateHabit = useHabitStore((state) => state.updateHabit);

  const existingHabit = editId ? habits.find((h) => h.id === editId) : null;

  const handleSave = (habitData: any) => {
    if (existingHabit) {
      updateHabit(existingHabit.id, habitData);
    } else {
      addHabit(habitData);
    }
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <HabitForm
          initialHabit={existingHabit}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#12141D',
  },
  container: {
    flex: 1,
    backgroundColor: '#12141D',
  },
});

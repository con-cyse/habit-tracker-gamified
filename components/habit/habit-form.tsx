import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Habit, HabitCategory, HabitDifficulty, HabitFrequency } from '@/types/habit';
import { CATEGORIES, DIFFICULTY_CONFIG } from '@/constants/gamification';

interface HabitFormProps {
  initialHabit?: Habit | null;
  onSave: (habitData: {
    name: string;
    description: string;
    category: HabitCategory;
    icon: string;
    color: string;
    frequency: HabitFrequency;
    targetDaysPerWeek: number;
    difficulty: HabitDifficulty;
    reminderTime: string | null;
  }) => void;
  onCancel: () => void;
}

const COLOR_OPTIONS = [
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EAB308', // Gold
  '#EF4444', // Red
];

const PRESET_TIMES = ['07:00 AM', '08:30 AM', '12:30 PM', '06:00 PM', '09:00 PM'];

export function HabitForm({ initialHabit, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(initialHabit?.name || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(initialHabit?.category || 'health');
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(initialHabit?.difficulty || 'medium');
  const [frequency, setFrequency] = useState<HabitFrequency>(initialHabit?.frequency || 'daily');
  const [selectedColor, setSelectedColor] = useState(initialHabit?.color || CATEGORIES[category].color);
  const [reminderTime, setReminderTime] = useState<string | null>(initialHabit?.reminderTime || null);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = (cat: HabitCategory) => {
    Haptics.selectionAsync();
    setCategory(cat);
    if (!initialHabit) {
      setSelectedColor(CATEGORIES[cat].color);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Please provide a habit name');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      icon: CATEGORIES[category].icon,
      color: selectedColor,
      frequency,
      targetDaysPerWeek: frequency === 'daily' ? 7 : 3,
      difficulty,
      reminderTime,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Habit Name *</Text>
        <TextInput
          style={[styles.textInput, error && !name.trim() && styles.inputError]}
          placeholder="e.g. Read 15 Pages, 20 Pushups..."
          placeholderTextColor="#6B7280"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error) setError(null);
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description (Optional)</Text>
        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="What is your motivation or target?"
          placeholderTextColor="#6B7280"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />
      </View>

      {/* Category Pills */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          {(Object.keys(CATEGORIES) as HabitCategory[]).map((catKey) => {
            const meta = CATEGORIES[catKey];
            const isSelected = category === catKey;
            return (
              <TouchableOpacity
                key={catKey}
                activeOpacity={0.7}
                onPress={() => handleCategorySelect(catKey)}
                style={[
                  styles.categoryPill,
                  isSelected && {
                    backgroundColor: `${meta.color}2A`,
                    borderColor: meta.color,
                  },
                ]}
              >
                <Ionicons
                  name={meta.icon as any}
                  size={16}
                  color={isSelected ? meta.color : '#9CA3AF'}
                />
                <Text
                  style={[
                    styles.categoryPillText,
                    isSelected && { color: meta.color, fontWeight: '700' },
                  ]}
                >
                  {meta.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Difficulty & XP Tier */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Quest Difficulty & XP</Text>
        <View style={styles.diffRow}>
          {(['easy', 'medium', 'hard', 'epic'] as HabitDifficulty[]).map((diffKey) => {
            const diff = DIFFICULTY_CONFIG[diffKey];
            const isSelected = difficulty === diffKey;
            return (
              <TouchableOpacity
                key={diffKey}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.selectionAsync();
                  setDifficulty(diffKey);
                }}
                style={[
                  styles.diffCard,
                  isSelected && {
                    borderColor: diff.color,
                    backgroundColor: `${diff.color}1E`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.diffCardTitle,
                    isSelected && { color: diff.color, fontWeight: '800' },
                  ]}
                >
                  {diff.label}
                </Text>
                <Text style={styles.diffCardXp}>+{diff.xp} XP</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Frequency */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Frequency</Text>
        <View style={styles.freqRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.selectionAsync();
              setFrequency('daily');
            }}
            style={[styles.freqBtn, frequency === 'daily' && styles.freqBtnActive]}
          >
            <Text
              style={[
                styles.freqBtnText,
                frequency === 'daily' && styles.freqBtnTextActive,
              ]}
            >
              Every Day
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.selectionAsync();
              setFrequency('weekly');
            }}
            style={[styles.freqBtn, frequency === 'weekly' && styles.freqBtnActive]}
          >
            <Text
              style={[
                styles.freqBtnText,
                frequency === 'weekly' && styles.freqBtnTextActive,
              ]}
            >
              Weekly Goal
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Reminder Time */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Daily Reminder</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillRow}>
          <TouchableOpacity
            onPress={() => setReminderTime(null)}
            style={[styles.timeChip, reminderTime === null && styles.timeChipActive]}
          >
            <Text style={[styles.timeChipText, reminderTime === null && styles.timeChipTextActive]}>
              None
            </Text>
          </TouchableOpacity>
          {PRESET_TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                Haptics.selectionAsync();
                setReminderTime(t);
              }}
              style={[styles.timeChip, reminderTime === t && styles.timeChipActive]}
            >
              <Text style={[styles.timeChipText, reminderTime === t && styles.timeChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Color Accent */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Accent Color</Text>
        <View style={styles.colorRow}>
          {COLOR_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedColor(c);
              }}
              style={[
                styles.colorDot,
                { backgroundColor: c },
                selectedColor === c && styles.colorDotSelected,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={onCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit} style={styles.saveButton}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={styles.saveButtonText}>
              {initialHabit ? 'Save Changes' : 'Create Quest'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFF',
    fontSize: 15,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  multilineInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  pillRow: {
    flexDirection: 'row',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    gap: 6,
  },
  categoryPillText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  diffRow: {
    flexDirection: 'row',
    gap: 8,
  },
  diffCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  diffCardTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  diffCardXp: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '700',
  },
  freqRow: {
    flexDirection: 'row',
    gap: 12,
  },
  freqBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  freqBtnActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  freqBtnText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  freqBtnTextActive: {
    color: '#DDD6FE',
    fontWeight: '700',
  },
  timeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  timeChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderColor: '#8B5CF6',
  },
  timeChipText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  timeChipTextActive: {
    color: '#DDD6FE',
    fontWeight: '700',
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: '#FFF',
    transform: [{ scale: 1.15 }],
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 15,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    borderRadius: 14,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

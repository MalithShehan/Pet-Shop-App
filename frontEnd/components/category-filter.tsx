import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type Props<T extends string> = {
  categories: readonly T[];
  selected: T;
  onSelect: (category: T) => void;
};

export function CategoryFilter<T extends string>({ categories, selected, onSelect }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => {
        const active = selected === category;

        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.text, active && styles.textActive]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  text: {
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  textActive: {
    color: 'white',
  },
});

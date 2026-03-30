import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type Props<T extends string> = {
  categories: readonly T[];
  selected: T;
  onSelect: (category: T) => void;
  icons?: Partial<Record<T, keyof typeof Ionicons.glyphMap>>;
};

export function CategoryFilter<T extends string>({ categories, selected, onSelect, icons }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {categories.map((category) => {
        const active = selected === category;
        const icon = icons?.[category];

        return (
          <Pressable
            key={category}
            onPress={() => onSelect(category)}
            style={[styles.chip, active && styles.chipActive]}>
            {icon ? <Ionicons name={icon} size={14} color={active ? 'white' : AppTheme.colors.primaryDark} /> : null}
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
    backgroundColor: '#FBF7F1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: '#E7A648',
  },
  text: {
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  textActive: {
    color: 'white',
  },
});

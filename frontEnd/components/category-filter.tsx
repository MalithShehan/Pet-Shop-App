import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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
            style={styles.chipWrap}>
            <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
              {icon ? (
                <Ionicons
                  name={icon}
                  size={22}
                  color={active ? AppTheme.colors.surface : AppTheme.colors.primaryDark}
                />
              ) : null}
            </View>
            <Text style={[styles.text, active && styles.textActive]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 16,
    paddingVertical: 8,
    paddingRight: 4,
  },
  chipWrap: {
    alignItems: 'center',
    gap: 6,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppTheme.colors.primarySoft,
    borderWidth: 2,
    borderColor: AppTheme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primaryDark,
    ...AppTheme.shadow.glow,
  },
  text: {
    color: AppTheme.colors.textMuted,
    fontWeight: '600',
    fontSize: 12,
  },
  textActive: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
  },
});

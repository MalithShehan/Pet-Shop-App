import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search products...' }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name="search" size={18} color={AppTheme.colors.textSoft} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
  },
});

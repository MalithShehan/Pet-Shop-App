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
      <View style={styles.iconWrap}>
        <Ionicons name="search" size={16} color={AppTheme.colors.textSoft} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={AppTheme.colors.textMuted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: AppTheme.colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...AppTheme.shadow.soft,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.mutedBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});

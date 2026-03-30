import { StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

export function Footer() {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Pet Shop Mobile</Text>
      <Text style={styles.caption}>Adopt responsibly. Love endlessly.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  caption: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
  },
});

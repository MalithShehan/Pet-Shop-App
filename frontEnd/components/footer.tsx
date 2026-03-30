import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppTheme } from '@/constants/app-theme';

export function Footer() {
  return (
    <View style={styles.wrap}>
      <LinearGradient colors={['#FFFFFFE8', '#FFFFFFD0']} style={styles.panel}>
        <Text style={styles.title}>Pet Shop Mobile</Text>
        <Text style={styles.caption}>Adopt responsibly. Love endlessly.</Text>

        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Verified Health</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Trusted Support</Text>
          </View>
        </View>

        <Text style={styles.copy}>Crafted for a beautiful and secure pet adoption journey.</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
  },
  panel: {
    borderRadius: AppTheme.radius.lg,
    borderWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 5,
    ...AppTheme.shadow.soft,
  },
  title: {
    fontWeight: '900',
    color: AppTheme.colors.text,
    fontSize: 15,
  },
  caption: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
  },
  tagRow: {
    marginTop: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D8EDE8',
    backgroundColor: '#F0FBF8',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: AppTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  copy: {
    marginTop: 4,
    color: AppTheme.colors.textSoft,
    fontSize: 11,
    textAlign: 'center',
  },
});

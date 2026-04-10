import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';

export function Footer() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isLandscape } = getDeviceClass(width, height);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[AppTheme.colors.surface + 'F0', AppTheme.colors.surfaceSoft + 'E9']}
        style={[styles.panel, isTablet && styles.panelTablet, isLandscape && !isTablet && styles.panelLandscape]}>
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
    alignItems: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 760,
    borderRadius: AppTheme.radius.lg,
    borderWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 5,
    ...AppTheme.shadow.soft,
  },
  panelTablet: {
    maxWidth: 840,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  panelLandscape: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    borderRadius: AppTheme.radius.full,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: AppTheme.colors.text,
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

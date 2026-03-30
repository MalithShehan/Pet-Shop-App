import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';

export default function AboutScreen() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isCompact } = getDeviceClass(width, height);

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(420)} style={[styles.card, isTablet && styles.cardTablet]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>OUR STORY</Text>
        </View>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>About PetNest</Text>
        <Text style={styles.text}>
          PetNest helps families discover healthy pets with transparent details, responsive support, and a seamless buying flow.
        </Text>
        <Text style={styles.text}>
          We focus on ethical sourcing, wellness-first care, and joyful long-term companionship.
        </Text>
      </Animated.View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    padding: 20,
    gap: 12,
    ...AppTheme.shadow.soft,
  },
  cardTablet: {
    maxWidth: 860,
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: AppTheme.colors.mutedBg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: AppTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 30,
  },
  titleCompact: {
    fontSize: 26,
  },
  text: {
    color: AppTheme.colors.textSoft,
    lineHeight: 23,
    fontSize: 15,
  },
});

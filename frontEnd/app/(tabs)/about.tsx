import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';

export default function AboutScreen() {
  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.card}>
        <Text style={styles.title}>About PetNest</Text>
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
    borderRadius: AppTheme.radius.xl,
    backgroundColor: '#FFFFFFF2',
    borderWidth: 0,
    padding: 18,
    gap: 12,
    ...AppTheme.shadow.soft,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 32,
  },
  text: {
    color: AppTheme.colors.textSoft,
    lineHeight: 23,
    fontSize: 14,
  },
});

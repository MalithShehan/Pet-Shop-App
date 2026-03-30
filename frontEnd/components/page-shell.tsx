import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AppTheme } from '@/constants/app-theme';

export function PageShell({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[AppTheme.colors.heroA, AppTheme.colors.heroB, AppTheme.colors.heroC]} style={styles.bg}>
        <Animated.View entering={FadeIn.duration(500)} style={[styles.blob, styles.blobTop]} />
        <Animated.View entering={FadeInUp.delay(80).duration(550)} style={[styles.blob, styles.blobBottom]} />

        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
          <Navbar />
          <View style={styles.main}>{children}</View>
          <Footer />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  bg: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 22,
  },
  main: {
    gap: 14,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF7A',
  },
  blobTop: {
    width: 220,
    height: 220,
    top: -70,
    right: -50,
  },
  blobBottom: {
    width: 280,
    height: 280,
    bottom: -130,
    left: -90,
  },
});

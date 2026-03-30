import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AppTheme } from '@/constants/app-theme';

export function PageShell({ children }: PropsWithChildren) {
  const { width } = useWindowDimensions();
  const horizontalPadding = width >= 768 ? 24 : 16;
  const contentMaxWidth = width >= 1024 ? 860 : width >= 768 ? 760 : 560;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={[AppTheme.colors.heroA, AppTheme.colors.heroB, AppTheme.colors.heroC, AppTheme.colors.heroD]} style={styles.bg}>
        <Animated.View entering={FadeIn.duration(500)} style={[styles.blob, styles.blobTop]} />
        <Animated.View entering={FadeInUp.delay(80).duration(550)} style={[styles.blob, styles.blobBottom]} />
        <Animated.View entering={FadeInUp.delay(140).duration(600)} style={[styles.ring, styles.ringTop]} />
        <Animated.View entering={FadeIn.delay(180).duration(500)} style={[styles.ring, styles.ringBottom]} />

        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingHorizontal: horizontalPadding }]}>
          <View style={[styles.frame, { maxWidth: contentMaxWidth }]}> 
            <Navbar />
            <View style={styles.main}>{children}</View>
            <Footer />
          </View>
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
    paddingTop: 12,
    paddingBottom: 22,
  },
  frame: {
    width: '100%',
    alignSelf: 'center',
  },
  main: {
    gap: 14,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#FFFFFF7F',
  },
  blobTop: {
    width: 240,
    height: 240,
    top: -80,
    right: -60,
  },
  blobBottom: {
    width: 280,
    height: 280,
    bottom: -130,
    left: -90,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFFFFF7D',
  },
  ringTop: {
    width: 150,
    height: 150,
    right: 30,
    top: 85,
  },
  ringBottom: {
    width: 180,
    height: 180,
    left: 10,
    bottom: 120,
  },
});

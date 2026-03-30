import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { AppTheme } from '@/constants/app-theme';
import { pets } from '@/data/pets';
import { AppRoutes } from '@/routes/app-routes';

export default function HomeScreen() {
  const featured = pets.slice(0, 3);

  return (
    <PageShell>
      <Animated.View entering={FadeInUp.duration(550)} style={styles.heroWrap}>
        <LinearGradient colors={['#FFFFFFE6', '#FFFFFFC9']} style={styles.hero}>
          <Text style={styles.kicker}>PET SHOP MOBILE</Text>
          <Text style={styles.title}>Find your perfect furry companion.</Text>
          <Text style={styles.subtitle}>
            Explore healthy pets with clear details, smooth shopping flow, and friendly care support.
          </Text>

          <View style={styles.ctaRow}>
            <Pressable style={styles.ctaPrimary} onPress={() => router.push(AppRoutes.shop as never)}>
              <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.ctaPrimaryFill}>
                <Text style={styles.ctaPrimaryText}>Browse Pets</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={styles.ctaGhost} onPress={() => router.push(AppRoutes.about as never)}>
              <Text style={styles.ctaGhostText}>About Us</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Pets</Text>
        <Text style={styles.sectionSub}>Most loved picks by our community</Text>
      </Animated.View>

      {featured.map((item, index) => (
        <ProductCard key={item.id} item={item} index={index} />
      ))}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    borderRadius: AppTheme.radius.xl,
    ...AppTheme.shadow.card,
  },
  hero: {
    borderRadius: AppTheme.radius.xl,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 16,
    gap: 8,
  },
  kicker: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 30,
    lineHeight: 35,
  },
  subtitle: {
    color: AppTheme.colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  ctaRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 10,
  },
  ctaPrimary: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  ctaPrimaryFill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaPrimaryText: {
    color: 'white',
    fontWeight: '800',
  },
  ctaGhost: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctaGhostText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  sectionHeader: {
    marginTop: 6,
  },
  sectionTitle: {
    color: AppTheme.colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSub: {
    marginTop: 3,
    color: AppTheme.colors.textSoft,
  },
});

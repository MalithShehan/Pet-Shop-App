import { router } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useEffect, useState } from 'react';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { ProductCard } from '@/components/product-card';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import { ProductItem, products } from '@/data/pets';
import { AppRoutes } from '@/routes/app-routes';
import { fetchProducts } from '@/services/product-api';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const [featured, setFeatured] = useState<ProductItem[]>(products.slice(0, 4));
  const [loading, setLoading] = useState(true);
  const heroPreview = featured.slice(0, 2);
  const { isCompact, isTablet, isLandscape } = getDeviceClass(width, height);
  const compactActionLayout = isCompact || (isLandscape && !isTablet);
  const heroMediaHeight = isTablet ? (isLandscape ? 240 : 220) : isLandscape ? 186 : isCompact ? 150 : 170;
  const secondaryImageSize = isTablet
    ? { width: 146, height: 100 }
    : isLandscape
      ? { width: 106, height: 72 }
      : isCompact
        ? { width: 104, height: 74 }
        : { width: 120, height: 82 };

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const result = await fetchProducts({ limit: 4, sort: 'latest' });
        if (result.length > 0) {
          setFeatured(result.slice(0, 4));
        }
      } catch {
        // Keep local fallback data.
      } finally {
        setLoading(false);
      }
    };

    loadFeatured();
  }, []);

  return (
    <PageShell>
      <Animated.View entering={FadeInUp.duration(550)} style={styles.heroWrap}>
        <LinearGradient colors={['#FFFFFFF2', '#FFFFFFD6']} style={styles.hero}>
          <View style={[styles.mediaWrap, { height: heroMediaHeight }]}>
            <Image source={{ uri: heroPreview[0].image }} style={styles.heroImageMain} contentFit="cover" />
            <Image
              source={{ uri: heroPreview[1].image }}
              style={[styles.heroImageSecondary, secondaryImageSize]}
              contentFit="cover"
            />
            <LinearGradient colors={[AppTheme.colors.imageOverlay, 'transparent']} style={styles.mediaShade} />
          </View>

          <Text style={styles.kicker}>PET SHOP MOBILE</Text>
          <Text style={[styles.title, isCompact && styles.titleCompact, isTablet && styles.titleTablet]}>
            Find your perfect furry companion.
          </Text>
          <Text style={styles.subtitle}>
            Explore pets, foods, and accessories with a smooth and joyful shopping experience.
          </Text>

          <View style={[styles.metricsRow, compactActionLayout && styles.metricsRowCompact]}>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>250+</Text>
              <Text style={styles.metricLabel}>Pet essentials</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.metricValue}>48h</Text>
              <Text style={styles.metricLabel}>Fast delivery</Text>
            </View>
          </View>

          <View style={[styles.ctaRow, compactActionLayout && styles.ctaRowCompact]}>
            <Pressable style={[styles.ctaPrimary, compactActionLayout && styles.ctaBlock]} onPress={() => router.push(AppRoutes.shop as never)}>
              <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.ctaPrimaryFill}>
                <Text style={styles.ctaPrimaryText}>Browse Shop</Text>
              </LinearGradient>
            </Pressable>
            <Pressable style={[styles.ctaGhost, compactActionLayout && styles.ctaBlock]} onPress={() => router.push(AppRoutes.about as never)}>
              <Text style={styles.ctaGhostText}>About Us</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
        <Text style={styles.sectionSub}>Top picks from pets, foods, and accessories</Text>
      </Animated.View>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        featured.map((item, index) => <ProductCard key={item.id} item={item} index={index} />)
      )}
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
    gap: 10,
  },
  mediaWrap: {
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    marginBottom: 2,
    ...AppTheme.shadow.soft,
  },
  heroImageMain: {
    width: '100%',
    height: '100%',
  },
  heroImageSecondary: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFFD1',
  },
  mediaShade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  kicker: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 31,
    lineHeight: 36,
  },
  titleCompact: {
    fontSize: 27,
    lineHeight: 31,
  },
  titleTablet: {
    fontSize: 36,
    lineHeight: 42,
  },
  subtitle: {
    color: AppTheme.colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  metricsRowCompact: {
    flexWrap: 'wrap',
  },
  metricChip: {
    flex: 1,
    backgroundColor: '#FFFFFFC7',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metricValue: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  metricLabel: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
    marginTop: 1,
  },
  ctaRow: {
    marginTop: 2,
    flexDirection: 'row',
    gap: 10,
  },
  ctaRowCompact: {
    flexWrap: 'wrap',
  },
  ctaPrimary: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  ctaPrimaryFill: {
    paddingHorizontal: 17,
    paddingVertical: 11,
  },
  ctaPrimaryText: {
    color: 'white',
    fontWeight: '800',
  },
  ctaGhost: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: '#FFFFFFD4',
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  ctaGhostText: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  ctaBlock: {
    flex: 1,
    minWidth: 140,
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

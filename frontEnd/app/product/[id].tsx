import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import { useCart } from '@/context/cart-context';
import { ProductItem, getCategoryLabel, getSubCategoryLabel } from '@/data/pets';
import { fetchProductById } from '@/services/product-api';

export default function ProductDetailsScreen() {
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isTablet, isLandscape, isCompact, isLargePhone } = getDeviceClass(width, height);
  const imageHeight = isTablet ? (isLandscape ? 360 : 420) : isLandscape ? 236 : isCompact ? 248 : isLargePhone ? 320 : 300;

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const result = await fetchProductById(id);
        setProduct(result);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    const result = await addToCart(product, 1);
    if (!result.ok) {
      Alert.alert('Could not add item', result.message ?? 'Please try again.');
      return;
    }

    Alert.alert('Added to cart', 'Item added successfully.');
  };

  if (loading) {
    return (
      <PageShell>
        <LoadingSkeleton rows={3} />
      </PageShell>
    );
  }

  if (!product) {
    return (
      <PageShell>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Product not found</Text>
        </View>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(400)} style={[styles.card, isTablet && styles.cardTablet]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={[styles.image, { height: imageHeight }]} contentFit="cover" />
          <LinearGradient colors={['transparent', AppTheme.colors.imageOverlayStrong]} style={styles.imageShade} />
          <View style={styles.imagePill}>
            <Ionicons name="pricetag" size={13} color={AppTheme.colors.primaryDark} />
            <Text style={styles.imagePillText}>{getCategoryLabel(product.category)}</Text>
          </View>
        </View>
        <View style={[styles.body, isLandscape && !isTablet && styles.bodyLandscape]}>
          <Text style={styles.category}>
            {getCategoryLabel(product.category)} • {getSubCategoryLabel(product.subCategory)}
          </Text>
          <Text style={[styles.name, isTablet && styles.nameTablet, isLandscape && !isTablet && styles.nameLandscape]}>
            {product.name}
          </Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, isTablet && styles.priceTablet, isLandscape && !isTablet && styles.priceLandscape]}>
              Rs. {product.price.toFixed(2)}
            </Text>
            <Text style={styles.priceCaption}>Available stock: {product.stock ?? 'N/A'}</Text>
          </View>

          <Pressable style={styles.buttonWrap} onPress={handleAddToCart}>
            <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.button}>
              <Ionicons name="cart-outline" size={16} color="white" />
              <Text style={styles.buttonText}>Add To Cart</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </Animated.View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.xl,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    backgroundColor: AppTheme.colors.surfaceElevated,
    overflow: 'hidden',
    ...AppTheme.shadow.card,
  },
  cardTablet: {
    maxWidth: 860,
    alignSelf: 'center',
    width: '100%',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 300,
  },
  imageShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  imagePill: {
    position: 'absolute',
    left: 12,
    top: 12,
    borderRadius: 999,
    backgroundColor: AppTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imagePillText: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
  },
  body: {
    padding: 16,
    gap: 8,
  },
  bodyLandscape: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 7,
  },
  category: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 12,
  },
  name: {
    color: AppTheme.colors.text,
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 34,
  },
  nameTablet: {
    fontSize: 34,
    lineHeight: 40,
  },
  nameLandscape: {
    fontSize: 24,
    lineHeight: 29,
  },
  description: {
    color: AppTheme.colors.textSoft,
    lineHeight: 21,
    fontSize: 14,
  },
  priceRow: {
    marginTop: 2,
  },
  price: {
    color: AppTheme.colors.text,
    fontSize: 31,
    fontWeight: '900',
  },
  priceTablet: {
    fontSize: 36,
  },
  priceLandscape: {
    fontSize: 26,
  },
  priceCaption: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
    marginTop: 2,
  },
  buttonWrap: {
    marginTop: 8,
    borderRadius: AppTheme.radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppTheme.colors.primaryDark + '66',
    ...AppTheme.shadow.glow,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  notFound: {
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    padding: 18,
  },
  notFoundText: {
    textAlign: 'center',
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
});

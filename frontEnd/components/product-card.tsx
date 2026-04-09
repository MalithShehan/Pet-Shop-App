import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import { ProductItem, getCategoryLabel, getSubCategoryLabel } from '@/data/pets';

type Props = {
  item: ProductItem;
  index?: number;
};

const categoryIconMap: Record<string, string> = {
  pet: 'paw',
  food: 'restaurant',
  accessory: 'gift',
  FOOD: 'restaurant',
  TOYS: 'game-controller',
  ACCESSORIES: 'gift',
  HEALTH: 'medkit',
  GROOMING: 'cut',
};

export function ProductCard({ item, index = 0 }: Props) {
  const { width, height } = useWindowDimensions();
  const { isTablet, isLandscape, isCompact } = getDeviceClass(width, height);
  const imageHeight = isTablet ? (isLandscape ? 250 : 232) : isLandscape ? 152 : isCompact ? 164 : 182;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(450)} style={animatedStyle}>
      <Pressable
        onPress={() => router.push(`/product/${item.id}`)}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 120 });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 120 });
        }}
        style={[styles.card, isTablet && styles.cardTablet, isLandscape && !isTablet && styles.cardLandscape]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={[styles.image, { height: imageHeight }]} contentFit="cover" />
          <LinearGradient colors={['transparent', AppTheme.colors.imageOverlayStrong]} style={styles.imageShade} />
          <View style={styles.categoryPill}>
            <Ionicons name={(categoryIconMap[item.category] || 'pricetag') as any} size={11} color={AppTheme.colors.primaryDark} />
            <Text style={styles.categoryPillText}>{getCategoryLabel(item.category)}</Text>
          </View>
          <View style={styles.favoriteIconWrap}>
            <Ionicons name="heart-outline" size={16} color={AppTheme.colors.coral} />
          </View>
        </View>
        <View style={[styles.body, isLandscape && !isTablet && styles.bodyLandscape]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isTablet && styles.titleTablet, isLandscape && !isTablet && styles.titleLandscape]}>
              {item.name}
            </Text>
            <Text style={[styles.price, isTablet && styles.priceTablet, isLandscape && !isTablet && styles.priceLandscape]}>
              Rs. {item.price.toFixed(2)}
            </Text>
          </View>
          <Text numberOfLines={2} style={[styles.description, isLandscape && !isTablet && styles.descriptionLandscape]}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.metaText}>{getSubCategoryLabel(item.subCategory)}</Text>
            <View style={styles.viewTag}>
              <Text style={styles.viewTagText}>View Details</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 0,
    marginBottom: 14,
    ...AppTheme.shadow.card,
  },
  cardTablet: {
    maxWidth: 700,
    alignSelf: 'center',
    width: '100%',
  },
  cardLandscape: {
    marginBottom: 10,
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 182,
  },
  imageShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: AppTheme.colors.primaryLight,
    borderRadius: AppTheme.radius.full,
    paddingHorizontal: 11,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryPillText: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
  },
  favoriteIconWrap: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFEE',
    ...AppTheme.shadow.soft,
  },
  body: {
    padding: 14,
    gap: 7,
  },
  bodyLandscape: {
    paddingVertical: 12,
    paddingHorizontal: 13,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: AppTheme.colors.text,
    flex: 1,
  },
  titleTablet: {
    fontSize: 18,
  },
  titleLandscape: {
    fontSize: 15,
  },
  description: {
    color: AppTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  descriptionLandscape: {
    fontSize: 12,
    lineHeight: 17,
  },
  price: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  priceTablet: {
    fontSize: 20,
  },
  priceLandscape: {
    fontSize: 16,
  },
  cardFooter: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  viewTag: {
    borderRadius: AppTheme.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 0,
    backgroundColor: AppTheme.colors.primaryLight,
  },
  viewTagText: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
  },
});

import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { ProductItem, categoryLabelMap, subCategoryLabelMap } from '@/data/pets';

type Props = {
  item: ProductItem;
  index?: number;
};

const categoryIconMap = {
  pet: 'paw',
  food: 'restaurant',
  accessory: 'gift',
} as const;

export function ProductCard({ item, index = 0 }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const imageHeight = isTablet ? 232 : width < 360 ? 164 : 182;
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
        style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={[styles.image, { height: imageHeight }]} contentFit="cover" />
          <LinearGradient colors={['transparent', AppTheme.colors.imageOverlayStrong]} style={styles.imageShade} />
          <View style={styles.categoryPill}>
            <Ionicons name={categoryIconMap[item.category]} size={11} color={AppTheme.colors.primaryDark} />
            <Text style={styles.categoryPillText}>{categoryLabelMap[item.category]}</Text>
          </View>
          <View style={styles.favoriteIconWrap}>
            <Ionicons name="heart-outline" size={15} color={AppTheme.colors.text} />
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isTablet && styles.titleTablet]}>{item.name}</Text>
            <Text style={[styles.price, isTablet && styles.priceTablet]}>${item.price.toFixed(2)}</Text>
          </View>
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            <Text style={styles.metaText}>{subCategoryLabelMap[item.subCategory]}</Text>
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
    backgroundColor: '#FFFFFFEC',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 14,
    ...AppTheme.shadow.card,
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
    backgroundColor: '#FFFFFFDD',
    borderRadius: 999,
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
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFD4',
  },
  body: {
    padding: 14,
    gap: 7,
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
  description: {
    color: AppTheme.colors.textSoft,
    fontSize: 13,
    lineHeight: 19,
  },
  price: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  priceTablet: {
    fontSize: 20,
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
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: '#FFFFFFB8',
  },
  viewTagText: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
  },
});

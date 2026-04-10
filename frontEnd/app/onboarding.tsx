import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  ViewToken,
} from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AppTheme } from '@/constants/app-theme';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Find Your\nFurry Favorite',
    description: 'Find your perfect pet companion',
    image: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=600',
    icon: 'paw' as const,
  },
  {
    id: '2',
    title: 'Shop Premium\nPet Products',
    description: 'Everything your pet needs — food, toys, and cozy accessories',
    image: 'https://images.unsplash.com/photo-1583337130417-13104dec14a6?w=600',
    icon: 'cart' as const,
  },
  {
    id: '3',
    title: 'Delivered to\nYour Door',
    description: 'Easy checkout, secure payments, and fast delivery',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600',
    icon: 'bicycle' as const,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/sign-in');
    }
  };

  const handleSkip = () => {
    router.replace('/sign-in');
  };

  const renderSlide = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.slide}>
      <Animated.View entering={FadeInUp.delay(200)} style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </Animated.View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Animated.View entering={FadeInUp.delay(300)}>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Decorative paw prints */}
      <View style={styles.pawDecor1}>
        <Ionicons name="paw" size={40} color={AppTheme.colors.peach} style={{ opacity: 0.4 }} />
      </View>
      <View style={styles.pawDecor2}>
        <Ionicons name="paw" size={28} color={AppTheme.colors.primaryLight} style={{ opacity: 0.5 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <View style={styles.nextButtonIcon}>
            <Ionicons name="paw" size={22} color={AppTheme.colors.surface} />
          </View>
          <LinearGradient
            colors={[AppTheme.colors.primary, AppTheme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: AppTheme.colors.textMuted,
    fontWeight: '600',
  },
  pawDecor1: {
    position: 'absolute',
    top: 80,
    right: 50,
    transform: [{ rotate: '-20deg' }],
    zIndex: 1,
  },
  pawDecor2: {
    position: 'absolute',
    top: 160,
    right: 30,
    transform: [{ rotate: '15deg' }],
    zIndex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 28,
    paddingTop: 90,
    gap: 16,
  },
  textContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: AppTheme.colors.text,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    lineHeight: 26,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  imageContainer: {
    width: '100%',
    height: height * 0.38,
    borderRadius: AppTheme.radius.xl,
    overflow: 'hidden',
    ...AppTheme.shadow.card,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  footer: {
    paddingHorizontal: 28,
    paddingBottom: 50,
    gap: 28,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.border,
  },
  dotActive: {
    width: 32,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
    alignSelf: 'stretch',
    ...AppTheme.shadow.glow,
  },
  nextButtonIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: AppTheme.colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginRight: -8,
  },
  nextButtonGradient: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  nextButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
});

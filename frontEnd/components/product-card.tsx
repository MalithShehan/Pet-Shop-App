import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { PetItem } from '@/data/pets';

type Props = {
  item: PetItem;
  index?: number;
};

export function ProductCard({ item, index = 0 }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(450)}>
      <Pressable
        onPress={() => router.push(`/product/${item.id}`)}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: item.image }} style={styles.image} contentFit="cover" />
          <LinearGradient colors={['transparent', '#00000033']} style={styles.imageShade} />
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{item.name}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.card,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    marginBottom: 12,
    ...AppTheme.shadow.card,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 170,
  },
  imageShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  categoryPill: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFFFFFD9',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryPillText: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 11,
  },
  body: {
    padding: 14,
    gap: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  description: {
    color: AppTheme.colors.textSoft,
    fontSize: 13,
  },
  price: {
    marginTop: 4,
    color: AppTheme.colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
});

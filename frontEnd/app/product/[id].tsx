import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { useCart } from '@/context/cart-context';
import { pets } from '@/data/pets';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = pets.find((item) => item.id === id);
  const { addToCart } = useCart();

  if (!pet) {
    return (
      <PageShell>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Pet not found</Text>
        </View>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
        <Image source={{ uri: pet.image }} style={styles.image} contentFit="cover" />
        <View style={styles.body}>
          <Text style={styles.category}>{pet.category}</Text>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.description}>{pet.description}</Text>
          <Text style={styles.price}>${pet.price.toFixed(2)}</Text>

          <Pressable style={styles.button} onPress={() => addToCart(pet, 1)}>
            <Text style={styles.buttonText}>Add To Cart</Text>
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
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.card,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 280,
  },
  body: {
    padding: 15,
    gap: 6,
  },
  category: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '800',
    fontSize: 12,
  },
  name: {
    color: AppTheme.colors.text,
    fontSize: 25,
    fontWeight: '900',
  },
  description: {
    color: AppTheme.colors.textSoft,
    lineHeight: 21,
  },
  price: {
    marginTop: 4,
    color: AppTheme.colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  button: {
    marginTop: 8,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
  },
  notFound: {
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 18,
  },
  notFoundText: {
    textAlign: 'center',
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
});

import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { CartItem } from '@/components/cart-item';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { AppRoutes } from '@/routes/app-routes';

export default function CartScreen() {
  const { isAuthenticated, isReady } = useAuth();
  const { items, subtotal, removeFromCart, updateQuantity, isReady: cartReady } = useCart();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace(AppRoutes.signIn as never);
    }
  }, [isAuthenticated, isReady]);

  if (!isReady || !cartReady) {
    return (
      <PageShell>
        <LoadingSkeleton rows={3} />
      </PageShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageShell>
      <Animated.View entering={FadeIn.duration(320)}>
        <Text style={styles.title}>Your Cart</Text>
        <Text style={styles.subTitle}>Review your selected products before checkout.</Text>
      </Animated.View>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add products from the shop to get started.</Text>
          <Pressable onPress={() => router.push(AppRoutes.shop as never)} style={styles.shopBtn}>
            <Text style={styles.shopBtnText}>Go To Shop</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}

          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
          </View>
        </>
      )}
    </PageShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: AppTheme.colors.text,
  },
  subTitle: {
    color: AppTheme.colors.textSoft,
    marginTop: 2,
  },
  emptyCard: {
    borderRadius: AppTheme.radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.surface,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  emptySub: {
    color: AppTheme.colors.textSoft,
  },
  shopBtn: {
    marginTop: 8,
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  shopBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  summary: {
    borderRadius: AppTheme.radius.lg,
    backgroundColor: '#E7F6F2',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: AppTheme.colors.textSoft,
    fontWeight: '700',
  },
  summaryValue: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 20,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { AppRoutes } from '@/routes/app-routes';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount } = useCart();

  const goToShop = () => router.push(AppRoutes.shop as never);
  const goToCart = () => router.push(AppRoutes.cart as never);

  const handleAuthAction = async () => {
    if (!isAuthenticated) {
      router.push(AppRoutes.signIn as never);
      return;
    }

    await signOut();
    router.replace(AppRoutes.home as never);
  };

  return (
    <Animated.View entering={FadeInDown.duration(420)} style={styles.wrap}>
      <Pressable onPress={() => router.push(AppRoutes.home as never)} style={styles.brandRow}>
        <Ionicons name="paw" size={20} color={AppTheme.colors.primaryDark} />
        <Text style={styles.brandText}>PetNest</Text>
      </Pressable>

      <View style={styles.actions}>
        {pathname !== AppRoutes.shop && (
          <Pressable style={styles.linkBtn} onPress={goToShop}>
            <Text style={styles.linkText}>Shop</Text>
          </Pressable>
        )}

        <Pressable style={styles.cartBtn} onPress={goToCart}>
          <Ionicons name="cart-outline" size={18} color={AppTheme.colors.text} />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </Pressable>

        <Pressable onPress={handleAuthAction}>
          <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.authBtn}>
            <Text style={styles.authText}>{isAuthenticated ? 'Logout' : 'Login'}</Text>
          </LinearGradient>
        </Pressable>
      </View>

      <Text style={styles.userName}>{isAuthenticated ? `Hi, ${user?.name}` : 'Welcome, guest'}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: AppTheme.colors.glass,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    ...AppTheme.shadow.card,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  brandText: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkBtn: {
    backgroundColor: '#E8F6F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  linkText: {
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6F4',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: AppTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#543900',
  },
  authBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  authText: {
    color: 'white',
    fontWeight: '700',
  },
  userName: {
    marginTop: 10,
    color: AppTheme.colors.textSoft,
    fontSize: 12,
  },
});

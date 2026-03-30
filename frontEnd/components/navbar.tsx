import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { AppRoutes } from '@/routes/app-routes';

export function Navbar() {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount } = useCart();
  const isCompact = width < 360;
  const isTablet = width >= 768;

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
    <Animated.View entering={FadeInDown.duration(420)} style={[styles.wrap, isTablet && styles.wrapTablet]}>
      <LinearGradient colors={['#FFFFFFEE', '#FFFFFFD3']} style={styles.inner}>
        <View style={[styles.topRow, isCompact && styles.topRowCompact]}>
          <Pressable onPress={() => router.push(AppRoutes.home as never)} style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="paw" size={16} color={AppTheme.colors.primaryDark} />
            </View>
            <View>
              <Text style={styles.brandText}>PetNest</Text>
              <Text style={styles.brandSub}>Premium Pet Boutique</Text>
            </View>
          </Pressable>

          <Pressable style={styles.cartBtn} onPress={goToCart}>
            <Ionicons name="cart-outline" size={18} color={AppTheme.colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={[styles.actions, isCompact && styles.actionsCompact]}>
          {pathname !== AppRoutes.shop && (
            <Pressable style={[styles.linkBtn, isCompact && styles.linkBtnCompact]} onPress={goToShop}>
              <Ionicons name="sparkles-outline" size={13} color={AppTheme.colors.primaryDark} />
              <Text style={styles.linkText}>Shop</Text>
            </Pressable>
          )}

          <Pressable onPress={handleAuthAction} style={styles.authBtnWrap}>
            <LinearGradient
              colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]}
              style={[styles.authBtn, isTablet && styles.authBtnTablet]}>
              <Text style={styles.authText}>{isAuthenticated ? 'Logout' : 'Login'}</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <Text style={styles.userName}>{isAuthenticated ? `Hi, ${user?.name}` : 'Welcome, guest'}</Text>
      </LinearGradient>

      <View style={styles.glowLine} />
      <View style={styles.glowDot} />
      <View style={styles.glowDotTwo} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFFC9',
    borderWidth: 0,
    borderRadius: AppTheme.radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 14,
    ...AppTheme.shadow.card,
  },
  wrapTablet: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inner: {
    borderRadius: AppTheme.radius.lg,
    borderWidth: 0,
    paddingHorizontal: 12,
    paddingTop: 11,
    paddingBottom: 10,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  topRowCompact: {
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    flex: 1,
  },
  brandIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7F6F2',
    borderWidth: 1,
    borderColor: '#CDEAE4',
  },
  brandText: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 17,
    lineHeight: 20,
  },
  brandSub: {
    color: AppTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionsCompact: {
    justifyContent: 'space-between',
  },
  linkBtn: {
    backgroundColor: '#EAF8F4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D6ECE7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  linkBtnCompact: {
    paddingHorizontal: 10,
  },
  linkText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF8F6',
    borderWidth: 1,
    borderColor: '#D3EBE5',
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
  authBtnWrap: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  authBtn: {
    minWidth: 92,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: 'center',
  },
  authBtnTablet: {
    minWidth: 116,
  },
  authText: {
    color: 'white',
    fontWeight: '800',
  },
  userName: {
    marginTop: -2,
    color: AppTheme.colors.textSoft,
    fontSize: 12,
    fontWeight: '600',
  },
  glowLine: {
    display: 'none',
  },
  glowDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#FFFFFF70',
    top: 10,
    right: 14,
  },
  glowDotTwo: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF6A',
    top: 24,
    right: 29,
  },
});

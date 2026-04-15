import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { NotificationBadge } from './notification-badge';
import { NotificationPanel } from './notification-panel';
import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { AppRoutes } from '@/routes/app-routes';

export function Navbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const { width, height } = useWindowDimensions();
  const pathname = usePathname();
  const { user, isAuthenticated, signOut } = useAuth();
  const { cartCount } = useCart();
  const { isTablet, isIPhone14Pro, isLandscape, isNarrowWidth } = getDeviceClass(width, height);
  const firstName = user?.name?.trim().split(' ')[0] ?? 'Guest';
  const shouldStackHeader = isNarrowWidth && !isLandscape;
  const showSecurePill = !shouldStackHeader;
  const shopLabel = pathname === AppRoutes.shop ? (shouldStackHeader ? 'Shop On' : 'Shop Active') : shouldStackHeader ? 'Shop' : 'Browse Shop';

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
    <>
      <Animated.View
        entering={FadeInDown.duration(320)}
        style={[
          styles.container,
          isTablet && styles.containerTablet,
          isIPhone14Pro && styles.containerIPhone14Pro,
          isLandscape && !isTablet && styles.containerLandscape,
        ]}>
        <View style={[styles.headerRow, shouldStackHeader && styles.headerRowCompact]}>
          <Pressable onPress={() => router.push(AppRoutes.home as never)} style={styles.brandRow}>
            <View style={styles.brandIconWrap}>
              <Ionicons name="paw" size={14} color="#FFFFFF" />
            </View>
            <View style={styles.brandTextBlock}>
              <Text numberOfLines={1} style={[styles.brandTitle, isIPhone14Pro && styles.brandTitleIPhone14Pro]}>
                PetNest
              </Text>
              <Text numberOfLines={1} style={styles.brandSub}>
                {isAuthenticated ? `Welcome back, ${firstName}` : 'Welcome, find your next companion'}
              </Text>
            </View>
          </Pressable>

          <View style={[styles.actionRow, shouldStackHeader && styles.actionRowCompact]}>
          <Pressable style={styles.cartBtn} onPress={goToCart}>

            <Ionicons name="bag-handle-outline" size={17} color={AppTheme.colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            )}
          </Pressable>

          <NotificationBadge onPress={() => setNotifOpen((v) => !v)} />

          <Pressable style={styles.authBtn} onPress={handleAuthAction}>
            <Ionicons name={isAuthenticated ? 'log-out-outline' : 'log-in-outline'} size={14} color={AppTheme.colors.text} />
            <Text style={styles.authText}>{isAuthenticated ? 'Sign out' : 'Sign in'}</Text>
          </Pressable>
        </View>
      </View>

      <View
        style={[
          styles.utilityRow,
          shouldStackHeader && styles.utilityRowCompact,
          isIPhone14Pro && styles.utilityRowIPhone14Pro,
          isLandscape && !isTablet && styles.utilityRowLandscape,
        ]}>
        <Pressable
          style={[styles.shopButton, pathname === AppRoutes.shop && styles.shopButtonActive]}
          onPress={goToShop}
          disabled={pathname === AppRoutes.shop}>
          <Ionicons
            name={pathname === AppRoutes.shop ? 'storefront' : 'storefront-outline'}
            size={13}
            color={pathname === AppRoutes.shop ? '#2D1A00' : AppTheme.colors.text}
          />
          <Text style={[styles.shopButtonText, pathname === AppRoutes.shop && styles.shopButtonTextActive]}>
            {shopLabel}
          </Text>
        </Pressable>

        {showSecurePill && (
          <View style={styles.securePill}>
            <Ionicons name="shield-checkmark-outline" size={13} color="#5B5348" />
            <Text style={styles.secureText}>Secure checkout</Text>
          </View>
        )}
      </View>
      </Animated.View>
      <NotificationPanel visible={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: AppTheme.radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    ...AppTheme.shadow.soft,
  },
  containerTablet: {
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  containerIPhone14Pro: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  containerLandscape: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerRowCompact: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  brandTextBlock: {
    flex: 1,
  },
  brandIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary,
    borderWidth: 0,
  },
  brandTitle: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 18,
  },
  brandTitleIPhone14Pro: {
    fontSize: 17,
    lineHeight: 19,
  },
  brandSub: {
    color: AppTheme.colors.textSoft,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  actionRowCompact: {
    justifyContent: 'flex-end',
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  utilityRowIPhone14Pro: {
    marginTop: 12,
  },
  utilityRowCompact: {
    justifyContent: 'flex-start',
  },
  utilityRowLandscape: {
    flexWrap: 'nowrap',
  },
  shopButton: {
    backgroundColor: AppTheme.colors.primarySoft,
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shopButtonActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primaryDark,
  },
  shopButtonText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
  shopButtonTextActive: {
    color: '#2D1A00',
  },
  securePill: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.sageSoft,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  secureText: {
    color: AppTheme.colors.sageDark,
    fontSize: 12,
    fontWeight: '600',
  },
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.mutedBg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    position: 'relative',
  },
  authBtn: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: AppTheme.radius.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.mutedBg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -6,
    minWidth: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: AppTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D1900',
  },
  authText: {
    color: AppTheme.colors.text,
    fontWeight: '700',
    fontSize: 12,
  },
});

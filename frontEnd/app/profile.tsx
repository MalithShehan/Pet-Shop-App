import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

type ExtendedUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
};

type MenuItem = {
  icon: string;
  label: string;
  subtitle?: string;
  route?: string;
  action?: () => void;
  color?: string;
};

export default function ProfileScreen() {
  const { user: authUser, signOut } = useAuth();
  const user = authUser as ExtendedUser | null;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Shopping',
      items: [
        { icon: 'receipt-outline', label: 'My Orders', subtitle: 'Track and manage orders', route: '/orders' },
        { icon: 'heart-outline', label: 'Wishlist', subtitle: 'Your saved items', route: '/wishlist' },
        { icon: 'cart-outline', label: 'Cart', subtitle: 'View your cart', route: '/(tabs)/cart' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'person-outline', label: 'Edit Profile', subtitle: 'Update your information', route: '/edit-profile' },
        { icon: 'location-outline', label: 'Addresses', subtitle: 'Manage delivery addresses', route: '/edit-profile' },
        { icon: 'lock-closed-outline', label: 'Change Password', subtitle: 'Update your password', route: '/edit-profile' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help Center', subtitle: 'FAQs and support' },
        { icon: 'chatbubble-outline', label: 'Contact Us', route: '/(tabs)/contact' },
        { icon: 'information-circle-outline', label: 'About', route: '/(tabs)/about' },
      ],
    },
    {
      title: '',
      items: [
        {
          icon: 'log-out-outline',
          label: 'Sign Out',
          action: handleSignOut,
          color: AppTheme.colors.coral,
        },
      ],
    },
  ];

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View entering={FadeIn} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>{avatarLetter}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={AppTheme.colors.surface} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>

          {user?.role === 'ADMIN' && (
            <View style={styles.adminBadge}>
              <Ionicons name="shield-checkmark" size={14} color={AppTheme.colors.surface} />
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </Animated.View>

        {/* Menu Sections */}
        {menuSections.map((section, sIndex) => (
          <Animated.View
            key={sIndex}
            entering={FadeInDown.delay(100 + sIndex * 80)}
            style={styles.menuSection}
          >
            {section.title ? (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            ) : null}
            <View style={styles.menuCard}>
              {section.items.map((item, iIndex) => (
                <TouchableOpacity
                  key={iIndex}
                  style={[styles.menuItem, iIndex < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.route) {
                      router.push(item.route as any);
                    }
                  }}
                  activeOpacity={0.6}
                >
                  <View style={[styles.menuIconCircle, item.color ? { backgroundColor: item.color + '15' } : {}]}>
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.color || AppTheme.colors.primary}
                    />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={[styles.menuLabel, item.color ? { color: item.color } : {}]}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={AppTheme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        <Text style={styles.version}>Pet Shop v2.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: AppTheme.colors.primary,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: AppTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: AppTheme.colors.surface,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppTheme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: AppTheme.colors.background,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: AppTheme.colors.sageDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: AppTheme.colors.surface,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AppTheme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    ...AppTheme.shadow.soft,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.colors.text,
  },
  menuSubtitle: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 16,
  },
});

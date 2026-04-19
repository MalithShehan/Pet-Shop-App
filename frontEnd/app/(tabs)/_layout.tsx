import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, useWindowDimensions, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppTheme } from '@/constants/app-theme';
import { getTabDockMetrics } from '@/constants/responsive';

function TabIcon({
  name,
  label,
  focused,
  iconSize,
  showLabel,
}: {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  focused: boolean;
  iconSize: number;
  showLabel: boolean;
}) {
  const slotSize = 44;
  const resolvedIconSize = Math.max(iconSize, 20);
  const anim = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(anim, {
      toValue: focused ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [focused, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const pillWidth = anim.interpolate({ inputRange: [0, 1], outputRange: [14, 18] });

  return (
    <View style={styles.tabItemContent}>
      <Animated.View
        style={[
          styles.iconShell,
          focused ? styles.iconShellActive : styles.iconShellInactive,
          {
            width: slotSize,
            height: slotSize,
            borderRadius: slotSize / 2,
            transform: [{ scale }],
          },
        ]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: anim }]}>
          <LinearGradient
            colors={[AppTheme.colors.primary, AppTheme.colors.primaryDark]}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.95 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
        <IconSymbol size={resolvedIconSize} name={name} color={focused ? '#FFFFFF' : AppTheme.colors.textMuted} />
      </Animated.View>
      {showLabel && (
        <Animated.Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={[styles.tabLabelBase, focused ? styles.tabLabelActive : styles.tabLabel, { opacity: anim }]}> 
          {label}
        </Animated.Text>
      )}
      {showLabel && (
        <Animated.View
          style={{ width: pillWidth, height: 3, borderRadius: 99, marginTop: 2, backgroundColor: AppTheme.colors.primary, opacity: anim }}
        />
      )}
    </View>
  );
}

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const {
    showLabel,
    iconSize,
    dockHorizontalInset,
    dockHeight,
    dockPaddingTop,
    dockPaddingBottom,
    dockPaddingHorizontal,
    tabItemMarginHorizontal,
  } = getTabDockMetrics(width, height, insets.bottom);
  const showResponsiveLabel = showLabel && width >= 390;
  const bottomSafePadding = Math.max(dockPaddingBottom, insets.bottom + 2);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppTheme.colors.primary,
        tabBarInactiveTintColor: AppTheme.colors.textMuted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarBackground: () => null,
        tabBarStyle: {
          position: 'absolute',
          left: dockHorizontalInset,
          right: dockHorizontalInset,
          bottom: 0,
          height: dockHeight,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          borderRadius: 0,
          paddingTop: dockPaddingTop,
          paddingBottom: bottomSafePadding,
          paddingHorizontal: dockPaddingHorizontal,
          elevation: 0,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: Math.max(tabItemMarginHorizontal - 1, 0),
          paddingVertical: 1,
        },
        tabBarActiveBackgroundColor: 'transparent',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="house.fill"
              label="Home"
              focused={focused}
              iconSize={iconSize}
              showLabel={showResponsiveLabel}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="pawprint.fill"
              label="Shop"
              focused={focused}
              iconSize={iconSize}
              showLabel={showResponsiveLabel}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="cart.fill"
              label="Cart"
              focused={focused}
              iconSize={iconSize}
              showLabel={showResponsiveLabel}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="info.circle.fill"
              label="About"
              focused={focused}
              iconSize={iconSize}
              showLabel={showResponsiveLabel}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="message.fill"
              label="Contact"
              focused={focused}
              iconSize={iconSize}
              showLabel={showResponsiveLabel}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconShell: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0,
  },
  iconShellActive: {
    ...AppTheme.shadow.glow,
  },
  iconShellInactive: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: AppTheme.colors.textMuted,
    letterSpacing: 0.12,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: AppTheme.colors.primaryDark,
    letterSpacing: 0.16,
  },
  tabLabelBase: {
    maxWidth: 56,
    textAlign: 'center',
  },
  activePill: {
    width: 18,
    height: 3,
    borderRadius: 99,
    marginTop: 2,
    backgroundColor: AppTheme.colors.primary,
  },
  idlePill: {
    width: 14,
    height: 3,
    borderRadius: 99,
    marginTop: 2,
    backgroundColor: 'transparent',
  },
});

import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
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
  const baseSlotSize = showLabel ? 36 : 38;
  const slotSize = focused ? baseSlotSize + 2 : baseSlotSize;
  const resolvedIconSize = showLabel ? Math.max(iconSize - 1, 18) : Math.max(iconSize, 20);

  return (
    <View style={styles.tabItemContent}>
      <View
        style={[
          styles.iconShell,
          focused ? styles.iconShellActive : styles.iconShellInactive,
          {
            width: slotSize,
            height: slotSize,
            borderRadius: Math.round(slotSize / 2),
          },
        ]}>
        {focused ? (
          <LinearGradient
            colors={['#FAE3B8', '#F2B452']}
            start={{ x: 0.1, y: 0.1 }}
            end={{ x: 0.9, y: 0.95 }}
            style={StyleSheet.absoluteFillObject}
          />
        ) : null}
        <IconSymbol size={resolvedIconSize} name={name} color={focused ? '#201A13' : '#72695D'} />
      </View>
      {showLabel && (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.85}
          style={[styles.tabLabelBase, focused ? styles.tabLabelActive : styles.tabLabel]}>
          {label}
        </Text>
      )}
      {showLabel && <View style={focused ? styles.activePill : styles.idlePill} />}
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
        tabBarActiveTintColor: '#221A11',
        tabBarInactiveTintColor: '#4A443D',
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
          borderRadius: 32,
          paddingTop: dockPaddingTop,
          paddingBottom: bottomSafePadding,
          paddingHorizontal: dockPaddingHorizontal,
          elevation: 6,
          shadowColor: '#21170B',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
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
    gap: 3,
  },
  iconShell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconShellActive: {
    borderColor: '#E4BC79',
    shadowColor: '#B0761F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 7,
    elevation: 3,
  },
  iconShellInactive: {
    backgroundColor: '#FFFFFF88',
    borderColor: '#EEE2D3DE',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6D655A',
    letterSpacing: 0.12,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2A231B',
    letterSpacing: 0.16,
  },
  tabLabelBase: {
    maxWidth: 56,
    textAlign: 'center',
  },
  activePill: {
    width: 16,
    height: 3,
    borderRadius: 99,
    marginTop: 1,
    backgroundColor: '#D59329',
  },
  idlePill: {
    width: 14,
    height: 3,
    borderRadius: 99,
    marginTop: 1,
    backgroundColor: 'transparent',
  },
});

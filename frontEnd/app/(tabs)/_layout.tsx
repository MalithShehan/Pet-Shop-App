import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDeviceClass } from '@/constants/responsive';

function TabIcon({
  name,
  label,
  focused,
  iconSize,
  slotSize,
  showLabel,
}: {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  focused: boolean;
  iconSize: number;
  slotSize: number;
  showLabel: boolean;
}) {
  const currentSlotSize = focused ? slotSize + 2 : slotSize;

  return (
    <View style={styles.tabItemContent}>
      <View
        style={[
          styles.iconSlot,
          {
            width: currentSlotSize,
            height: currentSlotSize,
            borderRadius: Math.round(currentSlotSize / 3),
          },
          focused ? styles.iconSlotActive : styles.iconSlotInactive,
        ]}>
        <IconSymbol size={iconSize} name={name} color={focused ? '#1F1B16' : '#766F63'} />
      </View>
      {showLabel && <Text style={focused ? styles.tabLabelActive : styles.tabLabel}>{label}</Text>}
      {showLabel && <View style={focused ? styles.activeIndicator : styles.indicatorPlaceholder} />}
    </View>
  );
}

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isIPhone14Pro, isLargePhone, isLandscape, isNarrowWidth } = getDeviceClass(width, height);
  const showLabel = isTablet || !isLandscape;
  const iconSize = isTablet ? 24 : isLandscape ? 21 : isIPhone14Pro ? 24 : isLargePhone ? 23 : 22;
  const slotSize = isTablet ? 42 : isLandscape ? 34 : isIPhone14Pro ? 40 : isLargePhone ? 38 : 36;

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
          left: 0,
          right: 0,
          bottom: 0,
          height: isTablet ? 82 : showLabel ? (isIPhone14Pro ? 88 : 78) : 66,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          paddingTop: showLabel ? 6 : 4,
          paddingBottom: isTablet ? 12 : showLabel ? (isIPhone14Pro ? 14 : 10) : 8,
          paddingHorizontal: isTablet ? 16 : isNarrowWidth ? 6 : 10,
          elevation: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        tabBarItemStyle: {
          borderRadius: 12,
          marginHorizontal: isTablet ? 4 : showLabel ? 2 : 1,
          paddingVertical: 0,
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
              slotSize={slotSize}
              showLabel={showLabel}
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
              slotSize={slotSize}
              showLabel={showLabel}
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
              slotSize={slotSize}
              showLabel={showLabel}
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
              slotSize={slotSize}
              showLabel={showLabel}
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
              slotSize={slotSize}
              showLabel={showLabel}
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
  iconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconSlotActive: {
    backgroundColor: '#F5ECDDCC',
    borderColor: '#EAD8B9E8',
  },
  iconSlotInactive: {
    backgroundColor: '#FFFFFF26',
    borderColor: '#FFFFFF40',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6F695F',
    letterSpacing: 0.12,
  },
  tabLabelActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2B251D',
    letterSpacing: 0.16,
  },
  activeIndicator: {
    width: 16,
    height: 3,
    borderRadius: 99,
    backgroundColor: '#D49A33',
    marginTop: 1,
  },
  indicatorPlaceholder: {
    width: 14,
    height: 3,
    borderRadius: 99,
    backgroundColor: 'transparent',
    marginTop: 1,
  },
});

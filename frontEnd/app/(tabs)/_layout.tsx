import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getDeviceClass } from '@/constants/responsive';

function TabIcon({
  name,
  label,
  focused,
  iconSize,
  slotSize,
  activeSlotSize,
  showLabel,
}: {
  name: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
  focused: boolean;
  iconSize: number;
  slotSize: number;
  activeSlotSize: number;
  showLabel: boolean;
}) {
  if (focused) {
    return (
      <View style={styles.tabItemContent}>
        <LinearGradient
          colors={['#F8D99D', '#F4B549']}
          start={{ x: 0.2, y: 0.1 }}
          end={{ x: 0.8, y: 1 }}
          style={[
            styles.activeCircle,
            {
              width: activeSlotSize,
              height: activeSlotSize,
              borderRadius: Math.round(activeSlotSize / 2),
            },
          ]}>
          <IconSymbol size={iconSize} name={name} color="#201A13" />
        </LinearGradient>
        {showLabel && <Text style={styles.tabLabelActive}>{label}</Text>}
        {showLabel && <View style={styles.activePill} />}
      </View>
    );
  }

  return (
    <View style={styles.tabItemContent}>
      <View
        style={[
          styles.inactiveCircle,
          {
            width: slotSize,
            height: slotSize,
            borderRadius: Math.round(slotSize / 2),
          },
        ]}>
        <IconSymbol size={Math.max(iconSize - 1, 18)} name={name} color="#766F63" />
      </View>
      {showLabel && <Text style={styles.tabLabel}>{label}</Text>}
      {showLabel && <View style={styles.idlePill} />}
    </View>
  );
}

function TabDockBackground() {
  return (
    <View pointerEvents="none" style={styles.tabDockWrap}>
      <LinearGradient
        colors={['#FFFFFFD9', '#FFFFFFB8', '#FFF7EB9C']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.tabDockBackground}
      />
      <View style={styles.tabDockHighlight} />
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function TabLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { isTablet, isIPhone14Pro, isLargePhone, isLandscape, isNarrowWidth, shortSide } = getDeviceClass(width, height);

  const showLabel = isTablet || (!isLandscape && shortSide >= 370);
  const iconSize = isTablet ? (isLandscape ? 23 : 24) : shortSide >= 390 ? 22 : shortSide >= 360 ? 21 : 20;
  const slotSize = isTablet
    ? (isLandscape ? 40 : 42)
    : showLabel
      ? (isIPhone14Pro ? 38 : isLargePhone ? 37 : 35)
      : shortSide >= 390
        ? 36
        : 34;
  const activeSlotSize = slotSize + (showLabel ? 4 : 6);
  const dockHorizontalInset = isTablet
    ? clamp(Math.round(width * (isLandscape ? 0.16 : 0.12)), 84, 210)
    : isLandscape
      ? clamp(Math.round(width * 0.085), 28, 92)
      : isNarrowWidth
        ? 10
        : clamp(Math.round(width * 0.045), 14, 24);
  const dockHeight = isTablet ? (showLabel ? 92 : 78) : showLabel ? (isIPhone14Pro ? 90 : 84) : 70;
  const dockBottom = Math.max(insets.bottom + (isTablet ? 8 : 4), isIPhone14Pro ? 12 : 8);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#221A11',
        tabBarInactiveTintColor: '#4A443D',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarBackground: () => <TabDockBackground />,
        tabBarStyle: {
          position: 'absolute',
          left: dockHorizontalInset,
          right: dockHorizontalInset,
          bottom: dockBottom,
          height: dockHeight,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          borderRadius: 32,
          paddingTop: showLabel ? (isTablet ? 10 : 9) : 6,
          paddingBottom: showLabel ? (isTablet ? 10 : 9) : 6,
          paddingHorizontal: isTablet ? 14 : isNarrowWidth ? 6 : 8,
          elevation: 7,
          shadowColor: '#21170B',
          shadowOffset: { width: 0, height: 9 },
          shadowOpacity: 0.14,
          shadowRadius: 18,
        },
        tabBarItemStyle: {
          borderRadius: 14,
          marginHorizontal: isTablet ? 5 : showLabel ? 2 : 1,
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
              activeSlotSize={activeSlotSize}
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
              activeSlotSize={activeSlotSize}
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
              activeSlotSize={activeSlotSize}
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
              activeSlotSize={activeSlotSize}
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
              activeSlotSize={activeSlotSize}
              showLabel={showLabel}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabDockWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  tabDockBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#EEE3D4E6',
  },
  tabDockHighlight: {
    position: 'absolute',
    top: 10,
    left: 18,
    right: 18,
    height: 1,
    borderRadius: 99,
    backgroundColor: '#FFFFFFC9',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  activeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAD8B9E8',
    shadowColor: '#B0761F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#FFFFFF78',
    borderColor: '#EFE4D5DE',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6F675C',
    letterSpacing: 0.12,
  },
  tabLabelActive: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2A231B',
    letterSpacing: 0.16,
  },
  activePill: {
    width: 14,
    height: 3,
    borderRadius: 99,
    marginTop: 1,
    backgroundColor: '#D89A32',
  },
  idlePill: {
    width: 14,
    height: 3,
    borderRadius: 99,
    marginTop: 1,
    backgroundColor: 'transparent',
  },
});

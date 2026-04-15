import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { useNotifications } from '../context/notification-context';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';

export function NotificationBadge({ onPress }: { onPress: () => void }) {
  const { unreadCount } = useNotifications();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (unreadCount > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, { toValue: 1.2, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [unreadCount]);

  return (
    <Pressable onPress={onPress} style={styles.iconWrap} accessibilityLabel="Show notifications">
      <Ionicons name="notifications-outline" size={28} color="#ff9800" />
      {unreadCount > 0 && (
        <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}> 
          <Text style={styles.badgeText}>{unreadCount}</Text>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrap: { position: 'relative', padding: 4 },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 2,
    elevation: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

import { View, Text, Pressable, Animated, StyleSheet, FlatList } from 'react-native';
import { useNotifications } from '../context/notification-context';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';

export function NotificationPanel({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { notifications, markAsRead } = useNotifications();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close notifications">
      <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}
        onStartShouldSetResponder={() => true}>
        <View style={styles.header}>
          <Text style={styles.title}>Notifications</Text>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color="#888" />
          </Pressable>
        </View>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.item, !item.isRead && styles.unread]}
              onPress={() => markAsRead(item._id, !item.isRead)}
            >
              <Ionicons
                name={item.isRead ? 'notifications-outline' : 'notifications'}
                size={20}
                color={item.isRead ? '#888' : '#ff9800'}
                style={{ marginRight: 8 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              {!item.isRead && <View style={styles.dot} />}
            </Pressable>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  panel: {
    marginTop: 60,
    width: '92%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unread: {
    backgroundColor: '#fffbe7',
  },
  message: {
    fontSize: 15,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ff9800',
    marginLeft: 8,
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 24,
  },
});

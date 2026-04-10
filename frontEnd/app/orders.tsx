import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { fetchMyOrders, Order } from '@/services/order-api';

const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
  PENDING: { color: AppTheme.colors.primary, icon: 'time-outline', label: 'Pending' },
  CONFIRMED: { color: AppTheme.colors.info, icon: 'checkmark-circle-outline', label: 'Confirmed' },
  PROCESSING: { color: AppTheme.colors.sageDark, icon: 'cube-outline', label: 'Processing' },
  SHIPPED: { color: AppTheme.colors.info, icon: 'airplane-outline', label: 'Shipped' },
  DELIVERED: { color: AppTheme.colors.success, icon: 'checkmark-done-circle-outline', label: 'Delivered' },
  CANCELLED: { color: AppTheme.colors.coral, icon: 'close-circle-outline', label: 'Cancelled' },
};

export default function OrdersScreen() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchMyOrders(token);
      setOrders(data.orders);
    } catch {
      // handle error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const renderOrder = ({ item, index }: { item: Order; index: number }) => {
    const config = statusConfig[item.status] || statusConfig.PENDING;
    const date = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <Animated.View entering={FadeInDown.delay(index * 80)}>
        <TouchableOpacity
          style={styles.orderCard}
          activeOpacity={0.7}
          onPress={() => router.push(`/order/${item.id}`)}
        >
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
              <Text style={styles.orderDate}>{date}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: config.color + '18' }]}>
              <Ionicons name={config.icon as any} size={16} color={config.color} />
              <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
            </View>
          </View>

          <View style={styles.orderBody}>
            <View style={styles.orderInfo}>
              <Ionicons name="cube-outline" size={16} color={AppTheme.colors.textMuted} />
              <Text style={styles.orderInfoText}>{item.items.length} items</Text>
            </View>
            <View style={styles.orderInfo}>
              <Ionicons name="location-outline" size={16} color={AppTheme.colors.textMuted} />
              <Text style={styles.orderInfoText} numberOfLines={1}>
                {item.shippingCity}, {item.shippingState}
              </Text>
            </View>
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.orderTotal}>Rs. {Number(item.total).toLocaleString()}</Text>
            <View style={styles.arrowCircle}>
              <Ionicons name="chevron-forward" size={18} color={AppTheme.colors.primary} />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 40 }} />
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={AppTheme.colors.border} />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/shop')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppTheme.shadow.soft,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 18,
    marginBottom: 14,
    ...AppTheme.shadow.soft,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  orderDate: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  orderBody: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderInfoText: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    paddingTop: 14,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.primary,
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AppTheme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  emptySubtitle: {
    fontSize: 15,
    color: AppTheme.colors.textMuted,
    textAlign: 'center',
  },
  shopButton: {
    marginTop: 16,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  shopButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { fetchOrderById, cancelOrder, Order } from '@/services/order-api';

const trackingSteps = [
  { status: 'PENDING', label: 'Order Placed', icon: 'receipt-outline' },
  { status: 'CONFIRMED', label: 'Confirmed', icon: 'checkmark-circle-outline' },
  { status: 'PROCESSING', label: 'Processing', icon: 'cube-outline' },
  { status: 'SHIPPED', label: 'Shipped', icon: 'airplane-outline' },
  { status: 'DELIVERED', label: 'Delivered', icon: 'checkmark-done-circle-outline' },
];

const statusOrder = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    fetchOrderById(token, id)
      .then((data) => setOrder(data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleCancel = () => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          if (!token || !id) return;
          try {
            const data = await cancelOrder(token, id);
            setOrder(data.order);
            Alert.alert('Cancelled', 'Your order has been cancelled.');
          } catch (err: any) {
            Alert.alert('Error', err.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Order not found</Text>
      </View>
    );
  }

  const currentStepIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'CANCELLED';
  const canCancel = ['PENDING', 'CONFIRMED'].includes(order.status);
  const date = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order ID & Date */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.orderId}>Order #{order.id.slice(0, 8)}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </Animated.View>

        {/* Order Tracking */}
        {!isCancelled && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={styles.sectionTitle}>Order Tracking</Text>
            <View style={styles.tracking}>
              {trackingSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <View key={step.status} style={styles.trackingStep}>
                    <View style={styles.trackingDotContainer}>
                      <View
                        style={[
                          styles.trackingDot,
                          isCompleted && styles.trackingDotCompleted,
                          isCurrent && styles.trackingDotCurrent,
                        ]}
                      >
                        <Ionicons
                          name={step.icon as any}
                          size={18}
                          color={isCompleted ? '#fff' : AppTheme.colors.textMuted}
                        />
                      </View>
                      {index < trackingSteps.length - 1 && (
                        <View
                          style={[
                            styles.trackingLine,
                            isCompleted && styles.trackingLineCompleted,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.trackingInfo}>
                      <Text
                        style={[
                          styles.trackingLabel,
                          isCompleted && styles.trackingLabelCompleted,
                        ]}
                      >
                        {step.label}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {isCancelled && (
          <Animated.View entering={FadeInDown.delay(200)} style={[styles.section, styles.cancelledBanner]}>
            <Ionicons name="close-circle" size={28} color="#EF4444" />
            <Text style={styles.cancelledText}>This order has been cancelled</Text>
          </Animated.View>
        )}

        {/* Items */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                Rs. {(Number(item.price) * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Shipping */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress}{'\n'}
            {order.shippingCity}, {order.shippingState} {order.shippingPostal}
          </Text>
          {order.shippingPhone && (
            <Text style={styles.phoneText}>Phone: {order.shippingPhone}</Text>
          )}
        </Animated.View>

        {/* Payment */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Method</Text>
            <Text style={styles.summaryValue}>{order.payment?.method || 'N/A'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <Text style={styles.summaryValue}>{order.payment?.status || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {Number(order.total).toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* Cancel Button */}
        {canCancel && (
          <Animated.View entering={FadeInDown.delay(600)}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  errorText: {
    fontSize: 16,
    color: AppTheme.colors.textMuted,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 20,
    marginBottom: 14,
    ...AppTheme.shadow.soft,
  },
  orderId: {
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.colors.text,
    marginBottom: 16,
  },
  tracking: {
    gap: 0,
  },
  trackingStep: {
    flexDirection: 'row',
    gap: 14,
  },
  trackingDotContainer: {
    alignItems: 'center',
  },
  trackingDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.mutedBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
  },
  trackingDotCompleted: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary,
  },
  trackingDotCurrent: {
    borderColor: AppTheme.colors.primaryDark,
    ...AppTheme.shadow.soft,
  },
  trackingLine: {
    width: 2,
    height: 24,
    backgroundColor: AppTheme.colors.border,
  },
  trackingLineCompleted: {
    backgroundColor: AppTheme.colors.primary,
  },
  trackingInfo: {
    justifyContent: 'center',
    paddingBottom: 24,
  },
  trackingLabel: {
    fontSize: 15,
    color: AppTheme.colors.textMuted,
    fontWeight: '500',
  },
  trackingLabelCompleted: {
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  cancelledText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: AppTheme.colors.text,
  },
  itemQty: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  addressText: {
    fontSize: 15,
    lineHeight: 22,
    color: AppTheme.colors.textSoft,
  },
  phoneText: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: AppTheme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.primary,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});

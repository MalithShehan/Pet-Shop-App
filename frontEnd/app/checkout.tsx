import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { createOrder } from '@/services/order-api';

type PaymentMethod = 'COD' | 'CARD' | 'EASYPAISA' | 'JAZZCASH';

const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
  { id: 'COD', label: 'Cash on Delivery', icon: 'cash-outline' },
  { id: 'CARD', label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'EASYPAISA', label: 'Easypaisa', icon: 'phone-portrait-outline' },
  { id: 'JAZZCASH', label: 'JazzCash', icon: 'phone-portrait-outline' },
];

export default function CheckoutScreen() {
  const { token } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('COD');

  const [form, setForm] = useState({
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingPostal: '',
    shippingPhone: '',
    notes: '',
  });

  const deliveryFee = subtotal > 5000 ? 0 : 250;
  const total = subtotal + deliveryFee;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!form.shippingAddress || !form.shippingCity || !form.shippingState || !form.shippingPostal) {
      Alert.alert('Missing Info', 'Please fill in all required shipping fields.');
      return;
    }

    if (!token) {
      Alert.alert('Sign In Required', 'Please sign in to place an order.', [
        { text: 'Sign In', onPress: () => router.replace('/sign-in') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    setLoading(true);
    try {
      const result = await createOrder(token, {
        ...form,
        paymentMethod: selectedPayment,
      });

      clearCart();

      Alert.alert(
        'Order Placed! 🎉',
        `Order #${result.order.id.slice(0, 8)} has been placed successfully.`,
        [
          {
            text: 'View Orders',
            onPress: () => router.replace('/orders'),
          },
          {
            text: 'Continue Shopping',
            onPress: () => router.replace('/(tabs)/shop'),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert('Order Failed', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={AppTheme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Shipping Address */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={22} color={AppTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Shipping Address</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Street Address *"
            placeholderTextColor={AppTheme.colors.textMuted}
            value={form.shippingAddress}
            onChangeText={(v) => updateField('shippingAddress', v)}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City *"
              placeholderTextColor={AppTheme.colors.textMuted}
              value={form.shippingCity}
              onChangeText={(v) => updateField('shippingCity', v)}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State *"
              placeholderTextColor={AppTheme.colors.textMuted}
              value={form.shippingState}
              onChangeText={(v) => updateField('shippingState', v)}
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Postal Code *"
              placeholderTextColor={AppTheme.colors.textMuted}
              value={form.shippingPostal}
              onChangeText={(v) => updateField('shippingPostal', v)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Phone"
              placeholderTextColor={AppTheme.colors.textMuted}
              value={form.shippingPhone}
              onChangeText={(v) => updateField('shippingPhone', v)}
              keyboardType="phone-pad"
            />
          </View>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Delivery notes (optional)"
            placeholderTextColor={AppTheme.colors.textMuted}
            value={form.notes}
            onChangeText={(v) => updateField('notes', v)}
            multiline
          />
        </Animated.View>

        {/* Payment Method */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet-outline" size={22} color={AppTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
              activeOpacity={0.7}
            >
              <View style={styles.paymentLeft}>
                <Ionicons
                  name={method.icon as any}
                  size={22}
                  color={selectedPayment === method.id ? AppTheme.colors.primary : AppTheme.colors.textMuted}
                />
                <Text
                  style={[
                    styles.paymentLabel,
                    selectedPayment === method.id && styles.paymentLabelSelected,
                  ]}
                >
                  {method.label}
                </Text>
              </View>
              <View
                style={[styles.radio, selectedPayment === method.id && styles.radioSelected]}
              >
                {selectedPayment === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Order Summary */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={22} color={AppTheme.colors.primary} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({items.length})</Text>
            <Text style={styles.summaryValue}>Rs. {subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery</Text>
            <Text style={[styles.summaryValue, deliveryFee === 0 && styles.freeDelivery]}>
              {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs. {total.toLocaleString()}</Text>
          </View>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomTotal}>Rs. {total.toLocaleString()}</Text>
          <Text style={styles.bottomItems}>{items.length} items</Text>
        </View>
        <TouchableOpacity
          style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={AppTheme.colors.surface} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={AppTheme.colors.surface} />
              <Text style={styles.placeOrderText}>Place Order</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 20,
    marginBottom: 16,
    ...AppTheme.shadow.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  input: {
    backgroundColor: AppTheme.colors.mutedBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: AppTheme.colors.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: AppTheme.colors.border,
  },
  paymentOptionSelected: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.accentSoft,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentLabel: {
    fontSize: 15,
    color: AppTheme.colors.textMuted,
    fontWeight: '500',
  },
  paymentLabelSelected: {
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: AppTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: AppTheme.colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: AppTheme.colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: AppTheme.colors.textMuted,
  },
  summaryValue: {
    fontSize: 15,
    color: AppTheme.colors.text,
    fontWeight: '600',
  },
  freeDelivery: {
    color: AppTheme.colors.success,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: AppTheme.colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: AppTheme.colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: AppTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: AppTheme.colors.border,
    ...AppTheme.shadow.card,
  },
  bottomInfo: {
    gap: 2,
  },
  bottomTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: AppTheme.colors.text,
  },
  bottomItems: {
    fontSize: 13,
    color: AppTheme.colors.textMuted,
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: AppTheme.colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: AppTheme.radius.md,
    ...AppTheme.shadow.glow,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.colors.surface,
  },
});

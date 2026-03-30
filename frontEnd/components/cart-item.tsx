import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import { CartItem as ItemType } from '@/context/cart-context';

type Props = {
  item: ItemType;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
};

export function CartItem({ item, onDecrease, onIncrease, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.meta}>{item.category}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)} each</Text>
      </View>

      <View style={styles.rightCol}>
        <View style={styles.qtyRow}>
          <Pressable style={styles.iconBtn} onPress={onDecrease}>
            <Ionicons name="remove" size={16} color={AppTheme.colors.text} />
          </Pressable>
          <Text style={styles.qty}>{item.quantity}</Text>
          <Pressable style={styles.iconBtn} onPress={onIncrease}>
            <Ionicons name="add" size={16} color={AppTheme.colors.text} />
          </Pressable>
        </View>

        <Pressable onPress={onRemove}>
          <Text style={styles.remove}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  meta: {
    color: AppTheme.colors.textSoft,
    fontSize: 12,
  },
  price: {
    color: AppTheme.colors.primaryDark,
    fontWeight: '700',
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    width: 20,
    textAlign: 'center',
    color: AppTheme.colors.text,
    fontWeight: '700',
  },
  remove: {
    color: AppTheme.colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
});

import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredJson, setStoredJson } from '@/hooks/use-app-storage';
import { ProductItem } from '@/data/pets';

const CART_KEY = 'petshop_cart_v1';

export type CartItem = ProductItem & { quantity: number };

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isReady: boolean;
  addToCart: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const restored = await getStoredJson<CartItem[]>(CART_KEY, []);
      setItems(restored);
      setIsReady(true);
    };

    bootstrap();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    setStoredJson(CART_KEY, items);
  }, [isReady, items]);

  const addToCart = useCallback((product: ProductItem, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }

      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => {
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      items,
      cartCount,
      subtotal,
      isReady,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    };
  }, [addToCart, clearCart, isReady, items, removeFromCart, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

import React, { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ProductCategory, ProductItem, ProductSubCategory } from '@/data/pets';
import { useAuth } from '@/context/auth-context';
import { addCartItem, fetchCart, removeCartItem, updateCartItem } from '@/services/cart-api';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isReady: boolean;
  addToCart: (product: ProductItem, quantity?: number) => Promise<{ ok: boolean; message?: string }>;
  removeFromCart: (id: string) => Promise<{ ok: boolean; message?: string }>;
  updateQuantity: (id: string, quantity: number) => Promise<{ ok: boolean; message?: string }>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const { token, isAuthenticated, isReady: authReady } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const mapCartItems = useCallback((apiItems: Array<{ productId: string; name: string; price: number; category: ProductCategory; subCategory: ProductSubCategory; quantity: number; }>) => {
    return apiItems.map((item) => ({
      id: String(item.productId),
      name: item.name,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory,
      quantity: item.quantity,
    }));
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    const bootstrap = async () => {
      if (!isAuthenticated || !token) {
        setItems([]);
        setIsReady(true);
        return;
      }

      try {
        const cart = await fetchCart(token);
        setItems(mapCartItems(cart.items));
      } catch {
        setItems([]);
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, [authReady, isAuthenticated, mapCartItems, token]);

  const addToCart = useCallback(async (product: ProductItem, quantity = 1) => {
    if (!token) {
      return { ok: false, message: 'Please sign in to add items to cart.' };
    }

    try {
      const cart = await addCartItem(token, product.id, quantity);
      setItems(mapCartItems(cart.items));
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Unable to add item.' };
    }
  }, [mapCartItems, token]);

  const removeFromCart = useCallback(async (id: string) => {
    if (!token) {
      return { ok: false, message: 'Please sign in to update cart.' };
    }

    try {
      const cart = await removeCartItem(token, id);
      setItems(mapCartItems(cart.items));
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Unable to remove item.' };
    }
  }, [mapCartItems, token]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    if (!token) {
      return { ok: false, message: 'Please sign in to update cart.' };
    }

    if (quantity <= 0) {
      return removeFromCart(id);
    }

    try {
      const cart = await updateCartItem(token, id, quantity);
      setItems(mapCartItems(cart.items));
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : 'Unable to update quantity.' };
    }
  }, [mapCartItems, removeFromCart, token]);

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

import { ProductCategory, ProductSubCategory } from '@/data/pets';
import { apiRequest } from '@/services/api-client';

export type ApiCartItem = {
  productId: string;
  name: string;
  price: number;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  quantity: number;
};

type ApiCart = {
  userId: string;
  items: ApiCartItem[];
  createdAt?: string;
  updatedAt?: string;
};

export async function fetchCart(token: string) {
  const data = await apiRequest<{ cart: ApiCart }>('/cart', { token });
  return data.cart;
}

export async function addCartItem(token: string, productId: string, quantity: number) {
  const data = await apiRequest<{ cart: ApiCart }>('/cart/add', {
    method: 'POST',
    token,
    body: { productId, quantity },
  });
  return data.cart;
}

export async function updateCartItem(token: string, productId: string, quantity: number) {
  const data = await apiRequest<{ cart: ApiCart }>('/cart/update', {
    method: 'PUT',
    token,
    body: { productId, quantity },
  });
  return data.cart;
}

export async function removeCartItem(token: string, productId: string) {
  const data = await apiRequest<{ cart: ApiCart }>(`/cart/remove/${productId}`, {
    method: 'DELETE',
    token,
  });
  return data.cart;
}

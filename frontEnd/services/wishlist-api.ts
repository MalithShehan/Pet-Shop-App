import { apiRequest } from './api-client';

export type WishlistItem = {
  id: string;
  productId: string | null;
  petId: string | null;
  addedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    rating: number;
  } | null;
  pet: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    breed: string | null;
    available: boolean;
  } | null;
};

export type Wishlist = {
  id: string;
  items: WishlistItem[];
};

export async function fetchWishlist(token: string): Promise<{ wishlist: Wishlist }> {
  return apiRequest<{ wishlist: Wishlist }>('/wishlist', { token });
}

export async function addToWishlist(
  token: string,
  payload: { productId?: string; petId?: string }
): Promise<{ wishlist: Wishlist }> {
  return apiRequest<{ wishlist: Wishlist }>('/wishlist', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function removeFromWishlist(token: string, itemId: string): Promise<{ wishlist: Wishlist }> {
  return apiRequest<{ wishlist: Wishlist }>(`/wishlist/${itemId}`, {
    method: 'DELETE',
    token,
  });
}

export async function checkWishlist(
  token: string,
  params: { productId?: string; petId?: string }
): Promise<{ isInWishlist: boolean }> {
  return apiRequest<{ isInWishlist: boolean }>('/wishlist/check', {
    token,
    query: params as Record<string, string>,
  });
}

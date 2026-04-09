import { apiRequest } from './api-client';

export type OrderItem = {
  id: string;
  productId: string | null;
  petId: string | null;
  name: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    image: string;
    category: string;
  } | null;
};

export type Payment = {
  id: string;
  method: string;
  status: string;
  amount: number;
  transactionId: string | null;
  paidAt: string | null;
};

export type Order = {
  id: string;
  userId: string;
  total: number;
  status: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingPhone: string | null;
  notes: string | null;
  items: OrderItem[];
  payment: Payment | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderListResponse = {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

type CreateOrderPayload = {
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostal: string;
  shippingPhone?: string;
  notes?: string;
  paymentMethod?: string;
};

export async function createOrder(token: string, payload: CreateOrderPayload): Promise<{ order: Order }> {
  return apiRequest<{ order: Order }>('/orders', {
    method: 'POST',
    token,
    body: payload,
  });
}

export async function fetchMyOrders(token: string, page = 1): Promise<OrderListResponse> {
  return apiRequest<OrderListResponse>('/orders/my-orders', {
    token,
    query: { page },
  });
}

export async function fetchOrderById(token: string, orderId: string): Promise<{ order: Order }> {
  return apiRequest<{ order: Order }>(`/orders/${orderId}`, { token });
}

export async function cancelOrder(token: string, orderId: string): Promise<{ order: Order }> {
  return apiRequest<{ order: Order }>(`/orders/${orderId}/cancel`, {
    method: 'PUT',
    token,
  });
}

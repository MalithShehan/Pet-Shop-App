import { apiRequest } from '@/services/api-client';

type ApiUser = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: SignUpPayload) {
  return apiRequest<{ user: ApiUser }>('/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export async function loginUser(payload: LoginPayload) {
  return apiRequest<{ token: string; user: ApiUser }>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function fetchMe(token: string) {
  return apiRequest<{ user: ApiUser }>('/auth/me', {
    method: 'GET',
    token,
  });
}

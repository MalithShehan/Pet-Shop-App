import { Platform } from 'react-native';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  token?: string;
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

const defaultApiBaseUrl =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? defaultApiBaseUrl;

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const base = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  if (!query) {
    return base;
  }

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    params.append(key, String(value));
  });

  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', token, body, query } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  if (!payload) {
    throw new ApiError('Invalid server response', response.status);
  }

  return payload.data;
}

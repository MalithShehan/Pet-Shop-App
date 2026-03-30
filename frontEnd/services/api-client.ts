import { Platform } from 'react-native';
import Constants from 'expo-constants';

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

function getExpoHost() {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] || null;
}

function replaceLocalhost(url: string, host: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      parsed.hostname = host;
      return parsed.toString().replace(/\/$/, '');
    }
    return url;
  } catch {
    return url;
  }
}

function resolveApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  const expoHost = getExpoHost();

  if (configured) {
    if (Platform.OS === 'web') {
      return configured;
    }

    if (Platform.OS === 'android') {
      return replaceLocalhost(configured, '10.0.2.2');
    }

    if (expoHost) {
      return replaceLocalhost(configured, expoHost);
    }

    return configured;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  if (expoHost) {
    return `http://${expoHost}:5000/api`;
  }

  return 'http://localhost:5000/api';
}

export const API_BASE_URL = resolveApiBaseUrl();

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

  let response: Response;

  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      `Network request failed. Check backend server and API URL (${API_BASE_URL}).`,
      0
    );
  }

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

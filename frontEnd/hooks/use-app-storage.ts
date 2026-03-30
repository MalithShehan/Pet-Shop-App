import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const memoryStore = new Map<string, string>();

function readFromMemory<T>(key: string, fallback: T): T {
  const raw = memoryStore.get(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function getStoredJson<T>(key: string, fallback: T): Promise<T> {
  try {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    }

    if (Platform.OS !== 'web') {
      try {
        const secureRaw = await SecureStore.getItemAsync(key);
        if (secureRaw) {
          memoryStore.set(key, secureRaw);
          return JSON.parse(secureRaw) as T;
        }
      } catch {
        // Ignore and fall through to memory fallback.
      }
    }

    return readFromMemory(key, fallback);
  } catch {
    return readFromMemory(key, fallback);
  }
}

export async function setStoredJson<T>(key: string, value: T): Promise<void> {
  const payload = JSON.stringify(value);
  memoryStore.set(key, payload);

  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, payload);
    return;
  }

  if (Platform.OS !== 'web') {
    try {
      await SecureStore.setItemAsync(key, payload);
    } catch {
      // Keep memory fallback when native storage providers are unavailable.
    }
  }
}

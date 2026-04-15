import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { NotificationProvider } from '@/context/notification-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="product/[id]" options={{ title: 'Pet Details' }} />
                <Stack.Screen name="checkout" options={{ headerShown: false }} />
                <Stack.Screen name="orders" options={{ headerShown: false }} />
                <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="sign-in" options={{ title: 'Sign In' }} />
                <Stack.Screen name="sign-up" options={{ title: 'Sign Up' }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

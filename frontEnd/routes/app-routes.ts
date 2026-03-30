import { Href } from 'expo-router';

export const AppRoutes = {
  home: '/(tabs)',
  shop: '/(tabs)/shop',
  cart: '/(tabs)/cart',
  about: '/(tabs)/about',
  contact: '/(tabs)/contact',
  signIn: '/sign-in',
  signUp: '/sign-up',
} as const satisfies Record<string, Href>;

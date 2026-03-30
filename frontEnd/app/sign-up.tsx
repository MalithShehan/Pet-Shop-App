import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuthForm } from '@/components/auth-form';
import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';
import { useAuth } from '@/context/auth-context';
import { AppRoutes } from '@/routes/app-routes';

export default function SignUpScreen() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isCompact } = getDeviceClass(width, height);
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    if (!values.name.trim()) {
      setError('Name is required.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await signUp(values);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? 'Unable to sign up.');
      return;
    }

    Alert.alert('Account created', 'You are now signed in.');
    router.replace(AppRoutes.home);
  };

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(420)} style={[styles.wrap, isTablet && styles.wrapTablet]}>
        <View style={styles.head}>
          <Text style={[styles.headTitle, isCompact && styles.headTitleCompact]}>Create Account</Text>
          <Text style={styles.headSub}>Join PetNest and manage everything in one place.</Text>
        </View>

        <AuthForm mode="signup" onSubmit={onSubmit} error={error} loading={loading} />

        <View style={styles.row}>
          <Text style={styles.rowText}>Already have an account?</Text>
          <Link href={AppRoutes.signIn as never} asChild>
            <Pressable>
              <Text style={styles.link}>Sign in</Text>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  wrapTablet: {
    maxWidth: 640,
  },
  head: {
    gap: 2,
  },
  headTitle: {
    color: AppTheme.colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  headTitleCompact: {
    fontSize: 26,
  },
  headSub: {
    color: AppTheme.colors.textSoft,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  rowText: {
    color: AppTheme.colors.textSoft,
  },
  link: {
    color: AppTheme.colors.primary,
    fontWeight: '800',
  },
});

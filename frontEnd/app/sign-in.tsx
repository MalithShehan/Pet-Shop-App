import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AuthForm } from '@/components/auth-form';
import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';
import { AppRoutes } from '@/routes/app-routes';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);

    const result = await signIn(values.email, values.password);
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? 'Unable to sign in.');
      return;
    }

    Alert.alert('Welcome back', 'Signed in successfully.');
    router.replace(AppRoutes.home);
  };

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(420)} style={styles.wrap}>
        <AuthForm mode="signin" onSubmit={onSubmit} error={error} loading={loading} />

        <View style={styles.row}>
          <Text style={styles.rowText}>No account yet?</Text>
          <Link href={AppRoutes.signUp as never} asChild>
            <Pressable>
              <Text style={styles.link}>Create one</Text>
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

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppTheme } from '@/constants/app-theme';

type AuthMode = 'signin' | 'signup';

type AuthValues = {
  name: string;
  email: string;
  password: string;
};

type Props = {
  mode: AuthMode;
  onSubmit: (values: AuthValues) => Promise<void>;
  error?: string | null;
  loading?: boolean;
};

export function AuthForm({ mode, onSubmit, error, loading }: Props) {
  const [values, setValues] = useState<AuthValues>({
    name: '',
    email: '',
    password: '',
  });

  const update = (key: keyof AuthValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const title = mode === 'signup' ? 'Create your account' : 'Welcome back';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {mode === 'signup' && (
        <TextInput
          placeholder="Your full name"
          value={values.name}
          onChangeText={(text) => update('name', text)}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => update('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => update('password', text)}
        secureTextEntry
        style={styles.input}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        disabled={loading}
        style={[styles.buttonWrap, loading && styles.buttonDisabled]}
        onPress={() => onSubmit(values)}>
        <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.button}>
          <Ionicons name="lock-closed" size={16} color="white" />
          <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Continue'}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppTheme.colors.glass,
    borderRadius: AppTheme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    gap: 10,
    ...AppTheme.shadow.card,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  error: {
    color: AppTheme.colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  buttonWrap: {
    marginTop: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
  },
});

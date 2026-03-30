import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';

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
  const { width, height } = useWindowDimensions();
  const { isTablet, isLargePhone } = getDeviceClass(width, height);
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
    <View style={[styles.card, isLargePhone && styles.cardLargePhone, isTablet && styles.cardTablet]}>
      <Text style={[styles.title, isTablet && styles.titleTablet]}>{title}</Text>

      {mode === 'signup' && (
        <TextInput
          placeholder="Your full name"
          value={values.name}
          onChangeText={(text) => update('name', text)}
          style={[styles.input, isTablet && styles.inputTablet]}
        />
      )}

      <TextInput
        placeholder="Email"
        value={values.email}
        onChangeText={(text) => update('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, isTablet && styles.inputTablet]}
      />

      <TextInput
        placeholder="Password"
        value={values.password}
        onChangeText={(text) => update('password', text)}
        secureTextEntry
        style={[styles.input, isTablet && styles.inputTablet]}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Pressable
        disabled={loading}
        style={[styles.buttonWrap, isTablet && styles.buttonWrapTablet, loading && styles.buttonDisabled]}
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
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    backgroundColor: '#FFFFFFF2',
    borderRadius: AppTheme.radius.lg,
    padding: 18,
    borderWidth: 0,
    borderColor: AppTheme.colors.border,
    gap: 11,
    ...AppTheme.shadow.card,
  },
  cardLargePhone: {
    maxWidth: 500,
  },
  cardTablet: {
    maxWidth: 560,
    padding: 22,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 24,
    marginBottom: 6,
  },
  titleTablet: {
    fontSize: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FAF7F2',
  },
  inputTablet: {
    paddingVertical: 13,
  },
  error: {
    color: AppTheme.colors.danger,
    fontWeight: '600',
    fontSize: 13,
  },
  buttonWrap: {
    marginTop: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonWrapTablet: {
    marginTop: 6,
  },
  button: {
    paddingVertical: 13,
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

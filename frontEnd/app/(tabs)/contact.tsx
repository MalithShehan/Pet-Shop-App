import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';
import { getDeviceClass } from '@/constants/responsive';

export default function ContactScreen() {
  const { width, height } = useWindowDimensions();
  const { isTablet, isCompact } = getDeviceClass(width, height);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Please complete all fields.');
      return;
    }

    Alert.alert('Message sent', 'Our team will contact you soon.');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <PageShell>
      <Animated.View entering={FadeInDown.duration(420)} style={[styles.card, isTablet && styles.cardTablet]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>SUPPORT</Text>
        </View>
        <Text style={[styles.title, isCompact && styles.titleCompact]}>Contact Us</Text>
        <Text style={styles.sub}>Need help choosing a pet? Send us a message.</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor={AppTheme.colors.textMuted}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={AppTheme.colors.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Message"
          placeholderTextColor={AppTheme.colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

        <Pressable style={styles.buttonWrap} onPress={submit}>
          <LinearGradient colors={[AppTheme.colors.primaryDark, AppTheme.colors.primary]} style={styles.button}>
            <Text style={styles.buttonText}>Send Message</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    padding: 20,
    gap: 10,
    ...AppTheme.shadow.soft,
  },
  cardTablet: {
    maxWidth: 860,
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: AppTheme.colors.mutedBg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: AppTheme.colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 30,
  },
  titleCompact: {
    fontSize: 26,
  },
  sub: {
    color: AppTheme.colors.textSoft,
    marginBottom: 4,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.borderStrong,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: AppTheme.colors.text,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  buttonWrap: {
    marginTop: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
  },
});

import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { PageShell } from '@/components/page-shell';
import { AppTheme } from '@/constants/app-theme';

export default function ContactScreen() {
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
      <Animated.View entering={FadeInDown.duration(420)} style={styles.card}>
        <Text style={styles.title}>Contact Us</Text>
        <Text style={styles.sub}>Need help choosing a pet? Send us a message.</Text>

        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />

        <Pressable style={styles.button} onPress={submit}>
          <Text style={styles.buttonText}>Send Message</Text>
        </Pressable>
      </Animated.View>
    </PageShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: AppTheme.radius.xl,
    backgroundColor: '#FFFFFFF2',
    borderWidth: 0,
    padding: 18,
    gap: 10,
    ...AppTheme.shadow.soft,
  },
  title: {
    color: AppTheme.colors.text,
    fontWeight: '900',
    fontSize: 28,
  },
  sub: {
    color: AppTheme.colors.textSoft,
    marginBottom: 4,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: '#FAF7F2',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: AppTheme.colors.text,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
  },
});

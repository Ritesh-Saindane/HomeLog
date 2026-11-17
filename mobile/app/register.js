import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthInput } from '../src/components/AuthInput';
import { useAuth } from '../src/context/AuthContext';
import { API_BASE_URL } from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

export default function RegisterScreen() {
  const { register } = useAuth();
  const { colors, darkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    setError('');
    if (!name.trim() || !email.trim() || password.length < 8) return setError('Enter your name, email, and a password of at least 8 characters.');
    try {
      setIsSubmitting(true);
      await register({ name: name.trim(), email: email.trim(), password });
      router.replace('/home');
    } catch (requestError) {
      setError(requestError.response?.data?.error || `Unable to reach the HomeLog backend at ${API_BASE_URL}. Start PostgreSQL and the backend, then check EXPO_PUBLIC_API_URL.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior="padding">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      <View style={styles.brand}><Image source={darkMode ? require('../assets/homelog-dark.png') : require('../assets/homelog-light.png')} resizeMode="contain" style={styles.logoImage} /><Text style={[styles.title, { color: colors.text }]}>Start your home log</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Create one place for assets, repairs, and reminders.</Text></View>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Create account</Text><Text style={[styles.cardHint, { color: colors.muted }]}>A thoughtful way to keep home details together.</Text>
        <AuthInput label="Name" autoCapitalize="words" value={name} onChangeText={setName} placeholder="Your name" />
        <AuthInput label="Email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <AuthInput label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="At least 8 characters" />
        {error ? <View style={[styles.errorBox, { backgroundColor: colors.input }]}><Text style={styles.error}>{error}</Text></View> : null}
        <Pressable disabled={isSubmitting} onPress={handleRegister} style={[styles.primary, { backgroundColor: colors.accent }, isSubmitting && styles.disabled]}><Text style={styles.primaryText}>{isSubmitting ? 'Creating…' : 'Create account'}</Text>{isSubmitting ? <ActivityIndicator color="#fff" /> : null}</Pressable>
        <Text style={[styles.footer, { color: colors.muted }]}>Already have an account? <Link href="/login" style={[styles.link, { color: colors.accent }]}>Sign in</Link></Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  brand: { marginBottom: 24 },
  logoImage: { height: 92, marginBottom: 12, width: '100%' },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  card: { borderRadius: 20, padding: 20 },
  heading: { fontSize: 22, fontWeight: '800' },
  cardHint: { fontSize: 13, marginBottom: 18, marginTop: 5 },
  errorBox: { borderRadius: 10, marginBottom: 14, padding: 11 },
  error: { color: '#e06b60', fontSize: 13, lineHeight: 19 },
  primary: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 10, justifyContent: 'center', minHeight: 50, padding: 14 },
  disabled: { opacity: 0.65 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { marginTop: 20, textAlign: 'center' },
  link: { fontWeight: '800' },
});


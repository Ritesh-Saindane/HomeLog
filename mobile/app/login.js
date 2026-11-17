import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthInput } from '../src/components/AuthInput';
import { useAuth } from '../src/context/AuthContext';
import { API_BASE_URL } from '../src/services/api';
import { useTheme } from '../src/context/ThemeContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors, darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) return setError('Enter your email and password.');
    try {
      setIsSubmitting(true);
      await login({ email: email.trim(), password });
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
      <View style={styles.brand}><Image source={darkMode ? require('../assets/homelog-dark.png') : require('../assets/homelog-light.png')} resizeMode="contain" style={styles.logoImage} /><Text style={[styles.title, { color: colors.text }]}>Welcome home</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Keep your assets, repairs, and reminders in one calm place.</Text></View>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Sign in</Text>
        <Text style={[styles.cardHint, { color: colors.muted }]}>Pick up where you left off.</Text>
        <AuthInput label="Email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <AuthInput label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="Your password" />
        {error ? <View style={[styles.errorBox, { backgroundColor: colors.input }]}><Text style={styles.error}>{error}</Text></View> : null}
        <Pressable disabled={isSubmitting} onPress={handleLogin} style={[styles.primary, { backgroundColor: colors.accent }, isSubmitting && styles.disabled]}><Text style={styles.primaryText}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Text>{isSubmitting ? <ActivityIndicator color="#fff" /> : null}</Pressable>
        <Text style={[styles.footer, { color: colors.muted }]}>New to HomeLog? <Link href="/register" style={[styles.link, { color: colors.accent }]}>Create an account</Link></Text>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: 40 },
  brand: { marginBottom: 26 },
  logoImage: { height: 92, marginBottom: 12, width: '100%' },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  card: { borderRadius: 20, padding: 20 },
  heading: { fontSize: 22, fontWeight: '800' },
  cardHint: { fontSize: 13, marginBottom: 20, marginTop: 5 },
  errorBox: { borderRadius: 10, marginBottom: 14, padding: 11 },
  error: { color: '#e06b60', fontSize: 13, lineHeight: 19 },
  primary: { alignItems: 'center', borderRadius: 12, flexDirection: 'row', gap: 10, justifyContent: 'center', minHeight: 50, padding: 14 },
  disabled: { opacity: 0.65 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { marginTop: 20, textAlign: 'center' },
  link: { fontWeight: '800' },
});


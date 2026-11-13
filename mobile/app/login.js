import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthInput } from '../src/components/AuthInput';
import { useAuth } from '../src/context/AuthContext';
import { API_BASE_URL } from '../src/services/api';

export default function LoginScreen() {
  const { login } = useAuth();
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
    <View style={styles.container}>
      <View style={styles.brand}><Text style={styles.logo}>⌂</Text><Text style={styles.title}>Welcome to HomeLog</Text><Text style={styles.subtitle}>Keep every home asset in good shape.</Text></View>
      <View style={styles.card}>
        <Text style={styles.heading}>Sign in</Text>
        <AuthInput label="Email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <AuthInput label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="Your password" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable disabled={isSubmitting} onPress={handleLogin} style={styles.primary}><Text style={styles.primaryText}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Text>{isSubmitting ? <ActivityIndicator color="#fff" /> : null}</Pressable>
        <Text style={styles.footer}>New to HomeLog? <Link href="/register" style={styles.link}>Create an account</Link></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eff6ff', flex: 1, padding: 24 },
  brand: { marginBottom: 30, marginTop: 60 },
  logo: { color: '#2563eb', fontSize: 42, fontWeight: '800' },
  title: { color: '#0f172a', fontSize: 29, fontWeight: '800', marginTop: 8 },
  subtitle: { color: '#64748b', fontSize: 16, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  heading: { color: '#0f172a', fontSize: 22, fontWeight: '700', marginBottom: 20 },
  error: { color: '#b91c1c', fontSize: 13, marginBottom: 14 },
  primary: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, flexDirection: 'row', gap: 10, justifyContent: 'center', padding: 14 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { color: '#64748b', marginTop: 20, textAlign: 'center' },
  link: { color: '#2563eb', fontWeight: '700' },
});


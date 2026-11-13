import { Link, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AuthInput } from '../src/components/AuthInput';
import { useAuth } from '../src/context/AuthContext';

export default function RegisterScreen() {
  const { register } = useAuth();
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
      setError(requestError.response?.data?.error || 'Unable to create your account. Backend authentication is coming in B2.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>HOMELOG</Text><Text style={styles.title}>Start your home log</Text><Text style={styles.subtitle}>Create one place for assets, repairs, and reminders.</Text>
      <View style={styles.card}>
        <AuthInput label="Name" autoCapitalize="words" value={name} onChangeText={setName} placeholder="Your name" />
        <AuthInput label="Email" keyboardType="email-address" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <AuthInput label="Password" secureTextEntry value={password} onChangeText={setPassword} placeholder="At least 8 characters" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable disabled={isSubmitting} onPress={handleRegister} style={styles.primary}><Text style={styles.primaryText}>{isSubmitting ? 'Creating…' : 'Create account'}</Text>{isSubmitting ? <ActivityIndicator color="#fff" /> : null}</Pressable>
        <Text style={styles.footer}>Already have an account? <Link href="/login" style={styles.link}>Sign in</Link></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 70 },
  kicker: { color: '#2563eb', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#64748b', fontSize: 16, lineHeight: 23, marginBottom: 28, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  error: { color: '#b91c1c', fontSize: 13, marginBottom: 14 },
  primary: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 12, flexDirection: 'row', gap: 10, justifyContent: 'center', padding: 14 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { color: '#64748b', marginTop: 20, textAlign: 'center' },
  link: { color: '#2563eb', fontWeight: '700' },
});


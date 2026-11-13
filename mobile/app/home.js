import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>HOMELOG</Text>
      <Text style={styles.title}>Your home, logged.</Text>
      <Text style={styles.subtitle}>Dashboard and asset management arrive in F2.</Text>
      <View style={styles.card}><Text style={styles.cardTitle}>Ready for your assets</Text><Text style={styles.cardText}>{user?.name ? `Welcome, ${user.name}.` : 'Sign in state is ready.'}</Text></View>
      <Pressable onPress={logout} style={styles.secondary}><Text style={styles.secondaryText}>Sign out</Text></Pressable>
      <Pressable onPress={() => router.replace('/login')} style={styles.linkButton}><Text style={styles.linkText}>Return to sign in</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 70 },
  kicker: { color: '#2563eb', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#0f172a', fontSize: 32, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#64748b', fontSize: 16, lineHeight: 23, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 20, marginTop: 28, padding: 20 },
  cardTitle: { color: '#0f172a', fontSize: 19, fontWeight: '700' },
  cardText: { color: '#64748b', marginTop: 8 },
  secondary: { borderColor: '#2563eb', borderRadius: 12, borderWidth: 1, marginTop: 20, padding: 14 },
  secondaryText: { color: '#2563eb', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  linkButton: { marginTop: 16, padding: 10 },
  linkText: { color: '#64748b', textAlign: 'center' },
});


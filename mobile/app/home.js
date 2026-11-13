import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { useAssets } from '../src/context/AssetContext';
import { AssetCard } from '../src/components/AssetCard';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { assets, isLoading } = useAssets();
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>HOMELOG</Text>
      <Text style={styles.title}>Your home, logged.</Text>
      <Text style={styles.subtitle}>{user?.name ? `Welcome back, ${user.name}.` : 'Track the things that keep your home running.'}</Text>
      <View style={styles.stats}><View><Text style={styles.statNumber}>{assets.length}</Text><Text style={styles.statLabel}>Assets</Text></View><View><Text style={styles.statNumber}>{assets.filter((asset) => asset.status === 'ACTIVE').length}</Text><Text style={styles.statLabel}>Active</Text></View><View><Text style={styles.statNumber}>0</Text><Text style={styles.statLabel}>Due soon</Text></View></View>
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your assets</Text><Pressable onPress={() => router.push('/assets')}><Text style={styles.viewAll}>View all</Text></Pressable></View>
      {isLoading ? <Text style={styles.cardText}>Loading assets…</Text> : assets.slice(0, 2).map((asset) => <AssetCard key={asset.id} asset={asset} onPress={() => router.push(`/assets/${asset.id}`)} />)}
      <Pressable onPress={() => router.push('/assets/new')} style={styles.primary}><Text style={styles.primaryText}>＋ Add asset</Text></Pressable>
      <Pressable onPress={() => router.push('/scan')} style={styles.secondary}><Text style={styles.secondaryText}>Scan asset QR</Text></Pressable>
      {assets[0] ? <Pressable onPress={() => router.push(`/assets/${assets[0].id}/maintenance`)} style={styles.secondary}><Text style={styles.secondaryText}>Manage maintenance</Text></Pressable> : null}
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
  stats: { backgroundColor: '#fff', borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', marginTop: 26, padding: 20 },
  statNumber: { color: '#0f172a', fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#64748b', fontSize: 12, marginTop: 4 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginTop: 28 },
  sectionTitle: { color: '#0f172a', fontSize: 19, fontWeight: '700' },
  viewAll: { color: '#2563eb', fontWeight: '700' },
  cardText: { color: '#64748b', marginTop: 8 },
  primary: { backgroundColor: '#2563eb', borderRadius: 12, marginTop: 4, padding: 14 },
  primaryText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondary: { borderColor: '#2563eb', borderRadius: 12, borderWidth: 1, marginTop: 20, padding: 14 },
  secondaryText: { color: '#2563eb', fontSize: 16, fontWeight: '700', textAlign: 'center' },
  linkButton: { marginTop: 16, padding: 10 },
  linkText: { color: '#64748b', textAlign: 'center' },
});


import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AssetCard } from '../../src/components/AssetCard';
import { useAssets } from '../../src/context/AssetContext';

export default function AssetsScreen() {
  const { assets, isLoading } = useAssets();
  return (
    <View style={styles.container}>
      <View style={styles.header}><View><Text style={styles.kicker}>HOMELOG</Text><Text style={styles.title}>Your assets</Text></View><Pressable onPress={() => router.push('/assets/new')} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable></View>
      {isLoading ? <ActivityIndicator color="#2563eb" size="large" /> : <ScrollView showsVerticalScrollIndicator={false}>{assets.length ? assets.map((asset) => <AssetCard key={asset.id} asset={asset} onPress={() => router.push(`/assets/${asset.id}`)} />) : <Text style={styles.empty}>No assets yet. Add your first appliance.</Text>}</ScrollView>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 64 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  kicker: { color: '#2563eb', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginTop: 8 },
  add: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  addText: { color: '#fff', fontSize: 28, fontWeight: '300' },
  empty: { color: '#64748b', textAlign: 'center', marginTop: 50 },
});


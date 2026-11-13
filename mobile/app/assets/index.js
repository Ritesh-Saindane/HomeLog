import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AssetCard } from '../../src/components/AssetCard';
import { useAssets } from '../../src/context/AssetContext';

export default function AssetsScreen() {
  const { assets, isLoading } = useAssets();
  const { room: initialRoom } = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [room, setRoom] = useState(initialRoom || 'ALL');
  const [category, setCategory] = useState('ALL');
  const filtered = assets.filter((asset) => `${asset.name} ${asset.brand || ''}`.toLowerCase().includes(query.toLowerCase()) && (room === 'ALL' || asset.location === room) && (category === 'ALL' || asset.category === category));
  const grouped = filtered.reduce((groups, asset) => { const key = asset.location || 'Other'; (groups[key] ||= []).push(asset); return groups; }, {});
  return (
    <View style={styles.container}>
      <View style={styles.header}><View><Text style={styles.kicker}>HOMELOG</Text><Text style={styles.title}>Your assets</Text></View><Pressable onPress={() => router.push('/assets/new')} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable></View>
      {isLoading ? <ActivityIndicator color="#2563eb" size="large" /> : <ScrollView showsVerticalScrollIndicator={false}><TextInput value={query} onChangeText={setQuery} placeholder="Search assets" placeholderTextColor="#94a3b8" style={styles.search} /><View style={styles.filters}><View style={styles.filter}><Picker selectedValue={room} onValueChange={setRoom}><Picker.Item label="All rooms" value="ALL" /><Picker.Item label="Living room" value="Living room" /><Picker.Item label="Kitchen" value="Kitchen" /><Picker.Item label="Bedroom" value="Bedroom" /><Picker.Item label="Bathroom" value="Bathroom" /></Picker></View><View style={styles.filter}><Picker selectedValue={category} onValueChange={setCategory}><Picker.Item label="All types" value="ALL" /><Picker.Item label="Air conditioner" value="Air conditioner" /><Picker.Item label="Refrigerator" value="Refrigerator" /><Picker.Item label="Washing machine" value="Washing machine" /></Picker></View></View>{Object.keys(grouped).length ? Object.entries(grouped).map(([location, roomAssets]) => <View key={location}><Text style={styles.groupTitle}>{location}</Text>{roomAssets.map((asset) => <AssetCard key={asset.id} asset={asset} onPress={() => router.push(`/assets/${asset.id}`)} />)}</View>) : <Text style={styles.empty}>No matching assets.</Text>}</ScrollView>}
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
  search: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, color: '#0f172a', marginBottom: 10, padding: 13 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filter: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 10, borderWidth: 1, flex: 1, overflow: 'hidden' },
  groupTitle: { color: '#334155', fontSize: 15, fontWeight: '800', marginBottom: 10, marginTop: 8 },
});


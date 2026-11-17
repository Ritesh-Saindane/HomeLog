import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AssetCard } from '../../src/components/AssetCard';
import { useAssets } from '../../src/context/AssetContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function AssetsScreen() {
  const { assets, isLoading } = useAssets();
  const { colors } = useTheme();
  const { room: initialRoom } = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [room, setRoom] = useState(initialRoom || 'ALL');
  const [category, setCategory] = useState('ALL');
  const filtered = assets.filter((asset) => `${asset.name} ${asset.brand || ''}`.toLowerCase().includes(query.toLowerCase()) && (room === 'ALL' || asset.location === room) && (category === 'ALL' || asset.category === category));
  const grouped = filtered.reduce((groups, asset) => { const key = asset.location || 'Other'; (groups[key] ||= []).push(asset); return groups; }, {});
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}><View><Text style={[styles.kicker, { color: colors.accent }]}>HOMELOG</Text><Text style={[styles.title, { color: colors.text }]}>Your assets</Text></View><Pressable onPress={() => router.push('/assets/new')} style={[styles.add, { backgroundColor: colors.accent }]}><Text style={styles.addText}>＋</Text></Pressable></View>
      {isLoading ? <ActivityIndicator color={colors.accent} size="large" /> : <ScrollView showsVerticalScrollIndicator={false}><TextInput value={query} onChangeText={setQuery} placeholder="Search assets" placeholderTextColor={colors.muted} style={[styles.search, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} /><View style={styles.filters}><View style={[styles.filter, { backgroundColor: colors.input, borderColor: colors.border }]}><Picker selectedValue={room} onValueChange={setRoom} style={{ color: colors.text }} dropdownIconColor={colors.text}><Picker.Item label="All rooms" value="ALL" color={colors.text} /><Picker.Item label="Living room" value="Living room" color={colors.text} /><Picker.Item label="Kitchen" value="Kitchen" color={colors.text} /><Picker.Item label="Bedroom" value="Bedroom" color={colors.text} /><Picker.Item label="Bathroom" value="Bathroom" color={colors.text} /></Picker></View><View style={[styles.filter, { backgroundColor: colors.input, borderColor: colors.border }]}><Picker selectedValue={category} onValueChange={setCategory} style={{ color: colors.text }} dropdownIconColor={colors.text}><Picker.Item label="All types" value="ALL" color={colors.text} /><Picker.Item label="Air conditioner" value="Air conditioner" color={colors.text} /><Picker.Item label="Refrigerator" value="Refrigerator" color={colors.text} /><Picker.Item label="Washing machine" value="Washing machine" color={colors.text} /></Picker></View></View>{Object.keys(grouped).length ? Object.entries(grouped).map(([location, roomAssets]) => <View key={location}><Text style={[styles.groupTitle, { color: colors.text }]}>{location}</Text>{roomAssets.map((asset) => <AssetCard key={asset.id} asset={asset} onPress={() => router.push(`/assets/${asset.id}`)} />)}</View>) : <Text style={[styles.empty, { color: colors.muted }]}>No matching assets.</Text>}</ScrollView>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 64 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: '800', marginTop: 8 },
  add: { alignItems: 'center', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  addText: { color: '#fff', fontSize: 28, fontWeight: '300' },
  empty: { textAlign: 'center', marginTop: 50 },
  search: { borderRadius: 12, borderWidth: 1, marginBottom: 10, padding: 13 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filter: { borderRadius: 10, borderWidth: 1, flex: 1, overflow: 'hidden' },
  groupTitle: { fontSize: 15, fontWeight: '800', marginBottom: 10, marginTop: 8 },
});


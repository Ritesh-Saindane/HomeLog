import { BottomNav } from '../src/components/BottomNav';
import { TodoPanel } from '../src/components/TodoPanel';
import { useAssets } from '../src/context/AssetContext';
import { useTheme } from '../src/context/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { api } from '../src/services/api';

export default function TodosScreen() {
  const { colors } = useTheme();
  const { assets } = useAssets();
  const [schedules, setSchedules] = useState([]);
  useEffect(() => { let mounted = true; Promise.all(assets.map((asset) => api.get(`/assets/${asset.id}/maintenance`).then((response) => response.data.map((item) => ({ ...item, assetName: asset.name }))).catch(() => []))).then((items) => { if (mounted) setSchedules(items.flat()); }); return () => { mounted = false; }; }, [assets]);
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.text }]}>Home to-dos</Text><TodoPanel schedules={schedules} assets={assets} showAll /><BottomNav /></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, padding: 22, paddingTop: 65 }, title: { fontSize: 28, fontWeight: '800' } });

import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../../../src/services/api';
import { useTheme } from '../../../../src/context/ThemeContext';

export default function ServicesScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() { try { const response = await api.get(`/assets/${id}/services`); setRecords(response.data); } catch { setError('Unable to load service history.'); } finally { setIsLoading(false); } }
  useEffect(() => { load(); }, [id]);
  async function remove(recordId) { await api.delete(`/services/${recordId}`); setRecords((current) => current.filter((record) => record.id !== recordId)); }
  return <View style={[styles.container, { backgroundColor: colors.background }]}><View style={styles.header}><View><Text style={[styles.kicker, { color: colors.accent }]}>SERVICE HISTORY</Text><Text style={[styles.title, { color: colors.text }]}>Repairs & service</Text></View><Pressable onPress={() => router.push(`/assets/${id}/services/new`)} style={[styles.add, { backgroundColor: colors.accent }]}><Text style={styles.addText}>＋</Text></Pressable></View>{isLoading ? <ActivityIndicator color={colors.accent} size="large" /> : error ? <Text style={[styles.error, { color: colors.muted }]}>{error}</Text> : <ScrollView>{records.length === 0 ? <Text style={[styles.empty, { color: colors.muted }]}>No service records yet.</Text> : records.map((record) => <View key={record.id} style={[styles.card, { backgroundColor: colors.card }]}><View style={styles.cardHeader}><Text style={[styles.recordTitle, { color: colors.text }]}>{record.title}</Text><Text style={[styles.date, { color: colors.muted }]}>{String(record.serviceDate).slice(0, 10)}</Text></View><Text style={[styles.type, { color: colors.accent }]}>{record.serviceType}</Text><Text style={[styles.description, { color: colors.muted }]}>{record.description || 'No description added.'}</Text><View style={styles.actions}><Pressable onPress={() => router.push({ pathname: `/assets/${id}/services/edit`, params: { serviceId: record.id } })}><Text style={[styles.action, { color: colors.accent }]}>Edit</Text></Pressable><Pressable onPress={() => remove(record.id)}><Text style={styles.delete}>Delete</Text></Pressable></View></View>)}</ScrollView>}</View>;
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 24, paddingTop: 64 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }, kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { fontSize: 28, fontWeight: '800', marginTop: 8 }, add: { alignItems: 'center', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 }, addText: { color: '#fff', fontSize: 28 }, card: { borderRadius: 16, marginBottom: 12, padding: 16 }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between' }, recordTitle: { flex: 1, fontSize: 16, fontWeight: '700' }, date: { fontSize: 12, marginLeft: 8 }, type: { fontSize: 13, fontWeight: '600', marginTop: 6 }, description: { lineHeight: 20, marginTop: 10 }, actions: { flexDirection: 'row', gap: 20, marginTop: 14 }, action: { fontWeight: '700' }, delete: { color: '#ef746a', fontWeight: '700' }, empty: { textAlign: 'center', marginTop: 50 }, error: {} });


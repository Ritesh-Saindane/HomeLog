import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../../../../src/services/api';

export default function ServicesScreen() {
  const { id } = useLocalSearchParams();
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  async function load() { try { const response = await api.get(`/assets/${id}/services`); setRecords(response.data); } catch { setError('Unable to load service history.'); } finally { setIsLoading(false); } }
  useEffect(() => { load(); }, [id]);
  async function remove(recordId) { await api.delete(`/services/${recordId}`); setRecords((current) => current.filter((record) => record.id !== recordId)); }
  return <View style={styles.container}><View style={styles.header}><View><Text style={styles.kicker}>SERVICE HISTORY</Text><Text style={styles.title}>Repairs & service</Text></View><Pressable onPress={() => router.push(`/assets/${id}/services/new`)} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable></View>{isLoading ? <ActivityIndicator color="#2563eb" size="large" /> : error ? <Text style={styles.error}>{error}</Text> : <ScrollView>{records.length === 0 ? <Text style={styles.empty}>No service records yet.</Text> : records.map((record) => <View key={record.id} style={styles.card}><View style={styles.cardHeader}><Text style={styles.recordTitle}>{record.title}</Text><Text style={styles.date}>{String(record.serviceDate).slice(0, 10)}</Text></View><Text style={styles.type}>{record.serviceType}</Text><Text style={styles.description}>{record.description || 'No description added.'}</Text><View style={styles.actions}><Pressable onPress={() => router.push({ pathname: `/assets/${id}/services/edit`, params: { serviceId: record.id } })}><Text style={styles.action}>Edit</Text></Pressable><Pressable onPress={() => remove(record.id)}><Text style={styles.delete}>Delete</Text></Pressable></View></View>)}</ScrollView>}</View>;
}

const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 64 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }, kicker: { color: '#2563eb', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#0f172a', fontSize: 28, fontWeight: '800', marginTop: 8 }, add: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 }, addText: { color: '#fff', fontSize: 28 }, card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 16 }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between' }, recordTitle: { color: '#0f172a', flex: 1, fontSize: 16, fontWeight: '700' }, date: { color: '#64748b', fontSize: 12, marginLeft: 8 }, type: { color: '#2563eb', fontSize: 13, fontWeight: '600', marginTop: 6 }, description: { color: '#64748b', lineHeight: 20, marginTop: 10 }, actions: { flexDirection: 'row', gap: 20, marginTop: 14 }, action: { color: '#2563eb', fontWeight: '700' }, delete: { color: '#b91c1c', fontWeight: '700' }, empty: { color: '#64748b', textAlign: 'center', marginTop: 50 }, error: { color: '#b91c1c' } });


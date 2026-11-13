import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaintenanceForm } from '../../../src/components/MaintenanceForm';
import { api } from '../../../src/services/api';
import { rescheduleMaintenanceNotifications } from '../../../src/services/notifications';

export default function MaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  async function load() { const response = await api.get(`/assets/${id}/maintenance`); setSchedules(response.data); setIsLoading(false); }
  useEffect(() => { load().catch(() => setIsLoading(false)); }, [id]);
  async function create(values) { const response = await api.post(`/assets/${id}/maintenance`, { ...values, isActive: true }); const next = [response.data, ...schedules]; setSchedules(next); await rescheduleMaintenanceNotifications(next); setShowForm(false); }
  async function deactivate(schedule) { const response = await api.put(`/maintenance/${schedule.id}`, { isActive: false }); const next = schedules.map((item) => item.id === schedule.id ? response.data : item); setSchedules(next); await rescheduleMaintenanceNotifications(next); }
  if (showForm) return <View style={styles.container}><Pressable onPress={() => setShowForm(false)}><Text style={styles.back}>‹ Back to schedules</Text></Pressable><Text style={styles.title}>Add maintenance</Text><MaintenanceForm submitLabel="Save schedule" onSubmit={create} /></View>;
  return <View style={styles.container}><View style={styles.header}><View><Text style={styles.kicker}>MAINTENANCE</Text><Text style={styles.title}>Upcoming schedules</Text></View><Pressable onPress={() => setShowForm(true)} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable></View>{isLoading ? <ActivityIndicator color="#2563eb" size="large" /> : <ScrollView>{schedules.length === 0 ? <Text style={styles.empty}>No maintenance schedules yet.</Text> : schedules.map((schedule) => <View key={schedule.id} style={styles.card}><Text style={styles.cardTitle}>{schedule.title}</Text><Text style={styles.date}>Due {String(schedule.nextDueDate).slice(0, 10)}</Text><Text style={styles.description}>{schedule.description || 'No description added.'}</Text><View style={styles.footer}><Text style={schedule.isActive ? styles.active : styles.inactive}>{schedule.isActive ? 'Active' : 'Inactive'}</Text>{schedule.isActive ? <Pressable onPress={() => deactivate(schedule)}><Text style={styles.deactivate}>Deactivate</Text></Pressable> : null}</View></View>)}</ScrollView>}</View>;
}
const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 64 }, back: { color: '#2563eb', fontWeight: '700', marginBottom: 20 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }, kicker: { color: '#2563eb', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { color: '#0f172a', fontSize: 27, fontWeight: '800', marginTop: 8 }, add: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 }, addText: { color: '#fff', fontSize: 28 }, card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 16 }, cardTitle: { color: '#0f172a', fontSize: 17, fontWeight: '700' }, date: { color: '#2563eb', fontWeight: '600', marginTop: 7 }, description: { color: '#64748b', lineHeight: 20, marginTop: 9 }, footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, active: { color: '#15803d', fontWeight: '700' }, inactive: { color: '#64748b', fontWeight: '700' }, deactivate: { color: '#b91c1c', fontWeight: '700' }, empty: { color: '#64748b', textAlign: 'center', marginTop: 50 } });


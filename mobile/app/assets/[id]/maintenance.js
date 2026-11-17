import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaintenanceForm } from '../../../src/components/MaintenanceForm';
import { api } from '../../../src/services/api';
import { rescheduleMaintenanceNotifications, scheduleTestNotification } from '../../../src/services/notifications';
import { useTheme } from '../../../src/context/ThemeContext';

export default function MaintenanceScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  async function load() { const response = await api.get(`/assets/${id}/maintenance`); setSchedules(response.data); setIsLoading(false); }
  useEffect(() => { load().catch(() => setIsLoading(false)); }, [id]);
  async function create(values) {
    setSaveError('');
    try {
      const response = await api.post(`/assets/${id}/maintenance`, { ...values, isActive: true });
      const next = [response.data, ...schedules];
      setSchedules(next);
      await rescheduleMaintenanceNotifications(next);
      setShowForm(false);
    } catch (error) {
      setSaveError(error?.response?.data?.error || 'Could not save this reminder. Make sure the backend and database are running.');
    }
  }
  async function deactivate(schedule) { const response = await api.put(`/maintenance/${schedule.id}`, { isActive: false }); const next = schedules.map((item) => item.id === schedule.id ? response.data : item); setSchedules(next); await rescheduleMaintenanceNotifications(next); }
  async function testNotification() { setTestMessage(''); const result = await scheduleTestNotification(); setTestMessage(result.permissionDenied ? 'Allow notifications to run the test.' : 'Test notification scheduled for about 10 seconds from now.'); }
  if (showForm) return <View style={[styles.container, { backgroundColor: colors.background }]}><Pressable onPress={() => { setSaveError(''); setShowForm(false); }}><Text style={[styles.back, { color: colors.accent }]}>‹ Back to schedules</Text></Pressable><Text style={[styles.title, { color: colors.text }]}>Add maintenance</Text>{saveError ? <Text style={styles.error}>{saveError}</Text> : null}<MaintenanceForm submitLabel="Save schedule" onSubmit={create} /></View>;
  return <View style={[styles.container, { backgroundColor: colors.background }]}><View style={styles.header}><View><Text style={[styles.kicker, { color: colors.accent }]}>MAINTENANCE</Text><Text style={[styles.title, { color: colors.text }]}>Upcoming schedules</Text></View><Pressable onPress={() => setShowForm(true)} style={[styles.add, { backgroundColor: colors.accent }]}><Text style={styles.addText}>＋</Text></Pressable></View><Pressable onPress={testNotification} style={[styles.testButton, { borderColor: colors.accent }]}><Text style={[styles.testText, { color: colors.accent }]}>Send test notification</Text></Pressable>{testMessage ? <Text style={[styles.testMessage, { color: colors.muted }]}>{testMessage}</Text> : null}{isLoading ? <ActivityIndicator color={colors.accent} size="large" /> : <ScrollView>{schedules.length === 0 ? <Text style={[styles.empty, { color: colors.muted }]}>No maintenance schedules yet.</Text> : schedules.map((schedule) => <View key={schedule.id} style={[styles.card, { backgroundColor: colors.card }]}><Text style={[styles.cardTitle, { color: colors.text }]}>{schedule.title}</Text><Text style={[styles.date, { color: colors.accent }]}>Due {String(schedule.nextDueDate).slice(0, 10)} at {schedule.reminderTime || '09:00'}</Text><Text style={[styles.description, { color: colors.muted }]}>{schedule.description || 'No description added.'}</Text><View style={styles.footer}><Text style={schedule.isActive ? styles.active : [styles.inactive, { color: colors.muted }]}>{schedule.isActive ? 'Active' : 'Inactive'}</Text>{schedule.isActive ? <Pressable onPress={() => deactivate(schedule)}><Text style={styles.deactivate}>Deactivate</Text></Pressable> : null}</View></View>)}</ScrollView>}</View>;
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 24, paddingTop: 64 }, back: { fontWeight: '700', marginBottom: 20 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 }, kicker: { fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, title: { fontSize: 27, fontWeight: '800', marginTop: 8 }, error: { color: '#d9534f', fontSize: 13, lineHeight: 19, marginTop: 10 }, add: { alignItems: 'center', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 }, addText: { color: '#fff', fontSize: 28 }, testButton: { borderRadius: 11, borderWidth: 1, marginBottom: 8, padding: 12 }, testText: { fontWeight: '800', textAlign: 'center' }, testMessage: { fontSize: 12, marginBottom: 14, textAlign: 'center' }, card: { borderRadius: 16, marginBottom: 12, padding: 16 }, cardTitle: { fontSize: 17, fontWeight: '700' }, date: { fontWeight: '600', marginTop: 7 }, description: { lineHeight: 20, marginTop: 9 }, footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }, active: { color: '#4cc68a', fontWeight: '700' }, inactive: { fontWeight: '700' }, deactivate: { color: '#ef746a', fontWeight: '700' }, empty: { textAlign: 'center', marginTop: 50 } });

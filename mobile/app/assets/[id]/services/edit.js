import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { ServiceForm } from '../../../../src/components/ServiceForm';
import { api } from '../../../../src/services/api';
import { useTheme } from '../../../../src/context/ThemeContext';

export default function EditServiceScreen() {
  const { id, serviceId } = useLocalSearchParams();
  const { colors } = useTheme();
  const [record, setRecord] = useState(null);
  useEffect(() => { api.get(`/assets/${id}/services`).then((response) => setRecord(response.data.find((item) => item.id === serviceId))).catch(() => setRecord(false)); }, [id, serviceId]);
  if (record === null) return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.accent} /></View>;
  if (!record) return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>Service record not found.</Text></View>;
  async function submit(values) { await api.put(`/services/${serviceId}`, values); router.replace(`/assets/${id}/services`); }
  return <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior="padding" keyboardVerticalOffset={0}><Text style={[styles.title, { color: colors.text }]}>Edit service record</Text><ServiceForm initialValues={{ ...record, serviceDate: String(record.serviceDate).slice(0, 10) }} submitLabel="Save changes" onSubmit={submit} /></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ container: { flex: 1, paddingTop: 64 }, title: { fontSize: 29, fontWeight: '800', paddingHorizontal: 24, marginBottom: 8 }, center: { alignItems: 'center', flex: 1, justifyContent: 'center' } });


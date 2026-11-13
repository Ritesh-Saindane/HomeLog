import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ServiceForm } from '../../../../src/components/ServiceForm';
import { api } from '../../../../src/services/api';

export default function EditServiceScreen() {
  const { id, serviceId } = useLocalSearchParams();
  const [record, setRecord] = useState(null);
  useEffect(() => { api.get(`/assets/${id}/services`).then((response) => setRecord(response.data.find((item) => item.id === serviceId))).catch(() => setRecord(false)); }, [id, serviceId]);
  if (record === null) return <View style={styles.center}><ActivityIndicator color="#2563eb" /></View>;
  if (!record) return <View style={styles.center}><Text>Service record not found.</Text></View>;
  async function submit(values) { await api.put(`/services/${serviceId}`, values); router.replace(`/assets/${id}/services`); }
  return <View style={styles.container}><Text style={styles.title}>Edit service record</Text><ServiceForm initialValues={{ ...record, serviceDate: String(record.serviceDate).slice(0, 10) }} submitLabel="Save changes" onSubmit={submit} /></View>;
}
const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, paddingTop: 64 }, title: { color: '#0f172a', fontSize: 29, fontWeight: '800', paddingHorizontal: 24, marginBottom: 8 }, center: { alignItems: 'center', flex: 1, justifyContent: 'center' } });


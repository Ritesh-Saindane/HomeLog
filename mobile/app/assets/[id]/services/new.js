import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ServiceForm } from '../../../../src/components/ServiceForm';
import { api } from '../../../../src/services/api';

export default function NewServiceScreen() {
  const { id } = useLocalSearchParams();
  async function submit(values) { await api.post(`/assets/${id}/services`, values); router.replace(`/assets/${id}/services`); }
  return <View style={styles.container}><Text style={styles.title}>Add service record</Text><ServiceForm submitLabel="Save record" onSubmit={submit} /></View>;
}
const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, paddingTop: 64 }, title: { color: '#0f172a', fontSize: 29, fontWeight: '800', paddingHorizontal: 24, marginBottom: 8 } });


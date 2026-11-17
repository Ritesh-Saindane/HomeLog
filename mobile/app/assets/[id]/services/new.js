import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { ServiceForm } from '../../../../src/components/ServiceForm';
import { api } from '../../../../src/services/api';
import { useTheme } from '../../../../src/context/ThemeContext';

export default function NewServiceScreen() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
  async function submit(values) { await api.post(`/assets/${id}/services`, values); router.replace(`/assets/${id}/services`); }
  return <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior="padding" keyboardVerticalOffset={0}><Text style={[styles.title, { color: colors.text }]}>Add service record</Text><ServiceForm submitLabel="Save record" onSubmit={submit} /></KeyboardAvoidingView>;
}
const styles = StyleSheet.create({ container: { flex: 1, paddingTop: 64 }, title: { fontSize: 29, fontWeight: '800', paddingHorizontal: 24, marginBottom: 8 } });


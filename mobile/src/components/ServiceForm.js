import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export function ServiceForm({ initialValues = {}, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  const fields = [['title', 'Title', 'e.g. AC annual service'], ['serviceType', 'Service type', 'e.g. Repair'], ['serviceDate', 'Service date', 'YYYY-MM-DD'], ['technicianName', 'Technician', 'Optional'], ['serviceProvider', 'Service provider', 'Optional'], ['cost', 'Cost', 'Optional']];
  function update(field, value) { setValues((current) => ({ ...current, [field]: value })); }
  function submit() { if (!values.title?.trim() || !values.serviceType?.trim() || !values.serviceDate?.trim()) return setError('Title, service type, and service date are required.'); setError(''); onSubmit(values); }
  return <ScrollView contentContainerStyle={styles.content}><Text style={styles.helper}>Record what was serviced and who handled it.</Text>{fields.map(([field, label, placeholder]) => <View key={field} style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={String(values[field] || '')} onChangeText={(value) => update(field, value)} placeholder={placeholder} placeholderTextColor="#94a3b8" keyboardType={field === 'cost' ? 'decimal-pad' : 'default'} style={styles.input} /></View>)}<View style={styles.field}><Text style={styles.label}>Description</Text><TextInput multiline value={values.description || ''} onChangeText={(value) => update('description', value)} placeholder="What was done?" placeholderTextColor="#94a3b8" style={[styles.input, styles.notes]} /></View>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>{submitLabel}</Text></Pressable></ScrollView>;
}

const styles = StyleSheet.create({ content: { padding: 24, paddingBottom: 48 }, helper: { color: '#64748b', lineHeight: 21, marginBottom: 22 }, field: { marginBottom: 16 }, label: { color: '#334155', fontSize: 14, fontWeight: '600', marginBottom: 7 }, input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, color: '#0f172a', fontSize: 16, padding: 13 }, notes: { minHeight: 100, textAlignVertical: 'top' }, error: { color: '#b91c1c', marginBottom: 14 }, button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 15 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' } });


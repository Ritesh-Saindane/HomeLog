import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const fields = [
  ['name', 'Asset name', 'e.g. Bedroom AC'],
  ['category', 'Category', 'e.g. Air conditioner'],
  ['brand', 'Brand', 'e.g. Samsung'],
  ['modelNumber', 'Model number', 'Optional'],
  ['serialNumber', 'Serial number', 'Optional'],
  ['location', 'Location', 'e.g. Kitchen'],
  ['warrantyEndDate', 'Warranty end date', 'YYYY-MM-DD'],
];

export function AssetForm({ initialValues = {}, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function submit() {
    if (!values.name?.trim() || !values.category?.trim()) {
      setError('Asset name and category are required.');
      return;
    }
    setError('');
    onSubmit(values);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.helper}>Keep the basics here. Service history and reminders will be added in later phases.</Text>
      {fields.map(([field, label, placeholder]) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput value={values[field] || ''} onChangeText={(value) => updateField(field, value)} placeholder={placeholder} placeholderTextColor="#94a3b8" style={styles.input} />
        </View>
      ))}
      <View style={styles.field}><Text style={styles.label}>Notes</Text><TextInput multiline value={values.notes || ''} onChangeText={(value) => updateField('notes', value)} placeholder="Anything useful to remember" placeholderTextColor="#94a3b8" style={[styles.input, styles.notes]} /></View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>{submitLabel}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  helper: { color: '#64748b', fontSize: 14, lineHeight: 21, marginBottom: 22 },
  field: { marginBottom: 16 },
  label: { color: '#334155', fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, color: '#0f172a', fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: '#b91c1c', marginBottom: 14 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, marginTop: 4, padding: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});


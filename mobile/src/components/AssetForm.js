import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const fields = [
  ['name', 'Asset name', 'e.g. Bedroom AC'],
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

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Photo library permission is required to add an asset photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled) updateField('photoUrl', result.assets[0].uri);
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.helper}>Add a photo, room, warranty, and the details you want to find quickly later.</Text>
      <Text style={styles.label}>Category</Text>
      <View style={styles.picker}><Picker selectedValue={values.category || ''} onValueChange={(value) => updateField('category', value)}><Picker.Item label="Select category" value="" /><Picker.Item label="Air conditioner" value="Air conditioner" /><Picker.Item label="Refrigerator" value="Refrigerator" /><Picker.Item label="Washing machine" value="Washing machine" /><Picker.Item label="Water purifier" value="Water purifier" /><Picker.Item label="Geyser" value="Geyser" /><Picker.Item label="Laptop" value="Laptop" /><Picker.Item label="Other" value="Other" /></Picker></View>
      {fields.map(([field, label, placeholder]) => (
        <View key={field} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput value={values[field] || ''} onChangeText={(value) => updateField(field, value)} placeholder={placeholder} placeholderTextColor="#94a3b8" style={styles.input} />
        </View>
      ))}
      <Text style={styles.label}>Room / location</Text>
      <View style={styles.picker}><Picker selectedValue={values.location || ''} onValueChange={(value) => updateField('location', value)}><Picker.Item label="Select room" value="" /><Picker.Item label="Living room" value="Living room" /><Picker.Item label="Kitchen" value="Kitchen" /><Picker.Item label="Bedroom" value="Bedroom" /><Picker.Item label="Bathroom" value="Bathroom" /><Picker.Item label="Study room" value="Study room" /><Picker.Item label="Balcony" value="Balcony" /><Picker.Item label="Other" value="Other" /></Picker></View>
      <View style={styles.photoRow}>{values.photoUrl ? <Image source={{ uri: values.photoUrl }} style={styles.photo} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoPlaceholderText}>No photo</Text></View>}<Pressable onPress={choosePhoto} style={styles.photoButton}><Text style={styles.photoButtonText}>{values.photoUrl ? 'Change photo' : 'Add photo'}</Text></Pressable></View>
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
  picker: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  photoRow: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 18 },
  photo: { borderRadius: 14, height: 76, width: 76 },
  photoPlaceholder: { alignItems: 'center', backgroundColor: '#e2e8f0', borderRadius: 14, height: 76, justifyContent: 'center', width: 76 },
  photoPlaceholderText: { color: '#64748b', fontSize: 12 },
  photoButton: { borderColor: '#2563eb', borderRadius: 10, borderWidth: 1, padding: 12 },
  photoButtonText: { color: '#2563eb', fontWeight: '700' },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: '#b91c1c', marginBottom: 14 },
  button: { backgroundColor: '#2563eb', borderRadius: 12, marginTop: 4, padding: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});


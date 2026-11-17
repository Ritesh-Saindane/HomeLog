import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { DateField } from './DateField';
import { useTheme } from '../context/ThemeContext';

const fields = [
  ['name', 'Asset name', 'e.g. Bedroom AC'],
  ['brand', 'Brand', 'e.g. Samsung'],
  ['modelNumber', 'Model number', 'Optional'],
  ['serialNumber', 'Serial number', 'Optional'],
  ['location', 'Location', 'e.g. Kitchen'],
];

export function AssetForm({ initialValues = {}, submitLabel, onSubmit }) {
  const { colors } = useTheme();
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
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Photo library permission is required to add an asset photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
      if (!result.canceled) updateField('photoUrl', result.assets[0].uri);
    } catch {
      setError('Unable to open the photo library. Please try again.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets>
      <Text style={[styles.helper, { color: colors.muted }]}>Add a photo, room, warranty, and the details you want to find quickly later.</Text>
      <Text style={[styles.label, { color: colors.text }]}>Category</Text>
      <View style={[styles.picker, { backgroundColor: colors.input, borderColor: colors.border }]}><Picker selectedValue={values.category || ''} onValueChange={(value) => updateField('category', value)} style={{ color: colors.text }} dropdownIconColor={colors.text}><Picker.Item label="Select category" value="" color={colors.muted} /><Picker.Item label="Air conditioner" value="Air conditioner" color={colors.text} /><Picker.Item label="Refrigerator" value="Refrigerator" color={colors.text} /><Picker.Item label="Washing machine" value="Washing machine" color={colors.text} /><Picker.Item label="Water purifier" value="Water purifier" color={colors.text} /><Picker.Item label="Geyser" value="Geyser" color={colors.text} /><Picker.Item label="Laptop" value="Laptop" color={colors.text} /><Picker.Item label="Other" value="Other" color={colors.text} /></Picker></View>
      {fields.map(([field, label, placeholder]) => (
        <View key={field} style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <TextInput value={values[field] || ''} onChangeText={(value) => updateField(field, value)} placeholder={placeholder} placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} />
        </View>
      ))}
      <DateField label="Warranty end date" value={values.warrantyEndDate} onChange={(value) => updateField('warrantyEndDate', value)} />
      <Text style={[styles.label, { color: colors.text }]}>Room / location</Text>
      <View style={[styles.picker, { backgroundColor: colors.input, borderColor: colors.border }]}><Picker selectedValue={values.location || ''} onValueChange={(value) => updateField('location', value)} style={{ color: colors.text }} dropdownIconColor={colors.text}><Picker.Item label="Select room" value="" color={colors.muted} /><Picker.Item label="Living room" value="Living room" color={colors.text} /><Picker.Item label="Kitchen" value="Kitchen" color={colors.text} /><Picker.Item label="Bedroom" value="Bedroom" color={colors.text} /><Picker.Item label="Bathroom" value="Bathroom" color={colors.text} /><Picker.Item label="Study room" value="Study room" color={colors.text} /><Picker.Item label="Balcony" value="Balcony" color={colors.text} /><Picker.Item label="Other" value="Other" color={colors.text} /></Picker></View>
      <View style={styles.photoRow}>{values.photoUrl ? <Image source={{ uri: values.photoUrl }} style={styles.photo} /> : <View style={[styles.photoPlaceholder, { backgroundColor: colors.input }]}><Text style={[styles.photoPlaceholderText, { color: colors.muted }]}>No photo</Text></View>}<Pressable onPress={choosePhoto} style={[styles.photoButton, { borderColor: colors.accent }]}><Text style={[styles.photoButtonText, { color: colors.accent }]}>{values.photoUrl ? 'Change photo' : 'Add photo'}</Text></Pressable></View>
      <View style={styles.field}><Text style={[styles.label, { color: colors.text }]}>Notes</Text><TextInput multiline value={values.notes || ''} onChangeText={(value) => updateField('notes', value)} placeholder="Anything useful to remember" placeholderTextColor={colors.muted} style={[styles.input, styles.notes, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]} /></View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={submit} style={[styles.button, { backgroundColor: colors.accent }]}><Text style={styles.buttonText}>{submitLabel}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 48 },
  helper: { fontSize: 14, lineHeight: 21, marginBottom: 22 },
  field: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 7 },
  input: { borderRadius: 12, borderWidth: 1, fontSize: 16, paddingHorizontal: 14, paddingVertical: 13 },
  picker: { borderRadius: 12, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
  photoRow: { alignItems: 'center', flexDirection: 'row', gap: 14, marginBottom: 18 },
  photo: { borderRadius: 14, height: 76, width: 76 },
  photoPlaceholder: { alignItems: 'center', borderRadius: 14, height: 76, justifyContent: 'center', width: 76 },
  photoPlaceholderText: { fontSize: 12 },
  photoButton: { borderRadius: 10, borderWidth: 1, padding: 12 },
  photoButtonText: { fontWeight: '700' },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  error: { color: '#ef746a', marginBottom: 14 },
  button: { borderRadius: 12, marginTop: 4, padding: 15 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
});


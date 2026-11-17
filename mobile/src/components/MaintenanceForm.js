import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { DateField } from './DateField';
import { TimeField } from './TimeField';
import { useTheme } from '../context/ThemeContext';

export function MaintenanceForm({ initialValues = {}, submitLabel, onSubmit }) {
  const { colors } = useTheme();
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState('');
  function update(field, value) { setValues((current) => ({ ...current, [field]: value })); }
  function submit() { if (!values.title?.trim() || !values.nextDueDate?.trim()) return setError('Title and next due date are required.'); setError(''); onSubmit({ reminderTime: '09:00', ...values }); }
  const inputStyle = { backgroundColor: colors.input, borderColor: colors.border, color: colors.text };
  return <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" automaticallyAdjustKeyboardInsets><Text style={[styles.helper, { color: colors.muted }]}>Choose when HomeLog should remind you on this device.</Text><Text style={[styles.label, { color: colors.text }]}>Title</Text><TextInput value={values.title || ''} onChangeText={(value) => update('title', value)} placeholder="e.g. Water purifier filter" placeholderTextColor={colors.muted} style={[styles.input, inputStyle]} /><DateField label="Next due date" value={values.nextDueDate} onChange={(value) => update('nextDueDate', value)} /><TimeField label="Reminder time" value={values.reminderTime || '09:00'} onChange={(value) => update('reminderTime', value)} /><Text style={[styles.label, { color: colors.text }]}>Days before reminder</Text><TextInput value={String(values.reminderDaysBefore ?? 7)} onChangeText={(value) => update('reminderDaysBefore', value)} keyboardType="number-pad" placeholder="7" placeholderTextColor={colors.muted} style={[styles.input, inputStyle]} /><Text style={[styles.label, { color: colors.text }]}>Repeat every (months, optional)</Text><TextInput value={String(values.repeatEveryMonths || '')} onChangeText={(value) => update('repeatEveryMonths', value)} keyboardType="number-pad" placeholder="Leave blank for one-time" placeholderTextColor={colors.muted} style={[styles.input, inputStyle]} /><Text style={[styles.label, { color: colors.text }]}>Description</Text><TextInput multiline value={values.description || ''} onChangeText={(value) => update('description', value)} placeholder="Optional details" placeholderTextColor={colors.muted} style={[styles.input, styles.notes, inputStyle]} />{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable onPress={submit} style={[styles.button, { backgroundColor: colors.accent }]}><Text style={styles.buttonText}>{submitLabel}</Text></Pressable></ScrollView>;
}

const styles = StyleSheet.create({ content: { padding: 24, paddingBottom: 72 }, label: { fontSize: 14, fontWeight: '600', marginBottom: 7 }, helper: { fontSize: 14, lineHeight: 21, marginBottom: 22 }, input: { borderRadius: 12, borderWidth: 1, fontSize: 16, marginBottom: 16, padding: 13 }, notes: { minHeight: 90, textAlignVertical: 'top' }, error: { color: '#ef746a', marginBottom: 14 }, button: { borderRadius: 12, padding: 15 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' } });

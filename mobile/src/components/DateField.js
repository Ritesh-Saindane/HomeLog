import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function parseDate(value) {
  if (!value) return new Date();
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateField({ label, value, onChange, placeholder = 'Choose a date' }) {
  const [visible, setVisible] = useState(false);
  const { colors } = useTheme();
  return <View style={styles.field}><Text style={[styles.label, { color: colors.text }]}>{label}</Text><Pressable onPress={() => setVisible(true)} style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}><Text style={[styles.value, { color: value ? colors.text : colors.muted }]}>{value || placeholder}</Text><Text style={[styles.icon, { color: colors.accent }]}>▦</Text></Pressable>{visible ? <DateTimePicker value={parseDate(value)} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_event, selected) => { setVisible(Platform.OS === 'ios'); if (selected) onChange(formatLocalDate(selected)); }} /> : null}{Platform.OS === 'ios' && visible ? <Pressable onPress={() => setVisible(false)}><Text style={[styles.done, { color: colors.accent }]}>Done</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({ field: { marginBottom: 16 }, label: { fontSize: 14, fontWeight: '600', marginBottom: 7 }, input: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 14 }, value: { fontSize: 16 }, icon: { fontSize: 18 }, done: { fontWeight: '700', padding: 12, textAlign: 'right' } });


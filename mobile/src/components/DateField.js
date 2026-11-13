import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><Pressable onPress={() => setVisible(true)} style={styles.input}><Text style={value ? styles.value : styles.placeholder}>{value || placeholder}</Text><Text style={styles.icon}>▦</Text></Pressable>{visible ? <DateTimePicker value={parseDate(value)} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_event, selected) => { setVisible(Platform.OS === 'ios'); if (selected) onChange(formatLocalDate(selected)); }} /> : null}{Platform.OS === 'ios' && visible ? <Pressable onPress={() => setVisible(false)}><Text style={styles.done}>Done</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({ field: { marginBottom: 16 }, label: { color: '#334155', fontSize: 14, fontWeight: '600', marginBottom: 7 }, input: { alignItems: 'center', backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 14 }, value: { color: '#0f172a', fontSize: 16 }, placeholder: { color: '#94a3b8', fontSize: 16 }, icon: { color: '#2563eb', fontSize: 18 }, done: { color: '#2563eb', fontWeight: '700', padding: 12, textAlign: 'right' } });


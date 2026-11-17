import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

function parseTime(value) {
  const [hours, minutes] = String(value || '09:00').split(':').map(Number);
  const date = new Date();
  date.setHours(Number.isFinite(hours) ? hours : 9, Number.isFinite(minutes) ? minutes : 0, 0, 0);
  return date;
}

function formatTime(date) { return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`; }

export function TimeField({ label, value, onChange }) {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  return <View style={styles.field}><Text style={[styles.label, { color: colors.text }]}>{label}</Text><Pressable onPress={() => setVisible(true)} style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border }]}><Text style={[styles.value, { color: colors.text }]}>{value || '09:00'}</Text><Text style={[styles.icon, { color: colors.accent }]}>◷</Text></Pressable>{visible ? <DateTimePicker value={parseTime(value)} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(_event, selected) => { setVisible(Platform.OS === 'ios'); if (selected) onChange(formatTime(selected)); }} /> : null}{Platform.OS === 'ios' && visible ? <Pressable onPress={() => setVisible(false)}><Text style={[styles.done, { color: colors.accent }]}>Done</Text></Pressable> : null}</View>;
}

const styles = StyleSheet.create({ field: { marginBottom: 16 }, label: { fontSize: 14, fontWeight: '600', marginBottom: 7 }, input: { alignItems: 'center', borderRadius: 12, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 14 }, value: { fontSize: 16 }, icon: { fontSize: 18 }, done: { fontWeight: '700', padding: 12, textAlign: 'right' } });

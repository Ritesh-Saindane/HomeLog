import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const TODO_KEY = '@homelog/home_todos';

export function TodoPanel({ schedules, assets, showAll = false }) {
  const { colors } = useTheme();
  const [todos, setTodos] = useState([]);
  const [draft, setDraft] = useState('');
  useEffect(() => { AsyncStorage.getItem(TODO_KEY).then((value) => { if (value) setTodos(JSON.parse(value)); }).catch(() => {}); }, []);
  async function save(next) { setTodos(next); await AsyncStorage.setItem(TODO_KEY, JSON.stringify(next)); }
  async function add() { if (!draft.trim()) return; await save([{ id: String(Date.now()), title: draft.trim(), done: false }, ...todos]); setDraft(''); }
  async function toggle(id) { await save(todos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)); }
  const due = schedules.filter((schedule) => schedule.isActive).slice(0, showAll ? undefined : 3);
  return <View style={[styles.card, { backgroundColor: colors.card }]}><View style={styles.header}><Text style={[styles.title, { color: colors.text }]}>{showAll ? 'Maintenance and tasks' : 'Today at home'}</Text><Text style={[styles.count, { color: colors.accent, backgroundColor: colors.input }]}>{due.length + todos.filter((todo) => !todo.done).length}</Text></View>{due.map((schedule) => { const asset = assets.find((item) => item.id === schedule.assetId); return <Pressable key={schedule.id} onPress={() => router.push(`/assets/${schedule.assetId}`)} style={[styles.row, { borderTopColor: colors.border }]}><Text style={[styles.dueIcon, { color: colors.accent }]}>◷</Text><View style={styles.body}><Text style={[styles.task, { color: colors.text }]}>{schedule.title}</Text><Text style={[styles.meta, { color: colors.muted }]}>{asset?.name || 'Your asset'} · due {String(schedule.nextDueDate).slice(0, 10)}</Text></View><Text style={[styles.meta, { color: colors.muted }]}>›</Text></Pressable>; })}{todos.slice(0, showAll ? undefined : 4).map((todo) => <Pressable key={todo.id} onPress={() => toggle(todo.id)} style={[styles.row, { borderTopColor: colors.border }]}><Text style={[styles.check, todo.done && styles.checked]}>{todo.done ? '✓' : '○'}</Text><Text style={[styles.task, styles.flex, { color: colors.text }, todo.done && styles.done]}>{todo.title}</Text></Pressable>)}<View style={styles.addRow}><TextInput value={draft} onChangeText={setDraft} placeholder="Add a small home task" placeholderTextColor={colors.muted} style={[styles.input, { backgroundColor: colors.input, color: colors.text }]} onSubmitEditing={add} returnKeyType="done"/><Pressable onPress={add} style={[styles.add, { backgroundColor: colors.accent }]}><Text style={styles.addText}>＋</Text></Pressable></View>{due.length === 0 && todos.length === 0 ? <Text style={[styles.meta, { color: colors.muted }]}>No tasks due. Your home is caught up.</Text> : null}</View>;
}

const styles = StyleSheet.create({ card: { borderRadius: 20, marginTop: 18, padding: 18 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, title: { fontSize: 19, fontWeight: '800' }, count: { borderRadius: 12, fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4 }, row: { alignItems: 'center', borderTopWidth: 1, flexDirection: 'row', gap: 12, paddingVertical: 12 }, dueIcon: { fontSize: 23, width: 24 }, body: { flex: 1 }, task: { fontSize: 14, fontWeight: '700' }, meta: { fontSize: 12, marginTop: 4 }, flex: { flex: 1 }, check: { color: '#8da0aa', fontSize: 20 }, checked: { color: '#4cc68a' }, done: { color: '#829097', textDecorationLine: 'line-through' }, addRow: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 8 }, input: { borderRadius: 11, flex: 1, paddingHorizontal: 12, paddingVertical: 11 }, add: { alignItems: 'center', borderRadius: 11, height: 42, justifyContent: 'center', width: 42 }, addText: { color: '#fff', fontSize: 22 } });


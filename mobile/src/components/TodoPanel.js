import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const TODO_KEY = '@homelog/home_todos';

export function TodoPanel({ schedules, assets, showAll = false }) {
  const [todos, setTodos] = useState([]);
  const [draft, setDraft] = useState('');
  useEffect(() => { AsyncStorage.getItem(TODO_KEY).then((value) => { if (value) setTodos(JSON.parse(value)); }).catch(() => {}); }, []);
  async function save(next) { setTodos(next); await AsyncStorage.setItem(TODO_KEY, JSON.stringify(next)); }
  async function add() { if (!draft.trim()) return; await save([{ id: String(Date.now()), title: draft.trim(), done: false }, ...todos]); setDraft(''); }
  async function toggle(id) { await save(todos.map((todo) => todo.id === id ? { ...todo, done: !todo.done } : todo)); }
  const due = schedules.filter((schedule) => schedule.isActive).slice(0, showAll ? undefined : 3);
  return <View style={styles.card}><View style={styles.header}><Text style={styles.title}>{showAll ? 'Maintenance and tasks' : 'Today at home'}</Text><Text style={styles.count}>{due.length + todos.filter((todo) => !todo.done).length}</Text></View>{due.map((schedule) => { const asset = assets.find((item) => item.id === schedule.assetId); return <Pressable key={schedule.id} onPress={() => router.push(`/assets/${schedule.assetId}`)} style={styles.row}><Text style={styles.dueIcon}>◷</Text><View style={styles.body}><Text style={styles.task}>{schedule.title}</Text><Text style={styles.meta}>{asset?.name || 'Your asset'} · due {String(schedule.nextDueDate).slice(0, 10)}</Text></View><Text style={styles.meta}>›</Text></Pressable>; })}{todos.slice(0, showAll ? undefined : 4).map((todo) => <Pressable key={todo.id} onPress={() => toggle(todo.id)} style={styles.row}><Text style={[styles.check, todo.done && styles.checked]}>{todo.done ? '✓' : '○'}</Text><Text style={[styles.task, styles.flex, todo.done && styles.done]}>{todo.title}</Text></Pressable>)}<View style={styles.addRow}><TextInput value={draft} onChangeText={setDraft} placeholder="Add a small home task" placeholderTextColor="#94a3b8" style={styles.input} onSubmitEditing={add} returnKeyType="done"/><Pressable onPress={add} style={styles.add}><Text style={styles.addText}>＋</Text></Pressable></View>{due.length === 0 && todos.length === 0 ? <Text style={styles.meta}>No tasks due. Your home is caught up.</Text> : null}</View>;
}

const styles = StyleSheet.create({ card: { backgroundColor: '#fff', borderRadius: 20, marginTop: 18, padding: 18 }, header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }, title: { color: '#132638', fontSize: 19, fontWeight: '800' }, count: { backgroundColor: '#e8f5f5', borderRadius: 12, color: '#198f96', fontWeight: '800', overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 4 }, row: { alignItems: 'center', borderTopColor: '#f0f2f2', borderTopWidth: 1, flexDirection: 'row', gap: 12, paddingVertical: 12 }, dueIcon: { color: '#17969d', fontSize: 23, width: 24 }, body: { flex: 1 }, task: { color: '#203346', fontSize: 14, fontWeight: '700' }, meta: { color: '#87959e', fontSize: 12, marginTop: 4 }, flex: { flex: 1 }, check: { color: '#8da0aa', fontSize: 20 }, checked: { color: '#21a37a' }, done: { color: '#98a5aa', textDecorationLine: 'line-through' }, addRow: { alignItems: 'center', flexDirection: 'row', gap: 8, marginTop: 8 }, input: { backgroundColor: '#f6f8f8', borderRadius: 11, color: '#203346', flex: 1, paddingHorizontal: 12, paddingVertical: 11 }, add: { alignItems: 'center', backgroundColor: '#318bd8', borderRadius: 11, height: 42, justifyContent: 'center', width: 42 }, addText: { color: '#fff', fontSize: 22 } });


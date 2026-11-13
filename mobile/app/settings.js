import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { useAuth } from '../src/context/AuthContext';
import { useTheme } from '../src/context/ThemeContext';

export default function SettingsScreen() {
  const { user, updateName, logout } = useAuth();
  const { darkMode, colors, toggleDarkMode } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [message, setMessage] = useState('');
  async function saveName() { try { await updateName(name.trim()); setMessage('Name updated.'); } catch { setMessage('Could not update your name. Check the backend connection.'); } }
  async function signOut() { await logout(); router.replace('/login'); }
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><View style={styles.content}><Text style={[styles.kicker, { color: colors.accent }]}>PREFERENCES</Text><Text style={[styles.title, { color: colors.text }]}>Settings</Text><View style={[styles.card, { backgroundColor: colors.card }]}><Text style={[styles.label, { color: colors.text }]}>Your name</Text><TextInput value={name} onChangeText={setName} style={[styles.input, { backgroundColor: colors.input, color: colors.text }]} placeholder="Name" placeholderTextColor={colors.muted} /><Pressable onPress={saveName} style={[styles.button, { backgroundColor: colors.accent }]}><Text style={styles.buttonText}>Save name</Text></Pressable>{message ? <Text style={[styles.message, { color: colors.muted }]}>{message}</Text> : null}</View><View style={[styles.card, styles.toggleCard, { backgroundColor: colors.card }]}><View style={{ flex: 1 }}><Text style={[styles.label, { color: colors.text }]}>Dark mode</Text><Text style={[styles.hint, { color: colors.muted }]}>Use a darker HomeLog appearance</Text></View><Switch value={darkMode} onValueChange={toggleDarkMode} trackColor={{ true: colors.accent }} /></View><Pressable onPress={signOut} style={styles.signout}><Text style={styles.signoutText}>Sign out</Text></Pressable></View><BottomNav /></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, content: { flex: 1, padding: 24, paddingTop: 65 }, kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.6 }, title: { fontSize: 30, fontWeight: '800', marginTop: 8 }, card: { borderRadius: 18, marginTop: 22, padding: 18 }, label: { fontSize: 15, fontWeight: '800' }, input: { borderRadius: 11, marginTop: 12, padding: 13 }, button: { alignItems: 'center', borderRadius: 11, marginTop: 12, padding: 13 }, buttonText: { color: '#fff', fontWeight: '800' }, message: { fontSize: 12, marginTop: 10 }, toggleCard: { alignItems: 'center', flexDirection: 'row' }, hint: { fontSize: 12, marginTop: 4 }, signout: { alignItems: 'center', borderColor: '#df8b83', borderRadius: 12, borderWidth: 1, marginTop: 18, padding: 14 }, signoutText: { color: '#b65046', fontWeight: '800' } });

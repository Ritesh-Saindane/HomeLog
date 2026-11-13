import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const items = [{ label: 'Home', icon: '⌂', path: '/home' }, { label: 'Scan', icon: '▦', path: '/scan' }, { label: 'Analytics', icon: '▥', path: '/timeline' }, { label: 'To-dos', icon: '☷', path: '/todos' }, { label: 'Settings', icon: '⚙', path: '/settings' }];
export function BottomNav() {
  const pathname = usePathname();
  const { colors } = useTheme();
  return <View style={[styles.bar, { backgroundColor: colors.card, borderColor: colors.border }]}>{items.map((item) => { const active = pathname === item.path || (item.path === '/home' && pathname === '/'); return <Pressable key={item.path} onPress={() => router.replace(item.path)} style={styles.item}><Text style={[styles.icon, { color: active ? colors.accent : colors.muted }]}>{item.icon}</Text><Text style={[styles.label, { color: active ? colors.accent : colors.muted }]}>{item.label}</Text></Pressable>; })}</View>;
}
const styles = StyleSheet.create({ bar: { borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 14, paddingTop: 9 }, item: { alignItems: 'center', flex: 1 }, icon: { fontSize: 21, fontWeight: '700' }, label: { fontSize: 10, fontWeight: '700', marginTop: 3 } });

import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const items = [{ label: 'Home', icon: '⌂', path: '/home' }, { label: 'Analytics', icon: '▥', path: '/timeline' }, { label: 'Scan', icon: 'qr', path: '/scan' }, { label: 'To-dos', icon: '☷', path: '/todos' }, { label: 'Settings', icon: '⚙', path: '/settings' }];
export function BottomNav() {
  const pathname = usePathname();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return <View style={[styles.bar, { backgroundColor: colors.card, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, 8) }]}>{items.map((item) => { const active = pathname === item.path || (item.path === '/home' && pathname === '/'); const isScan = item.path === '/scan'; return <Pressable key={item.path} onPress={() => router.replace(item.path)} style={styles.item}>{isScan ? <View style={[styles.scanButton, { backgroundColor: colors.accent }]}><View style={styles.qr}>{[0, 1, 2, 3].map((square) => <View key={square} style={styles.qrSquare} />)}</View></View> : <Text style={[styles.icon, { color: active ? colors.accent : colors.muted }]}>{item.icon}</Text>}<Text style={[styles.label, { color: active ? colors.accent : colors.muted }]}>{item.label}</Text></Pressable>; })}</View>;
}
const styles = StyleSheet.create({ bar: { borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-around', paddingTop: 9 }, item: { alignItems: 'center', flex: 1, justifyContent: 'center' }, icon: { fontSize: 21, fontWeight: '700', height: 27 }, label: { fontSize: 10, fontWeight: '700', marginTop: 3 }, scanButton: { alignItems: 'center', borderRadius: 25, height: 48, justifyContent: 'center', marginTop: -24, width: 48 }, qr: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, height: 24, width: 24 }, qrSquare: { backgroundColor: '#fff', borderRadius: 1, height: 10, width: 10 } });

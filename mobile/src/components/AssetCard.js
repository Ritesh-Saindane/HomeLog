import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function AssetCard({ asset, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.card }, pressed && styles.pressed]}>
      {asset.photoUrl ? <Image source={{ uri: asset.photoUrl }} style={styles.photo} /> : <View style={[styles.icon, { backgroundColor: colors.input }]}><Text style={[styles.iconText, { color: colors.accent }]}>{asset.category.slice(0, 1).toUpperCase()}</Text></View>}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{asset.name}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>{asset.brand || 'Brand not added'} · {asset.location || 'Location not added'}</Text>
        <View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>{asset.status === 'ACTIVE' ? 'Active' : asset.status}</Text></View>
      </View>
      <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', borderRadius: 16, flexDirection: 'row', marginBottom: 12, padding: 14 },
  pressed: { opacity: 0.75 },
  icon: { alignItems: 'center', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  photo: { borderRadius: 14, height: 48, width: 48 },
  iconText: { fontSize: 20, fontWeight: '800' },
  content: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 13, marginTop: 4 },
  status: { alignItems: 'center', flexDirection: 'row', marginTop: 7 },
  dot: { backgroundColor: '#16a34a', borderRadius: 4, height: 7, marginRight: 6, width: 7 },
  statusText: { color: '#15803d', fontSize: 12, fontWeight: '600' },
  chevron: { fontSize: 28, marginLeft: 8 },
});


import { Pressable, StyleSheet, Text, View } from 'react-native';

export function AssetCard({ asset, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}><Text style={styles.iconText}>{asset.category.slice(0, 1).toUpperCase()}</Text></View>
      <View style={styles.content}>
        <Text style={styles.name}>{asset.name}</Text>
        <Text style={styles.meta}>{asset.brand || 'Brand not added'} · {asset.location || 'Location not added'}</Text>
        <View style={styles.status}><View style={styles.dot} /><Text style={styles.statusText}>{asset.status === 'ACTIVE' ? 'Active' : asset.status}</Text></View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, flexDirection: 'row', marginBottom: 12, padding: 14 },
  pressed: { opacity: 0.75 },
  icon: { alignItems: 'center', backgroundColor: '#dbeafe', borderRadius: 14, height: 48, justifyContent: 'center', width: 48 },
  iconText: { color: '#2563eb', fontSize: 20, fontWeight: '800' },
  content: { flex: 1, marginLeft: 12 },
  name: { color: '#0f172a', fontSize: 16, fontWeight: '700' },
  meta: { color: '#64748b', fontSize: 13, marginTop: 4 },
  status: { alignItems: 'center', flexDirection: 'row', marginTop: 7 },
  dot: { backgroundColor: '#16a34a', borderRadius: 4, height: 7, marginRight: 6, width: 7 },
  statusText: { color: '#15803d', fontSize: 12, fontWeight: '600' },
  chevron: { color: '#94a3b8', fontSize: 28, marginLeft: 8 },
});


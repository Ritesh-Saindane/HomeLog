import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../src/services/api';

export default function PublicAssetScreen() {
  const { qrCodeId } = useLocalSearchParams();
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get(`/public/assets/qr/${encodeURIComponent(qrCodeId)}`).then((response) => setAsset(response.data)).catch(() => setError('This QR code is not linked to a public HomeLog asset.')); }, [qrCodeId]);
  if (!asset && !error) return <View style={styles.center}><ActivityIndicator color="#2563eb" size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><Pressable onPress={() => router.back()}><Text style={styles.link}>Go back</Text></Pressable></View>;
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}><Text style={styles.kicker}>HOMELOG · READ ONLY</Text>{asset.photoUrl ? <Image source={{ uri: asset.photoUrl }} style={styles.photo} /> : null}<Text style={styles.title}>{asset.name}</Text><Text style={styles.subtitle}>{asset.category} · {asset.location || 'Location not shared'}</Text><View style={styles.card}><Text style={styles.sectionTitle}>Recent service history</Text>{asset.serviceRecords.length ? asset.serviceRecords.map((record) => <View key={`${record.serviceDate}-${record.title}`} style={styles.record}><Text style={styles.recordTitle}>{record.title}</Text><Text style={styles.date}>{String(record.serviceDate).slice(0, 10)} · {record.serviceType}</Text>{record.replacedComponents ? <Text style={styles.replaced}>Replaced: {record.replacedComponents}</Text> : null}<Text style={styles.description}>{record.description || 'No description added.'}</Text></View>) : <Text style={styles.description}>No service history shared yet.</Text>}</View><Text style={styles.notice}>This is a read-only view. Sign in as the owner to manage this asset.</Text></ScrollView>;
}

const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1 }, content: { padding: 24, paddingTop: 64, paddingBottom: 48 }, center: { alignItems: 'center', backgroundColor: '#eff6ff', flex: 1, justifyContent: 'center', padding: 24 }, kicker: { color: '#2563eb', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 }, photo: { borderRadius: 18, height: 220, marginTop: 24, width: '100%' }, title: { color: '#0f172a', fontSize: 30, fontWeight: '800', marginTop: 24 }, subtitle: { color: '#64748b', fontSize: 16, marginTop: 6 }, card: { backgroundColor: '#fff', borderRadius: 18, marginTop: 28, padding: 18 }, sectionTitle: { color: '#0f172a', fontSize: 18, fontWeight: '700', marginBottom: 14 }, record: { borderTopColor: '#e2e8f0', borderTopWidth: 1, paddingVertical: 14 }, recordTitle: { color: '#0f172a', fontWeight: '700' }, date: { color: '#2563eb', fontSize: 12, marginTop: 5 }, replaced: { color: '#334155', fontSize: 13, marginTop: 7 }, description: { color: '#64748b', lineHeight: 20, marginTop: 7 }, notice: { color: '#64748b', fontSize: 13, lineHeight: 20, marginTop: 18, textAlign: 'center' }, error: { color: '#b91c1c', textAlign: 'center' }, link: { color: '#2563eb', fontWeight: '700', marginTop: 18 } });


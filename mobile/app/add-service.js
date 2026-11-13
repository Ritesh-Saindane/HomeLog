import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AssetPicker } from '../src/components/AssetPicker';
import { useAssets } from '../src/context/AssetContext';

export default function AddServiceEntry() {
  const { assets } = useAssets();
  const [assetId, setAssetId] = useState('');
  return <View style={styles.container}><Text style={styles.title}>Add service record</Text><Text style={styles.helper}>Select the asset first, then add the service details.</Text><AssetPicker assets={assets} value={assetId} onChange={setAssetId} /><Pressable disabled={!assetId} onPress={() => router.push(`/assets/${assetId}/services/new`)} style={[styles.button, !assetId && styles.disabled]}><Text style={styles.buttonText}>Continue</Text></Pressable></View>;
}
const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, padding: 24, paddingTop: 70 }, title: { color: '#0f172a', fontSize: 30, fontWeight: '800' }, helper: { color: '#64748b', lineHeight: 21, marginBottom: 24, marginTop: 8 }, button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 15 }, disabled: { opacity: 0.45 }, buttonText: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' } });


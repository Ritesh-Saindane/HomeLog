import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AssetForm } from '../../../src/components/AssetForm';
import { useAssets } from '../../../src/context/AssetContext';

export default function EditAssetScreen() {
  const { id } = useLocalSearchParams();
  const { assets, updateAsset } = useAssets();
  const asset = assets.find((item) => item.id === id);
  if (!asset) return <View style={styles.container}><Text style={styles.title}>Asset not found</Text></View>;
  async function handleSubmit(values) {
    await updateAsset(asset.id, values);
    router.replace(`/assets/${asset.id}`);
  }
  return <View style={styles.container}><Text style={styles.title}>Edit asset</Text><AssetForm initialValues={asset} submitLabel="Save changes" onSubmit={handleSubmit} /></View>;
}

const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, paddingTop: 64 }, title: { color: '#0f172a', fontSize: 30, fontWeight: '800', paddingHorizontal: 24, marginBottom: 6 } });


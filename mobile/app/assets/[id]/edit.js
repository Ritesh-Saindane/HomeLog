import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AssetForm } from '../../../src/components/AssetForm';
import { useAssets } from '../../../src/context/AssetContext';
import { useTheme } from '../../../src/context/ThemeContext';

export default function EditAssetScreen() {
  const { id } = useLocalSearchParams();
  const { assets, updateAsset } = useAssets();
  const { colors } = useTheme();
  const asset = assets.find((item) => item.id === id);
  if (!asset) return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.text }]}>Asset not found</Text></View>;
  async function handleSubmit(values) {
    await updateAsset(asset.id, values);
    router.replace(`/assets/${asset.id}`);
  }
  return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.text }]}>Edit asset</Text><AssetForm initialValues={asset} submitLabel="Save changes" onSubmit={handleSubmit} /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, paddingTop: 64 }, title: { fontSize: 30, fontWeight: '800', paddingHorizontal: 24, marginBottom: 6 } });


import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AssetForm } from '../../src/components/AssetForm';
import { useAssets } from '../../src/context/AssetContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function NewAssetScreen() {
  const { addAsset } = useAssets();
  const { colors } = useTheme();
  async function handleSubmit(values) {
    const asset = await addAsset(values);
    router.replace(`/assets/${asset.id}`);
  }
  return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={[styles.title, { color: colors.text }]}>Add an asset</Text><AssetForm submitLabel="Save asset" onSubmit={handleSubmit} /></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, paddingTop: 64 }, title: { fontSize: 30, fontWeight: '800', paddingHorizontal: 24, marginBottom: 6 } });


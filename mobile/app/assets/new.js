import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AssetForm } from '../../src/components/AssetForm';
import { useAssets } from '../../src/context/AssetContext';

export default function NewAssetScreen() {
  const { addAsset } = useAssets();
  async function handleSubmit(values) {
    const asset = await addAsset(values);
    router.replace(`/assets/${asset.id}`);
  }
  return <View style={styles.container}><Text style={styles.title}>Add an asset</Text><AssetForm submitLabel="Save asset" onSubmit={handleSubmit} /></View>;
}

const styles = StyleSheet.create({ container: { backgroundColor: '#eff6ff', flex: 1, paddingTop: 64 }, title: { color: '#0f172a', fontSize: 30, fontWeight: '800', paddingHorizontal: 24, marginBottom: 6 } });


import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Text, View } from 'react-native';

export function AssetPicker({ assets, value, onChange }) {
  return <View><Text style={styles.label}>Select asset</Text><View style={styles.picker}><Picker selectedValue={value} onValueChange={onChange}><Picker.Item label="Choose an asset" value="" />{assets.map((asset) => <Picker.Item key={asset.id} label={`${asset.name} · ${asset.location || 'Other'}`} value={asset.id} />)}</Picker></View></View>;
}

const styles = StyleSheet.create({ label: { color: '#334155', fontSize: 14, fontWeight: '600', marginBottom: 7 }, picker: { backgroundColor: '#fff', borderColor: '#cbd5e1', borderRadius: 12, borderWidth: 1, marginBottom: 20, overflow: 'hidden' } });


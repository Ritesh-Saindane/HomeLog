import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { api } from '../src/services/api';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  if (!permission) return <View style={styles.center}><Text>Checking camera permission…</Text></View>;
  if (!permission.granted) return <View style={styles.center}><Text style={styles.title}>Camera access is needed to scan HomeLog QR codes.</Text><Button title="Allow camera" onPress={requestPermission} /></View>;
  async function handleBarcodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    try {
      try {
        const response = await api.get(`/assets/qr/${encodeURIComponent(data)}`);
        router.replace(`/assets/${response.data.id}`);
      } catch {
        router.replace({ pathname: '/public-asset', params: { qrCodeId: data } });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'This QR code does not match one of your assets.');
      setScanned(false);
    }
  }
  return <View style={styles.container}><CameraView style={StyleSheet.absoluteFillObject} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} /><View style={styles.overlay}><Text style={styles.title}>Scan an asset QR code</Text><View style={styles.frame} />{error ? <Text style={styles.error}>{error}</Text> : null}<Button title="Cancel" onPress={() => router.back()} /></View></View>;
}

const styles = StyleSheet.create({ container: { flex: 1 }, center: { alignItems: 'center', backgroundColor: '#eff6ff', flex: 1, justifyContent: 'center', padding: 24 }, overlay: { alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)', flex: 1, justifyContent: 'center', padding: 24 }, title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 24, textAlign: 'center' }, frame: { borderColor: '#fff', borderRadius: 18, borderWidth: 3, height: 240, marginBottom: 24, width: 240 }, error: { color: '#fecaca', marginBottom: 16, textAlign: 'center' } });


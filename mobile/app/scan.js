import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { api } from '../src/services/api';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  if (!permission) return <View style={styles.center}><Text>Checking camera permission…</Text></View>;
  if (!permission.granted) return <View style={styles.center}><Text style={styles.title}>Camera access is needed to scan HomeLog QR codes.</Text><Button title="Allow camera" onPress={requestPermission} /></View>;
  async function handleBarcodeScanned({ data }) {
    if (scanned) return;
    setScanned(true);
    try {
      try {
        const response = await api.get(`/assets/qr/${encodeURIComponent(data)}`);
        router.push(`/assets/${response.data.id}`);
      } catch {
        router.push({ pathname: '/public-asset', params: { qrCodeId: data } });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'This QR code does not match one of your assets.');
      setScanned(false);
    }
  }
  return <View style={styles.container}><View style={styles.camera}><CameraView style={styles.cameraPreview} facing="back" active={!scanned} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onCameraReady={() => setCameraError('')} onMountError={(event) => setCameraError(event.message || 'The camera preview could not start.')} onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} /><View pointerEvents="box-none" style={styles.overlay}><View style={styles.scrim}><Text style={styles.title}>Scan an asset QR code</Text></View><View style={styles.scanArea}><View style={styles.frame} /></View><View style={styles.scrim}>{cameraError ? <Text style={styles.error}>{cameraError}</Text> : null}{error ? <Text style={styles.error}>{error}</Text> : null}<Button title="Cancel" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} /></View></View></View></View>;
}

const styles = StyleSheet.create({ container: { backgroundColor: '#000', flex: 1 }, camera: { flex: 1, position: 'relative' }, cameraPreview: { flex: 1 }, center: { alignItems: 'center', backgroundColor: '#eff6ff', flex: 1, justifyContent: 'center', padding: 24 }, overlay: { bottom: 0, justifyContent: 'space-between', left: 0, position: 'absolute', right: 0, top: 0 }, scrim: { alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.2)', justifyContent: 'center', minHeight: 150, padding: 24 }, scanArea: { alignItems: 'center', justifyContent: 'center', minHeight: 250 }, title: { color: '#fff', fontSize: 20, fontWeight: '700', textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.7)', textShadowRadius: 5 }, frame: { borderColor: '#fff', borderRadius: 18, borderWidth: 3, height: 240, width: 240 }, error: { color: '#fecaca', marginBottom: 16, textAlign: 'center', textShadowColor: '#000', textShadowRadius: 4 } });


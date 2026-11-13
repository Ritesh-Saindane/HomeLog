import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { AssetProvider } from '../src/context/AssetContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AssetProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </AssetProvider>
    </AuthProvider>
  );
}


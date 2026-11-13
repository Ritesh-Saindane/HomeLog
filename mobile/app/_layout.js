import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { AssetProvider } from '../src/context/AssetContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

function AppStack() {
  const { darkMode } = useTheme();
  return <><StatusBar style={darkMode ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false }} /></>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AssetProvider><ThemeProvider><AppStack /></ThemeProvider></AssetProvider>
    </AuthProvider>
  );
}


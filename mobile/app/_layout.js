import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../src/context/AuthContext';
import { AssetProvider } from '../src/context/AssetContext';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNav } from '../src/components/BottomNav';

export const unstable_settings = { anchor: 'home' };

function AppStack() {
  const { darkMode } = useTheme();
  const pathname = usePathname();
  const showNavigation = !['/login', '/register'].includes(pathname);
  return <View style={{ flex: 1 }}><StatusBar style={darkMode ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false }} />{showNavigation ? <BottomNav /> : null}</View>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AssetProvider><ThemeProvider><SafeAreaProvider><AppStack /></SafeAreaProvider></ThemeProvider></AssetProvider>
    </AuthProvider>
  );
}


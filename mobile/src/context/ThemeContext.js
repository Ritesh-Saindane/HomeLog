import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const KEY = '@homelog/dark_mode';
const ThemeContext = createContext(null);
export const palettes = {
  light: { background: '#f5f7f5', card: '#ffffff', text: '#172c3e', muted: '#829097', accent: '#278e96', border: '#e4ebe8', input: '#f5f7f6' },
  dark: { background: '#101715', card: '#1a2421', text: '#eff5f1', muted: '#a0b0a8', accent: '#60c6b7', border: '#2b3833', input: '#202c28' },
};
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => { AsyncStorage.getItem(KEY).then((value) => setDarkMode(value === 'true')).catch(() => {}); }, []);
  async function toggleDarkMode() { const next = !darkMode; setDarkMode(next); await AsyncStorage.setItem(KEY, String(next)); }
  const value = useMemo(() => ({ darkMode, colors: palettes[darkMode ? 'dark' : 'light'], toggleDarkMode }), [darkMode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
export function useTheme() { const value = useContext(ThemeContext); if (!value) throw new Error('useTheme requires ThemeProvider'); return value; }

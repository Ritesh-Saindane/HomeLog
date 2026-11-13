import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator color="#2563eb" size="large" /></View>;
  }
  return <Redirect href={isAuthenticated ? '/home' : '/login'} />;
}

const styles = StyleSheet.create({
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});


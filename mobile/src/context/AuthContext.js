import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const TOKEN_KEY = '@homelog/auth_token';
const USER_KEY = '@homelog/auth_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
        if (savedUser) setUser(JSON.parse(savedUser));
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function saveSession(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, nextToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser)),
    ]);
  }

  async function login(credentials) {
    const response = await api.post('/auth/login', credentials);
    await saveSession(response.data.token, response.data.user);
  }

  async function register(details) {
    const response = await api.post('/auth/register', details);
    await saveSession(response.data.token, response.data.user);
  }

  async function logout() {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    await Promise.all([AsyncStorage.removeItem(TOKEN_KEY), AsyncStorage.removeItem(USER_KEY)]);
  }

  async function updateName(name) {
    const response = await api.patch('/auth/me', { name });
    const nextUser = response.data.user;
    setUser(nextUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }

  const value = useMemo(
    () => ({ token, user, isLoading, isAuthenticated: Boolean(token), login, register, logout, updateName }),
    [token, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}


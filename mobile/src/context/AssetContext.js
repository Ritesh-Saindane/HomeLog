import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const ASSETS_KEY = '@homelog/demo_assets';

const starterAssets = [
  {
    id: 'demo-ac',
    name: 'Living room AC',
    category: 'Air conditioner',
    brand: 'Daikin',
    modelNumber: 'FTKF50TV',
    serialNumber: 'DLR-2024-001',
    location: 'Living room',
    status: 'ACTIVE',
    warrantyEndDate: '2027-06-30',
    notes: 'Annual service due in June.',
  },
  {
    id: 'demo-fridge',
    name: 'Kitchen refrigerator',
    category: 'Refrigerator',
    brand: 'LG',
    modelNumber: 'GL-S292RPZY',
    serialNumber: 'LGR-2023-008',
    location: 'Kitchen',
    status: 'ACTIVE',
    warrantyEndDate: '2026-12-15',
    notes: '',
  },
];

const AssetContext = createContext(null);

export function AssetProvider({ children }) {
  const { token, isAuthenticated } = useAuth();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreAssets() {
      try {
        if (isAuthenticated && token) {
          const response = await api.get('/assets');
          setAssets(response.data);
        } else {
          const savedAssets = await AsyncStorage.getItem(ASSETS_KEY);
          setAssets(savedAssets ? JSON.parse(savedAssets) : starterAssets);
        }
      } catch {
        const savedAssets = await AsyncStorage.getItem(ASSETS_KEY);
        setAssets(savedAssets ? JSON.parse(savedAssets) : starterAssets);
      } finally {
        setIsLoading(false);
      }
    }
    restoreAssets();
  }, [isAuthenticated, token]);

  async function persist(nextAssets) {
    setAssets(nextAssets);
    await AsyncStorage.setItem(ASSETS_KEY, JSON.stringify(nextAssets));
  }

  async function addAsset(asset) {
    if (isAuthenticated) {
      const response = await api.post('/assets', asset);
      setAssets((current) => [response.data, ...current]);
      return response.data;
    }
    const nextAsset = { ...asset, id: `asset-${Date.now()}`, status: asset.status || 'ACTIVE' };
    await persist([nextAsset, ...assets]);
    return nextAsset;
  }

  async function updateAsset(id, changes) {
    if (isAuthenticated) {
      const response = await api.put(`/assets/${id}`, changes);
      setAssets((current) => current.map((asset) => (asset.id === id ? response.data : asset)));
      return;
    }
    const nextAssets = assets.map((asset) => (asset.id === id ? { ...asset, ...changes } : asset));
    await persist(nextAssets);
  }

  const value = useMemo(
    () => ({ assets, isLoading, addAsset, updateAsset }),
    [assets, isLoading],
  );

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
}

export function useAssets() {
  const context = useContext(AssetContext);
  if (!context) throw new Error('useAssets must be used inside AssetProvider');
  return context;
}


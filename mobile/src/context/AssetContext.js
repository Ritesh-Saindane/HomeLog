import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreAssets() {
      const savedAssets = await AsyncStorage.getItem(ASSETS_KEY);
      setAssets(savedAssets ? JSON.parse(savedAssets) : starterAssets);
      setIsLoading(false);
    }
    restoreAssets();
  }, []);

  async function persist(nextAssets) {
    setAssets(nextAssets);
    await AsyncStorage.setItem(ASSETS_KEY, JSON.stringify(nextAssets));
  }

  async function addAsset(asset) {
    const nextAsset = { ...asset, id: `asset-${Date.now()}`, status: asset.status || 'ACTIVE' };
    await persist([nextAsset, ...assets]);
    return nextAsset;
  }

  async function updateAsset(id, changes) {
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


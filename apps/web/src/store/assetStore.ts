import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset, AssetCategory } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface AssetState {
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetsByCategory: (category: AssetCategory) => Asset[];
  getTotalValue: () => number;
  getTotalDebt: () => number;
  getNetValue: () => number;
  getCategoryBreakdown: () => { category: AssetCategory; value: number; count: number }[];
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],

      addAsset: (assetData) => {
        const now = new Date().toISOString();
        const asset: Asset = {
          ...assetData,
          id: generateId(),
          userId: '',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ assets: [...state.assets, asset] }));
      },

      updateAsset: (id, data) => {
        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          ),
        }));
      },

      deleteAsset: (id) => {
        set((state) => ({ assets: state.assets.filter((a) => a.id !== id) }));
      },

      getAssetsByCategory: (category) => {
        return get().assets.filter((a) => a.category === category);
      },

      getTotalValue: () => {
        return get().assets.reduce((sum, a) => sum + a.estimatedValue, 0);
      },

      getTotalDebt: () => {
        return get().assets.reduce((sum, a) => {
          return sum + (a.outstandingMortgage || 0) + (a.outstandingLoan || 0);
        }, 0);
      },

      getNetValue: () => {
        const state = get();
        return state.getTotalValue() - state.getTotalDebt();
      },

      getCategoryBreakdown: () => {
        const assets = get().assets;
        const map = new Map<AssetCategory, { value: number; count: number }>();
        assets.forEach((a) => {
          const existing = map.get(a.category) || { value: 0, count: 0 };
          map.set(a.category, {
            value: existing.value + a.estimatedValue,
            count: existing.count + 1,
          });
        });
        return Array.from(map.entries()).map(([category, data]) => ({
          category,
          ...data,
        }));
      },
    }),
    { name: 'estateos-asset-store' }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EstateScore, RiskFlag, PlanItem, Beneficiary, Executor, VaultItem, ChatMessage } from '@/lib/types';
import { generateId } from '@/lib/utils';

interface EstateState {
  // Analysis
  estateScore: EstateScore | null;
  riskFlags: RiskFlag[];
  analysisNarrative: string;
  taxNotes: string;
  hasAnalyzed: boolean;
  
  // Plan
  planItems: PlanItem[];
  beneficiaries: Beneficiary[];
  executors: Executor[];
  
  // Vault
  vaultItems: VaultItem[];
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Analysis actions
  setAnalysis: (score: EstateScore, flags: RiskFlag[], narrative: string, taxNotes: string) => void;
  resolveRiskFlag: (id: string) => void;
  
  // Plan actions
  setPlanItems: (items: PlanItem[]) => void;
  completePlanItem: (id: string) => void;
  addBeneficiary: (data: Omit<Beneficiary, 'id' | 'userId'>) => void;
  updateBeneficiary: (id: string, data: Partial<Beneficiary>) => void;
  deleteBeneficiary: (id: string) => void;
  addExecutor: (data: Omit<Executor, 'id' | 'userId'>) => void;
  updateExecutor: (id: string, data: Partial<Executor>) => void;
  deleteExecutor: (id: string) => void;
  
  // Vault actions
  addVaultItem: (data: Omit<VaultItem, 'id' | 'userId' | 'createdAt'>) => void;
  updateVaultItem: (id: string, data: Partial<VaultItem>) => void;
  deleteVaultItem: (id: string) => void;
  
  // Chat actions
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
}

export const useEstateStore = create<EstateState>()(
  persist(
    (set) => ({
      estateScore: null,
      riskFlags: [],
      analysisNarrative: '',
      taxNotes: '',
      hasAnalyzed: false,
      planItems: [],
      beneficiaries: [],
      executors: [],
      vaultItems: [],
      chatMessages: [],

      setAnalysis: (score, flags, narrative, taxNotes) => {
        set({
          estateScore: score,
          riskFlags: flags,
          analysisNarrative: narrative,
          taxNotes,
          hasAnalyzed: true,
        });
      },

      resolveRiskFlag: (id) => {
        set((state) => ({
          riskFlags: state.riskFlags.map((f) =>
            f.id === id ? { ...f, isResolved: true, resolvedAt: new Date().toISOString() } : f
          ),
        }));
      },

      setPlanItems: (items) => set({ planItems: items }),

      completePlanItem: (id) => {
        set((state) => ({
          planItems: state.planItems.map((p) =>
            p.id === id ? { ...p, isCompleted: true, completedAt: new Date().toISOString() } : p
          ),
        }));
      },

      addBeneficiary: (data) => {
        set((state) => ({
          beneficiaries: [...state.beneficiaries, { ...data, id: generateId(), userId: '' }],
        }));
      },

      updateBeneficiary: (id, data) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.map((b) =>
            b.id === id ? { ...b, ...data } : b
          ),
        }));
      },

      deleteBeneficiary: (id) => {
        set((state) => ({
          beneficiaries: state.beneficiaries.filter((b) => b.id !== id),
        }));
      },

      addExecutor: (data) => {
        set((state) => ({
          executors: [...state.executors, { ...data, id: generateId(), userId: '' }],
        }));
      },

      updateExecutor: (id, data) => {
        set((state) => ({
          executors: state.executors.map((e) =>
            e.id === id ? { ...e, ...data } : e
          ),
        }));
      },

      deleteExecutor: (id) => {
        set((state) => ({
          executors: state.executors.filter((e) => e.id !== id),
        }));
      },

      addVaultItem: (data) => {
        set((state) => ({
          vaultItems: [
            ...state.vaultItems,
            { ...data, id: generateId(), userId: '', createdAt: new Date().toISOString() },
          ],
        }));
      },

      updateVaultItem: (id, data) => {
        set((state) => ({
          vaultItems: state.vaultItems.map((v) =>
            v.id === id ? { ...v, ...data } : v
          ),
        }));
      },

      deleteVaultItem: (id) => {
        set((state) => ({
          vaultItems: state.vaultItems.filter((v) => v.id !== id),
        }));
      },

      addChatMessage: (message) => {
        set((state) => ({
          chatMessages: [
            ...state.chatMessages,
            { ...message, id: generateId(), timestamp: new Date().toISOString() },
          ],
        }));
      },

      clearChat: () => set({ chatMessages: [] }),
    }),
    { name: 'estateos-estate-store' }
  )
);

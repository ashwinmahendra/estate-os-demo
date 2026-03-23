import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Profile, OnboardingData, Notification } from '@/lib/types';

interface UserState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  onboarding: OnboardingData;
  notifications: Notification[];
  
  // Auth actions
  signIn: (email: string, name: string) => void;
  signOut: () => void;
  
  // Profile actions
  updateProfile: (data: Partial<Profile>) => void;
  completeOnboarding: () => void;
  
  // Onboarding actions
  setOnboardingStep: (step: number) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const initialOnboarding: OnboardingData = {
  currentStep: 1,
  selectedAssetCategories: [],
  primaryGoals: [],
  existingDocuments: [],
  hasChildren: false,
  hasMinorChildren: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      onboarding: initialOnboarding,
      notifications: [],

      signIn: (email: string, name: string) => {
        const id = crypto.randomUUID?.() || Date.now().toString();
        set({
          user: { id, email, name, createdAt: new Date().toISOString() },
          isAuthenticated: true,
        });
      },

      signOut: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          onboarding: initialOnboarding,
        });
      },

      updateProfile: (data: Partial<Profile>) => {
        const state = get();
        const existing = state.profile || {
          id: crypto.randomUUID?.() || Date.now().toString(),
          userId: state.user?.id || '',
          hasChildren: false,
          hasMinorChildren: false,
          stateOfResidence: '',
          countryOfResidence: 'US',
          hasBusinessOwnership: false,
          hasCryptoAssets: false,
          hasRealEstate: false,
          hasRetirementAccounts: false,
          hasLifeInsurance: false,
          hasTrust: false,
          hasExistingWill: false,
          primaryGoal: [],
          selectedAssetCategories: [],
          existingDocuments: [],
        };
        set({ profile: { ...existing, ...data } as Profile });
      },

      completeOnboarding: () => {
        const state = get();
        const onb = state.onboarding;
        set({
          profile: {
            ...(state.profile || {}),
            id: state.profile?.id || crypto.randomUUID?.() || Date.now().toString(),
            userId: state.user?.id || '',
            maritalStatus: onb.maritalStatus,
            hasChildren: onb.hasChildren || false,
            numberOfChildren: onb.numberOfChildren,
            hasMinorChildren: onb.hasMinorChildren || false,
            stateOfResidence: onb.stateOfResidence || '',
            countryOfResidence: 'US',
            ageRange: onb.lifeStage,
            incomeRange: onb.incomeRange,
            netWorthEstimate: onb.netWorthEstimate,
            employmentStatus: onb.employmentStatus,
            hasBusinessOwnership: onb.hasBusinessOwnership || false,
            hasCryptoAssets: onb.selectedAssetCategories.includes('CRYPTO'),
            hasRealEstate: onb.selectedAssetCategories.includes('REAL_ESTATE'),
            hasRetirementAccounts: onb.selectedAssetCategories.includes('RETIREMENT'),
            hasLifeInsurance: onb.selectedAssetCategories.includes('INSURANCE'),
            hasTrust: onb.existingDocuments.includes('trust'),
            hasExistingWill: onb.existingDocuments.includes('will'),
            primaryGoal: onb.primaryGoals,
            planningUrgency: 'WITHIN_YEAR',
            completedAt: new Date().toISOString(),
            selectedAssetCategories: onb.selectedAssetCategories,
            existingDocuments: onb.existingDocuments,
            lastUpdateRange: onb.lastUpdateRange,
          } as Profile,
        });
      },

      setOnboardingStep: (step: number) => {
        set((state) => ({
          onboarding: { ...state.onboarding, currentStep: step },
        }));
      },

      updateOnboarding: (data: Partial<OnboardingData>) => {
        set((state) => ({
          onboarding: { ...state.onboarding, ...data },
        }));
      },

      resetOnboarding: () => {
        set({ onboarding: initialOnboarding });
      },

      addNotification: (notification) => {
        const id = crypto.randomUUID?.() || Date.now().toString();
        set((state) => ({
          notifications: [
            { ...notification, id, isRead: false, createdAt: new Date().toISOString() },
            ...state.notifications,
          ],
        }));
      },

      markNotificationRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'legacy-user-store',
    }
  )
);

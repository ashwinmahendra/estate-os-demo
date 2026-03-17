// ─── Enums ─────────────────────────────────────────────────────
export type MaritalStatus = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'PARTNERED' | 'SEPARATED';

export type AgeRange = 'AGE_18_25' | 'AGE_26_35' | 'AGE_36_45' | 'AGE_46_55' | 'AGE_56_65' | 'AGE_65_PLUS';

export type IncomeRange = 'UNDER_50K' | 'RANGE_50_100K' | 'RANGE_100_200K' | 'RANGE_200_500K' | 'OVER_500K';

export type NetWorthRange = 'UNDER_100K' | 'RANGE_100K_500K' | 'RANGE_500K_1M' | 'RANGE_1M_5M' | 'OVER_5M';

export type EmploymentStatus = 'EMPLOYED' | 'SELF_EMPLOYED' | 'BUSINESS_OWNER' | 'RETIRED' | 'STUDENT' | 'UNEMPLOYED';

export type EstateGoal = 'PROTECT_FAMILY' | 'MINIMIZE_TAXES' | 'AVOID_PROBATE' | 'BUSINESS_SUCCESSION' | 'CHARITABLE_GIVING' | 'DIGITAL_LEGACY' | 'PLAN_INCAPACITY' | 'EASY_EXECUTOR';

export type PlanningUrgency = 'JUST_EXPLORING' | 'WITHIN_YEAR' | 'WITHIN_6_MONTHS' | 'URGENT';

export type AssetCategory = 'CASH' | 'BROKERAGE' | 'RETIREMENT' | 'REAL_ESTATE' | 'BUSINESS' | 'CRYPTO' | 'DIGITAL_ACCOUNT' | 'INSURANCE' | 'VEHICLE' | 'PERSONAL_PROPERTY' | 'BONDS' | 'OTHER';

export type OwnershipType = 'SOLE' | 'JOINT_WITH_SPOUSE' | 'JOINT_TENANCY' | 'TENANCY_IN_COMMON' | 'TRUST' | 'BUSINESS_ENTITY';

export type RiskSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type RiskCategory = 'DOCUMENT' | 'BENEFICIARY' | 'DIGITAL' | 'TAX' | 'GUARDIAN' | 'EXECUTOR' | 'TRUST';

export type PlanItemType = 'WILL' | 'TRUST' | 'POWER_OF_ATTORNEY' | 'HEALTHCARE_DIRECTIVE' | 'GUARDIAN_DESIGNATION' | 'DIGITAL_ASSET_PLAN' | 'BUSINESS_SUCCESSION' | 'BENEFICIARY_UPDATE';

export type VaultCategory = 'CRYPTO_KEYS' | 'ACCOUNT_CREDENTIALS' | 'INSURANCE_POLICIES' | 'PROPERTY_DEEDS' | 'LEGAL_DOCUMENTS' | 'FINANCIAL_ACCOUNTS' | 'DIGITAL_SUBSCRIPTIONS' | 'OTHER';

export type VaultAccessLevel = 'PRIVATE' | 'EXECUTOR_ON_DEATH' | 'EXECUTOR_ON_INCAPACITY' | 'ALWAYS_ACCESSIBLE';

export type DocumentType = 'WILL' | 'REVOCABLE_TRUST' | 'IRREVOCABLE_TRUST' | 'POA_FINANCIAL' | 'POA_HEALTHCARE' | 'LIVING_WILL' | 'GUARDIAN_DESIGNATION' | 'DIGITAL_ASSET_DIRECTIVE';

export type DocumentStatus = 'NOT_STARTED' | 'DRAFT' | 'GENERATED' | 'REVIEW_NEEDED' | 'SIGNED' | 'OUTDATED';

// ─── Models ────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  maritalStatus?: MaritalStatus;
  hasChildren: boolean;
  numberOfChildren?: number;
  childrenAges?: number[];
  hasMinorChildren: boolean;
  stateOfResidence: string;
  countryOfResidence: string;
  ageRange?: AgeRange;
  incomeRange?: IncomeRange;
  netWorthEstimate?: NetWorthRange;
  employmentStatus?: EmploymentStatus;
  hasBusinessOwnership: boolean;
  hasCryptoAssets: boolean;
  hasRealEstate: boolean;
  hasRetirementAccounts: boolean;
  hasLifeInsurance: boolean;
  hasTrust: boolean;
  hasExistingWill: boolean;
  lastWillDate?: string;
  primaryGoal: EstateGoal[];
  planningUrgency?: PlanningUrgency;
  completedAt?: string;
  // Onboarding step tracking
  selectedAssetCategories?: AssetCategory[];
  existingDocuments?: string[];
  lastUpdateRange?: string;
}

export interface Asset {
  id: string;
  userId: string;
  category: AssetCategory;
  subcategory?: string;
  name: string;
  institution?: string;
  accountNumber?: string;
  estimatedValue: number;
  currency: string;
  ownershipType: OwnershipType;
  ownershipPercentage: number;
  hasNamedBeneficiary: boolean;
  beneficiaryName?: string;
  notes?: string;
  isDigitalAsset: boolean;
  accessInstructions?: string;
  createdAt: string;
  updatedAt: string;
  // Category-specific fields
  accountType?: string;
  isJointAccount?: boolean;
  holdingType?: string;
  retirementType?: string;
  employerMatched?: boolean;
  propertyType?: string;
  address?: string;
  outstandingMortgage?: number;
  inTrust?: boolean;
  businessType?: string;
  hasBuySellAgreement?: boolean;
  hasSuccessionPlan?: boolean;
  cryptoType?: string;
  whereHeld?: string;
  walletAddress?: string;
  hasSuccessorAccess?: boolean;
  digitalAccountType?: string;
  policyType?: string;
  policyNumber?: string;
  deathBenefit?: number;
  hasContingentBeneficiary?: boolean;
  vehicleType?: string;
  make?: string;
  model?: string;
  year?: string;
  isFinanced?: boolean;
  outstandingLoan?: number;
  propertyCategory?: string;
  description?: string;
  location?: string;
  isInsured?: boolean;
  isAppraised?: boolean;
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  share?: number;
  isPrimary: boolean;
  isContingent: boolean;
  isMinor: boolean;
  guardianId?: string;
}

export interface Executor {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  isAlternate: boolean;
  hasAcceptedRole: boolean;
  notificationPreference?: string;
}

export interface EstateScore {
  id: string;
  userId: string;
  overallScore: number;
  documentScore: number;
  assetScore: number;
  beneficiaryScore: number;
  digitalScore: number;
  taxScore: number;
  lastCalculated: string;
  nextReviewDate: string;
}

export interface RiskFlag {
  id: string;
  userId: string;
  severity: RiskSeverity;
  category: RiskCategory;
  title: string;
  description: string;
  recommendation: string;
  isResolved: boolean;
  resolvedAt?: string;
  estimatedCostRange?: string;
}

export interface PlanItem {
  id: string;
  userId: string;
  type: PlanItemType;
  title: string;
  description: string;
  priority: number;
  isCompleted: boolean;
  completedAt?: string;
  estimatedCost?: number;
  externalLink?: string;
  // Extended
  whyItMatters?: string;
  howToComplete?: {
    diy: string;
    online: { platform: string; cost: string; link: string };
    attorney: string;
  };
  timeToComplete?: string;
}

export interface VaultItem {
  id: string;
  userId: string;
  category: VaultCategory;
  title: string;
  encryptedContent: string;
  accessLevel: VaultAccessLevel;
  executorCanAccess: boolean;
  releaseCondition?: string;
  createdAt: string;
  executorNote?: string;
}

export interface Document {
  id: string;
  userId: string;
  type: DocumentType;
  title: string;
  status: DocumentStatus;
  fileUrl?: string;
  generatedAt?: string;
  signedAt?: string;
  lastUpdated: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ─── Analysis Result (AI Response) ────────────────────────────
export interface EstateAnalysisResult {
  scores: {
    overall: number;
    documents: number;
    assets: number;
    beneficiaries: number;
    digital: number;
    tax: number;
  };
  narrative: string;
  riskFlags: RiskFlag[];
  planItems: PlanItem[];
  taxNotes: string;
  reviewDate: string;
}

// ─── UI Types ──────────────────────────────────────────────────
export interface OnboardingData {
  currentStep: number;
  lifeStage?: AgeRange;
  maritalStatus?: MaritalStatus;
  hasChildren?: boolean;
  numberOfChildren?: number;
  hasMinorChildren?: boolean;
  hasGrandchildren?: boolean;
  stateOfResidence?: string;
  employmentStatus?: EmploymentStatus;
  hasBusinessOwnership?: boolean;
  hasSuccessionPlan?: boolean;
  incomeRange?: IncomeRange;
  netWorthEstimate?: NetWorthRange;
  selectedAssetCategories: AssetCategory[];
  primaryGoals: EstateGoal[];
  existingDocuments: string[];
  lastUpdateRange?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

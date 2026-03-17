import { v4 } from './uuid';

// ─── Formatting ────────────────────────────────────────────────
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function generateId(): string {
  return v4();
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// ─── Asset Helpers ─────────────────────────────────────────────
export const ASSET_CATEGORY_META: Record<string, { icon: string; label: string; color: string }> = {
  CASH: { icon: '💵', label: 'Cash & Banking', color: '#4ADE80' },
  BROKERAGE: { icon: '📈', label: 'Investments', color: '#60A5FA' },
  RETIREMENT: { icon: '🏦', label: 'Retirement', color: '#818CF8' },
  REAL_ESTATE: { icon: '🏡', label: 'Real Estate', color: '#F472B6' },
  BUSINESS: { icon: '🏢', label: 'Business', color: '#FB923C' },
  CRYPTO: { icon: '₿', label: 'Crypto & Digital', color: '#FACC15' },
  DIGITAL_ACCOUNT: { icon: '💻', label: 'Digital Accounts', color: '#2DD4BF' },
  INSURANCE: { icon: '💼', label: 'Insurance', color: '#A78BFA' },
  VEHICLE: { icon: '🚗', label: 'Vehicles', color: '#FB7185' },
  PERSONAL_PROPERTY: { icon: '👜', label: 'Personal Property', color: '#C084FC' },
  BONDS: { icon: '📜', label: 'Bonds & CDs', color: '#34D399' },
  OTHER: { icon: '📦', label: 'Other', color: '#94A3B8' },
};

export const VAULT_CATEGORY_META: Record<string, { icon: string; label: string }> = {
  CRYPTO_KEYS: { icon: '₿', label: 'Crypto & Wallet Keys' },
  ACCOUNT_CREDENTIALS: { icon: '🔐', label: 'Account Credentials' },
  INSURANCE_POLICIES: { icon: '📄', label: 'Insurance Policies' },
  PROPERTY_DEEDS: { icon: '🏠', label: 'Property Documents' },
  LEGAL_DOCUMENTS: { icon: '⚖️', label: 'Legal Documents' },
  FINANCIAL_ACCOUNTS: { icon: '💰', label: 'Financial Accounts' },
  DIGITAL_SUBSCRIPTIONS: { icon: '📱', label: 'Digital Subscriptions' },
  OTHER: { icon: '📝', label: 'Other Important Info' },
};

export const RISK_SEVERITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  CRITICAL: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', label: 'Critical' },
  HIGH: { color: '#FB923C', bg: 'rgba(251,146,60,0.1)', label: 'High' },
  MEDIUM: { color: '#FACC15', bg: 'rgba(250,204,21,0.1)', label: 'Medium' },
  LOW: { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', label: 'Low' },
};

export const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

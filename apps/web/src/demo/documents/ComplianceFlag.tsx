import React from 'react';
import type { DemoProfile, DemoAsset } from '../DemoFlow';
import type { StateRules } from './stateRules';

// ─── Types ─────────────────────────────────────────────────
export type Severity = 'critical' | 'warning' | 'info';

export interface ComplianceFlagData {
  severity: Severity;
  message: string;
  id: string;
}

// ─── Severity styling ──────────────────────────────────────
const SEVERITY_MAP: Record<Severity, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  critical: { emoji: '🔴', label: 'CRITICAL', color: '#E05252', bg: 'rgba(224,82,82,0.08)', border: 'rgba(224,82,82,0.25)' },
  warning:  { emoji: '🟡', label: 'WARNING',  color: '#D4B766', bg: 'rgba(212,183,102,0.08)', border: 'rgba(212,183,102,0.25)' },
  info:     { emoji: '🔵', label: 'INFO',     color: '#7BA8D9', bg: 'rgba(123,168,217,0.08)', border: 'rgba(123,168,217,0.25)' },
};

// ─── Inline Flag Component ─────────────────────────────────
export const InlineFlag: React.FC<{ severity: Severity; children: React.ReactNode }> = ({ severity, children }) => {
  const s = SEVERITY_MAP[severity];
  return (
    <div
      className="my-3 px-4 py-3 rounded-lg text-sm leading-relaxed"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
    >
      <span className="font-bold mr-1.5">{s.emoji} {s.label}:</span> {children}
    </div>
  );
};

// ─── Compliance Summary (collapsible header) ───────────────
export const ComplianceSummary: React.FC<{ flags: ComplianceFlagData[] }> = ({ flags }) => {
  const [open, setOpen] = React.useState(true);
  if (flags.length === 0) return null;

  const criticals = flags.filter(f => f.severity === 'critical');
  const warnings  = flags.filter(f => f.severity === 'warning');
  const infos     = flags.filter(f => f.severity === 'info');

  return (
    <div className="mb-6 border rounded-lg overflow-hidden" style={{ borderColor: 'rgba(191,160,82,0.2)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left"
        style={{ background: 'rgba(191,160,82,0.05)' }}
      >
        <span style={{ color: '#92700C' }}>
          Compliance Summary — {criticals.length} critical · {warnings.length} warnings · {infos.length} info
        </span>
        <span className="text-xs" style={{ color: '#BFA052' }}>{open ? '▾ Collapse' : '▸ Expand'}</span>
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2" style={{ background: '#FFFDF5' }}>
          {flags.map(f => {
            const s = SEVERITY_MAP[f.severity];
            return (
              <div key={f.id} className="flex items-start gap-2 text-sm" style={{ color: s.color }}>
                <span className="shrink-0 mt-0.5">{s.emoji}</span>
                <span>{f.message}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Auto-detect compliance flags per document type ────────
export function getComplianceFlags(
  docType: string,
  profile: DemoProfile,
  assets: DemoAsset[],
  rules: StateRules,
): ComplianceFlagData[] {
  const flags: ComplianceFlagData[] = [];
  const totalValue = assets.reduce((s, a) => s + a.value, 0);
  const hasRealEstate = assets.some(a => a.category === 'real_estate');
  const hasCrypto = assets.some(a => a.category === 'crypto');
  const missingBeneficiary = assets.filter(a => !a.hasBeneficiary);

  // ── Universal flags ──
  if (docType === 'will' || docType === 'trust') {
    flags.push({ severity: 'critical', id: 'missing-executor', message: 'Missing executor / personal representative. You must name someone to administer your estate.' });
  }
  if (docType === 'healthcare') {
    flags.push({ severity: 'critical', id: 'missing-agent', message: 'Missing healthcare agent. You must name a medical decision-maker.' });
  }
  if (docType === 'guardian' && profile.hasChildren) {
    flags.push({ severity: 'critical', id: 'missing-guardian', message: 'Missing guardian designation. You must name a guardian for your minor children.' });
  }

  // ── Estate value & tax ──
  if (totalValue > rules.estateTaxExemption) {
    flags.push({ severity: 'warning', id: 'estate-tax', message: `Your estimated estate ($${totalValue.toLocaleString()}) exceeds the $${rules.estateTaxExemption.toLocaleString()} estate tax exemption. Consult a licensed estate attorney.` });
  }

  // ── Real estate in trust ──
  if (docType === 'trust' && hasRealEstate) {
    flags.push({ severity: 'warning', id: 'deed-transfer', message: 'Real estate detected — a separate deed must be drafted and recorded to transfer property into the trust. This document does not accomplish that transfer.' });
  }

  // ── Beneficiary gaps ──
  if (missingBeneficiary.length > 0) {
    flags.push({ severity: 'warning', id: 'missing-beneficiaries', message: `${missingBeneficiary.length} asset(s) have no designated beneficiary. Update beneficiaries directly with each institution.` });
  }

  // ── Crypto ──
  if (hasCrypto) {
    flags.push({ severity: 'warning', id: 'crypto-access', message: 'Cryptocurrency detected without a documented access plan. Without explicit authorization, executors may not be able to access digital wallets.' });
  }

  // ── Married but spouse not named ──
  if ((docType === 'will' || docType === 'trust') && profile.maritalStatus === 'Married') {
    flags.push({ severity: 'warning', id: 'spouse-not-named', message: 'You are married but no spouse name has been provided. Under MA law, an omitted spouse may claim up to 1/3 of the estate (M.G.L. Ch. 190B §2-301).' });
  }

  // ── Children + no guardian in will ──
  if (docType === 'will' && profile.hasChildren) {
    flags.push({ severity: 'warning', id: 'guardian-in-will', message: 'You have minor children. It is critical to name a guardian in your will.' });
  }

  // ── Info flags ──
  if (docType === 'healthcare') {
    flags.push({ severity: 'info', id: 'agent-cannot-witness', message: 'Your healthcare agent cannot serve as a witness to this document under MA law (M.G.L. Ch. 201D §3).' });
  }
  if (docType === 'will') {
    flags.push({ severity: 'info', id: 'witnesses-not-beneficiaries', message: 'Witnesses to the will should not be named as beneficiaries to avoid potential challenges.' });
    if (!rules.holographicWillValid) {
      flags.push({ severity: 'info', id: 'no-holographic', message: `Holographic (handwritten, unwitnessed) wills are not valid in ${profile.state || 'Massachusetts'}.` });
    }
  }

  return flags;
}

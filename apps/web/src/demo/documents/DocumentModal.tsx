import React, { useEffect, useCallback } from 'react';
import type { DemoProfile, DemoAsset } from '../DemoFlow';
import { getRulesForState } from './stateRules';
import { ComplianceSummary, getComplianceFlags } from './ComplianceFlag';

// Lazy-import all templates
import { WillTemplate } from './templates/WillTemplate';
import { TrustTemplate } from './templates/TrustTemplate';
import { POATemplate } from './templates/POATemplate';
import { HealthcareTemplate } from './templates/HealthcareTemplate';
import { DigitalAssetTemplate } from './templates/DigitalAssetTemplate';
import { GuardianTemplate } from './templates/GuardianTemplate';
import { BeneficiaryReviewTemplate } from './templates/BeneficiaryReviewTemplate';

// ─── Legal Disclaimer ──────────────────────────────────────
const LegalDisclaimer: React.FC = () => (
  <div
    className="px-4 py-3 rounded-lg text-xs leading-relaxed my-4"
    style={{ background: '#F8F5EC', border: '1px solid rgba(191,160,82,0.2)', color: '#6B5C2A' }}
  >
    <span className="font-bold">⚖️ Legal Notice:</span> This document is an AI-generated draft for informational and
    planning purposes only. It does not constitute legal advice and has not been reviewed by a licensed attorney. Before
    signing any estate planning document, you must consult with a licensed attorney in{' '}
    {/* state injected by parent */}Massachusetts (or your state of residence). Legacy and EstateOS are not law firms
    and do not provide legal services.
  </div>
);

// ─── Document title lookup ─────────────────────────────────
const DOC_TITLES: Record<string, string> = {
  will: 'Last Will & Testament',
  trust: 'Revocable Living Trust',
  poa: 'Durable Power of Attorney',
  healthcare: 'Healthcare Directive (Healthcare Proxy)',
  digital: 'Digital Asset Directive',
  guardian: 'Guardian Designation',
  beneficiary: 'Beneficiary Review',
  succession: 'Business Succession Plan',
};

// ─── Template router ───────────────────────────────────────
const TemplateRouter: React.FC<{
  docType: string;
  profile: DemoProfile;
  assets: DemoAsset[];
  totalValue: number;
}> = ({ docType, profile, assets, totalValue }) => {
  const rules = getRulesForState(profile.state || 'Massachusetts');
  const props = { profile, assets, totalValue, rules };

  switch (docType) {
    case 'will':        return <WillTemplate {...props} />;
    case 'trust':       return <TrustTemplate {...props} />;
    case 'poa':         return <POATemplate {...props} />;
    case 'healthcare':  return <HealthcareTemplate {...props} />;
    case 'digital':     return <DigitalAssetTemplate {...props} />;
    case 'guardian':    return <GuardianTemplate {...props} />;
    case 'beneficiary': return <BeneficiaryReviewTemplate {...props} />;
    default:            return <p className="text-center text-gray-500 py-12">Document template coming soon.</p>;
  }
};

// ─── Main Modal Component ──────────────────────────────────
interface DocumentModalProps {
  docType: string;
  profile: DemoProfile;
  assets: DemoAsset[];
  totalValue: number;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  docType, profile, assets, totalValue, onClose,
}) => {
  const rules = getRulesForState(profile.state || 'Massachusetts');
  const flags = getComplianceFlags(docType, profile, assets, rules);
  const title = DOC_TITLES[docType] || 'Document';

  // ── Escape key handler ─────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Lock background scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-4xl mx-4 my-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#FFFEFB' }}
      >
        {/* ── Header bar ──────────────────────────────── */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b"
          style={{ background: '#0D0D0D', borderColor: 'rgba(191,160,82,0.3)' }}
        >
          <div>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#BFA052' }}>Legacy · {profile.state || 'Massachusetts'}</p>
            <h2 className="text-lg font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all text-xl leading-none"
            aria-label="Close document"
          >
            ×
          </button>
        </div>

        {/* ── Document body ───────────────────────────── */}
        <div className="px-8 md:px-14 py-8 text-gray-800" style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}>
          <LegalDisclaimer />
          <ComplianceSummary flags={flags} />
          <TemplateRouter docType={docType} profile={profile} assets={assets} totalValue={totalValue} />
          <LegalDisclaimer />
        </div>
      </div>
    </div>
  );
};

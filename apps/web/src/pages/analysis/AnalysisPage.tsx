import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAssetStore } from '@/store/assetStore';
import { useEstateStore } from '@/store/estateStore';
import { useUserStore } from '@/store/userStore';
import { Button, ScoreGauge, ProgressRing, CountUp, Badge } from '@/components/ui';
import { cn, formatCurrency, RISK_SEVERITY_CONFIG, delay, generateId } from '@/lib/utils';
import type { RiskFlag, PlanItem, EstateScore } from '@/lib/types';

// ─── AI Analysis Simulation ─────────────────────────────────
function generateMockAnalysis(profile: any, assets: any[]): {
  score: EstateScore;
  flags: RiskFlag[];
  narrative: string;
  taxNotes: string;
  planItems: PlanItem[];
} {
  const hasWill = profile?.hasExistingWill;
  const hasTrust = profile?.hasTrust;
  const hasCrypto = assets.some(a => a.category === 'CRYPTO');
  const hasRealEstate = assets.some(a => a.category === 'REAL_ESTATE');
  const hasMinorChildren = profile?.hasMinorChildren;
  const totalValue = assets.reduce((s: number, a: { estimatedValue: number }) => s + a.estimatedValue, 0);
  const missingBeneficiary = assets.filter(a => !a.hasNamedBeneficiary);

  let docScore = hasWill ? 40 : 10;
  if (hasTrust) docScore += 30;
  const assetScore = Math.min(90, assets.length * 15);
  const beneficiaryScore = assets.length > 0 ? Math.round(((assets.length - missingBeneficiary.length) / assets.length) * 100) : 0;
  const digitalScore = hasCrypto ? 20 : 60;
  const taxScore = totalValue > 1000000 ? 55 : 75;
  const overall = Math.round((docScore + assetScore + beneficiaryScore + digitalScore + taxScore) / 5);

  const flags: RiskFlag[] = [];
  if (!hasWill) flags.push({ id: generateId(), userId: '', severity: 'HIGH', category: 'DOCUMENT', title: 'No Will on File', description: 'Without a will, your state decides how your assets are distributed. This may not align with your wishes.', recommendation: 'Create a Last Will and Testament. This can be done online for $100-300 or through an attorney for $300-1000.', isResolved: false, estimatedCostRange: '$100 - $1,000' });
  if (hasCrypto) flags.push({ id: generateId(), userId: '', severity: 'CRITICAL', category: 'DIGITAL', title: 'Cryptocurrency Without Access Plan', description: `You have crypto assets with no documented access instructions for your executor. These assets could become permanently lost.`, recommendation: 'Document wallet passwords, seed phrases, and exchange credentials in the Digital Vault with executor access.', isResolved: false });
  if (hasMinorChildren && !hasWill) flags.push({ id: generateId(), userId: '', severity: 'CRITICAL', category: 'GUARDIAN', title: 'Minor Children With No Guardian Designated', description: 'If both parents pass, the court will decide who raises your children without your input.', recommendation: 'Designate a guardian in your will immediately. This is the most urgent action you can take.', isResolved: false });
  if (missingBeneficiary.length > 0) flags.push({ id: generateId(), userId: '', severity: 'MEDIUM', category: 'BENEFICIARY', title: `${missingBeneficiary.length} Asset(s) Missing Beneficiary`, description: `The following assets have no named beneficiary: ${missingBeneficiary.map(a => a.name).join(', ')}.`, recommendation: 'Contact each institution to add beneficiary designations.', isResolved: false });
  if (totalValue > 500000 && !hasTrust) flags.push({ id: generateId(), userId: '', severity: 'MEDIUM', category: 'TRUST', title: 'Consider a Revocable Living Trust', description: `With an estate valued at ${formatCurrency(totalValue)}, a revocable living trust could help you avoid probate and maintain privacy.`, recommendation: 'Consult an estate planning attorney about establishing a trust.', isResolved: false, estimatedCostRange: '$1,500 - $5,000' });

  const narrative = `Based on our analysis of your estate, your overall preparedness score is ${overall} out of 100. ${overall < 60 ? 'There are significant gaps that need attention.' : 'You\'re making good progress but there\'s room for improvement.'}\n\n${!hasWill ? 'The most pressing concern is the absence of a will. Without this foundational document, your state\'s intestacy laws will determine how your assets are distributed, which may not reflect your wishes. ' : ''}${hasCrypto ? 'Your cryptocurrency holdings present a unique risk - without documented access instructions, these digital assets could become permanently inaccessible to your beneficiaries. ' : ''}${hasMinorChildren ? 'With minor children in the picture, establishing guardian designations is critically important. ' : ''}\n\nYour estate includes ${assets.length} documented assets with a total estimated value of ${formatCurrency(totalValue)}. ${missingBeneficiary.length > 0 ? `${missingBeneficiary.length} of these assets are missing beneficiary designations, which should be addressed promptly.` : 'All assets have beneficiary designations in place.'}\n\nWe recommend starting with the highest-priority items in your action plan and working through them systematically. Most can be completed within 30-60 days.`;

  const planItems: PlanItem[] = [
    { id: generateId(), userId: '', type: 'WILL', title: 'Create a Last Will & Testament', description: 'The foundation of any estate plan.', priority: 1, isCompleted: hasWill || false, whyItMatters: 'Without a will, state law decides everything.', howToComplete: { diy: 'Free templates available at FreeWill.com', online: { platform: 'Trust & Will', cost: '$159', link: 'https://trustandwill.com' }, attorney: 'Recommended for complex estates. Cost: $300-$1,000.' }, timeToComplete: '1-2 hours online, 1-2 weeks with attorney', estimatedCost: 300 },
    { id: generateId(), userId: '', type: 'POWER_OF_ATTORNEY', title: 'Create Durable Financial Power of Attorney', description: 'Authorizes someone to manage your finances if you become incapacitated.', priority: 2, isCompleted: false, timeToComplete: '30 minutes - 1 hour', estimatedCost: 200 },
    { id: generateId(), userId: '', type: 'HEALTHCARE_DIRECTIVE', title: 'Create Advance Healthcare Directive', description: 'Documents your healthcare wishes and designates a medical decision-maker.', priority: 3, isCompleted: false, timeToComplete: '30 minutes', estimatedCost: 0 },
  ];
  if (hasCrypto) planItems.push({ id: generateId(), userId: '', type: 'DIGITAL_ASSET_PLAN', title: 'Document Digital Asset Access', description: 'Store crypto keys and exchange credentials securely.', priority: 1, isCompleted: false, timeToComplete: '30 minutes', estimatedCost: 0 });
  if (hasMinorChildren) planItems.splice(1, 0, { id: generateId(), userId: '', type: 'GUARDIAN_DESIGNATION', title: 'Designate Guardian for Minor Children', description: 'Name who should care for your children.', priority: 1, isCompleted: false, timeToComplete: 'Included in will', estimatedCost: 0 });

  return {
    score: { id: generateId(), userId: '', overallScore: overall, documentScore: docScore, assetScore, beneficiaryScore, digitalScore, taxScore, lastCalculated: new Date().toISOString(), nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() },
    flags: flags.sort((a, b) => { const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }; return (order[a.severity] || 4) - (order[b.severity] || 4); }),
    narrative,
    taxNotes: totalValue > 1000000 ? `Your estate of ${formatCurrency(totalValue)} is below the current federal estate tax threshold of $13.99M (2025). However, the exemption may sunset to ~$7M in 2026.` : `Your estate is well below the federal estate tax threshold. No federal estate tax concerns at this time.`,
    planItems,
  };
}

// ─── Analysis Loading Animation ──────────────────────────────
const AnalysisLoader: React.FC = () => {
  const messages = [
    'Reviewing asset coverage...',
    'Checking beneficiary gaps...',
    'Analyzing digital assets...',
    'Modeling tax exposure...',
    'Calculating estate health...',
  ];
  const [msgIndex, setMsgIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      {/* Scanning visualization */}
      <div className="relative w-32 h-32">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent-gold/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-accent-gold/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-accent-gold/40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 4V12M20 28V36M4 20H12M28 20H36M8.5 8.5L14 14M26 26L31.5 31.5M31.5 8.5L26 14M14 26L8.5 31.5" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-text-secondary text-sm"
        >
          {messages[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

// ─── Risk Flag Card ──────────────────────────────────────────
const RiskFlagCard: React.FC<{ flag: RiskFlag; onResolve: (id: string) => void }> = ({ flag, onResolve }) => {
  const [expanded, setExpanded] = React.useState(false);
  const config = RISK_SEVERITY_CONFIG[flag.severity];

  return (
    <motion.div
      layout
      className="card overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
      style={{ borderLeft: `3px solid ${config.color}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={flag.severity === 'CRITICAL' ? 'danger' : flag.severity === 'HIGH' ? 'warning' : flag.severity === 'MEDIUM' ? 'warning' : 'success'}>
                {config.label}
              </Badge>
              <span className="text-sm font-semibold">{flag.title}</span>
            </div>
            <p className="text-sm text-text-secondary">{flag.description}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn('transition-transform shrink-0', expanded && 'rotate-180')}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider">Recommendation</span>
                  <p className="text-sm text-text-primary mt-1">{flag.recommendation}</p>
                </div>
                {flag.estimatedCostRange && (
                  <div>
                    <span className="text-xs text-text-tertiary uppercase tracking-wider">Estimated Cost</span>
                    <p className="text-sm text-accent-gold mt-1">{flag.estimatedCostRange}</p>
                  </div>
                )}
                <Button size="sm" onClick={(e) => { e.stopPropagation(); onResolve(flag.id); }}>
                  Mark as Resolved
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ─── Main Analysis Page ──────────────────────────────────────
const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { assets } = useAssetStore();
  const { profile } = useUserStore();
  const { estateScore, riskFlags, analysisNarrative, taxNotes, hasAnalyzed, setAnalysis, resolveRiskFlag, setPlanItems } = useEstateStore();
  const [analyzing, setAnalyzing] = React.useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    await delay(4000);
    const result = generateMockAnalysis(profile, assets);
    setAnalysis(result.score, result.flags, result.narrative, result.taxNotes);
    setPlanItems(result.planItems);
    setAnalyzing(false);
  };

  if (analyzing) return <AnalysisLoader />;

  if (!hasAnalyzed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <div className="w-20 h-20 rounded-full bg-accent-gold/10 flex items-center justify-center">
          <span className="text-4xl">🧠</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-center">Estate Analysis Engine</h2>
        <p className="text-text-secondary text-center max-w-md">
          Our AI will analyze your complete estate profile - assets, beneficiaries, documents, and more -
          to generate a personalized health score and risk report.
        </p>
        <p className="text-sm text-text-tertiary">
          {assets.length} asset{assets.length !== 1 ? 's' : ''} ready for analysis
        </p>
        <Button size="lg" onClick={runAnalysis} disabled={assets.length < 1}>
          {assets.length < 1 ? 'Add Assets First' : 'Analyze My Estate'}
        </Button>
      </div>
    );
  }

  const unresolvedFlags = riskFlags.filter(f => !f.isResolved);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-xl font-bold font-display mb-6">Estate Health Score</h2>
          <ScoreGauge score={estateScore?.overallScore || 0} size={180} />
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: 'Documents', score: estateScore?.documentScore || 0, color: '#C9A84C' },
            { label: 'Assets', score: estateScore?.assetScore || 0, color: '#4ADE80' },
            { label: 'Beneficiaries', score: estateScore?.beneficiaryScore || 0, color: '#60A5FA' },
            { label: 'Digital', score: estateScore?.digitalScore || 0, color: '#818CF8' },
            { label: 'Tax', score: estateScore?.taxScore || 0, color: '#FB923C' },
          ].map((sub) => (
            <div key={sub.label} className="flex flex-col items-center gap-2">
              <ProgressRing value={sub.score} size={56} strokeWidth={4} color={sub.color}>
                <span className="text-xs font-bold mono-value">{sub.score}</span>
              </ProgressRing>
              <span className="text-xs text-text-secondary">{sub.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary" size="sm" onClick={runAnalysis}>Re-Analyze</Button>
        </div>
      </motion.div>

      {/* Narrative */}
      {analysisNarrative && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-8">
          <h3 className="text-lg font-bold font-display mb-4">AI Risk Assessment</h3>
          <div className="prose prose-sm text-text-secondary space-y-3">
            {analysisNarrative.split('\n\n').map((p, i) => (
              <p key={i} className="leading-relaxed">{p}</p>
            ))}
          </div>
        </motion.div>
      )}

      {/* Risk flags */}
      {unresolvedFlags.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-bold font-display mb-4">Risk Flags ({unresolvedFlags.length})</h3>
          <div className="space-y-3">
            {unresolvedFlags.map((flag) => (
              <RiskFlagCard key={flag.id} flag={flag} onResolve={resolveRiskFlag} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Tax notes */}
      {taxNotes && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <h3 className="text-base font-bold font-display mb-3">Tax Exposure</h3>
          <p className="text-sm text-text-secondary">{taxNotes}</p>
        </motion.div>
      )}

      <div className="flex justify-center">
        <Button onClick={() => navigate('/app/plan')}>View Your Action Plan →</Button>
      </div>
    </div>
  );
};

export default AnalysisPage;

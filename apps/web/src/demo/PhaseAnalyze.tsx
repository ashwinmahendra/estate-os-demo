import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { DemoAsset, DemoProfile } from './DemoFlow';
import { IconEye, IconInfo } from './Icons';

const CATEGORY_COLORS: Record<string, string> = {
  cash: '#6BBF7B', stocks: '#7BA8D9', retirement: '#9B8EC4', real_estate: '#D48FA0',
  crypto: '#D4985C', business: '#5BADA0', insurance: '#A98BD4', vehicle: '#BFA052', other: '#D9756A',
};
const CATEGORY_LABELS: Record<string, string> = {
  cash: 'Cash & Savings', stocks: 'Stocks & Brokerage', retirement: 'Retirement', real_estate: 'Real Estate',
  crypto: 'Cryptocurrency', business: 'Business', insurance: 'Insurance', vehicle: 'Vehicles', other: 'Other',
};

interface Props {
  assets: DemoAsset[];
  profile: DemoProfile;
  totalValue: number;
  onNext: () => void;
  onBack: () => void;
}

function computeScore(assets: DemoAsset[], profile: DemoProfile) {
  let score = 30;
  if (assets.length >= 3) score += 15;
  if (assets.length >= 5) score += 10;
  const withBeneficiary = assets.filter(a => a.hasBeneficiary).length;
  if (assets.length > 0) score += Math.round((withBeneficiary / assets.length) * 25);
  if (profile.goals.length >= 2) score += 10;
  if (profile.state) score += 5;
  return Math.min(score, 100);
}

function generateRisks(assets: DemoAsset[], profile: DemoProfile) {
  const risks: { severity: 'critical' | 'high' | 'medium' | 'low'; title: string; desc: string; tip: string }[] = [];
  const noBeneficiary = assets.filter(a => !a.hasBeneficiary);
  const hasCrypto = assets.some(a => a.category === 'crypto');
  const totalVal = assets.reduce((s, a) => s + a.value, 0);

  risks.push({ severity: 'high', title: 'No Will on File', desc: 'Without a will, your state decides how assets are distributed.', tip: 'Create a Last Will & Testament - can be done online in ~1 hour for $100–$300.' });
  if (hasCrypto) risks.push({ severity: 'critical', title: 'Crypto Without Access Plan', desc: 'Cryptocurrency can be permanently lost without documented access instructions.', tip: 'Store wallet passwords and seed phrases in the Digital Vault with executor access.' });
  if (noBeneficiary.length > 0) risks.push({ severity: 'medium', title: `${noBeneficiary.length} Asset(s) Missing Beneficiary`, desc: `${noBeneficiary.map(a => a.name).join(', ')} have no named beneficiary.`, tip: 'Contact each institution to add beneficiary designations.' });
  if (profile.hasChildren) risks.push({ severity: 'high', title: 'Guardian Designation Needed', desc: 'If both parents pass, the court will decide who raises your children.', tip: 'Designate a guardian in your will immediately.' });
  if (totalVal > 500000) risks.push({ severity: 'medium', title: 'Consider a Revocable Trust', desc: `An estate of ${fmt(totalVal)} could benefit from a trust to avoid probate and maintain privacy.`, tip: 'Consult an estate planning attorney. Cost: $1,500–$5,000.' });
  return risks;
}

function generateTips(assets: DemoAsset[], profile: DemoProfile) {
  const tips: string[] = [];
  if (assets.some(a => a.category === 'business')) tips.push('Your business ownership requires structured succession planning to ensure smooth transition.');
  if (assets.some(a => a.category === 'crypto' || a.category === 'other')) tips.push('Digital and alternative assets need specific instructions to ensure your executor can access them.');
  if (profile.goals.includes('avoid_probate')) tips.push('To avoid probate, focus on placing major assets into a Living Trust and ensuring all accounts have named beneficiaries.');
  if (profile.goals.includes('guardianship') || profile.hasChildren) tips.push('A legal guardian nomination is critical to protect your minor children.');
  tips.push('Review your estate plan annually or after major life events (marriage, divorce, new child, new property).');
  return tips;
}

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const SEVERITY_CONFIG = {
  critical: { color: '#D9756A', bg: 'rgba(217,117,106,0.1)', label: 'CRITICAL' },
  high: { color: '#BFA052', bg: 'rgba(191,160,82,0.1)', label: 'HIGH' },
  medium: { color: '#D4985C', bg: 'rgba(212,152,92,0.1)', label: 'MEDIUM' },
  low: { color: '#6BBF7B', bg: 'rgba(107,191,123,0.1)', label: 'LOW' },
};

export const PhaseAnalyze: React.FC<Props> = ({ assets, profile, totalValue, onNext, onBack }) => {
  const [analyzing, setAnalyzing] = React.useState(true);
  const [scanMsg, setScanMsg] = React.useState(0);
  const msgs = ['Reviewing asset coverage...', 'Checking beneficiary gaps...', 'Analyzing digital assets...', 'Calculating estate health...'];

  const score = computeScore(assets, profile);
  const risks = generateRisks(assets, profile);
  const tips = generateTips(assets, profile);

  // Chart data
  const catMap = new Map<string, number>();
  assets.forEach(a => catMap.set(a.category, (catMap.get(a.category) || 0) + a.value));
  const chartData = Array.from(catMap.entries()).map(([cat, val]) => ({ name: CATEGORY_LABELS[cat] || cat, value: val, color: CATEGORY_COLORS[cat] || '#666' }));

  React.useEffect(() => {
    if (!analyzing) return;
    const t = setInterval(() => setScanMsg(i => (i + 1) % msgs.length), 800);
    const done = setTimeout(() => setAnalyzing(false), 3500);
    return () => { clearInterval(t); clearTimeout(done); };
  }, [analyzing]);

  if (analyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
        <div className="relative w-28 h-28">
          {[0, 1, 2].map(i => (
            <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-accent-gold/20"
              animate={{ scale: [1, 1.2 + i * 0.05, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} className="text-accent-gold">
              <IconEye size={28} />
            </motion.div>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={scanMsg} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="text-text-secondary text-sm">{msgs[scanMsg]}</motion.p>
        </AnimatePresence>
      </div>
    );
  }

  const scoreColor = score >= 80 ? '#6BBF7B' : score >= 60 ? '#BFA052' : '#D9756A';
  const scoreLabel = score >= 80 ? 'Good' : score >= 60 ? 'Fair' : 'Needs Attention';

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 03 - Analyze</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Your estate <span className="gradient-text">health</span>
        </h1>
        <p className="text-text-secondary mb-10 text-lg">Here's what our analysis found.</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Score card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-4 card p-6 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#2D2D28" strokeWidth="8" />
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 52}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - score / 100) }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span className="text-4xl font-bold mono-value" style={{ color: scoreColor }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{score}</motion.span>
              <span className="text-xs text-text-tertiary">/ 100</span>
            </div>
          </div>
          <span className="text-sm font-medium" style={{ color: scoreColor }}>{scoreLabel}</span>
          <span className="text-xs text-text-tertiary mt-1">Estate Readiness Score</span>
        </motion.div>

        {/* Net worth + chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-8 card p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <span className="text-xs text-text-tertiary uppercase tracking-wider">Net Worth</span>
              <div className="text-3xl font-bold mono-value mt-1">{fmt(totalValue)}</div>
              <div className="mt-4 space-y-2">
                {chartData.map(d => (
                  <div key={d.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-text-secondary">{d.name}</span>
                    </div>
                    <span className="mono-value font-medium">{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
            {chartData.length > 0 && (
              <div className="w-32 h-32 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={chartData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3}>
                    {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie></PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Risk flags */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
        <h3 className="text-sm font-semibold mb-3">Risk Flags ({risks.length})</h3>
        <div className="space-y-2">
          {risks.map((r, i) => {
            const cfg = SEVERITY_CONFIG[r.severity];
            return (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                className="card p-4" style={{ borderLeft: `3px solid ${cfg.color}` }}>
                <div className="flex items-start gap-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ color: cfg.color, background: cfg.bg }}>{cfg.label}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{r.title}</div>
                    <p className="text-xs text-text-secondary mt-0.5">{r.desc}</p>
                    <p className="text-xs text-accent-gold mt-2 flex items-center gap-1"><IconInfo size={12} /> {r.tip}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 card p-5">
        <h3 className="text-sm font-semibold mb-3">Estate Planning Tips</h3>
        <div className="space-y-2">
          {tips.map((t, i) => <p key={i} className="text-sm text-text-secondary flex gap-2"><span className="text-accent-gold shrink-0">→</span>{t}</p>)}
        </div>
      </motion.div>

      {/* Nav */}
      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors">← Back</button>
        <button onClick={onNext} className="px-8 py-3.5 rounded-xl font-medium text-sm bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all shadow-[0_4px_20px_rgba(191,160,82,0.3)]">
          Generate My Plan →
        </button>
      </div>
    </div>
  );
};

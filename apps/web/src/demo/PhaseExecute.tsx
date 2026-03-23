import React from 'react';
import { motion } from 'framer-motion';
import type { DemoAsset, DemoProfile } from './DemoFlow';
import { IconSparkle } from './Icons';

const CATEGORY_LABELS: Record<string, string> = {
  cash: 'Cash & Savings', stocks: 'Stocks & Brokerage', retirement: 'Retirement', real_estate: 'Real Estate',
  crypto: 'Cryptocurrency', business: 'Business', insurance: 'Insurance', vehicle: 'Vehicles', other: 'Other',
};

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const DOCS = [
  { id: 'dc', label: 'Certified Death Certificates (10+)', mandatory: true },
  { id: 'will', label: 'Original Last Will & Testament', mandatory: true },
  { id: 'trust', label: 'Living Trust Documents', mandatory: false },
  { id: 'letters', label: 'Letters Testamentary', mandatory: true },
];

interface Props {
  assets: DemoAsset[];
  profile: DemoProfile;
  totalValue: number;
  onBack: () => void;
  onRestart: () => void;
  onNext?: () => void;
}

export const PhaseExecute: React.FC<Props> = ({ assets, profile, totalValue, onBack, onRestart, onNext }) => {
  const [checks, setChecks] = React.useState<Record<string, boolean>>({});
  const toggle = (key: string) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const phases = [
    {
      title: 'Immediate Actions',
      duration: 'First 30 Days',
      items: [
        'Locate original Will and Trust documents',
        'Notify Social Security Administration',
        'Secure all physical property and vehicles',
        'Forward mail and cancel immediate subscriptions',
      ],
    },
    {
      title: 'Asset Gathering',
      duration: 'Months 1–3',
      items: [
        'Open an Estate Bank Account',
        'Notify all banks and financial institutions',
        ...assets.map(a => `Claim: ${a.name} (${CATEGORY_LABELS[a.category] || 'Asset'})`),
      ],
    },
    {
      title: 'Settlement & Closure',
      duration: 'Months 3–9',
      items: [
        'Pay valid debts and final expenses',
        'Distribute assets per Will / Trust terms',
        'Transfer property titles and deeds',
        'Close estate and file final accounting',
      ],
    },
  ];

  const totalItems = phases.reduce((s, p) => s + p.items.length, 0) + DOCS.length;
  const checkedItems = Object.values(checks).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 06 - Execute</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Executor <span className="gradient-text">handoff</span>
        </h1>
        <p className="text-text-secondary mb-10 text-lg">Your executor gets a complete, step-by-step settlement roadmap.</p>
      </motion.div>

      {/* Executor summary card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-gold/15 text-accent-gold font-medium">Executor Mode</span>
            <div className="text-sm text-text-secondary mt-2">
              Estate of <span className="text-text-primary font-medium">{profile.name || 'Estate Owner'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-text-tertiary">Estate Value</div>
            <div className="text-xl font-bold mono-value">{fmt(totalValue)}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div className="h-full bg-accent-gold rounded-full"
              animate={{ width: totalItems > 0 ? `${(checkedItems / totalItems) * 100}%` : '0%' }}
              transition={{ duration: 0.3 }} />
          </div>
          <span className="text-xs mono-value text-text-tertiary">{checkedItems}/{totalItems}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Settlement Roadmap */}
        <div>
          <h3 className="text-sm font-semibold mb-6">Settlement Roadmap</h3>
          <div className="relative border-l border-border/60 ml-3 space-y-8 pb-4">
            {phases.map((phase, pi) => (
              <motion.div key={pi} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + pi * 0.1 }} className="relative pl-6">
                <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-accent-gold shadow-[0_0_10px_rgba(191,160,82,0.4)]" />
                <div className="mb-3">
                  <div className="text-sm font-semibold text-text-primary">{phase.title}</div>
                  <div className="text-xs text-accent-gold font-medium mb-1 tracking-wide">{phase.duration}</div>
                </div>
                <div className="space-y-1.5">
                  {phase.items.map((item, ii) => {
                    const key = `task-${pi}-${ii}`;
                    const checked = checks[key] || false;
                    return (
                      <div key={key} onClick={() => toggle(key)} className="flex items-start gap-2.5 cursor-pointer group">
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                          checked ? 'bg-accent-gold border-accent-gold text-bg-primary' : 'border-border group-hover:border-accent-gold/40 text-transparent'
                        }`}>
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </div>
                        <span className={`text-sm transition-all leading-snug ${checked ? 'line-through text-text-tertiary' : 'text-text-secondary group-hover:text-text-primary'}`}>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Required Documents Checklist */}
        <div>
          <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-gold"><path d="M4 3v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6l-3-3H5a1 1 0 0 0-1 1z"/><path d="M13 3v3h3"/><path d="M8 9h4"/><path d="M8 13h4"/></svg>
            Required Documents
          </h3>
          <div className="space-y-2">
            {DOCS.map((doc, i) => {
              const key = `doc-${doc.id}`;
              const checked = checks[key] || false;
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
                  onClick={() => toggle(key)} className="card p-3 flex items-center gap-3 cursor-pointer group hover:border-accent-gold/20 transition-all">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked ? 'bg-accent-gold border-accent-gold text-bg-primary' : 'border-border group-hover:border-accent-gold/40 text-transparent'
                  }`}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm transition-all ${checked ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{doc.label}</span>
                  </div>
                  {doc.mandatory && <span className="text-[9px] uppercase tracking-wider bg-accent-red/10 text-accent-red px-1.5 py-0.5 rounded">Required</span>}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Institution directory */}
      {assets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 card p-5">
          <h3 className="text-sm font-semibold mb-3">Asset Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-border">
                  <th className="pb-2 text-text-tertiary font-medium text-xs">Asset</th>
                  <th className="pb-2 text-text-tertiary font-medium text-xs">Type</th>
                  <th className="pb-2 text-text-tertiary font-medium text-xs">Ownership</th>
                  <th className="pb-2 text-text-tertiary font-medium text-xs text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(a => (
                  <tr key={a.id} className="border-b border-border/50">
                    <td className="py-2.5 font-medium">{a.icon} {a.name}</td>
                    <td className="py-2.5 text-text-secondary">{CATEGORY_LABELS[a.category]}</td>
                    <td className="py-2.5 text-text-secondary">{a.ownership}</td>
                    <td className="py-2.5 text-right mono-value font-medium">{fmt(a.value)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border">
                  <td colSpan={3} className="py-2.5 font-semibold">Total Estate</td>
                  <td className="py-2.5 text-right mono-value font-bold text-accent-gold">{fmt(totalValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="mt-12 text-center card p-8 border-accent-gold/20">
        <div className="w-14 h-14 rounded-2xl bg-accent-gold/10 flex items-center justify-center mx-auto mb-4 text-accent-gold"><IconSparkle size={28} /></div>
        <h2 className="font-display text-2xl font-bold mb-3">That's Legacy</h2>
        <p className="text-text-secondary text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          You made it. You now have a complete, living estate plan that actually protects the people you care about. When the time comes, they won't inherit a mess—they'll inherit your legacy.
        </p>
        <div className="flex flex-col mx-auto w-full max-w-sm gap-3 group">
          <button onClick={onNext} className="w-full py-4 rounded-xl text-sm font-bold bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all shadow-[0_4px_24px_rgba(191,160,82,0.3)] hover:shadow-[0_6px_32px_rgba(191,160,82,0.4)] hover:scale-[1.02] flex items-center justify-center gap-2">
            Finish & Share Feedback <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
          <button onClick={onRestart} className="w-full py-3 rounded-xl text-xs font-medium text-text-tertiary hover:text-text-primary transition-colors">
            Start Over
          </button>
        </div>
      </motion.div>

      <div className="flex items-center justify-start mt-10">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors">← Back</button>
      </div>
    </div>
  );
};

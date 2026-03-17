import React from 'react';
import { motion } from 'framer-motion';
import type { DemoAsset, DemoProfile } from './DemoFlow';
import {
  IconDocument, IconPen, IconHospital, IconBank, IconLaptop,
  IconBaby, IconBuilding, IconUserGroup,
  IconDollar, IconClock,
} from './Icons';

interface Doc {
  type: string;
  title: string;
  Icon: React.FC<{ size?: number; className?: string; color?: string }>;
  desc: string;
  status: 'recommended' | 'optional' | 'nice-to-have';
  cost: string;
  time: string;
}

function getDocuments(profile: DemoProfile, assets: DemoAsset[], totalValue: number): Doc[] {
  const docs: Doc[] = [
    { type: 'will', title: 'Last Will & Testament', Icon: IconDocument, desc: 'The foundation of your estate plan. Specifies how your assets are distributed, and names guardians for minor children.', status: 'recommended', cost: '$100 – $1,000', time: '1–2 hours' },
    { type: 'poa', title: 'Durable Power of Attorney', Icon: IconPen, desc: 'Authorizes someone to manage your finances if you become incapacitated.', status: 'recommended', cost: '$100 – $300', time: '30 minutes' },
    { type: 'healthcare', title: 'Healthcare Directive', Icon: IconHospital, desc: 'Documents your healthcare wishes and designates a medical decision-maker.', status: 'recommended', cost: 'Free – $100', time: '30 minutes' },
  ];

  if (totalValue > 500000 || assets.some(a => a.category === 'real_estate')) {
    docs.splice(1, 0, { type: 'trust', title: 'Revocable Living Trust', Icon: IconBank, desc: 'Avoids probate, maintains privacy, gives you more control over distributions. Especially valuable with real estate.', status: 'recommended', cost: '$1,500 – $5,000', time: '1–2 weeks' });
  }

  if (assets.some(a => a.category === 'crypto')) {
    docs.push({ type: 'digital', title: 'Digital Asset Directive', Icon: IconLaptop, desc: 'Ensures your crypto, online accounts, and digital property are accessible to your executor.', status: 'recommended', cost: 'Included with will', time: '30 minutes' });
  }

  if (profile.hasChildren) {
    docs.push({ type: 'guardian', title: 'Guardian Designation', Icon: IconBaby, desc: 'Names who should care for your minor children if both parents pass away.', status: 'recommended', cost: 'Included with will', time: 'Included' });
  }

  if (assets.some(a => a.category === 'business')) {
    docs.push({ type: 'succession', title: 'Business Succession Plan', Icon: IconBuilding, desc: 'Ensures your business continues or is properly transferred upon your death or incapacity.', status: 'optional', cost: '$2,000 – $10,000', time: '2–4 weeks' });
  }

  docs.push({ type: 'beneficiary', title: 'Beneficiary Review', Icon: IconUserGroup, desc: 'Audit and update beneficiaries across all accounts to ensure they align with your wishes.', status: 'optional', cost: 'Free', time: '1 hour' });

  return docs;
}

interface Props {
  profile: DemoProfile;
  assets: DemoAsset[];
  totalValue: number;
  onNext: () => void;
  onBack: () => void;
}

const STATUS_CONFIG = {
  recommended: { color: '#D9756A', bg: 'rgba(217,117,106,0.1)', label: 'Recommended' },
  optional: { color: '#BFA052', bg: 'rgba(191,160,82,0.1)', label: 'Optional' },
  'nice-to-have': { color: '#6BBF7B', bg: 'rgba(107,191,123,0.1)', label: 'Nice to Have' },
};

export const PhaseGenerate: React.FC<Props> = ({ profile, assets, totalValue, onNext, onBack }) => {
  const docs = getDocuments(profile, assets, totalValue);
  const [generating, setGenerating] = React.useState(true);
  const [revealed, setRevealed] = React.useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => setGenerating(false), 2000);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (generating) return;
    if (revealed < docs.length) {
      const t = setTimeout(() => setRevealed(r => r + 1), 150);
      return () => clearTimeout(t);
    }
  }, [generating, revealed, docs.length]);

  const totalCostLow = docs.filter(d => d.status === 'recommended').length * 100;
  const totalCostHigh = docs.filter(d => d.status === 'recommended').length * 1500;
  const fmt = (n: number) => '$' + n.toLocaleString();

  if (generating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 rounded-2xl bg-bg-elevated flex items-center justify-center text-accent-gold">
          <IconDocument size={32} />
        </motion.div>
        <p className="text-text-secondary">Generating your personalized estate plan...</p>
        <div className="w-48 h-1 bg-border rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent-gold rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.8 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 04 - Generate</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Your personalized <span className="gradient-text">plan</span>
        </h1>
        <p className="text-text-secondary mb-4 text-lg">Based on your profile and assets, here's what you need.</p>
        <p className="text-xs text-text-tertiary mb-10">Estimated total cost for recommended items: <span className="text-accent-gold font-medium">{fmt(totalCostLow)} – {fmt(totalCostHigh)}</span></p>
      </motion.div>

      <div className="space-y-3">
        {docs.map((doc, i) => {
          const cfg = STATUS_CONFIG[doc.status];
          const visible = i < revealed;
          return (
            <motion.div
              key={doc.type}
              initial={{ opacity: 0, y: 20 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className={`card p-5 transition-all ${!visible ? 'opacity-0' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center text-text-secondary shrink-0 mt-0.5">
                  <doc.Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold">{doc.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ color: cfg.color, background: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{doc.desc}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1"><IconDollar size={12} /> {doc.cost}</span>
                    <span className="flex items-center gap-1"><IconClock size={12} /> {doc.time}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Why EstateOS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: revealed >= docs.length ? 1 : 0 }} className="mt-8 card p-5">
        <h3 className="text-sm font-semibold mb-3">Why EstateOS</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'AI-Personalized', Icon: IconDocument, desc: 'Every recommendation is tailored to your exact financial profile - not a generic template.', color: '#6BBF7B' },
            { label: 'Living Documents', Icon: IconClock, desc: 'Your plan updates as your life changes. Assets shift, beneficiaries evolve - your documents stay current.', color: '#7BA8D9' },
            { label: 'Full Execution', Icon: IconDollar, desc: 'Goes beyond plan generation - secure storage, executor briefing, and handoff are built in.', color: '#BFA052' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl bg-bg-elevated border border-border">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ color: item.color, background: `${item.color}15` }}>
                <item.Icon size={16} />
              </div>
              <div className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</div>
              <p className="text-xs text-text-tertiary mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors">← Back</button>
        <button onClick={onNext} className="px-8 py-3.5 rounded-xl font-medium text-sm bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all shadow-[0_4px_20px_rgba(191,160,82,0.3)]">
          Secure Your Vault →
        </button>
      </div>
    </div>
  );
};

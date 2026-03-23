import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DemoAsset } from './DemoFlow';
import {
  IconBanknote, IconTrendUp, IconBank, IconHome, IconBitcoin,
  IconBuilding, IconUmbrella, IconCar, IconDiamond, IconCoins,
  IconCheck, IconSquare, IconWarning, IconZap,
} from './Icons';

const CATEGORIES = [
  { key: 'cash', label: 'Cash & Savings', Icon: IconBanknote, color: '#6BBF7B' },
  { key: 'stocks', label: 'Stocks & Brokerage', Icon: IconTrendUp, color: '#7BA8D9' },
  { key: 'retirement', label: 'Retirement (401k/IRA)', Icon: IconBank, color: '#9B8EC4' },
  { key: 'real_estate', label: 'Real Estate', Icon: IconHome, color: '#D48FA0' },
  { key: 'crypto', label: 'Cryptocurrency', Icon: IconBitcoin, color: '#D4985C' },
  { key: 'business', label: 'Business Ownership', Icon: IconBuilding, color: '#5BADA0' },
  { key: 'insurance', label: 'Life Insurance', Icon: IconUmbrella, color: '#A98BD4' },
  { key: 'vehicle', label: 'Vehicles', Icon: IconCar, color: '#BFA052' },
  { key: 'other', label: 'Other Assets', Icon: IconDiamond, color: '#D9756A' },
];

const OWNERSHIP_OPTIONS = ['Sole Owner', 'Joint with Spouse', 'Joint Tenancy', 'In a Trust', 'Business Entity'];

interface Props {
  assets: DemoAsset[];
  addAsset: (asset: Omit<DemoAsset, 'id'>) => void;
  removeAsset: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PhaseQuantify: React.FC<Props> = ({ assets, addAsset, removeAsset, onNext, onBack }) => {
  const [formStep, setFormStep] = React.useState<0 | 1 | 2>(0); // 0=hidden, 1=select category, 2=enter details
  const [cat, setCat] = React.useState('');
  const [name, setName] = React.useState('');
  const [value, setValue] = React.useState('');
  const [ownership, setOwnership] = React.useState('Sole Owner');
  const [hasBeneficiary, setHasBeneficiary] = React.useState(false);

  const totalValue = assets.reduce((s, a) => s + a.value, 0);

  const handleAdd = () => {
    if (!cat || !name || !value) return;
    const meta = CATEGORIES.find(c => c.key === cat);
    addAsset({ category: cat, name, value: parseFloat(value) || 0, ownership, hasBeneficiary, icon: meta?.key || 'cash' });
    setCat(''); setName(''); setValue(''); setOwnership('Sole Owner'); setHasBeneficiary(false); setFormStep(0);
  };

  const handleRandomize = () => {
    const defaultAssets: Omit<DemoAsset, 'id'>[] = [
      { category: 'real_estate', name: 'Primary Residence', value: 850000, ownership: 'Joint with Spouse', hasBeneficiary: true, icon: 'real_estate' },
      { category: 'retirement', name: 'Fidelity 401(k)', value: 420000, ownership: 'Sole Owner', hasBeneficiary: true, icon: 'retirement' },
      { category: 'stocks', name: 'Vanguard Brokerage', value: 150000, ownership: 'Sole Owner', hasBeneficiary: false, icon: 'stocks' },
      { category: 'cash', name: 'Chase Checking', value: 45000, ownership: 'Joint with Spouse', hasBeneficiary: false, icon: 'cash' },
      { category: 'crypto', name: 'Coinbase Wallet', value: 28000, ownership: 'Sole Owner', hasBeneficiary: false, icon: 'crypto' },
    ];
    defaultAssets.forEach(a => addAsset(a));
  };

  const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  const getCategoryIcon = (catKey: string) => {
    const meta = CATEGORIES.find(c => c.key === catKey);
    if (!meta) return <IconCoins size={18} />;
    return <meta.Icon size={18} />;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 02 - Quantify</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          What do you <span className="gradient-text">own?</span>
        </h1>
        <p className="text-text-secondary mb-10 text-lg">Add your assets to build a complete estate picture.</p>
      </motion.div>

      {/* Running total banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-5 mb-8 flex items-center justify-between"
      >
        <div>
          <span className="text-xs text-text-tertiary uppercase tracking-wider">Total Estate Value</span>
          <div className="text-3xl font-bold mono-value mt-0.5">
            <motion.span key={totalValue} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {fmt(totalValue)}
            </motion.span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span>{assets.length} asset{assets.length !== 1 ? 's' : ''}</span>
          <button
            onClick={() => setFormStep(1)}
            className="px-4 py-2 bg-accent-gold text-bg-primary rounded-lg font-medium text-sm hover:bg-accent-gold-light transition-all shadow-[0_2px_12px_rgba(191,160,82,0.25)]"
          >
            + Add Asset
          </button>
        </div>
      </motion.div>

      {/* Asset list */}
      <div className="space-y-3 mb-8">
        <AnimatePresence>
          {assets.map((asset, i) => {
            const meta = CATEGORIES.find(c => c.key === asset.category);
            return (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="card p-4 flex items-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: meta?.color }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${meta?.color}15`, color: meta?.color }}>
                  {getCategoryIcon(asset.category)}
                </div>
                <div className="flex-1 min-w-0 pl-1">
                  <div className="font-medium text-sm">{asset.name}</div>
                  <div className="text-xs text-text-tertiary">{meta?.label} · {asset.ownership}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold mono-value">{fmt(asset.value)}</div>
                  <div className="text-xs text-text-tertiary flex items-center gap-1 justify-end">
                    {asset.hasBeneficiary
                      ? <><IconCheck size={12} color="#6BBF7B" /> Beneficiary</>
                      : <><IconWarning size={12} color="#BFA052" /> No beneficiary</>
                    }
                  </div>
                </div>
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-text-tertiary hover:text-accent-red p-1.5 rounded-lg hover:bg-bg-elevated"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 2l8 8M10 2l-8 8" /></svg>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {assets.length === 0 && formStep === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-bg-elevated flex items-center justify-center mx-auto mb-4 text-text-tertiary">
              <IconCoins size={28} />
            </div>
            <p className="text-text-secondary mb-2">No assets added yet</p>
            <p className="text-text-tertiary text-sm mb-6">Start by adding your first asset below</p>
            <button
              onClick={() => setFormStep(1)}
              className="px-6 py-3 bg-accent-gold text-bg-primary rounded-xl font-medium hover:bg-accent-gold-light transition-all shadow-[0_4px_20px_rgba(191,160,82,0.3)]"
            >
              + Add Your First Asset
            </button>

            <div className="mt-14 max-w-sm mx-auto p-6 rounded-2xl border border-dashed border-accent-gold/30 bg-accent-gold/5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/0 via-accent-gold/5 to-accent-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className="text-xs font-semibold text-accent-gold flex justify-center items-center gap-2 uppercase tracking-widest mb-2"><IconZap size={14} /> Cheat Code Activated</p>
              <p className="text-sm text-text-secondary mb-5 leading-relaxed">Don't feel like typing? Let us instantly generate a realistic, messy portfolio for you to analyze.</p>
              <button onClick={handleRandomize} className="w-full py-3 rounded-xl bg-bg-elevated border border-accent-gold/20 text-accent-gold text-sm font-medium hover:bg-accent-gold/10 hover:border-accent-gold/40 transition-all flex items-center justify-center gap-2">
                Randomize Demo Assets
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add asset form - Step 1: Category */}
      <AnimatePresence mode="wait">
        {formStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="card p-8 mb-8 relative border-accent-gold/20"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-display font-semibold mb-1">Select Asset Type</h3>
                <p className="text-text-tertiary text-sm">Choose the category that best fits your asset.</p>
              </div>
              <button onClick={() => setFormStep(0)} className="text-text-tertiary hover:text-text-primary p-2">✕</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CATEGORIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => { setCat(c.key); setFormStep(2); }}
                  className="card p-5 border-border hover:border-accent-gold/40 hover:bg-accent-gold/5 transition-all text-left group flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${c.color}15`, color: c.color }}>
                    <c.Icon size={20} />
                  </div>
                  <span className="font-medium text-sm text-text-secondary group-hover:text-text-primary transition-colors">{c.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Add asset form - Step 2: Details */}
        {formStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="card p-8 mb-8 border-accent-gold/20"
          >
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border/50">
              <button onClick={() => setFormStep(1)} className="text-text-tertiary hover:text-text-primary">← Back</button>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-text-secondary">
                {cat && getCategoryIcon(cat)}
                <span className="font-medium text-sm">{CATEGORIES.find(c => c.key === cat)?.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block mb-2">Asset Name</label>
                <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Chase Savings, 401k..."
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/50 focus:bg-accent-gold/5 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block mb-2">Estimated Value ($)</label>
                <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0"
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/50 focus:bg-accent-gold/5 transition-all mono-value font-medium text-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block mb-2">Ownership Structure</label>
                <select value={ownership} onChange={e => setOwnership(e.target.value)}
                  className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-text-primary outline-none focus:border-accent-gold/50 focus:bg-accent-gold/5 transition-all appearance-none cursor-pointer">
                  {OWNERSHIP_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-text-tertiary block mb-2 opacity-0">Options</label>
                <button
                  onClick={() => setHasBeneficiary(!hasBeneficiary)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    hasBeneficiary ? 'border-accent-green bg-accent-green/10 text-accent-green font-medium' : 'border-border bg-bg-elevated text-text-secondary hover:border-text-tertiary'
                  }`}
                >
                  {hasBeneficiary ? <IconCheck size={16} /> : <IconSquare size={16} />}
                  <span>Has Named Beneficiary</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-border/50">
              <button onClick={() => setFormStep(0)} className="px-6 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
              <button onClick={handleAdd} disabled={!name || !value}
                className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
                  name && value ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold-light' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed opacity-50'
                }`}>
                Add to Inventory
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors">← Back</button>
        <button
          onClick={onNext}
          disabled={assets.length === 0}
          className={`px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
            assets.length > 0
              ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold-light shadow-[0_4px_20px_rgba(191,160,82,0.3)]'
              : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'
          }`}
        >
          Analyze My Estate →
        </button>
      </div>
    </div>
  );
};

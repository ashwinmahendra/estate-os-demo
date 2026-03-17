import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DemoAsset } from './DemoFlow';
import {
  IconBitcoin, IconBank, IconUmbrella, IconKey, IconDocument,
  IconCoins, IconNote, IconLock, IconUnlock,
} from './Icons';

interface VaultEntry { id: string; category: string; title: string; content: string; access: string; iconKey: string; }

const ICON_FOR_CAT: Record<string, React.FC<{ size?: number; color?: string }>> = {
  'Crypto Keys': IconBitcoin,
  'Credentials': IconKey,
  'Insurance': IconUmbrella,
  'Legal Docs': IconDocument,
  'Financial': IconCoins,
  'Other': IconNote,
};

const defaultEntries = (assets: DemoAsset[]): VaultEntry[] => {
  const entries: VaultEntry[] = [];
  if (assets.some(a => a.category === 'crypto')) entries.push({ id: '1', category: 'Crypto Keys', title: 'Coinbase Recovery Phrase', content: '●●●●●● ●●●●●● ●●●●●● ●●●●●● ●●●●●● ●●●●●●', access: 'Executor on Death', iconKey: 'Crypto Keys' });
  entries.push({ id: '2', category: 'Credentials', title: 'Primary Bank Login', content: 'Username: ●●●●●●●●\nPassword: ●●●●●●●●●●●●', access: 'Executor on Death', iconKey: 'Credentials' });
  entries.push({ id: '3', category: 'Insurance', title: 'Life Insurance Policy #', content: 'Policy: LI-●●●●●●●●-2025\nProvider: ●●●●●● Life', access: 'Executor on Death', iconKey: 'Insurance' });
  return entries;
};

const ACCESS_OPTIONS = ['Private', 'Executor on Death', 'Executor on Incapacity', 'Always Accessible'];
const CAT_OPTIONS = [
  { value: 'Crypto Keys' }, { value: 'Credentials' },
  { value: 'Insurance' }, { value: 'Legal Docs' },
  { value: 'Financial' }, { value: 'Other' },
];

interface Props { assets: DemoAsset[]; onNext: () => void; onBack: () => void; }

export const PhaseSecure: React.FC<Props> = ({ assets, onNext, onBack }) => {
  const [entries, setEntries] = React.useState<VaultEntry[]>(() => defaultEntries(assets));
  const [showForm, setShowForm] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [access, setAccess] = React.useState('Executor on Death');
  const [cat, setCat] = React.useState('Credentials');
  const [revealed, setRevealed] = React.useState<string | null>(null);

  const handleAdd = () => {
    if (!title || !content) return;
    setEntries(prev => [...prev, { id: crypto.randomUUID(), category: cat, title, content, access, iconKey: cat }]);
    setTitle(''); setContent(''); setShowForm(false);
  };

  const renderIcon = (iconKey: string, size = 18) => {
    const IconComp = ICON_FOR_CAT[iconKey] || IconNote;
    return <IconComp size={size} />;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 05 - Secure</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Your digital <span className="gradient-text">vault</span>
        </h1>
        <p className="text-text-secondary mb-10 text-lg">Securely store sensitive information. Released only to the right person, at the right time.</p>
      </motion.div>

      {/* Encryption banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-4 mb-8 flex items-center gap-3 border-accent-gold/20 bg-accent-gold/5">
        <div className="text-accent-gold"><IconLock size={20} /></div>
        <div>
          <p className="text-sm font-medium text-accent-gold">End-to-end encrypted</p>
          <p className="text-xs text-text-tertiary">Your data is encrypted at rest. Only you control access.</p>
        </div>
      </motion.div>

      {/* Entries */}
      <div className="space-y-3 mb-6">
        {entries.map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
            className="card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-elevated flex items-center justify-center text-text-secondary shrink-0">
                  {renderIcon(entry.iconKey)}
                </div>
                <div>
                  <div className="text-sm font-medium">{entry.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-elevated text-text-tertiary">{entry.category}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-teal/10 text-accent-teal">{entry.access}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setRevealed(revealed === entry.id ? null : entry.id)}
                className="text-xs text-text-tertiary hover:text-text-primary transition-colors px-2 py-1 rounded flex items-center gap-1">
                {revealed === entry.id ? <><IconUnlock size={12} /> Hide</> : <><IconLock size={12} /> Reveal</>}
              </button>
            </div>
            <AnimatePresence>
              {revealed === entry.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-border">
                  <pre className="text-xs text-text-secondary bg-bg-elevated p-3 rounded-lg font-mono whitespace-pre-wrap">{entry.content}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm ? (
          <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="card p-5 mb-6 overflow-hidden">
            <h3 className="text-sm font-semibold mb-4">Add to Vault</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {CAT_OPTIONS.map(c => (
                <button key={c.value} onClick={() => setCat(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${cat === c.value ? 'border-accent-gold bg-accent-gold/8 text-accent-gold' : 'border-border bg-bg-elevated text-text-secondary'}`}>
                  {renderIcon(c.value, 12)} {c.value}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (e.g., Chase Login)"
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/40" />
              <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Sensitive content..."
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none min-h-[80px] focus:border-accent-gold/40 font-mono" />
              <select value={access} onChange={e => setAccess(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary outline-none appearance-none">
                {ACCESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-text-secondary">Cancel</button>
              <button onClick={handleAdd} disabled={!title || !content}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${title && content ? 'bg-accent-gold text-bg-primary' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>Add</button>
            </div>
          </motion.div>
        ) : (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowForm(true)}
            className="w-full card p-4 text-center text-sm text-text-secondary hover:text-accent-gold hover:border-accent-gold/20 transition-all border-dashed">
            + Add another vault item
          </motion.button>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mt-10">
        <button onClick={onBack} className="px-5 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors">← Back</button>
        <button onClick={onNext} className="px-8 py-3.5 rounded-xl font-medium text-sm bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all shadow-[0_4px_20px_rgba(191,160,82,0.3)]">
          Executor Handoff →
        </button>
      </div>
    </div>
  );
};

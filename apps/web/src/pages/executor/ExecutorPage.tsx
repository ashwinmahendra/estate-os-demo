import React from 'react';
import { motion } from 'framer-motion';
const logoUrl = '/estate-os-demo/logo.png';
import { useAssetStore } from '@/store/assetStore';
import { useEstateStore } from '@/store/estateStore';
import { Badge, Button } from '@/components/ui';
import { formatCurrency, ASSET_CATEGORY_META } from '@/lib/utils';

const ExecutorPage: React.FC = () => {
  const { assets } = useAssetStore();
  const { executors, vaultItems, planItems } = useEstateStore();
  const [status] = React.useState<'living' | 'deceased'>('living');

  const checklist = {
    immediate: [
      'Obtain certified death certificates (need ~10 copies)',
      'Notify Social Security Administration',
      'Contact all financial institutions',
      'Secure physical property',
      'File for probate (if required)',
    ],
    gathering: assets.map(a => {
      const meta = ASSET_CATEGORY_META[a.category];
      return `${meta?.icon} ${a.name}${a.institution ? ` at ${a.institution}` : ''}: ${formatCurrency(a.estimatedValue)}`;
    }),
    distribution: [
      'Pay valid debts and taxes',
      'File final income tax return',
      'Distribute assets per will / trust terms',
      'Close estate',
    ],
  };

  const accessibleVault = vaultItems.filter(v => v.accessLevel !== 'PRIVATE');

  return (
    <div className="min-h-screen bg-bg-primary">
      <nav className="h-24 border-b border-border bg-bg-card flex items-center px-6">
        <div className="flex items-center gap-2">
          <img src={logoUrl} alt="Legacy" className="h-16 w-auto object-contain" />
          <Badge variant="gold" className="ml-2">Executor Mode</Badge>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h1 className="text-2xl font-bold font-display mb-2">Estate Settlement Dashboard</h1>
          <p className="text-text-secondary">You are the designated executor. This checklist guides you through the settlement process.</p>
          <div className="mt-4 flex items-center gap-3">
            <Badge variant={status === 'living' ? 'success' : 'danger'}>{status === 'living' ? 'Estate Owner: Living' : 'Estate Settlement: Active'}</Badge>
            <span className="text-sm text-text-tertiary">{assets.length} assets · {formatCurrency(assets.reduce((s, a) => s + a.estimatedValue, 0))} total value</span>
          </div>
        </motion.div>

        {/* Settlement Checklist */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="text-sm font-semibold text-accent-red mb-3">Phase 1: Immediate (0–30 days)</h3>
          <div className="space-y-2">
            {checklist.immediate.map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 card cursor-pointer hover:bg-bg-elevated/50 transition-all">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-accent-gold" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">Phase 2: Asset Gathering (30–90 days)</h3>
          <div className="space-y-2">
            {checklist.gathering.length > 0 ? checklist.gathering.map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 card cursor-pointer hover:bg-bg-elevated/50 transition-all">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-accent-gold" />
                <span className="text-sm">{item}</span>
              </label>
            )) : <p className="text-sm text-text-tertiary">No assets in inventory.</p>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="text-sm font-semibold text-accent-green mb-3">Phase 3: Distribution (90–180 days)</h3>
          <div className="space-y-2">
            {checklist.distribution.map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 card cursor-pointer hover:bg-bg-elevated/50 transition-all">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-accent-gold" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Vault Access */}
        {accessibleVault.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Documents & Vault Access</h3>
            <div className="space-y-2">
              {accessibleVault.map(v => (
                <div key={v.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
                  <span className="text-sm">{v.title}</span>
                  <Badge variant="info">{v.category.replace(/_/g, ' ')}</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Institution Directory */}
        {assets.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-3">Institution Contact Directory</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-left border-b border-border">
                  <th className="pb-2 text-text-tertiary font-medium">Institution</th>
                  <th className="pb-2 text-text-tertiary font-medium">Asset</th>
                  <th className="pb-2 text-text-tertiary font-medium">Category</th>
                  <th className="pb-2 text-text-tertiary font-medium text-right">Value</th>
                </tr></thead>
                <tbody>{assets.map(a => (
                  <tr key={a.id} className="border-b border-border/50">
                    <td className="py-2 text-text-primary">{a.institution || '-'}</td>
                    <td className="py-2 text-text-secondary">{a.name}</td>
                    <td className="py-2"><Badge variant="default">{ASSET_CATEGORY_META[a.category]?.label}</Badge></td>
                    <td className="py-2 text-right mono-value">{formatCurrency(a.estimatedValue)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExecutorPage;

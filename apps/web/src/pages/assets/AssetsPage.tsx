import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssetStore } from '@/store/assetStore';
import { Button, Input, Modal, Toggle, Badge, CountUp, EmptyState, Select } from '@/components/ui';
import { cn, formatCurrency, ASSET_CATEGORY_META, getRelativeTime, generateId } from '@/lib/utils';
import type { Asset, AssetCategory, OwnershipType } from '@/lib/types';

// ─── Asset Category Sidebar ─────────────────────────────────
const CategorySidebar: React.FC<{
  activeCategory: string;
  onSelect: (cat: string) => void;
}> = ({ activeCategory, onSelect }) => {
  const { assets, getCategoryBreakdown, getTotalValue } = useAssetStore();
  const breakdown = getCategoryBreakdown();
  const total = getTotalValue();

  const categories = [
    { key: 'ALL', label: 'All Assets', count: assets.length, value: total },
    ...Object.entries(ASSET_CATEGORY_META).map(([key, meta]) => {
      const cat = breakdown.find((b) => b.category === key);
      return { key, label: meta.label, icon: meta.icon, count: cat?.count || 0, value: cat?.value || 0 };
    }).filter(c => c.count > 0 || ['CASH', 'BROKERAGE', 'RETIREMENT', 'REAL_ESTATE', 'CRYPTO', 'INSURANCE'].includes(c.key)),
  ];

  return (
    <aside className="w-64 border-r border-border bg-bg-card/50 overflow-y-auto shrink-0 hidden lg:block">
      <div className="p-4 space-y-0.5">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onSelect(cat.key)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
              activeCategory === cat.key
                ? 'bg-accent-gold/10 text-accent-gold'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
            )}
          >
            <div className="flex items-center gap-2">
              {'icon' in cat && <span>{cat.icon}</span>}
              <span className="font-medium truncate">{cat.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {cat.count > 0 && (
                <span className="text-xs text-text-tertiary">{cat.count}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

// ─── Asset Card ──────────────────────────────────────────────
const AssetCard: React.FC<{ asset: Asset; onEdit: (asset: Asset) => void; onDelete: (id: string) => void }> = ({ asset, onEdit, onDelete }) => {
  const meta = ASSET_CATEGORY_META[asset.category];
  const health = asset.hasNamedBeneficiary ? 'complete' : asset.category === 'CRYPTO' && !asset.hasSuccessorAccess ? 'critical' : 'review';

  const healthConfig = {
    complete: { color: 'bg-accent-green', label: '✅ Complete', badge: 'success' as const },
    review: { color: 'bg-yellow-400', label: '⚠️ Review', badge: 'warning' as const },
    critical: { color: 'bg-accent-red', label: '🔴 Action Needed', badge: 'danger' as const },
  };
  const h = healthConfig[health];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card card-hover p-5 flex items-start gap-4 relative overflow-hidden"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl`} style={{ backgroundColor: meta?.color }} />
      <div className="flex-1 min-w-0 pl-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>{meta?.icon}</span>
              <h4 className="font-semibold text-text-primary">{asset.name}</h4>
            </div>
            <p className="text-xs text-text-secondary">
              {meta?.label} · {asset.ownershipType === 'SOLE' ? 'Sole Ownership' : asset.ownershipType.replace(/_/g, ' ')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(asset)} className="text-text-tertiary hover:text-text-primary transition-colors p-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
            <button onClick={() => onDelete(asset.id)} className="text-text-tertiary hover:text-accent-red transition-colors p-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.2" /></svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold mono-value">{formatCurrency(asset.estimatedValue)}</span>
          <Badge variant={h.badge}>{h.label}</Badge>
        </div>
        {asset.institution && (
          <p className="text-xs text-text-tertiary mt-2">{asset.institution} · Updated {getRelativeTime(asset.updatedAt)}</p>
        )}
      </div>
    </motion.div>
  );
};

// ─── Add Asset Modal ─────────────────────────────────────────
const AddAssetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  editAsset?: Asset;
}> = ({ isOpen, onClose, editAsset }) => {
  const { addAsset, updateAsset } = useAssetStore();
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<Partial<Asset>>({
    category: editAsset?.category || undefined,
    name: editAsset?.name || '',
    institution: editAsset?.institution || '',
    estimatedValue: editAsset?.estimatedValue || 0,
    ownershipType: editAsset?.ownershipType || 'SOLE',
    ownershipPercentage: editAsset?.ownershipPercentage || 100,
    hasNamedBeneficiary: editAsset?.hasNamedBeneficiary || false,
    currency: 'USD',
    isDigitalAsset: false,
    ...editAsset,
  });

  React.useEffect(() => {
    if (editAsset) {
      setFormData(editAsset);
      setStep(2);
    } else {
      setFormData({
        name: '', institution: '', estimatedValue: 0, ownershipType: 'SOLE' as OwnershipType,
        ownershipPercentage: 100, hasNamedBeneficiary: false, currency: 'USD', isDigitalAsset: false,
      });
      setStep(1);
    }
  }, [editAsset, isOpen]);

  const update = (data: Partial<Asset>) => setFormData((prev) => ({ ...prev, ...data }));

  const handleSave = () => {
    if (editAsset) {
      updateAsset(editAsset.id, formData);
    } else {
      addAsset(formData as Omit<Asset, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  const categoryOptions = Object.entries(ASSET_CATEGORY_META).map(([key, meta]) => ({
    value: key,
    emoji: meta.icon,
    title: meta.label,
    description: '',
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editAsset ? 'Edit Asset' : 'Add Asset'} size="lg">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-text-secondary mb-4">What type of asset is this?</p>
            <div className="grid grid-cols-3 gap-3">
              {categoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { update({ category: opt.value as AssetCategory }); setStep(2); }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer',
                    formData.category === opt.value
                      ? 'border-accent-gold bg-accent-gold/10'
                      : 'border-border hover:border-border-light bg-bg-elevated'
                  )}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="text-xs font-medium text-center">{opt.title}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
              <span>{ASSET_CATEGORY_META[formData.category!]?.icon}</span>
              <span>{ASSET_CATEGORY_META[formData.category!]?.label}</span>
              {!editAsset && (
                <button onClick={() => setStep(1)} className="ml-auto text-accent-gold text-xs">Change</button>
              )}
            </div>
            <Input label="Asset Name" placeholder="e.g., Fidelity 401(k)" value={formData.name || ''} onChange={(e) => update({ name: e.target.value })} />
            <Input label="Institution" placeholder="e.g., Fidelity, Chase, Coinbase" value={formData.institution || ''} onChange={(e) => update({ institution: e.target.value })} />
            <Input label="Estimated Value ($)" type="number" placeholder="0" value={formData.estimatedValue?.toString() || ''} onChange={(e) => update({ estimatedValue: parseFloat(e.target.value) || 0 })} />
            <Select
              label="Ownership Type"
              options={[
                { value: 'SOLE', label: 'Sole Ownership' },
                { value: 'JOINT_WITH_SPOUSE', label: 'Joint with Spouse' },
                { value: 'JOINT_TENANCY', label: 'Joint Tenancy' },
                { value: 'TRUST', label: 'In a Trust' },
                { value: 'BUSINESS_ENTITY', label: 'Business Entity' },
              ]}
              value={formData.ownershipType}
              onChange={(val) => update({ ownershipType: val as OwnershipType })}
            />
            <Toggle
              label="Named beneficiary on file?"
              checked={formData.hasNamedBeneficiary || false}
              onChange={(checked) => update({ hasNamedBeneficiary: checked })}
            />
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1" disabled={!formData.name || !formData.category}>
                {editAsset ? 'Save Changes' : 'Add Asset'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

// ─── Main Assets Page ────────────────────────────────────────
const AssetsPage: React.FC = () => {
  const { assets, deleteAsset, getTotalValue, getNetValue } = useAssetStore();
  const [activeCategory, setActiveCategory] = React.useState('ALL');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editAsset, setEditAsset] = React.useState<Asset | undefined>();

  const filtered = activeCategory === 'ALL'
    ? assets
    : assets.filter((a) => a.category === activeCategory);

  const totalValue = getTotalValue();
  const netValue = getNetValue();

  return (
    <div className="flex h-full">
      <CategorySidebar activeCategory={activeCategory} onSelect={setActiveCategory} />

      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 glass border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <span className="text-xs text-text-tertiary uppercase tracking-wider">Total Estate Value</span>
                <div className="text-2xl font-bold mono-value">
                  <CountUp end={totalValue} prefix="$" formatter={(n) => n.toLocaleString()} />
                </div>
              </div>
              <div className="w-px h-10 bg-border hidden md:block" />
              <div className="hidden md:block">
                <span className="text-xs text-text-tertiary uppercase tracking-wider">After Debts</span>
                <div className="text-lg font-semibold mono-value text-accent-green">
                  {formatCurrency(netValue)}
                </div>
              </div>
            </div>
            <Button onClick={() => { setEditAsset(undefined); setShowAddModal(true); }}>
              + Add Asset
            </Button>
          </div>
        </div>

        {/* Asset list */}
        <div className="p-6">
          {filtered.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No assets yet"
              description="Start building your estate inventory by adding your first asset."
              action={
                <Button onClick={() => { setEditAsset(undefined); setShowAddModal(true); }}>
                  + Add Your First Asset
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 max-w-3xl">
              {filtered.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={(a) => { setEditAsset(a); setShowAddModal(true); }}
                  onDelete={deleteAsset}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddAssetModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditAsset(undefined); }}
        editAsset={editAsset}
      />
    </div>
  );
};

export default AssetsPage;

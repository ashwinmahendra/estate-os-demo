import React from 'react';
import { motion } from 'framer-motion';
import { useEstateStore } from '@/store/estateStore';
import { Button, Input, Modal, Badge, EmptyState, Select, Toggle } from '@/components/ui';
import { cn, VAULT_CATEGORY_META } from '@/lib/utils';
import type { VaultCategory, VaultAccessLevel, VaultItem } from '@/lib/types';

const VaultItemCard: React.FC<{ item: VaultItem; onEdit: (i: VaultItem) => void; onDelete: (id: string) => void }> = ({ item, onEdit, onDelete }) => {
  const [show, setShow] = React.useState(false);
  const meta = VAULT_CATEGORY_META[item.category];
  const labels: Record<string, string> = { PRIVATE: 'Only you', EXECUTOR_ON_DEATH: 'Executor on death', EXECUTOR_ON_INCAPACITY: 'Executor on incapacity/death', ALWAYS_ACCESSIBLE: 'Always accessible' };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">{meta?.icon || '📝'}</span>
          <div>
            <h4 className="text-sm font-semibold">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default">{meta?.label}</Badge>
              <Badge variant="info">{labels[item.accessLevel]}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShow(!show)} className="text-text-tertiary hover:text-text-primary p-1 text-xs">{show ? '🔓' : '🔒'}</button>
          <button onClick={() => onEdit(item)} className="text-text-tertiary hover:text-text-primary p-1">✏️</button>
          <button onClick={() => onDelete(item.id)} className="text-text-tertiary hover:text-accent-red p-1">✕</button>
        </div>
      </div>
      {show && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="bg-bg-elevated rounded-lg p-3 font-mono text-sm text-text-secondary whitespace-pre-wrap">{item.encryptedContent}</div>
          {item.executorNote && <p className="text-xs text-text-tertiary mt-2">📝 {item.executorNote}</p>}
        </div>
      )}
    </div>
  );
};

const VaultPage: React.FC = () => {
  const { vaultItems, addVaultItem, updateVaultItem, deleteVaultItem } = useEstateStore();
  const [showModal, setShowModal] = React.useState(false);
  const [editItem, setEditItem] = React.useState<VaultItem | undefined>();
  const [filter, setFilter] = React.useState('ALL');
  const [category, setCategory] = React.useState<VaultCategory>('ACCOUNT_CREDENTIALS');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [accessLevel, setAccessLevel] = React.useState<VaultAccessLevel>('PRIVATE');
  const [note, setNote] = React.useState('');

  const openAdd = () => { setEditItem(undefined); setTitle(''); setContent(''); setNote(''); setCategory('ACCOUNT_CREDENTIALS'); setAccessLevel('PRIVATE'); setShowModal(true); };
  const openEdit = (item: VaultItem) => { setEditItem(item); setTitle(item.title); setContent(item.encryptedContent); setNote(item.executorNote || ''); setCategory(item.category); setAccessLevel(item.accessLevel); setShowModal(true); };
  const handleSave = () => {
    const data = { category, title, encryptedContent: content, accessLevel, executorCanAccess: accessLevel !== 'PRIVATE', executorNote: note };
    if (editItem) updateVaultItem(editItem.id, data); else addVaultItem(data);
    setShowModal(false);
  };

  const filtered = filter === 'ALL' ? vaultItems : vaultItems.filter(v => v.category === filter);
  const criticals = ['CRYPTO_KEYS', 'FINANCIAL_ACCOUNTS', 'INSURANCE_POLICIES'];
  const missing = criticals.filter(c => !vaultItems.some(v => v.category === c));

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-display">Digital Vault</h2>
          <Button onClick={openAdd}>+ Add to Vault</Button>
        </div>
        <p className="text-sm text-text-secondary">Vault: <span className="text-accent-gold font-medium">{criticals.length - missing.length}/{criticals.length} critical items</span></p>
        {missing.length > 0 && <div className="mt-2 space-y-1">{missing.map(c => <div key={c} className="text-xs text-accent-red">❌ {VAULT_CATEGORY_META[c]?.label} missing</div>)}</div>}
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {['ALL', ...Object.keys(VAULT_CATEGORY_META)].map(k => {
          const count = k === 'ALL' ? vaultItems.length : vaultItems.filter(v => v.category === k).length;
          if (k !== 'ALL' && count === 0) return null;
          return <button key={k} onClick={() => setFilter(k)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all', filter === k ? 'bg-accent-gold text-bg-primary border-accent-gold' : 'bg-bg-elevated text-text-secondary border-border')}>{k === 'ALL' ? `All (${count})` : `${VAULT_CATEGORY_META[k]?.icon} (${count})`}</button>;
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">{filtered.map(item => <VaultItemCard key={item.id} item={item} onEdit={openEdit} onDelete={deleteVaultItem} />)}</div>
      ) : (
        <EmptyState icon="🔐" title="Vault is empty" description="Store crypto keys, passwords, and sensitive info securely." action={<Button onClick={openAdd}>Add First Item</Button>} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Vault Item' : 'Add to Vault'}>
        <div className="space-y-4">
          <Select label="Category" options={Object.entries(VAULT_CATEGORY_META).map(([k, m]) => ({ value: k, label: `${m.icon} ${m.label}` }))} value={category} onChange={v => setCategory(v as VaultCategory)} />
          <Input label="Title" placeholder="e.g., Coinbase Login" value={title} onChange={e => setTitle(e.target.value)} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Enter sensitive info..." className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none min-h-[100px] focus:border-accent-gold/50" />
          </div>
          <div className="card p-3 bg-accent-gold/5 border-accent-gold/20"><p className="text-xs text-accent-gold">🔒 Encrypted. Even Legacy cannot read it.</p></div>
          <Select label="Access Level" options={[{ value: 'PRIVATE', label: 'Only me' }, { value: 'EXECUTOR_ON_DEATH', label: 'Executor on death' }, { value: 'EXECUTOR_ON_INCAPACITY', label: 'Executor on incapacity/death' }, { value: 'ALWAYS_ACCESSIBLE', label: 'Always accessible' }]} value={accessLevel} onChange={v => setAccessLevel(v as VaultAccessLevel)} />
          <Input label="Note for executor" placeholder="Optional instructions" value={note} onChange={e => setNote(e.target.value)} />
          <div className="flex gap-3"><Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button><Button onClick={handleSave} className="flex-1" disabled={!title || !content}>{editItem ? 'Save' : 'Add'}</Button></div>
        </div>
      </Modal>
    </div>
  );
};

export default VaultPage;

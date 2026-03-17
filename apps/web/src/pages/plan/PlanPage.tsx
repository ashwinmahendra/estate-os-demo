import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEstateStore } from '@/store/estateStore';
import { useUserStore } from '@/store/userStore';
import { Button, Badge, Input, ProgressRing, Modal, Toggle } from '@/components/ui';
import { cn, formatCurrency } from '@/lib/utils';
import type { PlanItem, Beneficiary, Executor } from '@/lib/types';

// ─── Plan Item Card ──────────────────────────────────────────
const PlanItemCard: React.FC<{ item: PlanItem; onComplete: (id: string) => void }> = ({ item, onComplete }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div layout className="card overflow-hidden">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-bg-elevated/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); if (!item.isCompleted) onComplete(item.id); }}
          className={cn(
            'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
            item.isCompleted
              ? 'bg-accent-green border-accent-green'
              : 'border-border hover:border-accent-gold'
          )}
        >
          {item.isCompleted && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6L5 8.5L9.5 4" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className={cn('font-medium text-sm', item.isCompleted && 'line-through text-text-tertiary')}>
            {item.title}
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.estimatedCost !== undefined && item.estimatedCost > 0 && (
            <span className="text-xs text-text-tertiary mono-value">{formatCurrency(item.estimatedCost)}</span>
          )}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={cn('transition-transform text-text-tertiary', expanded && 'rotate-180')}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {item.whyItMatters && (
                <div>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider">Why It Matters</span>
                  <p className="text-sm text-text-secondary mt-1">{item.whyItMatters}</p>
                </div>
              )}
              {item.howToComplete && (
                <div>
                  <span className="text-xs text-text-tertiary uppercase tracking-wider mb-2 block">How to Complete</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="card p-3">
                      <div className="text-xs font-medium text-accent-green mb-1">DIY</div>
                      <p className="text-xs text-text-secondary">{item.howToComplete.diy}</p>
                    </div>
                    <div className="card p-3">
                      <div className="text-xs font-medium text-accent-teal mb-1">Online Service</div>
                      <p className="text-xs text-text-secondary">{item.howToComplete.online.platform} - {item.howToComplete.online.cost}</p>
                    </div>
                    <div className="card p-3">
                      <div className="text-xs font-medium text-accent-gold mb-1">Attorney</div>
                      <p className="text-xs text-text-secondary">{item.howToComplete.attorney}</p>
                    </div>
                  </div>
                </div>
              )}
              {item.timeToComplete && (
                <p className="text-xs text-text-tertiary">⏱ {item.timeToComplete}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Beneficiary Panel ───────────────────────────────────────
const BeneficiaryPanel: React.FC = () => {
  const { beneficiaries, addBeneficiary, updateBeneficiary, deleteBeneficiary } = useEstateStore();
  const [showAdd, setShowAdd] = React.useState(false);
  const [name, setName] = React.useState('');
  const [relationship, setRelationship] = React.useState('');
  const [share, setShare] = React.useState(0);

  const handleAdd = () => {
    if (!name) return;
    addBeneficiary({ name, relationship, share, isPrimary: true, isContingent: false, isMinor: false });
    setName(''); setRelationship(''); setShare(0); setShowAdd(false);
  };

  const totalShare = beneficiaries.reduce((s, b) => s + (b.share || 0), 0);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Beneficiaries</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}>+ Add</Button>
      </div>

      {beneficiaries.length > 0 ? (
        <div className="space-y-3">
          {beneficiaries.map((b) => (
            <div key={b.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
              <div>
                <div className="text-sm font-medium">{b.name}</div>
                <div className="text-xs text-text-tertiary">{b.relationship}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold mono-value text-accent-gold">{b.share || 0}%</div>
                  <Badge variant={b.isPrimary ? 'gold' : 'default'} className="text-xs">
                    {b.isPrimary ? 'Primary' : 'Contingent'}
                  </Badge>
                </div>
                <button onClick={() => deleteBeneficiary(b.id)} className="text-text-tertiary hover:text-accent-red transition-colors p-1">
                  ✕
                </button>
              </div>
            </div>
          ))}
          {totalShare !== 100 && totalShare > 0 && (
            <p className="text-xs text-accent-red">⚠️ Total shares: {totalShare}% - should equal 100%</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-tertiary">No beneficiaries added yet.</p>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-3"
          >
            <Input label="Name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Relationship" placeholder="e.g., Spouse, Child" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            <Input label="Share (%)" type="number" placeholder="0" value={share.toString()} onChange={(e) => setShare(Number(e.target.value))} />
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAdd} disabled={!name}>Add Beneficiary</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Executor Panel ──────────────────────────────────────────
const ExecutorPanel: React.FC = () => {
  const { executors, addExecutor, deleteExecutor } = useEstateStore();
  const [showAdd, setShowAdd] = React.useState(false);
  const [name, setName] = React.useState('');
  const [relationship, setRelationship] = React.useState('');
  const [email, setEmail] = React.useState('');

  const handleAdd = () => {
    if (!name) return;
    addExecutor({ name, relationship, email, isPrimary: executors.length === 0, isAlternate: executors.length > 0, hasAcceptedRole: false });
    setName(''); setRelationship(''); setEmail(''); setShowAdd(false);
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Executors</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowAdd(!showAdd)}>+ Add</Button>
      </div>

      {executors.length > 0 ? (
        <div className="space-y-3">
          {executors.map((e) => (
            <div key={e.id} className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg">
              <div>
                <div className="text-sm font-medium">{e.name}</div>
                <div className="text-xs text-text-tertiary">{e.relationship} {e.email && `· ${e.email}`}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={e.isPrimary ? 'gold' : 'default'}>
                  {e.isPrimary ? 'Primary' : 'Alternate'}
                </Badge>
                <button onClick={() => deleteExecutor(e.id)} className="text-text-tertiary hover:text-accent-red transition-colors p-1">✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-tertiary">No executors designated yet.</p>
      )}

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-border space-y-3"
          >
            <Input label="Full Name" placeholder="Executor's full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Relationship" placeholder="e.g., Spouse, Sibling, Attorney" value={relationship} onChange={(e) => setRelationship(e.target.value)} />
            <Input label="Email" type="email" placeholder="executor@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAdd} disabled={!name}>Add Executor</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Plan Page ──────────────────────────────────────────
const PlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { planItems, completePlanItem, hasAnalyzed } = useEstateStore();
  const completed = planItems.filter(p => p.isCompleted).length;
  const progress = planItems.length > 0 ? Math.round((completed / planItems.length) * 100) : 0;

  const immediateItems = planItems.filter(p => p.priority === 1);
  const shortTermItems = planItems.filter(p => p.priority === 2);
  const ongoingItems = planItems.filter(p => p.priority >= 3);

  if (!hasAnalyzed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-6">
        <span className="text-5xl">📋</span>
        <h2 className="text-2xl font-bold font-display">Your Plan Awaits</h2>
        <p className="text-text-secondary text-center max-w-md">
          Complete your estate analysis first to receive a personalized action plan.
        </p>
        <Button onClick={() => navigate('/app/analysis')}>Run Analysis First</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 flex items-center gap-6">
        <ProgressRing value={progress} size={80} strokeWidth={6} color="#C9A84C">
          <span className="text-lg font-bold mono-value">{progress}%</span>
        </ProgressRing>
        <div>
          <h2 className="text-xl font-bold font-display">Your Estate Plan</h2>
          <p className="text-sm text-text-secondary">{completed} of {planItems.length} items completed</p>
        </div>
      </motion.div>

      {/* Plan sections */}
      {immediateItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-accent-red mb-3">🔴 Immediate Priority (Now)</h3>
          <div className="space-y-2">
            {immediateItems.map((item) => (
              <PlanItemCard key={item.id} item={item} onComplete={completePlanItem} />
            ))}
          </div>
        </div>
      )}

      {shortTermItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-yellow-400 mb-3">🟡 Short Term (Within 6 months)</h3>
          <div className="space-y-2">
            {shortTermItems.map((item) => (
              <PlanItemCard key={item.id} item={item} onComplete={completePlanItem} />
            ))}
          </div>
        </div>
      )}

      {ongoingItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-accent-green mb-3">🟢 Ongoing (Annual review)</h3>
          <div className="space-y-2">
            {ongoingItems.map((item) => (
              <PlanItemCard key={item.id} item={item} onComplete={completePlanItem} />
            ))}
          </div>
        </div>
      )}

      {/* Beneficiary & Executor */}
      <div className="grid md:grid-cols-2 gap-6">
        <BeneficiaryPanel />
        <ExecutorPanel />
      </div>
    </div>
  );
};

export default PlanPage;

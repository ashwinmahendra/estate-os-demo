import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserStore } from '@/store/userStore';
import { useAssetStore } from '@/store/assetStore';
import { useEstateStore } from '@/store/estateStore';
import { Button, CountUp, ProgressRing, Badge } from '@/components/ui';
import { Timeline } from '@/components/ui/selectors';
import { cn, formatCurrency, ASSET_CATEGORY_META, RISK_SEVERITY_CONFIG } from '@/lib/utils';
import type { ChatMessage } from '@/lib/types';

// ─── AI Chat Panel ───────────────────────────────────────────
const AIChatPanel: React.FC = () => {
  const { chatMessages, addChatMessage } = useEstateStore();
  const { profile } = useUserStore();
  const { assets } = useAssetStore();
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What's my biggest risk?",
    "What happens to my crypto?",
    "Do I need a trust?",
    "What does my executor need?",
  ];

  const generateResponse = (question: string): string => {
    const totalValue = assets.reduce((s, a) => s + a.estimatedValue, 0);
    const hasCrypto = assets.some(a => a.category === 'CRYPTO');
    const hasWill = profile?.hasExistingWill;
    
    if (question.toLowerCase().includes('risk')) {
      return hasCrypto
        ? `Your biggest risk right now is your cryptocurrency holdings. Without documented access instructions, those assets could be permanently lost if something happens to you. I'd recommend adding your wallet access details to the Digital Vault immediately.\n\nAction item: Go to the Vault section and add your crypto access instructions.`
        : `Based on your profile, the most pressing risk is ${!hasWill ? 'not having a will in place. Without one, your state decides how your assets are distributed.' : 'ensuring all your beneficiary designations are up to date across all accounts.'}\n\nAction item: ${!hasWill ? 'Start by creating a basic will - it takes about an hour online.' : 'Review beneficiary designations on all financial accounts.'}`;
    }
    if (question.toLowerCase().includes('crypto')) {
      return hasCrypto
        ? `If something happens to you today, your crypto assets could be at risk. Hardware wallets, seed phrases, and exchange credentials need to be documented somewhere your executor can access them - but only when needed.\n\nI'd recommend using the Digital Vault to store access instructions with "Executor on Death" access level. This ensures they're encrypted and only released at the right time.\n\nAction item: Add crypto access details to your Digital Vault.`
        : `You don't currently have any crypto assets in your inventory. If you do acquire cryptocurrency in the future, make sure to document access instructions in the Digital Vault - crypto is one of the most commonly lost asset types in estates.`;
    }
    if (question.toLowerCase().includes('trust')) {
      return totalValue > 500000
        ? `Given your estate value of ${formatCurrency(totalValue)}, a revocable living trust could benefit you. It helps you:\n\n• Avoid probate (which is public and can take 6-18 months)\n• Maintain privacy about your assets\n• Give you more control over distributions\n\nA trust typically costs $1,500-$5,000 to set up with an attorney. For an estate your size, the probate savings alone often justify the cost.\n\nAction item: Consider consulting an estate planning attorney about a revocable trust.`
        : `At your current estate value, a trust isn't strictly necessary but could still be helpful for avoiding probate. A basic will is the higher priority for now.\n\nAction item: Start with a will, then consider a trust as your estate grows.`;
    }
    if (question.toLowerCase().includes('executor')) {
      return `Your executor will need several things to settle your estate efficiently:\n\n1. **A complete list of accounts** - every bank, brokerage, insurance policy, and property deed\n2. **Contact information** for each institution\n3. **Digital access** - passwords, crypto keys, online accounts\n4. **Legal documents** - will, trust documents, power of attorney\n5. **A checklist** of steps to follow\n\nLegacy organizes all of this automatically. Your executor will get a clear, step-by-step settlement roadmap based on your actual assets.\n\nAction item: Invite your executor to Legacy so they have access when needed.`;
    }
    return `That's a great question. Based on your estate profile with ${assets.length} assets totaling ${formatCurrency(totalValue)}, I'd recommend focusing on your highest-priority action items first. Check the Plan section for your personalized recommendations.\n\nAction item: Review your estate action plan and tackle the top priority items.`;
  };

  const sendMessage = async (text: string) => {
    addChatMessage({ role: 'user', content: text });
    setInput('');
    setTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    addChatMessage({ role: 'assistant', content: generateResponse(text) });
    setTyping(false);
  };

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [chatMessages, typing]);

  return (
    <div className="card flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent-gold/20 flex items-center justify-center">
            <span className="text-xs">🧠</span>
          </div>
          <span className="text-sm font-semibold">Estate Advisor</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">
              Hi, I'm your estate advisor. I know your full estate profile. Ask me anything.
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-text-secondary hover:text-accent-gold hover:border-accent-gold/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn(
              'max-w-[85%] px-3 py-2 rounded-xl text-sm',
              msg.role === 'user'
                ? 'bg-accent-gold text-bg-primary rounded-br-none'
                : 'bg-bg-elevated text-text-primary rounded-bl-none'
            )}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-bg-elevated px-4 py-2 rounded-xl rounded-bl-none">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); if (input.trim()) sendMessage(input.trim()); }} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your estate..."
            className="flex-1 bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/30"
          />
          <button type="submit" className="px-3 py-2 bg-accent-gold text-bg-primary rounded-lg text-sm font-medium hover:bg-accent-gold-light transition-colors">
            →
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Dashboard Page ──────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useUserStore();
  const { assets, getTotalValue, getCategoryBreakdown } = useAssetStore();
  const { estateScore, riskFlags, hasAnalyzed, planItems } = useEstateStore();

  const totalValue = getTotalValue();
  const breakdown = getCategoryBreakdown();
  const unresolvedFlags = riskFlags.filter(f => !f.isResolved);
  const completedPlanItems = planItems.filter(p => p.isCompleted).length;

  // Chart data
  const donutData = breakdown.map((b) => ({
    name: ASSET_CATEGORY_META[b.category]?.label || b.category,
    value: b.value,
    color: ASSET_CATEGORY_META[b.category]?.color || '#666',
  }));

  const areaData = [
    { month: 'Jan', value: totalValue * 0.85 },
    { month: 'Feb', value: totalValue * 0.88 },
    { month: 'Mar', value: totalValue * 0.87 },
    { month: 'Apr', value: totalValue * 0.91 },
    { month: 'May', value: totalValue * 0.94 },
    { month: 'Jun', value: totalValue * 0.96 },
    { month: 'Jul', value: totalValue * 0.95 },
    { month: 'Aug', value: totalValue * 0.97 },
    { month: 'Sep', value: totalValue * 0.98 },
    { month: 'Oct', value: totalValue * 0.99 },
    { month: 'Nov', value: totalValue * 1.01 },
    { month: 'Dec', value: totalValue },
  ];

  const timelineEvents = [
    { date: 'March 2025', title: 'Annual review suggested', icon: '📅', type: 'info' as const, description: 'Schedule your yearly estate plan review' },
    { date: 'February 2025', title: 'New asset added', icon: '💰', type: 'success' as const, description: 'Investment property added to inventory' },
    { date: 'January 2025', title: 'Tax exemption change expected', icon: '⚠️', type: 'warning' as const, description: 'Federal estate tax exemption may change in 2026' },
  ];

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Bar */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-display">
              {greeting()}, {user?.name?.split(' ')[0] || 'there'}.
            </h1>
            <p className="text-sm text-text-tertiary mt-1">Last updated: today</p>
          </div>
          <div className="flex items-center gap-8">
            {hasAnalyzed && estateScore && (
              <div className="flex items-center gap-3">
                <ProgressRing value={estateScore.overallScore} size={52} strokeWidth={4} color="#C9A84C">
                  <span className="text-sm font-bold mono-value">{estateScore.overallScore}</span>
                </ProgressRing>
                <div>
                  <div className="text-xs text-text-tertiary">Estate Health</div>
                  <div className="text-sm font-medium text-accent-gold">
                    {estateScore.overallScore >= 80 ? 'Good' : estateScore.overallScore >= 60 ? 'Fair' : 'Needs Attention'}
                  </div>
                </div>
              </div>
            )}
            <div className="w-px h-10 bg-border hidden md:block" />
            <div>
              <div className="text-xs text-text-tertiary">Total Estate Value</div>
              <div className="text-xl font-bold mono-value">
                <CountUp end={totalValue} prefix="$" formatter={(n) => n.toLocaleString()} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column (3/12) */}
        <div className="lg:col-span-3 space-y-6">
          {/* To-Do */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-4">Estate To-Do</h3>
            {unresolvedFlags.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-text-tertiary">⚠️ {unresolvedFlags.length} items need attention</p>
                {unresolvedFlags.slice(0, 3).map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => navigate('/app/analysis')}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-bg-elevated transition-all text-left"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: RISK_SEVERITY_CONFIG[flag.severity]?.color }} />
                    <span className="text-xs text-text-primary truncate">{flag.title}</span>
                    <span className="text-text-tertiary ml-auto">→</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">No urgent items. You're in good shape! 🎉</p>
            )}
          </motion.div>

          {/* Plan Progress */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-4">Plan Progress</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: planItems.length > 0 ? `${(completedPlanItems / planItems.length) * 100}%` : '0%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-sm mono-value text-accent-gold">
                {planItems.length > 0 ? Math.round((completedPlanItems / planItems.length) * 100) : 0}%
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Profile complete', done: !!profile?.completedAt },
                { label: 'Assets inventoried', done: assets.length > 0 },
                { label: 'Analysis done', done: hasAnalyzed },
                { label: 'Will created', done: profile?.hasExistingWill || false },
                { label: 'Vault complete', done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={item.done ? 'text-accent-green' : 'text-text-tertiary'}>
                    {item.done ? '✅' : '⬜'}
                  </span>
                  <span className={item.done ? 'text-text-primary' : 'text-text-tertiary'}>{item.label}</span>
                </div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4" onClick={() => navigate('/app/plan')}>
              View Full Plan
            </Button>
          </motion.div>
        </div>

        {/* Center column (5.5/12) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Area chart */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-4">Estate Value Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#A3A3A3' }}
                  formatter={((value: any) => [formatCurrency(value), 'Value']) as any}
                />
                <Area type="monotone" dataKey="value" stroke="#C9A84C" fill="url(#goldGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Donut + table */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
            <h3 className="text-sm font-semibold mb-4">Asset Breakdown</h3>
            {donutData.length > 0 ? (
              <div className="flex items-start gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3}>
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1E1E1E', border: '1px solid #2A2A2A', borderRadius: 8, fontSize: 12 }}
                      formatter={((value: any) => formatCurrency(value)) as any}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {breakdown.map((b) => (
                    <div key={b.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ASSET_CATEGORY_META[b.category]?.color }} />
                        <span className="text-text-secondary">{ASSET_CATEGORY_META[b.category]?.label}</span>
                      </div>
                      <span className="mono-value text-text-primary">{formatCurrency(b.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-text-tertiary text-sm">No assets added yet</p>
                <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate('/app/assets')}>
                  Add Assets
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right column (3.5/12) - AI Chat */}
        <div className="lg:col-span-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-[600px]">
            <AIChatPanel />
          </motion.div>
        </div>
      </div>

      {/* Timeline */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
        <h3 className="text-sm font-semibold mb-4">Key Events & Reminders</h3>
        <Timeline events={timelineEvents} />
      </motion.div>
    </div>
  );
};

export default DashboardPage;

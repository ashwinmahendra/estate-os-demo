import React from 'react';
const logoUrl = '/estate-os-demo/logo.png';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import {
  IconShield, IconEye, IconDocument, IconLock, IconTarget,
  IconArrowRight, IconLayers, IconRefresh, IconWarning, IconTrendUp,
  IconCheck, IconChart, IconZap,
} from './Icons';

interface Props {
  onStart: () => void;
}

const FLOW_STEPS = [
  { Icon: IconEye, label: 'Discover', desc: 'Profile & goals' },
  { Icon: IconLayers, label: 'Quantify', desc: 'Asset inventory' },
  { Icon: IconTarget, label: 'Analyze', desc: 'Risk assessment' },
  { Icon: IconDocument, label: 'Generate', desc: 'Document plan' },
  { Icon: IconLock, label: 'Secure', desc: 'Digital vault' },
  { Icon: IconShield, label: 'Execute', desc: 'Executor handoff' },
];

const USP_CARDS = [
  {
    Icon: IconRefresh,
    title: 'Always Current',
    desc: 'Your estate is not static. A new home, a crypto wallet, a divorce — any of these can make a three-year-old will actively harmful. Legacy tracks your assets and flags when your plan needs to catch up.',
    color: '#6BBF7B',
  },
  {
    Icon: IconWarning,
    title: 'Gaps You Can\'t See',
    desc: 'Three assets in this demo have no named beneficiary. Without one, those assets go to probate - costing your family months and 3–8% of the asset\'s value. Most people don\'t know this until it\'s too late.',
    color: '#BFA052',
  },
  {
    Icon: IconTrendUp,
    title: 'Ready When It\'s Needed',
    desc: 'A plan that exists only in your head — or in a drawer your family can\'t find — is not a plan. Legacy provides your executor with a complete settlement roadmap, account by account, the moment they need it.',
    color: '#7BA8D9',
  },
];

const PROBLEM_STATEMENTS = [
  { stat: '76%', label: 'of Americans have no valid will', subtext: '"They haven\'t gotten around to it." — 43% of adults', icon: IconWarning },
  { stat: '1 in 4', label: 'of those with a will haven\'t updated it', subtext: 'Marriage, children, new home, crypto — most wills are silent on all of it.', icon: IconDocument },
  { stat: '$124T', label: 'transferring between generations by 2048', subtext: 'Most of it without a plan. (Cerulli Associates)', icon: IconChart },
];

// Animated counter component
const Counter: React.FC<{ target: string; delay: number }> = ({ target, delay }) => {
  const count = useMotionValue(0);
  const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
  const prefix = target.match(/^\$/)?.[0] || '';
  const suffix = target.replace(/[0-9.$]/g, '');
  const hasDecimal = target.includes('.');

  const display = useTransform(count, (v) => {
    const formatted = hasDecimal ? v.toFixed(1) : Math.round(v).toString();
    return `${prefix}${formatted}${suffix}`;
  });

  React.useEffect(() => {
    const controls = animate(count, numericPart, {
      duration: 2,
      delay,
      ease: [0.25, 0.1, 0.25, 1],
    });
    return controls.stop;
  }, []);

  return <motion.span>{display}</motion.span>;
};

export const IntroLanding: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="relative" style={{ zIndex: 1 }}>
      {/* ───── SECTION 1: Hero ───── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent-gold/[0.02] blur-[150px] pointer-events-none" />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-14"
        >
          <img src={logoUrl} alt="Legacy" className="h-48 md:h-64 lg:h-80 w-auto object-contain drop-shadow-[0_0_40px_rgba(191,160,82,0.3)]" />
        </motion.div>

        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-center max-w-2xl mb-12"
        >
          <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.1] mb-5 tracking-tight">
            Your estate,<br /><span className="gradient-text">always ready.</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Most people spend their careers building something worth protecting. Then leave the people they love with no plan, no access, and no guidance when it matters most. Legacy changes that.
          </p>
        </motion.div>

        {/* Scroll indicator (replacing CTA to force scrolling) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center gap-4 mt-8 mb-16"
        >
          <p className="text-text-tertiary text-xs md:text-sm uppercase tracking-widest font-medium">Scroll to discover</p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-accent-gold mt-2">
            ↓
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, y: [0, 6, 0] }}
          transition={{ opacity: { delay: 1.5, duration: 0.8 }, y: { delay: 1.5, duration: 2, repeat: Infinity } }}
          className="absolute bottom-8 text-text-tertiary"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M4 8l6 6 6-6" />
          </svg>
        </motion.div>
      </section>

      {/* ───── SECTION 2: The Problem ───── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">The Problem</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 tracking-tight leading-tight">
            The people you love will face this. <span className="gradient-text">Ready or not.</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            When the time comes, or if you face a stroke or incapacitation — your family doesn't get time to prepare. They inherit the paperwork, the confusion, and the silence you left behind. Without a plan, the state decides everything.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROBLEM_STATEMENTS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="card p-6 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-gold/8 text-accent-gold flex items-center justify-center mx-auto mb-3">
                <item.icon size={18} />
              </div>
              <div className="text-3xl font-bold mono-value gradient-text mb-2">
                {item.stat}
              </div>
              <p className="text-sm font-semibold mb-1 text-text-primary">{item.label}</p>
              <p className="text-xs text-text-tertiary">{item.subtext}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 mx-auto max-w-2xl bg-bg-elevated border border-border rounded-xl p-6 text-center"
        >
          <p className="text-sm font-medium italic text-text-secondary">
            "46% of people named as executor of a will were not even told they had been chosen."
          </p>
          <p className="text-[10px] text-text-tertiary mt-2">— Vanilla Estate Planning Research</p>
        </motion.div>
      </section>

      {/* ───── SECTION 3: What Makes Us Different ───── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">What Makes Us Different</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 tracking-tight leading-tight">
            A living plan. <span className="gradient-text">Not a filed-and-forgotten document.</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            Every other platform creates a document and disappears. Legacy creates a living estate that knows what you own, flags what you're missing, and stays ready - so the people you love don't pay for your procrastination.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {USP_CARDS.map((usp, i) => (
            <motion.div
              key={usp.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="card p-6 group hover:border-accent-gold/15 transition-all duration-500"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ color: usp.color, background: `${usp.color}12` }}
              >
                <usp.Icon size={20} />
              </div>
              <h3 className="text-base font-semibold mb-2">{usp.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{usp.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── SECTION 4: How It Works (Flow) ───── */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 tracking-tight leading-tight">
            Six steps. <span className="gradient-text">One complete picture.</span>
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            From what you own today to who receives it when you can't speak for yourself. Every step is designed to protect the people you love.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {FLOW_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card p-5 group hover:border-accent-gold/15 transition-all duration-500"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-bg-elevated border border-border flex items-center justify-center text-text-secondary group-hover:text-accent-gold group-hover:border-accent-gold/20 transition-all duration-300 shrink-0">
                  <step.Icon size={18} />
                </div>
                <div>
                  <span className="text-[10px] text-text-tertiary font-medium">{String(i + 1).padStart(2, '0')}</span>
                  <div className="text-sm font-semibold">{step.label}</div>
                  <p className="text-xs text-text-tertiary mt-0.5">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───── SECTION 5: Advantage Strip ───── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="card p-8 md:p-10 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-5 text-accent-gold">
            <IconZap size={18} />
            <span className="text-xs font-medium tracking-widest uppercase">The Legacy Advantage</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {[
              { label: 'Asset-Aware', desc: 'Tracks every asset class' },
              { label: 'Risk Scoring', desc: 'Identifies coverage gaps' },
              { label: 'Encrypted Vault', desc: 'Bank-grade security' },
              { label: 'Executor-Ready', desc: 'Handoff in one click' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-gold/10 text-accent-gold flex items-center justify-center mb-1">
                  <IconCheck size={14} />
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="text-[11px] text-text-tertiary">{item.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ───── SECTION 6: Final CTA ───── */}
      <section className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            What would happen to <span className="gradient-text">your family today?</span>
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Walk through the exact steps your family would face - assets, gaps, documents, vault. See what you're protecting, and what you're leaving unprotected.
          </p>
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl font-medium text-sm bg-accent-gold text-bg-primary hover:bg-accent-gold-light transition-all duration-300 shadow-[0_4px_24px_rgba(191,160,82,0.3)] hover:shadow-[0_8px_36px_rgba(191,160,82,0.45)] hover:scale-[1.02]"
          >
            Start My Estate Checkup
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">
              <IconArrowRight size={16} />
            </span>
          </button>
          <p className="text-[11px] text-text-tertiary mt-4">No sign-up required · Interactive walkthrough</p>
        </motion.div>
      </section>
    </div>
  );
};

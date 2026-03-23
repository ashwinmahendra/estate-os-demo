import React from 'react';
import logoUrl from '@/assets/logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Starfield } from './Starfield';
import { IntroLanding } from './IntroLanding';
import { PhaseDiscover } from './PhaseDiscover';
import { PhaseQuantify } from './PhaseQuantify';
import { PhaseAnalyze } from './PhaseAnalyze';
import { PhaseGenerate } from './PhaseGenerate';
import { PhaseSecure } from './PhaseSecure';
import { PhaseExecute } from './PhaseExecute';
import { PhaseSurvey } from './PhaseSurvey';

export interface DemoAsset {
  id: string;
  category: string;
  name: string;
  value: number;
  ownership: string;
  hasBeneficiary: boolean;
  icon: string;
}

export interface DemoProfile {
  name: string;
  age: string;
  maritalStatus: string;
  state: string;
  hasChildren: boolean;
  childCount: number;
  goals: string[];
}

export interface DemoState {
  profile: DemoProfile;
  assets: DemoAsset[];
}

const PHASES = [
  { key: 'discover', label: 'Discover', num: '01', desc: 'Your Profile' },
  { key: 'quantify', label: 'Quantify', num: '02', desc: 'Your Assets' },
  { key: 'analyze', label: 'Analyze', num: '03', desc: 'Estate Health' },
  { key: 'generate', label: 'Generate', num: '04', desc: 'Your Plan' },
  { key: 'secure', label: 'Secure', num: '05', desc: 'Digital Vault' },
  { key: 'execute', label: 'Execute', num: '06', desc: 'Handoff' },
  { key: 'survey', label: 'Feedback', num: '07', desc: 'Survey' },
];

export const DemoFlow: React.FC = () => {
  const [started, setStarted] = React.useState(false);
  const [phase, setPhase] = React.useState(0);
  const [state, setState] = React.useState<DemoState>({
    profile: { name: '', age: '', maritalStatus: '', state: '', hasChildren: false, childCount: 0, goals: [] },
    assets: [],
  });

  const updateProfile = (data: Partial<DemoProfile>) =>
    setState(prev => ({ ...prev, profile: { ...prev.profile, ...data } }));

  const addAsset = (asset: Omit<DemoAsset, 'id'>) =>
    setState(prev => ({ ...prev, assets: [...prev.assets, { ...asset, id: crypto.randomUUID() }] }));

  const removeAsset = (id: string) =>
    setState(prev => ({ ...prev, assets: prev.assets.filter(a => a.id !== id) }));

  const next = () => setPhase(p => Math.min(p + 1, 6)); // Wait, 0-6 now
  const prev = () => setPhase(p => Math.max(p - 1, 0));
  const totalValue = state.assets.reduce((s, a) => s + a.value, 0);

  // Show intro landing before the demo starts
  if (!started) {
    return (
      <>
        <Starfield />
        <AnimatePresence mode="wait">
          <motion.div key="intro" exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
            <IntroLanding onStart={() => setStarted(true)} />
          </motion.div>
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col relative" style={{ zIndex: 1 }}>
      {/* Top nav */}
      <nav className="h-20 md:h-24 border-b border-border bg-bg-card/60 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="Legacy" className="h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(191,160,82,0.3)]" />
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-gold/10 text-accent-gold font-medium">DEMO</span>
        </div>

        {/* Phase indicator */}
        <div className="hidden md:flex items-center gap-1">
          {PHASES.map((p, i) => (
            <button
              key={p.key}
              onClick={() => i <= phase && setPhase(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                i === phase
                  ? 'bg-accent-gold/15 text-accent-gold'
                  : i < phase
                  ? 'text-text-secondary hover:text-text-primary cursor-pointer'
                  : 'text-text-tertiary cursor-default'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i < phase ? 'bg-accent-gold text-bg-primary' : i === phase ? 'bg-accent-gold/20 text-accent-gold' : 'bg-bg-elevated text-text-tertiary'
              }`}>
                {i < phase ? (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 5L4 7L8 3" />
                  </svg>
                ) : p.num}
              </span>
              <span className="hidden lg:inline">{p.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile phase */}
        <div className="md:hidden text-xs text-text-secondary">
          Step {phase + 1} of 6 · <span className="text-accent-gold">{PHASES[phase].label}</span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <motion.div
          className="h-full bg-accent-gold"
          animate={{ width: `${((phase + 1) / 7) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Phase content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="min-h-full"
          >
            {phase === 0 && <PhaseDiscover profile={state.profile} updateProfile={updateProfile} onNext={next} />}
            {phase === 1 && <PhaseQuantify assets={state.assets} addAsset={addAsset} removeAsset={removeAsset} onNext={next} onBack={prev} />}
            {phase === 2 && <PhaseAnalyze assets={state.assets} profile={state.profile} totalValue={totalValue} onNext={next} onBack={prev} />}
            {phase === 3 && <PhaseGenerate profile={state.profile} assets={state.assets} totalValue={totalValue} onNext={next} onBack={prev} />}
            {phase === 4 && <PhaseSecure assets={state.assets} onNext={next} onBack={prev} />}
            {phase === 5 && <PhaseExecute assets={state.assets} profile={state.profile} totalValue={totalValue} onBack={prev} onNext={next} onRestart={() => { setState({ profile: { name: '', age: '', maritalStatus: '', state: '', hasChildren: false, childCount: 0, goals: [] }, assets: [] }); setPhase(0); setStarted(false); }} />}
            {phase === 6 && <PhaseSurvey profile={state.profile} onRestart={() => { setState({ profile: { name: '', age: '', maritalStatus: '', state: '', hasChildren: false, childCount: 0, goals: [] }, assets: [] }); setPhase(0); setStarted(false); }} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

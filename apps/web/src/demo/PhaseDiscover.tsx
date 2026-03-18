import React from 'react';
import { motion } from 'framer-motion';
import type { DemoProfile } from './DemoFlow';
import { IconRocket, IconTrendUp, IconMountain, IconSunset, IconUser, IconUsers, IconClipboard, IconDove, IconShield, IconScale, IconChart, IconLaptop, IconBuilding, IconHospital } from './Icons';

const AGE_OPTIONS = [
  { value: '22-35', label: 'Early Career', sub: '22–35', Icon: IconRocket },
  { value: '36-50', label: 'Mid Career', sub: '36–50', Icon: IconTrendUp },
  { value: '51-65', label: 'Late Career', sub: '51–65', Icon: IconMountain },
  { value: '65+', label: 'Retired', sub: '65+', Icon: IconSunset },
];

const MARITAL_OPTIONS = [
  { value: 'Single', Icon: IconUser },
  { value: 'Married', Icon: IconUsers },
  { value: 'Divorced', Icon: IconClipboard },
  { value: 'Widowed', Icon: IconDove },
];

const GOAL_OPTIONS = [
  { value: 'protect_family', label: 'Protect my family', Icon: IconShield },
  { value: 'avoid_probate', label: 'Avoid probate', Icon: IconScale },
  { value: 'digital_legacy', label: 'Secure digital assets', Icon: IconLaptop },
  { value: 'business', label: 'Business succession', Icon: IconBuilding },
  { value: 'incapacity', label: 'Plan for incapacity', Icon: IconHospital },
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

interface Props {
  profile: DemoProfile;
  updateProfile: (data: Partial<DemoProfile>) => void;
  onNext: () => void;
}

export const PhaseDiscover: React.FC<Props> = ({ profile, updateProfile, onNext }) => {
  const canContinue = profile.name && profile.age && profile.maritalStatus;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Phase 01 - Discover</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Let's get to know <span className="gradient-text">you</span>
        </h1>
        <p className="text-text-secondary mb-12 text-lg">A few questions to personalize your estate profile.</p>
      </motion.div>

      <div className="space-y-10">
        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="text-sm font-medium text-text-secondary block mb-2">What's your name?</label>
          <input
            type="text"
            value={profile.name}
            onChange={e => updateProfile({ name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full bg-bg-elevated border border-border rounded-xl px-5 py-3.5 text-lg text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/40 transition-colors"
          />
        </motion.div>

        {/* Age Range */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="text-sm font-medium text-text-secondary block mb-3">Where are you in life?</label>
          <div className="grid grid-cols-2 gap-3">
            {AGE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateProfile({ age: opt.value })}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  profile.age === opt.value
                    ? 'border-accent-gold bg-accent-gold/8 shadow-[0_0_20px_rgba(191,160,82,0.1)]'
                    : 'border-border hover:border-border-light bg-bg-card'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  profile.age === opt.value ? 'bg-accent-gold/15 text-accent-gold' : 'bg-bg-elevated text-text-secondary'
                }`}>
                  <opt.Icon size={18} />
                </div>
                <div>
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-text-tertiary">{opt.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Marital */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="text-sm font-medium text-text-secondary block mb-3">Marital status</label>
          <div className="flex gap-3">
            {MARITAL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateProfile({ maritalStatus: opt.value })}
                className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                  profile.maritalStatus === opt.value
                    ? 'border-accent-gold bg-accent-gold/8'
                    : 'border-border hover:border-border-light bg-bg-card'
                }`}
              >
                <div className={`${profile.maritalStatus === opt.value ? 'text-accent-gold' : 'text-text-secondary'}`}>
                  <opt.Icon size={22} />
                </div>
                <span className="text-xs font-medium">{opt.value}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* State */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className="text-sm font-medium text-text-secondary block mb-2">State of residence</label>
          <div className="relative">
            <select
              value={profile.state || ''}
              onChange={e => updateProfile({ state: e.target.value })}
              className="w-full bg-bg-elevated border border-border rounded-xl px-5 py-3.5 text-text-primary outline-none focus:border-accent-gold/40 transition-colors appearance-none"
            >
              <option value="" disabled>Select a state...</option>
              {US_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-text-tertiary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Children */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <label className="text-sm font-medium text-text-secondary block mb-3">Do you have children?</label>
          <div className="flex gap-3">
            {[true, false].map(val => (
              <button
                key={val.toString()}
                onClick={() => updateProfile({ hasChildren: val, childCount: val ? Math.max(profile.childCount, 1) : 0 })}
                className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  profile.hasChildren === val ? 'border-accent-gold bg-accent-gold/8 text-accent-gold' : 'border-border bg-bg-card text-text-secondary'
                }`}
              >
                {val ? 'Yes' : 'No'}
              </button>
            ))}
          </div>
          {profile.hasChildren && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3">
              <label className="text-xs text-text-tertiary block mb-1.5">How many?</label>
              <div className="flex items-center gap-3">
                <button onClick={() => updateProfile({ childCount: Math.max(1, profile.childCount - 1) })}
                  className="w-10 h-10 rounded-lg border border-border bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">−</button>
                <span className="text-xl font-bold mono-value w-8 text-center">{profile.childCount}</span>
                <button onClick={() => updateProfile({ childCount: profile.childCount + 1 })}
                  className="w-10 h-10 rounded-lg border border-border bg-bg-elevated flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">+</button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Goals */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <label className="text-sm font-medium text-text-secondary block mb-3">What matters most? <span className="text-text-tertiary">(select all)</span></label>
          <div className="grid grid-cols-2 gap-2">
            {GOAL_OPTIONS.map(opt => {
              const sel = profile.goals.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => updateProfile({ goals: sel ? profile.goals.filter(g => g !== opt.value) : [...profile.goals, opt.value] })}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    sel ? 'border-accent-gold bg-accent-gold/8' : 'border-border hover:border-border-light bg-bg-card'
                  }`}
                >
                  <div className={`${sel ? 'text-accent-gold' : 'text-text-secondary'}`}>
                    <opt.Icon size={16} />
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Continue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-14 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className={`px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
            canContinue
              ? 'bg-accent-gold text-bg-primary hover:bg-accent-gold-light shadow-[0_4px_20px_rgba(191,160,82,0.3)] hover:shadow-[0_6px_28px_rgba(191,160,82,0.4)]'
              : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'
          }`}
        >
          Continue to Assets →
        </button>
      </motion.div>
    </div>
  );
};

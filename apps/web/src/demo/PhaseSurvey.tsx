import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconHeart, IconCheck } from './Icons';

interface SurveyData {
  q1?: string;
  q2?: string[];
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string[];
  q7?: string;
  email?: string;
}

import type { DemoProfile } from './DemoFlow';

const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzSLvtACL8Sb1G7eS1QuMZEHEzMDA49NpttjnX0KTnxw2oEPmGy1M6mAvL1RQ_X8nwj/exec";

export const PhaseSurvey: React.FC<{ profile?: DemoProfile; onRestart: () => void }> = ({ profile, onRestart }) => {
  const [step, setStep] = useState(0); // 0, 1, 2 for questions, 3 for post-submit
  const [data, setData] = useState<SurveyData>({ q2: [], q6: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key: keyof SurveyData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArray = (key: 'q2' | 'q6', value: string) => {
    setData(prev => {
      const arr = prev[key] || [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
      };
    });
  };

  const sendToGoogleSheets = async (finalData: SurveyData) => {
    setIsSubmitting(true);
    try {
      await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          name: profile?.name || "",
          age: profile?.age || "",
          maritalStatus: profile?.maritalStatus || "",
          state: profile?.state || "",
          hasChildren: profile?.hasChildren ? "Yes" : "No",
          childCount: profile?.childCount || 0,
          goals: profile?.goals?.join("; ") || "",
          q1: finalData.q1 || "",
          q2: finalData.q2?.join("; ") || "",
          q3: finalData.q3 || "",
          q4: finalData.q4 || "",
          q5: finalData.q5 || "",
          q6: finalData.q6?.join("; ") || "",
          q7: finalData.q7 || "",
          email: finalData.email || ""
        }),
      });
    } catch (e) {
      console.error("Error submitting to Sheets", e);
    }
    setIsSubmitting(false);
  };

  const submitSurvey = async () => {
    const finalData = { ...data, submittedAt: new Date().toISOString() };
    localStorage.setItem('legacySurvey', JSON.stringify(finalData));
    await sendToGoogleSheets(finalData);
    setStep(3);
  };

  const submitEmail = async () => {
    if (data.email) {
      const finalData = { ...data, submittedAt: new Date().toISOString() };
      localStorage.setItem('legacySurvey', JSON.stringify(finalData));
      await sendToGoogleSheets(finalData);
      alert("Thank you! We'll be in touch.");
    }
  };

  const canContinueStep0 = data.q1 && data.q2 && data.q2.length > 0;
  const canContinueStep1 = data.q3 && data.q4;
  const canContinueStep2 = data.q5 && data.q6 && data.q6.length > 0;

  if (step === 3) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-10 border-accent-gold/20 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-accent-gold/10 text-accent-gold flex items-center justify-center mb-6">
            <IconHeart size={32} />
          </div>
          <h2 className="font-display text-3xl font-bold mb-3">Thank you for your feedback.</h2>
          <p className="text-text-secondary text-lg mb-10 max-w-md">
            Your insights are helping us build the future of estate planning. We truly appreciate your time.
          </p>
          
          <div className="w-full max-w-sm bg-bg-elevated p-6 rounded-2xl border border-border mb-10">
            <h3 className="font-semibold text-sm mb-2 text-text-primary">Want early access?</h3>
            <p className="text-xs text-text-tertiary mb-4">Leave your email and we'll notify you when Legacy launches.</p>
            <div className="flex gap-2">
              <input type="email" value={data.email || ''} onChange={e => update('email', e.target.value)} placeholder="your@email.com" className="flex-1 bg-bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent-gold/50" />
              <button onClick={submitEmail} disabled={!data.email} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${data.email ? 'bg-accent-gold text-bg-primary' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
                Submit
              </button>
            </div>
          </div>

          <button onClick={onRestart} className="px-8 py-3 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-light transition-all">
            Restart Demo
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-accent-gold text-xs font-medium tracking-widest uppercase mb-3">Feedback</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-3 leading-tight">
          Help us build this for <span className="gradient-text">you.</span>
        </h1>
        <p className="text-text-secondary mb-10 text-lg max-w-xl">
          We're building Legacy to solve exactly the problems you just saw. If this resonated with you, let us know what matters most.
        </p>
      </motion.div>

      <div className="mb-4 flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-accent-gold' : 'bg-bg-elevated'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-4">1. What is your current estate planning status?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  "I have nothing in place.",
                  "I have old documents that need updating.",
                  "I have a complete plan, but it's totally static/analog."
                ].map(opt => (
                  <button key={opt} onClick={() => update('q1', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${data.q1 === opt ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-4">2. What part of the Legacy vision is most valuable to you? <span className="text-xs font-normal text-text-tertiary ml-2">(Select all that apply)</span></label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  "The Living Plan (assets and documents that stay synced with my life)",
                  "The Digital Vault (securely passing on passwords, crypto, and digital accounts)",
                  "The Executor Handoff (a step-by-step roadmap for my family, not just a PDF)"
                ].map(opt => (
                  <button key={opt} onClick={() => toggleArray('q2', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all flex items-start gap-3 ${data.q2?.includes(opt) ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                    <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${data.q2?.includes(opt) ? 'bg-accent-gold border-accent-gold text-bg-primary' : 'border-border'}`}>
                      {data.q2?.includes(opt) && <IconCheck size={12} />}
                    </div>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-4">3. <span className="text-accent-gold text-xs uppercase tracking-wider font-bold mr-2">Required</span>If this product existed today, would you use it?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  "Yes, I need this right now.",
                  "Yes, but I need to learn more first.",
                  "No, I'll stick to traditional methods."
                ].map(opt => (
                  <button key={opt} onClick={() => update('q3', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${data.q3 === opt ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-4">4. <span className="text-accent-gold text-xs uppercase tracking-wider font-bold mr-2">Required</span>How much would you expect to pay for this platform?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "$0 – $20 / month (Basic Subscription)",
                  "$21 – $99 / month (Premium + Vault Subscription)",
                  "$100 – $499 (One-time Lifetime Access)",
                  "$500 – $999 (One-time Lifetime Access)",
                  "$1,000 – $4,999 (Concierge Setup Included)",
                  "$5,000+ (Comprehensive Legal Suite & Trust)"
                ].map(opt => (
                  <button key={opt} onClick={() => update('q4', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${data.q4 === opt ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-sm font-semibold text-text-primary block mb-4">5. Would you want your financial advisor to have access to this?</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Yes, to help me keep it organized.",
                    "No, I prefer to keep this private for my family."
                  ].map(opt => (
                    <button key={opt} onClick={() => update('q5', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${data.q5 === opt ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-text-primary block mb-4">6. What is the single biggest reason you haven't sorted this out yet? <span className="text-xs font-normal text-text-tertiary ml-2">(Select all that apply)</span></label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "It feels too expensive.",
                    "It feels too complicated/overwhelming.",
                    "I just don't want to think about it.",
                    "I didn't know where to start."
                  ].map(opt => (
                    <button key={opt} onClick={() => toggleArray('q6', opt)} className={`p-4 rounded-xl border-2 text-left text-sm transition-all flex items-start gap-3 ${data.q6?.includes(opt) ? 'border-accent-gold bg-accent-gold/5 text-accent-gold' : 'border-border bg-bg-card hover:border-border-light text-text-secondary'}`}>
                      <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${data.q6?.includes(opt) ? 'bg-accent-gold border-accent-gold text-bg-primary' : 'border-border'}`}>
                        {data.q6?.includes(opt) && <IconCheck size={12} />}
                      </div>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-text-primary block mb-2 flex items-center justify-between">
                <span>7. Any other thoughts or feedback?</span>
                <span className="text-xs text-text-tertiary font-normal">Optional</span>
              </label>
              <textarea value={data.q7 || ''} onChange={e => update('q7', e.target.value)} placeholder="Tell us what you loved, hated, or wished was here." className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary outline-none min-h-[100px] focus:border-accent-gold/50" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-12 flex justify-end pb-12">
        {step === 0 && (
          <button onClick={() => setStep(1)} disabled={!canContinueStep0} className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${canContinueStep0 ? 'bg-accent-gold text-bg-primary' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
            Next Phase →
          </button>
        )}
        {step === 1 && (
          <div className="flex gap-4 w-full justify-between">
            <button onClick={() => setStep(0)} className="px-6 py-3.5 rounded-xl text-sm font-medium text-text-tertiary hover:text-text-primary">← Back</button>
            <button onClick={() => setStep(2)} disabled={!canContinueStep1} className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${canContinueStep1 ? 'bg-accent-gold text-bg-primary' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
              Next Phase →
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="flex gap-4 w-full justify-between">
            <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl text-sm font-medium text-text-tertiary hover:text-text-primary">← Back</button>
            <button onClick={submitSurvey} disabled={!canContinueStep2 || isSubmitting} className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all ${canContinueStep2 && !isSubmitting ? 'bg-accent-gold text-bg-primary shadow-[0_4px_24px_rgba(191,160,82,0.3)] hover:scale-[1.02]' : 'bg-bg-elevated text-text-tertiary cursor-not-allowed'}`}>
              {isSubmitting ? 'Submitting...' : <><span className="hidden sm:inline">Submit Feedback</span> <IconCheck size={16} className="inline ml-1" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

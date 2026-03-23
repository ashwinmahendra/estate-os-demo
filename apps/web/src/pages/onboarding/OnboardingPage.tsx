import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui';
import { Stepper, CardSelect, BubbleSelector, NumberStepper, PillSelector } from '@/components/ui/selectors';
import { Toggle, Select } from '@/components/ui';
import { US_STATES } from '@/lib/utils';
import type { AgeRange, MaritalStatus, EmploymentStatus, IncomeRange, NetWorthRange, AssetCategory, EstateGoal } from '@/lib/types';

const STEPS = [
  { label: 'Life Stage', description: 'Who are you?' },
  { label: 'Family', description: 'Your family situation' },
  { label: 'Location & Work', description: 'Where you live and work' },
  { label: 'Finances', description: 'Your financial picture' },
  { label: 'Assets', description: 'What you own' },
  { label: 'Goals', description: 'What matters most' },
  { label: 'Current Plan', description: 'What you have in place' },
];

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

// ─── Step 1: Life Stage ──────────────────────────────────────
const Step1: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();
  const options = [
    { value: 'AGE_18_25' as AgeRange, emoji: '🚀', title: 'Early Career (22–35)', description: 'Just starting to build. Setting foundations that will grow with you.' },
    { value: 'AGE_26_35' as AgeRange, emoji: '📈', title: 'Mid Career (36–50)', description: 'Building wealth, raising family. More assets mean more to protect.' },
    { value: 'AGE_46_55' as AgeRange, emoji: '🏔️', title: 'Late Career (51–65)', description: 'Protecting what you\'ve built. Time to solidify your plan.' },
    { value: 'AGE_65_PLUS' as AgeRange, emoji: '🌅', title: 'Retired (65+)', description: 'Preserving and transferring. Making sure your legacy is clear.' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">Who are you?</h2>
      <p className="text-text-secondary mb-8">Select the stage that best describes where you are in life.</p>
      <CardSelect
        options={options}
        selected={onboarding.lifeStage || ''}
        onChange={(val) => updateOnboarding({ lifeStage: val as AgeRange })}
        columns={2}
      />
    </div>
  );
};

// ─── Step 2: Family Situation ────────────────────────────────
const Step2: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const maritalOptions = [
    { value: 'SINGLE', label: 'Single', icon: '👤' },
    { value: 'MARRIED', label: 'Married / Partnered', icon: '💑' },
    { value: 'DIVORCED', label: 'Divorced', icon: '📋' },
    { value: 'WIDOWED', label: 'Widowed', icon: '🕊️' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">Family Situation</h2>
      <p className="text-text-secondary mb-8">This helps us tailor recommendations to your life.</p>

      <div className="space-y-8">
        {/* Marital status */}
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-3">Marital Status</label>
          <BubbleSelector
            options={maritalOptions}
            selected={onboarding.maritalStatus ? [onboarding.maritalStatus] : []}
            onChange={(val) => updateOnboarding({ maritalStatus: val[0] as MaritalStatus })}
            multiSelect={false}
            columns={4}
          />
        </div>

        {/* Children */}
        <div className="space-y-4">
          <Toggle
            label="Do you have children?"
            checked={onboarding.hasChildren || false}
            onChange={(checked) => updateOnboarding({ hasChildren: checked, numberOfChildren: checked ? 1 : 0 })}
            size="lg"
          />

          <AnimatePresence>
            {onboarding.hasChildren && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pl-4 border-l-2 border-accent-gold/20"
              >
                <NumberStepper
                  label="How many children?"
                  value={onboarding.numberOfChildren || 1}
                  onChange={(val) => updateOnboarding({ numberOfChildren: val })}
                  min={1}
                  max={15}
                />
                <Toggle
                  label="Are any under 18?"
                  checked={onboarding.hasMinorChildren || false}
                  onChange={(checked) => updateOnboarding({ hasMinorChildren: checked })}
                  size="lg"
                />
                <Toggle
                  label="Do you have grandchildren?"
                  checked={onboarding.hasGrandchildren || false}
                  onChange={(checked) => updateOnboarding({ hasGrandchildren: checked })}
                  size="lg"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ─── Step 3: Location & Work ─────────────────────────────────
const Step3: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const employmentOptions = [
    { value: 'EMPLOYED', emoji: '💼', title: 'Employed Full-Time', description: 'Working for a company' },
    { value: 'SELF_EMPLOYED', emoji: '💻', title: 'Self-Employed / Freelancer', description: 'Working independently' },
    { value: 'BUSINESS_OWNER', emoji: '🏢', title: 'Business Owner', description: 'Own or co-own a business' },
    { value: 'RETIRED', emoji: '🌴', title: 'Retired', description: 'Enjoying retirement' },
    { value: 'STUDENT', emoji: '📚', title: 'Student', description: 'Currently studying' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">Where You Live & Work</h2>
      <p className="text-text-secondary mb-8">Estate laws vary by state. This helps us give accurate guidance.</p>

      <div className="space-y-8">
        <Select
          label="State of Residence"
          options={US_STATES}
          value={onboarding.stateOfResidence}
          onChange={(val) => updateOnboarding({ stateOfResidence: val })}
          searchable
          placeholder="Search your state..."
        />

        <div>
          <label className="text-sm font-medium text-text-secondary block mb-3">Employment Status</label>
          <CardSelect
            options={employmentOptions}
            selected={onboarding.employmentStatus || ''}
            onChange={(val) => updateOnboarding({ employmentStatus: val as EmploymentStatus })}
            columns={2}
          />
        </div>

        <AnimatePresence>
          {onboarding.employmentStatus === 'BUSINESS_OWNER' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Toggle
                label="Do you have a business succession plan?"
                checked={onboarding.hasSuccessionPlan || false}
                onChange={(checked) => updateOnboarding({ hasSuccessionPlan: checked })}
                size="lg"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Step 4: Financial Picture ───────────────────────────────
const Step4: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const incomeOptions = [
    { value: 'UNDER_50K', label: 'Under $50K' },
    { value: 'RANGE_50_100K', label: '$50K–$100K' },
    { value: 'RANGE_100_200K', label: '$100K–$200K' },
    { value: 'RANGE_200_500K', label: '$200K–$500K' },
    { value: 'OVER_500K', label: 'Over $500K' },
  ];

  const netWorthOptions = [
    { value: 'UNDER_100K', title: 'Under $100K', icon: '🌱', description: 'Just getting started' },
    { value: 'RANGE_100K_500K', title: '$100K–$500K', icon: '📈', description: 'Building momentum' },
    { value: 'RANGE_500K_1M', title: '$500K–$1M', icon: '🏗️', description: 'Solid foundation' },
    { value: 'RANGE_1M_5M', title: '$1M–$5M', icon: '🏛️', description: 'Significant estate' },
    { value: 'OVER_5M', title: 'Over $5M', icon: '👑', description: 'Complex planning needed' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">Your Financial Picture</h2>
      <p className="text-text-secondary mb-8">No exact numbers needed - ranges help us calibrate your plan. This stays private.</p>

      <div className="space-y-10">
        <div>
          <label className="text-sm font-medium text-text-secondary block mb-4">Annual Household Income</label>
          <PillSelector
            options={incomeOptions}
            selected={onboarding.incomeRange || ''}
            onChange={(val) => updateOnboarding({ incomeRange: val as IncomeRange })}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-text-secondary block mb-4">Estimated Net Worth</label>
          <CardSelect
            options={netWorthOptions}
            selected={onboarding.netWorthEstimate || ''}
            onChange={(val) => updateOnboarding({ netWorthEstimate: val as NetWorthRange })}
            columns={2}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Step 5: Asset Categories ────────────────────────────────
const Step5: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const assetOptions = [
    { value: 'CASH', label: 'Cash & Savings', icon: '💵' },
    { value: 'BROKERAGE', label: 'Stocks & Brokerage', icon: '📈' },
    { value: 'RETIREMENT', label: '401(k) / 403(b)', icon: '🏦' },
    { value: 'BONDS', label: 'Roth IRA', icon: '🪙' },
    { value: 'OTHER', label: 'Other Retirement', icon: '📊' },
    { value: 'REAL_ESTATE', label: 'Primary Residence', icon: '🏡' },
    { value: 'BUSINESS', label: 'Business Ownership', icon: '🏢' },
    { value: 'CRYPTO', label: 'Cryptocurrency', icon: '₿' },
    { value: 'DIGITAL_ACCOUNT', label: 'Digital Assets', icon: '💻' },
    { value: 'INSURANCE', label: 'Life Insurance', icon: '💼' },
    { value: 'VEHICLE', label: 'Vehicles', icon: '🚗' },
    { value: 'PERSONAL_PROPERTY', label: 'Valuables / Jewelry', icon: '💍' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">What You Own</h2>
      <p className="text-text-secondary mb-8">Select all the types of assets you currently own. We'll go deeper next.</p>

      <BubbleSelector
        options={assetOptions}
        selected={onboarding.selectedAssetCategories}
        onChange={(selected) => updateOnboarding({ selectedAssetCategories: selected as AssetCategory[] })}
        columns={3}
      />

      <p className="text-xs text-text-tertiary mt-6 text-center">
        Don't worry about being exact - we'll go deeper in the asset inventory.
      </p>
    </div>
  );
};

// ─── Step 6: Planning Goals ──────────────────────────────────
const Step6: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const goalOptions = [
    { value: 'PROTECT_FAMILY', label: 'Protect my family if I die unexpectedly', icon: '🛡️' },
    { value: 'EASY_EXECUTOR', label: 'Make sure my kids are cared for', icon: '👶' },
    { value: 'AVOID_PROBATE', label: 'Avoid probate court', icon: '⚖️' },
    { value: 'MINIMIZE_TAXES', label: 'Minimize estate taxes', icon: '📊' },
    { value: 'DIGITAL_LEGACY', label: 'Plan for my digital assets', icon: '💻' },
    { value: 'BUSINESS_SUCCESSION', label: 'Ensure my business continues', icon: '🏢' },
    { value: 'CHARITABLE_GIVING', label: 'Leave a charitable legacy', icon: '❤️' },
    { value: 'PLAN_INCAPACITY', label: 'Plan for incapacity / disability', icon: '🏥' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">What Matters Most to You?</h2>
      <p className="text-text-secondary mb-8">Select all that apply. This shapes your personalized estate plan.</p>

      <BubbleSelector
        options={goalOptions}
        selected={onboarding.primaryGoals}
        onChange={(selected) => updateOnboarding({ primaryGoals: selected as EstateGoal[] })}
        columns={2}
      />
    </div>
  );
};

// ─── Step 7: Estate Plan Status ──────────────────────────────
const Step7: React.FC = () => {
  const { onboarding, updateOnboarding } = useUserStore();

  const docOptions = [
    { value: 'will', label: 'I have a will', icon: '📄' },
    { value: 'trust', label: 'I have a trust', icon: '🏛️' },
    { value: 'poa', label: 'I have a power of attorney', icon: '✍️' },
    { value: 'healthcare', label: 'I have a healthcare directive', icon: '🏥' },
    { value: 'none', label: 'I have none of these', icon: '❌' },
    { value: 'unsure', label: "I'm not sure", icon: '❓' },
  ];

  const updateOptions = [
    { value: 'within_1_year', label: 'Within 1 year' },
    { value: '1_3_years', label: '1–3 years ago' },
    { value: '3_5_years', label: '3–5 years ago' },
    { value: 'over_5_years', label: 'Over 5 years ago' },
    { value: 'not_sure', label: 'Not sure' },
  ];

  const hasDocuments = onboarding.existingDocuments.length > 0 &&
    !onboarding.existingDocuments.includes('none') &&
    !onboarding.existingDocuments.includes('unsure');

  return (
    <div>
      <h2 className="text-2xl font-bold font-display mb-2">Current Estate Plan</h2>
      <p className="text-text-secondary mb-8">What do you have in place today? Be honest - no judgment.</p>

      <div className="space-y-8">
        <BubbleSelector
          options={docOptions}
          selected={onboarding.existingDocuments}
          onChange={(selected) => {
            // If 'none' or 'unsure' is selected, clear others
            if (selected.includes('none') && !onboarding.existingDocuments.includes('none')) {
              updateOnboarding({ existingDocuments: ['none'] });
            } else if (selected.includes('unsure') && !onboarding.existingDocuments.includes('unsure')) {
              updateOnboarding({ existingDocuments: ['unsure'] });
            } else {
              updateOnboarding({ existingDocuments: selected.filter(s => s !== 'none' && s !== 'unsure') });
            }
          }}
          columns={3}
        />

        <AnimatePresence>
          {hasDocuments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-sm font-medium text-text-secondary block mb-3">
                When did you last update your documents?
              </label>
              <PillSelector
                options={updateOptions}
                selected={onboarding.lastUpdateRange || ''}
                onChange={(val) => updateOnboarding({ lastUpdateRange: val })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── Completion Screen ───────────────────────────────────────
const CompletionScreen: React.FC<{ onContinue: () => void }> = ({ onContinue }) => {
  const { onboarding } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12"
    >
      {/* Celebration animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-24 h-24 rounded-full bg-accent-gold/20 flex items-center justify-center mb-8"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="text-5xl"
        >
          ✨
        </motion.span>
      </motion.div>

      <h2 className="text-3xl font-bold font-display mb-4">
        Your estate profile is <span className="gradient-text">ready</span>
      </h2>

      <div className="max-w-md space-y-3 mb-10">
        <p className="text-text-secondary">
          We've built a personalized profile based on your responses. Here's what we detected:
        </p>
        <div className="card p-4 text-left space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Asset categories:</span>
            <span className="font-medium text-accent-gold">{onboarding.selectedAssetCategories.length} types</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Planning goals:</span>
            <span className="font-medium text-accent-gold">{onboarding.primaryGoals.length} goals</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Existing documents:</span>
            <span className="font-medium text-accent-gold">
              {onboarding.existingDocuments.includes('none') ? 'None yet' :
               onboarding.existingDocuments.length + ' on file'}
            </span>
          </div>
        </div>
      </div>

      <Button size="lg" onClick={onContinue}>
        Build Your Asset Inventory →
      </Button>
    </motion.div>
  );
};

// ─── Main Onboarding Page ────────────────────────────────────
const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { onboarding, setOnboardingStep, completeOnboarding, isAuthenticated } = useUserStore();
  const [direction, setDirection] = React.useState(1);
  const [showCompletion, setShowCompletion] = React.useState(false);
  const step = onboarding.currentStep;

  React.useEffect(() => {
    if (!isAuthenticated) navigate('/signup');
  }, [isAuthenticated, navigate]);

  const totalSteps = 7;
  const progress = ((step - 1) / totalSteps) * 100;

  const next = () => {
    if (step >= totalSteps) {
      completeOnboarding();
      setShowCompletion(true);
      return;
    }
    setDirection(1);
    setOnboardingStep(step + 1);
  };

  const prev = () => {
    if (step <= 1) return;
    setDirection(-1);
    setOnboardingStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!onboarding.lifeStage;
      case 2: return !!onboarding.maritalStatus;
      case 3: return !!onboarding.stateOfResidence && !!onboarding.employmentStatus;
      case 4: return !!onboarding.incomeRange && !!onboarding.netWorthEstimate;
      case 5: return onboarding.selectedAssetCategories.length > 0;
      case 6: return onboarding.primaryGoals.length > 0;
      case 7: return onboarding.existingDocuments.length > 0;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      case 7: return <Step7 />;
      default: return null;
    }
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
        <CompletionScreen onContinue={() => navigate('/app/assets')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left sidebar - progress */}
      <aside className="hidden lg:flex w-72 bg-bg-card border-r border-border flex-col p-8">
        <div className="flex items-center gap-2 mb-12">
          <img src="/estate-os-demo/logo.png" alt="Legacy Logo" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(191,160,82,0.3)]" />
        </div>
        <Stepper steps={STEPS} currentStep={step} />
        <div className="mt-auto">
          <p className="text-xs text-text-tertiary">Your data is encrypted and private. We never share your financial information.</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <motion.div
            className="h-full bg-accent-gold"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Mobile step indicator */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="text-sm text-text-secondary">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium text-accent-gold">{STEPS[step - 1]?.label}</span>
        </div>

        {/* Step content */}
        <div className="flex-1 flex items-start justify-center overflow-y-auto py-12 px-6">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-bg-card/50 backdrop-blur">
          <Button
            variant="ghost"
            onClick={prev}
            disabled={step === 1}
          >
            ← Back
          </Button>
          <div className="flex items-center gap-3">
            {step < totalSteps && (
              <Button variant="ghost" onClick={() => {
                setDirection(1);
                setOnboardingStep(step + 1);
              }}>
                Skip
              </Button>
            )}
            <Button onClick={next} disabled={!canProceed()}>
              {step === totalSteps ? 'Complete Profile' : 'Continue →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;

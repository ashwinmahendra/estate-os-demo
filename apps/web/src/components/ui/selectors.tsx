import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ─── BubbleSelector ──────────────────────────────────────────
interface BubbleOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface BubbleSelectorProps {
  options: BubbleOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  columns?: number;
  className?: string;
}

export const BubbleSelector: React.FC<BubbleSelectorProps> = ({
  options, selected, onChange, multiSelect = true, columns = 3, className,
}) => {
  const toggle = (value: string) => {
    if (multiSelect) {
      onChange(
        selected.includes(value)
          ? selected.filter((s) => s !== value)
          : [...selected, value]
      );
    } else {
      onChange([value]);
    }
  };

  return (
    <div
      className={cn('grid gap-3', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(option.value)}
            className={cn(
              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center',
              isSelected
                ? 'border-accent-gold bg-accent-gold/10 text-accent-gold shadow-lg shadow-accent-gold/10'
                : 'border-border bg-bg-elevated text-text-secondary hover:border-border-light hover:bg-bg-card'
            )}
          >
            {option.icon && <span className="text-2xl">{option.icon}</span>}
            <span className="text-sm font-medium">{option.label}</span>
            {option.description && (
              <span className="text-xs text-text-tertiary">{option.description}</span>
            )}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-accent-gold rounded-full flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 4" stroke="#0F0F0F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── CardSelect ──────────────────────────────────────────────
interface CardOption {
  value: string;
  icon?: string;
  emoji?: string;
  title: string;
  description: string;
}

interface CardSelectProps {
  options: CardOption[];
  selected: string | string[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  columns?: number;
  className?: string;
}

export const CardSelect: React.FC<CardSelectProps> = ({
  options, selected, onChange, multiSelect = false, columns = 2, className,
}) => {
  const selectedArr = Array.isArray(selected) ? selected : [selected];

  const toggle = (value: string) => {
    if (multiSelect) {
      const next = selectedArr.includes(value)
        ? selectedArr.filter((s) => s !== value)
        : [...selectedArr, value];
      onChange(next);
    } else {
      onChange(value);
    }
  };

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((option) => {
        const isSelected = selectedArr.includes(option.value);
        return (
          <motion.button
            key={option.value}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggle(option.value)}
            className={cn(
              'relative flex flex-col items-start p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left',
              isSelected
                ? 'border-accent-gold bg-accent-gold/5 shadow-lg shadow-accent-gold/10'
                : 'border-border bg-bg-card hover:border-border-light hover:shadow-md'
            )}
          >
            {(option.emoji || option.icon) && (
              <span className="text-3xl mb-3">{option.emoji || option.icon}</span>
            )}
            <h4 className={cn(
              'text-base font-semibold mb-1 font-display',
              isSelected ? 'text-accent-gold' : 'text-text-primary'
            )}>
              {option.title}
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">{option.description}</p>
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-accent-gold rounded-full flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7L6 10L11 4.5" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── NumberStepper ───────────────────────────────────────────
interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value, onChange, min = 0, max = 20, label,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <span className="text-sm text-text-secondary">{label}</span>}
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-12 h-12 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xl text-text-primary hover:bg-bg-card hover:border-border-light transition-all"
        >
          −
        </motion.button>
        <span className="text-3xl font-bold mono-value w-12 text-center text-text-primary">
          {value}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-12 h-12 rounded-full bg-bg-elevated border border-border flex items-center justify-center text-xl text-text-primary hover:bg-bg-card hover:border-border-light transition-all"
        >
          +
        </motion.button>
      </div>
    </div>
  );
};

// ─── PillSelector ────────────────────────────────────────────
interface PillOption { value: string; label: string; description?: string; }

interface PillSelectorProps {
  options: PillOption[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export const PillSelector: React.FC<PillSelectorProps> = ({
  options, selected, onChange, className,
}) => {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <motion.button
            key={option.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border',
              isSelected
                ? 'bg-accent-gold text-bg-primary border-accent-gold shadow-lg shadow-accent-gold/20'
                : 'bg-bg-elevated text-text-secondary border-border hover:border-border-light hover:text-text-primary'
            )}
          >
            {option.label}
          </motion.button>
        );
      })}
    </div>
  );
};

// ─── Stepper (Wizard Progress) ───────────────────────────────
interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, className }) => {
  return (
    <div className={cn('flex flex-col gap-0', className)}>
      {steps.map((step, i) => {
        const isCompleted = i + 1 < currentStep;
        const isCurrent = i + 1 === currentStep;
        return (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0',
                  isCompleted
                    ? 'bg-accent-gold text-bg-primary'
                    : isCurrent
                      ? 'bg-accent-gold/20 text-accent-gold border-2 border-accent-gold'
                      : 'bg-bg-elevated text-text-tertiary border border-border'
                )}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7L6 10L11 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 h-8 transition-colors duration-300',
                    isCompleted ? 'bg-accent-gold' : 'bg-border'
                  )}
                />
              )}
            </div>
            <div className="pt-1 pb-4">
              <span
                className={cn(
                  'text-sm font-medium block',
                  isCurrent ? 'text-accent-gold' : isCompleted ? 'text-text-primary' : 'text-text-tertiary'
                )}
              >
                {step.label}
              </span>
              {step.description && isCurrent && (
                <span className="text-xs text-text-tertiary mt-0.5 block">{step.description}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Timeline ────────────────────────────────────────────────
interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  icon?: string;
  type?: 'info' | 'warning' | 'success' | 'danger';
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ events, className }) => {
  const colors: Record<string, string> = {
    info: 'bg-accent-teal',
    warning: 'bg-yellow-400',
    success: 'bg-accent-green',
    danger: 'bg-accent-red',
  };

  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={cn('w-3 h-3 rounded-full mt-1.5 shrink-0', colors[event.type || 'info'])} />
            {i < events.length - 1 && <div className="w-px h-full bg-border min-h-[40px]" />}
          </div>
          <div className="pb-6">
            <span className="text-xs text-text-tertiary">{event.date}</span>
            <div className="flex items-center gap-2 mt-0.5">
              {event.icon && <span>{event.icon}</span>}
              <span className="text-sm font-medium text-text-primary">{event.title}</span>
            </div>
            {event.description && (
              <p className="text-xs text-text-secondary mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

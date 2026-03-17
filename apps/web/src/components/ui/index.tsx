import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ─── Button ──────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';
  const variants: Record<string, string> = {
    primary: 'bg-accent-gold text-bg-primary hover:bg-accent-gold-light shadow-lg shadow-accent-gold/20',
    secondary: 'bg-bg-elevated text-text-primary border border-border hover:border-accent-gold/40 hover:bg-bg-card',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated',
    danger: 'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3.5 text-base gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </motion.button>
  );
};

// ─── Input ───────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-secondary">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200',
              'focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20',
              error && 'border-accent-red/50 focus:border-accent-red/50 focus:ring-accent-red/20',
              icon ? 'pl-10' : '',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-accent-red">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// ─── Textarea ────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-secondary">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 resize-y min-h-[100px]',
            'focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20',
            error && 'border-accent-red/50',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-accent-red">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// ─── Select ──────────────────────────────────────────────────
interface SelectOption { value: string; label: string; }
interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  searchable?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label, options, value, onChange, placeholder, error, searchable, className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;
  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1.5" ref={ref}>
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full bg-bg-elevated border border-border rounded-lg px-4 py-2.5 text-left outline-none transition-all duration-200 flex items-center justify-between',
            'focus:border-accent-gold/50 hover:border-border-light',
            error && 'border-accent-red/50',
            className
          )}
        >
          <span className={selected ? 'text-text-primary' : 'text-text-tertiary'}>
            {selected?.label || placeholder || 'Select...'}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={cn('transition-transform', open && 'rotate-180')}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 mt-1 w-full bg-bg-elevated border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {searchable && (
              <div className="p-2 border-b border-border">
                <input
                  type="text"
                  value={search}
                  autoFocus
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-bg-primary border border-border rounded px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none"
                />
              </div>
            )}
            {filtered.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange?.(option.value); setOpen(false); setSearch(''); }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-bg-card transition-colors',
                  option.value === value ? 'text-accent-gold bg-accent-gold/5' : 'text-text-primary'
                )}
              >
                {option.label}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-4 py-3 text-sm text-text-tertiary">No results found</div>
            )}
          </motion.div>
        )}
      </div>
      {error && <p className="text-xs text-accent-red">{error}</p>}
    </div>
  );
};

// ─── Toggle ──────────────────────────────────────────────────
interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, size = 'md' }) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };
  const s = sizes[size];

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={cn(
          s.track,
          'relative rounded-full transition-colors duration-200 cursor-pointer',
          checked ? 'bg-accent-gold' : 'bg-border-light'
        )}
      >
        <div
          className={cn(
            s.thumb,
            'absolute top-0.5 left-0.5 bg-white rounded-full transition-transform duration-200 shadow-sm',
            checked && s.translate
          )}
        />
      </div>
      {label && <span className="text-sm text-text-primary">{label}</span>}
    </label>
  );
};

// ─── Badge ───────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variants: Record<string, string> = {
    default: 'bg-bg-elevated text-text-secondary border-border',
    success: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    danger: 'bg-accent-red/10 text-accent-red border-accent-red/20',
    info: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
    gold: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

// ─── Tooltip ─────────────────────────────────────────────────
interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-bg-elevated text-text-primary text-xs rounded-lg border border-border shadow-lg whitespace-nowrap z-50">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-bg-elevated border-r border-b border-border rotate-45" />
        </div>
      )}
    </div>
  );
};

// ─── Skeleton ────────────────────────────────────────────────
interface SkeletonProps { className?: string; }

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn('animate-shimmer rounded-lg', className)} />
);

// ─── Modal ───────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full bg-bg-card border border-border rounded-xl shadow-2xl overflow-hidden',
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold font-display">{title}</h3>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// ─── Drawer ──────────────────────────────────────────────────
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-bg-card border-l border-border shadow-2xl h-full overflow-y-auto"
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-bg-card z-10">
            <h3 className="text-lg font-semibold font-display">{title}</h3>
            <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// ─── CountUp ─────────────────────────────────────────────────
interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  formatter?: (n: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end, duration = 2000, prefix = '', suffix = '', className, formatter,
}) => {
  const [count, setCount] = React.useState(0);
  const countRef = React.useRef(0);
  const frameRef = React.useRef<number>(0);

  React.useEffect(() => {
    const startTime = performance.now();
    const startValue = countRef.current;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (end - startValue) * easedProgress);
      
      setCount(currentValue);
      countRef.current = currentValue;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  const display = formatter ? formatter(count) : count.toString();

  return (
    <span className={cn('mono-value', className)}>
      {prefix}{display}{suffix}
    </span>
  );
};

// ─── ProgressRing ────────────────────────────────────────────
interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value, max = 100, size = 120, strokeWidth = 8, color = '#C9A84C', bgColor = '#2A2A2A', children, className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── ScoreGauge ──────────────────────────────────────────────
interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 200, label }) => {
  const getColor = (s: number) => {
    if (s >= 90) return '#C9A84C';
    if (s >= 80) return '#4ADE80';
    if (s >= 60) return '#FB923C';
    if (s >= 40) return '#FACC15';
    return '#F87171';
  };

  const getLabel = (s: number) => {
    if (s >= 90) return 'Excellent';
    if (s >= 80) return 'Good';
    if (s >= 60) return 'Fair';
    if (s >= 40) return 'Needs Attention';
    return 'Critical';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <ProgressRing value={score} size={size} strokeWidth={10} color={getColor(score)}>
        <div className="flex flex-col items-center">
          <CountUp end={score} className="text-4xl font-bold text-text-primary" />
          <span className="text-xs text-text-tertiary mt-1">{label || 'out of 100'}</span>
        </div>
      </ProgressRing>
      <span className="text-sm font-medium" style={{ color: getColor(score) }}>
        {getLabel(score)}
      </span>
    </div>
  );
};

// ─── EmptyState ──────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    {icon && <span className="text-5xl mb-4">{icon}</span>}
    <h3 className="text-lg font-semibold text-text-primary mb-2 font-display">{title}</h3>
    <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Input } from '@/components/ui';
import { useUserStore } from '@/store/userStore';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useUserStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/app/dashboard');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signIn(email, email.split('@')[0] || 'User');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-bg-card border-r border-border p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-lg">E</div>
            <span className="font-display font-bold text-2xl gradient-text">EstateOS</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Welcome back to your estate command center.
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Your assets, your plan, your legacy - all in one place. Pick up right where you left off.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-sm">E</div>
            <span className="font-display font-bold text-xl gradient-text">EstateOS</span>
          </div>

          <h1 className="text-2xl font-bold font-display mb-2">Sign in</h1>
          <p className="text-text-secondary text-sm mb-8">Enter your credentials to access your estate</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-gold hover:text-accent-gold-light font-medium">
              Get started free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useUserStore();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/onboarding');
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signIn(email, name || 'User');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-bg-card border-r border-border p-12">
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-lg">E</div>
            <span className="font-display font-bold text-2xl gradient-text">EstateOS</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4">
            Start protecting what matters most.
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Join thousands of professionals who are taking control of their estate plan. Setup takes less than 10 minutes.
          </p>
          <div className="mt-8 space-y-3">
            {['Complete estate inventory', 'AI-powered risk analysis', 'Executor-ready dashboard'].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                <div className="w-5 h-5 rounded-full bg-accent-gold/20 flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-accent-gold flex items-center justify-center text-bg-primary font-bold text-sm">E</div>
            <span className="font-display font-bold text-xl gradient-text">EstateOS</span>
          </div>

          <h1 className="text-2xl font-bold font-display mb-2">Create your account</h1>
          <p className="text-text-secondary text-sm mb-8">No credit card required. Get started in minutes.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-accent-gold hover:text-accent-gold-light font-medium">
              Sign in
            </Link>
          </p>

          <p className="text-xs text-text-tertiary text-center mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

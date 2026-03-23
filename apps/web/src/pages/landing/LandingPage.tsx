import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button, CountUp } from '@/components/ui';
import { useUserStore } from '@/store/userStore';

// ─── Animated Background Shapes ──────────────────────────────
const FloatingShapes: React.FC = () => {
  const shapes = [
    { type: 'doc', x: '10%', y: '20%', delay: 0, size: 40 },
    { type: 'house', x: '80%', y: '15%', delay: 1.5, size: 48 },
    { type: 'shield', x: '20%', y: '70%', delay: 3, size: 36 },
    { type: 'key', x: '75%', y: '65%', delay: 0.8, size: 42 },
    { type: 'chart', x: '50%', y: '10%', delay: 2.2, size: 38 },
    { type: 'wallet', x: '90%', y: '45%', delay: 1.2, size: 34 },
    { type: 'doc', x: '5%', y: '50%', delay: 2.8, size: 30 },
    { type: 'house', x: '60%', y: '80%', delay: 0.5, size: 44 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute opacity-[0.06]"
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        >
          <svg width={shape.size} height={shape.size} viewBox="0 0 48 48" fill="none">
            {shape.type === 'doc' && (
              <path d="M12 4H30L38 12V40C38 42.2 36.2 44 34 44H12C9.8 44 8 42.2 8 40V8C8 5.8 9.8 4 12 4Z" stroke="#C9A84C" strokeWidth="2" />
            )}
            {shape.type === 'house' && (
              <path d="M8 20L24 6L40 20V40C40 42.2 38.2 44 36 44H12C9.8 44 8 42.2 8 40V20Z" stroke="#C9A84C" strokeWidth="2" />
            )}
            {shape.type === 'shield' && (
              <path d="M24 4L40 12V24C40 34 32 42 24 44C16 42 8 34 8 24V12L24 4Z" stroke="#C9A84C" strokeWidth="2" />
            )}
            {shape.type === 'key' && (
              <>
                <circle cx="18" cy="18" r="8" stroke="#C9A84C" strokeWidth="2" />
                <path d="M24 24L40 40M36 36L40 32" stroke="#C9A84C" strokeWidth="2" />
              </>
            )}
            {shape.type === 'chart' && (
              <>
                <path d="M8 40L18 28L26 32L40 16" stroke="#C9A84C" strokeWidth="2" />
                <path d="M8 40H40" stroke="#C9A84C" strokeWidth="2" />
              </>
            )}
            {shape.type === 'wallet' && (
              <path d="M8 14H36C38.2 14 40 15.8 40 18V38C40 40.2 38.2 42 36 42H12C9.8 42 8 40.2 8 38V14ZM8 14V10C8 7.8 9.8 6 12 6H32" stroke="#C9A84C" strokeWidth="2" />
            )}
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ─── Landing Page ────────────────────────────────────────────
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserStore();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/estate-os-demo/logo.jpg" alt="Legacy Logo" className="h-8 w-auto mix-blend-lighten object-contain rounded" />
            <span className="font-display font-bold text-xl gradient-text">Legacy</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/signin')}>Sign In</Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>Get Started - Free</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <FloatingShapes />
        <motion.div style={{ y: heroY }} className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05]">
              Your estate.{' '}
              <span className="gradient-text">Always ready.</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
              A living estate planning system that grows with your life. Not just a will. An operating system for everything you own.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button size="lg" onClick={() => navigate('/signup')}>
              Get Started - Free
            </Button>
            <Button variant="secondary" size="lg" onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              See How It Works
            </Button>
          </motion.div>

          {/* Stat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-text-secondary"
          >
            <span className="text-sm">Over</span>
            <span className="text-accent-gold font-bold text-lg mono-value">
              <CountUp end={76} duration={2500} suffix="%" />
            </span>
            <span className="text-sm">of Americans are unprepared. Don't be one of them.</span>
          </motion.div>
        </motion.div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6"
        >
          <div className="card card-elevated rounded-t-2xl p-6 pt-8 bg-gradient-to-b from-bg-elevated to-transparent">
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-accent-gold/10 border-2 border-accent-gold/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-gold mono-value">74</span>
                </div>
                <div>
                  <div className="text-sm text-text-secondary">Estate Health</div>
                  <div className="text-accent-gold text-sm font-medium">Good</div>
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-sm text-text-secondary">Total Estate Value</div>
                <div className="text-xl font-bold mono-value">$487,200</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="hidden md:block">
                <div className="text-sm text-text-secondary">Action Items</div>
                <div className="text-accent-red font-medium">3 need attention</div>
              </div>
            </div>
            <div className="h-24 bg-gradient-to-b from-bg-card/50 to-transparent rounded-lg" />
          </div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-6" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Estate planning is <span className="text-accent-red">broken</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              The traditional approach fails families. Here's why.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📄',
                iconBg: 'bg-accent-red/10',
                title: 'Static documents go stale',
                description: 'A will drafted 5 years ago doesn\'t reflect your life today. New assets, new relationships, new laws - your plan falls behind.',
              },
              {
                icon: '🕸️',
                iconBg: 'bg-yellow-500/10',
                title: 'Assets scattered everywhere',
                description: '401(k) at work, crypto on Coinbase, property in two states, life insurance from 2018. No single source of truth.',
              },
              {
                icon: '😰',
                iconBg: 'bg-accent-teal/10',
                title: 'Executors are left guessing',
                description: 'When the time comes, your executor has no roadmap. Which banks? What accounts? Where are the passwords?',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card card-hover p-8"
              >
                <div className={`w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center text-2xl mb-5`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-semibold font-display mb-3">{card.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-bg-card/30" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything your estate needs. <span className="gradient-text">In one place.</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Six powerful tools working together to keep your estate plan alive and actionable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📦', title: 'Living Asset Inventory', description: 'Catalog every asset you own - from bank accounts to crypto wallets. One complete picture, always current.', color: '#4ADE80' },
              { icon: '🧠', title: 'AI-Powered Analysis', description: 'Our AI engine reviews your entire estate and surfaces risks, gaps, and opportunities you\'d never catch alone.', color: '#C9A84C' },
              { icon: '🔐', title: 'Digital Asset Vault', description: 'Securely store crypto keys, passwords, and account access. Released only to the right person, at the right time.', color: '#818CF8' },
              { icon: '👤', title: 'Executor Readiness', description: 'Your executor gets a complete roadmap - every institution, every account, every next step. No guessing.', color: '#2DD4BF' },
              { icon: '📋', title: 'Plan Builder', description: 'A personalized action plan: what documents you need, who to assign, and how to get it done - DIY or with an attorney.', color: '#F472B6' },
              { icon: '💯', title: 'Estate Health Score', description: 'A real-time score (0–100) that shows exactly how prepared your estate is, with specific ways to improve.', color: '#FB923C' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card card-hover p-8 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${feature.color}15` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold font-display mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-6 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-text-tertiary mb-8">Trusted by teams at leading companies</p>
          <div className="flex items-center justify-center gap-12 opacity-30">
            {['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft'].map((company) => (
              <span key={company} className="text-lg font-display font-bold text-text-secondary">{company}</span>
            ))}
          </div>

          {/* Quote cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            {[
              { quote: "I had no idea my crypto would be permanently lost without an access plan. Legacy caught that in minutes.", name: 'Jordan T.', role: 'Software Engineer, 28', avatar: '🧑‍💻' },
              { quote: "After my father passed, settling his estate took 18 months. I wish he'd had something like this.", name: 'Margaret L.', role: 'Retired CFO, 62', avatar: '👩‍💼' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card p-8"
              >
                <p className="text-text-primary mb-6 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{testimonial.avatar}</span>
                  <div>
                    <div className="text-sm font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-text-tertiary">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Start building your estate plan in{' '}
              <span className="gradient-text">10 minutes</span>
            </h2>
            <p className="text-text-secondary mb-8">
              No credit card required. No legal jargon. Just a clear picture of where you stand.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started - Free
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/estate-os-demo/logo.jpg" alt="Legacy Logo" className="h-6 w-auto mix-blend-lighten object-contain rounded" />
            <span className="text-sm text-text-tertiary">Legacy © {new Date().getFullYear()}</span>
          </div>
          <div className="text-[10px] text-text-tertiary max-w-3xl text-center md:text-left leading-relaxed">
            Legacy provides estate planning guidance and tools, not legal advice. For legal documents, consult a licensed attorney in your state.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

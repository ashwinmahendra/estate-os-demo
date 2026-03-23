import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/app/assets', label: 'Assets', icon: '💰' },
  { path: '/app/analysis', label: 'Analysis', icon: '📊' },
  { path: '/app/plan', label: 'Plan', icon: '📋' },
  { path: '/app/vault', label: 'Vault', icon: '🔐' },
];

const SETTINGS_ITEMS = [
  { path: '/app/settings', label: 'Settings', icon: '⚙️' },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, notifications } = useUserStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-bg-card transition-all duration-300 shrink-0',
          sidebarCollapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border shrink-0">
          <img src="/estate-os-demo/logo.jpg" alt="Legacy Logo" className="h-8 w-auto mix-blend-lighten object-contain rounded" />
          {!sidebarCollapsed && (
            <span className="font-display font-bold text-lg gradient-text">Legacy</span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-accent-gold/10 text-accent-gold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {!sidebarCollapsed && <span>{item.label}</span>}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 w-0.5 h-6 bg-accent-gold rounded-r"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="py-4 px-2 border-t border-border space-y-1">
          {SETTINGS_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
            >
              <span className="text-lg">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all w-full"
          >
            <span className="text-lg">{sidebarCollapsed ? '→' : '←'}</span>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-bg-card/50 backdrop-blur flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            {/* Breadcrumb can go here */}
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C7.24 2 5 4.24 5 7V10.5L3.5 13H16.5L15 10.5V7C15 4.24 12.76 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent-red rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User */}
            <button
              onClick={() => navigate('/app/settings')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-elevated transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-text-secondary hidden md:block">{user?.name || 'User'}</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

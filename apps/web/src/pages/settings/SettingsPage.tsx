import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { Button, Input } from '@/components/ui';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useUserStore();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-display mb-6">Settings</h1>

        <div className="card p-6 space-y-4">
          <h3 className="text-sm font-semibold">Account</h3>
          <Input label="Full Name" value={user?.name || ''} readOnly />
          <Input label="Email" value={user?.email || ''} readOnly />
          <p className="text-xs text-text-tertiary">Account management is handled through your authentication provider.</p>
        </div>

        <div className="card p-6 mt-6 space-y-4">
          <h3 className="text-sm font-semibold">Estate Profile</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-text-tertiary">State:</span> <span className="ml-2">{profile?.stateOfResidence || 'Not set'}</span></div>
            <div><span className="text-text-tertiary">Marital Status:</span> <span className="ml-2">{profile?.maritalStatus?.replace(/_/g, ' ') || 'Not set'}</span></div>
            <div><span className="text-text-tertiary">Children:</span> <span className="ml-2">{profile?.hasChildren ? `Yes (${profile.numberOfChildren})` : 'No'}</span></div>
            <div><span className="text-text-tertiary">Employment:</span> <span className="ml-2">{profile?.employmentStatus?.replace(/_/g, ' ') || 'Not set'}</span></div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/onboarding')}>Update Profile</Button>
        </div>

        <div className="card p-6 mt-6 space-y-4">
          <h3 className="text-sm font-semibold">Executor Management</h3>
          <p className="text-sm text-text-secondary">Manage your designated executors and their access levels.</p>
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/plan')}>Manage Executors</Button>
        </div>

        <div className="card p-6 mt-6">
          <h3 className="text-sm font-semibold text-accent-red mb-3">Danger Zone</h3>
          <Button variant="danger" size="sm" onClick={() => { signOut(); navigate('/'); }}>Sign Out</Button>
        </div>

        <p className="text-xs text-text-tertiary mt-6 text-center">
          EstateOS provides estate planning guidance and tools, not legal advice. For legal documents, consult a licensed attorney in your state.
        </p>
      </motion.div>
    </div>
  );
};

export default SettingsPage;

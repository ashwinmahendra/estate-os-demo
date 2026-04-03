import React from 'react';
import type { DemoProfile, DemoAsset } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: DemoAsset[]; totalValue: number; rules: StateRules; }

export const DigitalAssetTemplate: React.FC<Props> = ({ profile, assets, rules }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const cryptoAssets = assets.filter(a => a.category === 'crypto');
  const digitalCategories = ['crypto', 'stocks', 'other'];
  const relevantAssets = assets.filter(a => digitalCategories.includes(a.category));

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Digital Asset Directive<br />
        <span className="text-base font-normal normal-case">(Fiduciary Access to Digital Assets)</span><br />
        <span className="text-lg font-normal normal-case">of {name}</span>
      </h1>

      <InlineFlag severity="warning">
        Without explicit authorization, executors and trustees may not be able to access your digital
        accounts — including email, social media, and cryptocurrency — due to federal computer fraud
        laws (Computer Fraud and Abuse Act (CFAA) and Stored Communications Act (SCA)).
      </InlineFlag>

      {/* RUFADAA Reference */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 1 — Legal Basis</h2>
        <p>
          This Directive is executed pursuant to the Revised Uniform Fiduciary Access to Digital Assets
          Act (RUFADAA) as adopted in {state} ({rules.digitalAssetsLaw}). I, <strong>{name}</strong>,
          a resident of {state}, hereby authorize my designated fiduciary to access, manage, and transfer
          my digital assets as described herein.
        </p>
      </section>

      {/* Fiduciary Appointment */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 2 — Designated Fiduciary</h2>
        <p>
          I appoint the following individual(s) as my Digital Fiduciary with authority over my digital assets:
        </p>
        <div className="mt-3 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
          <p><strong>Primary Digital Fiduciary:</strong> <Placeholder field="DIGITAL FIDUCIARY NAME" tip="This should be someone technically savvy who you trust with access to all digital accounts." /></p>
          <p className="mt-1"><strong>Successor:</strong> <Placeholder field="SUCCESSOR DIGITAL FIDUCIARY" tip="Name a backup." /></p>
        </div>
      </section>

      {/* RUFADAA Opt-In */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 3 — RUFADAA Opt-In Authorization</h2>
        <p className="font-semibold" style={{ color: '#92700C', background: 'rgba(191,160,82,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
          I expressly grant my designated fiduciary full access to the content of my electronic
          communications and all digital assets, overriding any contrary terms-of-service agreement
          with any custodian, to the maximum extent permitted by law.
        </p>
      </section>

      {/* Scope */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 4 — Scope of Authority</h2>
        <p>My Digital Fiduciary shall have the authority to:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
          <li>Access, manage, archive, delete, or transfer any digital account I own</li>
          <li>Access and transfer cryptocurrency held in software wallets, hardware wallets, or custodial exchanges</li>
          <li>Retrieve passwords, private keys, seed phrases, and two-factor authentication credentials from my secure storage</li>
          <li>Communicate with online service providers on my behalf</li>
          <li>Access and preserve electronic communications (email, messaging apps)</li>
          <li>Manage social media accounts (memorialize, download data, or delete)</li>
          <li>Access cloud storage and download or transfer files</li>
        </ul>
      </section>

      {/* Digital Asset Inventory */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 5 — Digital Asset Inventory</h2>
        <p>The following digital assets have been identified from my estate profile:</p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-3">Asset</th>
                <th className="text-left py-2 pr-3">Category</th>
                <th className="text-right py-2 pr-3">Value</th>
                <th className="text-left py-2 pr-3">Account / URL</th>
                <th className="text-left py-2">Access Method</th>
              </tr>
            </thead>
            <tbody>
              {relevantAssets.length > 0 ? relevantAssets.map(a => (
                <tr key={a.id} className="border-b border-gray-200">
                  <td className="py-2 pr-3">{a.name}</td>
                  <td className="py-2 pr-3 capitalize">{a.category.replace(/_/g, ' ')}</td>
                  <td className="py-2 pr-3 text-right">${a.value.toLocaleString()}</td>
                  <td className="py-2 pr-3"><Placeholder field="ACCOUNT URL" tip="Enter the platform URL or account identifier." /></td>
                  <td className="py-2"><Placeholder field="ACCESS METHOD" tip="E.g., 'Password in vault', 'Hardware key', 'Seed phrase in safe deposit box'" /></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="py-4 text-center text-gray-400">No digital assets detected in profile.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {cryptoAssets.length > 0 && (
          <InlineFlag severity="warning">
            Cryptocurrency detected ({cryptoAssets.map(a => `${a.name}: $${a.value.toLocaleString()}`).join(', ')}).
            Private keys and seed phrases must be securely stored and accessible to your fiduciary.
            If these are lost, the funds may be permanently irrecoverable.
          </InlineFlag>
        )}
      </section>

      {/* Online Accounts */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 6 — Online Accounts</h2>
        <p className="text-sm mb-3">
          Additional online accounts to which this directive applies (not exhaustive):
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {['Email (Gmail, Outlook, etc.)', 'Social Media (Facebook, Instagram, LinkedIn, X)',
            'Cloud Storage (Google Drive, iCloud, Dropbox)', 'Streaming Services',
            'Domain Registrations', 'Online Banking Portals',
            'Subscription Services', 'Professional Platforms'
          ].map(cat => (
            <div key={cat} className="p-2 rounded border border-gray-200 flex items-center gap-2">
              <span className="text-gray-400">☐</span>
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        <p>
          IN WITNESS WHEREOF, I have executed this Digital Asset Directive on <strong>{today}</strong>.
        </p>
        <div className="mt-8 space-y-6">
          <div>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Principal</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
          <div>
            <div className="w-60 border-b border-gray-800 mb-1" />
            <p className="text-sm">Notary Public (Recommended)</p>
            <p className="text-xs text-gray-500">My commission expires: _______________</p>
          </div>
        </div>
      </section>
    </div>
  );
};

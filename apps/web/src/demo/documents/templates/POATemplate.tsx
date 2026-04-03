import React from 'react';
import type { DemoProfile, DemoAsset } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: DemoAsset[]; totalValue: number; rules: StateRules; }

export const POATemplate: React.FC<Props> = ({ profile, rules }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Durable Power of Attorney<br />
        <span className="text-lg font-normal normal-case">of {name}</span>
      </h1>

      {/* Notice */}
      <div className="p-4 rounded-lg text-sm" style={{ background: '#FFF8E7', border: '1px solid #E8D5A0' }}>
        <strong>NOTICE TO PRINCIPAL:</strong> This is an important legal document. Before signing, you should
        understand that: (1) this document gives your agent broad powers over your finances; (2) those powers
        will continue even if you become incapacitated; (3) you may revoke this power at any time while competent.
      </div>

      <InlineFlag severity="warning">
        Without a Durable Power of Attorney, if you become incapacitated, a court-appointed conservator
        may be required — an expensive and slow legal process under M.G.L. Ch. 190B §5-501.
      </InlineFlag>

      {/* Declaration */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 1 — Appointment of Agent</h2>
        <p>
          I, <strong>{name}</strong>, a resident of the Commonwealth of <strong>{state}</strong>,
          being of legal age (at least {rules.minimumPOAAge} years old) and of sound mind, hereby
          appoint:
        </p>
        <p className="mt-2 ml-6">
          <strong>Agent (Attorney-in-Fact):</strong>{' '}
          <Placeholder field="AGENT FULL NAME" tip="Name someone you deeply trust to handle your financial affairs." />
        </p>
        <p className="mt-1 ml-6">
          <strong>Successor Agent:</strong>{' '}
          <Placeholder field="SUCCESSOR AGENT NAME" tip="Name a backup in case your primary agent cannot serve." />
        </p>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 190B §5-501 through §5-507
        </p>
      </section>

      {/* Durability */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 2 — Durability Clause</h2>
        <p className="font-semibold" style={{ color: '#92700C', background: 'rgba(191,160,82,0.08)', padding: '8px 12px', borderRadius: '8px' }}>
          "This power of attorney shall not be affected by the subsequent disability or incapacity of the
          principal, or lapse of time."
        </p>
        <p className="mt-2 text-sm">
          This clause ensures that the authority granted herein continues in full force if I become mentally
          or physically incapacitated and unable to manage my own affairs.
        </p>
      </section>

      {/* Effective Date */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 3 — Effective Date</h2>
        <p>
          This Durable Power of Attorney shall become effective immediately upon execution, unless
          otherwise specified below:
        </p>
        <p className="mt-2 ml-6">
          <Placeholder field="EFFECTIVE DATE OR 'IMMEDIATELY'" tip="Specify if this should be effective immediately or upon incapacity (springing POA)." />
        </p>
      </section>

      {/* Powers Granted */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 4 — Powers Granted</h2>
        <p>I grant my Agent the following broad powers on my behalf:</p>
        <div className="mt-3 space-y-2">
          {[
            { title: 'Banking & Financial', desc: 'Open, close, and manage bank accounts; make deposits and withdrawals; access safe deposit boxes.' },
            { title: 'Investments', desc: 'Buy, sell, and manage stocks, bonds, mutual funds, and other securities.' },
            { title: 'Real Estate', desc: 'Buy, sell, lease, manage, and mortgage real property.' },
            { title: 'Tax Matters', desc: 'Prepare, sign, and file tax returns; represent me before tax authorities.' },
            { title: 'Business Operations', desc: 'Manage, operate, or dissolve any business interest I hold.' },
            { title: 'Government Benefits', desc: 'Apply for and manage Social Security, Medicare, Medicaid, and other benefits.' },
            { title: 'Insurance', desc: 'Purchase, modify, or cancel insurance policies; file and settle claims.' },
            { title: 'Legal Proceedings', desc: 'Initiate, defend, or settle legal claims on my behalf.' },
          ].map(p => (
            <div key={p.title} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#F9F9F9' }}>
              <span className="text-green-600 mt-0.5">✓</span>
              <div>
                <span className="font-semibold text-sm">{p.title}:</span>{' '}
                <span className="text-sm text-gray-600">{p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 5 — Limitations</h2>
        <p>My Agent shall NOT have the power to:</p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
          <li>Make, amend, or revoke my Last Will and Testament</li>
          <li>Change beneficiary designations on my life insurance or retirement accounts (unless specifically authorized)</li>
          <li>Make gifts exceeding the annual federal gift tax exclusion</li>
        </ul>
      </section>

      {/* Revocation */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 6 — Revocation</h2>
        <p>
          I may revoke this Power of Attorney at any time by providing written notice to my Agent.
          This Power of Attorney is automatically revoked upon my death.
        </p>
      </section>

      {/* Governing Law */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 7 — Governing Law</h2>
        <p>
          This instrument shall be governed by the laws of the Commonwealth of {state}.
        </p>
      </section>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        {rules.poaNotarizationRecommended && (
          <InlineFlag severity="info">
            Notarization is strongly recommended in {state} for real estate transactions
            and to ensure acceptance by financial institutions.
          </InlineFlag>
        )}
        <p>
          IN WITNESS WHEREOF, I have hereunto signed my name on <strong>{today}</strong>.
        </p>
        <div className="mt-8 space-y-6">
          <div>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Principal</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2">Acknowledgment of Agent:</p>
            <p className="text-sm mb-3">
              I, the undersigned Agent, acknowledge that I accept the responsibilities of serving as
              Attorney-in-Fact for <strong>{name}</strong> and agree to act in their best interest.
            </p>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm">Agent Signature</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
          <div>
            <div className="w-60 border-b border-gray-800 mb-1" />
            <p className="text-sm">Notary Public</p>
            <p className="text-xs text-gray-500">My commission expires: _______________</p>
          </div>
        </div>
      </section>
    </div>
  );
};

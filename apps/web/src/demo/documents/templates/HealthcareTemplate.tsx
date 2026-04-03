import React from 'react';
import type { DemoProfile } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: never[]; totalValue: number; rules: StateRules; }

export const HealthcareTemplate: React.FC<Props> = ({ profile, rules }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Healthcare Proxy<br />
        <span className="text-base font-normal normal-case">(Healthcare Directive / Advance Directive)</span><br />
        <span className="text-lg font-normal normal-case">of {name}</span>
      </h1>

      <InlineFlag severity="critical">
        You must name a healthcare agent. This document is not effective without a designated medical decision-maker.
      </InlineFlag>

      <InlineFlag severity="info">
        Under Massachusetts law (M.G.L. Ch. 201D §3), your healthcare agent <strong>cannot</strong> serve
        as a witness to this document. Additionally, the agent must not be your healthcare provider or an employee
        of your healthcare provider.
      </InlineFlag>

      {/* Declaration */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 1 — Appointment of Healthcare Agent</h2>
        <p>
          I, <strong>{name}</strong>, a resident of the Commonwealth of <strong>{state}</strong>,
          being of sound mind and at least 18 years of age, hereby appoint the following person as
          my Healthcare Agent to make healthcare decisions on my behalf if I become unable to make
          or communicate such decisions:
        </p>
        <div className="mt-3 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
          <p><strong>Healthcare Agent:</strong> <Placeholder field="HEALTHCARE AGENT NAME" tip="Name someone you trust to make medical decisions for you." /></p>
          <p className="mt-1"><strong>Phone:</strong> <Placeholder field="AGENT PHONE NUMBER" tip="Provide a reliable contact number." /></p>
          <p className="mt-1"><strong>Address:</strong> <Placeholder field="AGENT ADDRESS" tip="Provide the agent's address." /></p>
        </div>
        <div className="mt-3 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
          <p><strong>Alternate Healthcare Agent:</strong> <Placeholder field="ALTERNATE AGENT NAME" tip="Name a backup agent." /></p>
          <p className="mt-1"><strong>Phone:</strong> <Placeholder field="ALTERNATE AGENT PHONE" tip="Provide a reliable contact number." /></p>
        </div>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 201D §2, §3, §4
        </p>
      </section>

      {/* Scope */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 2 — Scope of Authority</h2>
        <p>
          My Healthcare Agent shall have the authority to make any and all healthcare decisions on my behalf,
          including but not limited to:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
          <li>Consent to or refuse any medical treatment, procedure, or test</li>
          <li>Select and discharge healthcare providers and facilities</li>
          <li>Access my medical records and authorize their release</li>
          <li>Make decisions regarding organ donation</li>
          <li>Direct end-of-life care as specified in my wishes below</li>
        </ul>
      </section>

      {/* End-of-Life Wishes */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 3 — Statement of Wishes</h2>
        <p className="mb-3">
          The following instructions reflect my wishes and should guide my Healthcare Agent's decisions:
        </p>

        <div className="space-y-3">
          <div className="p-4 rounded-lg border" style={{ borderColor: '#E0E0E0' }}>
            <h3 className="font-semibold text-sm mb-2">Life-Sustaining Treatment</h3>
            <p className="text-sm text-gray-600">
              If I am in a terminal condition, persistent vegetative state, or state of advanced dementia
              with no reasonable medical expectation of recovery, my wishes regarding life-sustaining
              treatment are:
            </p>
            <p className="mt-2 text-sm">
              <Placeholder field="LIFE SUPPORT WISHES" tip="E.g., 'Withdraw all life-sustaining treatment' or 'Continue treatment for a period of [X] days.'" />
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: '#E0E0E0' }}>
            <h3 className="font-semibold text-sm mb-2">Cardiopulmonary Resuscitation (CPR)</h3>
            <p className="text-sm">
              <Placeholder field="CPR PREFERENCE" tip="E.g., 'I wish to receive CPR' or 'I do not wish to receive CPR (DNR).'" />
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: '#E0E0E0' }}>
            <h3 className="font-semibold text-sm mb-2">Artificial Nutrition and Hydration</h3>
            <p className="text-sm">
              <Placeholder field="NUTRITION/HYDRATION WISHES" tip="E.g., 'I wish to receive artificial nutrition and hydration' or 'I do not wish to receive any artificial feeding.'" />
            </p>
          </div>

          <div className="p-4 rounded-lg border" style={{ borderColor: '#E0E0E0' }}>
            <h3 className="font-semibold text-sm mb-2">Pain Management</h3>
            <p className="text-sm text-gray-600">
              I wish to receive adequate pain relief, even if such treatment may hasten my death.
            </p>
          </div>
        </div>
      </section>

      {/* HIPAA */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 4 — HIPAA Authorization</h2>
        <p>
          I authorize all healthcare providers, health plans, and clearinghouses to disclose my
          individually identifiable health information and medical records to my Healthcare Agent
          named herein, in accordance with the Health Insurance Portability and Accountability Act
          of 1996 (HIPAA), 45 C.F.R. Parts 160 and 164.
        </p>
      </section>

      {/* Duration */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 5 — Duration and Revocation</h2>
        <p>
          This Healthcare Proxy shall remain in effect indefinitely unless revoked by me. I may revoke
          this document at any time by: (a) notifying my Healthcare Agent in writing; (b) notifying my
          attending physician in writing; or (c) executing a new Healthcare Proxy.
        </p>
      </section>

      <InlineFlag severity="info">
        Your healthcare agent should have a copy of this document. The original should also be filed
        with your primary care physician.
      </InlineFlag>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        <p>
          IN WITNESS WHEREOF, I have hereunto signed my name on <strong>{today}</strong>.
        </p>
        <div className="mt-8 space-y-6">
          <div>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Principal</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
        </div>

        {/* Witness block */}
        <div className="mt-8">
          <h3 className="font-bold text-sm uppercase mb-3">Witness Certification</h3>
          <p className="text-sm mb-4">
            We, the undersigned witnesses, each being at least 18 years of age, do hereby affirm that
            the Principal appeared to be: (a) at least 18 years of age; (b) of sound mind; and (c) under
            no constraint or undue influence. We are not the designated Healthcare Agent.
          </p>
          {Array.from({ length: rules.healthcareProxyWitnessCount }, (_, i) => (
            <div key={i} className="mt-4">
              <div className="w-72 border-b border-gray-800 mb-1" />
              <p className="text-sm">Witness {i + 1} Signature</p>
              <p className="text-xs text-gray-500">Printed Name: ___________________________ &nbsp;&nbsp; Date: _______________</p>
              <p className="text-xs text-gray-500">Address: ______________________________________________</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import type { DemoProfile } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: never[]; totalValue: number; rules: StateRules; }

export const GuardianTemplate: React.FC<Props> = ({ profile }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // If no children, show info only
  if (!profile.hasChildren) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl" style={{ background: 'rgba(191,160,82,0.1)' }}>
          👶
        </div>
        <h2 className="text-xl font-bold">Not Applicable</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          You indicated that you do not have minor children. A guardian designation is only
          applicable for parents of minors. If your circumstances change, this document can be
          generated at that time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Designation of Guardian<br />
        <span className="text-base font-normal normal-case">for Minor Child(ren)</span><br />
        <span className="text-lg font-normal normal-case">by {name}</span>
      </h1>

      <InlineFlag severity="critical">
        You have {profile.childCount} minor child(ren). Naming a guardian is critical. Without this designation,
        a court will decide who cares for your children.
      </InlineFlag>

      <InlineFlag severity="warning">
        Both parents should have a guardian designation. If only one parent has a will naming a guardian,
        and both parents die simultaneously, the court has discretion over the appointment.
      </InlineFlag>

      {/* Declaration */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 1 — Declaration</h2>
        <p>
          I, <strong>{name}</strong>, a resident of the Commonwealth of <strong>{state}</strong>,
          being a parent of {profile.childCount} minor child(ren), hereby nominate and appoint the
          following individual(s) to serve as guardian of the person and property of my minor child(ren)
          in the event I am the sole surviving parent or both parents are deceased or incapacitated.
        </p>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 190B §5-202
        </p>
      </section>

      {/* Children */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 2 — Minor Children</h2>
        <p>This designation applies to the following minor child(ren):</p>
        <div className="mt-3 space-y-2">
          {Array.from({ length: profile.childCount }, (_, i) => (
            <div key={i} className="p-3 rounded-lg flex items-center gap-3" style={{ background: '#F9F9F9' }}>
              <span className="text-sm font-bold text-gray-400 w-6">{i + 1}.</span>
              <div>
                <p><strong>Name:</strong> <Placeholder field={`CHILD ${i + 1} FULL NAME`} tip="Enter child's full legal name." /></p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Date of Birth: <Placeholder field={`CHILD ${i + 1} DOB`} tip="Enter date of birth." />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guardian */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 3 — Nominated Guardian</h2>
        <div className="p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
          <p><strong>Primary Guardian:</strong> <Placeholder field="GUARDIAN FULL NAME" tip="Name someone you trust completely to raise your children." /></p>
          <p className="mt-1"><strong>Address:</strong> <Placeholder field="GUARDIAN ADDRESS" tip="Provide the guardian's current address." /></p>
          <p className="mt-1"><strong>Relationship:</strong> <Placeholder field="GUARDIAN RELATIONSHIP" tip="E.g., 'Maternal Grandmother', 'Uncle', 'Family friend'" /></p>
        </div>
        <div className="mt-3 p-4 rounded-lg" style={{ background: '#F9F9F9' }}>
          <p><strong>Successor Guardian:</strong> <Placeholder field="SUCCESSOR GUARDIAN NAME" tip="Name a backup guardian." /></p>
          <p className="mt-1"><strong>Relationship:</strong> <Placeholder field="SUCCESSOR GUARDIAN RELATIONSHIP" tip="Their relationship to the children." /></p>
        </div>
      </section>

      {/* Instructions */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 4 — Special Instructions</h2>
        <p>
          I provide the following guidance and instructions for the guardian of my child(ren):
        </p>
        <div className="mt-3 p-4 rounded-lg border" style={{ borderColor: '#E0E0E0' }}>
          <Placeholder field="SPECIAL INSTRUCTIONS FOR GUARDIAN" tip="E.g., 'I wish for my children to remain in their current school district', religious upbringing preferences, maintaining contact with extended family, etc." />
        </div>
      </section>

      {/* Financial Provisions */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Section 5 — Financial Provisions</h2>
        <p>
          I direct that the guardian shall have reasonable access to funds from my estate for the
          care, maintenance, education, and support of my minor child(ren). The guardian shall account
          for all expenditures and shall not use estate funds for their personal benefit.
        </p>
      </section>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        <p>
          IN WITNESS WHEREOF, I have executed this Guardian Designation on <strong>{today}</strong>.
        </p>
        <div className="mt-8 space-y-6">
          <div>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Parent</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
          <div className="mt-4">
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm">Witness Signature</p>
            <p className="text-xs text-gray-500">Printed Name: ___________________________ &nbsp;&nbsp; Date: _______________</p>
          </div>
          <div className="mt-4">
            <div className="w-60 border-b border-gray-800 mb-1" />
            <p className="text-sm">Notary Public (Recommended)</p>
            <p className="text-xs text-gray-500">My commission expires: _______________</p>
          </div>
        </div>
      </section>
    </div>
  );
};

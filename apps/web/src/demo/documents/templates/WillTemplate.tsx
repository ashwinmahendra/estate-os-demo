import React from 'react';
import type { DemoProfile, DemoAsset } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: DemoAsset[]; totalValue: number; rules: StateRules; }

export const WillTemplate: React.FC<Props> = ({ profile, assets, totalValue, rules }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      {/* Title */}
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Last Will and Testament<br />
        <span className="text-lg font-normal normal-case">of {name}</span>
      </h1>

      {/* Preamble */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article I — Declaration</h2>
        <p>
          I, <strong>{name}</strong>, a resident of the Commonwealth of <strong>{state}</strong>,
          being of legal age (at least {rules.minimumWillAge} years old) and of sound mind and memory,
          do hereby declare this instrument to be my Last Will and Testament, revoking all prior wills
          and codicils previously made by me.
        </p>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 190B §2-501, §2-502
        </p>
      </section>

      {!rules.holographicWillValid && (
        <InlineFlag severity="info">
          Holographic (handwritten, unwitnessed) wills are not valid in {state}. This will must be printed,
          signed by the testator, and witnessed by {rules.willWitnessCount} competent witnesses.
        </InlineFlag>
      )}

      {/* Family Status */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article II — Family</h2>
        <p>
          I am currently <strong>{profile.maritalStatus || 'not specified'}</strong>.
          {profile.maritalStatus === 'Married' && (
            <> My spouse is <Placeholder field="SPOUSE FULL LEGAL NAME" tip="Enter your spouse's full legal name." />.</>
          )}
        </p>
        {profile.maritalStatus === 'Married' && (
          <InlineFlag severity="warning">
            Under Massachusetts law (M.G.L. Ch. 190B §2-301), an omitted spouse may claim up to
            one-third (1/3) of the estate. Ensure your spouse is expressly provided for or
            expressly excluded in this will.
          </InlineFlag>
        )}
        {profile.hasChildren ? (
          <p className="mt-2">
            I have <strong>{profile.childCount}</strong> minor child(ren):{' '}
            {Array.from({ length: profile.childCount }, (_, i) => (
              <span key={i}>
                <Placeholder field={`CHILD ${i + 1} NAME`} tip={`Enter child ${i + 1}'s full name.`} />
                {i < profile.childCount - 1 ? ', ' : ''}
              </span>
            ))}
            .
          </p>
        ) : (
          <p className="mt-2">I have no minor children.</p>
        )}
      </section>

      {/* Executor */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article III — Personal Representative (Executor)</h2>
        <InlineFlag severity="critical">
          You must name a personal representative (executor) to administer your estate. This is a required field.
        </InlineFlag>
        <p>
          I appoint <Placeholder field="EXECUTOR FULL NAME" tip="Name someone you trust to carry out your wishes." /> as
          Personal Representative of my estate. If they are unable or unwilling to serve, I appoint{' '}
          <Placeholder field="ALTERNATE EXECUTOR NAME" tip="Name a backup executor." /> as successor Personal Representative.
        </p>
        <p className="mt-2">
          My Personal Representative shall have full power and authority to manage, sell, lease, or dispose
          of any and all property belonging to my estate, to pay debts, taxes, and expenses, and to
          distribute the remainder in accordance with the terms of this Will.
        </p>
      </section>

      {/* Guardian */}
      {profile.hasChildren && (
        <section>
          <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article IV — Guardian Designation</h2>
          <InlineFlag severity="critical">
            You have {profile.childCount} minor child(ren). Naming a guardian is critical in the event both parents pass.
          </InlineFlag>
          <p>
            In the event I am the sole surviving parent, I nominate{' '}
            <Placeholder field="GUARDIAN NAME" tip="Name someone you trust to care for your children." /> as
            guardian of the person and property of my minor child(ren). If they are unable or unwilling to serve,
            I nominate <Placeholder field="SUCCESSOR GUARDIAN NAME" tip="Name a backup guardian." /> as successor guardian.
          </p>
          <p className="text-xs italic mt-2 text-gray-500">
            Statutory basis: M.G.L. Ch. 190B §5-202
          </p>
        </section>
      )}

      {/* Bequests */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">
          Article {profile.hasChildren ? 'V' : 'IV'} — Disposition of Property
        </h2>
        <p>I direct that my estate be distributed as follows:</p>

        {/* Asset table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-4">Asset</th>
                <th className="text-left py-2 pr-4">Category</th>
                <th className="text-right py-2 pr-4">Value</th>
                <th className="text-left py-2 pr-4">Ownership</th>
                <th className="text-left py-2">Beneficiary</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-gray-200">
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 capitalize">{a.category.replace(/_/g, ' ')}</td>
                  <td className="py-2 pr-4 text-right">${a.value.toLocaleString()}</td>
                  <td className="py-2 pr-4">{a.ownership}</td>
                  <td className="py-2">
                    {a.hasBeneficiary ? (
                      <span className="text-green-700">✓ Designated</span>
                    ) : (
                      <span className="text-red-600 font-medium">⚠️ None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-400 font-bold">
                <td className="py-2 pr-4">Total Estate Value</td>
                <td></td>
                <td className="py-2 pr-4 text-right">${totalValue.toLocaleString()}</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-4">
          I bequeath and devise all of the above-described property, and any other property I may own at the time
          of my death, to <Placeholder field="PRIMARY BENEFICIARY NAME" tip="Name your primary beneficiary." />.
          Should my primary beneficiary predecease me, I direct this bequest to{' '}
          <Placeholder field="CONTINGENT BENEFICIARY NAME" tip="Name an alternate beneficiary." />.
        </p>
      </section>

      {/* Residuary */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">
          Article {profile.hasChildren ? 'VI' : 'V'} — Residuary Estate
        </h2>
        <p>
          All the rest, residue, and remainder of my estate, whether real, personal, or mixed, wherever situated,
          I give, devise, and bequeath to{' '}
          <Placeholder field="RESIDUARY BENEFICIARY NAME" tip="Who receives the remainder of your estate?" />.
        </p>
      </section>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        <p>
          IN WITNESS WHEREOF, I, <strong>{name}</strong>, have hereunto set my hand and seal on this{' '}
          <strong>{today}</strong>, declaring this to be my Last Will and Testament.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <div className="w-72 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Testator</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
        </div>

        {/* Witness block */}
        <div className="mt-8">
          <h3 className="font-bold text-sm uppercase mb-3">Attestation of Witnesses</h3>
          <InlineFlag severity="info">
            This will requires {rules.willWitnessCount} witnesses who cannot be beneficiaries under the will.
          </InlineFlag>
          <p className="text-sm mb-4">
            We, the undersigned witnesses, each being of legal age, declare that the person who signed
            this instrument, or asked another to sign for them, did so in our presence, and that we believe
            the Testator to be of sound mind and under no undue influence.
          </p>
          {Array.from({ length: rules.willWitnessCount }, (_, i) => (
            <div key={i} className="mt-4">
              <div className="w-72 border-b border-gray-800 mb-1" />
              <p className="text-sm">Witness {i + 1} Signature</p>
              <p className="text-xs text-gray-500">Printed Name: ___________________________ &nbsp;&nbsp; Date: _______________</p>
              <p className="text-xs text-gray-500">Address: ______________________________________________</p>
            </div>
          ))}
        </div>

        {/* Self-proving affidavit */}
        {rules.willSelfProvingAvailable && (
          <div className="mt-8 p-4 rounded-lg" style={{ background: '#F8F5EC', border: '1px solid rgba(191,160,82,0.2)' }}>
            <h3 className="font-bold text-sm uppercase mb-2">Self-Proving Affidavit (Optional)</h3>
            <p className="text-xs text-gray-500 mb-3">M.G.L. Ch. 190B §2-504 — Attaching this affidavit eliminates the need to call witnesses during probate.</p>
            <p className="text-sm mb-4">
              STATE OF {state.toUpperCase()}<br />
              COUNTY OF ___________________
            </p>
            <p className="text-sm">
              We, the Testator and witnesses, whose names are signed to the foregoing instrument, being duly sworn,
              do hereby declare to the undersigned authority that the Testator signed and executed this instrument
              as their Last Will and Testament and that each witness signed willingly in the presence and at the
              request of the Testator.
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <div className="w-60 border-b border-gray-800 mb-1" />
                <p className="text-xs">Notary Public</p>
                <p className="text-xs text-gray-500">My commission expires: _______________</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

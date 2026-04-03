import React from 'react';
import type { DemoProfile, DemoAsset } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { Placeholder } from '../Placeholder';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: DemoAsset[]; totalValue: number; rules: StateRules; }

export const TrustTemplate: React.FC<Props> = ({ profile, assets, totalValue, rules }) => {
  const name = profile.name || 'Unknown';
  const state = profile.state || 'Massachusetts';
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const hasRealEstate = assets.some(a => a.category === 'real_estate');
  const realEstateAssets = assets.filter(a => a.category === 'real_estate');

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Revocable Living Trust Agreement<br />
        <span className="text-lg font-normal normal-case">
          The {profile.name ? `${name} ` : ''} Revocable Living Trust
        </span>
      </h1>

      {/* Preamble */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article I — Trust Creation</h2>
        <p>
          This Revocable Living Trust Agreement (the "Trust") is made and entered into on{' '}
          <strong>{today}</strong>, by and between:
        </p>
        <ul className="list-disc ml-6 mt-2 space-y-1">
          <li><strong>Settlor (Grantor):</strong> {name}, a resident of {state}</li>
          <li><strong>Trustee:</strong> <Placeholder field="TRUSTEE NAME" tip="Name the initial trustee (often yourself)." /></li>
          <li><strong>Successor Trustee:</strong> <Placeholder field="SUCCESSOR TRUSTEE NAME" tip="Name someone to manage the trust if you become incapacitated or pass away." /></li>
        </ul>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 203E §401, §402
        </p>
      </section>

      {/* Real estate warning */}
      {hasRealEstate && (
        <InlineFlag severity="warning">
          ⚠️ IMPORTANT: Real estate detected in your assets ({realEstateAssets.map(a => a.name).join(', ')}).
          To transfer real property into this trust, a <strong>new deed</strong> must be drafted and recorded
          with the appropriate County Registry of Deeds. This trust document alone does not accomplish
          that transfer. Consult a licensed {state} attorney.
        </InlineFlag>
      )}

      {/* Estate tax warning */}
      {totalValue > rules.estateTaxExemption && (
        <InlineFlag severity="warning">
          Your estimated estate (${totalValue.toLocaleString()}) exceeds Massachusetts' ${rules.estateTaxExemption.toLocaleString()}{' '}
          estate tax exemption (M.G.L. Ch. 65C). A trust may help with planning but does not eliminate
          this tax obligation. Tax rate: {rules.estateTaxRate}. Consult a licensed MA estate attorney.
        </InlineFlag>
      )}

      {/* Purpose */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article II — Purpose and Intent</h2>
        <p>
          The Settlor creates this Trust for the purpose of managing and distributing the Settlor's
          assets during the Settlor's lifetime and upon the Settlor's death, while avoiding the costs,
          delays, and public nature of probate proceedings.
        </p>
      </section>

      {/* Trust Property */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article III — Trust Property</h2>
        <p>
          The Settlor hereby transfers, assigns, and conveys to the Trustee the following property
          (the "Trust Estate"):
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-4">Asset</th>
                <th className="text-left py-2 pr-4">Category</th>
                <th className="text-right py-2 pr-4">Value</th>
                <th className="text-left py-2">Ownership</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-gray-200">
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 capitalize">{a.category.replace(/_/g, ' ')}</td>
                  <td className="py-2 pr-4 text-right">${a.value.toLocaleString()}</td>
                  <td className="py-2">{a.ownership}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-400 font-bold">
                <td className="py-2">Total</td>
                <td></td>
                <td className="py-2 text-right">${totalValue.toLocaleString()}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Beneficiaries */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article IV — Beneficiaries</h2>
        <p>
          <strong>Primary Beneficiary:</strong>{' '}
          <Placeholder field="PRIMARY BENEFICIARY NAME" tip="Name the main beneficiary of the trust." />
        </p>
        <p className="mt-2">
          <strong>Contingent Beneficiary:</strong>{' '}
          <Placeholder field="CONTINGENT BENEFICIARY NAME" tip="Name an alternate if the primary beneficiary predeceases you." />
        </p>
        {profile.hasChildren && (
          <p className="mt-2">
            <strong>Distribution to Minor Children:</strong> If any beneficiary is under the age of 18 at the time of
            distribution, the Trustee shall hold such beneficiary's share in a separate sub-trust until
            they reach the age of <Placeholder field="DISTRIBUTION AGE" tip="Enter the age at which children receive their inheritance (e.g., 25)." />.
          </p>
        )}
      </section>

      {/* Distribution */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article V — Distributions During Settlor's Lifetime</h2>
        <p>
          During the Settlor's lifetime, the Trustee shall distribute to or for the benefit of the Settlor
          such amounts of income and principal as the Settlor may request from time to time. The Settlor
          retains the right to all income and principal of the Trust Estate.
        </p>
      </section>

      {/* Revocation */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article VI — Revocation and Amendment</h2>
        <p>
          The Settlor reserves the right to revoke, amend, or modify this Trust, in whole or in part,
          at any time during the Settlor's lifetime, by a written instrument delivered to the Trustee.
          Upon revocation, the Trustee shall distribute the Trust Estate to the Settlor.
        </p>
        <p className="text-xs italic mt-2 text-gray-500">
          Statutory basis: M.G.L. Ch. 203E §602
        </p>
      </section>

      {/* Spendthrift */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article VII — Spendthrift Clause</h2>
        <p>
          No interest in the income or principal of any trust created hereunder shall be voluntarily or
          involuntarily alienated, or subject to the claims of any beneficiary's creditors or to
          garnishment, attachment, or other legal process.
        </p>
      </section>

      {/* Governing Law */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-2">Article VIII — Governing Law</h2>
        <p>
          This Trust shall be governed by and construed in accordance with the laws of the Commonwealth
          of {state}, specifically the Massachusetts Uniform Trust Code (M.G.L. Ch. 203E).
        </p>
      </section>

      {/* Execution */}
      <section className="mt-8 pt-6 border-t-2 border-gray-400">
        <h2 className="font-bold text-base uppercase tracking-wide mb-4">Execution</h2>
        {rules.trustNotarizationRequiredForRealEstate && hasRealEstate && (
          <InlineFlag severity="info">
            Notarization is strongly recommended and required for real estate transfers in {state}.
          </InlineFlag>
        )}
        <p>
          IN WITNESS WHEREOF, the Settlor and Trustee have executed this Trust Agreement as of{' '}
          <strong>{today}</strong>.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <div className="w-60 border-b border-gray-800 mb-1" />
            <p className="text-sm"><strong>{name}</strong>, Settlor</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
          <div>
            <div className="w-60 border-b border-gray-800 mb-1" />
            <p className="text-sm">Trustee</p>
            <p className="text-xs text-gray-500">Date: _______________</p>
          </div>
        </div>
        <div className="mt-6">
          <div className="w-60 border-b border-gray-800 mb-1" />
          <p className="text-sm">Notary Public</p>
          <p className="text-xs text-gray-500">My commission expires: _______________</p>
        </div>
      </section>
    </div>
  );
};

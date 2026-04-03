import React from 'react';
import type { DemoProfile, DemoAsset } from '../../DemoFlow';
import type { StateRules } from '../stateRules';
import { InlineFlag } from '../ComplianceFlag';

interface Props { profile: DemoProfile; assets: DemoAsset[]; totalValue: number; rules: StateRules; }

export const BeneficiaryReviewTemplate: React.FC<Props> = ({ profile, assets }) => {
  const retirementCategories = ['retirement'];
  const jointAssets = assets.filter(a => a.ownership === 'Joint with Spouse');
  const retirementAssets = assets.filter(a => retirementCategories.includes(a.category));
  const lifeInsurance = assets.filter(a => a.category === 'life_insurance');
  const missingBeneficiary = assets.filter(a => !a.hasBeneficiary);

  return (
    <div className="space-y-6 leading-relaxed text-[15px]">
      <h1 className="text-center text-2xl font-bold uppercase tracking-wide border-b-2 border-gray-300 pb-4 mb-6">
        Beneficiary Designation Review<br />
        <span className="text-lg font-normal normal-case">for {profile.name || 'Unknown'}</span>
      </h1>

      <div className="p-4 rounded-lg text-sm" style={{ background: '#FFF8E7', border: '1px solid #E8D5A0', color: '#6B5C2A' }}>
        <strong>📋 Note:</strong> This is a structured review checklist, not a legal document. Use it to audit
        and update your beneficiary designations across all accounts.
      </div>

      <InlineFlag severity="warning">
        Beneficiary designations on retirement accounts and life insurance <strong>override your will</strong>.
        These must be updated directly with each financial institution — your will does not control them.
      </InlineFlag>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg text-center" style={{ background: '#F0FFF4', border: '1px solid #C6F6D5' }}>
          <p className="text-2xl font-bold text-green-700">{assets.filter(a => a.hasBeneficiary).length}</p>
          <p className="text-xs text-green-600 mt-1">With Beneficiary</p>
        </div>
        <div className="p-4 rounded-lg text-center" style={{ background: missingBeneficiary.length > 0 ? '#FFF5F5' : '#F0FFF4', border: `1px solid ${missingBeneficiary.length > 0 ? '#FED7D7' : '#C6F6D5'}` }}>
          <p className="text-2xl font-bold" style={{ color: missingBeneficiary.length > 0 ? '#E05252' : '#38A169' }}>{missingBeneficiary.length}</p>
          <p className="text-xs mt-1" style={{ color: missingBeneficiary.length > 0 ? '#E05252' : '#38A169' }}>Missing Beneficiary</p>
        </div>
        <div className="p-4 rounded-lg text-center" style={{ background: '#EBF8FF', border: '1px solid #BEE3F8' }}>
          <p className="text-2xl font-bold text-blue-700">{assets.length}</p>
          <p className="text-xs text-blue-600 mt-1">Total Assets</p>
        </div>
      </div>

      {/* Full Asset Table */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-3">Asset-by-Asset Review</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2 pr-3">Asset Name</th>
                <th className="text-left py-2 pr-3">Type</th>
                <th className="text-right py-2 pr-3">Value</th>
                <th className="text-left py-2 pr-3">Ownership</th>
                <th className="text-center py-2 pr-3">Beneficiary Status</th>
                <th className="text-left py-2">Action Required</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(a => {
                const isRetirement = retirementCategories.includes(a.category);
                const isJoint = a.ownership === 'Joint with Spouse';
                const isLifeIns = a.category === 'life_insurance';
                return (
                  <tr key={a.id} className="border-b border-gray-200">
                    <td className="py-3 pr-3 font-medium">{a.name}</td>
                    <td className="py-3 pr-3 capitalize text-gray-600">{a.category.replace(/_/g, ' ')}</td>
                    <td className="py-3 pr-3 text-right">${a.value.toLocaleString()}</td>
                    <td className="py-3 pr-3">{a.ownership}</td>
                    <td className="py-3 pr-3 text-center">
                      {a.hasBeneficiary ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#F0FFF4', color: '#38A169' }}>
                          ✓ Designated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#FFF5F5', color: '#E05252' }}>
                          ⚠️ Missing
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-xs">
                      {!a.hasBeneficiary && (
                        <span className="text-red-600 font-medium">
                          Contact institution to add beneficiary
                        </span>
                      )}
                      {isRetirement && (
                        <span className="block text-amber-600 mt-1">
                          ⚠ Beneficiary overrides will
                        </span>
                      )}
                      {isJoint && (
                        <span className="block text-blue-600 mt-1">
                          ℹ Passes by right of survivorship
                        </span>
                      )}
                      {isLifeIns && (
                        <span className="block text-amber-600 mt-1">
                          ⚠ Beneficiary overrides will
                        </span>
                      )}
                      {a.hasBeneficiary && !isRetirement && !isJoint && !isLifeIns && (
                        <span className="text-green-600">No action needed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Special Notes */}
      {retirementAssets.length > 0 && (
        <section>
          <h2 className="font-bold text-base uppercase tracking-wide mb-2">⚠ Retirement Accounts</h2>
          <div className="p-4 rounded-lg text-sm" style={{ background: '#FFF8E7', border: '1px solid #E8D5A0' }}>
            <p className="font-semibold mb-1">Critical: Retirement account beneficiaries override your will.</p>
            <p className="text-gray-600">
              You have {retirementAssets.length} retirement account(s):{' '}
              {retirementAssets.map(a => a.name).join(', ')}. These assets pass directly to the named
              beneficiary on file with the institution, regardless of what your will says. Review and
              update these designations regularly — especially after marriage, divorce, or the birth of a child.
            </p>
          </div>
        </section>
      )}

      {lifeInsurance.length > 0 && (
        <section>
          <h2 className="font-bold text-base uppercase tracking-wide mb-2">⚠ Life Insurance</h2>
          <div className="p-4 rounded-lg text-sm" style={{ background: '#FFF8E7', border: '1px solid #E8D5A0' }}>
            <p className="font-semibold mb-1">Life insurance beneficiaries also override your will.</p>
            <p className="text-gray-600">
              You have {lifeInsurance.length} life insurance polic(ies):{' '}
              {lifeInsurance.map(a => `${a.name} ($${a.value.toLocaleString()})`).join(', ')}.
              Contact your insurance provider directly to verify and update beneficiaries.
            </p>
          </div>
        </section>
      )}

      {jointAssets.length > 0 && (
        <section>
          <h2 className="font-bold text-base uppercase tracking-wide mb-2">ℹ Jointly-Owned Assets</h2>
          <div className="p-4 rounded-lg text-sm" style={{ background: '#EBF8FF', border: '1px solid #BEE3F8' }}>
            <p className="font-semibold mb-1">Joint assets pass by right of survivorship.</p>
            <p className="text-gray-600">
              You have {jointAssets.length} jointly-owned asset(s). These automatically transfer to
              the surviving co-owner and are not controlled by your will or trust.
            </p>
          </div>
        </section>
      )}

      {/* Checklist */}
      <section>
        <h2 className="font-bold text-base uppercase tracking-wide mb-3">Action Checklist</h2>
        <div className="space-y-2">
          {missingBeneficiary.map(a => (
            <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#FFF5F5', border: '1px solid #FED7D7' }}>
              <span className="text-red-500 mt-0.5 shrink-0">☐</span>
              <div className="text-sm">
                <span className="font-semibold text-red-700">{a.name}</span>
                <span className="text-red-600"> — Contact your {a.category.replace(/_/g, ' ')} provider to add a beneficiary designation.</span>
              </div>
            </div>
          ))}
          {missingBeneficiary.length === 0 && (
            <div className="p-4 rounded-lg text-center text-sm" style={{ background: '#F0FFF4', border: '1px solid #C6F6D5' }}>
              <span className="text-green-700 font-semibold">✅ All assets have designated beneficiaries!</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

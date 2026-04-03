// ─── State-Specific Legal Rules ────────────────────────────
// Add a new entry for each state you want to support.

export interface StateRules {
  willWitnessCount: number;
  willNotarizationRequired: boolean;
  willSelfProvingAvailable: boolean;
  holographicWillValid: boolean;
  healthcareProxyWitnessCount: number;
  healthcareProxyNotarizationRequired: boolean;
  poaNotarizationRecommended: boolean;
  trustNotarizationRequiredForRealEstate: boolean;
  estateTaxExemption: number;
  estateTaxRate: string;
  digitalAssetsLaw: string;
  minimumWillAge: number;
  minimumPOAAge: number;
  sources: string[];
}

export const stateRules: Record<string, StateRules> = {
  Massachusetts: {
    willWitnessCount: 2,
    willNotarizationRequired: false,
    willSelfProvingAvailable: true,
    holographicWillValid: false,
    healthcareProxyWitnessCount: 2,
    healthcareProxyNotarizationRequired: false,
    poaNotarizationRecommended: true,
    trustNotarizationRequiredForRealEstate: true,
    estateTaxExemption: 2_000_000,
    estateTaxRate: "graduated up to 16%",
    digitalAssetsLaw: "RUFADAA-aligned via Ch. 190B",
    minimumWillAge: 18,
    minimumPOAAge: 18,
    sources: [
      "M.G.L. Ch. 190B §2-501, §2-502, §2-504",
      "M.G.L. Ch. 201D §2, §3, §4",
      "M.G.L. Ch. 203E §401, §402, §602",
      "M.G.L. Ch. 65C",
      "M.G.L. Ch. 190B §5-501 through §5-507",
    ],
  },
  // Future: California: { ... }, Texas: { ... }, etc.
};

/** Safely retrieve rules; falls back to Massachusetts if state is missing. */
export function getRulesForState(state: string): StateRules {
  return stateRules[state] ?? stateRules["Massachusetts"];
}

export const TAX_RATES = {
  '2082/83': {
    single: [
      { min: 0, max: 500000, rate: 0.01 },      // 1%
      { min: 500001, max: 700000, rate: 0.10 },  // 10%
      { min: 700001, max: 1000000, rate: 0.20 }, // 20%
      { min: 1000001, max: 2000000, rate: 0.30 }, // 30%
      { min: 2000001, max: 5000000, rate: 0.36 }, // 36%
      { min: 5000001, max: Infinity, rate: 0.39 } // 39%
    ],
    married: [
      { min: 0, max: 600000, rate: 0.01 },      // 1%
      { min: 600001, max: 800000, rate: 0.10 },  // 10%
      { min: 800001, max: 1100000, rate: 0.20 }, // 20%
      { min: 1100001, max: 2000000, rate: 0.30 }, // 30%
      { min: 2000001, max: 5000000, rate: 0.36 }, // 36%
      { min: 5000001, max: Infinity, rate: 0.39 } // 39%
    ],
    femaleRebate: 0.10,
    ssfExempt: 0.01,
    limits: {
      ssf: 500000,
      epf: 300000,
      cit: 300000,
      lifeInsurance: 40000,
      medicalInsurance: 20000
    }
  },
  '2083/84': {
    single: [
      { min: 0, max: 1000000, rate: 0.01 },     // 1%
      { min: 1000001, max: 1500000, rate: 0.10 }, // 10%
      { min: 1500001, max: 2500000, rate: 0.20 }, // 20%
      { min: 2500001, max: 4000000, rate: 0.27 }, // 27%
      { min: 4000001, max: Infinity, rate: 0.29 } // 29%
    ],
    married: [
      { min: 0, max: 1000000, rate: 0.01 },     // 1%
      { min: 1000001, max: 1500000, rate: 0.10 }, // 10%
      { min: 1500001, max: 2500000, rate: 0.20 }, // 20%
      { min: 2500001, max: 4000000, rate: 0.27 }, // 27%
      { min: 4000001, max: Infinity, rate: 0.29 } // 29%
    ],
    femaleRebate: 0.10,
    ssfExempt: 0.01,
    limits: {
      ssf: 500000,
      epf: 300000,
      cit: 300000,
      lifeInsurance: 40000,
      medicalInsurance: 20000
    }
  }
};

export const FISCAL_YEARS = [
  { value: '2082/83', label: 'FY 2082/83' },
  { value: '2083/84', label: 'FY 2083/84' }
];

// ✅ NEW: Add these exports
export const MARITAL_STATUSES = ['single', 'married'];

export const DEDUCTION_LIMITS = {
  LIFE_INSURANCE: 40000,
  MEDICAL_INSURANCE: 20000
};
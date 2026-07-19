// export const calculateTax = (income) => {
//   let tax = 0;

//   if (income <= 1000000) {
//     tax = income * 0.01;
//   }

//   else if (income <= 1500000) {
//     tax =
//       (1000000 * 0.01) +
//       ((income - 1000000) * 0.10);
//   }

//   else {
//     tax =
//       (1000000 * 0.01) +
//       (500000 * 0.10) +
//       ((income - 1500000) * 0.20);
//   }

//   return tax;
// };


/**
 * Calculate income tax based on Nepalese tax slabs
 * @param {number} income - Annual taxable income
 * @param {boolean} isSSFContributor - Whether the person contributes to SSF
 * @returns {number} Calculated tax amount
 */
export const calculateTax = (income, isSSFContributor = false) => {
  // Return 0 if income is not positive
  if (income <= 0) return 0;

  let tax = 0;

  // ✅ SSF Contributor: 1% tax waived on first Rs. 10,00,000
  if (isSSFContributor) {
    if (income <= 1000000) {
      tax = 0;  // No tax for SSF contributors under 10L
    } else if (income <= 1500000) {
      // Only 10% on amount above 10L (1% waived)
      tax = (income - 1000000) * 0.10;
    } else {
      // 10% on 10L-15L + 20% on above 15L (1% waived)
      tax = (500000 * 0.10) + ((income - 1500000) * 0.20);
    }
  } else {
    // ❌ Not SSF Contributor: Pay 1% tax
    if (income <= 1000000) {
      tax = income * 0.01;
    } else if (income <= 1500000) {
      tax = (1000000 * 0.01) + ((income - 1000000) * 0.10);
    } else {
      tax = (1000000 * 0.01) + (500000 * 0.10) + ((income - 1500000) * 0.20);
    }
  }

  // Round to nearest whole number for currency
  return Math.round(tax);
};

/**
 * Calculate effective tax rate as percentage
 * @param {number} tax - Total tax amount
 * @param {number} income - Total income
 * @returns {number} Effective tax rate
 */
export const getEffectiveRate = (tax, income) => {
  if (income === 0) return 0;
  return (tax / income) * 100;
};

/**
 * Apply female rebate (10% reduction on tax)
 * @param {number} tax - Calculated tax
 * @returns {number} Tax after rebate
 */
export const applyFemaleRebate = (tax) => {
  return tax * 0.90;
};

/**
 * Check if SSF waiver applies (if SSF amount > 0)
 * @param {number} ssfAmount - SSF contribution amount
 * @returns {boolean} True if SSF is active
 */
export const isSSFActive = (ssfAmount) => {
  return Number(ssfAmount) > 0;
};


document.addEventListener("wheel", (e) => {
  if (document.activeElement.type === "number") {
    document.activeElement.blur();
  }
});

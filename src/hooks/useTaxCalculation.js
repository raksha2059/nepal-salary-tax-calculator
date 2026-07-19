// hooks/useTaxCalculation.js
import { useState, useEffect } from 'react';
import { TAX_RATES } from '../constants/options';

export const useTaxCalculation = () => {
  const [taxData, setTaxData] = useState({
    fiscalYear: '2083/84',
    maritalStatus: 'single',
    isFemale: false,
    monthlySalary: '',
    months: 12,
    bonus: '',
    socialSecurityFund: '',
    employeesProvidentFund: '',
    citizenInvestment: '',
    lifeInsurance: '',
    medicalInsurance: '',
    employerEPF: '',
  });

  const [isParijatPolicy, setIsParijatPolicy] = useState(false);
  const [ssfActive, setSsfActive] = useState(false);

  // Calculate total salary (Gross Salary)
  const totalSalary = (Number(taxData.monthlySalary) || 0) * (Number(taxData.months) || 0) + (Number(taxData.bonus) || 0);

  // ✅ Monthly Salary × Months (Bonus बाहेक - EPF Calculation को लागि)
  const baseForEPF = (Number(taxData.monthlySalary) || 0) * (Number(taxData.months) || 0);

  // Get current year rates
  const currentRates = TAX_RATES[taxData.fiscalYear] || TAX_RATES['2083/84'];

  // ✅ Calculate EPF Breakdown (Based on Monthly Salary × Months)
  const calculateEPFBreakdown = () => {
    if (isParijatPolicy && baseForEPF > 0) {
      const baseSalary = baseForEPF * 0.60;
      const employeeEPF = Math.round(baseSalary * 0.10);
      const employerEPF = Math.round(baseSalary * 0.10);
      return {
        baseSalary,
        employeeEPF,
        employerEPF,
        totalEPF: employeeEPF + employerEPF,
        isAutoCalculated: true,
        monthlyBase: (baseForEPF / (taxData.months || 1)) * 0.60,
        monthlyEmployeeEPF: Math.round(((baseForEPF / (taxData.months || 1)) * 0.60) * 0.10),
        monthlyEmployerEPF: Math.round(((baseForEPF / (taxData.months || 1)) * 0.60) * 0.10),
      };
    }

    const employeeEPF = Number(taxData.employeesProvidentFund) || 0;
    const employerEPF = Number(taxData.employerEPF) || 0;
    const baseSalary = baseForEPF * 0.60;

    return {
      baseSalary,
      employeeEPF,
      employerEPF,
      totalEPF: employeeEPF + employerEPF,
      isAutoCalculated: false,
      monthlyBase: (baseForEPF / (taxData.months || 1)) * 0.60,
      monthlyEmployeeEPF: employeeEPF / (taxData.months || 1),
      monthlyEmployerEPF: employerEPF / (taxData.months || 1),
    };
  };

  const epfBreakdown = calculateEPFBreakdown();

  // Calculate deductions with limits (Employee EPF मात्र)
  const calculateDeduction = (value, limit) => {
    const val = Number(value) || 0;
    return Math.min(val, limit);
  };

  const ssfDeduction = calculateDeduction(taxData.socialSecurityFund, currentRates.limits.ssf);
  const epfDeduction = calculateDeduction(taxData.employeesProvidentFund, currentRates.limits.epf);
  const citDeduction = calculateDeduction(taxData.citizenInvestment, currentRates.limits.cit);
  const lifeInsuranceDeduction = calculateDeduction(taxData.lifeInsurance, currentRates.limits.lifeInsurance);
  const medicalInsuranceDeduction = calculateDeduction(taxData.medicalInsurance, currentRates.limits.medicalInsurance);

  // Calculate actual deductions with exempt and excess
  const calculateActualDeductions = () => {
    const exempt = {
      ssf: Math.min(Number(taxData.socialSecurityFund) || 0, currentRates.limits.ssf),
      epf: Math.min(Number(taxData.employeesProvidentFund) || 0, currentRates.limits.epf),
      cit: Math.min(Number(taxData.citizenInvestment) || 0, currentRates.limits.cit),
      life: Math.min(Number(taxData.lifeInsurance) || 0, currentRates.limits.lifeInsurance),
      medical: Math.min(Number(taxData.medicalInsurance) || 0, currentRates.limits.medicalInsurance),
    };

    const excess = {
      ssf: Math.max(0, (Number(taxData.socialSecurityFund) || 0) - currentRates.limits.ssf),
      epf: Math.max(0, (Number(taxData.employeesProvidentFund) || 0) - currentRates.limits.epf),
      cit: Math.max(0, (Number(taxData.citizenInvestment) || 0) - currentRates.limits.cit),
      life: Math.max(0, (Number(taxData.lifeInsurance) || 0) - currentRates.limits.lifeInsurance),
      medical: Math.max(0, (Number(taxData.medicalInsurance) || 0) - currentRates.limits.medicalInsurance),
    };

    exempt.total = Object.values(exempt).reduce((a, b) => a + b, 0);
    excess.total = Object.values(excess).reduce((a, b) => a + b, 0);

    return { exempt, excess };
  };

  const actualDeductions = calculateActualDeductions();

  // Check SSF active
  useEffect(() => {
    setSsfActive(ssfDeduction > 0);
  }, [ssfDeduction]);

  // ✅ Parijat Policy - Auto EPF Calculation (Based on Monthly Salary × Months)
  useEffect(() => {
    if (isParijatPolicy) {
      const months = Number(taxData.months) || 12;
      const monthlySalary = Number(taxData.monthlySalary) || 0;
      
      // ✅ Monthly Salary × Months (Bonus बाहेक)
      const baseForEPF = monthlySalary * months;
      const baseSalary = baseForEPF * 0.60;
      const employeeEPF = Math.round(baseSalary * 0.10);

      updateField(
        "employeesProvidentFund",
        Math.min(employeeEPF, currentRates.limits.epf)
      );
    } else {
      updateField("employeesProvidentFund", "");
    }
  }, [
    isParijatPolicy,
    taxData.monthlySalary,
    taxData.months,
    taxData.fiscalYear,
  ]);

  // ✅ LEGAL DEDUCTIONS (Employee EPF + Employer EPF + SSF + CIT + Insurance)
  const totalLegalDeductions = ssfDeduction + epfDeduction + citDeduction + lifeInsuranceDeduction + medicalInsuranceDeduction + epfBreakdown.employerEPF;

  // ✅ NET ASSESSABLE INCOME (Taxable Income)
  const netAssessable = Math.max(0, totalSalary - totalLegalDeductions);

  // ✅ TAX CALCULATION
  const calculateTax = (income, year, maritalStatus, isFemale) => {
    if (income <= 0) return 0;

    const rates = TAX_RATES[year];
    if (!rates) return 0;

    const slabs = maritalStatus === 'single' ? rates.single : rates.married;

    let tax = 0;
    let remainingIncome = income;

    const ssfExempt = ssfActive ? rates.ssfExempt : 0;

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      let taxableInSlab = 0;
      const previousMax = i === 0 ? 0 : slabs[i - 1].max;
      const slabRange = slab.max - previousMax;
      taxableInSlab = Math.min(remainingIncome, slabRange);

      if (taxableInSlab <= 0) break;

      let rate = slab.rate;

      if (i === 0 && ssfActive) {
        rate = Math.max(0, rate - ssfExempt);
      }

      tax += taxableInSlab * rate;
      remainingIncome -= taxableInSlab;

      if (remainingIncome <= 0) break;
    }

    if (isFemale && maritalStatus === 'single') {
      tax = tax * (1 - rates.femaleRebate);
    }

    return Math.round(tax * 100) / 100;
  };

  // ✅ Tax = netAssessable बाट calculate गर्ने
  const netTax = calculateTax(
    netAssessable,
    taxData.fiscalYear,
    taxData.maritalStatus,
    taxData.isFemale
  );

  const monthlyTax = netTax / (taxData.months || 12);
  const effectiveRate = totalSalary > 0 ? (netTax / totalSalary) * 100 : 0;

  // ✅ Total Deduction (कानुनी कट्टी + कर)
  const totalDeduction = totalLegalDeductions + netTax;

  // ✅ NET PAYABLE (हातमा आउने पैसा) = Gross Salary - Total Deduction
  // ❌ Employer EPF यहाँ Add हुँदैन!
  const netPayable = Math.max(0, totalSalary - totalDeduction);
  const monthlyNetPayable = netPayable / (taxData.months || 12);

  // Update field
  const updateField = (field, value) => {
    setTaxData(prev => ({ ...prev, [field]: value }));
  };

  // Handle number change with limits
  const handleNumberChange = (field, limit) => (e) => {
    const value = e.target.value;
    if (value === '') {
      updateField(field, '');
      return;
    }
    const num = Number(value);
    if (!isNaN(num) && num >= 0) {
      const finalValue = limit ? Math.min(num, limit) : num;
      updateField(field, finalValue);
    }
  };

  return {
    taxData,
    updateField,
    handleNumberChange,
    isParijatPolicy,
    setIsParijatPolicy,
    totalSalary,
    totalDeduction,
    netTax,
    monthlyTax,
    effectiveRate,
    netAssessable,
    netPayable,
    monthlyNetPayable,
    ssfActive,
    actualDeductions,
    epfBreakdown,
    totalLegalDeductions,
  };
};
import React, { useState } from 'react';
import Select from "react-select";
import './App.css';

// Components
import Header from './components/Header';
import InputField from './components/InputField';
import SectionHeading from './components/SectionHeading';
import TaxSummary from './components/TaxSummary';
import TaxReportModal from './components/TaxReportModal';

// Hooks
import { useTaxCalculation } from './hooks/useTaxCalculation';

// Constants
import { FISCAL_YEARS, MARITAL_STATUSES, DEDUCTION_LIMITS } from './constants/options';

// Styles
import { selectStyles } from './styles/selectStyles';

// Utils
import { downloadTaxReport } from './utils/pdfGenerator';
import { formatCurrency } from './utils/formatCurrency';

function App() {
  const [showModal, setShowModal] = useState(false);

  const {
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
  } = useTaxCalculation();

  const isSalaryAdded = totalSalary > 0;

  const handleDownloadPDF = () => {
    downloadTaxReport({
      ...taxData,
      totalIncome: totalSalary,
      taxableIncome: totalSalary,
      totalDeduction,
      netTax,
      monthlyTax,
      netAssessable,
      netPayable,
      monthlyNetPayable,
      isSSFActive: ssfActive,
    });
  };

  const handleViewReport = () => {
    setShowModal(true);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-[#F4F6F9] px-4 py-6 md:px:6 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-5 items-start">

          {/* LEFT - Tax Form */}
          <div className="w-full lg:max-w-167.5 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#1B4F8A] px-6 py-4">
              <h2 className="text-[18px] font-semibold text-white">Taxpayer Information</h2>
              <p className="text-[14px] md:text-[18px] text-slate-400 mt-0.5">Enter your salary and deduction details below</p>
            </div>

            <div className="px-3 md:px-6 py-5 ">
              {/* Fiscal Year */}
              <SectionHeading>Assessment Year</SectionHeading>
              <Select
                options={FISCAL_YEARS}
                placeholder="Select Fiscal Year"
                styles={selectStyles}
                value={FISCAL_YEARS.find(opt => opt.value === taxData.fiscalYear)}
                onChange={(option) => updateField('fiscalYear', option.value)}
              />

              {/* Employee Classification */}
              <SectionHeading>Employee Classification</SectionHeading>
              <div className="space-y-2.5">
                {/* Marital Status */}
                <div className="border border-slate-200 rounded-md px-4 py-3.5 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <p className="text-[15px] md:text[18px] font-medium text-slate-700">Marital status</p>
                  </div>
                  <div className="flex gap-5">
                    {MARITAL_STATUSES.map((val) => (
                      <label key={val} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="maritalStatus"
                          value={val}
                          checked={taxData.maritalStatus === val}
                          onChange={(e) => updateField('maritalStatus', e.target.value)}
                          className="accent-[#1B4F8A] w-4 h-4"
                        />
                        <span className="text-[15px] md:text[18px] text-slate-600 font-medium">
                          {val.charAt(0).toUpperCase() + val.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SSF Status */}
                <div className="border border-slate-200 rounded-md px-4 py-3.5 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <p className="text-[15px] md:text[18px] font-medium text-slate-700">SSF Contributor</p>
                    <p className="text-[12px] md:text[17px]] text-slate-400 mt-0.5">
                      {ssfActive ? (
                        <span className="text-emerald-600 font-semibold">
                          ✅ 1% tax waived • Saved: Rs. {(totalSalary * 0.01).toLocaleString()}
                        </span>
                      ) : (
                        "Add SSF amount to waive 1% tax"
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[12px] md:text[17px] font-bold px-3 py-1.5 rounded border tracking-wide ${ssfActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}>
                      {ssfActive ? "✓ ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>

                {/* Female Employee */}
                <div className="border border-slate-200 rounded-md px-4 py-3.5 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <p className="text-[15px] md:text[18px] font-medium text-slate-700">Female employee</p>
                    <p className="text-[12px] md:text[17px] text-slate-400 mt-0.5">10% tax rebate (unmarried only)</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxData.isFemale}
                      onChange={(e) => updateField('isFemale', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-[#1B4F8A] transition-colors
                      after:content-[''] after:absolute after:top-0.75 after:left-0.75 after:bg-white after:rounded-full after:h-4.5 after:w-4.5
                      after:transition-all peer-checked:after:translate-x-5 after:shadow-sm" />
                  </label>
                </div>
              </div>

              {/* Annual Income */}
              <SectionHeading>Annual Income</SectionHeading>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <InputField
                    label="Monthly Salary (Rs.)"
                    type="number"
                    value={taxData.monthlySalary}
                    onChange={handleNumberChange('monthlySalary')}
                    placeholder="20000"
                  />
                  <InputField
                    label="No. of Months"
                    type="number"
                    value={taxData.months}
                    min="0"
                    onChange={handleNumberChange('months')}
                    placeholder="12"
                  />
                </div>
                <InputField
                  label="Bonus (Rs.)"
                  type="number"
                  value={taxData.bonus}
                  onChange={handleNumberChange('bonus')}
                  placeholder="0"
                />
                <div>
                  <label className="text-[14px] md:text[17px] font-medium text-slate-500 mb-1.5 block">
                    Total Salary (Rs.)
                  </label>
                  <input type="number" value={totalSalary} readOnly placeholder="0" className="w-full border border-[#1B4F8A]/30 rounded-md px-3.5 py-1.5 md:py-2.5  text-[17px] font-bold text-[#1B4F8A] bg-[#EFF6FF] focus:outline-none" />
                </div>
              </div>

              {/* Deductions */}
              <SectionHeading>Allowable Deductions</SectionHeading>
              <div className="space-y-3">
                {/* Employee EPF */}
                <div className="">
                  <InputField
                    label="Employees Provident Fund (Rs.)"
                    hint={isParijatPolicy ? "Auto-calculated (60% × 10%)" : "Max Rs. 3,00,000 tax-exempt"}
                    type="number"
                    placeholder="0"
                    value={taxData.employeesProvidentFund}
                    onChange={handleNumberChange('employeesProvidentFund')}
                    disabled={!isSalaryAdded || isParijatPolicy}
                  />
                </div>

                {/* Employer EPF */}
                <div className="">
                  <InputField
                    label="Employer EPF (Office Contribution)"
                    hint={isParijatPolicy ? "Auto-calculated (60% × 10%) - Not deducted from salary" : "Not deducted from salary (Manual Entry)"}
                    type="number"
                    placeholder="0"
                    value={isParijatPolicy ? epfBreakdown.employerEPF : taxData.employerEPF}
                    onChange={isParijatPolicy ? () => {} : handleNumberChange('employerEPF')}
                    disabled={!isSalaryAdded || isParijatPolicy}
                  />
                </div>

                {/* SSF */}
                <div className="">
                  <InputField
                    label="Social Security Fund (Rs.)"
                    hint="Max Rs. 5,00,000 tax-exempt"
                    type="number"
                    placeholder="0"
                    value={taxData.socialSecurityFund}
                    onChange={handleNumberChange('socialSecurityFund')}
                    disabled={!isSalaryAdded}
                  />
                </div>

                {/* CIT, Life Insurance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField
                    label="Citizen Investment Trust (Rs.)"
                    hint="Max Rs. 3,00,000 tax-exempt"
                    type="number"
                    placeholder="0"
                    value={taxData.citizenInvestment}
                    onChange={handleNumberChange('citizenInvestment')}
                    disabled={!isSalaryAdded}
                  />
                  <div>
                    <InputField
                      label="Life Insurance (Rs.)"
                      hint="Max Rs. 40,000"
                      type="number"
                      placeholder="0"
                      value={taxData.lifeInsurance}
                      onChange={handleNumberChange('lifeInsurance', DEDUCTION_LIMITS.LIFE_INSURANCE)}
                      disabled={!isSalaryAdded}
                    />
                    {taxData.lifeInsurance >= DEDUCTION_LIMITS.LIFE_INSURANCE &&
                      <p className="text-amber-600 text-[17px] mt-1 flex items-center gap-1">⚠ Limit reached</p>
                    }
                  </div>
                </div>

                {/* Medical Insurance */}
                <div>
                  <InputField
                    label="Medical Insurance (Rs.)"
                    hint="Max Rs. 20,000"
                    type="number"
                    placeholder="0"
                    value={taxData.medicalInsurance}
                    onChange={handleNumberChange('medicalInsurance', DEDUCTION_LIMITS.MEDICAL_INSURANCE)}
                    disabled={!isSalaryAdded}
                  />
                  {taxData.medicalInsurance >= DEDUCTION_LIMITS.MEDICAL_INSURANCE &&
                    <p className="text-amber-600 text-[17px] mt-1 flex items-center gap-1">⚠ Limit reached</p>
                  }
                </div>
              </div>

              {/* Parijat Policy */}
              <div className="border border-slate-200 rounded-md px-2 md:px-4 py-3.5 flex items-center justify-between mt-3 bg-[#1B4F8A]">
                <div>
                  <p className="text-[16px] md:text-[20px] font-medium text-[#93C5FD]">Parijat Policy</p>
                  <p className="text-[14px] md:text-[18px] text-slate-400 mt-0.5">EPF: 60% base → 10% deduction rule</p>
                </div>
                <button onClick={() => {
                  if (!isSalaryAdded) {
                    alert("Please enter salary details first.");
                    return;
                  }
                  setIsParijatPolicy(prev => !prev);
                }}
                  disabled={!isSalaryAdded}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-md text-[14px] md:text-[17px] font-semibold transition ${!isSalaryAdded
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                    : isParijatPolicy
                      ? "bg-green-600 text-white"
                      : "bg-slate-200 text-slate-700"
                    }`}
                >
                  {isParijatPolicy ? "ACTIVE" : "APPLY"}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT - Tax Summary */}
          <TaxSummary
            totalSalary={totalSalary}
            totalDeduction={totalDeduction}
            netTax={netTax}
            monthlyTax={monthlyTax}
            effectiveRate={effectiveRate}
            netAssessable={netAssessable}
            netPayable={netPayable}
            monthlyNetPayable={monthlyNetPayable}
            taxData={taxData}
            ssfActive={ssfActive}
            actualDeductions={actualDeductions}
            epfBreakdown={epfBreakdown}
            onViewReport={handleViewReport}
          />
        </div>
      </div>

      {/* Modal */}
      <TaxReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDownload={handleDownloadPDF}
        data={{
          taxData,
          totalSalary,
          totalDeduction,
          netTax,
          monthlyTax,
          netAssessable,
          netPayable,
          monthlyNetPayable,
        }}
      />
    </>
  );
}

export default App;
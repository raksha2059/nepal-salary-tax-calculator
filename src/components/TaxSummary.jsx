// components/TaxSummary.jsx

import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { TAX_RATES } from '../constants/options';

const TaxSummary = ({
  totalSalary,
  totalDeduction,
  netTax,
  monthlyTax,
  effectiveRate,
  netAssessable,
  netPayable,
  monthlyNetPayable,
  taxData,
  ssfActive,
  actualDeductions,
  epfBreakdown,
  totalLegalDeductions, // ✅ यो prop पनि आउनु पर्छ
  onViewReport
}) => {
  // Get current year tax slabs
  const currentRates = TAX_RATES[taxData.fiscalYear] || TAX_RATES['2083/84'];
  const slabs = taxData.maritalStatus === 'single' ? currentRates.single : currentRates.married;

  // ✅ Calculate slab-wise breakdown based on netAssessable
  const calculateSlabBreakdown = () => {
    if (!slabs || slabs.length === 0 || !netAssessable || netAssessable <= 0) {
      return [];
    }

    let remaining = netAssessable;
    let prevMax = 0;
    const breakdown = [];

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      const slabRange = slab.max - prevMax;

      const taxableInSlab = Math.min(remaining, slabRange);

      if (taxableInSlab <= 0) break;

      let rate = slab.rate;

      if (i === 0 && ssfActive && currentRates.ssfExempt) {
        rate = Math.max(0, rate - currentRates.ssfExempt);
      }

      const taxInSlab = taxableInSlab * rate;

      const from = prevMax === 0 ? 0 : prevMax + 1;
      const to = slab.max === Infinity ? '∞' : slab.max;

      breakdown.push({
        rate: slab.rate,
        displayRate: `${(slab.rate * 100).toFixed(0)}%`,
        from: from,
        to: to,
        fromFormatted: formatCurrency(from),
        toFormatted: slab.max === Infinity ? 'Above' : formatCurrency(to),
        taxable: taxableInSlab,
        tax: taxInSlab,
        isFirst: i === 0,
        isLast: slab.max === Infinity,
        showWaiver: rate !== slab.rate,
      });

      remaining -= taxableInSlab;
      prevMax = slab.max;

      if (remaining <= 0) break;
    }

    return breakdown;
  };

  const slabBreakdown = calculateSlabBreakdown();

  const formatSlabs = () => {
    return slabs.map((slab, index) => {
      const prevMax = index === 0 ? 0 : slabs[index - 1].max;
      const from = prevMax === 0 ? 0 : prevMax + 1;
      let range = '';
      if (slab.max === Infinity) {
        range = `Above ${formatCurrency(from)}`;
      } else {
        range = `${formatCurrency(from)} - ${formatCurrency(slab.max)}`;
      }
      const ratePercent = (slab.rate * 100).toFixed(0);
      return { slab: `${ratePercent}%`, range, rate: slab.rate };
    });
  };

  const displaySlabs = formatSlabs();

  // ✅ Deduction Items - Annual Tax हटाउने
  const deductionItems = [
    {
      label: "SSF",
      value: taxData.socialSecurityFund,
      limit: currentRates.limits.ssf,
      exempt: actualDeductions?.exempt?.ssf || 0,
      excess: actualDeductions?.excess?.ssf || 0
    },
    {
      label: "EPF (Employee)",
      value: taxData.employeesProvidentFund,
      limit: currentRates.limits.epf,
      exempt: actualDeductions?.exempt?.epf || 0,
      excess: actualDeductions?.excess?.epf || 0
    },
    {
      label: "CIT",
      value: taxData.citizenInvestment,
      limit: currentRates.limits.cit,
      exempt: actualDeductions?.exempt?.cit || 0,
      excess: actualDeductions?.excess?.cit || 0
    },
    {
      label: "Life Insurance",
      value: taxData.lifeInsurance,
      limit: currentRates.limits.lifeInsurance,
      exempt: actualDeductions?.exempt?.life || 0,
      excess: actualDeductions?.excess?.life || 0
    },
    {
      label: "Medical Insurance",
      value: taxData.medicalInsurance,
      limit: currentRates.limits.medicalInsurance,
      exempt: actualDeductions?.exempt?.medical || 0,
      excess: actualDeductions?.excess?.medical || 0
    },
    // ❌ Annual Tax यहाँ नराख्ने - छुट्टै देखाउने
  ];

  const hasExcess = actualDeductions?.excess?.total > 0;
  const hasFemaleRebate = taxData.isFemale && taxData.maritalStatus === 'single';

  const getRateColor = (rate) => {
    if (rate <= 0.10) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (rate <= 0.20) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (rate <= 0.30) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const totalTaxFromBreakdown = slabBreakdown.reduce((sum, item) => sum + item.tax, 0);
  const femaleRebateAmount = hasFemaleRebate ? totalTaxFromBreakdown * 0.10 : 0;

  // ✅ Check if Employer EPF exists
  const showEmployerEPF = epfBreakdown?.employerEPF > 0;
  const hasData = totalSalary > 0;

  return (
    <div className="w-[80%] lg:flex-1 flex flex-col gap-4 lg:sticky lg:top-6">
      {/* FY Badge */}
      <div className="flex justify-between items-center bg-white rounded-lg border border-slate-200 px-4 py-2 shadow-sm">
        <span className="text-[12px] md:text-[15px] font-semibold text-slate-600">
          Fiscal Year:
          <span className="text-[#1B4F8A] ml-1">{taxData.fiscalYear}</span>
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${taxData.maritalStatus === 'single'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-purple-100 text-purple-700'
          }`}>
          {taxData.maritalStatus === 'single' ? 'Unmarried' : 'Married'}
        </span>
      </div>

      {/* Primary tax result */}
      <div className="bg-[#1B4F8A] rounded-lg overflow-hidden border border-[#1B4F8A]/40">
        <div className="px-6 py-4">
          <div className="flex items-end gap-8 mb-2 justify-between">
            <div>
              <p className="text-[15px] md:text-[17px] text-[#93C5FD] uppercase tracking-widest mb-2">Annual Tax</p>
              <p className="text-[36px] md:text-[42px] font-bold leading-none text-white tabular-nums">
                {formatCurrency(Number(netTax).toFixed(2))}
              </p>
            </div>
            <div className="border-l border-white/10 pl-8 pb-1">
              <p className="text-[14px] md:text-[17px] text-[#93C5FD] uppercase tracking-widest mb-2">Monthly Tax</p>
              <p className="text-[26px] font-semibold leading-none text-slate-300 tabular-nums">
                {formatCurrency(Number(monthlyTax).toFixed(2))}
              </p>
            </div>
          </div>

          {hasData && (
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
              <span className="text-[15px] text-[#93C5FD]">
                Effective Tax Rate: <span className="font-bold text-white">{effectiveRate.toFixed(2)}%</span>
              </span>
              {hasFemaleRebate && (
                <span className="text-[15px] text-purple-300 font-semibold">
                  10% Female Rebate Applied
                </span>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Income & deductions table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
          <p className="text-[14px] md:text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">
            Income & Deductions
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex justify-between items-center px-5 py-3.5 bg-blue-50/40">
            <span className="text-[18px] md:text-[22px] font-semibold text-slate-700">Total Income</span>
            <span className="text-[17px] md:text-[20px] font-bold text-[#0D2137] tabular-nums">
              {formatCurrency(totalSalary)}
            </span>
          </div>

          {/* ✅ Employee Deductions Only (No Employer EPF here) */}
          {deductionItems.map(({ label, value, limit, exempt, excess }) => (
            <div key={label} className="px-5 py-0.5">
              <div className="flex justify-between items-center">
                <span className="text-[14px] md:text-[17px] text-slate-500 flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  {label}
                </span>
                <span className="text-[14px] md:text-[17px] text-slate-600 tabular-nums font-medium">
                  {formatCurrency(Math.round(Number(value)))}
                </span>
              </div>

              {value > 0 && (
                <div className="mt-1 text-[14px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Exempt: {formatCurrency(exempt)}</span>
                    <span className="text-slate-400">Limit: {formatCurrency(limit)}</span>
                  </div>
                  {excess > 0 && (
                    <div className="flex justify-between text-amber-600 font-medium mt-0.5">
                      <span> Excess (taxable)</span>
                      <span>{formatCurrency(excess)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {hasExcess && (
            <div className="flex justify-between items-center px-5 py-2 bg-amber-50/50">
              <span className="text-[17px] font-semibold text-amber-700"> Total Excess (Added to Income)</span>
              <span className="text-[17px] font-bold text-amber-700 tabular-nums">
                {formatCurrency(actualDeductions.excess.total)}
              </span>
            </div>
          )}

          {/* <div className="flex justify-between items-center px-5 py-3.5 bg-slate-50">
            <span className="text-[18px] md:text-[22px] font-semibold text-slate-600">Total Legal Deduction</span>
            <span className="text-[20px] font-bold text-slate-700 tabular-nums">
              {formatCurrency(totalLegalDeductions || 0)}
            </span>
          </div> */}

          {/* Annual Tax - छुट्टै देखाउने */}
          {hasData && netTax > 0 && (
            <div className="flex justify-between items-center px-5 py-3.5 bg-red-50/50 border-t-2 border-red-200">
              <span className="text-[18px] md:text-[22px] font-semibold text-red-600">
                Annual Tax
              </span>
              <span className="text-[20px] font-bold text-red-600 tabular-nums">
                {formatCurrency(netTax)}
              </span>
            </div>
          )}

          {/* ✅ Total Deduction (Legal + Tax) */}
          <div className="flex justify-between items-center px-5 py-3.5 bg-slate-100 border-t-2 border-slate-300">
            <span className="text-[18px] md:text-[22px] font-bold text-slate-800">
              Total Deduction (Legal + Tax)
            </span>
            <span className="text-[20px] font-bold text-slate-800 tabular-nums">
              {formatCurrency(totalDeduction)}
            </span>
          </div>
        </div>
      </div>

      {/* TAXABLE INCOME */}
      <div className="bg-white rounded-lg border-2 border-[#1B4F8A]/30 shadow-sm overflow-hidden">
        <div className="px-5 py-1.5 bg-[#EFF6FF] border-b border-[#1B4F8A]/20 flex items-center gap-2">
          <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
          <p className="text-[14px] md:text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">
            Taxable Income
          </p>
        </div>
        <div className="px-5 py-2">
          <p className="text-[26px] md:text-[30px] font-bold text-[#0D2137] tabular-nums leading-6">
            {formatCurrency(netAssessable)}
          </p>
          <p className="text-[13px] text-slate-500 mt-0.5">
          </p>
        </div>
      </div>

      {/*  NET PAYABLE */}
      <div className="bg-white rounded-lg border-2 border-green-500/40 shadow-sm overflow-hidden">
        <div className="px-5 py-1.5 bg-green-50 border-b border-green-200 flex items-center gap-2">
          <div className="w-1 h-4 bg-green-600 rounded-full" />
          <p className="text-[14px] md:text-[17px] font-bold uppercase tracking-widest text-green-700">
            Net Payable (In Hand Salary)
          </p>
        </div>
        <div className="px-5 py-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[26px] md:text-[30px] font-bold text-green-700 tabular-nums leading-6">
                {formatCurrency(netPayable)}
              </p>
              <p className="text-[14px] md:text-[16px] text-slate-400 mt-0.5">
                Monthly: {formatCurrency(monthlyNetPayable)}
              </p>
            </div>
            {hasData && (
              <div className="text-right">
                <p className="text-[12px] text-slate-500">Total Deductions</p>
                <p className="text-[16px] font-semibold text-red-500">- {formatCurrency(totalDeduction)}</p>
              </div>
            )}
          </div>
          {hasData && (
            <div className="mt-2 pt-2 border-t border-green-200 flex justify-between text-[12px] text-slate-500">
              <span>Gross: {formatCurrency(totalSalary)}</span>
              <span>Tax: {formatCurrency(netTax)}</span>
              <span>Other: {formatCurrency(totalLegalDeductions || 0)}</span>
            </div>
          )}
        </div>
      </div>

      {/*  Employer EPF - Separate Table */}
      {showEmployerEPF && (
        <div className="bg-white rounded-lg border border-green-200 shadow-sm overflow-hidden">
          <div className="px-5 py-1.5 bg-green-50 border-b border-green-200 flex items-center gap-2">
            <div className="w-1 h-4 bg-green-600 rounded-full" />
            <p className="text-[14px] md:text-[17px] font-bold uppercase tracking-widest text-green-700">
              Employer EPF (Office Contribution)
            </p>
          </div>

          <div className="px-5 py-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] md:text-[17px] text-slate-600">
                {epfBreakdown.isAutoCalculated
                  ? '60% Base × 10% (Not deducted from salary)'
                  : 'Office contribution (Not deducted from salary)'}
              </span>
              <span className="text-[16px] md:text-[20px] font-bold text-green-700">
                {formatCurrency(Math.round(epfBreakdown.employerEPF))}
              </span>
            </div>
            {epfBreakdown.isAutoCalculated && (
              <div className="mt-1 text-[12px] text-slate-400 flex justify-between">
                <span>Base Salary: {formatCurrency(Math.round(epfBreakdown.baseSalary))}</span>
                <span>Rate: 10%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ Tax Slabs - Net Assessable बाट Breakdown */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
            <p className="text-[15px] md:text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">
              Tax Slabs Breakdown
            </p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
            {taxData.fiscalYear}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-162.5 table-fixed">
            <thead className="bg-slate-50/80">
              <tr className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-3 py-2 text-center w-[10%]">Slab</th>
                <th className="px-3 py-2 text-left w-[40%]">Income Range</th>
                <th className="px-3 py-2 text-right w-[25%]">Taxable Amount</th>
                <th className="px-3 py-2 text-right w-[25%]">Tax</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {slabBreakdown.length > 0 ? (
                slabBreakdown.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition">
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-[13px] md:text-[15px] font-bold px-2 py-1 rounded ${getRateColor(item.rate)}`}>
                        {item.displayRate}
                      </span>
                      {item.showWaiver && (
                        <span className="text-[9px] text-emerald-600 block">(1% waived)</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-slate-600 truncate">
                      {item.isFirst ? '0' : item.fromFormatted} - {item.isLast ? 'Above' : item.toFormatted}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-slate-700 font-medium text-right tabular-nums">
                      {formatCurrency(Number(item.taxable).toFixed(2))}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] font-bold text-[#1B4F8A] text-right tabular-nums">
                      {formatCurrency(Number(item.tax).toFixed(2))}
                    </td>
                  </tr>
                ))
              ) : (
                displaySlabs.map(({ slab, range, rate }) => (
                  <tr key={slab}>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`text-[13px] md:text-[15px] font-bold px-2 py-1 rounded ${getRateColor(rate)}`}>
                        {slab}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-slate-600 truncate">
                      {range}
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-slate-400 text-right tabular-nums">
                      Rs. 0.00
                    </td>
                    <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-slate-400 text-right tabular-nums">
                      Rs. 0.00
                    </td>
                  </tr>
                ))
              )}

              {hasFemaleRebate && (
                <tr className="bg-purple-50/70">
                  <td colSpan="2" className="px-3 py-2.5 text-[13px] md:text-[15px] font-bold text-purple-700">
                    👩 Female Rebate (10%)
                  </td>
                  <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-purple-600 text-right tabular-nums">
                    -{formatCurrency(Number(femaleRebateAmount).toFixed(2))}
                  </td>
                  <td className="px-3 py-2.5 text-[13px] md:text-[15px] font-bold text-purple-700 text-right tabular-nums">
                    -{formatCurrency(Number(femaleRebateAmount).toFixed(2))}
                  </td>
                </tr>
              )}

              {hasExcess && (
                <tr className="bg-amber-50/70">
                  <td colSpan="2" className="px-3 py-2.5 text-[13px] md:text-[15px] font-bold text-amber-700">
                    Excess Deduction
                  </td>
                  <td className="px-3 py-2.5 text-[13px] md:text-[15px] text-amber-600 text-right tabular-nums">
                    +{formatCurrency(Number(actualDeductions.excess.total).toFixed(2))}
                  </td>
                  <td className="px-3 py-2.5 text-[13px] md:text-[15px] font-bold text-amber-700 text-right">
                    Added
                  </td>
                </tr>
              )}

              {/* ✅ Total Tax */}
              <tr className="bg-[#1B4F8A]/5">
                <td colSpan="2" className="px-3 py-3.5 text-[15px] md:text-[17px] font-bold text-[#1B4F8A]">
                  Total Tax
                </td>
                <td className="px-3 py-3.5 text-[15px] md:text-[17px] font-bold text-[#1B4F8A] text-right tabular-nums">
                  {formatCurrency(Number(netAssessable || 0).toFixed(2))}
                </td>
                <td className="px-3 py-3.5 text-[15px] md:text-[17px] font-bold text-[#1B4F8A] text-right tabular-nums">
                  {formatCurrency(Number(netTax || 0).toFixed(2))}
                </td>
              </tr>

              {/* ✅ Effective Rate */}
              {netAssessable > 0 && (
                <tr className="bg-slate-50/50">
                  <td colSpan="3" className="px-3 py-2 text-sm text-slate-500">
                    Effective Tax Rate
                  </td>
                  <td className="px-3 py-2 text-sm font-semibold text-slate-700 text-right">
                    {((netTax / netAssessable) * 100).toFixed(2)}%
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Report Button */}
      <button onClick={onViewReport}
        className="w-full bg-[#1B4F8A] hover:bg-[#163f6e] active:scale-[0.99] text-white text-[15px] md:text-[17px] font-semibold py-3 md:py-4 rounded-md transition-all tracking-wide shadow-sm">
        📊 View Full Tax Report →
      </button>
    </div>
  );
};

export default TaxSummary;
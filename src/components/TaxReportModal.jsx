import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

const TaxReportModal = ({ isOpen, onClose, onDownload, data }) => {
  if (!isOpen) return null;

  const {
    taxData,
    totalSalary,
    totalDeduction,
    netTax,
    monthlyTax,
    netAssessable,
  } = data;

  const deductionItems = [
    { label: "SSF", value: taxData.socialSecurityFund },
    { label: "EPF", value: taxData.employeesProvidentFund },
    { label: "CIT", value: taxData.citizenInvestment },
    { label: "Life Insurance", value: taxData.lifeInsurance },
    { label: "Medical Insurance", value: taxData.medicalInsurance },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal header */}
        <div className="bg-[#0D2137] px-7 py-5 rounded-t-lg sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] md:text-[17px] font-bold uppercase tracking-[0.15em] text-[#93C5FD] mb-1">
                Official Document
              </p>
              <h2 className="text-[14px] md:text-[20px] font-bold text-white">Tax Breakdown Report</h2>
              <p className="text-slate-400 text-[12px] md:text[18px] mt-0.5">Detailed Annual Tax Summary</p>
            </div>
            <div className="flex gap-2 mt-1">
              <button
                onClick={onDownload}
                className="bg-white text-[#0D2137] px-2 md:px-4 py-0.5 md:py-2 rounded text-[15px] md:text-[17px] font-bold hover:bg-blue-50 transition">
                ⬇
              </button>
              <button
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 w-9 h-9 rounded text-white flex items-center justify-center text-[18px] transition"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Income Details */}
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
              <p className="text-[15px] md:text-[17px] font-bold uppercase tracking-[0.1em] text-[#1B4F8A]">
                Income Details
              </p>
            </div>
            <div className="rounded border border-slate-200 overflow-hidden">
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Monthly Salary</span>
                <span className="text-slate-700 font-semibold">{formatCurrency(taxData.monthlySalary)}</span>
              </div>
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Months</span>
                <span className="text-slate-700 font-semibold">{taxData.months}</span>
              </div>
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Bonus</span>
                <span className="text-slate-700 font-semibold">{formatCurrency(taxData.bonus)}</span>
              </div>
              <div className="flex justify-between px-4 py-3 bg-blue-50">
                <span className="font-bold text-[#0D2137]">Total Income</span>
                <span className="font-bold text-[#1B4F8A]">{formatCurrency(totalSalary)}</span>
              </div>
            </div>
          </section>

          {/* Deductions */}
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
              <p className="text-[15px] md:text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">
                Deductions
              </p>
            </div>
            <div className="rounded border border-slate-200 overflow-hidden">
              {deductionItems.map(({ label, value }) => (
                <div key={label} className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-700 font-semibold">
                    {formatCurrency(Math.round(Number(value)))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-blue-50">
                <span className="font-bold text-[#0D2137]">Total Deduction</span>
                <span className="font-bold text-[#1B4F8A]">{formatCurrency(totalDeduction)}</span>
              </div>
            </div>
          </section>

          {/* Tax Summary */}
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
              <p className="text-[15px] md:text-[17px] font-bold uppercase tracking-[0.1em] text-[#1B4F8A]">
                Tax Summary
              </p>
            </div>
            <div className="rounded border border-slate-200 overflow-hidden">
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Taxable Income</span>
                <span className="text-slate-700 font-semibold">{formatCurrency(totalSalary)}</span>
              </div>
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Annual Tax</span>
                <span className="text-slate-700 font-semibold">{formatCurrency(netTax)}</span>
              </div>
              <div className="flex justify-between px-4 text-[14px] md:text-[16px] py-1 md:py-2.5 border-b border-slate-100">
                <span className="text-slate-500">Monthly Tax</span>
                <span className="text-slate-700 font-semibold">{formatCurrency(monthlyTax.toFixed(2))}</span>
              </div>
              <div className="flex justify-between px-4 py-3.5 bg-[#0D2137] mt-3 rounded-xl">
                <span className="font-bold text-white">Net Assessable</span>
                <span className="font-bold text-white">{formatCurrency(netAssessable)}</span>
              </div>
            </div>
          </section>

          <div className="flex gap-2.5">
            <button
              onClick={onDownload}
              className="flex-1 bg-[#1B4F8A] hover:bg-[#163f6e] text-white text-[14px] md:text-[18px] font-semibold py-2 md:py-3 rounded transition"
            >
              Download PDF
            </button>

            <button
              onClick={onClose}
              className="px-4 md:px-6 border border-slate-300 text-slate-600 text-[14px] md:text-[18px] py-2 md:py-3 rounded hover:bg-slate-50 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxReportModal;
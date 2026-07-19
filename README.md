# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


  {/* {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div id="tax-report" className="bg-white rounded-3xl p-8 w-175 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold text-blue-950">
                Tax Breakdown Report
              </h2>

              <div className="flex gap-4">
                <button onClick={handleDownloadPDF} className="bg-blue-950 text-white px-5 py-3 rounded-xl">
                  download icon
                </button>

                <button onClick={() => setShowModal(false)} className="text-red-500 text-xl">
                  ✕
                </button>
              </div>


            </div>

            <div className="space-y-4 text-left">

              <h3 className="font-bold border-b pb-2">
                Income Details
              </h3>

              <div>
                <p>Monthly Salary: Rs. {monthlySalary}</p>
                <p>Months: {months}</p>
                <p>Bonus: Rs. {bonus}</p>
                <p>Total Income: Rs. {totalIncome}</p>
              </div>

              <h3 className="font-bold border-b pb-2">
                Deductions
              </h3>

              <div>
                <p>SSF: Rs. {socialSecurityFund}</p>
                <p>EPF: Rs. {employeesProvidentFund}</p>
                <p>CIT: Rs. {citizenInvestment}</p>
                <p>Life Insurance: Rs. {lifeInsurance}</p>
                <p>Medical Insurance: Rs. {medicalInsurance}</p>
                <p>Total Deduction: Rs. {totalDeduction}</p>
              </div>


              <h3 className="font-bold border-b pb-2">
                Tax Summary
              </h3>

              <div>
                <p>Taxable Income: Rs. {taxableIncome}</p>
                <p>Annual Tax: Rs. {netTax.toFixed(2)}</p>
                <p>Monthly Tax: Rs. {monthlyTax.toFixed(2)}</p>
                <p>Net Assessable: Rs. {netAssessable.toFixed(2)}</p>
              </div>

              <h3 className="font-bold border-b pb-2">
                Applied Rule
              </h3>

              <ul className="list-disc pl-6">

                <li>
                  Up to Rs. 10,00,000 → 1%
                </li>

                <li>
                  Rs. 10,00,001 – 15,00,000 → 10%
                </li>

                <li>
                  Above Rs. 15,00,000 → 20%
                </li>

                {
                  isFemale &&
                  maritalStatus === "unmarried" &&
                  (
                    <li>
                      10% female rebate applied
                    </li>
                  )
                }

                {
                  isSSFActive &&
                  (
                    <li>
                      SSF waiver applied
                    </li>
                  )
                }

              </ul>

            </div>

            <div className="mt-8 flex gap-3 print:hidden">

              <button onClick={handleDownloadPDF} className="bg-blue-950 text-white px-5 py-3 rounded-xl">
                Download
              </button>

              <button onClick={() => setShowModal(false)} className="border px-5 py-3 rounded-xl">
                Close
              </button>

            </div>

          </div>

        </div>
      )} */}











                  {/* Right column ma, tax slabs mathi */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-[#1B4F8A] rounded-full" />
                  <p className="text-[17px] font-bold uppercase tracking-widest text-[#1B4F8A]">Office Policy</p>
                </div>
                <button
                  onClick={applyParijatPolicy}
                  className={`px-4 py-2 rounded-md font-semibold text-[17px] transition-all ${isParijatPolicy
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-[#1B4F8A] text-white hover:bg-[#163f6e]'
                    }`}
                >
                  {isParijatPolicy ? '✅ Parijat Applied' : '🏢 Parijat'}
                </button>
              </div>

              {/* Policy details show garne */}
              {isParijatPolicy && (
                <div className="px-5 py-3 bg-blue-50/30 border-t border-blue-100">
                  <p className="text-[17px] text-slate-600">
                    <span className="font-semibold">Policy Applied:</span>
                    60% of salary → 10% EPF contribution
                  </p>
                  <p className="text-[17px] text-slate-500 mt-1">
                    EPF: Rs. {((monthlySalary * 0.6) * 0.10).toLocaleString()}
                    (60% of Rs. {monthlySalary.toLocaleString()} × 10%)
                  </p>
                </div>
              )}
            </div>


 const [isParijatPolicy, setIsParijatPolicy] = useState(false);


  const applyParijatPolicy = () => {
    // Calculate EPF: 10% of 60% of monthly salary
    const epfAmount = (monthlySalary * 0.6) * 0.10; // 60% * 10%

    setEmployeesProvidentFund(epfAmount);
    setIsParijatPolicy(true);
  };




  # 2082/83 tax document
  https://pkf.trunco.com.np/files/publications/1748841198_Tax%20Rates%202082-83_Final_250601_213028.pdf


  # 2083/84 tax document
  https://pkf.trunco.com.np/files/publications/1780476159_Tax%20Rates%202026-27.pdf


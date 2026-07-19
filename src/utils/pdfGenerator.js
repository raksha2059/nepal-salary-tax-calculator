import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { formatCurrency } from './formatCurrency';

// Initialize PDF fonts
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs;

const TABLE_LAYOUT = {
  hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
  vLineWidth: () => 0,
  hLineColor: () => '#000000',
  paddingLeft: () => 6,
  paddingRight: () => 6,
  paddingTop: () => 6,
  paddingBottom: () => 6,
};

const SECTION_ROW = (label, value, isTotalRow = false) => [
  { text: label, fontSize: 13, bold: isTotalRow, color: '#000000' },
  { text: value, fontSize: 13, bold: isTotalRow, alignment: 'right', color: '#000000' },
];

/**
 * Generate PDF content structure
 */
export const generatePDFContent = (data) => {
  const {
    monthlySalary,
    months,
    bonus,
    totalIncome,
    socialSecurityFund,
    employeesProvidentFund,
    citizenInvestment,
    lifeInsurance,
    medicalInsurance,
    totalDeduction,
    taxableIncome,
    netTax,
    monthlyTax,
    netAssessable,
    isFemale,
    maritalStatus,
    isSSFActive,
  } = data;

  const rs = (v) => formatCurrency(v);

  return {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    defaultStyle: { font: 'Roboto', color: '#000000' },
    content: [
      // Header
      { text: "INCOME TAX BREAKDOWN REPORT", fontSize: 20, bold: true, alignment: "center", color: '#000000', margin: [0, 0, 0, 4] },
      { text: "Nepal — Annual Tax Assessment", fontSize: 12, alignment: "center", color: '#444444', margin: [0, 0, 0, 6] },
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 2, lineColor: '#000000' }], margin: [0, 0, 0, 20] },

      // Income Details
      { text: "1.  Income Details", style: "heading" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            SECTION_ROW("Monthly Salary", rs(monthlySalary)),
            SECTION_ROW("Number of Months", String(months)),
            SECTION_ROW("Bonus", rs(bonus)),
            SECTION_ROW("Total Income", rs(totalIncome), true),
          ],
        },
        layout: TABLE_LAYOUT,
        margin: [0, 0, 0, 16],
      },

      // Deductions
      { text: "2.  Allowable Deductions", style: "heading" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            SECTION_ROW("Social Security Fund (SSF)", rs(socialSecurityFund)),
            SECTION_ROW("Employees Provident Fund (EPF)", rs(employeesProvidentFund)),
            SECTION_ROW("Citizen Investment Trust (CIT)", rs(citizenInvestment)),
            SECTION_ROW("Life Insurance", rs(lifeInsurance)),
            SECTION_ROW("Medical Insurance", rs(medicalInsurance)),
            SECTION_ROW("Total Deduction", rs(totalDeduction), true),
          ],
        },
        layout: TABLE_LAYOUT,
        margin: [0, 0, 0, 16],
      },

      // Tax Summary
      { text: "3.  Tax Summary", style: "heading" },
      {
        table: {
          widths: ["*", "auto"],
          body: [
            SECTION_ROW("Taxable Income", rs(taxableIncome)),
            SECTION_ROW("Annual Tax Liability", rs(netTax)),
            SECTION_ROW("Monthly Tax Deduction", rs(monthlyTax.toFixed(0))),
            SECTION_ROW("Net Assessable Income", rs(netAssessable), true),
          ],
        },
        layout: TABLE_LAYOUT,
        margin: [0, 0, 0, 16],
      },

      // Applied Rules
      { text: "4.  Applied Tax Rules", style: "heading" },
      {
        ul: [
          { text: "Up to Rs. 10,00,000  →  1%", fontSize: 13, color: '#000000', margin: [0, 3, 0, 3] },
          { text: "Rs. 10,00,001 to Rs. 15,00,000  →  10%", fontSize: 13, color: '#000000', margin: [0, 3, 0, 3] },
          { text: "Above Rs. 15,00,000  →  20%", fontSize: 13, color: '#000000', margin: [0, 3, 0, 3] },
          ...(isFemale && maritalStatus === "unmarried" ? [{ text: "Female rebate applied  →  10% reduction on calculated tax", fontSize: 13, color: '#000000', margin: [0, 3, 0, 3] }] : []),
          ...(isSSFActive ? [{ text: "SSF contributor waiver applied", fontSize: 13, color: '#000000', margin: [0, 3, 0, 3] }] : []),
        ],
        margin: [0, 0, 0, 24],
      },

      // Footer
      { canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1, lineColor: '#000000' }], margin: [0, 0, 0, 8] },
      { text: "This report is computer-generated for informational purposes only.", fontSize: 10, color: '#666666', alignment: 'center' },
    ],
    styles: {
      heading: { fontSize: 15, bold: true, color: '#000000', margin: [0, 0, 0, 8] },
    },
  };
};

/**
 * Download PDF report
 */
export const downloadTaxReport = (data, filename = "tax-report.pdf") => {
  const docDefinition = generatePDFContent(data);
  pdfMake.createPdf(docDefinition).download(filename);
};
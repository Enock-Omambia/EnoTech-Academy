import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle,
  X,
  FileText,
  TrendingUp,
  CreditCard,
  Building,
  User,
  Clock,
  Briefcase,
  HelpCircle,
  BarChart2,
  Calendar,
  FileDown
} from "lucide-react";
import { Student, Course, Transaction } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface FinancePageProps {
  students: Student[];
  courses: Course[];
  transactions: Transaction[];
  darkMode: boolean;
  onAddTransaction: (tx: Transaction) => void;
}

export default function FinancePage({
  students,
  courses,
  transactions,
  darkMode,
  onAddTransaction
}: FinancePageProps) {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState("All");
  const [showReceivePaymentModal, setShowReceivePaymentModal] = useState(false);
  const [activeViewingReceipt, setActiveViewingReceipt] = useState<Transaction | null>(null);

  // Form state
  const [newTx, setNewTx] = useState({
    studentId: students[0]?.id || "",
    amount: 5000,
    referenceNo: "",
    paymentMethod: "M-Pesa",
    description: "Tuition installment payment"
  });

  const handleReceivePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.studentId || !newTx.amount || !newTx.referenceNo) {
      alert("Please fulfill Student ID, Amount, and Reference Code.");
      return;
    }

    const selectedStudentObj = students.find(s => s.id === newTx.studentId);
    if (!selectedStudentObj) {
      alert("Selected student not found in core database.");
      return;
    }

    const createdTx: Transaction = {
      id: `TX-2026-${1000 + transactions.length + 1}`,
      studentId: newTx.studentId,
      studentName: selectedStudentObj.fullName,
      amount: Number(newTx.amount),
      type: "Income",
      category: "Tuition Fees",
      referenceNo: newTx.referenceNo.toUpperCase().trim(),
      paymentMethod: newTx.paymentMethod as any,
      date: new Date().toISOString().split("T")[0],
      description: newTx.description || "Tuition fee payment received."
    };

    onAddTransaction(createdTx);
    setShowReceivePaymentModal(false);
    // Reset
    setNewTx({
      studentId: students[0]?.id || "",
      amount: 5000,
      referenceNo: "",
      paymentMethod: "M-Pesa",
      description: "Tuition installment payment"
    });
    alert(`Payment of KSh ${createdTx.amount.toLocaleString()} received and logged in financial ledger. Ref Code: ${createdTx.referenceNo}`);
  };

  // Calculations
  const incomeTxs = transactions.filter(t => t.type === "Income");
  const totalReceived = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  
  // Total invoiced fees based on student course registrations
  const totalInvoiced = students.reduce((sum, s) => {
    const courseObj = courses.find(c => c.id === s.courseEnrolled);
    return sum + (courseObj ? courseObj.totalFees : 12000);
  }, 0);

  const totalOutstanding = Math.max(0, totalInvoiced - totalReceived);
  const totalExpenses = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);

  // Filter transactions
  const filteredTxs = transactions.filter(t => {
    const matchesSearch = t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = txTypeFilter === "All" || t.type === txTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ["Transaction ID", "Student Name", "Amount (KSh)", "Type", "Category", "Payment Method", "Reference No", "Date", "Description"];
    const keys = ["id", "studentName", "amount", "type", "category", "paymentMethod", "referenceNo", "date", "description"];
    exportToCSV(filteredTxs, "financial_ledger", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["ID", "Student Name", "Amount (KSh)", "Type", "Category", "Method", "Ref No", "Date"];
    const keys = ["id", "studentName", "amount", "type", "category", "paymentMethod", "referenceNo", "date"];
    exportToPDF("Financial Treasury & Fees Ledger Statement", headers, keys, filteredTxs);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Financial Treasury & Fees Ledger</h2>
          <p className="text-xs text-slate-400">Track academy income receipts, manage tuition installments, disburse expenses, and generate M-Pesa/Bank receipts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowReceivePaymentModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Receive Tuition Payment
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Tuition Received</span>
          <span className="text-2xl font-black mt-1 text-emerald-500 block">KSh {totalReceived.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Invoiced ledger income</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Outstanding Fees</span>
          <span className="text-2xl font-black text-orange-400 mt-1 block">KSh {totalOutstanding.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Tuition balance ledger</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Operational Costs</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">KSh {totalExpenses.toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Rent, electricity, PC assets</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Consolidated Net Revenue</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">KSh {(totalReceived - totalExpenses).toLocaleString()}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Net institution treasury</span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-3 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search financial history by Student Name, Transaction ID, M-Pesa Ref Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-lg bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={txTypeFilter}
            onChange={(e) => setTxTypeFilter(e.target.value)}
            className="w-full sm:w-48 border rounded-lg p-2.5 text-xs bg-transparent focus:outline-none"
          >
            <option value="All">All Transactions</option>
            <option value="Income">Income Receipts</option>
            <option value="Expense">Disbursed Expenses</option>
          </select>
        </div>
      </div>

      {/* Transaction List Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Transaction Details</th>
                <th className="p-4">Reference Code</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4 font-mono">Date Logs</th>
                <th className="p-4">Income Category / Student</th>
                <th className="p-4 text-right">Transaction Amount</th>
                <th className="p-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredTxs.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-full ${
                        tx.type === "Income" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      }`}>
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">{tx.description}</span>
                        <span className="text-[10px] text-slate-400 font-mono block">{tx.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-cyan-400 uppercase">{tx.referenceNo}</td>

                  <td className="p-4 font-semibold text-slate-400">{tx.paymentMethod}</td>
                  
                  <td className="p-4 font-mono text-slate-400">{tx.date}</td>

                  <td className="p-4">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 block">{tx.studentName}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{tx.studentId || "EnoTech General"}</span>
                  </td>

                  <td className={`p-4 text-right font-black font-mono ${
                    tx.type === "Income" ? "text-emerald-500" : "text-rose-500"
                  }`}>
                    {tx.type === "Income" ? "+" : "-"} KSh {tx.amount.toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    {tx.type === "Income" ? (
                      <button
                        onClick={() => setActiveViewingReceipt(tx)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold cursor-pointer"
                      >
                        Print Receipt
                      </button>
                    ) : (
                      <span className="text-slate-500 italic text-[10px]">Expense log</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================
          MODAL: RECEIVE FEE PAYMENT FORM
          ================================== */}
      {showReceivePaymentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Receive Tuition Fees Payments</h3>
                <button onClick={() => setShowReceivePaymentModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleReceivePaymentSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Select Student Payer *</label>
                  <select
                    value={newTx.studentId}
                    onChange={(e) => setNewTx({...newTx, studentId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.admissionNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Receipt Amount (KSh) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 6000"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Reference No / M-Pesa Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RGA103KL91"
                      value={newTx.referenceNo}
                      onChange={(e) => setNewTx({...newTx, referenceNo: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Disbursement Mode</label>
                    <select
                      value={newTx.paymentMethod}
                      onChange={(e) => setNewTx({...newTx, paymentMethod: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="M-Pesa">M-Pesa Paybill</option>
                      <option value="Bank Wire">Co-op/KCB Bank Transfer</option>
                      <option value="Cash Receipt">Cash Desk Receipt</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Payment Narrative Description</label>
                    <input
                      type="text"
                      placeholder="Tuition installment fee"
                      value={newTx.description}
                      onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                >
                  Authorize Payment receipt log
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ====================================
          RECEIPT PRINT WINDOW INTERACTIVE
          ==================================== */}
      {activeViewingReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white text-slate-900 rounded-2xl p-6 space-y-6 shadow-2xl border border-slate-200">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <span className="text-[10px] font-bold text-slate-400 uppercase">OFFICIAL PAYMENT RECEIPT</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => window.print()} className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setActiveViewingReceipt(null)} className="p-1.5 hover:bg-slate-100 text-slate-500 rounded cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Template printable */}
            <div className="border border-slate-300 p-4 space-y-5 bg-stone-50 font-mono text-[11px] leading-relaxed">
              <div className="text-center border-b border-dashed border-slate-400 pb-3">
                <h3 className="text-sm font-black tracking-wider uppercase text-slate-900">EnoTech Academy</h3>
                <p className="text-[9px] text-slate-500 mt-1">Founder Enock Omato • Super Administrator ledger</p>
                <p className="text-[9px] text-slate-400 mt-0.5">PO Box 1004-40100 Kisii, Kenya</p>
              </div>

              <div className="space-y-1 text-slate-700">
                <div><strong>RECEIPT ID:</strong> {activeViewingReceipt.id}</div>
                <div><strong>PAYER NAME:</strong> <span className="font-bold text-slate-950 uppercase">{activeViewingReceipt.studentName}</span></div>
                <div><strong>STUDENT ID:</strong> {activeViewingReceipt.studentId || "ETA-TEMP"}</div>
                <div><strong>TX DATE:</strong> {activeViewingReceipt.date}</div>
              </div>

              <div className="border-t border-b border-dashed border-slate-400 py-3 text-slate-700 space-y-1.5">
                <div className="flex justify-between">
                  <span>Fee installment description:</span>
                  <span className="font-bold text-slate-950">{activeViewingReceipt.description}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Channel:</span>
                  <span className="font-bold text-slate-950">{activeViewingReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-cyan-800">
                  <span>Reference ID:</span>
                  <span className="font-bold text-cyan-600 font-bold">{activeViewingReceipt.referenceNo}</span>
                </div>
              </div>

              <div className="flex justify-between text-sm font-black text-slate-900 border-b border-dashed border-slate-400 pb-3">
                <span>TOTAL PAID IN CASH:</span>
                <span>KSh {activeViewingReceipt.amount.toLocaleString()}.00</span>
              </div>

              <div className="text-center text-[9px] text-slate-400 italic space-y-1">
                <span>Thank you for paying. All fees are non-refundable.</span>
                <span className="block mt-1">Status: SECURE TRANS-COMPLETED</span>
              </div>
            </div>

            <button
              onClick={() => setActiveViewingReceipt(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer text-xs"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

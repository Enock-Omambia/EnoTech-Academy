import React, { useState } from "react";
import {
  TrendingUp,
  BarChart,
  PieChart,
  Calendar,
  Users,
  DollarSign,
  Award,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingDown
} from "lucide-react";
import { Student, Course, Transaction } from "../types";

interface ReportsPageProps {
  students: Student[];
  courses: Course[];
  transactions: Transaction[];
  darkMode: boolean;
}

export default function ReportsPage({
  students,
  courses,
  transactions,
  darkMode
}: ReportsPageProps) {
  // Filters state
  const [reportCycle, setReportCycle] = useState("Monthly");

  // Calculations
  const incomeTxs = transactions.filter(t => t.type === "Income");
  const totalReceived = incomeTxs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">EnoTech Board Reports & Analytics</h2>
          <p className="text-xs text-slate-400">Generate analytics briefs, audit pupil registration logs, inspect monthly revenues, and export reports PDFs.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert("Assembling consolidated audit reports as PDF package. File downloading...")}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" /> Export Board PDF
          </button>
        </div>
      </div>

      {/* Analytics Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: ENROLLMENTS GROWTH CURVE */}
        <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Enrollments Curve</span>
              <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Pupil Growth Cohorts</h3>
            </div>
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Simple custom High-Contrast SVG representational chart */}
          <div className="h-32 w-full flex items-end justify-between px-2 pt-4 bg-slate-950 rounded-xl relative overflow-hidden">
            <svg className="absolute inset-0 w-full h-full text-cyan-500/10 pointer-events-none">
              <path d="M 0 100 Q 50 60 100 80 T 200 40 T 300 10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
            {[
              { m: "Jan", val: 30 },
              { m: "Feb", val: 45 },
              { m: "Mar", val: 50 },
              { m: "Apr", val: 70 },
              { m: "May", val: 85 },
              { m: "Jun", val: 110 }
            ].map((pt, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="bg-cyan-500 rounded-t w-5 transition-all hover:bg-cyan-400 cursor-pointer" style={{ height: `${pt.val * 0.8}px` }}></div>
                <span className="text-[9px] font-mono text-slate-500 uppercase">{pt.m}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs border-t border-slate-800/80 pt-3">
            <span className="text-slate-400">Total Enrolled Registry:</span>
            <span className="font-extrabold text-white">{students.length} Pupils</span>
          </div>
        </div>

        {/* CHART 2: REVENUE FLOW OVERVIEW */}
        <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Revenue Flow Overview</span>
              <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Monthly Cash Flow</h3>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-500" />
          </div>

          {/* Simple custom SVG Revenue/Expense comparison */}
          <div className="h-32 w-full flex items-end justify-between px-4 pt-4 bg-slate-950 rounded-xl relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-radial-gradient" />
            {[
              { m: "May", inc: 40000, exp: 12000 },
              { m: "Jun", inc: 65000, exp: 15000 },
              { m: "Jul", inc: totalReceived, exp: totalExpenses }
            ].map((pt, i) => (
              <div key={i} className="flex items-end gap-1 font-mono">
                {/* Income Bar */}
                <div className="bg-emerald-500 rounded-t w-4.5" style={{ height: `${Math.min(90, (pt.inc / 150000) * 100)}px` }} title={`Income KSh ${pt.inc}`}></div>
                {/* Expense Bar */}
                <div className="bg-rose-500 rounded-t w-4.5" style={{ height: `${Math.min(90, (pt.exp / 150000) * 100)}px` }} title={`Expense KSh ${pt.exp}`}></div>
                <span className="text-[9px] font-sans text-slate-500 uppercase ml-1 block">{pt.m}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs border-t border-slate-800/80 pt-3">
            <span className="text-slate-400">Tuition Income:</span>
            <span className="font-extrabold text-emerald-400">KSh {totalReceived.toLocaleString()}</span>
          </div>
        </div>

        {/* CHART 3: COMPLETED CERTIFICATION COHORTS */}
        <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Evaluations Analysis</span>
              <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Classroom Allocation</h3>
            </div>
            <Award className="w-5 h-5 text-orange-400" />
          </div>

          <div className="h-32 w-full flex flex-col justify-center space-y-3 px-3 bg-slate-950 rounded-xl">
            {[
              { c: "Programming Core", p: 75, col: "bg-cyan-500" },
              { c: "Subnetting Labs", p: 45, col: "bg-orange-500" },
              { c: "Computer Packages", p: 90, col: "bg-emerald-500" }
            ].map((pt, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span>{pt.c}</span>
                  <span className="font-bold">{pt.p}% Complete</span>
                </div>
                <div className="bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pt.col}`} style={{ width: `${pt.p}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between text-xs border-t border-slate-800/80 pt-3">
            <span className="text-slate-400">Examinations average GPA:</span>
            <span className="font-extrabold text-white">3.88 GPA</span>
          </div>
        </div>

      </div>

    </div>
  );
}

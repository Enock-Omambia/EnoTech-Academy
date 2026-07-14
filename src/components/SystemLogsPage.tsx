import React, { useState } from "react";
import {
  ShieldAlert,
  Database,
  Cpu,
  Tv,
  ListFilter,
  RefreshCw,
  Clock,
  HardDrive,
  Download,
  Terminal,
  Activity,
  AlertTriangle,
  Server,
  Zap,
  FileDown
} from "lucide-react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface Asset {
  id: string;
  name: string;
  category: "Computer" | "Router" | "Projector" | "Power backup";
  serial: string;
  location: string;
  status: "Operational" | "Maintenance" | "Offline";
}

interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
}

interface SystemLogsPageProps {
  darkMode: boolean;
}

export default function SystemLogsPage({
  darkMode
}: SystemLogsPageProps) {
  // Mock Hardware Assets
  const [assets] = useState<Asset[]>([
    { id: "AST-01", name: "Dell OptiPlex 7080 Workstation Core i5", category: "Computer", serial: "DEL-SN-90141", location: "Computer Lab A", status: "Operational" },
    { id: "AST-02", name: "Netgear Nighthawk WiFi Router", category: "Router", serial: "NET-SN-8291A", location: "Office Corridor", status: "Operational" },
    { id: "AST-03", name: "Epson Projector 1080p Smart HD", category: "Projector", serial: "EPS-SN-7481L", location: "Main Hall", status: "Maintenance" }
  ]);

  // Mock Security Audit logs
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: "LOG-01", user: "Enock Omato", role: "Principal", action: "Signed Daily Attendance Ledger Sheet", time: "Just Now", status: "SUCCESS" },
    { id: "LOG-02", user: "Professor Jane", role: "Instructor", action: "Uploaded Python course syllabus worksheet PDF", time: "1 Hour Ago", status: "SUCCESS" },
    { id: "LOG-03", user: "Root Core App", role: "System Service", action: "Offline LocalStorage Backup synchronization", time: "Yesterday", status: "SUCCESS" }
  ]);

  const [activeTab, setActiveTab] = useState<"assets" | "security">("assets");

  const handleExportCSV = () => {
    if (activeTab === "assets") {
      const headers = ["Asset ID", "Asset Name", "Category", "Serial Number", "Location", "Status"];
      const keys = ["id", "name", "category", "serial", "location", "status"];
      exportToCSV(assets, "hardware_assets_ledger", headers, keys);
    } else {
      const headers = ["Log ID", "User Name", "User Role", "Action Description", "Timestamp", "Status"];
      const keys = ["id", "user", "role", "action", "time", "status"];
      exportToCSV(logs, "security_audit_logs", headers, keys);
    }
  };

  const handleExportPDF = () => {
    if (activeTab === "assets") {
      const headers = ["Asset ID", "Asset Name", "Category", "Location", "Status"];
      const keys = ["id", "name", "category", "location", "status"];
      exportToPDF("EnoTech Academy Hardware Assets Ledger", headers, keys, assets);
    } else {
      const headers = ["Log ID", "User Name", "User Role", "Action", "Timestamp", "Status"];
      const keys = ["id", "user", "role", "action", "time", "status"];
      exportToPDF("EnoTech Academy Security Audit Logs", headers, keys, logs);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">EnoTech Academy Infrastructure Logs</h2>
          <p className="text-xs text-slate-400">Review physical Dell workstations asset catalogs, trigger local offline backups, and inspect security access ledgers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              alert("Securing complete system backup snapshot...");
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" /> Core Backup Snapshot
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

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Workstations</span>
          <span className="text-2xl font-black mt-1 block">15 Dell PCs</span>
          <span className="text-[9px] text-slate-500 block mt-1">Direct laboratory assets</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Subsystems State</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block flex items-center gap-1">
            <Zap className="w-5 h-5 animate-pulse text-emerald-400" /> Operational
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Kisii local node active</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Database Backup size</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">24.8 MB</span>
          <span className="text-[9px] text-slate-500 block mt-1">Incremental delta logged</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Audit Security Flags</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">0 Flags</span>
          <span className="text-[9px] text-slate-500 block mt-1">Zero security triggers</span>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab("assets")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "assets" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-4 h-4" /> Physical Hardware Assets
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "security" ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Terminal className="w-4 h-4" /> Core Security Audit Ledger
        </button>
      </div>

      {/* TAB 1: HARDWARE ASSETS */}
      {activeTab === "assets" && (
        <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Asset Hardware Model Name</th>
                  <th className="p-3.5">Equipment Type</th>
                  <th className="p-3.5">Manufacturer Serial Code</th>
                  <th className="p-3.5">Laboratory Location</th>
                  <th className="p-3.5 text-center">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {assets.map(ast => (
                  <tr key={ast.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Tv className="w-4 h-4 text-cyan-400" /> {ast.name}
                    </td>

                    <td className="p-3.5 font-semibold text-slate-400">{ast.category}</td>
                    
                    <td className="p-3.5 font-mono font-bold text-cyan-400">{ast.serial}</td>
                    
                    <td className="p-3.5 font-semibold">{ast.location}</td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wider border ${
                        ast.status === "Operational" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>{ast.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LOGS */}
      {activeTab === "security" && (
        <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">ID Node</th>
                  <th className="p-3.5">Supervisor user</th>
                  <th className="p-3.5">System Security action Description</th>
                  <th className="p-3.5 font-mono">Timestamp</th>
                  <th className="p-3.5 text-center">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {logs.map(lg => (
                  <tr key={lg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5 font-mono text-slate-500">{lg.id}</td>
                    
                    <td className="p-3.5">
                      <span className="font-extrabold text-slate-900 dark:text-white block">{lg.user}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold">{lg.role}</span>
                    </td>

                    <td className="p-3.5 text-slate-300 font-semibold">{lg.action}</td>
                    
                    <td className="p-3.5 font-mono text-slate-500">{lg.time}</td>

                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase text-[9px] tracking-wider">
                        {lg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

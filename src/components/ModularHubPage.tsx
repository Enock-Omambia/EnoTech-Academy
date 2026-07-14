/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * EnoTech Academy Modular Plugin Hub and Central Synchronization Module.
 * Offline-First architecture configuration panel.
 */

import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  Sliders,
  Database,
  Terminal,
  Search,
  CheckCircle,
  AlertTriangle,
  Download,
  Settings,
  Shield,
  Trash2,
  PlusCircle,
  FileSpreadsheet,
  Layers,
  Activity,
  Award,
  Sparkles,
  ChevronDown
} from "lucide-react";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface PluginModule {
  id: string;
  name: string;
  category: "Core" | "Laboratory" | "Future Extension";
  version: string;
  status: "Installed" | "Disabled" | "Update Available" | "Marketplace";
  allocatedStorageKB: number;
  dbTables: { name: string; rows: number; schema: string }[];
  statistics: { label: string; value: string }[];
  logs: string[];
}

export default function ModularHubPage({ darkMode = true }: { darkMode?: boolean }) {
  // Sync Engine State
  const [syncStatus, setSyncStatus] = useState<"Synced" | "Pending" | "Syncing" | "Offline">("Synced");
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("04:30:12 AM");
  const [syncQueueSize, setSyncQueueSize] = useState<number>(0);
  const [syncProgress, setSyncProgress] = useState<number>(100);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "Sync: Standby. Handshake verification success.",
    "Sync: No local conflicts identified. Queue clear.",
    "Sync: Offline storage compression completed (GZIP format)."
  ]);

  // Plugins list state
  const [plugins, setPlugins] = useState<PluginModule[]>([
    {
      id: "auth-module",
      name: "Authentication & Security Module",
      category: "Core",
      version: "v2.1.0",
      status: "Installed",
      allocatedStorageKB: 142,
      dbTables: [
        { name: "users_credentials", rows: 42, schema: "(id INTEGER PRIMARY KEY, email TEXT, hash TEXT, role TEXT)" },
        { name: "session_tokens", rows: 8, schema: "(token TEXT PRIMARY KEY, user_id INTEGER, expires_at TIMESTAMP)" }
      ],
      statistics: [
        { label: "Active Sessions", value: "8 Authorized" },
        { label: "Secured Nodes", value: "2/2 Local" }
      ],
      logs: [
        "Auth: Verification token refreshed for user_1002.",
        "Auth: Cryptographic session validated. Sandbox active."
      ]
    },
    {
      id: "academy-management",
      name: "Academy Management Module",
      category: "Core",
      version: "v1.8.5",
      status: "Installed",
      allocatedStorageKB: 840,
      dbTables: [
        { name: "students", rows: 142, schema: "(id TEXT PK, name TEXT, mode TEXT, status TEXT)" },
        { name: "instructors", rows: 12, schema: "(id TEXT PK, name TEXT, specialty TEXT)" }
      ],
      statistics: [
        { label: "Total Students Registered", value: "142 Active" },
        { label: "Active Instructor Profiles", value: "12 Certified" }
      ],
      logs: [
        "Academy: Syncing newly registered student: ET-1092.",
        "Academy: Attendance ledger generated for physical students."
      ]
    },
    {
      id: "offline-lms",
      name: "Offline Learning Management System (LMS)",
      category: "Core",
      version: "v3.0.1",
      status: "Installed",
      allocatedStorageKB: 2420,
      dbTables: [
        { name: "course_catalog", rows: 8, schema: "(id TEXT PK, title TEXT, modules_json TEXT)" },
        { name: "student_progress_cache", rows: 324, schema: "(student_id TEXT, lesson_id TEXT, watched_pct REAL)" }
      ],
      statistics: [
        { label: "Lectures Cached Locally", value: "32 HD Videos" },
        { label: "Lesson Bookmarks Stored", value: "85 Saved" }
      ],
      logs: [
        "LMS: Offline download triggered for 'TypeScript Interfaces'.",
        "LMS: Progress markers saved locally to localStorage."
      ]
    },
    {
      id: "ai-studio-plugin",
      name: "AI Content Studio Module",
      category: "Core",
      version: "v1.1.2",
      status: "Installed",
      allocatedStorageKB: 512,
      dbTables: [
        { name: "generated_assets", rows: 18, schema: "(id SERIAL, topic TEXT, assets_json TEXT, created_date TIMESTAMP)" }
      ],
      statistics: [
        { label: "Lesson Outlines Generated", value: "18 Documents" },
        { label: "Slide presentations built", value: "3 Active" }
      ],
      logs: [
        "AI Studio: Educational template assets cached locally.",
        "AI Studio: Custom slideshow compiled for TypeScript lesson."
      ]
    },
    {
      id: "programming-lab",
      name: "Programming Laboratory Sandbox",
      category: "Laboratory",
      version: "v1.4.0",
      status: "Installed",
      allocatedStorageKB: 1850,
      dbTables: [
        { name: "sandbox_codes_history", rows: 64, schema: "(id INTEGER, language TEXT, code_blob TEXT, last_ran TIMESTAMP)" }
      ],
      statistics: [
        { label: "Supported Languages", value: "5 Runtimes" },
        { label: "Executions Audited", value: "125 Codeblocks" }
      ],
      logs: [
        "ProgLab: Python interpreter compiled main.py successfully.",
        "ProgLab: SQL database sandbox mock transaction parsed."
      ]
    },
    {
      id: "cloud-computing-ext",
      name: "Cloud Computing Extension (AWS/GCP/Azure)",
      category: "Future Extension",
      version: "v1.0.0",
      status: "Marketplace",
      allocatedStorageKB: 0,
      dbTables: [],
      statistics: [
        { label: "Simulated Services", value: "EC2, S3, RDS, Cloud Run" },
        { label: "Prerequisite Labs", value: "Networking Core" }
      ],
      logs: []
    },
    {
      id: "robotics-iot-ext",
      name: "Robotics & IoT Laboratory Simulation",
      category: "Future Extension",
      version: "v1.0.0",
      status: "Marketplace",
      allocatedStorageKB: 0,
      dbTables: [],
      statistics: [
        { label: "Virtual Boards", value: "Arduino, Raspberry Pi" },
        { label: "Telemetry Channels", value: "MQTT protocols" }
      ],
      logs: []
    },
    {
      id: "blockchain-ext",
      name: "Blockchain & Ledger Laboratory",
      category: "Future Extension",
      version: "v1.0.0",
      status: "Marketplace",
      allocatedStorageKB: 0,
      dbTables: [],
      statistics: [
        { label: "Virtual Node Nodes", value: "Ethereum EVM" },
        { label: "Smart Contracts", value: "Solidity Compiler" }
      ],
      logs: []
    }
  ]);

  const [selectedModuleId, setSelectedModuleId] = useState<string>("academy-management");
  const [searchTerm, setSearchTerm] = useState("");

  const activeModule = plugins.find((p) => p.id === selectedModuleId);

  // Settings states for active module
  const [storageAllocationLimit, setStorageAllocationLimit] = useState(5000);
  const [aiAssistantIntegration, setAiAssistantIntegration] = useState(true);
  const [granPermissions, setGranPermissions] = useState({ Admin: true, Instructor: true, Student: false });

  // Sync operations simulation
  const triggerManualSync = () => {
    if (syncStatus === "Syncing") return;

    setSyncStatus("Syncing");
    setSyncProgress(25);
    setSyncLogs((prev) => [`[${new Date().toLocaleTimeString()}] Sync: Starting offline synchronization protocols...`, ...prev]);

    setTimeout(() => {
      setSyncProgress(65);
      setSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Sync: Merging local records with central cloud repository...`,
        `[${new Date().toLocaleTimeString()}] Sync: Verifying database indices and reconciling time drift.`,
        ...prev
      ]);
    }, 700);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncStatus("Synced");
      setLastSyncedTime(new Date().toLocaleTimeString());
      setSyncLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Sync: SUCCESS! All database nodes are completely up to date.`,
        `[${new Date().toLocaleTimeString()}] Sync: 0 conflicts resolved safely. Client priority preserved.`,
        ...prev
      ]);
      setSyncQueueSize(0);
    }, 1500);
  };

  // Manage marketplace installation
  const toggleInstallPlugin = (pId: string) => {
    setPlugins((prev) =>
      prev.map((p) => {
        if (p.id === pId) {
          const isInstalling = p.status === "Marketplace";
          if (isInstalling) {
            return {
              ...p,
              status: "Installed",
              allocatedStorageKB: 320,
              dbTables: [
                { name: `${p.id.replace("-ext", "")}_schemas`, rows: 0, schema: "(id INTEGER, metadata TEXT)" }
              ],
              logs: ["Plugin successfully compiled and schema instantiated in database catalog."]
            };
          } else {
            return { ...p, status: "Marketplace", allocatedStorageKB: 0, dbTables: [], logs: [] };
          }
        }
        return p;
      })
    );
    setSyncQueueSize((prev) => prev + 1);
    setSyncStatus("Pending");
  };

  const handleExportModuleMetadata = (format: "csv" | "pdf") => {
    if (!activeModule) return;
    const headers = ["Table Name", "Cached Rows", "Schema Structure"];
    const keys = ["name", "rows", "schema"];
    const data = activeModule.dbTables.map((t) => ({
      name: t.name,
      rows: t.rows,
      schema: t.schema
    }));

    if (format === "csv") {
      exportToCSV(data, `${activeModule.id}_schema_report`, headers, keys);
    } else {
      exportToPDF(
        `${activeModule.name} Local Storage Schema Layout Audit Report`,
        headers,
        keys,
        data
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Sync Status Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
            <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">EnoTech Central Handshake & Synchronization Engine</h3>
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase font-mono tracking-wider ${
                syncStatus === "Synced"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : syncStatus === "Syncing"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {syncStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Synchronizing structural data, user sessions, attendance sheets, and cached learning logs between physical campus laptops and cloud database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="text-right hidden sm:block">
            <span className="block text-[9px] text-slate-500 font-mono">LAST HANDSHAKE</span>
            <span className="text-xs font-bold text-white">{lastSyncedTime}</span>
          </div>

          <button
            onClick={triggerManualSync}
            disabled={syncStatus === "Syncing"}
            className="w-full lg:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-xs font-black shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {syncStatus === "Syncing" ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Sync Node Now
          </button>
        </div>
      </div>

      {syncStatus === "Syncing" && (
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300"
            style={{ width: `${syncProgress}%` }}
          ></div>
        </div>
      )}

      {/* Main Grid: Modules Directory (Left) & Advanced Module Controls (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: Installed Plugins and Marketplace */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
            
            {/* Filter and Search header */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 font-black tracking-widest block uppercase">Registry Registry Browser</span>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search modular plugins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* List Modules */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {plugins
                .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((p) => {
                  const isSelected = selectedModuleId === p.id;
                  const isInstalled = p.status !== "Marketplace";
                  
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (isInstalled) setSelectedModuleId(p.id);
                      }}
                      className={`p-3 rounded-lg border text-xs transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-slate-950 border-cyan-500/40 text-white"
                          : isInstalled
                          ? "bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-950 cursor-pointer"
                          : "bg-slate-900/20 border-slate-850/40 text-slate-500"
                      }`}
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold truncate">{p.name}</span>
                          <span className="text-[9px] text-slate-500">{p.version}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <span>{p.category}</span>
                          <span>•</span>
                          <span>{isInstalled ? `${p.allocatedStorageKB} KB local` : "Marketplace"}</span>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        {isInstalled ? (
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] rounded font-bold uppercase">
                            Active
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleInstallPlugin(p.id);
                            }}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black rounded uppercase cursor-pointer"
                          >
                            Install
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>

          {/* Sync Engine Log stream */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <span className="text-[10px] font-mono text-cyan-400 font-black tracking-widest block uppercase">Synchronization Activity Logs</span>
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-850 max-h-40 overflow-y-auto space-y-1.5 font-mono text-[9px] text-slate-400">
              {syncLogs.map((log, idx) => (
                <div key={idx} className={log.includes("SUCCESS") ? "text-emerald-400 font-bold" : "text-slate-400"}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Selected Module Custom Control Center Panel */}
        {activeModule ? (
          <div className="xl:col-span-2 space-y-6">
            
            {/* Module Overview & Stats */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black block uppercase">{activeModule.category} Plugin</span>
                  <h3 className="text-sm font-black text-white">{activeModule.name} Control Center</h3>
                </div>
                
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] rounded font-bold font-mono">
                  {activeModule.version}
                </span>
              </div>

              {/* Module Stats */}
              <div className="grid grid-cols-2 gap-4">
                {activeModule.statistics.map((st, i) => (
                  <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs">
                    <span className="text-slate-500 text-[10px] font-mono block uppercase">{st.label}</span>
                    <span className="font-extrabold text-white text-sm">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DB Tables Schema Explorer */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black block uppercase">Isolated Database Schema (SQLite Node)</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExportModuleMetadata("csv")}
                    className="px-2 py-1 bg-slate-950 border border-slate-850 rounded hover:bg-slate-850 text-[10px] text-slate-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3 h-3" /> Export CSV
                  </button>
                  <button
                    onClick={() => handleExportModuleMetadata("pdf")}
                    className="px-2 py-1 bg-slate-950 border border-slate-850 rounded hover:bg-slate-850 text-[10px] text-slate-400 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export PDF
                  </button>
                </div>
              </div>

              {activeModule.dbTables.length === 0 ? (
                <div className="p-4 bg-slate-950 text-center rounded-lg border border-slate-850 text-xs text-slate-500 italic">
                  This marketplace plugin has not initialized relational schemas.
                </div>
              ) : (
                <div className="space-y-2">
                  {activeModule.dbTables.map((tbl, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs space-y-1.5 font-mono">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-cyan-400 font-extrabold">TABLE {tbl.name}</span>
                        <span className="text-slate-500">{tbl.rows} rows cached</span>
                      </div>
                      <div className="text-[10px] text-slate-400 bg-slate-900 p-2 rounded break-words">
                        {tbl.schema}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Module Settings, Permissions & AI Integrations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Settings Configuration form */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black block uppercase">Configure Module Settings</span>
                
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>LOCAL STORAGE ALLOCATION LIMIT</span>
                      <span>{storageAllocationLimit} KB</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="500"
                      value={storageAllocationLimit}
                      onChange={(e) => setStorageAllocationLimit(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                    <div>
                      <span className="font-extrabold text-white block">AI Assistant Integration</span>
                      <span className="text-[10px] text-slate-500 leading-normal block">Enable localized EnoTech AI tutor on workspace.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={aiAssistantIntegration}
                      onChange={(e) => setAiAssistantIntegration(e.target.checked)}
                      className="w-4 h-4 accent-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Granular User Permissions */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black block uppercase">Granular Access Permissions Matrix</span>
                
                <div className="space-y-2.5 text-xs">
                  {Object.entries(granPermissions).map(([role, permitted]) => (
                    <div key={role} className="flex items-center justify-between p-2 bg-slate-950 border border-slate-850 rounded">
                      <span className="font-bold text-slate-300 uppercase font-mono text-[10px]">{role} ACCESS</span>
                      <input
                        type="checkbox"
                        checked={permitted}
                        onChange={(e) =>
                          setGranPermissions((prev) => ({
                            ...prev,
                            [role]: e.target.checked
                          }))
                        }
                        className="w-4 h-4 accent-cyan-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Live Module Log Stream */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-black block uppercase">Module-Specific Live Logs</span>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-850 max-h-36 overflow-y-auto space-y-1.5 font-mono text-[10px] text-slate-400">
                {activeModule.logs.length === 0 ? (
                  <div className="text-slate-600 italic text-[9px]">No recent logs generated for this marketplace extension.</div>
                ) : (
                  activeModule.logs.map((log, idx) => <div key={idx}>{log}</div>)
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="xl:col-span-2 p-8 bg-slate-900/50 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 text-xs">
            <Cpu className="w-12 h-12 text-slate-600 mb-2 animate-bounce" />
            Please select an installed core module from the directory sidebar to audit parameters, schemas, and live stream actions.
          </div>
        )}

      </div>
    </div>
  );
}

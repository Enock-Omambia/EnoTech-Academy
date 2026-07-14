import React, { useState } from "react";
import {
  Settings,
  Save,
  Globe,
  Lock,
  Database,
  Bell,
  Sliders,
  CheckCircle,
  HelpCircle,
  User,
  Shield,
  Key,
  Smartphone,
  Laptop
} from "lucide-react";

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function SettingsPage({
  darkMode,
  onToggleDarkMode
}: SettingsPageProps) {
  // Form Settings states
  const [academyName, setAcademyName] = useState("EnoTech Academy");
  const [founderName, setFounderName] = useState("Enock Omato");
  const [mPesaPaybill, setMPesaPaybill] = useState("400222");
  const [parentSmsSwitch, setParentSmsSwitch] = useState(true);
  const [offlineSyncInterval, setOfflineSyncInterval] = useState("Daily");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Branding settings, SMS triggers, and database configurations successfully persisted!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">EnoTech Academy Settings Desk</h2>
          <p className="text-xs text-slate-400">Configure institution branding profiles, toggle parent SMS thresholds, customize offline data backups and manage credentials.</p>
        </div>
      </div>

      {/* Grid Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Settings Navigation links */}
        <div className="space-y-2">
          {[
            { label: "Institution Identity Branding", active: true },
            { label: "Parental SMS Alert Triggers", active: false },
            { label: "Offline Storage Backups", active: false },
            { label: "API Tokens Credentials", active: false }
          ].map((item, idx) => (
            <button
              key={idx}
              className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                item.active ? "bg-cyan-600 text-white" : "bg-slate-900/60 border border-slate-800/40 text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Configurations Form Panel */}
        <div className={`p-6 border rounded-2xl shadow-sm lg:col-span-2 space-y-6 ${
          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
        }`}>
          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs text-slate-300">
            
            {/* Sec 1: General Profile */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-800/60 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> General Academy Profile
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Academy Institution Name</label>
                  <input
                    type="text"
                    value={academyName}
                    onChange={(e) => setAcademyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Director & Founder Name</label>
                  <input
                    type="text"
                    value={founderName}
                    onChange={(e) => setFounderName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Sec 2: Tuition Paybill */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-800/60 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" /> Financial Settings
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Tuition Fees Paybill No</label>
                  <input
                    type="text"
                    value={mPesaPaybill}
                    onChange={(e) => setMPesaPaybill(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Default Base Currency</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white">
                    <option>Kenyan Shilling (KSh)</option>
                    <option>US Dollar ($)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sec 3: Alerts and Systems */}
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase text-slate-400 block pb-1 border-b border-slate-800/60 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notifications & Offline Synchronization
              </span>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={parentSmsSwitch}
                    onChange={(e) => setParentSmsSwitch(e.target.checked)}
                    className="accent-cyan-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="font-extrabold text-white">Enable Automated Guardian SMS Alerts</span>
                    <span className="text-[10px] text-slate-500 block">Sends instant SMS notifications to registered parents for attendance absences or late arrivals.</span>
                  </div>
                </label>

                <div className="pt-2">
                  <label className="block text-slate-400 mb-1">Offline LocalStorage Backup Sync Interval</label>
                  <select
                    value={offlineSyncInterval}
                    onChange={(e) => setOfflineSyncInterval(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white w-48"
                  >
                    <option value="Hourly">Hourly Incremental</option>
                    <option value="Daily">Daily Ledger backup</option>
                    <option value="Weekly">Weekly Complete Sync</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Core Configurations
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}

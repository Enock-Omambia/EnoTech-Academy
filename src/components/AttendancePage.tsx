import React, { useState } from "react";
import {
  Calendar,
  UserCheck,
  Search,
  Plus,
  QrCode,
  CheckCircle,
  Clock,
  XCircle,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award,
  FileDown
} from "lucide-react";
import { Student, AttendanceRecord, Course } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface AttendancePageProps {
  students: Student[];
  courses: Course[];
  attendanceRecords: AttendanceRecord[];
  darkMode: boolean;
  onSaveAttendanceRecords: (records: AttendanceRecord[]) => void;
  onOpenQrOverlay: () => void;
}

export default function AttendancePage({
  students,
  courses,
  attendanceRecords,
  darkMode,
  onSaveAttendanceRecords,
  onOpenQrOverlay
}: AttendancePageProps) {
  // States
  const [selectedCourseId, setSelectedCourseId] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchStudentTerm, setSearchStudentTerm] = useState("");

  // Marking session temporary map
  // Key: studentId, Value: "Present" | "Late" | "Absent" | "Excused"
  const [markingSheet, setMarkingSheet] = useState<Record<string, "Present" | "Late" | "Absent" | "Excused">>({});

  // Initialize marking sheet for students on view
  const initializeMarkingSheet = (studsList: Student[]) => {
    const updated = { ...markingSheet };
    studsList.forEach(s => {
      if (!updated[s.id]) {
        updated[s.id] = "Present"; // default present
      }
    });
    setMarkingSheet(updated);
  };

  const handleMarkStatus = (studentId: string, status: "Present" | "Late" | "Absent" | "Excused") => {
    setMarkingSheet(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleCommitMarkingSheet = () => {
    // Generate actual AttendanceRecord items
    const recordsToCommit: AttendanceRecord[] = filteredStudentsForMarking.map(s => ({
      id: `ATT-${Date.now()}-${s.id}`,
      studentId: s.id,
      studentName: s.fullName,
      date: attendanceDate,
      status: markingSheet[s.id] || "Present",
      markedBy: "Enock Omato (Principal)"
    }));

    onSaveAttendanceRecords(recordsToCommit);
    alert(`Successfully committed daily attendance ledger (${recordsToCommit.length} records) for date ${attendanceDate}!`);
  };

  // Filter students for display
  const filteredStudentsForMarking = students.filter(s => {
    const matchesCourse = selectedCourseId === "All" || s.courseEnrolled === selectedCourseId;
    const matchesBatch = selectedBatch === "All" || s.batch === selectedBatch;
    const matchesSearch = s.fullName.toLowerCase().includes(searchStudentTerm.toLowerCase()) || s.id.toLowerCase().includes(searchStudentTerm.toLowerCase());
    return matchesCourse && matchesBatch && matchesSearch;
  });

  // Derived metrics from committed history
  const totalLogsCount = attendanceRecords.length;
  const presentLogsCount = attendanceRecords.filter(r => r.status === "Present").length;
  const lateLogsCount = attendanceRecords.filter(r => r.status === "Late").length;
  const absentLogsCount = attendanceRecords.filter(r => r.status === "Absent").length;
  const attendanceRate = totalLogsCount > 0 ? ((presentLogsCount + lateLogsCount) / totalLogsCount) * 100 : 96.5;

  const handleExportCSV = () => {
    const headers = ["Record ID", "Student ID", "Student Name", "Date", "Status", "Marked By"];
    const keys = ["id", "studentId", "studentName", "date", "status", "markedBy"];
    exportToCSV(attendanceRecords, "attendance_register", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["Student Name", "Date", "Status", "Marked By"];
    const keys = ["studentName", "date", "status", "markedBy"];
    exportToPDF("EnoTech Academy Attendance Audit Log", headers, keys, attendanceRecords);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Active Attendance Audit Panel</h2>
          <p className="text-xs text-slate-400">Mark daily attendance logs manually, trigger the camera QR validation, or export structural registers.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenQrOverlay}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-bold hover:from-cyan-500 hover:to-blue-500 transition-all cursor-pointer shadow-sm"
          >
            <QrCode className="w-4 h-4" /> QR Quick Mark
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
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Attendance Rate</span>
          <span className="text-2xl font-black mt-1 text-emerald-500 block">{attendanceRate.toFixed(1)}%</span>
          <span className="text-[9px] text-slate-500 block mt-1">Excellent cohort ratio</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Ledger Submissions</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{totalLogsCount} Records</span>
          <span className="text-[9px] text-slate-500 block mt-1">Committed daily logs</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Monthly Absences</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">{absentLogsCount} Absents</span>
          <span className="text-[9px] text-slate-500 block mt-1">Requiring make-up modules</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Late Arrivals</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">{lateLogsCount} Late</span>
          <span className="text-[9px] text-slate-500 block mt-1">Arrivals flagged on registry</span>
        </div>
      </div>

      {/* Sheet Filter Bar */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-4 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Academic Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full border rounded-lg p-2 text-xs bg-transparent focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Course Curriculums</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Batch / Cohort</label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full border rounded-lg p-2 text-xs bg-transparent focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Class Batches</option>
              <option value="Regular Morning">Regular Morning</option>
              <option value="Evening Cohort">Evening Cohort</option>
              <option value="Weekend Bootcamp">Weekend Bootcamp</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Attendance Date Ledger</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full border rounded-lg p-2 text-xs bg-transparent focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Lookup Student Name</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search name..."
                value={searchStudentTerm}
                onChange={(e) => setSearchStudentTerm(e.target.value)}
                className="w-full pl-8 pr-2 border rounded-lg p-2 text-xs bg-transparent focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Register Marking Grid / Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="p-4 border-b border-slate-850 bg-slate-900/40 flex justify-between items-center">
          <span className="text-xs font-bold text-white">Daily Ledger Sheet ({filteredStudentsForMarking.length} Students listed)</span>
          
          <button
            onClick={() => {
              // Auto fill "Present"
              const updated = { ...markingSheet };
              filteredStudentsForMarking.forEach(s => updated[s.id] = "Present");
              setMarkingSheet(updated);
            }}
            className="px-2.5 py-1 bg-slate-800 text-slate-300 hover:text-white rounded text-[10px] font-bold"
          >
            Mark All Present
          </button>
        </div>

        {filteredStudentsForMarking.length === 0 ? (
          <div className="py-12 text-center text-slate-400 italic text-xs">No registered students matched your select active course criteria filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Student Node info</th>
                  <th className="p-3">Course Track</th>
                  <th className="p-3 text-center">Status Toggle Node Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudentsForMarking.map((student) => {
                  const activeStatus = markingSheet[student.id] || "Present";
                  return (
                    <tr key={student.id} className="hover:bg-slate-900/30">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <img src={student.passportPhoto} alt="" className="w-8 h-8 rounded-full object-cover border" />
                          <div>
                            <span className="font-bold text-white block">{student.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono block">{student.admissionNo} • {student.id}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-semibold text-cyan-400">{courses.find(c => c.id === student.courseEnrolled)?.name || student.courseEnrolled}</td>

                      <td className="p-3">
                        <div className="flex justify-center items-center gap-1">
                          {[
                            { id: "Present", label: "Present", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 active:bg-emerald-600" },
                            { id: "Late", label: "Late Arrival", color: "bg-amber-500/10 text-amber-400 border-amber-500/20 active:bg-amber-600" },
                            { id: "Absent", label: "Absent", color: "bg-rose-500/10 text-rose-400 border-rose-500/20 active:bg-rose-600" },
                            { id: "Excused", label: "Excused", color: "bg-blue-500/10 text-blue-400 border-blue-500/20 active:bg-blue-600" }
                          ].map((node) => {
                            const isSelected = activeStatus === node.id;
                            return (
                              <button
                                key={node.id}
                                onClick={() => handleMarkStatus(student.id, node.id as any)}
                                className={`px-2.5 py-1 border rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  isSelected
                                    ? node.id === "Present" ? "bg-emerald-600 text-white border-emerald-500" :
                                      node.id === "Late" ? "bg-amber-600 text-white border-amber-500" :
                                      node.id === "Absent" ? "bg-rose-600 text-white border-rose-500" :
                                      "bg-blue-600 text-white border-blue-500"
                                    : "bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-750"
                                }`}
                              >
                                {node.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredStudentsForMarking.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/20 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-mono">Marked By Authorized Supervisor node: Enock Omato</span>
            <button
              onClick={handleCommitMarkingSheet}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
            >
              Sign & Save Attendance Sheet
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  X,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  TrendingUp,
  Mail,
  UserCheck
} from "lucide-react";
import { Course, Student } from "../types";

interface AssignmentTask {
  id: string;
  title: string;
  courseId: string;
  deadline: string;
  maxPoints: number;
  description: string;
  submissionsCount: number;
}

interface AssignmentsPageProps {
  courses: Course[];
  students: Student[];
  darkMode: boolean;
}

export default function AssignmentsPage({
  courses,
  students,
  darkMode
}: AssignmentsPageProps) {
  // Mock assignments list
  const [tasks, setTasks] = useState<AssignmentTask[]>([
    { id: "ASM-101", title: "Lab 1 Setup: Operational System Commands", courseId: "C-CS-ALGO", deadline: "2026-07-12", maxPoints: 100, description: "Submit screenshot verification showing terminal compilation logs.", submissionsCount: 4 },
    { id: "ASM-102", title: "Module Homework: Basic SQL Outer Joins Practice", courseId: "C-DBMS-SQL", deadline: "2026-07-18", maxPoints: 50, description: "Write structured queries matching outer, inner and cross joins.", submissionsCount: 2 },
    { id: "ASM-103", title: "Cisco Routing Setup Plan Worksheet", courseId: "C-CYBER", deadline: "2026-06-25", maxPoints: 100, description: "Diagrammatic IP Allocations subnetting.", submissionsCount: 5 }
  ]);

  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("All");

  // New assignment form state
  const [newTask, setNewTask] = useState({
    title: "",
    courseId: courses[0]?.id || "C-CS-ALGO",
    deadline: new Date().toISOString().split("T")[0],
    maxPoints: 100,
    description: ""
  });

  const handleCreateAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;

    const created: AssignmentTask = {
      id: `ASM-${100 + tasks.length + 1}`,
      title: newTask.title,
      courseId: newTask.courseId,
      deadline: newTask.deadline,
      maxPoints: Number(newTask.maxPoints),
      description: newTask.description,
      submissionsCount: 0
    };

    setTasks([...tasks, created]);
    setShowAddModal(false);
    // Reset
    setNewTask({
      title: "",
      courseId: courses[0]?.id || "C-CS-ALGO",
      deadline: new Date().toISOString().split("T")[0],
      maxPoints: 100,
      description: ""
    });
    alert(`Course Assignment task "${created.title}" published successfully!`);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseId === "All" || t.courseId === selectedCourseId;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Active Academic Assignments Ledger</h2>
          <p className="text-xs text-slate-400">Distribute coursework homework topics, set deadline thresholds, track submissions, and verify student code.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" /> Issue New Assignment
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Tasks Issued</span>
          <span className="text-2xl font-black mt-1 block">{tasks.length} Homeworks</span>
          <span className="text-[9px] text-slate-500 block mt-1">Direct syllabus assignments</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Submissions Rate</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">82.5% Ratio</span>
          <span className="text-[9px] text-slate-500 block mt-1">Submitted in due intervals</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Awaiting Grading Marks</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">3 Tasks</span>
          <span className="text-[9px] text-slate-500 block mt-1">Requires manual evaluation</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Overdue submissions</span>
          <span className="text-2xl font-black text-rose-500 mt-1 block">1 Homework</span>
          <span className="text-[9px] text-slate-500 block mt-1">Pending make-up submissions</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-3 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search assignment titles, lab requirements, commands keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-lg bg-transparent focus:outline-none"
            />
          </div>

          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full sm:w-56 border rounded-lg p-2.5 text-xs bg-transparent focus:outline-none"
          >
            <option value="All">All Course Curriculums</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-3.5">Assignment Description</th>
                <th className="p-3.5">Syllabus Target Track</th>
                <th className="p-3.5">Intake Deadline</th>
                <th className="p-3.5">Maximum Points</th>
                <th className="p-3.5 text-center">Submissions Ratio</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTasks.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="p-3.5">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-blue-400 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block">{t.title}</span>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-sm line-clamp-1">{t.description}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5 font-bold text-cyan-400">{t.courseId}</td>
                  
                  <td className="p-3.5 font-mono font-bold text-slate-400">{t.deadline}</td>
                  
                  <td className="p-3.5 font-mono font-extrabold text-slate-200">{t.maxPoints} pts</td>

                  <td className="p-3.5 text-center">
                    <div className="inline-block px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold">
                      {t.submissionsCount} / {students.filter(s => s.courseEnrolled === t.courseId).length || 5} Submitted
                    </div>
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => alert(`Opening submissions roster list for homework ${t.id}. Direct grading interface activated.`)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold cursor-pointer"
                    >
                      Grade Submissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =================================
          MODAL: NEW ASSIGNMENT TASK FORM
          ================================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Create & Distribute Homework Task</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateAssignmentSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Assignment Work Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lab 2: PostgreSQL Relational Database Schema Creation"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Target Course Syllabus</label>
                    <select
                      value={newTask.courseId}
                      onChange={(e) => setNewTask({...newTask, courseId: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Submissions Deadline Date</label>
                    <input
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Maximum Grade Score Points (Scale)</label>
                  <input
                    type="number"
                    value={newTask.maxPoints}
                    onChange={(e) => setNewTask({...newTask, maxPoints: Number(e.target.value)})}
                    className="w-32 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Detailed Technical Specifications / Syllabus Instructions *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide specific technical commands, submission format (PDF, code files link) and lab prerequisites instructions clearly..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-2 flex items-center gap-1"><Upload className="w-4 h-4 text-cyan-400" /> Upload homework guidelines pdf sheet</span>
                  <label className="border border-dashed border-slate-800 hover:border-cyan-500/30 rounded-lg p-3 text-center cursor-pointer block hover:bg-slate-900/10 text-[11px]">
                    Click to browse task instruction sheets (PDF, DOCX)
                    <input type="file" className="hidden" onChange={() => alert("Guidelines sheet attached successfully")} />
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Publish Homework Task
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

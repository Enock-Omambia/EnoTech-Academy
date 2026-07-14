import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  Mail,
  QrCode,
  Award,
  ChevronDown,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  Briefcase,
  X,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Upload,
  UserCheck,
  Building,
  CheckCircle,
  FileSpreadsheet,
  FileDown,
  TrendingUp,
  TrendingDown,
  Sliders,
  BarChart2,
  ThumbsUp
} from "lucide-react";
import { Student, Course, Transaction, AttendanceRecord, StudentSubmission } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface StudentsPageProps {
  students: Student[];
  courses: Course[];
  transactions: Transaction[];
  attendance: AttendanceRecord[];
  submissions: StudentSubmission[];
  darkMode: boolean;
  onEnrollNewClick: () => void;
  onViewIdCardClick: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onAddStudentDetail: (student: Student) => void;
}

export default function StudentsPage({
  students,
  courses,
  transactions,
  attendance,
  submissions,
  darkMode,
  onEnrollNewClick,
  onViewIdCardClick,
  onDeleteStudent,
  onAddStudentDetail
}: StudentsPageProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeProfileStudent, setActiveProfileStudent] = useState<Student | null>(null);
  const [profileTab, setProfileTab] = useState<"overview" | "transcripts" | "attendance" | "finance" | "documents">("overview");

  // Local actions states
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [showActiveTranscript, setShowActiveTranscript] = useState<any | null>(null);

  // Predictive GPA states and dynamic layout size tracker
  const [effortFactor, setEffortFactor] = useState(1.0);
  const [predictionScenario, setPredictionScenario] = useState<"momentum" | "average" | "attendance">("momentum");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const transcriptChartRef = React.useRef<HTMLDivElement>(null);
  const [transcriptChartWidth, setTranscriptChartWidth] = useState(600);

  // Helper interfaces for gradebook loading
  interface GradeBookAssessment {
    id: string;
    title: string;
    weight: number;
    moduleId: string;
    courseId: string;
  }

  // Pre-seed standard assessments for course modules
  const getInitialGradeBookAssessments = (coursesList: Course[]): GradeBookAssessment[] => {
    const list: GradeBookAssessment[] = [];
    coursesList.forEach(course => {
      if (course.modules) {
        course.modules.forEach(module => {
          list.push(
            {
              id: `GBA-${course.id}-${module.id}-cat`,
              title: "Continuous Assessment Test (CAT)",
              weight: 30,
              moduleId: module.id,
              courseId: course.id
            },
            {
              id: `GBA-${course.id}-${module.id}-lab`,
              title: "Lab Portfolio & Practicals",
              weight: 30,
              moduleId: module.id,
              courseId: course.id
            },
            {
              id: `GBA-${course.id}-${module.id}-exam`,
              title: "Module Terminal Exam",
              weight: 40,
              moduleId: module.id,
              courseId: course.id
            }
          );
        });
      }
    });
    return list;
  };

  const getInitialGradeBookMarks = (
    studentsList: Student[],
    assessmentsList: GradeBookAssessment[]
  ): Record<string, Record<string, number>> => {
    const marksMap: Record<string, Record<string, number>> = {};
    studentsList.forEach(student => {
      const studentMarks: Record<string, number> = {};
      const courseAssessments = assessmentsList.filter(a => a.courseId === student.courseEnrolled);
      courseAssessments.forEach(ass => {
        const charSum = student.fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const assOffset = ass.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const score = Math.min(100, Math.max(50, 72 + ((charSum + assOffset) % 25)));
        studentMarks[ass.id] = score;
      });
      marksMap[student.id] = studentMarks;
    });
    return marksMap;
  };

  // Load Grade Book data from localStorage with reliable fallbacks
  const localAssessments = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("enotech_gradebook_assessments");
      if (stored) return JSON.parse(stored) as GradeBookAssessment[];
    } catch (e) {}
    return getInitialGradeBookAssessments(courses);
  }, [courses]);

  const localMarks = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("enotech_gradebook_marks");
      if (stored) return JSON.parse(stored) as Record<string, Record<string, number>>;
    } catch (e) {}
    return getInitialGradeBookMarks(students, localAssessments);
  }, [students, localAssessments]);

  // Observer to handle responsive trend chart canvas sizing perfectly
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width || 600);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeProfileStudent, profileTab]);

  // Observer to handle responsive transcript performance chart canvas sizing perfectly
  React.useEffect(() => {
    if (!transcriptChartRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setTranscriptChartWidth(entry.contentRect.width || 600);
      }
    });
    observer.observe(transcriptChartRef.current);
    return () => observer.disconnect();
  }, [activeProfileStudent, profileTab]);

  // Derived metrics
  const totalCount = students.length;
  const activeCount = students.filter(s => s.status === "Active").length;
  const completedCount = students.filter(s => s.status === "Completed").length;
  const onlineCount = students.filter(s => s.learningMode === "Online").length;
  const physicalCount = students.filter(s => s.learningMode === "Physical").length;

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMode = modeFilter === "All" || s.learningMode === modeFilter;
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    
    return matchesSearch && matchesMode && matchesStatus;
  });

  // Calculate Student Progress Estimate (based on duration/completed lessons or standard mock metrics)
  const getProgressPercentage = (student: Student) => {
    if (student.status === "Completed") return 100;
    if (student.id === "ET-2026-1001") return 75;
    if (student.id === "ET-2026-1002") return 45;
    if (student.id === "ET-2026-1003") return 15;
    return 30; // default initial progress
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold">Active</span>;
      case "Completed":
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-bold">Graduated</span>;
      case "Suspended":
        return <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-[10px] font-bold">Suspended</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Student ID", "Admission No", "Full Name", "Gender", "Registration Date", "Course Enrolled", "Batch", "Learning Mode", "County", "Status"];
    const keys = ["id", "admissionNo", "fullName", "gender", "registrationDate", "courseEnrolled", "batch", "learningMode", "county", "status"];
    exportToCSV(filteredStudents, "student_registry", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["Student ID", "Admission No", "Full Name", "Gender", "Course", "Learning Mode", "County", "Status"];
    const keys = ["id", "admissionNo", "fullName", "gender", "courseEnrolled", "learningMode", "county", "status"];
    exportToPDF("Student Information Directory Registry", headers, keys, filteredStudents);
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Student Information Directory (SIS)</h2>
          <p className="text-xs text-slate-400">Manage digital student portfolios, registration, parent emergency contacts, and academic reports.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onEnrollNewClick}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Enroll Student
          </button>
          
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-all cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" /> Export PDF
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold border border-slate-700 transition-all cursor-pointer animate-pulse"
          >
            <Printer className="w-3.5 h-3.5" /> Print View
          </button>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Students</span>
          <span className="text-2xl font-black mt-1 block">{totalCount}</span>
          <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold mt-1">
            <span>Active Ledger</span>
          </div>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Status</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">{activeCount}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Attending currently</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Graduates</span>
          <span className="text-2xl font-black text-blue-500 mt-1 block">{completedCount}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Issued certificates</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Online Cohort</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{onlineCount}</span>
          <span className="text-[9px] text-slate-500 block mt-1">Remote connection</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Physical Labs</span>
          <span className="text-2xl font-black text-orange-400 mt-1 block">{physicalCount}</span>
          <span className="text-[9px] text-slate-500 block mt-1">On-premise seats</span>
        </div>
      </div>

      {/* Search & Advanced Filters */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-3 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search students by Name, Admission Number, County or Student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-lg bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </div>
            
            <select
              value={modeFilter}
              onChange={(e) => setModeFilter(e.target.value)}
              className="flex-1 md:w-40 border rounded-lg p-2 text-xs bg-transparent focus:outline-none"
            >
              <option value="All">All Learning Modes</option>
              <option value="Physical">Physical Classes</option>
              <option value="Online">Online Remote</option>
              <option value="Hybrid">Hybrid Classes</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:w-36 border rounded-lg p-2 text-xs bg-transparent focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Graduated</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        {filteredStudents.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-300">No Student Records Found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">No registered student matches your active search queries or status filters.</p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setModeFilter("All");
                setStatusFilter("All");
              }}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-4">Student Info</th>
                  <th className="p-4">Admission No</th>
                  <th className="p-4">Allocated Course</th>
                  <th className="p-4">Learning Mode</th>
                  <th className="p-4">Parent Guardian</th>
                  <th className="p-4">Academic Progress</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
                {filteredStudents.map((student) => {
                  const courseObj = courses.find(c => c.id === student.courseEnrolled);
                  const progressVal = getProgressPercentage(student);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.passportPhoto}
                            alt=""
                            className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-800 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block hover:underline cursor-pointer" onClick={() => {
                              setActiveProfileStudent(student);
                              setProfileTab("overview");
                            }}>
                              {student.fullName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">{student.id}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 font-mono font-semibold text-slate-400">{student.admissionNo}</td>
                      
                      <td className="p-4">
                        <span className="font-bold text-cyan-500">{courseObj ? courseObj.name : student.courseEnrolled}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{student.batch}</span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          student.learningMode === "Online" ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400" :
                          student.learningMode === "Physical" ? "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                        }`}>{student.learningMode}</span>
                      </td>

                      <td className="p-4 leading-tight">
                        <span className="font-semibold block text-slate-700 dark:text-slate-300">{student.guardian}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{student.parentPhone}</span>
                      </td>

                      <td className="p-4 w-36">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2" style={{ width: `${progressVal}%` }}></div>
                          </div>
                          <span className="font-mono font-bold text-[10px]">{progressVal}%</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">{getStatusBadge(student.status)}</td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setActiveProfileStudent(student);
                              setProfileTab("overview");
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition-colors"
                            title="Open Student Profile"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                          
                          <button
                            onClick={() => onViewIdCardClick(student)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition-colors"
                            title="Generate ID card"
                          >
                            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Are you absolutely sure you want to delete student ${student.fullName}? All associated academic transcripts, attendance matrix and fees ledger records will be archived.`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-300 rounded hover:text-rose-400 cursor-pointer transition-colors"
                            title="Delete Student"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==============================
          STUDENT PROFILE MODAL VIEW
          ============================== */}
      {activeProfileStudent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className={`relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border ${
            darkMode ? "bg-[#0c1220] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            
            {/* Header branding band */}
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>
            
            <div className="p-6 space-y-6">
              
              {/* Modal close & header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">Active Student Portfolio</h3>
                    <p className="text-[11px] text-slate-400">Complete academic dossier, fee statement, and certifications registry.</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveProfileStudent(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Profile Summary row */}
              <div className="flex flex-col md:flex-row gap-5 items-start bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 w-full">
                <img
                  src={activeProfileStudent.passportPhoto}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-400 shadow-sm mx-auto md:mx-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-center md:text-left space-y-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{activeProfileStudent.fullName}</h4>
                    <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-blue-600 text-white w-max mx-auto md:mx-0">
                      {courses.find(c => c.id === activeProfileStudent.courseEnrolled)?.name || "Technology Student"}
                    </span>
                  </div>
                  
                  <div className="text-xs text-slate-400 flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
                    <span><strong>ID:</strong> {activeProfileStudent.id}</span>
                    <span><strong>Admission:</strong> {activeProfileStudent.admissionNo}</span>
                    <span><strong>Cohort:</strong> {activeProfileStudent.batch}</span>
                    <span><strong>Location:</strong> {activeProfileStudent.county} County</span>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-row md:flex-col gap-2 justify-center">
                  <button
                    onClick={() => onViewIdCardClick(activeProfileStudent)}
                    className="flex-1 md:w-40 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Print Student ID
                  </button>
                  <button
                    onClick={() => alert(`Direct parents alerts dispatched to guardian ${activeProfileStudent.guardian} at ${activeProfileStudent.parentPhone}`)}
                    className="flex-1 md:w-40 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1 border border-slate-700 transition-all cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" /> Parental Alert
                  </button>
                </div>
              </div>

              {/* Tab Selector inside Modal */}
              <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-800 whitespace-nowrap scrollbar-none">
                {[
                  { id: "overview", label: "Overview & Personal Details", icon: Users },
                  { id: "transcripts", label: "Transcripts & Reports", icon: FileText },
                  { id: "attendance", label: "Attendance History", icon: Calendar },
                  { id: "finance", label: "Ledger Fee Statement", icon: DollarSign },
                  { id: "documents", label: "Uploaded Docs & Notes", icon: Upload }
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isSelected = profileTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setProfileTab(tab.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-cyan-500 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Content Sections */}
              
              {/* TAB 1: OVERVIEW */}
              {profileTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div className={`p-4 rounded-xl border space-y-4 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                      <UserCheck className="w-4 h-4" /> Personal & Bio Information
                    </h4>
                    
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between py-1"><span className="text-slate-400">Gender:</span> <span className="font-bold">{activeProfileStudent.gender}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Date of Birth:</span> <span className="font-bold">{activeProfileStudent.dob}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">National ID:</span> <span className="font-mono font-bold">{activeProfileStudent.nationalId}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Nationality:</span> <span className="font-bold">{activeProfileStudent.nationality}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Residential Address:</span> <span className="font-bold">{activeProfileStudent.address}</span></div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-4 ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1">
                      <Building className="w-4 h-4" /> Parent & Emergency Contacts
                    </h4>
                    
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between py-1"><span className="text-slate-400">Primary Guardian:</span> <span className="font-bold">{activeProfileStudent.guardian}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Guardian Phone:</span> <span className="font-mono font-bold">{activeProfileStudent.parentPhone}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Guardian Email:</span> <span className="font-bold">{activeProfileStudent.parentEmail || "guardian@enotech.com"}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Emergency Contact:</span> <span className="font-mono font-bold">{activeProfileStudent.emergencyContact}</span></div>
                      <div className="flex justify-between py-1"><span className="text-slate-400">Learning Center:</span> <span className="font-bold">{activeProfileStudent.class}</span></div>
                    </div>
                  </div>

                  {/* PREDICTIVE GPA TREND LINE COMPONENT */}
                  {(() => {
                    const activeCourse = courses.find(c => c.id === activeProfileStudent.courseEnrolled);
                    if (!activeCourse) return null;

                    const courseModules = activeCourse.modules || [];
                    if (courseModules.length === 0) return null;

                    // Calculate actual completed vs predicted module grades
                    const chartPoints = courseModules.map((mod) => {
                      const modAsses = localAssessments.filter(
                        a => a.courseId === activeProfileStudent.courseEnrolled && a.moduleId === mod.id
                      );
                      
                      let completedCount = 0;
                      let scoreSum = 0;
                      let weightSum = 0;
                      
                      modAsses.forEach(ass => {
                        const score = localMarks[activeProfileStudent.id]?.[ass.id];
                        if (score !== undefined) {
                          scoreSum += score * ass.weight;
                          weightSum += ass.weight;
                          completedCount++;
                        }
                      });
                      
                      const isCompleted = completedCount > 0;
                      const averageScore = weightSum > 0 ? scoreSum / weightSum : 0;
                      
                      // Fallback grade mapping
                      let actualGpa = 0;
                      if (isCompleted) {
                        const score = averageScore;
                        if (score >= 90) actualGpa = 4.0;
                        else if (score >= 80) actualGpa = 3.0;
                        else if (score >= 70) actualGpa = 2.0;
                        else if (score >= 60) actualGpa = 1.0;
                      }
                      
                      return {
                        moduleId: mod.id,
                        title: mod.title,
                        isCompleted,
                        actualGpa,
                        actualScore: Math.round(averageScore)
                      };
                    });

                    const completedPoints = chartPoints.filter(p => p.isCompleted);
                    const avgCompletedGpa = completedPoints.length > 0 
                      ? completedPoints.reduce((sum, p) => sum + p.actualGpa, 0) / completedPoints.length
                      : 3.0; // default 3.0 fallback

                    // Compute slope for Linear Trend momentum
                    let slope = 0;
                    if (completedPoints.length >= 2) {
                      const xMean = (completedPoints.length - 1) / 2;
                      const yMean = avgCompletedGpa;
                      let num = 0;
                      let den = 0;
                      completedPoints.forEach((p, idx) => {
                        num += (idx - xMean) * (p.actualGpa - yMean);
                        den += (idx - xMean) * (idx - xMean);
                      });
                      slope = den !== 0 ? num / den : 0;
                    }

                    // Attendance rate factor
                    const studentAttendance = attendance.filter(r => r.studentId === activeProfileStudent.id);
                    const totalSessions = studentAttendance.length;
                    const presentSessions = studentAttendance.filter(r => r.status === "Present" || r.status === "Late").length;
                    const attendanceRate = totalSessions > 0 ? presentSessions / totalSessions : 0.85;

                    // Create future projection path
                    const finalPoints = chartPoints.map((p, idx) => {
                      if (p.isCompleted) {
                        return {
                          ...p,
                          predictedGpa: p.actualGpa,
                          isPredicted: false
                        };
                      } else {
                        let basePred = avgCompletedGpa;
                        if (predictionScenario === "momentum") {
                          basePred = avgCompletedGpa + slope * (idx - completedPoints.length + 1);
                        } else if (predictionScenario === "attendance") {
                          basePred = 1.0 + attendanceRate * 3.0;
                        }
                        
                        // Apply study effort modifier
                        const predictedGpa = Math.min(4.0, Math.max(0.0, basePred * effortFactor));
                        return {
                          ...p,
                          predictedGpa: parseFloat(predictedGpa.toFixed(2)),
                          isPredicted: true
                        };
                      }
                    });

                    // Add Capstone evaluation point for an extra look-ahead projection
                    const capstoneIndex = finalPoints.length;
                    let capstoneBasePred = avgCompletedGpa;
                    if (predictionScenario === "momentum") {
                      capstoneBasePred = avgCompletedGpa + slope * (capstoneIndex - completedPoints.length + 1);
                    } else if (predictionScenario === "attendance") {
                      capstoneBasePred = 1.0 + attendanceRate * 3.0;
                    }
                    const capstoneGpaVal = Math.min(4.0, Math.max(0.0, capstoneBasePred * effortFactor));

                    const displayPoints = [
                      ...finalPoints,
                      {
                        moduleId: "Capstone",
                        title: "Final Capstone Evaluation Project",
                        isCompleted: false,
                        actualGpa: 0,
                        actualScore: 0,
                        predictedGpa: parseFloat(capstoneGpaVal.toFixed(2)),
                        isPredicted: true
                      }
                    ];

                    const currentCoreGpa = completedPoints.length > 0 
                      ? completedPoints.reduce((sum, p) => sum + p.actualGpa, 0) / completedPoints.length 
                      : 0.0;
                    const estimatedFinalGpa = displayPoints.reduce((sum, p) => sum + p.predictedGpa, 0) / displayPoints.length;

                    // Honors tracking label
                    let honorsLabel = "Pass Standing";
                    let honorsBadgeColor = "bg-slate-500/10 text-slate-400 border-slate-500/20";
                    if (estimatedFinalGpa >= 3.6) {
                      honorsLabel = "First Class Honours Track";
                      honorsBadgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                    } else if (estimatedFinalGpa >= 3.0) {
                      honorsLabel = "Second Class Upper Track";
                      honorsBadgeColor = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                    } else if (estimatedFinalGpa >= 2.0) {
                      honorsLabel = "Pass Track";
                      honorsBadgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    } else {
                      honorsLabel = "Academic Warning Risk";
                      honorsBadgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                    }

                    // Render parameters for SVG
                    const chartHeight = 180;
                    const paddingLeft = 50;
                    const paddingRight = 50;
                    const paddingTop = 25;
                    const paddingBottom = 35;

                    const getX = (idx: number) => {
                      const widthAvailable = containerWidth - paddingLeft - paddingRight;
                      return paddingLeft + (idx / (displayPoints.length - 1 || 1)) * widthAvailable;
                    };

                    const getY = (gpaVal: number) => {
                      const heightAvailable = chartHeight - paddingTop - paddingBottom;
                      return chartHeight - paddingBottom - (gpaVal / 4.0) * heightAvailable;
                    };

                    // Construct confidence interval envelope points
                    const confidenceUpperPoints: string[] = [];
                    const confidenceLowerPoints: string[] = [];
                    
                    displayPoints.forEach((p, idx) => {
                      const x = getX(idx);
                      if (!p.isPredicted) {
                        confidenceUpperPoints.push(`${x},${getY(p.actualGpa)}`);
                        confidenceLowerPoints.unshift(`${x},${getY(p.actualGpa)}`);
                      } else {
                        // Upper bound: 1.15x effort projection
                        const upperGpa = Math.min(4.0, p.predictedGpa * 1.15);
                        // Lower bound: 0.8x effort projection
                        const lowerGpa = Math.max(0.0, p.predictedGpa * 0.8);
                        confidenceUpperPoints.push(`${x},${getY(upperGpa)}`);
                        confidenceLowerPoints.unshift(`${x},${getY(lowerGpa)}`);
                      }
                    });

                    const envelopePolygonString = [...confidenceUpperPoints, ...confidenceLowerPoints].join(" ");

                    return (
                      <div 
                        ref={containerRef}
                        className={`md:col-span-2 p-5 border rounded-xl shadow-xs space-y-5 ${
                          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-150"
                        }`}
                      >
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div className="space-y-1">
                            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              🔮 Predictive Academic Performance & GPA Trend
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Fitted linear trend regression forecasting future module grades based on current continuous assessment scores, attendance matrices, and custom study effort modifiers.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 uppercase">Model:</span>
                            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-805">
                              {[
                                { id: "momentum", label: "Momentum" },
                                { id: "average", label: "Balanced Mean" },
                                { id: "attendance", label: "Attendance Matrix" }
                              ].map(sc => (
                                <button
                                  key={sc.id}
                                  onClick={() => setPredictionScenario(sc.id as any)}
                                  className={`px-2 py-1 text-[8px] font-extrabold rounded-md cursor-pointer transition-all ${
                                    predictionScenario === sc.id
                                      ? "bg-cyan-500 text-slate-950 font-black shadow-xs"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {sc.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          {/* Stat A */}
                          <div className="p-3 bg-slate-950/40 border border-slate-850/60 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block">Current Core GPA</span>
                            <span className="text-lg font-black text-cyan-400 font-mono block">
                              {currentCoreGpa > 0 ? currentCoreGpa.toFixed(2) : "N/A"} GPA
                            </span>
                            <span className="text-[8px] text-slate-500 block">
                              Based on {completedPoints.length} completed modules
                            </span>
                          </div>

                          {/* Stat B */}
                          <div className="p-3 bg-slate-950/40 border border-slate-850/60 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-slate-500 uppercase block">Projected Final GPA</span>
                            <span className="text-lg font-black text-emerald-400 font-mono block">
                              {estimatedFinalGpa.toFixed(2)} GPA
                            </span>
                            <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-bold uppercase border ${honorsBadgeColor}`}>
                              {honorsLabel}
                            </span>
                          </div>

                          {/* Stat C: Study Effort Control Slider */}
                          <div className="md:col-span-2 p-3 bg-slate-950/40 border border-slate-850/60 rounded-xl space-y-2">
                            <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                              <span className="flex items-center gap-1 font-extrabold">
                                <Sliders className="w-3.5 h-3.5 text-orange-400" />
                                Interactive Study Effort Modifier:
                              </span>
                              <span className="font-mono text-cyan-300 text-[10px] font-bold">
                                {Math.round(effortFactor * 100)}% Effort ({effortFactor > 1.0 ? "+" : ""}{(effortFactor - 1.0).toFixed(2)} GPA)
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-bold text-slate-500">60% (Low)</span>
                              <input
                                type="range"
                                min="0.6"
                                max="1.4"
                                step="0.05"
                                value={effortFactor}
                                onChange={(e) => setEffortFactor(parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                              />
                              <span className="text-[8px] font-bold text-slate-500">140% (High)</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Responsive SVG Trend Line Canvas */}
                        <div className="relative bg-slate-950 rounded-xl border border-slate-850 p-2.5 overflow-hidden">
                          {/* Watermark Logo */}
                          <div className="absolute top-2 right-3 flex items-center gap-1 select-none pointer-events-none opacity-[0.03]">
                            <Award className="w-12 h-12 text-white" />
                          </div>

                          <svg width="100%" height={chartHeight} className="overflow-visible">
                            {/* Grids Background */}
                            {[0.0, 1.0, 2.0, 3.0, 4.0].map((gpaLevel) => (
                              <g key={gpaLevel}>
                                <line
                                  x1={paddingLeft}
                                  y1={getY(gpaLevel)}
                                  x2={containerWidth - paddingRight}
                                  y2={getY(gpaLevel)}
                                  stroke={darkMode ? "#1e293b" : "#e2e8f0"}
                                  strokeWidth="1"
                                  strokeDasharray="4 4"
                                />
                                <text
                                  x={paddingLeft - 8}
                                  y={getY(gpaLevel) + 3}
                                  textAnchor="end"
                                  className="font-mono text-[9px] font-bold fill-slate-500"
                                >
                                  {gpaLevel.toFixed(1)}
                                </text>
                              </g>
                            ))}

                            {/* Confidence envelope polygon shade */}
                            {completedPoints.length > 0 && (
                              <polygon
                                points={envelopePolygonString}
                                className="fill-cyan-500/5 stroke-none"
                              />
                            )}

                            {/* Line connecting Completed / Actual Points */}
                            {completedPoints.map((p, idx) => {
                              if (idx === 0) return null;
                              const prevP = completedPoints[idx - 1];
                              const prevX = getX(idx - 1);
                              const prevY = getY(prevP.actualGpa);
                              const currX = getX(idx);
                              const currY = getY(p.actualGpa);

                              return (
                                <line
                                  key={`solid-line-${idx}`}
                                  x1={prevX}
                                  y1={prevY}
                                  x2={currX}
                                  y2={currY}
                                  stroke="#06b6d4" // solid cyan-500
                                  strokeWidth="3.5"
                                  strokeLinecap="round"
                                />
                              );
                            })}

                            {/* Connecting dashed predictive line starting from last actual point */}
                            {displayPoints.map((p, idx) => {
                              if (idx === 0) return null;
                              const prevP = displayPoints[idx - 1];
                              const prevX = getX(idx - 1);
                              // start prediction transition smoothly from actual
                              const prevY = prevP.isCompleted ? getY(prevP.actualGpa) : getY(prevP.predictedGpa);
                              const currX = getX(idx);
                              const currY = getY(p.predictedGpa);

                              if (!p.isPredicted) return null; // handled by solid line

                              return (
                                <line
                                  key={`dashed-line-${idx}`}
                                  x1={prevX}
                                  y1={prevY}
                                  x2={currX}
                                  y2={currY}
                                  stroke="#f97316" // orange-500
                                  strokeWidth="2.5"
                                  strokeDasharray="5 4"
                                  strokeLinecap="round"
                                />
                              );
                            })}

                            {/* Vertices marker nodes & text coordinates values */}
                            {displayPoints.map((p, idx) => {
                              const x = getX(idx);
                              const y = p.isPredicted ? getY(p.predictedGpa) : getY(p.actualGpa);
                              const gpaVal = p.isPredicted ? p.predictedGpa : p.actualGpa;

                              return (
                                <g key={`vertex-${idx}`} className="group/node cursor-pointer">
                                  {/* Hover Glow Background */}
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="10"
                                    className={`opacity-0 group-hover/node:opacity-20 transition-all ${
                                      p.isPredicted ? "fill-orange-400" : "fill-cyan-400"
                                    }`}
                                  />
                                  
                                  {/* Vertex Core Node */}
                                  <circle
                                    cx={x}
                                    cy={y}
                                    r="5"
                                    className={`transition-all duration-300 stroke-2 ${
                                      darkMode ? "stroke-slate-950" : "stroke-white"
                                    } ${
                                      p.isPredicted ? "fill-orange-500" : "fill-cyan-500"
                                    }`}
                                  />

                                  {/* GPA Value Label above Node */}
                                  <text
                                    x={x}
                                    y={y - 10}
                                    textAnchor="middle"
                                    className={`font-mono text-[9px] font-black ${
                                      p.isPredicted ? "fill-orange-400" : "fill-cyan-400"
                                    }`}
                                  >
                                    {gpaVal.toFixed(1)}
                                  </text>

                                  {/* Module Name below Node */}
                                  <text
                                    x={x}
                                    y={chartHeight - 10}
                                    textAnchor="middle"
                                    className="font-mono text-[8px] font-bold fill-slate-500 uppercase tracking-tight"
                                  >
                                    {p.moduleId}
                                  </text>

                                  {/* Tooltip Overlay Indicator */}
                                  <title>
                                    {p.moduleId}: {p.title}&#10;
                                    Status: {p.isCompleted ? "Completed Grade (Actual)" : "Estimated Future Forecast"}&#10;
                                    Academic Score: {p.isCompleted ? `${p.actualScore}% Grade` : "Estimated via Model"}&#10;
                                    Calculated GPA: {gpaVal.toFixed(2)} GPA
                                  </title>
                                </g>
                              );
                            })}
                          </svg>
                        </div>

                        {/* Explanatory Study Plan Advisory */}
                        <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/20 rounded-xl flex items-start gap-2 text-[10px] text-cyan-400/90 leading-relaxed">
                          <div className="p-1 bg-cyan-500/10 rounded">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                          <div>
                            <strong className="text-white block font-bold mb-0.5">EnoTech AI-driven Coach Advisory</strong>
                            {estimatedFinalGpa >= 3.6 ? (
                              <span>
                                Excellent Academic Path! Based on current assessments, <strong>{activeProfileStudent.fullName}</strong> is firmly positioned on a high honors track. Consistent attendance ({Math.round(attendanceRate * 100)}%) and maintaining the current <strong>{predictionScenario}</strong> velocity will secure a first-class final diploma certification.
                              </span>
                            ) : estimatedFinalGpa >= 3.0 ? (
                              <span>
                                Strong Standing. The student is projected to graduate with second-class upper standing. To elevate the track to first-class (3.6+ GPA), encourage increasing homework preparation effort to <strong>115%</strong> using the slider above, and review the labs under modules that have CAT marks lower than 85%.
                              </span>
                            ) : (
                              <span className="text-amber-400">
                                Warning: Low performance projections detected. <strong>{activeProfileStudent.fullName}</strong>'s current GPA estimates fall below standard honors levels. We advise immediate supervisor-parent interventions. Sliding the effort modifier to high levels shows that an increased study commitment of 120% can restore the projected standing back to Upper Second Class.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* TAB 2: TRANSCRIPTS SYSTEM */}
              {profileTab === "transcripts" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">Official Student Transcripts</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Generated on-demand. Approved by the EnoTech Academy board of examiners.</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        alert("Academic ledger records fetched. New official transcript generated and added to lists!");
                      }}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" /> Generate New Transcript
                    </button>
                  </div>

                  {/* MODULE PERFORMANCE VISUALIZATION AND ANALYSIS */}
                  {(() => {
                    const activeCourse = courses.find(c => c.id === activeProfileStudent.courseEnrolled);
                    if (!activeCourse) return null;

                    const courseModules = activeCourse.modules || [];
                    if (courseModules.length === 0) return null;

                    // Calculate module grades
                    const performanceData = courseModules.map((mod) => {
                      const modAsses = localAssessments.filter(
                        a => a.courseId === activeProfileStudent.courseEnrolled && a.moduleId === mod.id
                      );
                      
                      let scoreSum = 0;
                      let weightSum = 0;
                      let completedCount = 0;
                      
                      modAsses.forEach(ass => {
                        const score = localMarks[activeProfileStudent.id]?.[ass.id];
                        if (score !== undefined) {
                          scoreSum += score * ass.weight;
                          weightSum += ass.weight;
                          completedCount++;
                        }
                      });
                      
                      // Fallback stable procedural calculation
                      let finalScore = 0;
                      if (completedCount > 0 && weightSum > 0) {
                        finalScore = scoreSum / weightSum;
                      } else {
                        const charSum = activeProfileStudent.fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        const modSum = mod.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                        finalScore = 70 + ((charSum + modSum) % 26);
                      }
                      
                      return {
                        id: mod.id,
                        title: mod.title,
                        score: Math.round(finalScore)
                      };
                    });

                    // Sort to find strengths and weaknesses
                    const sortedData = [...performanceData].sort((a, b) => b.score - a.score);
                    const topStrength = sortedData[0];
                    const bottomWeakness = sortedData[sortedData.length - 1];

                    // Render parameters for SVG
                    const chartHeight = 220;
                    const paddingLeft = 45;
                    const paddingRight = 20;
                    const paddingTop = 25;
                    const paddingBottom = 40;

                    const getX = (idx: number) => {
                      const widthAvailable = transcriptChartWidth - paddingLeft - paddingRight;
                      return paddingLeft + (idx / (performanceData.length - 1 || 1)) * widthAvailable;
                    };

                    const getBarX = (idx: number) => {
                      const widthAvailable = transcriptChartWidth - paddingLeft - paddingRight;
                      const segmentWidth = widthAvailable / performanceData.length;
                      return paddingLeft + idx * segmentWidth + segmentWidth / 2;
                    };

                    const getY = (score: number) => {
                      const heightAvailable = chartHeight - paddingTop - paddingBottom;
                      return chartHeight - paddingBottom - (score / 100) * heightAvailable;
                    };

                    const segmentWidth = (transcriptChartWidth - paddingLeft - paddingRight) / performanceData.length;
                    const barWidth = Math.max(15, Math.min(45, segmentWidth * 0.45));

                    return (
                      <div 
                        ref={transcriptChartRef}
                        className={`p-5 border rounded-xl shadow-xs space-y-4 ${
                          darkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-150"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                              <BarChart2 className="w-4 h-4 text-cyan-400" />
                              📊 Student Performance Profile Across Modules
                            </h4>
                            <p className="text-[10px] text-slate-400">
                              Module-by-module performance matrix highlighting core cognitive strengths and targeted support areas.
                            </p>
                          </div>
                          
                          <div className="flex gap-2 text-[9px] font-bold">
                            <span className="flex items-center gap-1 text-emerald-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Excellent (85%+)
                            </span>
                            <span className="flex items-center gap-1 text-cyan-400">
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Proficient (70%+)
                            </span>
                            <span className="flex items-center gap-1 text-amber-500">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Needs Review (&lt;70%)
                            </span>
                          </div>
                        </div>

                        {/* Chart Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                          {/* Left: SVG Bar & Trend Chart Overlay */}
                          <div className="lg:col-span-2 relative bg-slate-950 rounded-xl border border-slate-850 p-2.5 overflow-hidden">
                            <svg width="100%" height={chartHeight} className="overflow-visible">
                              {/* Horizontal Grid Lines */}
                              {[0, 25, 50, 75, 100].map((gridScore) => (
                                <g key={gridScore}>
                                  <line
                                    x1={paddingLeft}
                                    y1={getY(gridScore)}
                                    x2={transcriptChartWidth - paddingRight}
                                    y2={getY(gridScore)}
                                    stroke={darkMode ? "#1e293b" : "#e2e8f0"}
                                    strokeWidth="1"
                                    strokeDasharray="3 3"
                                  />
                                  <text
                                    x={paddingLeft - 8}
                                    y={getY(gridScore) + 3}
                                    textAnchor="end"
                                    className="font-mono text-[9px] font-bold fill-slate-500"
                                  >
                                    {gridScore}%
                                  </text>
                                </g>
                              ))}

                              {/* Bars with Custom Gradient Color Fill */}
                              {performanceData.map((data, idx) => {
                                const x = getBarX(idx) - barWidth / 2;
                                const y = getY(data.score);
                                const h = getY(0) - y;
                                
                                // Color selection
                                let barColor = "fill-cyan-500/85 stroke-cyan-400";
                                if (data.score >= 85) {
                                  barColor = "fill-emerald-500/85 stroke-emerald-400";
                                } else if (data.score < 70) {
                                  barColor = "fill-amber-500/85 stroke-amber-400";
                                }

                                return (
                                  <g key={`bar-${idx}`} className="group/bar cursor-pointer">
                                    {/* Background Hover Highlight */}
                                    <rect
                                      x={getBarX(idx) - segmentWidth / 2 + 2}
                                      y={paddingTop}
                                      width={segmentWidth - 4}
                                      height={chartHeight - paddingTop - paddingBottom}
                                      className="fill-white/[0.02] opacity-0 group-hover/bar:opacity-100 transition-all"
                                    />

                                    {/* The Bar */}
                                    <rect
                                      x={x}
                                      y={y}
                                      width={barWidth}
                                      height={h}
                                      rx="3"
                                      className={`${barColor} transition-all duration-500 hover:brightness-125 stroke`}
                                    />

                                    {/* Score Label on top of Bar */}
                                    <text
                                      x={getBarX(idx)}
                                      y={y - 6}
                                      textAnchor="middle"
                                      className="font-mono text-[10px] font-black fill-slate-300"
                                    >
                                      {data.score}%
                                    </text>

                                    {/* Tooltip */}
                                    <title>
                                      {data.id}: {data.title}&#10;
                                      Performance Score: {data.score}%&#10;
                                      Status: {data.score >= 85 ? "Excellent Mastery" : data.score >= 70 ? "Proficient Standing" : "Needs Review"}
                                    </title>
                                  </g>
                                );
                              })}

                              {/* Trend Overlay Line */}
                              {performanceData.map((data, idx) => {
                                if (idx === 0) return null;
                                const prevData = performanceData[idx - 1];
                                const prevX = getBarX(idx - 1);
                                const prevY = getY(prevData.score);
                                const currX = getBarX(idx);
                                const currY = getY(data.score);

                                return (
                                  <line
                                    key={`trend-line-${idx}`}
                                    x1={prevX}
                                    y1={prevY}
                                    x2={currX}
                                    y2={currY}
                                    stroke="#ec4899" // hot pink trend overlay
                                    strokeWidth="2"
                                    strokeDasharray="4 3"
                                    className="opacity-70 pointer-events-none"
                                  />
                                );
                              })}

                              {/* Trend overlay vertices */}
                              {performanceData.map((data, idx) => {
                                const x = getBarX(idx);
                                const y = getY(data.score);

                                return (
                                  <circle
                                    key={`trend-vertex-${idx}`}
                                    cx={x}
                                    cy={y}
                                    r="3"
                                    className="fill-pink-500 stroke-slate-950 stroke"
                                    pointerEvents="none"
                                  />
                                );
                              })}

                              {/* Bottom X-Axis Module Code Labels */}
                              {performanceData.map((data, idx) => (
                                <text
                                  key={`label-${idx}`}
                                  x={getBarX(idx)}
                                  y={chartHeight - 12}
                                  textAnchor="middle"
                                  className="font-mono text-[9px] font-bold fill-slate-400 uppercase"
                                >
                                  {data.id}
                                </text>
                              ))}
                            </svg>
                          </div>

                          {/* Right: Cognitive Analysis, Strengths & Weaknesses */}
                          <div className="space-y-3.5 flex flex-col justify-between">
                            {/* Strength Box */}
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-1.5">
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-extrabold tracking-wider">Top Academic Strength</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-white block">{topStrength?.title}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Module {topStrength?.id} • Grade: <strong className="text-emerald-400 font-extrabold">{topStrength?.score}% Mastery</strong>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300/90 leading-relaxed">
                                Demonstrates outstanding analytical abilities, high practical precision, and deep conceptual command in this topic.
                              </p>
                            </div>

                            {/* Weakness Box */}
                            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5">
                              <div className="flex items-center gap-1.5 text-amber-400">
                                <TrendingDown className="w-4 h-4" />
                                <span className="text-[10px] uppercase font-extrabold tracking-wider">Key Growth Opportunity</span>
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-xs font-black text-white block">{bottomWeakness?.title}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Module {bottomWeakness?.id} • Grade: <strong className="text-amber-400 font-extrabold">{bottomWeakness?.score}% Grade</strong>
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-300/90 leading-relaxed">
                                Recommend targeted tutorial exercises, increased lab review loops, and focused focus logs to reinforce foundations.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Transcripts listing */}
                  <div className="space-y-3">
                    {[
                      {
                        id: "TR-2026-001",
                        serialNumber: `ETA/TR/2026/${activeProfileStudent.id.substring(activeProfileStudent.id.length - 4)}`,
                        dateCreated: "June 25, 2026",
                        semester: "First Semester Evaluation",
                        averageGrade: "A (91.8%)",
                        gpa: "3.92",
                        status: "Official Approved"
                      },
                      {
                        id: "TR-2026-002",
                        serialNumber: `ETA/TR/2026/MID-${activeProfileStudent.id.substring(activeProfileStudent.id.length - 4)}`,
                        dateCreated: "July 01, 2026",
                        semester: "Mid-Term Project Review",
                        averageGrade: "A- (88.5%)",
                        gpa: "3.75",
                        status: "Draft Review"
                      }
                    ].map((tr, index) => {
                      const activeCourse = courses.find(c => c.id === activeProfileStudent.courseEnrolled);
                      return (
                        <div 
                          key={index} 
                          className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/25 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-cyan-400">{tr.serialNumber}</span>
                              <span className={`px-2 py-0.5 border rounded text-[9px] uppercase font-bold tracking-wider ${
                                tr.status.includes("Approved") 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}>{tr.status}</span>
                            </div>
                            
                            <div className="text-[11px] text-slate-300">
                              Course Curriculum: <span className="font-semibold text-white">{activeCourse?.name || "Technology Core Syllabus"}</span>
                            </div>
                            
                            <div className="text-[10px] text-slate-500 font-mono">
                              Date Generated: {tr.dateCreated} • Evaluation Cycle: {tr.semester}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-right">
                              <span className="text-[9px] text-slate-500 uppercase font-bold block">Summary GPA</span>
                              <span className="font-extrabold text-cyan-400 font-mono">{tr.averageGrade} (GPA {tr.gpa})</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setShowActiveTranscript({ ...tr, student: activeProfileStudent, course: activeCourse })}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-blue-400" /> View
                              </button>
                              
                              <button
                                onClick={() => {
                                  alert(`Downloading PDF package for transcript ${tr.serialNumber} successfully...`);
                                }}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer"
                                title="Download Offline"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setSendingEmailId(tr.id);
                                  setTimeout(() => {
                                    setSendingEmailId(null);
                                    alert(`Academic statement emailed to parent [${activeProfileStudent.parentEmail || "guardian@enotech.com"}] successfully!`);
                                  }, 1000);
                                }}
                                disabled={sendingEmailId === tr.id}
                                className="px-3 py-1.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              >
                                {sendingEmailId === tr.id ? (
                                  <>
                                    <Clock className="w-3 h-3 animate-spin" /> Dispatching...
                                  </>
                                ) : (
                                  <>
                                    <Mail className="w-3.5 h-3.5" /> Email Parents
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ATTENDANCE HISTORY */}
              {profileTab === "attendance" && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Present Classes</span>
                      <span className="text-xl font-black mt-1 block">18 Sessions</span>
                    </div>
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Late Entries</span>
                      <span className="text-xl font-black mt-1 block">2 Sessions</span>
                    </div>
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Absent Days</span>
                      <span className="text-xl font-black mt-1 block">1 Session</span>
                    </div>
                  </div>

                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Session Date</th>
                          <th className="p-3">Course / Classroom</th>
                          <th className="p-3">Marked Status</th>
                          <th className="p-3">Verified By</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {attendance.filter(r => r.studentId === activeProfileStudent.id).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-900/30">
                            <td className="p-3 font-mono font-bold">{r.date}</td>
                            <td className="p-3">{activeProfileStudent.class}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                r.status === "Present" ? "bg-emerald-500/10 text-emerald-400" :
                                r.status === "Late" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                              }`}>{r.status}</span>
                            </td>
                            <td className="p-3">{r.markedBy}</td>
                          </tr>
                        ))}
                        {attendance.filter(r => r.studentId === activeProfileStudent.id).length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-slate-500 italic">No attendance records submitted for this session in core databases.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: FINANCE STATEMENT */}
              {profileTab === "finance" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Outstanding balance</span>
                      <span className="text-xl font-black text-orange-500 block">
                        KSh {Math.max(0, (courses.find(c => c.id === activeProfileStudent.courseEnrolled)?.totalFees || 10000) - transactions
                          .filter(t => t.studentId === activeProfileStudent.id && t.type === "Income")
                          .reduce((s, t) => s + t.amount, 0)).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Fees Invoiced</span>
                      <span className="font-extrabold text-slate-200">
                        KSh {courses.find(c => c.id === activeProfileStudent.courseEnrolled)?.totalFees.toLocaleString() || "10,000"}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Statement Payments Ledger</h4>
                  
                  <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-bold uppercase">
                        <tr>
                          <th className="p-3">Transaction ID</th>
                          <th className="p-3">Reference / Code</th>
                          <th className="p-3">Description</th>
                          <th className="p-3">Payment Mode</th>
                          <th className="p-3 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {transactions.filter(t => t.studentId === activeProfileStudent.id).map((t, i) => (
                          <tr key={i} className="hover:bg-slate-900/30">
                            <td className="p-3 font-mono font-bold text-slate-500">{t.id}</td>
                            <td className="p-3 font-mono font-bold text-cyan-400">{t.referenceNo}</td>
                            <td className="p-3">{t.description}</td>
                            <td className="p-3">{t.paymentMethod}</td>
                            <td className="p-3 text-right font-black text-emerald-500">KSh {t.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: DOCUMENTS */}
              {profileTab === "documents" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Academic Dossier Documents</h4>
                      <div className="space-y-2">
                        {[
                          { name: "National ID copy.pdf", size: "1.4 MB", date: "2026-06-01" },
                          { name: "Secondary KCSE certificate.pdf", size: "2.1 MB", date: "2026-06-01" },
                          { name: "EnoTech Admission Letter.pdf", size: "450 KB", date: "2026-06-02" }
                        ].map((doc, idx) => (
                          <div key={idx} className="p-2.5 bg-slate-950/60 rounded border border-slate-800 flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white block">{doc.name}</span>
                              <span className="text-[10px] text-slate-500 font-mono">Uploaded: {doc.date} • {doc.size}</span>
                            </div>
                            <button onClick={() => alert("Downloading digital asset...")} className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4">
                        <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/40 rounded-xl p-4 text-center cursor-pointer block hover:bg-slate-900/10">
                          <Upload className="w-5 h-5 text-slate-500 mx-auto mb-1.5" />
                          <span className="text-xs font-bold block">Upload new scanned student document</span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">PDF or PNG files under 10 MB</span>
                          <input type="file" className="hidden" onChange={() => alert("File attachment uploaded to parent server ledger!")} />
                        </label>
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Principal Notes & Remarks</h4>
                      <textarea
                        rows={4}
                        placeholder="Type confidential supervisor remarks concerning attendance, behavioral progress, or fee negotiation agreements..."
                        className="w-full bg-slate-950 text-xs border border-slate-800 focus:border-cyan-500 rounded-lg p-2.5 text-white focus:outline-none focus:ring-0"
                      />
                      <button
                        onClick={() => alert("Academic supervisor remarks saved securely.")}
                        className="mt-3.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Save Notes Ledger
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Close Button footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setActiveProfileStudent(null)}
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Close Portfolio
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==============================
          OFFICIAL TRANSCRIPT PRINT OVERLAY
          ============================== */}
      {showActiveTranscript && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-8 space-y-6 shadow-2xl border border-slate-200">
            
            {/* Action panel header */}
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase">OFFICIAL TRANSCRIPT RECORD</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Transcript
                </button>
                <button
                  onClick={() => setShowActiveTranscript(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Transcript Printable Template */}
            <div className="border-4 border-slate-900 p-6 space-y-6 bg-stone-50/50">
              
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-xl font-extrabold tracking-widest uppercase text-slate-900">EnoTech Academy</h2>
                <p className="text-[10px] tracking-wide text-slate-600 font-bold">INNOVATIVE COMPUTER PACKAGES, PROGRAMMING & LAB NETWORKS</p>
                <p className="text-[9px] text-slate-500 font-mono mt-1">
                  Founder & Supervisor: Enock Omato • Registered Digital Educational Institution
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-slate-300 pb-4">
                <div className="space-y-1">
                  <div><span className="text-slate-500 font-bold">STUDENT NAME:</span> <span className="font-extrabold uppercase">{showActiveTranscript.student.fullName}</span></div>
                  <div><span className="text-slate-500 font-bold">ADMISSION NO:</span> <span className="font-mono font-bold">{showActiveTranscript.student.admissionNo}</span></div>
                  <div><span className="text-slate-500 font-bold">NATIONAL ID:</span> <span className="font-mono">{showActiveTranscript.student.nationalId}</span></div>
                  <div><span className="text-slate-500 font-bold">LEARNING MODE:</span> <span className="font-bold">{showActiveTranscript.student.learningMode}</span></div>
                </div>
                <div className="space-y-1 text-right">
                  <div><span className="text-slate-500 font-bold">TRANSCRIPT NO:</span> <span className="font-mono font-extrabold text-blue-800">{showActiveTranscript.serialNumber}</span></div>
                  <div><span className="text-slate-500 font-bold">REGISTERED COURSE:</span> <span className="font-bold">{showActiveTranscript.course?.name || "Syllabus Track"}</span></div>
                  <div><span className="text-slate-500 font-bold">TERM DURATION:</span> <span>{showActiveTranscript.semester}</span></div>
                  <div><span className="text-slate-500 font-bold">OFFICIAL GPA:</span> <span className="font-mono font-extrabold text-cyan-600">{showActiveTranscript.gpa}</span></div>
                </div>
              </div>

              {/* Modules List Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 tracking-wider uppercase border-b border-slate-900 pb-1">Academic Performance Module Matrix</h4>
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                      <th className="p-2 border border-slate-300">Code</th>
                      <th className="p-2 border border-slate-300">Module Topic / Description</th>
                      <th className="p-2 border border-slate-300 text-center">Credit Hours</th>
                      <th className="p-2 border border-slate-300 text-center">Score %</th>
                      <th className="p-2 border border-slate-300 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showActiveTranscript.course?.modules?.map((mod: any, i: number) => {
                      const grades = [95, 87, 92, 94];
                      const score = grades[i % grades.length];
                      let letter = "A";
                      if (score < 90) letter = "B+";
                      if (score < 80) letter = "B";

                      return (
                        <tr key={i} className="hover:bg-slate-100/50">
                          <td className="p-2 border border-slate-300 font-mono font-bold text-slate-700">{mod.id}</td>
                          <td className="p-2 border border-slate-300 font-semibold">{mod.title}</td>
                          <td className="p-2 border border-slate-300 text-center font-mono">4.0 Hrs</td>
                          <td className="p-2 border border-slate-300 text-center font-mono font-bold">{score}%</td>
                          <td className="p-2 border border-slate-300 text-center font-mono font-extrabold text-cyan-700">{letter}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Signatures */}
              <div className="pt-6 grid grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <div className="w-20 h-20 bg-slate-100 border border-slate-300 flex items-center justify-center rounded">
                    <div className="text-center font-mono text-[8px] text-slate-500 p-1">
                      <span className="font-bold text-slate-950 uppercase block mb-1">SCAN VERIFY</span>
                      <QrCode className="w-10 h-10 text-slate-900 mx-auto" />
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block">Unique QR Verification Registry code attached</span>
                </div>

                <div className="text-right space-y-1">
                  <span className="font-serif italic text-sm block text-blue-900 font-bold">Enock Omato</span>
                  <div className="border-t border-slate-500 pt-1">
                    <span className="text-[10px] font-bold text-slate-800 uppercase block">Enock Omato</span>
                    <span className="text-[9px] text-slate-500 block">Principal Supervisor, EnoTech Academy</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Print panel footer */}
            <div className="flex justify-between items-center text-[11px] text-slate-500 border-t pt-4 no-print">
              <span>Verification Address: https://enotech.academy/verify</span>
              <button
                onClick={() => setShowActiveTranscript(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

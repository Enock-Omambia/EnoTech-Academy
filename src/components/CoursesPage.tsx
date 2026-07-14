import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Clock,
  DollarSign,
  Users,
  Search,
  CheckCircle,
  X,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Download,
  Video,
  ExternalLink,
  Edit,
  Archive,
  BarChart,
  Eye,
  Info,
  FileDown,
  Sparkles
} from "lucide-react";
import { Course, Student } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface CoursesPageProps {
  courses: Course[];
  students: Student[];
  darkMode: boolean;
  onAddCourse: (course: Course) => void;
  onArchiveCourse: (id: string) => void;
  onLaunchLMS?: (course: Course) => void;
  onMassInjectUniversityLibrary?: () => void;
}

export default function CoursesPage({
  courses,
  students,
  darkMode,
  onAddCourse,
  onArchiveCourse,
  onLaunchLMS,
  onMassInjectUniversityLibrary
}: CoursesPageProps) {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailTab, setDetailTab] = useState<"syllabus" | "exams" | "assignments" | "analytics">("syllabus");

  // Create course local form state
  const [newCourse, setNewCourse] = useState({
    id: "",
    name: "",
    duration: "6 Weeks",
    totalFees: 12000,
    instructorName: "Enock Omato",
    description: "",
    modules: [] as { id: string; title: string; duration: string }[]
  });

  const [tempModule, setTempModule] = useState({ id: "MOD-1", title: "", duration: "1 Week" });

  const handleAddTempModule = () => {
    if (!tempModule.title) return;
    setNewCourse(prev => ({
      ...prev,
      modules: [...prev.modules, { ...tempModule }]
    }));
    // Auto increment mod index
    setTempModule({
      id: `MOD-${newCourse.modules.length + 2}`,
      title: "",
      duration: "1 Week"
    });
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.id || !newCourse.name) {
      alert("Please fulfill ID and Name fields.");
      return;
    }

    const created: Course = {
      id: newCourse.id,
      name: newCourse.name,
      duration: newCourse.duration,
      description: newCourse.description || "Comprehensive hands-on computing curriculum module.",
      category: "Programming",
      durationWeeks: parseInt(newCourse.duration) || 6,
      totalFees: Number(newCourse.totalFees),
      instructorName: newCourse.instructorName,
      modules: newCourse.modules.length > 0 ? newCourse.modules.map((m: any) => ({ ...m, lessons: m.lessons || [] })) : [
        { id: "MOD-1", title: "Fundamentals and Orientation", lessons: [] },
        { id: "MOD-2", title: "Core Programming Structures", lessons: [] }
      ]
    };

    onAddCourse(created);
    setShowAddCourseModal(false);
    // Reset form
    setNewCourse({
      id: "",
      name: "",
      duration: "6 Weeks",
      totalFees: 12000,
      instructorName: "Enock Omato",
      description: "",
      modules: []
    });
    alert(`Course ${created.name} successfully registered in EnoTech academic records!`);
  };

  // Filtered Course catalog
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.instructorName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Course ID", "Course Name", "Category", "Duration (Weeks)", "Total Fees", "Instructor Name", "Description"];
    const keys = ["id", "name", "category", "durationWeeks", "totalFees", "instructorName", "description"];
    exportToCSV(filteredCourses, "courses_catalog", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["Course ID", "Course Name", "Category", "Duration (Weeks)", "Total Fees", "Instructor Name"];
    const keys = ["id", "name", "category", "durationWeeks", "totalFees", "instructorName"];
    exportToPDF("EnoTech Academy Course Catalog Syllabus", headers, keys, filteredCourses);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Course Syllabus & Curriculum Builder</h2>
          <p className="text-xs text-slate-400">Review structured academic computer modules, lesson guides, fees, assignments, and offline learning downloads.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onMassInjectUniversityLibrary && (
            <button
              onClick={() => {
                onMassInjectUniversityLibrary();
                alert("Successfully mass-injected 27 university-level courses! The course state and database are fully synchronized.");
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /> Mass-Inject 27 Univ Courses
            </button>
          )}

          <button
            onClick={() => setShowAddCourseModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Course
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
        </div>
      </div>

      {/* Course metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Catalog Tracks</span>
          <span className="text-2xl font-black mt-1 block">{courses.length} Courses</span>
          <span className="text-[9px] text-slate-500 block mt-1">Structured tech syllabi</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Enrollment Volume</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{students.length} Registered</span>
          <span className="text-[9px] text-slate-500 block mt-1">Active student nodes</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Average Fee Scale</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">
            KSh {(courses.reduce((sum, c) => sum + c.totalFees, 0) / (courses.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Per certification track</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Offline Lessons Pack</span>
          <span className="text-2xl font-black text-orange-400 mt-1 block">24 Videos</span>
          <span className="text-[9px] text-slate-500 block mt-1">Buffered for offline study</span>
        </div>
      </div>

      {/* Search Input Filter */}
      <div className={`p-4 border rounded-xl shadow-xs ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search academic tracks by Course Name, ID, or Overseeing Instructor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-lg bg-transparent focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Courses Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const studentCount = students.filter(s => s.courseEnrolled === course.id).length;
          return (
            <div
              key={course.id}
              className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all flex flex-col justify-between ${
                darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
              }`}
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-400 uppercase">{course.id}</span>
                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">{course.name}</h3>
                  </div>
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">{course.duration}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-400">Head Instructor:</span> <span className="font-bold text-white">{course.instructorName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Enrolled Pupils:</span> <span className="font-extrabold text-cyan-400">{studentCount} Students</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Syllabus Modules:</span> <span className="font-semibold text-orange-400">{course.modules?.length || 0} Modules</span></div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-xs">
                <span className="font-black text-emerald-500">KSh {course.totalFees.toLocaleString()}</span>
                
                <div className="flex gap-1.5">
                  {onLaunchLMS && (
                    <button
                      onClick={() => onLaunchLMS(course)}
                      className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> Open Course
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setDetailTab("syllabus");
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" /> Modules
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Archive curriculum course ${course.name}? Students registered in this track will remain on file, but enrollment will freeze.`)) {
                        onArchiveCourse(course.id);
                      }
                    }}
                    className="p-1.5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-500 rounded transition-colors cursor-pointer"
                    title="Archive Course"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================
          SYLLABUS MODULES & DETAILS DRAWER
          ==================================== */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className={`relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border ${
            darkMode ? "bg-[#0c1220] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-6">
              {/* Drawer Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">{selectedCourse.name} Academic Dossier</h3>
                    <p className="text-[11px] text-slate-400">Manage learning modules, offline-syncable videos, class assignments, and grading metrics.</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onLaunchLMS && (
                    <button
                      onClick={() => {
                        onLaunchLMS(selectedCourse);
                        setSelectedCourse(null);
                      }}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" /> Launch LMS Player
                    </button>
                  )}
                  <button onClick={() => setSelectedCourse(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sub-Tabs Selector */}
              <div className="flex border-b border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none">
                {[
                  { id: "syllabus", label: "Syllabus Curriculum Modules", icon: Layers },
                  { id: "assignments", label: "Module Homework Tasks", icon: FileText },
                  { id: "exams", label: "Evaluations & Exams", icon: Calendar },
                  { id: "analytics", label: "Active Student Enrollment", icon: BarChart }
                ].map((tb) => {
                  const Icon = tb.icon;
                  return (
                    <button
                      key={tb.id}
                      onClick={() => setDetailTab(tb.id as any)}
                      className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                        detailTab === tb.id ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tb.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: SYLLABUS LESSONS DIRECTORY */}
              {detailTab === "syllabus" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="font-extrabold text-slate-200 block">Offline Video Buffers</span>
                      <p className="text-[10px] text-slate-400">Lessons have offline sync configurations for remote students lacking reliable internet.</p>
                    </div>

                    <button
                      onClick={() => alert("Synchronizing all modules to local IndexedDB/localStorage storage context. Buffering complete!")}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Sync Course Offline
                    </button>
                  </div>

                  {/* Modules Accordion list */}
                  <div className="space-y-3">
                    {selectedCourse.modules?.map((mod, i) => (
                      <div key={mod.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase">{mod.id}</span>
                            <h4 className="text-xs font-extrabold text-slate-100">{mod.title}</h4>
                          </div>

                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-mono font-bold">{mod.duration}</span>
                        </div>

                        {/* Lessons within this module */}
                        <div className="divide-y divide-slate-900 border-t border-slate-900 pt-2 text-xs space-y-1.5">
                          <div className="flex justify-between items-center py-1.5">
                            <div className="flex items-center gap-2">
                              <Video className="w-3.5 h-3.5 text-orange-400" />
                              <span className="font-semibold text-slate-300">Lesson 1: Environmental Setup & Prerequisites</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded">Offline watchable</span>
                              <button onClick={() => alert("Downloading lecture MP4 video...")} className="p-1 hover:bg-slate-800 rounded" title="Download Offline watch"><Download className="w-3 h-3 text-slate-400" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center py-1.5">
                            <div className="flex items-center gap-2">
                              <Video className="w-3.5 h-3.5 text-orange-400" />
                              <span className="font-semibold text-slate-300">Lesson 2: Core Variables and Operational Statements</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded">Offline watchable</span>
                              <button onClick={() => alert("Downloading lecture MP4 video...")} className="p-1 hover:bg-slate-800 rounded" title="Download Offline watch"><Download className="w-3 h-3 text-slate-400" /></button>
                            </div>
                          </div>

                          <div className="flex justify-between items-center py-1.5">
                            <div className="flex items-center gap-2">
                              <Video className="w-3.5 h-3.5 text-orange-400" />
                              <span className="font-semibold text-slate-300">Lesson 3: Lab Exercise Sandbox 1 (Mandatory Lab)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold rounded">Online Connection Needed</span>
                              <button onClick={() => alert("Starting active sandbox workspace in cloud containers...")} className="p-1 hover:bg-slate-800 rounded" title="Open Virtual Lab Workspace"><ExternalLink className="w-3 h-3 text-slate-400" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: COURSE HOMEWORK TASKS */}
              {detailTab === "assignments" && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px]">Syllabus Assignments Assigned</span>
                    <button onClick={() => alert("Direct allocation of assignment statement to students initiated")} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold">New homework assignment</button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { title: "Lab Sandbox 1: Basic Operational Loop Control", maxPoints: 100, deadline: "July 12, 2026", status: "Active Intake" },
                      { title: "System Audit Checklist 2", maxPoints: 50, deadline: "July 24, 2026", status: "Active Intake" }
                    ].map((asm, i) => (
                      <div key={i} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white block">{asm.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">Max Grade Score: {asm.maxPoints} pts • Intake Deadline: {asm.deadline}</span>
                        </div>

                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold text-[9px] uppercase">{asm.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EVALUATIONS & EXAMS */}
              {detailTab === "exams" && (
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="font-bold text-orange-400 uppercase tracking-wider text-[11px]">Certification Exams & Tests</span>
                    <button onClick={() => alert("Creating a new exam module")} className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[10px] font-bold">New Exam module</button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { code: "EX-101", title: "Theoretical Core Certification Exam", duration: "2 Hours", passMark: "75%", status: "Scheduled" },
                      { code: "EX-102", title: "Comprehensive Lab Sandbox Assessment", duration: "3 Hours", passMark: "80%", status: "Scheduled" }
                    ].map((ex, i) => (
                      <div key={i} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex justify-between items-center font-mono">
                        <div>
                          <span className="text-[10px] text-cyan-400 font-bold block">{ex.code}</span>
                          <span className="font-bold text-slate-200 block font-sans">{ex.title}</span>
                          <span className="text-[10px] text-slate-500">Duration: {ex.duration} • Pass Threshold: {ex.passMark}</span>
                        </div>

                        <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-bold uppercase text-[9px] font-sans">{ex.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ENROLLMENT ANALYTICS */}
              {detailTab === "analytics" && (
                <div className="space-y-4 text-xs">
                  <h5 className="font-extrabold text-cyan-400 uppercase tracking-wide">Course Pupil Density Growth</h5>
                  
                  <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2">
                    <p className="text-slate-400">Total pupil registrations on ledger: <strong className="text-white font-black">{students.filter(s => s.courseEnrolled === selectedCourse.id).length} Students</strong></p>
                    
                    {/* Visual bar representations for statistics */}
                    <div className="space-y-3.5 pt-3">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Physical Classroom Seats filled:</span>
                          <span className="font-bold text-white">{students.filter(s => s.courseEnrolled === selectedCourse.id && s.learningMode === "Physical").length} / 12 Seats</span>
                        </div>
                        <div className="bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full rounded-full" style={{ width: `${(students.filter(s => s.courseEnrolled === selectedCourse.id && s.learningMode === "Physical").length / 12) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                          <span>Online Remote Nodes connected:</span>
                          <span className="font-bold text-white">{students.filter(s => s.courseEnrolled === selectedCourse.id && s.learningMode === "Online").length} Active</span>
                        </div>
                        <div className="bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setSelectedCourse(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer">
                  Close Dossier
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ====================================
          CREATE NEW COURSE MODAL REGISTER
          ==================================== */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${
            darkMode ? "bg-[#0c1220] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white">Create New Curriculum Course</h3>
                <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateCourseSubmit} className="space-y-4 text-xs text-slate-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Unique Course ID Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. C-WEB-DEV"
                      value={newCourse.id}
                      onChange={(e) => setNewCourse({...newCourse, id: e.target.value.toUpperCase()})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Course Title Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Full-Stack Web Development"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Course Term Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 Weeks"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Tuition Fee Scale Cost (KSh)</label>
                    <input
                      type="number"
                      placeholder="12000"
                      value={newCourse.totalFees}
                      onChange={(e) => setNewCourse({...newCourse, totalFees: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-400 mb-1">Oversight Instructor Name</label>
                    <input
                      type="text"
                      placeholder="Enock Omato"
                      value={newCourse.instructorName}
                      onChange={(e) => setNewCourse({...newCourse, instructorName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Modules Editor Section */}
                <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                  <span className="font-bold text-white block">Syllabus Modules Assembly Builder</span>
                  
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Add custom module title, e.g. Introduction to CSS Grid"
                      value={tempModule.title}
                      onChange={(e) => setTempModule({...tempModule, title: e.target.value})}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddTempModule}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg font-bold"
                    >
                      Add Module
                    </button>
                  </div>

                  {/* Configured Modules preview */}
                  <div className="space-y-1 pt-1.5">
                    {newCourse.modules.map((m, idx) => (
                      <div key={idx} className="p-2 bg-slate-900/60 border border-slate-850 rounded flex justify-between items-center text-[10px]">
                        <span className="font-bold text-white">{m.id}: {m.title}</span>
                        <span className="text-slate-500">{m.duration}</span>
                      </div>
                    ))}
                    {newCourse.modules.length === 0 && (
                      <span className="text-slate-500 italic text-[11px] block">No syllabus modules added. Default sandbox placeholders will be attached.</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all shadow-md"
                >
                  Publish Curriculum Course
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

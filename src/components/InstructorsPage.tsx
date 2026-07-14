import React, { useState } from "react";
import {
  User,
  Search,
  Plus,
  Filter,
  Download,
  Mail,
  Phone,
  BookOpen,
  Award,
  Star,
  CheckCircle,
  X,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  DollarSign,
  ChevronRight,
  TrendingUp,
  FileText,
  FileDown
} from "lucide-react";
import { Course, Student } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

// Define local Instructor type
interface Instructor {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  specialization: string; // e.g., "Web Development", "Computer Science"
  rating: number; // 1-5 stars
  monthlySalary: number; // in KSh
  joinedDate: string;
  status: "Active" | "On Leave" | "Suspended";
  assignedCourseIds: string[];
}

interface InstructorsPageProps {
  courses: Course[];
  students: Student[];
  darkMode: boolean;
}

export default function InstructorsPage({
  courses,
  students,
  darkMode
}: InstructorsPageProps) {
  // Mock initial instructors list (EnoTech faculty)
  const [instructors, setInstructors] = useState<Instructor[]>([
    {
      id: "INST-001",
      fullName: "Enock Omato Senior",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
      email: "enocksenior@enotech.com",
      phone: "0722334455",
      qualification: "MSc in Computer Science (UON)",
      experienceYears: 15,
      specialization: "Computer Science & Algorithmic Design",
      rating: 5,
      monthlySalary: 120000,
      joinedDate: "2024-01-10",
      status: "Active",
      assignedCourseIds: ["C-CS-ALGO", "C-DBMS-SQL"]
    },
    {
      id: "INST-002",
      fullName: "Professor Jane Makena",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
      email: "janemakena@enotech.com",
      phone: "0711223344",
      qualification: "Ph.D. in Software Engineering (KU)",
      experienceYears: 10,
      specialization: "Full-Stack Web Architectures",
      rating: 4.8,
      monthlySalary: 95000,
      joinedDate: "2024-06-15",
      status: "Active",
      assignedCourseIds: ["C-WEB-DEV", "C-PYTHON"]
    },
    {
      id: "INST-003",
      fullName: "Eng. Brian Kiprop",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
      email: "kipropbrian@enotech.com",
      phone: "0733112233",
      qualification: "BSc in Electrical & Networking (JKUAT)",
      experienceYears: 8,
      specialization: "Cisco Routing & Systems Audits",
      rating: 4.6,
      monthlySalary: 80000,
      joinedDate: "2025-02-01",
      status: "Active",
      assignedCourseIds: ["C-CYBER"]
    }
  ]);

  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("All");
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "students" | "salary">("overview");

  // Add instructor form state
  const [newInst, setNewInst] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    experienceYears: 3,
    specialization: "Programming",
    monthlySalary: 60000,
    status: "Active" as const,
    assignedCourseIds: [] as string[]
  });

  const handleCreateInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInst.fullName || !newInst.email || !newInst.phone) {
      alert("Please fulfill all required fields.");
      return;
    }

    const created: Instructor = {
      id: `INST-00${instructors.length + 1}`,
      fullName: newInst.fullName,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      email: newInst.email,
      phone: newInst.phone,
      qualification: newInst.qualification || "BSc Computer Science",
      experienceYears: Number(newInst.experienceYears),
      specialization: newInst.specialization,
      rating: 4.5,
      monthlySalary: Number(newInst.monthlySalary),
      joinedDate: new Date().toISOString().split("T")[0],
      status: newInst.status,
      assignedCourseIds: newInst.assignedCourseIds
    };

    setInstructors([...instructors, created]);
    setShowAddModal(false);
    // Reset form
    setNewInst({
      fullName: "",
      email: "",
      phone: "",
      qualification: "",
      experienceYears: 3,
      specialization: "Programming",
      monthlySalary: 60000,
      status: "Active",
      assignedCourseIds: []
    });
    alert(`Instructor ${created.fullName} registered successfully onto the system ledger!`);
  };

  const handleToggleCourseAllocation = (courseId: string) => {
    setNewInst(prev => {
      const alreadyHas = prev.assignedCourseIds.includes(courseId);
      if (alreadyHas) {
        return {
          ...prev,
          assignedCourseIds: prev.assignedCourseIds.filter(id => id !== courseId)
        };
      } else {
        return {
          ...prev,
          assignedCourseIds: [...prev.assignedCourseIds, courseId]
        };
      }
    });
  };

  // Filtered instructors list
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecial = specializationFilter === "All" || inst.specialization.includes(specializationFilter);
    return matchesSearch && matchesSpecial;
  });

  const handleExportCSV = () => {
    const headers = ["Instructor ID", "Full Name", "Email", "Phone", "Qualification", "Experience (Years)", "Specialization", "Joined Date", "Salary (KSh)", "Status"];
    const keys = ["id", "fullName", "email", "phone", "qualification", "experienceYears", "specialization", "joinedDate", "monthlySalary", "status"];
    exportToCSV(filteredInstructors, "faculty_registry", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["ID", "Full Name", "Email", "Specialization", "Experience (Years)", "Status"];
    const keys = ["id", "fullName", "email", "specialization", "experienceYears", "status"];
    exportToPDF("EnoTech Faculty & Instructors Registry", headers, keys, filteredInstructors);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Faculty & Instructors Registry</h2>
          <p className="text-xs text-slate-400">Track qualifications, salaries, performance ratings, and allocate teaching schedules for academic tutors.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register New Faculty
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Faculty</span>
          <span className="text-2xl font-black mt-1 block">{instructors.length} Tutors</span>
          <span className="text-[9px] text-slate-500 block mt-1">EnoTech core specialists</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Active Courses Assigned</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">
            {instructors.reduce((sum, i) => sum + i.assignedCourseIds.length, 0)} Tracks
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Direct module oversight</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Tutor Avg Performance</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block flex items-center gap-1">
            4.8 <Star className="w-4 h-4 fill-amber-500 text-amber-500 inline" />
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Student evaluation scores</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Monthly Payroll</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">
            KSh {instructors.reduce((sum, i) => sum + i.monthlySalary, 0).toLocaleString()}
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Operational disbursement</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-3 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search faculty by name, qualification credentials, teaching topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border rounded-lg bg-transparent focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="w-full sm:w-56 border rounded-lg p-2.5 text-xs bg-transparent focus:outline-none"
          >
            <option value="All">All Specializations</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Programming">Programming / Web Architectures</option>
            <option value="Cisco">Cisco & Cyber Systems</option>
          </select>
        </div>
      </div>

      {/* Instructors table directory */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Qualification / Degrees</th>
                <th className="p-4">Primary Specialty</th>
                <th className="p-4">Assigned Course tracks</th>
                <th className="p-4 text-center">Tutor Rating</th>
                <th className="p-4 text-right">Monthly Salary</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInstructors.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={inst.avatar} alt="" className="w-9 h-9 rounded-full object-cover border" />
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block hover:underline cursor-pointer" onClick={() => {
                          setSelectedInstructor(inst);
                          setActiveTab("overview");
                        }}>
                          {inst.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">{inst.id} • {inst.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 leading-tight">
                    <span className="font-semibold block">{inst.qualification}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{inst.experienceYears} Yrs Active Practice</span>
                  </td>

                  <td className="p-4 font-bold text-blue-500">{inst.specialization}</td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {inst.assignedCourseIds.map(cId => (
                        <span key={cId} className="px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded text-[9px] font-extrabold">
                          {cId}
                        </span>
                      ))}
                      {inst.assignedCourseIds.length === 0 && (
                        <span className="text-slate-500 italic text-[10px]">No active courses allocated</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-0.5 font-bold font-mono">
                      <span>{inst.rating}</span>
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </div>
                  </td>

                  <td className="p-4 text-right font-black text-emerald-500">
                    KSh {inst.monthlySalary.toLocaleString()}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedInstructor(inst);
                        setActiveTab("overview");
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-400 text-[10px] font-extrabold uppercase rounded cursor-pointer transition-all"
                    >
                      Oversight
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================
          INSTRUCTOR DOSSIER DETAILS MODAL
          ================================== */}
      {selectedInstructor && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className={`relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border ${
            darkMode ? "bg-[#0c1220] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            {/* Header Brand */}
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-150 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-base font-extrabold">Faculty Credentials Oversight</h3>
                    <p className="text-[11px] text-slate-400">Track assigned academic courses, teaching agendas, and salary logs.</p>
                  </div>
                </div>

                <button onClick={() => setSelectedInstructor(null)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bio Banner */}
              <div className="flex flex-col md:flex-row gap-5 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <img src={selectedInstructor.avatar} alt="" className="w-16 h-16 rounded-full object-cover border border-cyan-400 mx-auto md:mx-0" />
                <div className="flex-1 text-center md:text-left space-y-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h4 className="text-sm font-extrabold">{selectedInstructor.fullName}</h4>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded-full w-max mx-auto md:mx-0">Active Faculty</span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{selectedInstructor.qualification}</p>
                  <div className="text-[11px] text-slate-500 flex flex-wrap justify-center md:justify-start gap-4">
                    <span><strong>Email:</strong> {selectedInstructor.email}</span>
                    <span><strong>Phone:</strong> {selectedInstructor.phone}</span>
                    <span><strong>Rating:</strong> {selectedInstructor.rating} Stars</span>
                  </div>
                </div>
              </div>

              {/* Modal Tabs */}
              <div className="flex border-b border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none">
                {[
                  { id: "overview", label: "Overview & Specializations" },
                  { id: "schedule", label: "Teaching Schedule Timeline" },
                  { id: "students", label: "Assigned Students Directory" },
                  { id: "salary", label: "Compensation & Salary Logs" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                      activeTab === t.id ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Modal Content Panels */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="font-extrabold text-cyan-400 uppercase tracking-wide">Academic Focus Specialty</h5>
                    <p className="text-slate-300">This instructor oversees specialized instructional courses directly aligned with technical industry trends:</p>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                      <span className="font-extrabold text-white text-xs block">{selectedInstructor.specialization}</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Specialized Lab Room Allocations and Lecture Framework assessments.</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                    <h5 className="font-extrabold text-orange-400 uppercase tracking-wide">Teaching Experience metrics</h5>
                    <p className="text-slate-300">Summary overview of academic accomplishments and active tenure:</p>
                    <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                      <li>Over {selectedInstructor.experienceYears} Years of active industrial experience.</li>
                      <li>Faculty member since {selectedInstructor.joinedDate}</li>
                      <li>Active courses of instruction: {selectedInstructor.assignedCourseIds.length} tracks</li>
                      <li>Maintains a verified {selectedInstructor.rating}/5.0 student approval ranking.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="space-y-3 text-xs">
                  <h5 className="font-extrabold text-cyan-400 uppercase tracking-wide">Weekly Active Lecture Assignments</h5>
                  <div className="space-y-2">
                    {[
                      { day: "Monday & Wednesday", time: "09:00 AM - 11:30 AM", course: "Advanced CS & Data structures", lab: "Room 1 - Lab Sandbox" },
                      { day: "Tuesday & Thursday", time: "02:00 PM - 04:30 PM", course: "Relational Algebra Databases", lab: "Room 3 - Business Suite" },
                      { day: "Friday Session", time: "10:00 AM - 01:00 PM", course: "Python Code Core", lab: "Networking Lab" }
                    ].map((sch, i) => (
                      <div key={i} className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-lg flex justify-between items-center">
                        <div>
                          <span className="font-bold text-white block">{sch.course}</span>
                          <span className="text-[10px] text-slate-500">{sch.lab} • Recurring</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-cyan-400 block">{sch.day}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{sch.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "students" && (
                <div className="space-y-3">
                  <h5 className="font-extrabold text-cyan-400 uppercase text-xs">Assigned Students in Active Tracks</h5>
                  <div className="border rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 font-bold uppercase">
                        <tr>
                          <th className="p-2.5">Student Name</th>
                          <th className="p-2.5">Admission No</th>
                          <th className="p-2.5">Class Cohort</th>
                          <th className="p-2.5">Mode</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {students.filter(s => selectedInstructor.assignedCourseIds.includes(s.courseEnrolled)).map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/40">
                            <td className="p-2.5 font-bold text-white">{s.fullName}</td>
                            <td className="p-2.5 font-mono text-[11px] text-slate-400">{s.admissionNo}</td>
                            <td className="p-2.5">{s.batch}</td>
                            <td className="p-2.5">{s.learningMode}</td>
                          </tr>
                        ))}
                        {students.filter(s => selectedInstructor.assignedCourseIds.includes(s.courseEnrolled)).length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-4 text-center text-slate-500 italic">No students allocated in active tracks overseen by this tutor.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "salary" && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Compensations</span>
                      <span className="text-lg font-black text-emerald-500 block">KSh {selectedInstructor.monthlySalary.toLocaleString()} / Month</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Payroll Bank Status</span>
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase text-[9px]">Verified Active</span>
                    </div>
                  </div>

                  <h5 className="font-extrabold text-cyan-400 uppercase tracking-wide">Previous Salary Disbursements</h5>
                  <div className="space-y-2">
                    {[
                      { period: "June 2026 Salary Cycle", method: "Direct Bank Wire", ref: "BANK_TX_990142", date: "2026-06-28", status: "Completed" },
                      { period: "May 2026 Salary Cycle", method: "Direct Bank Wire", ref: "BANK_TX_981024", date: "2026-05-28", status: "Completed" }
                    ].map((sal, i) => (
                      <div key={i} className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg flex justify-between items-center font-mono">
                        <div>
                          <span className="font-bold text-slate-200 block">{sal.period}</span>
                          <span className="text-[10px] text-slate-500">Method: {sal.method} • Ref: {sal.ref}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-500 font-bold block">KSh {selectedInstructor.monthlySalary.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-500">Paid {sal.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => setSelectedInstructor(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold cursor-pointer">
                  Close Portfolio
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ==================================
          ADD INSTRUCTOR REGISTER MODAL
          ================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border ${
            darkMode ? "bg-[#0c1220] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-800"
          }`}>
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white">Register New Faculty Member</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateInstructorSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Professor Alex Obonyo"
                      value={newInst.fullName}
                      onChange={(e) => setNewInst({...newInst, fullName: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Academic Credentials *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ph.D. in Cyber Security (UON)"
                      value={newInst.qualification}
                      onChange={(e) => setNewInst({...newInst, qualification: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="obonyo@enotech.com"
                      value={newInst.email}
                      onChange={(e) => setNewInst({...newInst, email: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0712345678"
                      value={newInst.phone}
                      onChange={(e) => setNewInst({...newInst, phone: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Primary Specialization Specialty</label>
                    <select
                      value={newInst.specialization}
                      onChange={(e) => setNewInst({...newInst, specialization: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="Computer Science">Computer Science & Algorithms</option>
                      <option value="Programming">Programming & Web Architectures</option>
                      <option value="Cisco">Cisco Routing & Systems Audits</option>
                      <option value="Graphic Design">Graphic Design & Digital Branding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Years of Practice Experience</label>
                    <input
                      type="number"
                      value={newInst.experienceYears}
                      onChange={(e) => setNewInst({...newInst, experienceYears: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Monthly Salary (KSh)</label>
                    <input
                      type="number"
                      value={newInst.monthlySalary}
                      onChange={(e) => setNewInst({...newInst, monthlySalary: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* Course Allocations selection */}
                <div className="space-y-2">
                  <label className="block text-slate-400">Course Allocations (Oversight Tracks)</label>
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {courses.map(c => {
                      const isSelected = newInst.assignedCourseIds.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-white">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleCourseAllocation(c.id)}
                            className="accent-blue-500 rounded"
                          />
                          <span>{c.name} ({c.id})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Authorize Faculty Registration
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

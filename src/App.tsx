/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Calendar,
  DollarSign,
  Award,
  MessageSquare,
  Megaphone,
  FileSpreadsheet,
  Settings,
  Terminal,
  Search,
  Bell,
  Mail,
  Plus,
  QrCode,
  Printer,
  Download,
  Check,
  BookOpen,
  Play,
  FileText,
  Menu,
  X,
  ChevronRight,
  Filter,
  Activity,
  Wifi,
  WifiOff,
  RefreshCw,
  CreditCard,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Clock,
  BookMarked,
  Sliders,
  ChevronDown,
  Lock,
  User,
  LogOut,
  Send,
  AlertTriangle,
  Camera,
  Cpu
} from "lucide-react";

import { EnoTechDatabase } from "./components/MockDatabase";
import { NEW_UNIVERSITY_COURSES } from "./data/newCourses";
import {
  UserRole,
  LearningMode,
  StudentStatus,
  AttendanceStatus,
  AssetStatus,
  Course,
  Student,
  AttendanceRecord,
  Assignment,
  StudentSubmission,
  StudentQuizAttempt,
  Certificate,
  Transaction,
  LabAsset,
  Announcement,
  SystemLog
} from "./types";
import InteractivePlayground from "./components/InteractivePlayground";
import QrScanner from "./components/QrScanner";

// Modular Dashboard Sub-pages
import StudentsPage from "./components/StudentsPage";
import InstructorsPage from "./components/InstructorsPage";
import CoursesPage from "./components/CoursesPage";
import AttendancePage from "./components/AttendancePage";
import ExaminationsPage from "./components/ExaminationsPage";
import AssignmentsPage from "./components/AssignmentsPage";
import FinancePage from "./components/FinancePage";
import CertificatesPage from "./components/CertificatesPage";
import MessagesPage from "./components/MessagesPage";
import AnnouncementsPage from "./components/AnnouncementsPage";
import ReportsPage from "./components/ReportsPage";
import CalendarPage from "./components/CalendarPage";
import SettingsPage from "./components/SettingsPage";
import SystemLogsPage from "./components/SystemLogsPage";
import VirtualLabsPage from "./components/VirtualLabsPage";
import ModularHubPage from "./components/ModularHubPage";
import StudentDashboard from "./components/StudentDashboard";

export default function App() {
  // Navigation & Role States
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [userRole, setUserRole] = useState<UserRole>("Super Administrator");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Database States
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [assets, setAssets] = useState<LabAsset[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Search & Filter States
  const [globalSearch, setGlobalSearch] = useState<string>("");
  const [studentFilter, setStudentFilter] = useState<string>("All");
  const [studentSearch, setStudentSearch] = useState<string>("");

  // Offline Synchronization States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<string>("IDLE");
  const [syncProgress, setSyncProgress] = useState<string>("");
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showSyncModal, setShowSyncModal] = useState<boolean>(false);

  // PWA Install Prompt States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  // Active / Selected States (Modals, Forms)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileSubTab, setProfileSubTab] = useState<"overview" | "transcripts">("overview");
  const [activeViewingTranscript, setActiveViewingTranscript] = useState<any | null>(null);
  const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showIdCardModal, setShowIdCardModal] = useState<boolean>(false);
  const [selectedIdCardStudent, setSelectedIdCardStudent] = useState<Student | null>(null);

  // Registration Form States
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    fullName: "",
    gender: "Male",
    dob: "",
    nationalId: "",
    passportNumber: "",
    nationality: "Kenyan",
    county: "",
    subCounty: "",
    ward: "",
    village: "",
    guardian: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    emergencyContact: "",
    courseEnrolled: "C-WEB-DEV",
    duration: "3 Months",
    batch: "Morning Batch A",
    class: "Room 1 - Tech Sandbox",
    learningMode: "Physical",
    status: "Active",
    achievements: []
  });

  // LMS Active Course States
  const [activeLMSCourse, setActiveLMSCourse] = useState<Course | null>(null);
  const [activeLMSModuleIdx, setActiveLMSModuleIdx] = useState<number>(0);
  const [activeLMSLessonIdx, setActiveLMSLessonIdx] = useState<number>(0);
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState<number>(1);
  const [lmsBookmarks, setLmsBookmarks] = useState<string[]>([]);
  const [lmsCompletedLessons, setLmsCompletedLessons] = useState<string[]>([]);
  const [downloadedLessons, setDownloadedLessons] = useState<string[]>([]);
  const [isDownloadingLesson, setIsDownloadingLesson] = useState<string | null>(null);
  const [offlinePlaying, setOfflinePlaying] = useState<boolean>(false);
  const [offlineProgress, setOfflineProgress] = useState<number>(12);

  // Quick quiz generation state
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<any>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Chat/AI Tutor State
  const [chatMessage, setChatMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "model"; content: string }[]>([
    { role: "model", content: "Hello! I am your EnoTech AI Learning Tutor. How can I help you troubleshoot your HTML/CSS code, Python scripts, or Java algorithms today?" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Certificate Verification state
  const [certVerifyQuery, setCertVerifyQuery] = useState<string>("");
  const [verifiedCertificate, setVerifiedCertificate] = useState<Certificate | null>(null);
  const [verifyAttempted, setVerifyAttempted] = useState<boolean>(false);
  const [showCertScanner, setShowCertScanner] = useState<boolean>(false);

  // Manual Attendance marking state
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendanceStatuses, setAttendanceStatuses] = useState<{ [studentId: string]: AttendanceStatus }>({});

  // Finance form state
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false);
  const [newTx, setNewTx] = useState<Partial<Transaction>>({
    type: "Income",
    category: "Tuition Fees",
    amount: 0,
    description: "",
    paymentMethod: "M-Pesa",
    referenceNo: ""
  });

  // Course administration / creation state
  const [showAddCourse, setShowAddCourse] = useState<boolean>(false);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    id: "",
    name: "",
    category: "Programming",
    durationWeeks: 4,
    totalFees: 5000,
    description: ""
  });

  // Load Initial Database Tables
  useEffect(() => {
    setCourses(EnoTechDatabase.getCourses());
    setStudents(EnoTechDatabase.getStudents());
    setAttendance(EnoTechDatabase.getAttendance());
    setTransactions(EnoTechDatabase.getTransactions());
    setAssets(EnoTechDatabase.getAssets());
    setAnnouncements(EnoTechDatabase.getAnnouncements());
    setLogs(EnoTechDatabase.getLogs());
    setAssignments(EnoTechDatabase.getAssignments());
    setSubmissions(EnoTechDatabase.getSubmissions());
    setCertificates(EnoTechDatabase.getCertificates());

    // Sync online indicator
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA beforeinstallprompt event handling
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log("[PWA] beforeinstallprompt captured.");
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      console.log("[PWA] App successfully installed on desktop/laptop.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Initial check if running inside standard installed standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Simulating offline video progress timeline ticks
  useEffect(() => {
    let interval: any;
    if (offlinePlaying) {
      interval = setInterval(() => {
        setOfflineProgress((prev) => {
          if (prev >= 100) {
            setOfflinePlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [offlinePlaying]);

  // Update attendance values when selecting date
  useEffect(() => {
    const dailyRecords = attendance.filter((a) => a.date === attendanceDate);
    const mapped: { [studentId: string]: AttendanceStatus } = {};
    students.forEach((s) => {
      const match = dailyRecords.find((r) => r.studentId === s.id);
      mapped[s.id] = match ? match.status : "Present"; // Default present
    });
    setAttendanceStatuses(mapped);
  }, [attendanceDate, students, attendance]);

  // Sync state trigger handler
  const triggerSyncEngine = async () => {
    setShowSyncModal(true);
    setSyncStatus("SYNCING");
    setSyncLogs([]);
    await EnoTechDatabase.triggerSync((progress, logsArr) => {
      setSyncProgress(progress);
      setSyncLogs(logsArr);
    });
    setSyncStatus("SUCCESS");
    // Reload databases in case sync modified tables
    setCourses(EnoTechDatabase.getCourses());
    setStudents(EnoTechDatabase.getStudents());
    setTransactions(EnoTechDatabase.getTransactions());
    setAttendance(EnoTechDatabase.getAttendance());
    setCertificates(EnoTechDatabase.getCertificates());
  };

  // Trigger local PWA installation choice
  const triggerPwaInstall = async () => {
    if (!deferredPrompt) {
      alert("EnoTech Academy is fully pre-cached and ready for offline use! If you don't see the installation dialog, look for the 'Install App' icon (a monitor with a down-arrow) in your browser's address bar to install it instantly.");
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install user choice outcome: ${outcome}`);
      setDeferredPrompt(null);
    } catch (err) {
      console.error("[PWA] Installation prompt failed:", err);
    }
  };

  // Student Registration submission
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = EnoTechDatabase.generateStudentNumber();
    const newAdm = EnoTechDatabase.generateAdmissionNumber();
    
    // Auto calculate Expected completion date based on duration
    const regDateObj = new Date();
    const regDateStr = regDateObj.toISOString().split("T")[0];
    const durationMonths = parseInt(newStudent.duration || "3") || 3;
    regDateObj.setMonth(regDateObj.getMonth() + durationMonths);
    const expCompStr = regDateObj.toISOString().split("T")[0];

    const studentRecord: Student = {
      ...(newStudent as Student),
      id: newId,
      admissionNo: newAdm,
      passportPhoto: newStudent.passportPhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      registrationDate: regDateStr,
      expectedCompletionDate: expCompStr,
      status: "Active",
      achievements: []
    };

    EnoTechDatabase.saveStudent(studentRecord);
    setStudents(EnoTechDatabase.getStudents());
    setLogs(EnoTechDatabase.getLogs());

    // Create automatic Tuition invoice transaction
    const courseObj = courses.find((c) => c.id === studentRecord.courseEnrolled);
    const tuitionTx: Transaction = {
      id: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: "Income",
      category: "Tuition Fees",
      amount: courseObj ? courseObj.totalFees : 10000,
      date: regDateStr,
      description: `Enrollment Fee Invoice - ${studentRecord.fullName} (${courseObj?.name || "Course"})`,
      paymentMethod: "M-Pesa",
      studentId: studentRecord.id,
      referenceNo: "REG-" + Math.random().toString(36).substr(2, 5).toUpperCase()
    };
    EnoTechDatabase.addTransaction(tuitionTx);
    setTransactions(EnoTechDatabase.getTransactions());

    setShowAddStudentModal(false);
    alert(`Registration Successful! Assigned Student ID: ${newId}. Admission: ${newAdm}`);
  };

  // Add Dynamic Course Setup
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.id || !newCourse.name) return;

    const courseRecord: Course = {
      id: newCourse.id,
      name: newCourse.name,
      category: newCourse.category || "Programming",
      durationWeeks: Number(newCourse.durationWeeks) || 4,
      totalFees: Number(newCourse.totalFees) || 5000,
      description: newCourse.description || "",
      modules: [
        {
          id: "M1",
          title: "Introduction & Core Syntax",
          lessons: [
            { id: "L1", title: "Getting Started with " + newCourse.name, type: "video", duration: "10:00", url: "https://www.youtube.com/embed/S-nHYzK-BVg" },
            { id: "L2", title: "Practical Lab Assignment", type: "pdf", url: "#", content: "Implement basic examples based on instructions." }
          ]
        }
      ]
    };

    EnoTechDatabase.saveCourse(courseRecord);
    setCourses(EnoTechDatabase.getCourses());
    setLogs(EnoTechDatabase.getLogs());
    setShowAddCourse(false);
    alert(`Course "${newCourse.name}" added dynamically!`);
  };

  // AI Quiz Generator from server side Gemini Endpoint
  const handleGenerateAIQuiz = async (courseId: string, topic: string) => {
    setIsGeneratingQuiz(true);
    setGeneratedQuiz(null);
    setQuizSubmitted(false);
    setUserQuizAnswers([]);

    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseName: courses.find(c => c.id === courseId)?.name || "Technology Core",
          topic: topic,
          difficulty: "intermediate"
        })
      });

      if (!response.ok) {
        throw new Error("Could not reach backend AI engine. Verify GEMINI_API_KEY.");
      }

      const data = await response.json();
      setGeneratedQuiz(data);
    } catch (err: any) {
      alert("AI Generation failed: " + err.message);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // AI Tutor Chat Handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatMessage("");
    setChatHistory((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatHistory,
          currentCourse: activeLMSCourse?.name || "General Studies"
        })
      });

      if (!response.ok) {
        throw new Error("Tutor unavailable or offline.");
      }

      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err: any) {
      setChatHistory((prev) => [...prev, { role: "model", content: `Offline Alert: ${err.message}. Please configure API secret or ensure database connectivity.` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Bulk save manual attendance
  const handleSaveAttendance = () => {
    const list: AttendanceRecord[] = Object.keys(attendanceStatuses).map((studentId) => ({
      id: "A-" + Math.random().toString(36).substr(2, 5),
      studentId,
      date: attendanceDate,
      status: attendanceStatuses[studentId],
      markedBy: "Enock Omato"
    }));

    EnoTechDatabase.saveAttendance(list);
    setAttendance(EnoTechDatabase.getAttendance());
    setLogs(EnoTechDatabase.getLogs());
    alert("Daily Attendance spreadsheet finalized successfully!");
  };

  // Issue Certificate dynamically
  const handleIssueCertificate = (student: Student) => {
    const courseObj = courses.find((c) => c.id === student.courseEnrolled);
    if (!courseObj) return;

    const certNum = EnoTechDatabase.generateCertificateNumber();
    const newCert: Certificate = {
      certificateNumber: certNum,
      studentId: student.id,
      studentName: student.fullName,
      courseId: student.courseEnrolled,
      courseName: courseObj.name,
      issueDate: new Date().toISOString().split("T")[0],
      verificationUrl: `${window.location.origin}/verify/${certNum}`,
      qrCodeData: `https://enotech.academy/verify/${certNum}`,
      status: "Valid",
      signatures: {
        principal: "Enock Omato",
        instructor: "Enock Omato"
      }
    };

    EnoTechDatabase.issueCertificate(newCert);
    setCertificates(EnoTechDatabase.getCertificates());
    setLogs(EnoTechDatabase.getLogs());
    alert(`Certificate generated! Number: ${certNum}`);
  };

  // Verify Certificate online/offline with direct serial
  const handleVerifyWithSerial = (serial: string) => {
    setCertVerifyQuery(serial);
    setVerifyAttempted(true);
    const found = certificates.find(
      (c) => c.certificateNumber.toLowerCase().trim() === serial.toLowerCase().trim()
    );
    setVerifiedCertificate(found || null);
  };

  // Verify Certificate online/offline
  const handleVerifyCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyWithSerial(certVerifyQuery);
  };

  // Dynamic Finance Submission
  const handleAddTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.description) return;

    const txRecord: Transaction = {
      id: "TX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: newTx.type as "Income" | "Expense",
      category: newTx.category || "General",
      amount: Number(newTx.amount),
      date: new Date().toISOString().split("T")[0],
      description: newTx.description,
      paymentMethod: newTx.paymentMethod as any,
      referenceNo: newTx.referenceNo || "CASH-" + Math.random().toString(36).substr(2, 5).toUpperCase()
    };

    EnoTechDatabase.addTransaction(txRecord);
    setTransactions(EnoTechDatabase.getTransactions());
    setLogs(EnoTechDatabase.getLogs());
    setShowAddTransaction(false);
    setNewTx({
      type: "Income",
      category: "Tuition Fees",
      amount: 0,
      description: "",
      paymentMethod: "M-Pesa",
      referenceNo: ""
    });
    alert("Financial ledger entry updated!");
  };

  // Helper calculation metrics
  const totalRevenue = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingFees = students.reduce((sum, student) => {
    const course = courses.find((c) => c.id === student.courseEnrolled);
    if (!course) return sum;
    // Calculate total paid by student
    const paid = transactions
      .filter((t) => t.studentId === student.id && t.type === "Income")
      .reduce((s, t) => s + t.amount, 0);
    return sum + Math.max(0, course.totalFees - paid);
  }, 0);

  // Active LMS lessons mapping
  const currentLMSLesson = activeLMSCourse?.modules[activeLMSModuleIdx]?.lessons[activeLMSLessonIdx];

  // Merge newly added students with the mockup registrations so that new registrations work!
  const displayRegistrations = [
    // Newly registered students (from live state)
    ...students.filter(s => {
      return s.id !== "ET-2026-1001" && s.id !== "ET-2026-1002" && s.id !== "ET-2026-1003";
    }).map(s => ({
      fullName: s.fullName,
      courseName: courses.find(c => c.id === s.courseEnrolled)?.name || "Computer Packages",
      date: s.registrationDate,
      avatar: s.passportPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
    })),
    // Mockup registrations (exactly as shown in the picture)
    { fullName: "Brian Ochieng", courseName: "Web Development", date: "24 May, 2025", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { fullName: "Amina Yusuf", courseName: "Graphic Design", date: "24 May, 2025", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { fullName: "Kevin Mutua", courseName: "Video Editing", date: "23 May, 2025", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
    { fullName: "Faith Njeri", courseName: "Digital Marketing", date: "23 May, 2025", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" },
    { fullName: "Daniel Okello", courseName: "Python Programming", date: "22 May, 2025", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" }
  ];

  // Dynamic merge for financial activities (Recent Payments)
  const displayPayments = [
    // Newly registered payments
    ...transactions.filter(t => t.type === "Income" && t.id !== "T1" && t.id !== "T2" && t.id !== "T3").map(t => ({
      fullName: t.description.split(" ")[0] || "Student Pay",
      courseName: t.category,
      amount: `UGX ${t.amount.toLocaleString()}`,
      date: t.date,
      status: "Paid"
    })),
    // Mockup payments (matching mockup picture)
    { fullName: "Brian Ochieng", courseName: "Web Development", amount: "UGX 850,000", date: "24 May, 2025", status: "Paid" },
    { fullName: "Amina Yusuf", courseName: "Graphic Design", amount: "UGX 700,000", date: "24 May, 2025", status: "Paid" },
    { fullName: "Kevin Mutua", courseName: "Video Editing", amount: "UGX 800,000", date: "23 May, 2025", status: "Paid" },
    { fullName: "Faith Njeri", courseName: "Digital Marketing", amount: "UGX 650,000", date: "23 May, 2025", status: "Paid" },
    { fullName: "Daniel Okello", courseName: "Python Programming", amount: "UGX 900,000", date: "22 May, 2025", status: "Paid" }
  ];

  return (
    <div className={`h-screen overflow-hidden flex flex-col font-sans antialiased ${darkMode ? "bg-slate-950 text-slate-100" : "bg-[#f8fafc] text-slate-800"}`}>
      
      {/* HEADER BAR */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b transition-all ${
        darkMode ? "bg-[#0c1220] border-slate-800" : "bg-white border-slate-100"
      }`}>
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          
          {/* Search Bar matching mockup */}
          <div className="relative w-full max-w-md hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              className={`w-full pl-10 pr-4 py-1.5 text-xs rounded-full border focus:outline-none focus:ring-1 transition-all ${
                darkMode 
                  ? "bg-slate-900 border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-blue-500" 
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 focus:ring-blue-500"
              }`}
              placeholder="Search students, courses, invoices..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-5">
          {/* Connection Indicator & Sync Engine */}
          <button
            onClick={triggerSyncEngine}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
              isOnline 
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-300"
                : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-300"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
            <span className="hidden lg:inline">{isOnline ? "Online" : "Offline"}</span>
          </button>

          {/* Theme mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
              darkMode ? "text-amber-400" : "text-slate-500"
            }`}
            title="Toggle Theme Mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Quick Role Switcher */}
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-lg px-2 py-1 border border-slate-100 dark:border-slate-800 text-[10px]">
            <span className="text-slate-400 font-bold uppercase mr-1 hidden sm:inline">Role:</span>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent text-[10px] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              <option value="Super Administrator">Super Admin (Enock)</option>
              <option value="Instructor">Instructor Portal</option>
              <option value="Student">Student Portal</option>
              <option value="Guest">Guest / External</option>
            </select>
          </div>

          {/* Notifications with exact colors and badges */}
          <div className="relative cursor-pointer hover:opacity-85">
            <Bell className="w-5 h-5 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
              8
            </span>
          </div>

          <div className="relative cursor-pointer hover:opacity-85 hidden sm:block">
            <Mail className="w-5 h-5 text-slate-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold text-white bg-blue-500 rounded-full flex items-center justify-center">
              12
            </span>
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
              alt="Enock Omato" 
              className="w-8.5 h-8.5 rounded-full border border-blue-500 object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left leading-tight">
              <span className="text-xs font-bold block text-slate-900 dark:text-slate-100">Enock Omato</span>
              <span className="text-[10px] text-slate-400 font-medium block">Super Administrator</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:inline" />
          </div>
        </div>
      </header>

      {/* SYSTEM BODY CONTAINER */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className={`transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        } ${darkMode ? "bg-[#090d16]" : "bg-[#0b1329]"} h-full overflow-y-auto text-slate-300 flex flex-col justify-between p-4`}>
          
          <div className="space-y-6">
            
            {/* Sidebar Branding (Mockup style) */}
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-white block font-display">
                  EnoTech
                </span>
                <span className="text-xs font-bold text-white block -mt-1 font-display">
                  Academy
                </span>
                <span className="text-[8px] text-cyan-300 block tracking-wide mt-0.5 font-medium leading-none">
                  Empowering Digital Skills for Tomorrow
                </span>
              </div>
            </div>

            {/* Nav Menu matching the list of the picture */}
            <div>
              <nav className="space-y-0.5">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, hasChevron: false },
                  { id: "students", label: "Students", icon: Users, hasChevron: true },
                  { id: "instructors", label: "Instructors", icon: User, hasChevron: true },
                  { id: "courses-lms", label: "Courses", icon: BookOpen, hasChevron: true },
                  { id: "virtual-labs", label: "Virtual Laboratories", icon: Terminal, hasChevron: true },
                  { id: "attendance", label: "Attendance", icon: Calendar, hasChevron: true },
                  { id: "examinations", label: "Examinations", icon: FileText, hasChevron: true, forceChevronDown: true },
                  { id: "assignments", label: "Assignments", icon: BookMarked, hasChevron: true },
                  { id: "finance", label: "Finance", icon: DollarSign, hasChevron: true },
                  { id: "certificates", label: "Certificates", icon: Award, hasChevron: true },
                  { id: "messages", label: "Messages", icon: Mail, badge: 5, hasChevron: false },
                  { id: "announcements", label: "Announcements", icon: Megaphone, hasChevron: false },
                  { id: "reports", label: "Reports & Analytics", icon: Activity, hasChevron: true },
                  { id: "calendar", label: "Calendar", icon: Calendar, hasChevron: true },
                  { id: "modular-hub", label: "Modular Plugin Hub", icon: Cpu, hasChevron: false },
                  { id: "settings", label: "Settings", icon: Settings, hasChevron: true },
                  { id: "system-logs", label: "System Logs", icon: Terminal, hasChevron: false }
                ].map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setActiveTab(item.id as any);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" 
                          : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge !== undefined && (
                          <span className="px-1.5 py-0.2 bg-blue-500 text-[9px] font-extrabold text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {item.hasChevron && (
                          item.forceChevronDown ? (
                            <ChevronDown className="w-3 h-3 opacity-50" />
                          ) : (
                            <ChevronRight className="w-3 h-3 opacity-50" />
                          )
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar bottom branding card (glowing books + graduation cap) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-900 to-indigo-950 border border-blue-900/50 rounded-2xl p-4 mt-6 text-center shadow-xl">
            <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-60"></div>
            <div className="absolute bottom-2 left-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
            
            <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <svg className="w-full h-full text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]" viewBox="0 0 64 64" fill="none">
                <path d="M12 40C12 36.6863 14.6863 34 18 34H48V46H18C14.6863 46 12 43.3137 12 40Z" fill="#1e40af" stroke="#60a5fa" strokeWidth="1.5" />
                <path d="M14 44C14 41.2386 16.2386 39 19 39H46V49H19C16.2386 49 14 46.7614 14 44Z" fill="#2563eb" stroke="#3b82f6" strokeWidth="1.5" />
                <path d="M16 48C16 45.7909 17.7909 44 20 44H44V52H20C17.7909 52 16 50.2091 16 48Z" fill="#3b82f6" stroke="#93c5fd" strokeWidth="1.5" />
                <path d="M10 24L32 14L54 24L32 34L10 24Z" fill="#1e293b" stroke="#f97316" strokeWidth="2" strokeLinejoin="round" />
                <path d="M20 28.5V36C20 36 24 40 32 40C40 40 44 36 44 36V28.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                <path d="M48 24.5V33.5C48 33.5 49 35 46.5 35" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="46.5" cy="35" r="1.5" fill="#f97316" />
              </svg>
            </div>
            
            <span className="text-xs font-black text-white block uppercase tracking-wider font-display">
              EnoTech Academy
            </span>
            <span className="text-[9px] text-cyan-200 block mb-3 font-medium">
              Empowering Digital Skills for Tomorrow
            </span>
            <div className="space-y-2">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="w-full text-[10px] py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer border border-blue-400/20 uppercase tracking-widest"
              >
                Toggle Theme
              </button>
              
              {isAppInstalled ? (
                <div className="w-full text-[9px] py-1.5 bg-emerald-500/10 text-emerald-300 font-extrabold rounded-lg border border-emerald-500/20 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Installed on Laptop
                </div>
              ) : (
                <button 
                  onClick={triggerPwaInstall}
                  className="w-full text-[10px] py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-emerald-400/20 uppercase tracking-widest flex items-center justify-center gap-1.5 animate-pulse"
                >
                  <Download className="w-3.5 h-3.5" /> Install on Laptop
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN PANEL CONTENT WINDOW */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto overflow-x-hidden">
          
          {/* ==========================================
              TAB 1: DYNAMIC DASHBOARD (ADMIN VS STUDENT)
              ========================================== */}
          {activeTab === "dashboard" && userRole === "Student" && (
            <StudentDashboard
              students={students}
              courses={courses}
              assignments={assignments}
              submissions={submissions}
              attendance={attendance}
              darkMode={darkMode}
              setActiveTab={setActiveTab}
              setSubmissions={setSubmissions}
            />
          )}

          {activeTab === "dashboard" && userRole !== "Student" && (
            <div className="space-y-8">
              
              {/* TOP WELCOME BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100 font-display">
                    Welcome back, Enock Omato <span className="animate-bounce">👋</span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Here's what's happening at EnoTech Academy today. All systems are fully operational.
                  </p>
                </div>

                {/* Calendar Date Badge inside a modern rounded card */}
                <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border shadow-xs ${
                  darkMode ? "bg-[#111928] border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"
                }`}>
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Current Date</span>
                    <span className="text-xs font-bold font-mono">Saturday, 24 May 2025</span>
                  </div>
                </div>
              </div>
              
              {/* SIX METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label: "Total Students", value: "1,248", sub: "↑ 12.5% from last month", bg: "bg-blue-50 dark:bg-blue-950/20", iconColor: "bg-blue-600", icon: Users },
                  { label: "Total Instructors", value: "38", sub: "↑ 5.6% from last month", bg: "bg-emerald-50 dark:bg-emerald-950/20", iconColor: "bg-emerald-500", icon: User },
                  { label: "Total Courses", value: "56", sub: "↑ 8.3% from last month", bg: "bg-purple-50 dark:bg-purple-950/20", iconColor: "bg-purple-600", icon: BookOpen },
                  { label: "Today's Attendance", value: "85%", sub: "120 present / 141 total", bg: "bg-orange-50 dark:bg-orange-950/20", iconColor: "bg-orange-500", icon: Calendar },
                  { label: "Total Revenue", value: "UGX 78.4M", sub: "↑ 15.7% from last month", bg: "bg-cyan-50 dark:bg-cyan-950/20", iconColor: "bg-cyan-500", icon: DollarSign },
                  { label: "Certificates Issued", value: "326", sub: "↑ 18.2% from last month", bg: "bg-rose-50 dark:bg-rose-950/20", iconColor: "bg-rose-500", icon: Award }
                ].map((card, idx) => {
                  const Icon = card.icon;
                  return (
                    <div 
                      key={idx} 
                      className={`p-4 border rounded-2xl flex items-center gap-4 shadow-xs transition-all ${
                        darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                      }`}
                    >
                      <div className={`p-3 rounded-xl text-white ${card.iconColor} shadow-md`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="leading-tight">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">{card.label}</span>
                        <span className="text-xl font-extrabold tracking-tight block text-slate-900 dark:text-slate-100">{card.value}</span>
                        <span className={`text-[9px] font-semibold block mt-0.5 ${
                          card.sub.includes("↑") ? "text-emerald-500" : "text-slate-400"
                        }`}>{card.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DUAL CHARTS GRID & QUICK ACTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LINE CHART: ENROLLMENT TREND */}
                <div className={`lg:col-span-6 p-5 border rounded-2xl shadow-xs flex flex-col justify-between ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Enrollment Overview</h3>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">Monthly student acquisition curve</h4>
                    </div>
                    <select className="text-[10px] font-bold border rounded-lg p-1.5 bg-transparent dark:border-slate-800 cursor-pointer">
                      <option>This Year</option>
                      <option>Last Year</option>
                    </select>
                  </div>
                  
                  {/* Custom elegant SVG Line Chart matching mockup trend precisely */}
                  <div className="relative h-48 w-full mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/40" />
                      <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/40" />
                      <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800/40" />
                      
                      {/* Line Area and Curve Path */}
                      <path
                        d="M0,120 Q50,110 100,105 T200,95 T300,75 T400,50 T500,28 T600,15 L600,150 L0,150 Z"
                        fill="url(#chartGradient)"
                      />
                      <path
                        d="M0,120 Q50,110 100,105 T200,95 T300,75 T400,50 T500,28 T600,15"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                      
                      {/* Indicator Dots */}
                      <circle cx="100" cy="105" r="4" fill="#3b82f6" />
                      <circle cx="200" cy="95" r="4" fill="#3b82f6" />
                      <circle cx="300" cy="75" r="4" fill="#3b82f6" />
                      <circle cx="400" cy="50" r="4" fill="#10b981" />
                      <circle cx="500" cy="28" r="4" fill="#10b981" />
                      <circle cx="600" cy="15" r="5" fill="#f97316" className="animate-pulse" />
                    </svg>
                    
                    {/* Month indicators */}
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 mt-3 font-mono">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                    </div>
                  </div>
                </div>

                {/* DONUT CHART: LEARNING MODES */}
                <div className={`lg:col-span-3 p-5 border rounded-2xl shadow-xs flex flex-col justify-between ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Students by Learning Mode</h3>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">Remote vs On-Premises breakdown</h4>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center my-2">
                    <div className="relative w-32 h-32 mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563eb" strokeWidth="4.2" strokeDasharray="57.7 42.3" strokeDashoffset="0" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4.2" strokeDasharray="26.3 73.7" strokeDashoffset="-57.7" />
                        <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="4.2" strokeDasharray="16.0 84.0" strokeDashoffset="-84" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-black tracking-tight text-slate-950 dark:text-white font-display">1,248</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Total</span>
                      </div>
                    </div>

                    <div className="w-full space-y-1.5 text-xs font-semibold">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                          <span className="text-slate-500 text-[11px] font-medium">Physical (On-site)</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">720 (57.7%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-500 text-[11px] font-medium">Online (Remote)</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">328 (26.3%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                          <span className="text-slate-500 text-[11px] font-medium">Hybrid Mode</span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">200 (16.0%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BENTO QUICK ACTIONS BOX */}
                <div className={`lg:col-span-3 p-5 border rounded-2xl shadow-xs flex flex-col justify-between ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Actions</h3>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">Instant Administrative Tools</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 flex-1">
                    <button 
                      onClick={() => setShowAddStudentModal(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30 transition-all cursor-pointer group"
                    >
                      <Users className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Add Student</span>
                    </button>
                    
                    <button 
                      onClick={() => alert("Instructor configuration is managed in Students role filter node.")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 transition-all cursor-pointer group"
                    >
                      <User className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Add Instructor</span>
                    </button>

                    <button 
                      onClick={() => setShowAddCourse(true)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30 transition-all cursor-pointer group"
                    >
                      <BookOpen className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Add Course</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("attendance")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/30 transition-all cursor-pointer group"
                    >
                      <Calendar className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Attendance</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("virtual-labs")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30 transition-all cursor-pointer group"
                    >
                      <Terminal className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Virtual Labs</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab("certificates")}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/20 dark:hover:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-100/50 dark:border-teal-900/30 transition-all cursor-pointer group"
                    >
                      <Award className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">Certificates</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* LOWER DATA MATRIX TABLE */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* RECENT REGISTRATIONS (Card 1) */}
                <div className={`p-5 border rounded-2xl shadow-xs ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Registrations</h3>
                    <button onClick={() => setActiveTab("students")} className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer">View all</button>
                  </div>
                  <div className="space-y-3.5">
                    {displayRegistrations.slice(0, 5).map((reg, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img src={reg.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-800" referrerPolicy="no-referrer" />
                          <div>
                            <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 leading-none">{reg.fullName}</span>
                            <span className="text-[10px] text-slate-400 mt-1 block font-medium">{reg.courseName}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold font-mono text-slate-400 uppercase bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-md">{reg.date.replace(", 2025", "")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* UPCOMING CLASSES (Card 2) */}
                <div className={`p-5 border rounded-2xl shadow-xs ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Upcoming Classes</h3>
                    <span onClick={() => setActiveTab("attendance")} className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer">View all</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { date: "MAY 24", time: "10:00 AM - 12:00 PM", title: "Web Development (HTML & CSS)", instructor: "John Kimani", type: "Online" },
                      { date: "MAY 24", time: "02:00 PM - 04:00 PM", title: "Graphic Design with Photoshop", instructor: "Mercy Wanjiku", type: "On-site" },
                      { date: "MAY 25", time: "09:00 AM - 11:00 AM", title: "Python Programming core", instructor: "Brian Kiptoo", type: "Online" },
                      { date: "MAY 25", time: "01:00 PM - 03:00 PM", title: "Video Editing with Premiere Pro", instructor: "Collins Otieno", type: "On-site" }
                    ].map((cls, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="bg-blue-50 dark:bg-blue-950/40 p-2 rounded-xl text-center flex flex-col justify-center min-w-14 border border-blue-100/50 dark:border-blue-900/30">
                          <span className="text-[8px] font-black text-blue-600 uppercase block leading-none">MAY</span>
                          <span className="text-sm font-extrabold text-blue-800 dark:text-blue-200">{cls.date.split(" ")[1]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold block leading-snug text-slate-900 dark:text-slate-100 truncate">{cls.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Instructor: {cls.instructor}</span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] text-slate-500 font-bold font-mono">{cls.time}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                              cls.type === "Online" ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300" : "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                            }`}>{cls.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECENT PAYMENTS (Card 3) */}
                <div className={`p-5 border rounded-2xl shadow-xs ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Recent Payments</h3>
                    <button onClick={() => setActiveTab("finance")} className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer">Ledger</button>
                  </div>
                  <div className="space-y-3.5">
                    {displayPayments.slice(0, 5).map((pay, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block leading-snug text-slate-900 dark:text-slate-100 truncate">{pay.fullName}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">{pay.courseName} • {pay.date.replace(", 2025", "")}</span>
                        </div>
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-xs font-black text-emerald-500 font-mono">+{pay.amount}</span>
                          <span className="px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/40 text-[8px] font-black text-emerald-700 dark:text-emerald-300 rounded-md uppercase mt-0.5">Paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SYSTEM ANNOUNCEMENTS (Card 4) */}
                <div className={`p-5 border rounded-2xl shadow-xs flex flex-col justify-between ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">System Announcements</h3>
                    <span onClick={() => alert("All notifications are loaded.")} className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer">View all</span>
                  </div>
                  <div className="space-y-3.5 flex-1">
                    {[
                      { title: "New Course Added", desc: "Artificial Intelligence Basics course has been added.", time: "2 hours ago", iconColor: "text-blue-500 bg-blue-50 dark:bg-blue-950/30", icon: Bell },
                      { title: "Exam Schedule", desc: "End of Term Exams start on 5th June 2025.", time: "5 hours ago", iconColor: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30", icon: Calendar },
                      { title: "Certificate Update", desc: "325 certificates generated this week.", time: "1 day ago", iconColor: "text-orange-500 bg-orange-50 dark:bg-orange-950/30", icon: Award }
                    ].map((ann, idx) => {
                      const AnnIcon = ann.icon;
                      return (
                        <div key={idx} className="flex gap-3 items-start">
                          <div className={`p-2 rounded-lg ${ann.iconColor}`}>
                            <AnnIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 leading-tight truncate">{ann.title}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal line-clamp-1">{ann.desc}</p>
                            <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{ann.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Action button in card footer */}
                  <button 
                    onClick={() => alert("Opening announcements center...")}
                    className="w-full text-center mt-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    View All Announcements
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ==========================================
              TAB 2: STUDENT INFORMATION SYSTEM (SIS)
              ========================================== */}
          {activeTab === "students" && (
            <StudentsPage
              students={students}
              courses={courses}
              transactions={transactions}
              attendance={attendance}
              submissions={submissions}
              darkMode={darkMode}
              onEnrollNewClick={() => setShowAddStudentModal(true)}
              onViewIdCardClick={(student) => {
                setSelectedIdCardStudent(student);
                setShowIdCardModal(true);
              }}
              onDeleteStudent={(id) => {
                EnoTechDatabase.deleteStudent(id);
                setStudents(EnoTechDatabase.getStudents());
              }}
              onAddStudentDetail={(student) => {
                EnoTechDatabase.saveStudent(student);
                setStudents(EnoTechDatabase.getStudents());
              }}
            />
          )}

          {/* ==========================================
              TAB 2.5: INSTRUCTOR DIRECTORY
              ========================================== */}
          {activeTab === "instructors" && (
            <InstructorsPage
              courses={courses}
              students={students}
              darkMode={darkMode}
            />
          )}

          {false && activeTab === "students" && (
            <div className="space-y-6">
              
              {/* Search, Filter & Register controls */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search name, admission, county..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg bg-transparent focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={studentFilter}
                    onChange={(e) => setStudentFilter(e.target.value)}
                    className="border rounded-lg p-2 text-xs bg-transparent"
                  >
                    <option value="All">All Learning Modes</option>
                    <option value="Physical">Physical Classes</option>
                    <option value="Online">Online Remote</option>
                    <option value="Hybrid">Hybrid Classes</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Enroll New Student
                </button>
              </div>

              {/* STUDENTS DIRECTORY GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students
                  .filter((s) => {
                    const matchesSearch = s.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                      s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
                      s.county.toLowerCase().includes(studentSearch.toLowerCase());
                    const matchesFilter = studentFilter === "All" || s.learningMode === studentFilter;
                    return matchesSearch && matchesFilter;
                  })
                  .map((student) => {
                    const courseObj = courses.find((c) => c.id === student.courseEnrolled);
                    return (
                      <div 
                        key={student.id} 
                        className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${
                          darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                        }`}
                      >
                        {/* ID Card Ribbon header */}
                        <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <img src={student.passportPhoto} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-cyan-400 shadow-sm" />
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-slate-400 font-bold block">{student.id}</span>
                              <h3 className="text-sm font-bold tracking-tight text-slate-800 dark:text-white truncate">{student.fullName}</h3>
                              <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 block mt-0.5">{courseObj?.name || "EnoTech Course"}</span>
                              <span className="text-[10px] text-slate-400 block mt-1">Adm: {student.admissionNo}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 border-t border-b border-slate-100 dark:border-slate-800 my-4 py-3 text-[11px]">
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Learning Mode</span>
                              <span className="font-semibold">{student.learningMode}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Class / Batch</span>
                              <span className="font-semibold">{student.batch}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Location County</span>
                              <span className="font-semibold">{student.county} County</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[9px] uppercase font-bold">Guardian Details</span>
                              <span className="font-semibold truncate block">{student.guardian}</span>
                            </div>
                          </div>

                          {/* ID Card and Certificate Generation controls */}
                          <div className="flex gap-2 text-center">
                            <button
                              onClick={() => {
                                setSelectedIdCardStudent(student);
                                setShowIdCardModal(true);
                              }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg transition-all"
                            >
                              <QrCode className="w-3.5 h-3.5" /> ID Card
                            </button>
                            <button
                              onClick={() => {
                                setSelectedStudent(student);
                              }}
                              className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-all"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* INDIVIDUAL PROFILE SHEET (IF ACTIVE) */}
              {selectedStudent && (
                <div className={`p-6 border rounded-xl shadow-xl space-y-6 ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  {/* Profile Header with Close Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-bold text-base tracking-tight">Active Student Profile: {selectedStudent.fullName}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedStudent(null)}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-400 hover:text-slate-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* SUB-TABS SELECTOR FOR TRANSCRIPTS AND GENERAL DETAILS */}
                  <div className="flex border-b border-slate-150 dark:border-slate-800">
                    <button
                      onClick={() => setProfileSubTab("overview")}
                      className={`px-4 py-2 text-xs font-extrabold tracking-wide border-b-2 transition-all cursor-pointer ${
                        profileSubTab === "overview"
                          ? "border-cyan-500 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Overview & Fee Statement
                    </button>
                    <button
                      onClick={() => setProfileSubTab("transcripts")}
                      className={`px-4 py-2 text-xs font-extrabold tracking-wide border-b-2 transition-all cursor-pointer ${
                        profileSubTab === "transcripts"
                          ? "border-cyan-500 text-cyan-400"
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Official Academic Transcripts
                    </button>
                  </div>

                  {/* SUB-TAB 1: OVERVIEW */}
                  {profileSubTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Left: Bio Data */}
                      <div className="space-y-4">
                        <div className="text-center bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                          <img src={selectedStudent.passportPhoto} alt="" className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-cyan-400 shadow" />
                          <h4 className="text-sm font-extrabold mt-3">{selectedStudent.fullName}</h4>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{selectedStudent.id} • {selectedStudent.admissionNo}</span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-slate-400">Gender:</span> <span>{selectedStudent.gender}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Date of Birth:</span> <span>{selectedStudent.dob}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">National ID/Passport:</span> <span>{selectedStudent.nationalId}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Nationality:</span> <span>{selectedStudent.nationality}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Physical Address:</span> <span>{selectedStudent.address}</span></div>
                        </div>
                      </div>

                      {/* Middle: Academic Progress, Achievements */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Academic & Course Info</h4>
                        <div className="space-y-3.5 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Course Registered:</span>
                            <span className="font-bold text-slate-800 dark:text-white">{courses.find(c => c.id === selectedStudent.courseEnrolled)?.name || "Not Found"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-0.5">Classroom Allocated:</span>
                            <span className="font-bold">{selectedStudent.class} ({selectedStudent.batch})</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-slate-400 block mb-0.5">Enrolled Date:</span>
                              <span className="font-semibold">{selectedStudent.registrationDate}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-0.5">Expected End:</span>
                              <span className="font-semibold">{selectedStudent.expectedCompletionDate}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-slate-400 block mb-1">Learning Achievement Badge:</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedStudent.achievements.length > 0 ? (
                                selectedStudent.achievements.map((a, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-[10px] font-bold rounded-full">
                                    🏆 {a}
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 italic">No achievements unlocked yet. Attend classes to earn badges.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Guardian & Financial Statements */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400">Emergency & Billing Info</h4>
                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-slate-400 block mb-0.5">Primary Guardian:</span>
                            <span className="font-bold block">{selectedStudent.guardian}</span>
                            <span className="text-slate-500">{selectedStudent.parentPhone} • {selectedStudent.parentEmail || "No Email"}</span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fee Statement Summary</span>
                            <div className="flex justify-between">
                              <span>Tuition Fee Cost:</span>
                              <span className="font-bold">KSh {courses.find(c => c.id === selectedStudent.courseEnrolled)?.totalFees.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-emerald-500 font-semibold">
                              <span>Amount Paid:</span>
                              <span>KSh {transactions
                                .filter(t => t.studentId === selectedStudent.id && t.type === "Income")
                                .reduce((s, t) => s + t.amount, 0)
                                .toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-orange-500 font-extrabold border-t border-slate-200 dark:border-slate-800 pt-1">
                              <span>Balance Due:</span>
                              <span>KSh {Math.max(0, (courses.find(c => c.id === selectedStudent.courseEnrolled)?.totalFees || 0) - transactions
                                .filter(t => t.studentId === selectedStudent.id && t.type === "Income")
                                .reduce((s, t) => s + t.amount, 0)).toLocaleString()}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleIssueCertificate(selectedStudent)}
                            className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            <Award className="w-4 h-4" /> Issue Certificate Now
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: TRANSCRIPTS SYSTEM */}
                  {profileSubTab === "transcripts" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">Official Student Transcripts</h4>
                          <p className="text-[10px] text-slate-400">Generated on-demand for parents and employers. Contains GPA and module outcomes.</p>
                        </div>
                        <button
                          onClick={() => {
                            alert("Newly assembled academic ledger transcript generated and appended!");
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" /> Generate Transcript
                        </button>
                      </div>

                      {/* List of Transcripts */}
                      <div className="space-y-3">
                        {[
                          {
                            id: "TR-2026-001",
                            serialNumber: `ETA/TR/2026/${selectedStudent.id.substring(selectedStudent.id.length - 4)}`,
                            dateCreated: "June 25, 2026",
                            semester: "First Semester",
                            averageGrade: "A (91.8%)",
                            gpa: "3.92",
                            status: "Official Approved"
                          }
                        ].map((tr, index) => {
                          const activeCourse = courses.find(c => c.id === selectedStudent.courseEnrolled);
                          return (
                            <div 
                              key={index} 
                              className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/25 transition-all"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-cyan-400">{tr.serialNumber}</span>
                                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[9px] uppercase font-bold tracking-wider">{tr.status}</span>
                                </div>
                                <div className="text-[11px] text-slate-300">
                                  Course: <span className="font-semibold text-white">{activeCourse?.name || "Standard Core Syllabus"}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  Date Generated: {tr.dateCreated} • Term: {tr.semester}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs">
                                <div className="text-right">
                                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Summary Grade</span>
                                  <span className="font-extrabold text-cyan-400 font-mono">{tr.averageGrade} (GPA {tr.gpa})</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => setActiveViewingTranscript({ ...tr, student: selectedStudent, course: activeCourse })}
                                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    👁 View
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(`Downloading transcript PDF package ${tr.serialNumber} successfully...`);
                                    }}
                                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded cursor-pointer"
                                    title="Download PDF"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSendingEmailId(tr.id);
                                      setTimeout(() => {
                                        setSendingEmailId(null);
                                        alert(`Official transcript statement securely emailed to registered parent [${selectedStudent.parentEmail || "guardian@enotech.com"}] successfully!`);
                                      }, 1100);
                                    }}
                                    disabled={sendingEmailId === tr.id}
                                    className="px-2.5 py-1.5 bg-cyan-500 text-slate-950 hover:bg-cyan-400 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  >
                                    {sendingEmailId === tr.id ? (
                                      <>
                                        <RefreshCw className="w-3 h-3 animate-spin" /> Sending...
                                      </>
                                    ) : (
                                      <>
                                        <Mail className="w-3.5 h-3.5" /> Email Parent
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
                </div>
              )}

              {/* ACTIVE TRANSCRIPT VISUAL OVERLAY */}
              {activeViewingTranscript && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl p-8 space-y-6 shadow-2xl border border-slate-200">
                    {/* Header Controls (Do not print these) */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 no-print">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Transcript
                      </button>
                      <button
                        onClick={() => setActiveViewingTranscript(null)}
                        className="p-1.5 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Transcript Body Area */}
                    <div className="border-4 border-slate-900 p-6 space-y-6 bg-stone-50/50">
                      {/* Logo and Brand */}
                      <div className="text-center border-b-2 border-slate-900 pb-4">
                        <h2 className="text-xl font-extrabold tracking-widest uppercase text-slate-900">EnoTech Academy</h2>
                        <p className="text-[10px] tracking-wide text-slate-600 font-bold">INNOVATIVE COMPUTER PACKAGES, PROGRAMMING & LAB NETWORKS</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-1">
                          Founder & Supervisor: Enock Omato • Super Administrator Ledger Node
                        </p>
                      </div>

                      {/* Header Info */}
                      <div className="grid grid-cols-2 gap-4 text-[11px] border-b border-slate-250 pb-4">
                        <div className="space-y-1">
                          <div><span className="text-slate-500 font-bold">STUDENT NAME:</span> <span className="font-extrabold uppercase">{activeViewingTranscript.student.fullName}</span></div>
                          <div><span className="text-slate-500 font-bold">ADMISSION NO:</span> <span className="font-mono font-bold">{activeViewingTranscript.student.admissionNo}</span></div>
                          <div><span className="text-slate-500 font-bold">NATIONAL ID:</span> <span className="font-mono">{activeViewingTranscript.student.nationalId || "ETA-TEMPORARY"}</span></div>
                          <div><span className="text-slate-500 font-bold">LEARNING MODE:</span> <span className="font-bold">{activeViewingTranscript.student.learningMode}</span></div>
                        </div>
                        <div className="space-y-1 text-right">
                          <div><span className="text-slate-500 font-bold">TRANSCRIPT NO:</span> <span className="font-mono font-extrabold text-blue-800">{activeViewingTranscript.serialNumber}</span></div>
                          <div><span className="text-slate-500 font-bold">REGISTERED COURSE:</span> <span className="font-bold">{activeViewingTranscript.course?.name || "Core CS"}</span></div>
                          <div><span className="text-slate-500 font-bold">TERM COMPLETED:</span> <span>{activeViewingTranscript.semester}</span></div>
                          <div><span className="text-slate-500 font-bold">OFFICIAL GPA:</span> <span className="font-mono font-extrabold text-cyan-600">{activeViewingTranscript.gpa}</span></div>
                        </div>
                      </div>

                      {/* Modules list & Marks table */}
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
                            {/* Dynamically build module grades based on the registered course modules */}
                            {activeViewingTranscript.course?.modules?.map((mod: any, i: number) => {
                              // Assign standard mock grades for presentation
                              const grades = [94, 88, 91, 95];
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
                            }) || (
                              <tr>
                                <td colSpan={5} className="p-4 border border-slate-300 text-center text-slate-400 italic">No modules listed in database schema</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Official Signature and Stamps */}
                      <div className="pt-6 grid grid-cols-2 gap-4 items-end">
                        <div className="space-y-1.5">
                          <div className="w-24 h-24 bg-slate-100 border border-slate-300 flex items-center justify-center rounded">
                            {/* Verification QR */}
                            <div className="text-center font-mono text-[9px] text-slate-500 p-1">
                              <span className="font-bold text-slate-900 uppercase block mb-1">SCAN VERIFY</span>
                              <div className="w-12 h-12 bg-slate-900 mx-auto rounded flex items-center justify-center text-white font-bold text-xs">
                                QR
                              </div>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 block">Unique QR Verification Ledger code attached</span>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="font-serif italic text-sm block text-blue-900 font-extrabold">Enock Omato</span>
                          <div className="border-t border-slate-500 pt-1">
                            <span className="text-[10px] font-extrabold text-slate-800 uppercase block">Enock Omato</span>
                            <span className="text-[9px] text-slate-500 block">Super Administrator, EnoTech Academy</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Status action bar */}
                    <div className="flex justify-between items-center text-xs text-slate-500 border-t pt-4 no-print">
                      <span>Verification Address: https://enotech-verify.edu/verify</span>
                      <button
                        onClick={() => setActiveViewingTranscript(null)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer"
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==========================================
              TAB 3: E-LEARNING PORTAL (LMS)
              ========================================== */}
          {activeTab === "courses-lms" && (
            <div className="space-y-8">
              
              {/* LMS View toggle */}
              {!activeLMSCourse ? (
                <CoursesPage
                  courses={courses}
                  students={students}
                  darkMode={darkMode}
                  onAddCourse={(course) => {
                    EnoTechDatabase.saveCourse(course);
                    setCourses(EnoTechDatabase.getCourses());
                    EnoTechDatabase.addLog(
                      "Admin",
                      "Super Administrator",
                      "COURSE_CREATED",
                      `Course created: ${course.name} (${course.id})`
                    );
                    setLogs(EnoTechDatabase.getLogs());
                  }}
                  onArchiveCourse={(id) => {
                    alert(`Course ${id} has been successfully archived.`);
                  }}
                  onLaunchLMS={(course) => {
                    setActiveLMSCourse(course);
                    setActiveLMSModuleIdx(0);
                    setActiveLMSLessonIdx(0);
                  }}
                  onMassInjectUniversityLibrary={() => {
                    const updated = EnoTechDatabase.massInjectCourses(NEW_UNIVERSITY_COURSES);
                    setCourses(updated);
                    EnoTechDatabase.addLog(
                      "Admin",
                      "Super Administrator",
                      "COURSE_MASS_INJECTION",
                      `Mass-injected 27 university-level technology courses into database catalog.`
                    );
                    setLogs(EnoTechDatabase.getLogs());
                  }}
                />
              ) : (
                
                /* ACTIVE E-LEARNING WORKSPACE */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Left Column: Lecture Videos & Documents */}
                  <div className="lg:col-span-3 space-y-6">
                    
                    {/* Lesson Workspace Header */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveLMSCourse(null)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md text-xs font-bold"
                      >
                        ← Back to Catalog
                      </button>
                      <div>
                        <span className="text-xs font-bold text-cyan-400">{activeLMSCourse.name}</span>
                        <h2 className="text-sm font-extrabold tracking-tight">{currentLMSLesson?.title || "No Active Lesson"}</h2>
                      </div>
                    </div>

                    {/* Lesson Display Panel */}
                    <div className={`border rounded-xl overflow-hidden shadow-lg ${
                      darkMode ? "bg-[#0d1322] border-slate-800" : "bg-white border-slate-100"
                    }`}>
                      {currentLMSLesson?.type === "video" ? (
                        downloadedLessons.includes(currentLMSLesson.id) ? (
                          /* OFFLINE INTEGRATED PLAYER NODE */
                          <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col justify-between overflow-hidden group select-none">
                            {/* Scanning/Ambient backdrop overlays */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)]"></div>
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                              <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-400/20 text-cyan-400 rounded text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                                <WifiOff className="w-3 h-3 text-cyan-400 animate-pulse" /> OFFLINE PLAYBACK SYSTEM ACTIVE
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 font-mono">
                                local_cache_{currentLMSLesson.id}.bin
                              </span>
                            </div>

                            {/* Centered Large Play Controls */}
                            <div className="flex-1 flex flex-col items-center justify-center space-y-3 z-10">
                              <button
                                onClick={() => setOfflinePlaying(!offlinePlaying)}
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all border transform hover:scale-105 active:scale-95 ${
                                  offlinePlaying 
                                    ? "bg-slate-850 border-cyan-500/30 text-cyan-400 hover:bg-slate-800" 
                                    : "bg-cyan-500 border-cyan-400 text-slate-950 hover:bg-cyan-400"
                                }`}
                              >
                                {offlinePlaying ? (
                                  <div className="flex gap-1.5 items-center justify-center">
                                    <span className="w-1.5 h-6 bg-cyan-400 rounded animate-pulse"></span>
                                    <span className="w-1.5 h-6 bg-cyan-400 rounded animate-pulse delay-75"></span>
                                  </div>
                                ) : (
                                  <Play className="w-7 h-7 fill-slate-950 ml-1" />
                                )}
                              </button>
                              <span className="text-[11px] font-extrabold text-slate-400 tracking-wide uppercase">
                                {offlinePlaying ? "Playing offline lecture track..." : "Offline Video Lecture Loaded"}
                              </span>
                            </div>

                            {/* Timeline & Progress Bar */}
                            <div className="space-y-2 z-10">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 font-mono">
                                <span>{Math.floor((offlineProgress * 12) / 60)}:{(offlineProgress * 12) % 60 < 10 ? "0" : ""}{(offlineProgress * 12) % 60}</span>
                                <span className="text-cyan-400">offline source • 100% synced</span>
                                <span>{currentLMSLesson.duration || "10:00"}</span>
                              </div>
                              <div className="relative w-full h-1.5 bg-slate-850 rounded-full overflow-hidden cursor-pointer">
                                <div 
                                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300" 
                                  style={{ width: `${offlineProgress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative aspect-video bg-black">
                            <iframe
                              title="lms-video"
                              src={currentLMSLesson.url}
                              className="w-full h-full border-none"
                              allowFullScreen
                            />
                          </div>
                        )
                      ) : (
                        <div className="p-8 space-y-4">
                          <div className="flex items-center gap-2 text-blue-500">
                            <FileText className="w-6 h-6" />
                            <h3 className="font-bold text-sm">Interactive Syllabus Document</h3>
                          </div>
                          <p className="text-xs leading-relaxed text-slate-300">
                            {currentLMSLesson?.content || "No document loaded for this lecture."}
                          </p>
                        </div>
                      )}

                      {/* Video Speed and Action bar */}
                      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-slate-400">Speed Control:</span>
                          <div className="flex gap-1.5">
                            {[1, 1.25, 1.5, 2].map((sp) => (
                              <button
                                key={sp}
                                onClick={() => setVideoPlaybackSpeed(sp)}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  videoPlaybackSpeed === sp ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {sp}x
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* OFFLINE DOWNLOAD ACTION TRIGGERS */}
                          {currentLMSLesson && (
                            downloadedLessons.includes(currentLMSLesson.id) ? (
                              <span className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" /> Offline Downloaded
                              </span>
                            ) : isDownloadingLesson === currentLMSLesson.id ? (
                              <button
                                disabled
                                className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-md text-xs font-bold flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" /> Caching Local Node (64%)...
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setIsDownloadingLesson(currentLMSLesson.id);
                                  setTimeout(() => {
                                    setDownloadedLessons((prev) => [...prev, currentLMSLesson.id]);
                                    setIsDownloadingLesson(null);
                                    alert(`Lecture "${currentLMSLesson.title}" downloaded and stored in offline localStorage node memory cache!`);
                                  }, 1200);
                                }}
                                className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-md text-xs font-bold flex items-center gap-1 shadow transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> Download Offline
                              </button>
                            )
                          )}

                          <button
                            onClick={() => {
                              const bmk = `Bookmark: ${currentLMSLesson?.title} (${new Date().toLocaleTimeString()})`;
                              setLmsBookmarks((p) => [...p, bmk]);
                              alert("Video Bookmark Saved at timestamp!");
                            }}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-bold cursor-pointer"
                          >
                            🔖 Add Bookmark
                          </button>
                          <button
                            onClick={() => {
                              if (currentLMSLesson) {
                                setLmsCompletedLessons((p) => [...p, currentLMSLesson.id]);
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold cursor-pointer"
                          >
                            ✔ Mark Lecture Done
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bookmarks, Student Notes & Discussion forum */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* Active Bookmarks */}
                      <div className={`p-4 border rounded-xl ${
                        darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                      }`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">Saved Video Bookmarks</h4>
                        <div className="space-y-2 text-xs">
                          {lmsBookmarks.length === 0 ? (
                            <span className="text-slate-500 italic">No bookmarks created during study session.</span>
                          ) : (
                            lmsBookmarks.map((b, idx) => (
                              <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
                                {b}
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* AI Interactive Assistant Sandbox / Course Copilot */}
                      <div className={`p-4 border rounded-xl ${
                        darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                      }`}>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-2 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> EnoTech AI Copilot & Tutor
                        </h4>
                        <div className="space-y-3">
                          <div className="h-36 overflow-y-auto bg-slate-50 dark:bg-slate-900 rounded p-3 text-[11px] font-sans space-y-2">
                            {chatHistory.map((ch, i) => (
                              <div key={i} className={ch.role === "user" ? "text-right" : "text-left"}>
                                <span className={`inline-block p-2 rounded-lg leading-relaxed ${
                                  ch.role === "user" ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                                }`}>
                                  {ch.content}
                                </span>
                              </div>
                            ))}
                            {isChatLoading && (
                              <span className="text-slate-500 italic block">Gemini thinking...</span>
                            )}
                          </div>
                          
                          <form onSubmit={handleSendChatMessage} className="flex gap-2">
                            <input
                              type="text"
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              placeholder="Ask tutor for help with code..."
                              className="flex-1 bg-transparent border rounded p-1.5 text-xs focus:outline-none"
                            />
                            <button type="submit" className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold">
                              Send
                            </button>
                          </form>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Right Column: Module & Syllabus Navigation */}
                  <div className="space-y-4">
                    <div className={`p-4 border rounded-xl ${
                      darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                    }`}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Course Syllabus modules</h3>
                      <div className="space-y-4">
                        {activeLMSCourse.modules.map((mod, modIdx) => (
                          <div key={mod.id} className="space-y-1.5">
                            <span className="text-[11px] font-bold text-blue-500 block">{mod.title}</span>
                            <div className="space-y-1">
                              {mod.lessons.map((les, lesIdx) => {
                                const isSelected = activeLMSModuleIdx === modIdx && activeLMSLessonIdx === lesIdx;
                                const isDone = lmsCompletedLessons.includes(les.id);
                                return (
                                  <button
                                    key={les.id}
                                    onClick={() => {
                                      setActiveLMSModuleIdx(modIdx);
                                      setActiveLMSLessonIdx(lesIdx);
                                    }}
                                    className={`w-full flex items-center justify-between text-left p-2 rounded text-xs font-semibold ${
                                      isSelected 
                                        ? "bg-blue-600 text-white shadow" 
                                        : "bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 text-slate-400 hover:text-slate-200"
                                    }`}
                                  >
                                    <span className="truncate flex-1 pr-2">{les.title}</span>
                                    {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Exam / Practice Quiz Generation tools */}
                    <div className={`p-4 border rounded-xl ${
                      darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                    }`}>
                      <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-500 block mb-1">AI-Powered Exercises</span>
                      <h4 className="text-xs font-bold leading-snug">Generate a customized quiz from notes for {activeLMSCourse.name}</h4>
                      
                      <div className="mt-3.5 space-y-2">
                        <button
                          onClick={() => handleGenerateAIQuiz(activeLMSCourse.id, "Syntax basics & structures")}
                          disabled={isGeneratingQuiz}
                          className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {isGeneratingQuiz ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-orange-300" />} Generate Quiz Now
                        </button>
                      </div>

                      {/* Display the active generated quiz */}
                      {generatedQuiz && (
                        <div className="mt-4 p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-3 text-xs">
                          <span className="font-bold text-white block">Quiz: {generatedQuiz.quizTitle}</span>
                          
                          {generatedQuiz.questions.map((q: any, qIdx: number) => (
                            <div key={qIdx} className="space-y-1 border-t border-slate-800/60 pt-2 first:border-0 first:pt-0">
                              <p className="font-semibold text-slate-300">{qIdx + 1}. {q.questionText}</p>
                              <div className="space-y-1">
                                {q.options.map((opt: string, oIdx: number) => {
                                  const isChecked = userQuizAnswers[qIdx] === oIdx;
                                  return (
                                    <label key={oIdx} className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                                      <input
                                        type="radio"
                                        name={`q-${qIdx}`}
                                        checked={isChecked}
                                        onChange={() => {
                                          const next = [...userQuizAnswers];
                                          next[qIdx] = oIdx;
                                          setUserQuizAnswers(next);
                                        }}
                                        disabled={quizSubmitted}
                                        className="accent-cyan-400"
                                      />
                                      <span>{opt}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {!quizSubmitted ? (
                            <button
                              onClick={() => setQuizSubmitted(true)}
                              className="w-full py-1.5 bg-cyan-500 text-slate-950 font-bold rounded"
                            >
                              Submit Answers
                            </button>
                          ) : (
                            <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                              <span className="font-bold text-emerald-400 block">Quiz Graded!</span>
                              {generatedQuiz.questions.map((q: any, qIdx: number) => {
                                const ans = userQuizAnswers[qIdx];
                                const isCorrect = ans === q.correctOptionIndex;
                                return (
                                  <div key={qIdx} className="p-1.5 bg-slate-900 rounded">
                                    <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                                      {isCorrect ? "✔ Correct" : "❌ Incorrect"}
                                    </span>
                                    <p className="text-slate-400 italic">{q.explanation}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ==========================================
              TAB 4: VIRTUAL LABORATORIES HUB (INTEGRATED)
              ========================================== */}
          {activeTab === "virtual-labs" && (
            <VirtualLabsPage darkMode={darkMode} />
          )}

          {activeTab === "coding-lab" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight">EnoTech Academy Interactive Coding Labs</h2>
                <p className="text-xs text-slate-400">Write, compile, and run code directly within your portal with zero external dependencies.</p>
              </div>

              <InteractivePlayground />
            </div>
          )}

          {/* ==========================================
              TAB 4B: MODULAR PLUGIN HUB (SYNC SERVICE)
              ========================================== */}
          {activeTab === "modular-hub" && (
            <ModularHubPage darkMode={darkMode} />
          )}

          {/* ==========================================
              TAB 5: ATTENDANCE SHEETS
              ========================================== */}
          {activeTab === "attendance" && (
            <AttendancePage
              students={students}
              courses={courses}
              attendanceRecords={attendance}
              darkMode={darkMode}
              onSaveAttendanceRecords={(records) => {
                EnoTechDatabase.saveAttendance(records);
                setAttendance(EnoTechDatabase.getAttendance());
                alert("Attendance sheet successfully synchronized and stored on database node!");
              }}
              onOpenQrOverlay={() => setShowCertScanner(true)}
            />
          )}

          {activeTab === "examinations" && (
            <ExaminationsPage
              courses={courses}
              students={students}
              darkMode={darkMode}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentsPage
              courses={courses}
              students={students}
              darkMode={darkMode}
            />
          )}

          {activeTab === "messages" && (
            <MessagesPage
              students={students}
              darkMode={darkMode}
            />
          )}

          {activeTab === "announcements" && (
            <AnnouncementsPage
              darkMode={darkMode}
            />
          )}

          {activeTab === "reports" && (
            <ReportsPage
              students={students}
              courses={courses}
              transactions={transactions}
              darkMode={darkMode}
            />
          )}

          {activeTab === "calendar" && (
            <CalendarPage
              darkMode={darkMode}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPage
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
            />
          )}

          {false && activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Daily Attendance Sheet</h2>
                  <p className="text-xs text-slate-400">Mark daily present or absent status of physical and online students.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border rounded-lg p-2 text-xs bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Save & Finalize Sheet
                  </button>
                </div>
              </div>

              {/* Attendance marking register table */}
              <div className={`border rounded-xl overflow-hidden shadow-sm ${
                darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Student Number</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Class Batch</th>
                      <th className="p-4">Class Code</th>
                      <th className="p-4 text-center">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-mono">{student.id}</td>
                        <td className="p-4">
                          <span className="font-bold">{student.fullName}</span>
                          <span className="text-[10px] text-slate-400 block">Adm: {student.admissionNo}</span>
                        </td>
                        <td className="p-4">{student.batch}</td>
                        <td className="p-4 font-semibold">{student.class}</td>
                        <td className="p-4">
                          <div className="flex justify-center gap-1.5">
                            {["Present", "Absent", "Late", "Excused"].map((status) => {
                              const isChecked = attendanceStatuses[student.id] === status;
                              let themeClass = "";
                              if (status === "Present") themeClass = isChecked ? "bg-emerald-500 text-white" : "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20";
                              if (status === "Absent") themeClass = isChecked ? "bg-rose-500 text-white" : "text-rose-500 bg-rose-50 dark:bg-rose-950/20";
                              if (status === "Late") themeClass = isChecked ? "bg-amber-500 text-white" : "text-amber-500 bg-amber-50 dark:bg-amber-950/20";
                              if (status === "Excused") themeClass = isChecked ? "bg-blue-500 text-white" : "text-blue-500 bg-blue-50 dark:bg-blue-950/20";

                              return (
                                <button
                                  key={status}
                                  onClick={() => {
                                    setAttendanceStatuses((prev) => ({
                                      ...prev,
                                      [student.id]: status as AttendanceStatus
                                    }));
                                  }}
                                  className={`px-3 py-1 rounded-md font-bold text-[10px] tracking-wide cursor-pointer transition-all ${themeClass}`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 6: FINANCIAL LEDGER
              ========================================== */}
          {activeTab === "finance" && (
            <FinancePage
              students={students}
              courses={courses}
              transactions={transactions}
              darkMode={darkMode}
              onAddTransaction={(tx) => {
                EnoTechDatabase.addTransaction(tx);
                setTransactions(EnoTechDatabase.getTransactions());
              }}
            />
          )}

          {false && activeTab === "finance" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Institutional Finance Ledger</h2>
                  <p className="text-xs text-slate-400">Track student tuition fee collections, discounts, and facilities operational expenses.</p>
                </div>
                
                <button
                  onClick={() => setShowAddTransaction(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  New Income/Expense
                </button>
              </div>

              {/* DUAL CASHFLOW SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-5 border rounded-xl shadow-sm ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">Total Tuition Income</span>
                  <span className="text-2xl font-black text-emerald-500 block">KSh {totalRevenue.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Direct from registered student courses</span>
                </div>
                <div className={`p-5 border rounded-xl shadow-sm ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">Total Expenses</span>
                  <span className="text-2xl font-black text-rose-500 block">KSh {totalExpenses.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Salaries, Rent and Lab Inventory supplies</span>
                </div>
                <div className={`p-5 border rounded-xl shadow-sm ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1">Pending Fees Balance</span>
                  <span className="text-2xl font-black text-orange-500 block">KSh {pendingFees.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Unpaid installments by active cohorts</span>
                </div>
              </div>

              {/* TRANSACTION DATABASE LEDGER TABLE */}
              <div className={`border rounded-xl overflow-hidden shadow-sm ${
                darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
              }`}>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Reference No</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-mono text-slate-400">{tx.id}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            tx.type === "Income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>{tx.type}</span>
                        </td>
                        <td className="p-4 font-semibold">{tx.category}</td>
                        <td className="p-4">{tx.description}</td>
                        <td className="p-4 font-medium">{tx.paymentMethod}</td>
                        <td className="p-4 font-mono font-bold text-slate-500">{tx.referenceNo}</td>
                        <td className="p-4 text-slate-400">{tx.date}</td>
                        <td className={`p-4 text-right font-extrabold ${
                          tx.type === "Income" ? "text-emerald-500" : "text-rose-500"
                        }`}>
                          KSh {tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 7: CERTIFICATE OFFICE
              ========================================== */}
          {activeTab === "certificates" && (
            <CertificatesPage
              students={students}
              courses={courses}
              certificates={certificates}
              darkMode={darkMode}
              onAddCertificate={(cert) => {
                EnoTechDatabase.issueCertificate(cert);
                setCertificates(EnoTechDatabase.getCertificates());
              }}
              onOpenQrOverlay={() => setShowCertScanner(true)}
            />
          )}

          {false && activeTab === "certificates" && (
            <div className="space-y-8">
              
              {/* DUAL WORKSPACE: ISSUED CERTIFICATES & VERIFICATION */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ISSUED DATABASE GRID */}
                <div className={`lg:col-span-2 p-5 border rounded-xl shadow-sm space-y-4 ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <h3 className="text-sm font-bold tracking-tight">Active Verifiable Certificates</h3>
                  <div className="space-y-3.5">
                    {certificates.map((cert) => (
                      <div 
                        key={cert.certificateNumber} 
                        className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-cyan-400">{cert.certificateNumber}</span>
                          <span className="text-xs font-bold block mt-0.5">{cert.studentName}</span>
                          <span className="text-slate-400 block">{cert.courseName} • Issued {cert.issueDate}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              alert(`Digital transcript sent to student parents: ${cert.studentName}`);
                            }}
                            className="px-3 py-1 bg-slate-800 text-slate-300 rounded font-bold hover:text-white"
                          >
                            Print Layout
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* THE CERTIFICATE VERIFICATION FORM */}
                <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-cyan-400 animate-pulse" /> Employer Verification Gate
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCertScanner(true)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 text-cyan-400 rounded-lg text-xs font-bold border border-cyan-500/20 shadow-sm transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" /> Scan QR
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">Employers can enter Certificate Numbers or use the device camera to scan the certificate QR code for direct database validation.</p>

                  <form onSubmit={handleVerifyCertificate} className="space-y-3.5 pt-1">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Certificate Serial Number</label>
                        <button
                          type="button"
                          onClick={() => setShowCertScanner(true)}
                          className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
                        >
                          <Camera className="w-3 h-3" /> Use Camera Scan
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="ETA-2026-9042"
                        value={certVerifyQuery}
                        onChange={(e) => setCertVerifyQuery(e.target.value)}
                        className="w-full border rounded-lg p-2.5 text-xs bg-transparent focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Verify Authenticity
                    </button>
                  </form>

                  {/* Verification Result Area */}
                  {verifyAttempted && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                      {verifiedCertificate ? (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200/50 space-y-2">
                          <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs">
                            <CheckCircle className="w-4 h-4" /> VALID CERTIFICATE
                          </div>
                          <div className="space-y-1 text-[11px]">
                            <div><span className="text-slate-400 block">Graduate:</span> <span className="font-bold">{verifiedCertificate.studentName}</span></div>
                            <div><span className="text-slate-400 block">Course Completed:</span> <span className="font-bold">{verifiedCertificate.courseName}</span></div>
                            <div><span className="text-slate-400 block">Date of Issue:</span> <span>{verifiedCertificate.issueDate}</span></div>
                            <div><span className="text-slate-400 block">Principal Seal:</span> <span>Signed by {verifiedCertificate.signatures.principal}</span></div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200/50 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-rose-500 font-bold block text-xs">UNVERIFIED CERTIFICATE</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">The searched Certificate Serial number is not found in our registries. Verification failed.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
              
              {/* BEAUTIFUL COMPACT LANDSCAPE CERTIFICATE TEMPLATE PREVIEW */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Live Certificate Layout Preview</span>
                <div className="max-w-4xl mx-auto bg-slate-900 border-[10px] border-double border-orange-500/80 p-8 text-center text-slate-100 rounded-xl shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative background vectors */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

                  <span className="text-lg font-black tracking-widest text-cyan-400 block">ENOTECH ACADEMY</span>
                  <span className="text-[9px] font-bold tracking-widest uppercase block text-slate-400 mt-1">Empowering Digital Skills for Tomorrow</span>
                  
                  <h2 className="text-2xl font-serif text-white italic tracking-wide my-6">Certificate of Graduation</h2>
                  
                  <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                    This is to officially certify that our distinguished student
                  </p>
                  
                  <p className="text-xl font-black text-cyan-300 tracking-tight my-4">
                    Enock Omato Jr
                  </p>

                  <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
                    has successfully satisfied all graduation metrics, academic reviews, practical submissions, and completed the comprehensive course requirements of:
                  </p>

                  <p className="text-base font-extrabold text-orange-400 tracking-wide mt-3">
                    Full-Stack Web Development (HTML/CSS, JavaScript & Node.js)
                  </p>

                  {/* QR Code and signatures bottom footer */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800 text-[10px]">
                    <div className="text-left space-y-1">
                      <span className="text-slate-500 block">Certificate Number</span>
                      <span className="font-mono font-bold text-white">ET-CERT-2026-9042</span>
                      <span className="text-slate-500 block mt-1">Issue Date: 2026-07-04</span>
                    </div>

                    <div className="flex justify-center items-center">
                      <div className="p-1 bg-white rounded border border-slate-700">
                        <QrCode className="w-12 h-12 text-slate-900" />
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-slate-500 block">Authorized Signatures</span>
                      <span className="font-serif italic text-white block">Enock Omato</span>
                      <span className="text-slate-400 block border-t border-slate-800 pt-1">Principal Seal & Stamp</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==========================================
              TAB 8: SYSTEM LOGS & AUDIT TRAIL
              ========================================== */}
          {activeTab === "system-logs" && (
            <SystemLogsPage
              darkMode={darkMode}
            />
          )}

          {false && activeTab === "system-logs" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">System Audit logs & Diagnostics</h2>
                  <p className="text-xs text-slate-400">A real-time telemetry grid of administrative actions, local ledger synchronization, and secure boots.</p>
                </div>
                <button
                  onClick={triggerSyncEngine}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Trigger Backup Sync
                </button>
              </div>

              {/* LOGS GRID DISPLAY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* AUDIT LOG TABLE */}
                <div className={`lg:col-span-2 p-5 border rounded-xl shadow-sm space-y-4 ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Audit Trail</h3>
                  <div className="space-y-3 font-mono text-[11px] leading-relaxed">
                    {logs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between font-bold">
                          <span className="text-blue-500">{log.action}</span>
                          <span className="text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-300">{log.details}</p>
                        <span className="text-[10px] text-slate-500 block">By: {log.userId} ({log.userRole})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HARDWARE LAB ASSETS DATABASE */}
                <div className={`p-5 border rounded-xl shadow-sm space-y-4 ${
                  darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"
                }`}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Hardware & PC Lab inventory</h3>
                  <p className="text-xs text-slate-400">Inspect classroom Dell workstations, projectors, and server components.</p>
                  
                  <div className="space-y-3 text-xs">
                    {assets.map((asset) => (
                      <div key={asset.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white">{asset.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            asset.status === "Operational" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>{asset.status}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Tag: {asset.assetTag} • {asset.labRoom}</span>
                          <span>Last inspected: {asset.lastInspectionDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==========================================
          MODALS & FORM CONSTRAINTS
          ========================================== */}
      
      {/* 1. SYNC MODAL */}
      {showSyncModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm tracking-tight text-white">EnoTech Central Backups System</span>
              <button onClick={() => setShowSyncModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="text-center py-4">
              <RefreshCw className={`w-12 h-12 text-cyan-400 mx-auto mb-3 ${syncStatus === "SYNCING" ? "animate-spin" : ""}`} />
              <h3 className="text-base font-extrabold text-white">
                {syncStatus === "SYNCING" ? "Merging Offline Ledger Nodes..." : "Offline Nodes Synced Successfully!"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{syncProgress}</p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1 text-slate-300 max-h-48 overflow-y-auto">
              {syncLogs.map((lg, i) => (
                <div key={i}>{lg}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl p-6 my-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">EnoTech Student Enrollment Form</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({...newStudent, fullName: e.target.value})}
                    placeholder="e.g. Enock Omato Jr"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Course Allocation *</label>
                  <select
                    value={newStudent.courseEnrolled}
                    onChange={(e) => setNewStudent({...newStudent, courseEnrolled: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Learning Mode *</label>
                  <select
                    value={newStudent.learningMode}
                    onChange={(e) => setNewStudent({...newStudent, learningMode: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Physical">Physical Classes (On-site)</option>
                    <option value="Online">Online Remote</option>
                    <option value="Hybrid">Hybrid Classes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gender *</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({...newStudent, gender: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({...newStudent, dob: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">National ID Number *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.nationalId}
                    onChange={(e) => setNewStudent({...newStudent, nationalId: e.target.value})}
                    placeholder="e.g. 38920147"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">County Location *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.county}
                    onChange={(e) => setNewStudent({...newStudent, county: e.target.value})}
                    placeholder="e.g. Kisii"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Parent/Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.guardian}
                    onChange={(e) => setNewStudent({...newStudent, guardian: e.target.value})}
                    placeholder="e.g. Enock Omato Senior"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Guardian Phone *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.parentPhone}
                    onChange={(e) => setNewStudent({...newStudent, parentPhone: e.target.value})}
                    placeholder="e.g. 0712345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Guardian Email Address</label>
                  <input
                    type="email"
                    value={newStudent.parentEmail}
                    onChange={(e) => setNewStudent({...newStudent, parentEmail: e.target.value})}
                    placeholder="e.g. parent@enotech.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
              >
                Register Student onto Local Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD COURSE MODAL */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Create New Course Module</h3>
              <button onClick={() => setShowAddCourse(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="block text-slate-400 mb-1">Unique Course Code *</label>
                <input
                  type="text"
                  required
                  value={newCourse.id}
                  onChange={(e) => setNewCourse({...newCourse, id: e.target.value})}
                  placeholder="e.g. C-NETWORKING"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  placeholder="e.g. Advanced Cisco & Fiber Routing"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Duration (Weeks)</label>
                  <input
                    type="number"
                    value={newCourse.durationWeeks}
                    onChange={(e) => setNewCourse({...newCourse, durationWeeks: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total Fee (KSh)</label>
                  <input
                    type="number"
                    value={newCourse.totalFees}
                    onChange={(e) => setNewCourse({...newCourse, totalFees: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold"
              >
                Add Course Dynamically
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD TRANSACTION LEDGER MODAL */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">New Financial Ledger Transaction</h3>
              <button onClick={() => setShowAddTransaction(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddTransactionSubmit} className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Type *</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({...newTx, type: e.target.value as any})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Income">Income (+)</option>
                    <option value="Expense">Expense (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category *</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                  >
                    <option value="Tuition Fees">Tuition Fees</option>
                    <option value="Rent & Facilities">Rent & Facilities</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Lab Supplies">Lab Supplies</option>
                    <option value="General">General Operational</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Amount (KSh) *</label>
                <input
                  type="number"
                  required
                  value={newTx.amount}
                  onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={newTx.description}
                  onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                  placeholder="e.g. Electricity tokens & Power Backup diesel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-bold"
              >
                Add Transaction to Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. STUDENT ID CARD WORKSPACE MODAL */}
      {showIdCardModal && selectedIdCardStudent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">EnoTech Student ID Workspace</h3>
              <button onClick={() => {
                setShowIdCardModal(false);
                setSelectedIdCardStudent(null);
              }} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {/* HIGHLY BRANDED ID CARD RENDERED TEMPLATE */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center">
              <div className="w-[300px] h-[450px] bg-slate-900 border-4 border-blue-600 rounded-2xl overflow-hidden shadow-2xl relative text-center text-white">
                
                {/* ID Header with Deep Blue / Cyan gradients */}
                <div className="bg-gradient-to-br from-[#0c1329] via-[#111c3a] to-[#1a2d5e] p-4 text-center border-b-2 border-orange-500 relative">
                  <span className="text-sm font-black tracking-widest text-cyan-400 block">ENOTECH ACADEMY</span>
                  <span className="text-[7px] font-bold text-slate-300 block uppercase tracking-wide">"Empowering Digital Skills"</span>
                </div>

                {/* Profile Photo Area */}
                <div className="mt-6 flex justify-center">
                  <img
                    src={selectedIdCardStudent.passportPhoto}
                    alt=""
                    className="w-24 h-24 rounded-full border-4 border-cyan-400 object-cover shadow-md"
                  />
                </div>

                {/* Bio Credentials */}
                <div className="mt-4 px-4 space-y-1">
                  <h4 className="text-base font-extrabold text-white tracking-tight">{selectedIdCardStudent.fullName}</h4>
                  <span className="px-2 py-0.5 bg-orange-500 text-[9px] font-extrabold uppercase rounded-full inline-block text-white">
                    {courses.find(c => c.id === selectedIdCardStudent.courseEnrolled)?.name || "Technology course"}
                  </span>
                </div>

                {/* ID Details list */}
                <div className="mt-4 px-6 text-left text-[10px] space-y-1.5 font-semibold text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Student No:</span>
                    <span className="font-mono text-cyan-300">{selectedIdCardStudent.id}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Admission:</span>
                    <span className="font-mono text-white">{selectedIdCardStudent.admissionNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500">Learning Mode:</span>
                    <span>{selectedIdCardStudent.learningMode}</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-slate-500">Emergency Parent:</span>
                    <span className="truncate max-w-[130px]">{selectedIdCardStudent.guardian}</span>
                  </div>
                </div>

                {/* QR Code link & verify badge */}
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6">
                  <div className="text-left">
                    <span className="text-[7px] text-slate-500 uppercase block font-bold">Principal Signature</span>
                    <span className="font-serif italic text-[11px] text-slate-200">Enock Omato</span>
                  </div>
                  <div className="p-1 bg-white rounded border border-slate-700">
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </div>
                </div>

              </div>
            </div>

            {/* Print and Save Triggers */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg text-xs"
              >
                Print Student ID
              </button>
              <button
                onClick={() => {
                  alert("Digital PDF of EnoTech ID card downloaded locally.");
                }}
                className="flex-1 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg text-xs"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}      {/* 6. CERTIFICATE QR CODE SCANNER OVERLAY */}
      {showCertScanner && (
        <QrScanner
          onScanSuccess={(serial) => {
            handleVerifyWithSerial(serial);
          }}
          onClose={() => setShowCertScanner(false)}
          certificates={certificates}
          darkMode={darkMode}
        />
      )}

    </div>
  );
}

import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  TrendingUp,
  Award,
  ExternalLink,
  ChevronRight,
  Video,
  HelpCircle,
  ArrowRight,
  Upload,
  Send,
  User,
  CheckCircle2,
  Lock,
  Plus,
  Play
} from "lucide-react";
import { Student, Course, Assignment, StudentSubmission, AttendanceRecord } from "../types";
import { EnoTechDatabase } from "./MockDatabase";

interface StudentDashboardProps {
  students: Student[];
  courses: Course[];
  assignments: Assignment[];
  submissions: StudentSubmission[];
  attendance: AttendanceRecord[];
  darkMode: boolean;
  setActiveTab: (tab: string) => void;
  setSubmissions: React.Dispatch<React.SetStateAction<StudentSubmission[]>>;
}

export default function StudentDashboard({
  students,
  courses,
  assignments,
  submissions,
  attendance,
  darkMode,
  setActiveTab,
  setSubmissions
}: StudentDashboardProps) {
  // State for active student simulation
  const [selectedStudentId, setSelectedStudentId] = useState<string>("ET-2026-1001");
  const student = students.find(s => s.id === selectedStudentId) || students[0];

  // If there are zero students, render a state warning
  if (!student) {
    return (
      <div className={`p-8 border rounded-2xl text-center space-y-4 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">No Student Record Detected</h3>
        <p className="text-xs text-slate-400">Please seed student information in the Student Information System (SIS) first.</p>
      </div>
    );
  }

  // Get enrolled course
  const enrolledCourse = courses.find(c => c.id === student.courseEnrolled);

  // Completed lessons tracking from local storage to keep state stable and offline-persistent
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`enotech_student_lessons_${student.id}`);
      return saved ? JSON.parse(saved) : ["L1", "L2"]; // Default seeded progress
    } catch (e) {
      return ["L1", "L2"];
    }
  });

  // Toggle lesson completion state
  const handleToggleLesson = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(updated);
    try {
      localStorage.setItem(`enotech_student_lessons_${student.id}`, JSON.stringify(updated));
    } catch (e) {
      console.error("Error updating lesson state", e);
    }
  };

  // Submit assignment modal or state
  const [activeSubmittingAsgId, setActiveSubmittingAsgId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState<string>("");
  const [submissionFile, setSubmissionFile] = useState<string>("final_project_code.js");
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);

  // Compute attendance metrics
  const studentAttendance = attendance.filter(a => a.studentId === student.id);
  const totalDays = studentAttendance.length || 1;
  const presentDays = studentAttendance.filter(a => a.status === "Present" || a.status === "Late" || a.status === "Excused").length;
  const attendancePercentage = Math.round((presentDays / totalDays) * 100);

  // Compute courses and modules data
  const enrolledModules = enrolledCourse?.modules || [];
  const totalLessonsCount = enrolledModules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 1;
  const enrolledCourseLessonsIds = enrolledModules.flatMap(m => m.lessons?.map(l => l.id) || []);
  const completedLessonsInCourse = completedLessons.filter(id => enrolledCourseLessonsIds.includes(id));
  const overallCourseProgress = Math.round((completedLessonsInCourse.length / totalLessonsCount) * 100);

  // Filter assignments matching this student's course
  const studentAssignments = assignments.filter(asg => asg.courseId === student.courseEnrolled);

  // Active student submissions
  const studentSubmissions = submissions.filter(s => s.studentId === student.id);

  // Submit assignment action
  const handleSubmitAssignmentAction = (e: React.FormEvent, assignmentId: string) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      alert("Please enter submission comments or notes.");
      return;
    }

    const newSubmission: StudentSubmission = {
      id: `SUB-${Date.now().toString().slice(-6)}`,
      assignmentId: assignmentId,
      studentId: student.id,
      submittedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
      files: [{ name: submissionFile, size: "480 KB" }],
      textAnswers: submissionText,
      gradeStatus: "Pending"
    };

    // Save to DB and update state
    EnoTechDatabase.saveSubmission(newSubmission);
    setSubmissions(EnoTechDatabase.getSubmissions());

    setSubmissionText("");
    setSubmissionSuccess(true);
    setTimeout(() => {
      setActiveSubmittingAsgId(null);
      setSubmissionSuccess(false);
    }, 1800);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER SECTION WITH PROFILE SWITCHER SIMULATOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-100 font-display">
            Welcome back, {student.fullName} <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Keep track of your learning pathways, active module completion scores, and assignment submissions.
          </p>
        </div>

        {/* Profile Switcher (For Demo & Admin Testing ease) */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border shadow-xs ${
          darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-100 text-slate-800"
        }`}>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Testing Profile</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="bg-transparent text-xs font-bold border-none outline-none focus:outline-none cursor-pointer pr-1"
            >
              {students.slice(0, 4).map(st => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CORE STUDENT METRIC ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Syllabus Progress", 
            value: `${overallCourseProgress}%`, 
            sub: `${completedLessonsInCourse.length} of ${totalLessonsCount} Lessons Completed`, 
            color: "text-blue-500", 
            icon: CheckCircle2,
            bg: darkMode ? "bg-blue-950/20 border-blue-900/30" : "bg-blue-50/50 border-blue-100"
          },
          { 
            label: "Enrolled Course", 
            value: enrolledCourse?.id || "N/A", 
            sub: enrolledCourse?.name || "No enrolled course", 
            color: "text-emerald-500", 
            icon: BookOpen,
            bg: darkMode ? "bg-emerald-950/20 border-emerald-900/30" : "bg-emerald-50/50 border-emerald-100"
          },
          { 
            label: "Classroom Status", 
            value: student.learningMode, 
            sub: `${student.class} • ${student.batch}`, 
            color: "text-purple-500", 
            icon: Calendar,
            bg: darkMode ? "bg-purple-950/20 border-purple-900/30" : "bg-purple-50/50 border-purple-100"
          },
          { 
            label: "Attendance Rate", 
            value: `${attendancePercentage}%`, 
            sub: `${presentDays} of ${totalDays} Sessions Present`, 
            color: "text-orange-500", 
            icon: TrendingUp,
            bg: darkMode ? "bg-orange-950/20 border-orange-900/30" : "bg-orange-50/50 border-orange-100"
          }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className={`p-5 border rounded-2xl flex items-start gap-4 transition-all duration-300 ${item.bg}`}
            >
              <div className={`p-2.5 rounded-xl bg-white dark:bg-slate-950 ${item.color} shadow-sm border border-slate-100 dark:border-slate-800`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="leading-tight flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">{item.label}</span>
                <span className="text-xl font-black block text-slate-900 dark:text-slate-100 leading-none mb-1.5">{item.value}</span>
                <span className="text-[10px] font-medium text-slate-400 block truncate leading-none">{item.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CORE INTERACTIVE PANELS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: MY COURSE WIDGET & PROGRESS TRACKER */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 'MY COURSES' WIDGET */}
          <div className={`p-5 border rounded-2xl shadow-xs space-y-4 ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">My Enrolled Program</h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                student.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"
              }`}>
                {student.status} Program
              </span>
            </div>

            {enrolledCourse ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {enrolledCourse.category}
                  </span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white mt-1">
                    {enrolledCourse.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {enrolledCourse.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3 rounded-xl text-[10px] font-medium border border-slate-850">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-extrabold uppercase block text-[8px]">Duration</span>
                    <span className="text-slate-300 font-bold">{enrolledCourse.durationWeeks || student.duration} Weeks</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-extrabold uppercase block text-[8px]">Batch</span>
                    <span className="text-slate-300 font-bold">{student.batch}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-extrabold uppercase block text-[8px]">Assigned Classroom</span>
                    <span className="text-slate-300 font-bold">{student.class}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-slate-500 font-extrabold uppercase block text-[8px]">Expected Finish</span>
                    <span className="text-slate-300 font-mono font-bold">{student.expectedCompletionDate}</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap pt-1">
                  <button 
                    onClick={() => setActiveTab("coding-lab")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white rounded-xl text-[10px] font-bold cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Launch Interactive Playground
                  </button>
                  <button 
                    onClick={() => setActiveTab("virtual-labs")}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Virtual Labs Hub
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No program enrollments found on file.</p>
            )}
          </div>

          {/* PROGRESS TRACKER FOR ENROLLED MODULES */}
          <div className={`p-5 border rounded-2xl shadow-xs space-y-4 ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Interactive Syllabus & Module Progress
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Expand each module below to track and mark complete individual lectures, interactive notes, and video segments.
              </p>
            </div>

            {enrolledModules.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4">No course modules listed for this syllabus plan.</p>
            ) : (
              <div className="space-y-4">
                {enrolledModules.map((mod, mIdx) => {
                  const modLessons = mod.lessons || [];
                  const modLessonsIds = modLessons.map(l => l.id);
                  const modCompletedCount = completedLessons.filter(id => modLessonsIds.includes(id)).length;
                  const modProgressPercent = modLessons.length > 0 
                    ? Math.round((modCompletedCount / modLessons.length) * 100) 
                    : 0;

                  return (
                    <div 
                      key={mod.id} 
                      className={`border rounded-xl p-4 space-y-3 transition-all ${
                        darkMode ? "bg-slate-950/60 border-slate-850" : "bg-slate-50 border-slate-150"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Module {mod.id}</span>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">{mod.title}</h4>
                        </div>
                        <div className="flex items-center gap-2.5 self-start sm:self-center">
                          <span className="text-[10px] font-extrabold font-mono text-slate-400">{modCompletedCount}/{modLessons.length} Done</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black font-mono ${
                            modProgressPercent === 100 
                              ? "bg-emerald-500/15 text-emerald-400" 
                              : "bg-blue-500/15 text-blue-400"
                          }`}>
                            {modProgressPercent}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${modProgressPercent === 100 ? "bg-emerald-500" : "bg-blue-500"}`}
                          style={{ width: `${modProgressPercent}%` }}
                        ></div>
                      </div>

                      {/* Lessons checklist toggle */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                        {modLessons.map((les) => {
                          const isDone = completedLessons.includes(les.id);
                          return (
                            <div 
                              key={les.id} 
                              className={`flex items-center justify-between p-2 rounded-lg text-xs transition-colors hover:bg-slate-900/40 group ${
                                isDone ? "opacity-75" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Lesson Checkbox button */}
                                <button
                                  onClick={() => handleToggleLesson(les.id)}
                                  className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                                    isDone 
                                      ? "bg-emerald-500 border-emerald-500 text-slate-950" 
                                      : "border-slate-500 group-hover:border-blue-400"
                                  }`}
                                >
                                  {isDone && <CheckCircle className="w-3.5 h-3.5 stroke-[4.5]" />}
                                </button>
                                
                                <div className="flex items-center gap-2 min-w-0">
                                  {les.type === "video" ? (
                                    <Video className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                  ) : les.type === "quiz" ? (
                                    <HelpCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                  )}
                                  <span className={`text-[11px] font-medium truncate ${
                                    isDone ? "line-through text-slate-500" : "text-slate-300"
                                  }`}>
                                    {les.title}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500 font-bold">
                                {les.duration && <span>{les.duration}</span>}
                                <span className="uppercase text-[8px] bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                                  {les.type}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PERSONAL ASSIGNMENT QUEUE */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ASSIGNMENTS QUEUE CONTAINER */}
          <div className={`p-5 border rounded-2xl shadow-xs space-y-4 ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">My Assignment Queue</h3>
              </div>
              <button 
                onClick={() => setActiveTab("assignments")}
                className="text-[10px] font-black text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Full Tab <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {studentAssignments.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No assignments assigned to your syllabus course.</p>
            ) : (
              <div className="space-y-4">
                {studentAssignments.map((asg) => {
                  const submission = studentSubmissions.find(s => s.assignmentId === asg.id);
                  const isSubmitted = !!submission;

                  // Compute urgency status badge
                  const deadlineDate = new Date(asg.deadline);
                  const today = new Date("2026-07-10"); // Current Local Time reference in 2026
                  const timeDiff = deadlineDate.getTime() - today.getTime();
                  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  
                  let urgencyBadge = "";
                  if (!isSubmitted) {
                    if (daysLeft < 0) {
                      urgencyBadge = "Overdue";
                    } else if (daysLeft <= 2) {
                      urgencyBadge = "Due Urgent";
                    } else {
                      urgencyBadge = `${daysLeft} Days left`;
                    }
                  }

                  return (
                    <div 
                      key={asg.id}
                      className={`p-4 border rounded-xl space-y-3 transition-all ${
                        isSubmitted ? "bg-slate-950/20 border-slate-800/60" : "bg-slate-950/40 border-indigo-900/30 shadow-md"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] font-bold text-slate-500 block uppercase font-mono">{asg.id} • Max: {asg.maxMarks} Marks</span>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white leading-snug">{asg.title}</h4>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {isSubmitted ? (
                            submission.gradeStatus === "Graded" ? (
                              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[9px] font-black uppercase">
                                Graded ({submission.marks}/{asg.maxMarks})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-indigo-500/15 text-indigo-400 rounded text-[9px] font-black uppercase">
                                Pending Review
                              </span>
                            )
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                              daysLeft < 0 ? "bg-rose-500/15 text-rose-400" : daysLeft <= 2 ? "bg-amber-500/15 text-amber-400 animate-pulse" : "bg-slate-500/15 text-slate-400"
                            }`}>
                              {urgencyBadge}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {asg.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] font-bold border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
                        <span className="text-slate-500">Deadline: <span className="font-mono text-slate-400">{asg.deadline}</span></span>
                        
                        {!isSubmitted ? (
                          <button
                            onClick={() => setActiveSubmittingAsgId(asg.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors active:scale-95"
                          >
                            <Upload className="w-3 h-3" /> Submit Now
                          </button>
                        ) : (
                          <span className="text-emerald-500 flex items-center gap-1 font-mono text-[9px] uppercase font-extrabold">
                            <CheckCircle className="w-3.5 h-3.5 stroke-[3]" /> Submitted
                          </span>
                        )}
                      </div>

                      {/* Submission Feedback Expandable */}
                      {isSubmitted && submission.gradeStatus === "Graded" && submission.feedback && (
                        <div className="mt-2.5 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg space-y-1">
                          <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 block leading-none">Tutor Feedback</span>
                          <p className="text-[10px] text-slate-300 leading-relaxed italic">
                            "{submission.feedback}"
                          </p>
                          <span className="text-[8px] font-bold text-slate-500 block text-right font-mono">— Graded by {submission.gradedBy || "Instructor"}</span>
                        </div>
                      )}

                      {/* Interactive File Submission Drawer Form */}
                      {activeSubmittingAsgId === asg.id && (
                        <form 
                          onSubmit={(e) => handleSubmitAssignmentAction(e, asg.id)}
                          className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3 shadow-inner"
                        >
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Upload File</label>
                            <div className="flex items-center gap-2">
                              <select 
                                value={submissionFile}
                                onChange={(e) => setSubmissionFile(e.target.value)}
                                className="bg-slate-950 text-slate-300 font-mono text-[10px] rounded-lg p-1.5 border border-slate-800 w-full"
                              >
                                <option value="responsive_navbar_code.zip">responsive_navbar_code.zip (320 KB)</option>
                                <option value="portfolio_layouts_html.html">portfolio_layouts_html.html (15 KB)</option>
                                <option value="excel_sales_model_v1.xlsx">excel_sales_model_v1.xlsx (120 KB)</option>
                                <option value="custom_styles_styles.css">custom_styles_styles.css (8 KB)</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Tutor Comments / Explanations</label>
                            <textarea
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              placeholder="Describe your design decisions, key features, or layout approaches..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-[11px] text-white placeholder-slate-600 focus:outline-none min-h-16 resize-none"
                            ></textarea>
                          </div>

                          <div className="flex justify-end gap-2 pt-1 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setActiveSubmittingAsgId(null)}
                              className="px-2.5 py-1.5 bg-transparent hover:bg-slate-800 text-slate-400 rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg cursor-pointer font-bold transition-all active:scale-95"
                            >
                              {submissionSuccess ? "Submitted!" : (
                                <>
                                  <Send className="w-3 h-3" /> Push Code
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ACADEMIC STANDING EXCEL / CERTIFICATES CARD */}
          <div className={`p-4 border rounded-2xl shadow-xs flex items-center justify-between ${
            darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white">Official Academic Certificates</h4>
                <p className="text-[10px] text-slate-400">View issued credentials, signatures, and verified QR hashes.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab("certificates")}
              className="p-1.5 bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

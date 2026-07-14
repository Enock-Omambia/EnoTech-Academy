import React, { useState } from "react";
import {
  Award,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  User,
  Star,
  Download,
  Percent,
  X,
  HelpCircle,
  Bookmark,
  CheckCircle,
  Sliders,
  Edit,
  Trash2,
  Check,
  ChevronDown
} from "lucide-react";
import { Course, Student } from "../types";

interface Exam {
  id: string;
  title: string;
  courseId: string;
  date: string;
  duration: string;
  totalMarks: number;
  passMark: number; // e.g. 50
  status: "Draft" | "Published" | "Completed" | "Grading";
}

interface Question {
  id: string;
  courseId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
}

interface ExaminationsPageProps {
  courses: Course[];
  students: Student[];
  darkMode: boolean;
}

export default function ExaminationsPage({
  courses,
  students,
  darkMode
}: ExaminationsPageProps) {
  // Mock exams list
  const [exams, setExams] = useState<Exam[]>([
    { id: "EX-101", title: "Comprehensive Computer Packages Theory Test", courseId: "C-CS-ALGO", date: "2026-07-15", duration: "1.5 Hours", totalMarks: 100, passMark: 75, status: "Published" },
    { id: "EX-102", title: "Cisco Routing & Subnetting Lab Practical", courseId: "C-CYBER", date: "2026-07-20", duration: "3 Hours", totalMarks: 100, passMark: 80, status: "Published" },
    { id: "EX-103", title: "Advanced SQL Queries Evaluation Exam", courseId: "C-DBMS-SQL", date: "2026-06-10", duration: "2 Hours", totalMarks: 100, passMark: 70, status: "Completed" }
  ]);

  // Mock question bank list
  const [questions, setQuestions] = useState<Question[]>([
    { id: "Q-1", courseId: "C-CS-ALGO", questionText: "What is the primary worst-case time complexity of Quick Sort algorithm?", options: ["O(n log n)", "O(n)", "O(n²)", "O(1)"], correctIndex: 2 },
    { id: "Q-2", courseId: "C-CYBER", questionText: "Which IPv4 subnet mask corresponds to a prefix CIDR of /26?", options: ["255.255.255.128", "255.255.255.192", "255.255.255.224", "255.255.255.0"], correctIndex: 1 },
    { id: "Q-3", courseId: "C-DBMS-SQL", questionText: "Which SQL operator is used to perform pattern matching queries with wildcards?", options: ["BETWEEN", "LIKE", "IN", "EXISTS"], correctIndex: 1 }
  ]);

  // States
  const [activeSubTab, setActiveSubTab] = useState<"exams" | "bank" | "results" | "gradebook">("exams");
  const [showCreateExamModal, setShowCreateExamModal] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);

  // ==========================================
  // GRADE BOOK STATE & CONFIGURATION
  // ==========================================
  
  // Local interface for student assessment entries
  interface GradeBookAssessment {
    id: string;
    title: string;
    weight: number; // weight out of 100 within a module
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

  // Seed baseline marks for students corresponding to their enrolled courses
  const getInitialGradeBookMarks = (
    studentsList: Student[],
    assessmentsList: GradeBookAssessment[]
  ): Record<string, Record<string, number>> => {
    const marksMap: Record<string, Record<string, number>> = {};
    studentsList.forEach(student => {
      const studentMarks: Record<string, number> = {};
      const courseAssessments = assessmentsList.filter(a => a.courseId === student.courseEnrolled);
      courseAssessments.forEach(ass => {
        // Generate realistic deterministic marks based on name characters
        const charSum = student.fullName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const assOffset = ass.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const score = Math.min(100, Math.max(50, 72 + ((charSum + assOffset) % 25)));
        studentMarks[ass.id] = score;
      });
      marksMap[student.id] = studentMarks;
    });
    return marksMap;
  };

  // Initializing Grade Book states with local storage caching
  const [gradeBookAssessments, setGradeBookAssessments] = useState<GradeBookAssessment[]>(() => {
    try {
      const stored = localStorage.getItem("enotech_gradebook_assessments");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return getInitialGradeBookAssessments(courses);
  });

  const [gradeBookMarks, setGradeBookMarks] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const stored = localStorage.getItem("enotech_gradebook_marks");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const initialAssessments = getInitialGradeBookAssessments(courses);
    return getInitialGradeBookMarks(students, initialAssessments);
  });

  // Module weightings map: courseId -> Record<moduleId, weight>
  const [courseModuleWeights, setCourseModuleWeights] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const stored = localStorage.getItem("enotech_gradebook_module_weights");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    
    const initialMap: Record<string, Record<string, number>> = {};
    courses.forEach(course => {
      if (course.modules && course.modules.length > 0) {
        const moduleMap: Record<string, number> = {};
        course.modules.forEach(m => {
          moduleMap[m.id] = 50; // default equally weighted at 50%
        });
        initialMap[course.id] = moduleMap;
      }
    });
    return initialMap;
  });

  // Local state for temporary student enrollments inside Grade Book
  const [gradeBookStudents, setGradeBookStudents] = useState<Student[]>(() => {
    return students;
  });

  // Keep local student lists synchronized with prop updates
  React.useEffect(() => {
    setGradeBookStudents(students);
  }, [students]);

  // Sync to local storage
  React.useEffect(() => {
    localStorage.setItem("enotech_gradebook_assessments", JSON.stringify(gradeBookAssessments));
  }, [gradeBookAssessments]);

  React.useEffect(() => {
    localStorage.setItem("enotech_gradebook_marks", JSON.stringify(gradeBookMarks));
  }, [gradeBookMarks]);

  React.useEffect(() => {
    localStorage.setItem("enotech_gradebook_module_weights", JSON.stringify(courseModuleWeights));
  }, [courseModuleWeights]);

  // Active filter state variables
  const [selectedGradeBookCourseId, setSelectedGradeBookCourseId] = useState<string>(
    courses[0]?.id || "C-WEB-DEV"
  );
  const [gradeBookSearch, setGradeBookSearch] = useState<string>("");
  const [selectedStudentForInput, setSelectedStudentForInput] = useState<Student | null>(null);
  const [tempMarks, setTempMarks] = useState<Record<string, string>>({}); // assessmentId -> raw string score
  const [showAddAssessmentModal, setShowAddAssessmentModal] = useState<boolean>(false);
  
  // Custom assessment form state
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    weight: 30,
    moduleId: ""
  });

  // Helper grading scale formula (Maps raw % score to letter grade and official GPA)
  const getGradeAndGpa = (score: number) => {
    if (score >= 90) return { grade: "A", gpa: 4.0, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" };
    if (score >= 80) return { grade: "B", gpa: 3.0, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" };
    if (score >= 70) return { grade: "C", gpa: 2.0, color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" };
    if (score >= 60) return { grade: "D", gpa: 1.0, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" };
    return { grade: "F", gpa: 0.0, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" };
  };

  // Main grade compiler for a given student
  const computeStudentGrades = (student: Student) => {
    const courseId = student.courseEnrolled;
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;

    const modules = course.modules || [];
    const moduleResults: Array<{
      moduleId: string;
      title: string;
      averageScore: number;
      grade: string;
      gpa: number;
      color: string;
      assessments: Array<{
        assessmentId: string;
        title: string;
        weight: number;
        score: number;
      }>;
    }> = [];

    let totalGpaPoints = 0;
    let totalModuleWeightSum = 0;
    let overallScoreSum = 0;

    modules.forEach(mod => {
      // Find assessments assigned to this module
      const modAsses = gradeBookAssessments.filter(
        a => a.courseId === courseId && a.moduleId === mod.id
      );

      let weightedScoreSum = 0;
      let weightSum = 0;
      const assBreakdown: any[] = [];

      modAsses.forEach(ass => {
        const studentScore =
          gradeBookMarks[student.id]?.[ass.id] !== undefined
            ? gradeBookMarks[student.id][ass.id]
            : 70; // fallback default
        
        weightedScoreSum += studentScore * ass.weight;
        weightSum += ass.weight;
        assBreakdown.push({
          assessmentId: ass.id,
          title: ass.title,
          weight: ass.weight,
          score: studentScore
        });
      });

      const averageScore = weightSum > 0 ? weightedScoreSum / weightSum : 0;
      const { grade, gpa, color } = getGradeAndGpa(averageScore);

      // Get weight of this module within the course
      const modWeight = courseModuleWeights[courseId]?.[mod.id] !== undefined
        ? courseModuleWeights[courseId][mod.id]
        : 50;

      totalGpaPoints += gpa * modWeight;
      totalModuleWeightSum += modWeight;
      overallScoreSum += averageScore * modWeight;

      moduleResults.push({
        moduleId: mod.id,
        title: mod.title,
        averageScore: Math.round(averageScore),
        grade,
        gpa,
        color,
        assessments: assBreakdown
      });
    });

    const finalGpa = totalModuleWeightSum > 0 ? totalGpaPoints / totalModuleWeightSum : 0;
    const finalScore = totalModuleWeightSum > 0 ? overallScoreSum / totalModuleWeightSum : 0;
    const overallGradeObj = getGradeAndGpa(finalScore);

    return {
      moduleResults,
      finalGpa: parseFloat(finalGpa.toFixed(2)),
      finalScore: Math.round(finalScore),
      finalGrade: overallGradeObj.grade,
      finalGpaColor: overallGradeObj.color
    };
  };

  // Triggers professional gradebook PDF generation
  const downloadFullGradebook = () => {
    const activeCourse = courses.find(c => c.id === selectedGradeBookCourseId);
    if (!activeCourse) return;

    const enrolledStudents = gradeBookStudents.filter(
      s => s.courseEnrolled === selectedGradeBookCourseId
    );

    if (enrolledStudents.length === 0) {
      alert("No student entries registered in this course to export.");
      return;
    }

    const compiledStudents = enrolledStudents.map(student => {
      const grades = computeStudentGrades(student);
      return {
        student,
        grades
      };
    });

    const totalStudents = compiledStudents.length;
    const classAverageGpa = (compiledStudents.reduce((sum, s) => sum + (s.grades?.finalGpa || 0), 0) / totalStudents).toFixed(2);
    
    // Sort to find top performing student
    const sortedByGpa = [...compiledStudents].sort((a, b) => (b.grades?.finalGpa || 0) - (a.grades?.finalGpa || 0));
    const topGpa = sortedByGpa[0]?.grades?.finalGpa || 0;
    const topPerformer = sortedByGpa[0]?.student?.fullName || "N/A";

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocker detected. Please disable popup blocking to view and download the official Gradebook PDF.");
      return;
    }

    const reportId = `RG-GB-${selectedGradeBookCourseId}-${Date.now().toString().slice(-6)}`;
    const compiledDate = new Date().toLocaleDateString();
    const compiledTime = new Date().toLocaleTimeString();
    const courseName = activeCourse.name;
    const courseCode = selectedGradeBookCourseId;

    // Build the HTML Rows for each student
    const htmlRows = compiledStudents.map((cs, idx) => {
      const g = cs.grades;
      if (!g) return "";

      const moduleCells = g.moduleResults.map(modRes => {
        return `
          <div style="margin-bottom: 6px; padding: 6px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 10px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 2px;">
              <span style="color: #334155;">${modRes.title} (${modRes.moduleId})</span>
              <span style="color: #0f172a; padding: 1px 4px; background: #e2e8f0; border-radius: 4px; font-size: 9px;">${modRes.grade}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-family: monospace; color: #475569;">
              <span>Score: ${modRes.averageScore}%</span>
              <span>GPA: ${modRes.gpa.toFixed(1)}</span>
            </div>
          </div>
        `;
      }).join("");

      let statusBadge = `<span style="background-color: #f1f5f9; color: #475569; padding: 3px 8px; border-radius: 12px; font-weight: bold; font-size: 9px; border: 1px solid #cbd5e1;">PASSING</span>`;
      if (g.finalGpa >= 3.5) {
        statusBadge = `<span style="background-color: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 12px; font-weight: bold; font-size: 9px; border: 1px solid #a7f3d0;">FIRST CLASS / HONORS</span>`;
      } else if (g.finalGpa < 2.0) {
        statusBadge = `<span style="background-color: #fef2f2; color: #b91c1c; padding: 3px 8px; border-radius: 12px; font-weight: bold; font-size: 9px; border: 1px solid #fca5a5;">PROBATION / RISK</span>`;
      }

      return `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafafa'}; border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px 10px; vertical-align: top; font-weight: bold; color: #0f172a;">
            <div>${cs.student.fullName}</div>
            <div style="font-family: monospace; font-size: 9px; color: #64748b; margin-top: 4px;">ID: ${cs.student.id}</div>
            <div style="font-family: monospace; font-size: 9px; color: #64748b;">Adm No: ${cs.student.admissionNo}</div>
          </td>
          <td style="padding: 12px 10px; vertical-align: top;">
            ${moduleCells}
          </td>
          <td style="padding: 12px 10px; text-align: center; vertical-align: top; font-weight: bold; font-size: 13px; color: #0284c7;">
            ${g.finalScore}%
          </td>
          <td style="padding: 12px 10px; text-align: center; vertical-align: top;">
            <div style="font-weight: 900; font-size: 14px; color: #0f172a;">${g.finalGpa.toFixed(2)}</div>
            <div style="font-size: 9px; font-weight: bold; color: #64748b; margin-top: 2px;">GRADE: ${g.finalGrade}</div>
          </td>
          <td style="padding: 12px 10px; text-align: center; vertical-align: top;">
            ${statusBadge}
          </td>
        </tr>
      `;
    }).join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Gradebook Report - ${courseName}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 40px;
              color: #1e293b;
              background: #ffffff;
              line-height: 1.5;
            }
            .header-container {
              border-bottom: 3px double #0f172a;
              padding-bottom: 15px;
              margin-bottom: 25px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .brand-section {
              max-width: 65%;
            }
            .brand {
              font-size: 10px;
              font-weight: 800;
              color: #0284c7;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-bottom: 4px;
            }
            h1 {
              font-size: 24px;
              font-weight: 900;
              margin: 0;
              color: #0f172a;
              letter-spacing: -0.02em;
            }
            .subtitle {
              font-size: 11px;
              color: #475569;
              margin-top: 6px;
              font-weight: 500;
            }
            .meta-section {
              text-align: right;
              font-family: monospace;
              font-size: 9px;
              color: #64748b;
              line-height: 1.4;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 25px;
            }
            .stat-card {
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 12px;
              background-color: #f8fafc;
            }
            .stat-label {
              font-size: 8px;
              font-weight: bold;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 0.05em;
            }
            .stat-value {
              font-size: 16px;
              font-weight: 900;
              color: #0f172a;
              margin-top: 4px;
            }
            .stat-desc {
              font-size: 8px;
              color: #94a3b8;
              margin-top: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
              margin-top: 15px;
            }
            th {
              padding: 12px 10px;
              background-color: #0f172a;
              color: #ffffff;
              font-weight: bold;
              text-align: left;
              border: 1px solid #0f172a;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 0.05em;
            }
            td {
              border: 1px solid #e2e8f0;
            }
            .footer {
              margin-top: 60px;
              font-size: 9px;
              color: #94a3b8;
              text-align: center;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              line-height: 1.6;
            }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            <div class="brand-section">
              <div class="brand">EnoTech Academy Registrar Database System</div>
              <h1>Academic Gradebook Ledger</h1>
              <div class="subtitle">Syllabus Program: <strong>[${courseCode}] ${courseName}</strong></div>
            </div>
            <div class="meta-section">
              <div>REPORT ID: ${reportId}</div>
              <div>COMPILED ON: ${compiledDate}</div>
              <div>TIMESTAMP: ${compiledTime}</div>
              <div style="color: #0284c7; font-weight: bold;">STATUS: OFFICIAL RELEASE</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Syllabus Program</div>
              <div class="stat-value" style="font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${courseName}</div>
              <div class="stat-desc">Course Code: ${courseCode}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Evaluated Students</div>
              <div class="stat-value">${totalStudents} Students</div>
              <div class="stat-desc">Active class registration pool</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Class Average GPA</div>
              <div class="stat-value" style="color: #0284c7;">${classAverageGpa} GPA</div>
              <div class="stat-desc">Cumulative weighted class standing</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Top Performer</div>
              <div class="stat-value" style="font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #10b981;">${topPerformer}</div>
              <div class="stat-desc">Highest score GPA: ${topGpa.toFixed(2)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 25%;">Student Details</th>
                <th style="width: 45%;">Module Assessments breakdown</th>
                <th style="width: 10%; text-align: center;">Average Score</th>
                <th style="width: 10%; text-align: center;">Final GPA</th>
                <th style="width: 10%; text-align: center;">Standing</th>
              </tr>
            </thead>
            <tbody>
              ${htmlRows}
            </tbody>
          </table>

          <div class="footer">
            <p style="font-weight: bold; color: #475569;">EnoTech Academy Registrar Certification of Academic Records</p>
            <p>This academic ledger gradebook represents official calculated standings registered in the offline-first database. Individual score weights are derived from tutor syllabus configuration protocols.</p>
            <p style="margin-top: 10px; font-size: 8px;">© 2026 EnoTech Academy, Ltd. All rights reserved. Generated via Cloud Native Workspace Secure Ledger Proxy.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 1200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Submit handler to save inputted student assessment marks
  const handleSaveMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForInput) return;

    setGradeBookMarks(prev => {
      const studentMarks = { ...(prev[selectedStudentForInput.id] || {}) };
      Object.keys(tempMarks).forEach(assId => {
        const scoreVal = Number(tempMarks[assId]);
        studentMarks[assId] = isNaN(scoreVal) ? 0 : Math.min(100, Math.max(0, scoreVal));
      });
      return {
        ...prev,
        [selectedStudentForInput.id]: studentMarks
      };
    });

    setSelectedStudentForInput(null);
    setTempMarks({});
  };

  // Creates a brand new custom assessment for the active course
  const handleCreateAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssessment.title || !newAssessment.moduleId) return;

    const created: GradeBookAssessment = {
      id: `GBA-CUST-${Date.now()}`,
      title: newAssessment.title,
      weight: Number(newAssessment.weight),
      moduleId: newAssessment.moduleId,
      courseId: selectedGradeBookCourseId
    };

    setGradeBookAssessments(prev => [...prev, created]);
    setShowAddAssessmentModal(false);

    // Seed default baseline marks for everyone in this course
    setGradeBookMarks(prev => {
      const updated = { ...prev };
      gradeBookStudents.forEach(st => {
        if (!updated[st.id]) updated[st.id] = {};
        updated[st.id][created.id] = 75; // default starting mark
      });
      return updated;
    });

    setNewAssessment({
      title: "",
      weight: 30,
      moduleId: ""
    });
  };

  // Deletes a custom assessment
  const handleDeleteAssessment = (assId: string) => {
    if (!confirm("Are you sure you want to delete this assessment from the grade book? This will permanently erase student records for this assessment.")) return;
    setGradeBookAssessments(prev => prev.filter(a => a.id !== assId));
  };

  // Helper to change module weights
  const handleModuleWeightChange = (moduleId: string, newWeight: number) => {
    setCourseModuleWeights(prev => {
      const courseMap = { ...(prev[selectedGradeBookCourseId] || {}) };
      courseMap[moduleId] = Math.min(100, Math.max(0, newWeight));
      return {
        ...prev,
        [selectedGradeBookCourseId]: courseMap
      };
    });
  };

  // Helper to change individual assessment weights
  const handleAssessmentWeightChange = (assId: string, newWeight: number) => {
    setGradeBookAssessments(prev =>
      prev.map(a => (a.id === assId ? { ...a, weight: Math.min(100, Math.max(1, newWeight)) } : a))
    );
  };

  // Auto enroll a student into the current course for testing purposes
  const handleQuickEnrollStudent = (studentId: string) => {
    setGradeBookStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, courseEnrolled: selectedGradeBookCourseId } : s))
    );
  };

  // New Exam Form
  const [newExam, setNewExam] = useState({
    title: "",
    courseId: courses[0]?.id || "C-CS-ALGO",
    date: new Date().toISOString().split("T")[0],
    duration: "2 Hours",
    totalMarks: 100,
    passMark: 70
  });

  // New Question Form
  const [newQuestion, setNewQuestion] = useState({
    courseId: courses[0]?.id || "C-CS-ALGO",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctIndex: 0
  });

  const handleCreateExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExam.title) return;

    const created: Exam = {
      id: `EX-${100 + exams.length + 1}`,
      title: newExam.title,
      courseId: newExam.courseId,
      date: newExam.date,
      duration: newExam.duration,
      totalMarks: Number(newExam.totalMarks),
      passMark: Number(newExam.passMark),
      status: "Published"
    };

    setExams([...exams, created]);
    setShowCreateExamModal(false);
    // Reset
    setNewExam({
      title: "",
      courseId: courses[0]?.id || "C-CS-ALGO",
      date: new Date().toISOString().split("T")[0],
      duration: "2 Hours",
      totalMarks: 100,
      passMark: 70
    });
    alert(`EnoTech Official Exam "${created.title}" successfully published to course schedule lists!`);
  };

  const handleCreateQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.questionText || !newQuestion.optionA || !newQuestion.optionB) return;

    const created: Question = {
      id: `Q-${questions.length + 1}`,
      courseId: newQuestion.courseId,
      questionText: newQuestion.questionText,
      options: [newQuestion.optionA, newQuestion.optionB, newQuestion.optionC || "N/A", newQuestion.optionD || "N/A"],
      correctIndex: Number(newQuestion.correctIndex)
    };

    setQuestions([...questions, created]);
    setShowCreateQuestionModal(false);
    // Reset
    setNewQuestion({
      courseId: courses[0]?.id || "C-CS-ALGO",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctIndex: 0
    });
    alert("New multiple-choice syllabus question logged in Question Bank ledger!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Examinations & Grading Dashboard</h2>
          <p className="text-xs text-slate-400">Track and schedule core exams, formulate mock assessments, and access the institution's question database banks.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCreateExamModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Create Exam
          </button>
          
          <button
            onClick={() => setShowCreateQuestionModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Question
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Exams Conducted</span>
          <span className="text-2xl font-black mt-1 block">14 Evaluations</span>
          <span className="text-[9px] text-slate-500 block mt-1">Official certification tests</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Tutor-Compiled Questions</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">{questions.length} Questions</span>
          <span className="text-[9px] text-slate-500 block mt-1">In official database bank</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Syllabus Pass Rate</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block flex items-center gap-0.5">
            88.2% <Percent className="w-4 h-4" />
          </span>
          <span className="text-[9px] text-slate-500 block mt-1">Threshold above 75% marks</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Upcoming Tests</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">2 Scheduled</span>
          <span className="text-[9px] text-slate-500 block mt-1">Intaking within 14 days</span>
        </div>
      </div>

      {/* Sub Tabs Selection */}
      <div className="flex border-b border-slate-800">
        {[
          { id: "exams", label: "Scheduled & Active Assessments", icon: FileText },
          { id: "bank", label: "Faculty Question Banks", icon: HelpCircle },
          { id: "results", label: "Examinations Ledger Logs", icon: Award },
          { id: "gradebook", label: "Instructor Grade Book", icon: BookOpen }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === tab.id ? "border-cyan-500 text-cyan-400" : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}

      {/* TAB 1: SCHEDULED EXAMS */}
      {activeSubTab === "exams" && (
        <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Assessment Evaluation Title</th>
                  <th className="p-3.5">Course Syllabus Code</th>
                  <th className="p-3.5">Scheduled Date</th>
                  <th className="p-3.5">Exam Duration</th>
                  <th className="p-3.5">Total Marks</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {exams.map(ex => (
                  <tr key={ex.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="font-extrabold text-slate-900 dark:text-white">{ex.title}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-cyan-400">{ex.courseId}</span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-400">{ex.date}</td>
                    
                    <td className="p-3.5 font-semibold">{ex.duration}</td>
                    
                    <td className="p-3.5 font-mono">Max: {ex.totalMarks} pts (Pass: {ex.passMark})</td>

                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 border rounded text-[9px] uppercase font-bold tracking-wider ${
                        ex.status === "Published" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}>{ex.status}</span>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => alert(`Starting exam session for ${ex.title}. Direct grades ledger logging enabled.`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                      >
                        Start Proctoring
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeSubTab === "bank" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="font-extrabold text-slate-200 text-xs block">Institutions Question Bank</span>
              <p className="text-[10px] text-slate-400">Tutors compile theoretical and practical labs multiple-choice questions for evaluations.</p>
            </div>
            
            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[9px] font-bold uppercase">{q.courseId}</span>
                    <h4 className="text-xs font-extrabold text-slate-100 mt-2">{q.id}. {q.questionText}</h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = oIdx === q.correctIndex;
                    return (
                      <div key={oIdx} className={`p-2.5 rounded border ${
                        isCorrect ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-slate-950 border-slate-900 text-slate-400"
                      }`}>
                        <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                        <span>{opt}</span>
                        {isCorrect && <span className="float-right text-[9px] font-black uppercase">Correct option</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LEDGER GRADES LOGS */}
      {activeSubTab === "results" && (
        <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="p-4 border-b border-slate-850 bg-slate-900/40">
            <span className="text-xs font-bold text-white">Consolidated Examinations Results Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3">Student Full Name</th>
                  <th className="p-3">Admission No</th>
                  <th className="p-3">Exam Paper</th>
                  <th className="p-3 text-center">Marks Score</th>
                  <th className="p-3 text-center">Grade Result</th>
                  <th className="p-3 text-right">Commit Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  { name: "John Doe Nyachae", adm: "ETA-2026-9041", exam: "Advanced SQL Queries Evaluation Exam", score: 92, grade: "A", date: "2026-06-10" },
                  { name: "Mary Atieno", adm: "ETA-2026-9042", exam: "Advanced SQL Queries Evaluation Exam", score: 81, grade: "B+", date: "2026-06-10" },
                  { name: "David Kiprotich", adm: "ETA-2026-9043", exam: "Advanced SQL Queries Evaluation Exam", score: 54, grade: "C-", date: "2026-06-10" }
                ].map((res, i) => (
                  <tr key={i} className="hover:bg-slate-900/30">
                    <td className="p-3 font-bold text-white">{res.name}</td>
                    <td className="p-3 font-mono text-slate-400">{res.adm}</td>
                    <td className="p-3">{res.exam}</td>
                    <td className="p-3 text-center font-mono font-bold text-cyan-400">{res.score} / 100</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        res.score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                        res.score >= 60 ? "bg-blue-500/10 text-blue-400" : "bg-rose-500/10 text-rose-400"
                      }`}>{res.grade}</span>
                    </td>
                    <td className="p-3 text-right text-slate-500 font-mono">{res.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =============================
          TAB 4: INSTRUCTOR GRADE BOOK
          ============================= */}
      {activeSubTab === "gradebook" && (
        <div className="space-y-6">
          {/* Top Statistics & Selection Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-4 border rounded-xl shadow-sm md:col-span-2 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Select Active Syllabus Syllabus Course</label>
              <select
                value={selectedGradeBookCourseId}
                onChange={(e) => setSelectedGradeBookCourseId(e.target.value)}
                className={`w-full text-xs font-bold p-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-cyan-500 cursor-pointer ${
                  darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    [{course.id}] {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Class GPA Average</span>
              <span className="text-2xl font-black text-cyan-400 mt-1 block">
                {gradeBookStudents.filter(s => s.courseEnrolled === selectedGradeBookCourseId).length > 0 ? (
                  (() => {
                    const enrolled = gradeBookStudents.filter(s => s.courseEnrolled === selectedGradeBookCourseId);
                    const totalGpa = enrolled.reduce((acc, st) => {
                      const gr = computeStudentGrades(st);
                      return acc + (gr?.finalGpa || 0);
                    }, 0);
                    return (totalGpa / enrolled.length).toFixed(2);
                  })()
                ) : "0.00"} GPA
              </span>
              <span className="text-[9px] text-slate-500 block mt-1">Based on {gradeBookStudents.filter(s => s.courseEnrolled === selectedGradeBookCourseId).length} enrolled students</span>
            </div>

            <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Assessments Evaluated</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {gradeBookAssessments.filter(a => a.courseId === selectedGradeBookCourseId).length} Active
              </span>
              <span className="text-[9px] text-slate-500 block mt-1">Weighting is compiled in sandbox</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLUMN A: COURSE STRUCTURE, MODULE WEIGHTS, & ASSESSMENT CONFIGURATION */}
            <div className="space-y-4 lg:col-span-1">
              <div className={`p-5 border rounded-xl shadow-xs space-y-4 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
                <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                  <h3 className="font-extrabold text-xs text-white flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Syllabus Weighting Config
                  </h3>
                  <button
                    onClick={() => {
                      const activeCourse = courses.find(c => c.id === selectedGradeBookCourseId);
                      setNewAssessment(prev => ({
                        ...prev,
                        moduleId: activeCourse?.modules?.[0]?.id || ""
                      }));
                      setShowAddAssessmentModal(true);
                    }}
                    className="px-2.5 py-1 text-[10px] bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold rounded flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-3 h-3" /> Add Assessment
                  </button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    const activeCourse = courses.find(c => c.id === selectedGradeBookCourseId);
                    if (!activeCourse) return <p className="text-xs text-slate-500 italic">No course details available.</p>;
                    
                    const courseMods = activeCourse.modules || [];
                    if (courseMods.length === 0) {
                      return <p className="text-xs text-slate-500 italic">This course has no syllabus modules.</p>;
                    }

                    return courseMods.map(mod => {
                      const modWeight = courseModuleWeights[selectedGradeBookCourseId]?.[mod.id] ?? 50;
                      const modAsses = gradeBookAssessments.filter(
                        a => a.courseId === selectedGradeBookCourseId && a.moduleId === mod.id
                      );
                      const totalAssWeight = modAsses.reduce((sum, a) => sum + a.weight, 0);

                      return (
                        <div key={mod.id} className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/60 space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[10px] font-black text-cyan-400 block uppercase tracking-wider">{mod.id} Module</span>
                              <span className="text-[11px] font-bold text-white block truncate max-w-[150px]">{mod.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-400 font-bold">Contribution:</span>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={modWeight}
                                onChange={(e) => handleModuleWeightChange(mod.id, Number(e.target.value))}
                                className="w-12 text-center text-xs p-1 font-bold rounded border bg-slate-950 border-slate-800 text-cyan-300 focus:outline-hidden"
                              />
                              <span className="text-[10px] font-bold text-slate-400">%</span>
                            </div>
                          </div>

                          {/* Range slider for module weight */}
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={modWeight}
                            onChange={(e) => handleModuleWeightChange(mod.id, Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                          />

                          {/* List of Assessments in this module */}
                          <div className="space-y-2 border-t border-slate-800/60 pt-2 text-slate-300">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                              <span>Assessments</span>
                              <span className={totalAssWeight === 100 ? "text-emerald-400" : "text-amber-400"}>
                                Sum: {totalAssWeight}%
                              </span>
                            </div>

                            {modAsses.length === 0 ? (
                              <p className="text-[10px] text-slate-500 italic">No assessments defined yet.</p>
                            ) : (
                              <div className="space-y-1.5">
                                {modAsses.map(ass => (
                                  <div key={ass.id} className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded text-[10px]">
                                    <span className="text-slate-300 truncate max-w-[120px]" title={ass.title}>
                                      {ass.title}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={ass.weight}
                                        onChange={(e) => handleAssessmentWeightChange(ass.id, Number(e.target.value))}
                                        className="w-10 text-center text-[10px] font-mono p-0.5 rounded border bg-slate-900 border-slate-850 text-slate-300 focus:outline-hidden"
                                      />
                                      <span className="text-slate-500">%</span>
                                      {ass.id.includes("CUST") && (
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteAssessment(ass.id)}
                                          className="text-rose-500 hover:text-rose-400 ml-1 cursor-pointer"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {totalAssWeight !== 100 && (
                              <span className="text-[8px] font-semibold text-amber-500 block leading-tight">
                                ⚠️ Weights total {totalAssWeight}%. Grading engine will proportionately scale scores to 100% for calculation accuracy.
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>

                <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/20 rounded-lg text-[10px] text-cyan-400/90 leading-relaxed">
                  <h4 className="font-bold flex items-center gap-1 mb-1">
                    <BookOpen className="w-3.5 h-3.5" /> GPA Calculation Protocol
                  </h4>
                  1. Assessment scores are weighted individually inside their parent module. <br />
                  2. Each Module Grade is compiled and mapped to a letter grade and GPA (e.g. A = 4.0). <br />
                  3. The Final GPA is computed as a weighted average of these module GPA scores based on the adjustable contribution sliders.
                </div>
              </div>
            </div>

            {/* COLUMN B: GRADES LEDGER SHEET */}
            <div className="lg:col-span-2 space-y-4">
              <div className={`p-5 border rounded-xl shadow-xs space-y-4 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-xs text-white">Student Academic Ledger Sheet</h3>
                    <p className="text-[10px] text-slate-500">Official grades ledger & calculated GPA metrics.</p>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {/* Download Full Gradebook PDF Button */}
                    <button
                      onClick={downloadFullGradebook}
                      className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-lg text-[11px] font-bold cursor-pointer shadow-xs transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Full Gradebook
                    </button>

                    {/* Search box */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search enrolled students..."
                        value={gradeBookSearch}
                        onChange={(e) => setGradeBookSearch(e.target.value)}
                        className={`text-[11px] pl-8 pr-3 py-2 rounded-lg border w-full sm:w-48 focus:outline-hidden ${
                          darkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {(() => {
                  const enrolledStudents = gradeBookStudents.filter(
                    s => s.courseEnrolled === selectedGradeBookCourseId
                  );
                  const filteredStudents = enrolledStudents.filter(
                    s => s.fullName.toLowerCase().includes(gradeBookSearch.toLowerCase()) || s.id.toLowerCase().includes(gradeBookSearch.toLowerCase())
                  );

                  if (enrolledStudents.length === 0) {
                    const availableDemostudents = gradeBookStudents.filter(s => s.courseEnrolled !== selectedGradeBookCourseId);
                    return (
                      <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-lg space-y-4">
                        <User className="w-8 h-8 text-slate-500 mx-auto" />
                        <div>
                          <p className="text-xs font-bold text-white">No Students Registered in this Course</p>
                          <p className="text-[10px] text-slate-500 mt-1">There are no mock student database records enrolled under this course code.</p>
                        </div>
                        {availableDemostudents.length > 0 && (
                          <div className="space-y-2 max-w-sm mx-auto pt-2">
                            <span className="text-[9px] font-bold text-slate-400 block">Quick-assign a mock student to populate ledger:</span>
                            <div className="flex flex-wrap gap-1.5 justify-center">
                              {availableDemostudents.slice(0, 3).map(student => (
                                <button
                                  key={student.id}
                                  onClick={() => handleQuickEnrollStudent(student.id)}
                                  className="px-2.5 py-1 text-[9px] font-extrabold bg-cyan-900/40 text-cyan-300 hover:bg-cyan-900/60 rounded border border-cyan-800/40 cursor-pointer"
                                >
                                  + Enroll {student.fullName.split(" ")[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (filteredStudents.length === 0) {
                    return (
                      <div className="text-center py-10 px-4">
                        <p className="text-xs text-slate-500 italic">No students match your search criteria.</p>
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase font-bold tracking-wider">
                          <tr>
                            <th className="p-3 text-slate-400">Student Details</th>
                            <th className="p-3 text-slate-400">Module Assessments Grades</th>
                            <th className="p-3 text-center text-slate-400">Calculated GPA</th>
                            <th className="p-3 text-right text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {filteredStudents.map(student => {
                            const results = computeStudentGrades(student);
                            if (!results) return null;

                            return (
                              <tr key={student.id} className="hover:bg-slate-900/20 group border-b border-slate-800/40">
                                <td className="p-3">
                                  <div className="flex items-center gap-2.5">
                                    <img
                                      src={student.passportPhoto}
                                      alt={student.fullName}
                                      className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div>
                                      <span className="text-xs font-bold text-white block group-hover:text-cyan-400 transition-colors">
                                        {student.fullName}
                                      </span>
                                      <span className="text-[9px] font-mono text-slate-500 block">
                                        {student.id} | Adm: {student.admissionNo}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="p-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {results.moduleResults.map(modRes => (
                                      <div key={modRes.moduleId} className="p-2 rounded-lg bg-slate-950/40 border border-slate-850/60 space-y-1">
                                        <div className="flex justify-between items-center text-[9px]">
                                          <span className="font-bold text-slate-400 truncate max-w-[80px]" title={modRes.title}>
                                            {modRes.title}
                                          </span>
                                          <span className={`font-black uppercase px-1 py-0.2 rounded text-[8px] border ${modRes.color}`}>
                                            {modRes.grade}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-[11px] font-mono font-bold text-white">
                                            {modRes.averageScore}%
                                          </span>
                                          <span className="text-[8px] font-bold text-slate-500 font-mono">
                                            GPA: {modRes.gpa.toFixed(1)}
                                          </span>
                                        </div>
                                        {/* Nested tiny bullet points on hover */}
                                        <div className="text-[8px] text-slate-500 leading-tight border-t border-slate-900/80 pt-1 mt-1 font-mono flex flex-wrap gap-x-2 gap-y-0.5">
                                          {modRes.assessments.map((assBreak, i) => (
                                            <span key={i}>
                                              {assBreak.title.split(" ").map(w => w[0]).join("")}: <strong className="text-slate-300">{assBreak.score}</strong>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </td>

                                <td className="p-3 text-center">
                                  <div className="inline-flex flex-col items-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-black border tracking-wider ${results.finalGpaColor}`}>
                                      {results.finalGpa.toFixed(2)} GPA
                                    </span>
                                    <span className="text-[8px] text-slate-500 font-bold mt-1 uppercase">
                                      Grade Average: {results.finalGrade}
                                    </span>
                                  </div>
                                </td>

                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedStudentForInput(student);
                                      const marksObj: Record<string, string> = {};
                                      const courseAsses = gradeBookAssessments.filter(a => a.courseId === student.courseEnrolled);
                                      courseAsses.forEach(ass => {
                                        marksObj[ass.id] = String(gradeBookMarks[student.id]?.[ass.id] ?? 70);
                                      });
                                      setTempMarks(marksObj);
                                    }}
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-lg border border-slate-800/80 transition-all inline-flex items-center gap-1 cursor-pointer font-bold text-[10px]"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    Input Marks
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =============================
          MODAL: CREATE NEW EXAM
          ============================= */}
      {showCreateExamModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-extrabold text-sm text-white">Create Board Assessment Exam</h3>
                <button onClick={() => setShowCreateExamModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateExamSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Assessment Evaluation Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cisco Subnetting Mid-Term Assessment"
                    value={newExam.title}
                    onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Target Course Syllabus</label>
                    <select
                      value={newExam.courseId}
                      onChange={(e) => setNewExam({...newExam, courseId: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={newExam.date}
                      onChange={(e) => setNewExam({...newExam, date: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Exam Duration</label>
                    <input
                      type="text"
                      placeholder="2 Hours"
                      value={newExam.duration}
                      onChange={(e) => setNewExam({...newExam, duration: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Pass Mark Score Threshold (%)</label>
                    <input
                      type="number"
                      placeholder="70"
                      value={newExam.passMark}
                      onChange={(e) => setNewExam({...newExam, passMark: Number(e.target.value)})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Publish Exam Assessment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =============================
          MODAL: ADD QUESTION
          ============================= */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-extrabold text-sm text-white">Add Question to Faculty Bank</h3>
                <button onClick={() => setShowCreateQuestionModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleCreateQuestionSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Syllabus Topic Course Allocation</label>
                  <select
                    value={newQuestion.courseId}
                    onChange={(e) => setNewQuestion({...newQuestion, courseId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Question Statement Text *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Type the theoretical question or laboratory sandbox description clearly..."
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({...newQuestion, questionText: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Option A *</label>
                    <input
                      type="text"
                      required
                      placeholder="Option text"
                      value={newQuestion.optionA}
                      onChange={(e) => setNewQuestion({...newQuestion, optionA: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Option B *</label>
                    <input
                      type="text"
                      required
                      placeholder="Option text"
                      value={newQuestion.optionB}
                      onChange={(e) => setNewQuestion({...newQuestion, optionB: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Option C</label>
                    <input
                      type="text"
                      placeholder="Option text (optional)"
                      value={newQuestion.optionC}
                      onChange={(e) => setNewQuestion({...newQuestion, optionC: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Option D</label>
                    <input
                      type="text"
                      placeholder="Option text (optional)"
                      value={newQuestion.optionD}
                      onChange={(e) => setNewQuestion({...newQuestion, optionD: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Index of Correct Option (0 = A, 1 = B, 2 = C, 3 = D)</label>
                  <select
                    value={newQuestion.correctIndex}
                    onChange={(e) => setNewQuestion({...newQuestion, correctIndex: Number(e.target.value)})}
                    className="w-32 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value={0}>A</option>
                    <option value={1}>B</option>
                    <option value={2}>C</option>
                    <option value={3}>D</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                >
                  Log to Question Bank
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =============================
          MODAL: INPUT ASSESSMENT MARKS
          ============================= */}
      {selectedStudentForInput && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-left">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-emerald-500 h-2"></div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Input Module Assessment Marks</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Grading ledger for <strong className="text-cyan-400">{selectedStudentForInput.fullName}</strong> ({selectedStudentForInput.id})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudentForInput(null);
                    setTempMarks({});
                  }}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMarksSubmit} className="space-y-4 text-xs text-slate-300">
                <div className="max-h-[350px] overflow-y-auto pr-1 space-y-4">
                  {(() => {
                    const studentCourse = courses.find(c => c.id === selectedStudentForInput.courseEnrolled);
                    if (!studentCourse) return <p className="text-xs text-slate-500 italic">No syllabus associated with this student.</p>;

                    const courseMods = studentCourse.modules || [];
                    return courseMods.map(mod => {
                      const modAsses = gradeBookAssessments.filter(
                        a => a.courseId === selectedStudentForInput.courseEnrolled && a.moduleId === mod.id
                      );

                      return (
                        <div key={mod.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-850 space-y-3 text-left">
                          <h4 className="font-extrabold text-[11px] text-cyan-300 border-b border-slate-850 pb-1.5 uppercase tracking-wider">
                            {mod.id}: {mod.title}
                          </h4>

                          {modAsses.length === 0 ? (
                            <p className="text-[10px] text-slate-500 italic">No assessments defined for this module.</p>
                          ) : (
                            <div className="space-y-3">
                              {modAsses.map(ass => {
                                const currentVal = tempMarks[ass.id] || "0";
                                return (
                                  <div key={ass.id} className="space-y-1.5 text-left">
                                    <div className="flex justify-between items-center">
                                      <span className="font-bold text-slate-300">
                                        {ass.title} <span className="text-[9px] text-slate-500 font-mono font-normal">({ass.weight}% weight)</span>
                                      </span>
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={currentVal}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setTempMarks(prev => ({
                                              ...prev,
                                              [ass.id]: val
                                            }));
                                          }}
                                          className="w-14 text-center text-xs font-mono font-bold p-1 rounded border bg-slate-900 border-slate-800 text-cyan-300 focus:outline-hidden"
                                        />
                                        <span className="text-[10px] text-slate-500 font-bold">/ 100</span>
                                      </div>
                                    </div>
                                    
                                    {/* Responsive touch slider */}
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={isNaN(Number(currentVal)) ? 0 : Number(currentVal)}
                                        onChange={(e) => {
                                          const val = e.target.value;
                                          setTempMarks(prev => ({
                                            ...prev,
                                            [ass.id]: val
                                          }));
                                        }}
                                        className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                      />
                                      <span className="text-[10px] font-mono text-slate-500 font-extrabold w-6 text-right">
                                        {currentVal}%
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Real-time mock preview inside modal */}
                {(() => {
                  const simulatedStudent: Student = {
                    ...selectedStudentForInput,
                  };
                  
                  const courseId = simulatedStudent.courseEnrolled;
                  const course = courses.find(c => c.id === courseId);
                  if (!course) return null;

                  let totalGpaPoints = 0;
                  let totalModuleWeightSum = 0;
                  let overallScoreSum = 0;

                  const modules = course.modules || [];
                  modules.forEach(mod => {
                    const modAsses = gradeBookAssessments.filter(
                      a => a.courseId === courseId && a.moduleId === mod.id
                    );

                    let weightedScoreSum = 0;
                    let weightSum = 0;

                    modAsses.forEach(ass => {
                      const studentScore = tempMarks[ass.id] !== undefined ? Number(tempMarks[ass.id]) : 70;
                      weightedScoreSum += (isNaN(studentScore) ? 0 : studentScore) * ass.weight;
                      weightSum += ass.weight;
                    });

                    const averageScore = weightSum > 0 ? weightedScoreSum / weightSum : 0;
                    const { gpa } = getGradeAndGpa(averageScore);

                    const modWeight = courseModuleWeights[courseId]?.[mod.id] ?? 50;
                    totalGpaPoints += gpa * modWeight;
                    totalModuleWeightSum += modWeight;
                    overallScoreSum += averageScore * modWeight;
                  });

                  const finalGpa = totalModuleWeightSum > 0 ? totalGpaPoints / totalModuleWeightSum : 0;
                  const finalScore = totalModuleWeightSum > 0 ? overallScoreSum / totalModuleWeightSum : 0;
                  const overallGradeObj = getGradeAndGpa(finalScore);

                  return (
                    <div className="p-3 bg-[#111928] border border-slate-800 rounded-xl flex justify-between items-center text-left">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Real-time Calculation Preview</span>
                        <span className="text-[11px] text-slate-300 block mt-0.5">
                          Calculated score: <strong className="text-white font-mono">{Math.round(finalScore)}%</strong>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${overallGradeObj.color}`}>
                          {overallGradeObj.grade} | {finalGpa.toFixed(2)} GPA
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStudentForInput(null);
                      setTempMarks({});
                    }}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Save Academic Marks
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =============================
          MODAL: ADD CUSTOM ASSESSMENT
          ============================= */}
      {showAddAssessmentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-45 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-left">
            <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  Add Custom Assessment
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddAssessmentModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAssessmentSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Assessment Evaluation Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hands-on Vulnerability Scanner Script Lab"
                    value={newAssessment.title}
                    onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Target Module</label>
                    <select
                      value={newAssessment.moduleId}
                      onChange={(e) => setNewAssessment({ ...newAssessment, moduleId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden cursor-pointer"
                    >
                      {(() => {
                        const activeCourse = courses.find(c => c.id === selectedGradeBookCourseId);
                        return activeCourse?.modules?.map(m => (
                          <option key={m.id} value={m.id}>
                            [{m.id}] {m.title}
                          </option>
                        )) || <option value="">No Modules</option>;
                      })()}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Assessment Weight (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newAssessment.weight}
                      onChange={(e) => setNewAssessment({ ...newAssessment, weight: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-950/20 border border-amber-800/20 rounded-lg text-[10px] text-amber-500 leading-relaxed">
                  Note: Adding a custom assessment will automatically adjust weights inside the targeted module to maintain proportional grading integrity.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  Create Assessment Entry
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from "react";
import {
  Award,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Mail,
  QrCode,
  CheckCircle,
  XCircle,
  X,
  FileText,
  ScanLine,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertCircle,
  FileDown
} from "lucide-react";
import { Certificate, Student, Course } from "../types";
import { exportToCSV, exportToPDF } from "../utils/exportUtils";

interface CertificatesPageProps {
  students: Student[];
  courses: Course[];
  certificates: Certificate[];
  darkMode: boolean;
  onAddCertificate: (cert: Certificate) => void;
  onOpenQrOverlay: () => void;
}

export default function CertificatesPage({
  students,
  courses,
  certificates,
  darkMode,
  onAddCertificate,
  onOpenQrOverlay
}: CertificatesPageProps) {
  // States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("All");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [activeViewingCertificate, setActiveViewingCertificate] = useState<Certificate | null>(null);

  // Form state
  const [newCert, setNewCert] = useState({
    studentId: students[0]?.id || "",
    courseId: courses[0]?.id || "",
    issueDate: new Date().toISOString().split("T")[0]
  });

  const handleGenerateCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.studentId || !newCert.courseId) {
      alert("Please select Student and Course.");
      return;
    }

    const selStudent = students.find(s => s.id === newCert.studentId);
    const selCourse = courses.find(c => c.id === newCert.courseId);

    if (!selStudent || !selCourse) return;

    // Check if student already has certificate
    const exists = certificates.some(c => c.studentId === selStudent.id && c.courseName === selCourse.name);
    if (exists) {
      alert("Student already has an active certification on ledger for this course!");
      return;
    }

    const created: Certificate = {
      certificateNumber: `ETA-CERT-2026-${100 + certificates.length + 1}`,
      studentId: selStudent.id,
      studentName: selStudent.fullName,
      courseId: selCourse.id,
      courseName: selCourse.name,
      issueDate: newCert.issueDate,
      verificationUrl: `${window.location.origin}/verify/ETA-CERT-2026-${100 + certificates.length + 1}`,
      qrCodeData: `https://enotech.academy/verify/ETA-CERT-2026-${100 + certificates.length + 1}`,
      status: "Valid",
      signatures: {
        principal: "Enock Omato",
        instructor: "Enock Omato",
      },
    };

    onAddCertificate(created);
    setShowGenerateModal(false);
    alert(`Certificate generated successfully for student ${created.studentName}. Certification serial code: ${created.certificateNumber}`);
  };

  const filteredCerts = certificates.filter(c => {
    const matchesSearch = c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourseId === "All" || courses.find(cr => cr.id === selectedCourseId)?.name === c.courseName;
    return matchesSearch && matchesCourse;
  });

  const handleExportCSV = () => {
    const headers = ["Certificate Number", "Student ID", "Student Name", "Course ID", "Course Name", "Issue Date", "Status"];
    const keys = ["certificateNumber", "studentId", "studentName", "courseId", "courseName", "issueDate", "status"];
    exportToCSV(filteredCerts, "certificates_register", headers, keys);
  };

  const handleExportPDF = () => {
    const headers = ["Cert Number", "Student Name", "Course Name", "Issue Date", "Status"];
    const keys = ["certificateNumber", "studentName", "courseName", "issueDate", "status"];
    exportToPDF("EnoTech Board Certifications Register Report", headers, keys, filteredCerts);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">EnoTech Board Certifications Register</h2>
          <p className="text-xs text-slate-400">Assemble official student computer certificates, generate digital QR validations codes, or scan graduates QR credentials.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 hover:scale-[1.01] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Issue Certificate
          </button>

          <button
            onClick={onOpenQrOverlay}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <ScanLine className="w-3.5 h-3.5 text-cyan-400" /> Verify QR Scanner
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Issued Certifications</span>
          <span className="text-2xl font-black mt-1 block">{certificates.length} Certs</span>
          <span className="text-[9px] text-slate-500 block mt-1">Directly signed by Principal</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Verified Registrations</span>
          <span className="text-2xl font-black text-emerald-500 mt-1 block">100% Secure</span>
          <span className="text-[9px] text-slate-500 block mt-1">QR verification ledger active</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Pending Print queues</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">0 Pendings</span>
          <span className="text-[9px] text-slate-500 block mt-1">Batch printed on parchment</span>
        </div>

        <div className={`p-4 border rounded-xl shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Course Completions Rate</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">94.8%</span>
          <span className="text-[9px] text-slate-500 block mt-1">Student evaluation complete</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className={`p-4 border rounded-xl shadow-xs space-y-3 ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search graduates name, unique serial certification codes, courses title..."
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

      {/* Certificates Board Grid */}
      <div className={`border rounded-xl overflow-hidden shadow-sm ${darkMode ? "bg-[#111928] border-slate-800" : "bg-white border-slate-100"}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Student Name / ID</th>
                <th className="p-4">Syllabus Course Title</th>
                <th className="p-4">Issue Date logs</th>
                <th className="p-4">Serial code</th>
                <th className="p-4 text-center">QR Code</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800">
              {filteredCerts.map(cert => (
                <tr key={cert.certificateNumber} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="p-4 font-mono font-bold text-slate-400">{cert.certificateNumber}</td>
                  
                  <td className="p-4">
                    <span className="font-extrabold text-slate-900 dark:text-white block">{cert.studentName}</span>
                    <span className="text-[10px] text-slate-400 font-mono block">{cert.studentId}</span>
                  </td>

                  <td className="p-4 font-bold text-blue-500">{cert.courseName}</td>
                  
                  <td className="p-4 font-mono font-semibold text-slate-400">{cert.issueDate}</td>
                  
                  <td className="p-4 font-mono font-bold text-cyan-400">{cert.certificateNumber}</td>

                  <td className="p-4 text-center">
                    <QrCode className="w-5 h-5 text-slate-400 mx-auto cursor-pointer" onClick={() => {
                      setActiveViewingCertificate(cert);
                    }} />
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase text-[9px] tracking-wider">
                      {cert.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setActiveViewingCertificate(cert)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold"
                    >
                      Print Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =======================================
          MODAL: GENERATE NEW CERTIFICATE FORM
          ======================================= */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#0c1220] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-700 via-cyan-600 to-orange-500 h-2"></div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="font-bold text-sm text-white">Generate Official Board Certificate</h3>
                <button onClick={() => setShowGenerateModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>

              <form onSubmit={handleGenerateCertificateSubmit} className="space-y-4 text-xs text-slate-300">
                <div>
                  <label className="block text-slate-400 mb-1">Select Graduate Student *</label>
                  <select
                    value={newCert.studentId}
                    onChange={(e) => setNewCert({...newCert, studentId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.id})</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Select Completed Course track *</label>
                  <select
                    value={newCert.courseId}
                    onChange={(e) => setNewCert({...newCert, courseId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Certification Date of Issue</label>
                  <input
                    type="date"
                    value={newCert.issueDate}
                    onChange={(e) => setNewCert({...newCert, issueDate: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    By submitting, the certification record is logged directly onto the secure public verification registry. Graduates can be proctored using the institution's camera QR verification scanner.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold"
                >
                  Publish Certified Record
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =======================================
          OFFICIAL PARCHMENT PRINTABLE CERTIFICATE
          ======================================= */}
      {activeViewingCertificate && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl p-8 space-y-6 shadow-2xl border border-slate-200">
            
            <div className="flex justify-between items-center border-b pb-3 no-print">
              <span className="text-xs font-bold text-slate-500 uppercase">BOARD CERTIFICATE PREVIEW</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Certificate
                </button>
                <button
                  onClick={() => setActiveViewingCertificate(null)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Certificate Template Body */}
            <div className="border-8 border-double border-amber-800/80 p-8 space-y-6 text-center bg-stone-50 relative overflow-hidden">
              {/* Filigree Background decoration */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
                <Award className="w-[300px] h-[300px] text-amber-900" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-serif italic text-amber-800 block">EnoTech Academy Certification board</span>
                <h1 className="text-2xl font-serif text-slate-900 uppercase font-black tracking-widest mt-1">Certificate of Completion</h1>
              </div>

              <p className="text-[11px] text-slate-500 font-serif italic max-w-md mx-auto">
                This is to officially certify that the academic board has examined and approved the educational technical modules completed by:
              </p>

              <div className="space-y-1 py-1.5">
                <h2 className="text-xl font-serif font-black underline uppercase text-slate-900">{activeViewingCertificate.studentName}</h2>
                <span className="text-[10px] text-slate-400 font-mono block">Admission Registry: {activeViewingCertificate.studentId}</span>
              </div>

              <p className="text-xs text-slate-600 font-serif max-w-md mx-auto">
                For successful orientation, laboratory exercises, exams evaluation, and proctored completion of:
              </p>

              <h3 className="text-md font-serif font-black text-amber-800 uppercase tracking-wide">
                {activeViewingCertificate.courseName}
              </h3>

              <div className="pt-4 grid grid-cols-3 gap-4 items-end text-left text-[11px] border-t border-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Issue Date</span>
                  <span className="font-mono font-bold text-slate-800">{activeViewingCertificate.issueDate}</span>
                </div>

                <div className="text-center">
                  <div className="w-14 h-14 bg-slate-200 mx-auto rounded flex items-center justify-center mb-1">
                    <QrCode className="w-10 h-10 text-slate-900" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block">Serial: {activeViewingCertificate.serialNumber}</span>
                </div>

                <div className="text-right">
                  <span className="font-serif italic text-[13px] text-blue-900 font-bold block">Enock Omato</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block border-t pt-1">Principal Director</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveViewingCertificate(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 cursor-pointer text-xs"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

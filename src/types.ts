/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Super Administrator" | "Instructor" | "Student" | "Guest";

export type LearningMode = "Online" | "Physical" | "Hybrid";

export type StudentStatus = "Active" | "Completed" | "Dropped" | "Suspended";

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export type AssetStatus = "Operational" | "Maintenance" | "Broken";

export interface Course {
  id: string;
  name: string;
  description: string;
  category: string;
  durationWeeks: number;
  totalFees: number;
  duration?: string;
  instructorName?: string;
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      type: "video" | "pdf" | "text" | "quiz";
      duration?: string;
      url?: string;
      content?: string;
    }[];
  }[];
}

export interface Student {
  id: string; // Auto-generated e.g., ET-2026-1042
  admissionNo: string;
  fullName: string;
  passportPhoto: string; // base64 or placeholder URL
  gender: "Male" | "Female" | "Other";
  dob: string;
  nationalId: string;
  passportNumber?: string;
  nationality: string;
  county: string;
  subCounty: string;
  ward: string;
  village?: string;
  guardian: string;
  parentPhone: string;
  parentEmail?: string;
  address: string;
  emergencyContact: string;
  courseEnrolled: string; // Course ID
  duration: string; // e.g., "3 Months"
  batch: string; // e.g., "Morning Batch A"
  class: string; // e.g., "Room 3 - Tech Hub"
  learningMode: LearningMode;
  registrationDate: string;
  expectedCompletionDate: string;
  status: StudentStatus;
  achievements: string[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  markedBy: string;
  notes?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  files: { name: string; size: string }[];
  textAnswers?: string;
  marks?: number;
  gradeStatus: "Pending" | "Graded" | "Late";
  feedback?: string;
  gradedBy?: string;
}

export interface QuizQuestion {
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface StudentQuizAttempt {
  id: string;
  studentId: string;
  courseId: string;
  quizTitle: string;
  score: number; // e.g., 80 for 80%
  totalQuestions: number;
  passed: boolean;
  date: string;
}

export interface Certificate {
  certificateNumber: string; // e.g., ET-CERT-2026-8910
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  issueDate: string;
  verificationUrl: string;
  qrCodeData: string;
  status: "Valid" | "Expired" | "Cancelled";
  signatures: {
    principal: string;
    instructor: string;
  };
}

export interface Transaction {
  id: string;
  type: "Income" | "Expense";
  category: string; // e.g., "Tution Fees", "Lab Supplies", "Electricity", "Salaries"
  amount: number;
  date: string;
  description: string;
  paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash" | "Card";
  studentId?: string; // If tution fee
  studentName?: string;
  referenceNo?: string; // M-Pesa Code / Bank TX Ref
}

export interface LabAsset {
  id: string;
  name: string;
  type: "Computer" | "Projector" | "Router" | "Switch" | "Ups" | "Other";
  assetTag: string; // e.g., ETA-PC-024
  status: AssetStatus;
  labRoom: string; // e.g., "Lab A", "Lab B", "Lecture Hall 1"
  lastInspectionDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  audience: "All" | "Instructors" | "Students";
  pinned: boolean;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress?: string;
}

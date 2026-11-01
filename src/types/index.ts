export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  department: string;
  enrollmentNo?: string;
  phone?: string;
  semester?: number;
  academicYear?: string;
  avatarUrl?: string;
  isApproved: boolean;
  status?: 'Active' | 'Pending Approval' | 'Suspended';
  password?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  hodName: string;
  establishedYear: number;
  totalIntake: number;
  icon: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  departmentId: string;
  level: 'UG' | 'PG' | 'Diploma' | 'Doctoral';
  durationSemesters: number;
  credits: number;
  eligibility: string;
  description: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  type: 'Theory' | 'Practical' | 'Elective';
}

export interface TimetableSlot {
  id: string;
  department: string;
  semester: number;
  section: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  periodStart: string;
  periodEnd: string;
  subjectName: string;
  facultyName: string;
  roomNumber: string;
}

export interface AttendanceRecord {
  id: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastDate: string;
  status: 'Safe' | 'Warning' | 'Critical';
}

export interface AttendanceLog {
  id: string;
  date: string;
  subjectName: string;
  facultyName: string;
  status: 'Present' | 'Absent';
  period: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectName: string;
  department: string;
  facultyName: string;
  semester: number;
  dueDate: string;
  maxMarks: number;
  attachmentUrl?: string;
  status?: 'Pending' | 'Submitted' | 'Graded';
  marksObtained?: number;
  submittedAt?: string;
  submissionFile?: string;
  feedback?: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  enrollmentNo: string;
  submittedAt: string;
  fileName: string;
  fileSize: string;
  status: 'Submitted' | 'Graded';
  marksObtained?: number;
  maxMarks: number;
  feedback?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subjectName: string;
  department: string;
  semester: number;
  uploadedBy: string;
  fileType: 'PDF' | 'DOCX' | 'ZIP' | 'VIDEO';
  fileSize: string;
  downloadUrl: string;
  downloadCount: number;
  uploadedAt: string;
}

export interface Examination {
  id: string;
  title: string;
  type: 'Internal-1' | 'Internal-2' | 'Semester End' | 'Practical';
  department: string;
  semester: number;
  startDate: string;
  endDate: string;
  instructions: string;
  isPublished: boolean;
}

export interface ExamResult {
  id: string;
  semester: number;
  academicYear: string;
  examType: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  gradePoints: number;
}

export interface SemesterResultSummary {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  status: 'Passed' | 'Distinction' | 'Pending';
  results: ExamResult[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'academic' | 'examination' | 'events' | 'admission' | 'general';
  targetAudience: 'all' | 'students' | 'faculty';
  content: string;
  publishedBy: string;
  isPinned: boolean;
  date: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'notice' | 'attendance_warning' | 'assignment' | 'result' | 'approval';
  isRead: boolean;
  createdAt: string;
}

export interface FeeRecord {
  id: string;
  semester: number;
  academicYear: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  totalAmount: number;
  paidAmount: number;
  status: 'Paid' | 'Partial' | 'Pending';
  receiptNo: string;
  transactionRef: string;
  dueDate: string;
  paymentDate?: string;
}

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: 'Infrastructure' | 'Academic' | 'Hostel' | 'Canteen' | 'Transportation' | 'Other';
  subject: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  response?: string;
  createdAt: string;
}

export interface CampusFacility {
  id: string;
  name: string;
  category: string;
  description: string;
  capacity: string;
  timings: string;
  incharge: string;
  imageUrl: string;
  specs: string[];
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  timestamp: string;
}

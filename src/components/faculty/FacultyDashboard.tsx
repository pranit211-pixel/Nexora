import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  Upload,
  Plus,
  UserPlus,
  Award,
  BookOpen,
  Clock,
  Check,
  X,
  AlertCircle,
  Eye,
  Send,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Notice,
  TimetableSlot,
  AttendanceRecord,
  AttendanceLog,
  UserProfile
} from '../../types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_FACULTY_ASSIGNMENTS_ROSTER,
  INITIAL_STUDY_MATERIALS,
  INITIAL_TIMETABLE,
  getStoredData,
  setStoredData
} from '../../integrations/supabase/mockDb';

type FacultyTab =
  | 'overview'
  | 'attendance'
  | 'assignments'
  | 'submissions'
  | 'materials'
  | 'internal_marks'
  | 'timetable';

interface StudentRosterItem {
  id: string;
  name: string;
  enrollment: string;
  present: boolean;
}

export const FacultyDashboard: React.FC = () => {
  const { user, addAuditLog, createStudentAccount } = useAuth();
  const [activeTab, setActiveTab] = useState<FacultyTab>('overview');

  // Interactive roster for attendance marking (dynamically loads registered students)
  const [roster, setRoster] = useState<StudentRosterItem[]>(() => {
    const saved = getStoredData<StudentRosterItem[]>('faculty_roster', []);
    const allUsers = getStoredData<UserProfile[]>('registered_users', []);
    const students = allUsers.filter((u) => u.role === 'student' && u.isApproved);
    const map = new Map<string, StudentRosterItem>();
    saved.forEach((r) => map.set(r.id, r));
    students.forEach((stu) => {
      if (!map.has(stu.id)) {
        map.set(stu.id, {
          id: stu.id,
          name: stu.fullName,
          enrollment: stu.enrollmentNo || `NX-2026-${stu.id.slice(-4)}`,
          present: false, // Default false - no default attendance!
        });
      }
    });
    return Array.from(map.values());
  });

  const [sessionTopic, setSessionTopic] = useState('Deep Neural Networks & Vision Lab');
  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Enroll Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStuName, setNewStuName] = useState('');
  const [newStuEmail, setNewStuEmail] = useState('');
  const [newStuEnrollment, setNewStuEnrollment] = useState('');
  const [newStuSemester, setNewStuSemester] = useState('5');
  const [newStuPassword, setNewStuPassword] = useState('');
  const [stuSubmitting, setStuSubmitting] = useState(false);

  // Assignments & Submissions
  const [assignments, setAssignments] = useState<Assignment[]>(() =>
    getStoredData('assignments', INITIAL_ASSIGNMENTS)
  );
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() =>
    getStoredData('faculty_submissions', INITIAL_FACULTY_ASSIGNMENTS_ROSTER)
  );

  // Study materials
  const [materials, setMaterials] = useState<StudyMaterial[]>(() =>
    getStoredData('study_materials', INITIAL_STUDY_MATERIALS)
  );

  // Timetable
  const [timetable] = useState<TimetableSlot[]>(() =>
    getStoredData('timetable', INITIAL_TIMETABLE)
  );

  // Modals
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDesc, setNewAsgDesc] = useState('');
  const [newAsgDue, setNewAsgDue] = useState('2026-11-20');
  const [newAsgMarks, setNewAsgMarks] = useState('50');

  // Evaluation modal
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeMarks, setGradeMarks] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Upload Material modal
  const [showUploadMaterial, setShowUploadMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matSubject, setMatSubject] = useState('Deep Neural Networks & Vision');
  const [matType, setMatType] = useState<'PDF' | 'DOCX' | 'ZIP'>('PDF');

  // Toggle student present/absent
  const toggleAttendance = (id: string) => {
    setRoster((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const markAll = (status: boolean) => {
    setRoster((prev) => prev.map((s) => ({ ...s, present: status })));
  };

  const handleEnrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStuName || !newStuEmail || !newStuPassword) {
      alert('Please fill student name, email, and designated password.');
      return;
    }

    setStuSubmitting(true);
    try {
      const generatedEnrollment = newStuEnrollment.trim() || `NX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const res = await createStudentAccount({
        fullName: newStuName.trim(),
        email: newStuEmail.trim(),
        password: newStuPassword.trim(),
        enrollmentNo: generatedEnrollment,
        department: user?.department || 'Artificial Intelligence & Data Science',
        semester: parseInt(newStuSemester, 10) || 5,
      });

      if (res.success && res.user) {
        const newRosterItem: StudentRosterItem = {
          id: res.user.id,
          name: res.user.fullName,
          enrollment: res.user.enrollmentNo || generatedEnrollment,
          present: false, // Zero attendance initially!
        };
        const updatedRoster = [...roster, newRosterItem];
        setRoster(updatedRoster);
        setStoredData('faculty_roster', updatedRoster);

        setShowAddStudentModal(false);
        setNewStuName('');
        setNewStuEmail('');
        setNewStuEnrollment('');
        setNewStuPassword('');
        alert(
          `Student Enrolled Successfully!\n\nName: ${res.user.fullName}\nEmail: ${res.user.email}\nPassword: ${newStuPassword.trim()}\nEnrollment: ${generatedEnrollment}\n\nThe student can now directly log in to the portal with this password. Initial attendance is 0% until marked.`
        );
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to enroll student.');
    } finally {
      setStuSubmitting(false);
    }
  };

  const handleSaveAttendance = () => {
    setStoredData('faculty_roster', roster);
    const presentCount = roster.filter((s) => s.present).length;

    // Log institutional audit
    addAuditLog(
      'MARK_ATTENDANCE',
      'AttendanceSession',
      'AIDS-501',
      `Faculty ${user?.fullName || 'Instructor'} marked attendance for "${sessionTopic}" on ${sessionDate}: ${presentCount}/${roster.length} scholars present`
    );

    // Save attendance log
    const existingLogs = getStoredData<AttendanceLog[]>('attendance_logs', []);
    const newLog: AttendanceLog = {
      id: 'log_' + Date.now(),
      date: sessionDate,
      subjectName: sessionTopic,
      facultyName: user?.fullName || 'Dr. Marcus Sterling',
      status: presentCount > 0 ? 'Present' : 'Absent',
      period: '09:00 - 10:30',
    };
    setStoredData('attendance_logs', [newLog, ...existingLogs]);

    // Update real attendance for each enrolled student
    roster.forEach((student) => {
      const studentAttKey = 'student_attendance_' + student.id;
      const currentRecords = getStoredData<AttendanceRecord[]>(studentAttKey, []);
      const existingSubIndex = currentRecords.findIndex(
        (r) => r.subjectName.toLowerCase() === sessionTopic.toLowerCase()
      );

      let updatedRecords: AttendanceRecord[];
      if (existingSubIndex >= 0) {
        const existing = currentRecords[existingSubIndex];
        const newTotal = existing.totalClasses + 1;
        const newAttended = existing.attendedClasses + (student.present ? 1 : 0);
        const newPct = Math.round((newAttended / newTotal) * 1000) / 10;
        updatedRecords = [...currentRecords];
        updatedRecords[existingSubIndex] = {
          ...existing,
          totalClasses: newTotal,
          attendedClasses: newAttended,
          percentage: newPct,
          lastDate: sessionDate,
          status: newPct >= 75 ? 'Safe' : 'Warning',
        };
      } else {
        const isPres = student.present;
        const newRec: AttendanceRecord = {
          id: 'att_' + Date.now() + '_' + student.id.slice(-4),
          subjectName: sessionTopic,
          totalClasses: 1,
          attendedClasses: isPres ? 1 : 0,
          percentage: isPres ? 100.0 : 0.0,
          lastDate: sessionDate,
          status: isPres ? 'Safe' : 'Warning',
        };
        updatedRecords = [...currentRecords, newRec];
      }
      setStoredData(studentAttKey, updatedRecords);
    });

    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 3000);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;

    const newAssignment: Assignment = {
      id: 'asg_' + Date.now(),
      title: newAsgTitle,
      description: newAsgDesc,
      subjectName: 'Deep Neural Networks & Vision',
      department: 'Artificial Intelligence & Data Science',
      facultyName: user?.fullName || 'Dr. Marcus Sterling',
      semester: 5,
      dueDate: `${newAsgDue}T23:59:00Z`,
      maxMarks: parseInt(newAsgMarks, 10) || 50,
      status: 'Pending',
    };

    const updated = [newAssignment, ...assignments];
    setAssignments(updated);
    setStoredData('assignments', updated);
    addAuditLog('CREATE_ASSIGNMENT', 'Assignment', newAssignment.id, `Created assignment: ${newAsgTitle}`);

    setShowCreateAssignment(false);
    setNewAsgTitle('');
    setNewAsgDesc('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = submissions.map((sub) => {
      if (sub.id === gradingSubmission.id) {
        return {
          ...sub,
          marksObtained: parseInt(gradeMarks, 10),
          feedback: gradeFeedback,
          status: 'Graded' as const,
        };
      }
      return sub;
    });

    setSubmissions(updated);
    setStoredData('faculty_submissions', updated);
    addAuditLog(
      'GRADE_SUBMISSION',
      'AssignmentSubmission',
      gradingSubmission.id,
      `Graded student ${gradingSubmission.studentName}: ${gradeMarks}/${gradingSubmission.maxMarks}`
    );

    setGradingSubmission(null);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle) return;

    const newMaterial: StudyMaterial = {
      id: 'mat_' + Date.now(),
      title: matTitle,
      subjectName: matSubject,
      department: 'Artificial Intelligence & Data Science',
      semester: 5,
      uploadedBy: user?.fullName || 'Dr. Marcus Sterling',
      fileType: matType,
      fileSize: '12.4 MB',
      downloadUrl: '#',
      downloadCount: 0,
      uploadedAt: new Date().toISOString().substring(0, 10),
    };

    const updated = [newMaterial, ...materials];
    setMaterials(updated);
    setStoredData('study_materials', updated);
    addAuditLog('UPLOAD_MATERIAL', 'StudyMaterial', newMaterial.id, `Uploaded handout: ${matTitle}`);

    setShowUploadMaterial(false);
    setMatTitle('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Faculty Header Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#101629]/80 border border-slate-200 dark:border-[#B46AFF]/20 shadow-sm dark:shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#B46AFF]/40 shrink-0 bg-slate-100 dark:bg-slate-900 shadow-[0_0_15px_-3px_rgba(180,106,255,0.3)]">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'Faculty'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#7C3AED] dark:text-[#B46AFF] mb-1 font-semibold">
                <span>Faculty Designation: Professor &amp; HOD</span>
                <span aria-hidden="true">·</span>
                <span>Doctoral Fellow (Stanford)</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user?.fullName || 'Dr. Marcus Sterling, Ph.D.'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-0.5">
                Department of {user?.department || 'Artificial Intelligence & Data Science'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-[#9BA6BC] block text-[10px] font-medium">Assigned Sections</span>
              <span className="text-[#0284C7] dark:text-[#36D9FF] font-mono font-bold text-sm">Sem 5-A, Sem 7-B</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-[#9BA6BC] block text-[10px] font-medium">Total Scholars</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">{roster.length} Enrolled</span>
            </div>
          </div>
        </div>

        {/* Faculty Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Faculty Overview', icon: BookOpen },
            { id: 'attendance', label: 'Mark Attendance', icon: CheckCircle2 },
            { id: 'assignments', label: 'Manage Assignments', icon: FileText },
            { id: 'submissions', label: 'Student Submissions', icon: Award },
            { id: 'materials', label: 'Upload Materials', icon: Upload },
            { id: 'internal_marks', label: 'Internal Marks', icon: Award },
            { id: 'timetable', label: 'My Schedule', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FacultyTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-purple-100 dark:bg-[#B46AFF]/15 text-[#7C3AED] dark:text-[#B46AFF] border border-purple-200 dark:border-[#B46AFF]/30 font-semibold'
                    : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#101629]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1 font-medium">Today's Lectures</span>
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">2 Sessions</span>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">09:00 Lab Alpha-302 · 14:00 Hall B-105</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1 font-medium">Pending Evaluations</span>
                <span className="text-2xl font-bold font-mono text-[#0284C7] dark:text-[#36D9FF] tabular-nums">
                  {submissions.filter((s) => s.status === 'Submitted').length} Submissions
                </span>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">Transformer Attention assignments submitted</p>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1 font-medium">Enrolled Scholars</span>
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">{roster.length} Students</span>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">Section 5-A Academic Roster</p>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Direct Academic Actions</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Execute classroom operations with immediate database synchronization</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#B46AFF] dark:text-[#080B14] dark:hover:bg-[#B46AFF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Student</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-4 py-2 text-xs font-semibold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Today's Attendance</span>
                </button>
                <button
                  onClick={() => setShowCreateAssignment(true)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Assignment</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARK ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Classroom Attendance Session</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">
                  Authorized Subject: Deep Neural Networks &amp; Vision (Semester 5 - Section A)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#B46AFF] dark:text-[#080B14] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Student</span>
                </button>
                <button
                  onClick={() => markAll(true)}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => markAll(false)}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20"
                >
                  Mark All Absent
                </button>
              </div>
            </div>

            {/* Session Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Session Date</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#0284C7] dark:focus:border-[#36D9FF]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Lecture Topic / Lab Objective</label>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7] dark:focus:border-[#36D9FF]"
                />
              </div>
            </div>

            {attendanceSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Attendance session successfully logged to institutional database &amp; audit trail!</span>
              </div>
            )}

            {/* Roster Table */}
            {roster.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-xl bg-slate-50 dark:bg-[#080B14] border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <Users className="w-10 h-10 mx-auto opacity-30 text-[#0284C7] dark:text-[#36D9FF]" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">No Scholars Enrolled In This Section</h4>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] max-w-md mx-auto">
                  Only faculty and administrators can enroll new students with an assigned password. Click the button below to enroll your first student.
                </p>
                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#B46AFF] dark:text-[#080B14] rounded-lg inline-flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Enroll Student with Password</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Enrollment Number</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono bg-white dark:bg-transparent">
                    {roster.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{s.enrollment}</td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                              s.present
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                                : 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30'
                            }`}
                          >
                            {s.present ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => toggleAttendance(s.id)}
                            className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded transition-colors"
                          >
                            Toggle {s.present ? 'Absent' : 'Present'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-[#9BA6BC]">
                Total Present: <strong className="text-slate-900 dark:text-white">{roster.filter((s) => s.present).length}</strong> of{' '}
                {roster.length} scholars
              </span>
              <button
                disabled={roster.length === 0}
                onClick={handleSaveAttendance}
                className="px-5 py-2.5 text-xs font-bold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] disabled:opacity-50"
              >
                Submit &amp; Audit Log Session
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Faculty Assignment Management</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Create, update, and manage course laboratory problem sets</p>
              </div>

              <button
                onClick={() => setShowCreateAssignment(true)}
                className="px-4 py-2 text-xs font-semibold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Assignment</span>
              </button>
            </div>

            <div className="space-y-4">
              {assignments.map((asg) => (
                <div key={asg.id} className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{asg.subjectName}</span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{asg.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1">{asg.description}</p>
                    <div className="mt-3 text-xs text-slate-500 dark:text-[#9BA6BC] space-x-4">
                      <span>Due: <strong className="text-slate-800 dark:text-white font-mono">{new Date(asg.dueDate).toLocaleDateString()}</strong></span>
                      <span>Max Marks: <strong className="text-slate-800 dark:text-white font-mono">{asg.maxMarks}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('submissions')}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg whitespace-nowrap shrink-0 transition-colors"
                  >
                    View Submissions
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SUBMISSIONS & EVALUATION */}
        {activeTab === 'submissions' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Assignment Submissions &amp; Grading</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Review submitted code archives, enter marks, and dispatch feedback</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Enrollment</th>
                    <th className="py-2.5 px-3">Submitted File</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono bg-white dark:bg-transparent">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">{sub.studentName}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{sub.enrollmentNo}</td>
                      <td className="py-3 px-3 text-[#0284C7] dark:text-[#36D9FF]">{sub.fileName} ({sub.fileSize})</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            sub.status === 'Graded'
                              ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20'
                              : 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                        {sub.marksObtained !== undefined ? `${sub.marksObtained} / ${sub.maxMarks}` : 'Pending'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setGradingSubmission(sub);
                            setGradeMarks(sub.marksObtained?.toString() || '');
                            setGradeFeedback(sub.feedback || '');
                          }}
                          className="px-2.5 py-1 text-xs text-white bg-slate-800 hover:bg-[#0284C7] dark:hover:bg-[#36D9FF] dark:hover:text-[#080B14] rounded transition-colors"
                        >
                          {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STUDY MATERIALS */}
        {activeTab === 'materials' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Study Materials &amp; Lecture Handouts</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Distribute syllabus notes, PDF slides, and laboratory guides</p>
              </div>

              <button
                onClick={() => setShowUploadMaterial(true)}
                className="px-4 py-2 text-xs font-semibold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Resource</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((mat) => (
                <div key={mat.id} className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6BC] mb-1">
                    <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{mat.subjectName}</span>
                    <span className="font-mono">{mat.fileSize}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{mat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-1">Total Student Downloads: {mat.downloadCount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: INTERNAL MARKS */}
        {activeTab === 'internal_marks' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Internal Assessment &amp; Practical Scores</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Scores entered here directly sync to student grade sheets upon provost release</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800 font-sans">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Enrollment</th>
                    <th className="py-2.5 px-3 text-right">Mid-Term (30)</th>
                    <th className="py-2.5 px-3 text-right">Lab Practical (20)</th>
                    <th className="py-2.5 px-3 text-right">Total Internal (50)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono bg-white dark:bg-transparent">
                  {roster.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">{s.name}</td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{s.enrollment}</td>
                      <td className="py-2.5 px-3 text-right text-[#0284C7] dark:text-[#36D9FF] font-semibold">{26 + (idx % 4)}</td>
                      <td className="py-2.5 px-3 text-right text-[#7C3AED] dark:text-[#B46AFF] font-semibold">{18 + (idx % 3)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">{44 + (idx % 5)}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-sans border border-emerald-200 dark:border-emerald-500/20">
                          Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Faculty Lecture Schedule</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Assigned laboratory studios and classroom slots for Autumn 2026</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {timetable
                .filter((t) => t.facultyName.includes('Marcus Sterling') || t.facultyName.includes('Dr.'))
                .map((slot) => (
                  <div key={slot.id} className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6BC] mb-2">
                      <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{slot.dayOfWeek} · {slot.periodStart}–{slot.periodEnd}</span>
                      <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-800 dark:text-white font-mono">{slot.roomNumber}</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{slot.subjectName}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-1">Section {slot.section} · Semester {slot.semester}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish New Assignment</h3>
              <button
                onClick={() => setShowCreateAssignment(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diffusion Models & Denoising SDE Implementation"
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7] dark:focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Instructions</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify submission criteria, code guidelines, datasets, and rubric..."
                  value={newAsgDesc}
                  onChange={(e) => setNewAsgDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7] dark:focus:border-[#36D9FF] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    value={newAsgDue}
                    onChange={(e) => setNewAsgDue(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={newAsgMarks}
                    onChange={(e) => setNewAsgMarks(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Publish to Student Dashboards
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#B46AFF]/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Evaluate Scholar Work</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">{gradingSubmission.studentName} ({gradingSubmission.fileName})</p>
              </div>
              <button
                onClick={() => setGradingSubmission(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Marks Awarded (Out of {gradingSubmission.maxMarks})
                </label>
                <input
                  type="number"
                  required
                  max={gradingSubmission.maxMarks}
                  min={0}
                  value={gradeMarks}
                  onChange={(e) => setGradeMarks(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#B46AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Instructor Feedback &amp; Suggestions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Excellent attention masking; add further unit test coverage for variable sequence lengths."
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#B46AFF] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-[#7C3AED] dark:bg-[#B46AFF] hover:bg-[#6D28D9] dark:hover:bg-[#B46AFF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(180,106,255,0.4)]"
              >
                Save Grade &amp; Notify Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upload Study Material Modal */}
      {showUploadMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Distribute Study Resource</h3>
              <button
                onClick={() => setShowUploadMaterial(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 4: Attention Is All You Need Handout"
                  value={matTitle}
                  onChange={(e) => setMatTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#0284C7] dark:focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={matSubject}
                  onChange={(e) => setMatSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="Deep Neural Networks & Vision">Deep Neural Networks &amp; Vision</option>
                  <option value="Distributed Cloud Architecture">Distributed Cloud Architecture</option>
                  <option value="Autonomous Robotics & SLAM">Autonomous Robotics &amp; SLAM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Format Type</label>
                <select
                  value={matType}
                  onChange={(e) => setMatType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="PDF">PDF Document</option>
                  <option value="ZIP">ZIP Code Archive</option>
                  <option value="DOCX">DOCX Syllabus Guide</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white dark:text-[#080B14] bg-[#0284C7] dark:bg-[#36D9FF] hover:bg-[#0369A1] dark:hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Upload &amp; Link to Student Portals
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#B46AFF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-[#B46AFF]/20 flex items-center justify-center text-[#7C3AED] dark:text-[#B46AFF]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Enroll New Student</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#9BA6BC]">Assign portal access credentials</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollStudent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newStuName}
                  onChange={(e) => setNewStuName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#B46AFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@nexora.edu"
                  value={newStuEmail}
                  onChange={(e) => setNewStuEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#B46AFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Enrollment No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NX-2026-0091"
                    value={newStuEnrollment}
                    onChange={(e) => setNewStuEnrollment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={newStuSemester}
                    onChange={(e) => setNewStuSemester(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Designated Login Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Set initial password for student to log in"
                  value={newStuPassword}
                  onChange={(e) => setNewStuPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-300 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#7C3AED] dark:focus:border-[#B46AFF] font-mono"
                />
                <p className="text-[10px] text-slate-500 dark:text-[#9BA6BC] mt-1">
                  Student uses their email and this password to log in. Their initial attendance starts at 0% until marked.
                </p>
              </div>

              <button
                type="submit"
                disabled={stuSubmitting}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] dark:bg-[#B46AFF] dark:text-[#080B14] dark:hover:bg-[#B46AFF]/90 rounded-lg transition-all shadow-sm dark:shadow-[0_0_15px_-3px_rgba(180,106,255,0.4)] disabled:opacity-50"
              >
                {stuSubmitting ? 'Enrolling Scholar...' : 'Enroll Student with Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

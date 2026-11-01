import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  FileText,
  Download,
  Upload,
  CreditCard,
  MessageSquare,
  User,
  Clock,
  Award,
  ChevronRight,
  Search,
  Check,
  X,
  FileCheck,
  Send,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  AttendanceRecord,
  AttendanceLog,
  TimetableSlot,
  Assignment,
  StudyMaterial,
  Examination,
  SemesterResultSummary,
  FeeRecord,
  Complaint,
  Notice
} from '../../types';
import {
  INITIAL_ATTENDANCE,
  INITIAL_ATTENDANCE_LOGS,
  INITIAL_TIMETABLE,
  INITIAL_ASSIGNMENTS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_EXAMS,
  INITIAL_RESULTS,
  INITIAL_FEES,
  INITIAL_COMPLAINTS,
  INITIAL_NOTICES,
  getStoredData,
  setStoredData
} from '../../integrations/supabase/mockDb';

type StudentTab =
  | 'overview'
  | 'attendance'
  | 'timetable'
  | 'examinations'
  | 'results'
  | 'assignments'
  | 'materials'
  | 'notices'
  | 'fees'
  | 'complaints'
  | 'profile';

export const StudentDashboard: React.FC = () => {
  const { user, updateProfile, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState<StudentTab>('overview');

  // Local interactive states with persistence
  const [attendance] = useState<AttendanceRecord[]>(() => {
    if (user?.id) {
      return getStoredData<AttendanceRecord[]>(`student_attendance_${user.id}`, []);
    }
    return getStoredData('attendance', INITIAL_ATTENDANCE);
  });
  const [attendanceLogs] = useState<AttendanceLog[]>(() => getStoredData('attendance_logs', INITIAL_ATTENDANCE_LOGS));
  const [timetable] = useState<TimetableSlot[]>(() => getStoredData('timetable', INITIAL_TIMETABLE));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getStoredData('assignments', INITIAL_ASSIGNMENTS));
  const [materials] = useState<StudyMaterial[]>(() => getStoredData('study_materials', INITIAL_STUDY_MATERIALS));
  const [exams] = useState<Examination[]>(() => getStoredData('exams', INITIAL_EXAMS));
  const [results] = useState<SemesterResultSummary[]>(() => getStoredData('results', INITIAL_RESULTS));
  const [fees] = useState<FeeRecord[]>(() => getStoredData('fees', INITIAL_FEES));
  const [complaints, setComplaints] = useState<Complaint[]>(() => getStoredData('complaints', INITIAL_COMPLAINTS));
  const [notices] = useState<Notice[]>(() => getStoredData('notices', INITIAL_NOTICES));

  // Timetable selected day filter
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  // Assignment submission modal
  const [submittingAssignment, setSubmittingAssignment] = useState<Assignment | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // New Complaint modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState<Complaint['category']>('Infrastructure');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Fee receipt preview modal
  const [activeReceipt, setActiveReceipt] = useState<FeeRecord | null>(null);

  // Profile edit state
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Calculate overall attendance
  const totalClassesSum = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attendedClassesSum = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const overallPercentage = totalClassesSum > 0 ? (attendedClassesSum / totalClassesSum) * 100 : 0;
  const isAttendanceWarning = totalClassesSum > 0 && overallPercentage < 75;

  // Handle assignment file submission
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !uploadFileName) return;

    const updated = assignments.map((a) => {
      if (a.id === submittingAssignment.id) {
        return {
          ...a,
          status: 'Submitted' as const,
          submittedAt: new Date().toISOString(),
          submissionFile: uploadFileName,
        };
      }
      return a;
    });

    setAssignments(updated);
    setStoredData('assignments', updated);
    addAuditLog('SUBMIT_ASSIGNMENT', 'Assignment', submittingAssignment.id, `Submitted ${uploadFileName}`);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setSubmittingAssignment(null);
      setUploadFileName('');
    }, 1500);
  };

  // Handle complaint submission
  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject || !complaintDesc) return;

    const newComplaint: Complaint = {
      id: 'cmp_' + Date.now(),
      studentId: user?.id || 'usr_student_01',
      studentName: user?.fullName || 'Alexandre Chen',
      category: complaintCategory,
      subject: complaintSubject,
      description: complaintDesc,
      status: 'Pending',
      createdAt: new Date().toISOString().substring(0, 10),
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    setStoredData('complaints', updated);
    addAuditLog('SUBMIT_COMPLAINT', 'Complaint', newComplaint.id, `Lodged complaint: ${complaintSubject}`);

    setShowComplaintModal(false);
    setComplaintSubject('');
    setComplaintDesc('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ phone: editPhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const currentDaySchedule = timetable.filter((t) => t.dayOfWeek === selectedDay);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Student Header Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#101629]/90 border border-slate-200 dark:border-[#36D9FF]/20 shadow-sm dark:shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#0284C7]/40 dark:border-[#36D9FF]/40 shrink-0 bg-slate-100 dark:bg-slate-900 shadow-[0_0_15px_-3px_rgba(54,217,255,0.3)]">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'Student'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-1 font-semibold">
                <span>Enrollment: {user?.enrollmentNo || 'NX-2026-ENROLLED'}</span>
                <span aria-hidden="true">·</span>
                <span>Semester {user?.semester || 1}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Welcome back, {user?.fullName || 'Enrolled Scholar'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-0.5">
                Department of {user?.department || 'Autonomous Engineering'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Attendance Mini Indicator */}
            <div
              className={`px-4 py-2 rounded-xl border text-xs flex items-center gap-2.5 ${
                totalClassesSum === 0
                  ? 'bg-slate-50 dark:bg-[#080B14] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  : isAttendanceWarning
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300'
              }`}
            >
              {totalClassesSum === 0 ? (
                <Clock className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-500" />
              ) : isAttendanceWarning ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <div>
                <span className="font-mono font-bold text-sm tabular-nums">
                  {overallPercentage.toFixed(1)}%
                </span>
                <span className="text-[10px] block opacity-80">
                  {totalClassesSum === 0
                    ? '0 / 0 Sessions Marked'
                    : isAttendanceWarning
                    ? 'Attendance Warning (<75%)'
                    : 'Attendance Good'}
                </span>
              </div>
            </div>

            {/* Current CGPA Indicator */}
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-[#9BA6BC] block text-[10px]">Cumulative GPA</span>
              <span className="text-[#0284C7] dark:text-[#36D9FF] font-mono font-bold text-sm tabular-nums">
                {results.length > 0 && results[0]?.cgpa ? `${results[0].cgpa} / 10.0` : 'Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Attendance Banner Warning if under 75% and classes have started */}
        {isAttendanceWarning && totalClassesSum > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 flex items-start gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500 dark:text-amber-400 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block text-slate-900 dark:text-white">Attendance Deficiency Alert</strong>
              Your overall attendance is currently {overallPercentage.toFixed(1)}% ({attendedClassesSum}/{totalClassesSum} lectures attended), which is below the mandatory 75% threshold prescribed by the Academic Council. Please consult your course faculty to complete remedial sessions prior to examination eligibility cutoff.
            </div>
          </div>
        )}

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
            { id: 'timetable', label: 'Timetable', icon: Calendar },
            { id: 'assignments', label: 'Assignments', icon: FileText },
            { id: 'materials', label: 'Study Materials', icon: Download },
            { id: 'examinations', label: 'Examinations', icon: Clock },
            { id: 'results', label: 'Results & GPA', icon: Award },
            { id: 'fees', label: 'Fees & Receipts', icon: CreditCard },
            { id: 'complaints', label: 'Grievances', icon: MessageSquare },
            { id: 'profile', label: 'My Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudentTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#36D9FF]/15 text-[#0284C7] dark:text-[#36D9FF] border border-[#36D9FF]/30 font-semibold'
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
            {/* Top 3 Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-[#9BA6BC]">
                  <span>Total Lectures Attended</span>
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  {attendedClassesSum} / {totalClassesSum}
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">
                  Overall semester participation across 5 enrolled courses.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-[#9BA6BC]">
                  <span>Active Assignments</span>
                  <FileText className="w-4 h-4 text-purple-600 dark:text-[#B46AFF]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#0284C7] dark:text-[#36D9FF] tabular-nums">
                  {assignments.filter((a) => a.status === 'Pending').length} Pending
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">
                  Next submission due: Raft Consensus Simulation (Nov 12).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-[#9BA6BC]">
                  <span>Upcoming Mid-Term</span>
                  <Clock className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
                  Nov 15, 2026
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-2">
                  Hall tickets available. 5 theory papers scheduled.
                </p>
              </div>
            </div>

            {/* Split: Today's Schedule on Left, Recent Performance on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
                    <span>Monday Schedule</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-xs text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold"
                  >
                    View Weekly
                  </button>
                </div>

                <div className="space-y-3">
                  {timetable
                    .filter((t) => t.dayOfWeek === 'Monday')
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-4 transition-colors"
                      >
                        <div>
                          <span className="text-[11px] font-mono text-[#0284C7] dark:text-[#36D9FF] block font-semibold">
                            {slot.periodStart} – {slot.periodEnd}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                            {slot.subjectName}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-[#9BA6BC]">{slot.facultyName}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-md shrink-0 border border-slate-200 dark:border-transparent">
                          {slot.roomNumber}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600 dark:text-[#B46AFF]" />
                    <span>Academic Performance</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('results')}
                    className="text-xs text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold"
                  >
                    Full Grade Sheet
                  </button>
                </div>

                {results.length > 0 && results[0] ? (
                  <>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 mb-4 flex items-center justify-between transition-colors">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block">Semester {results[0].semester} SGPA</span>
                        <span className="text-3xl font-extrabold font-mono text-[#0284C7] dark:text-[#36D9FF] tabular-nums">
                          {results[0].sgpa}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block">Standing</span>
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {results[0].results.slice(0, 3).map((res) => (
                        <div
                          key={res.id}
                          className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                        >
                          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{res.subjectName}</span>
                          <span className="font-mono font-bold text-[#0284C7] dark:text-[#36D9FF]">Grade {res.grade} ({res.totalMarks}/100)</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-[#9BA6BC] space-y-2">
                    <Award className="w-8 h-8 mx-auto opacity-30 text-[#0284C7] dark:text-[#36D9FF]" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">No Grade Sheets Published Yet</p>
                    <p className="text-[11px] leading-relaxed">
                      Official examination scores and SGPA records will be posted here once evaluation is completed by the Academic Council.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Subject-Wise Attendance Metrics</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mb-6">
                Students must maintain a minimum threshold of 75.0% cumulative attendance per subject to be eligible for semester-end examinations.
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Subject Name</th>
                      <th className="py-3 px-4 text-right">Attended</th>
                      <th className="py-3 px-4 text-right">Total Classes</th>
                      <th className="py-3 px-4 text-right">Percentage</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {attendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-slate-500 dark:text-[#9BA6BC]">
                            <Clock className="w-7 h-7 text-slate-400 dark:text-slate-600 opacity-60" />
                            <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                              No Attendance Sessions Logged Yet
                            </p>
                            <p className="text-xs max-w-sm">
                              Your attendance starts clean at 0.0%. Once your assigned faculty takes roll call during classroom sessions, your subject-wise metrics will reflect automatically.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      attendance.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{rec.subjectName}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">{rec.attendedClasses}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">{rec.totalClasses}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                            <span className={rec.percentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-[#0284C7] dark:text-[#36D9FF]'}>
                              {rec.percentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                rec.percentage < 75
                                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {rec.percentage < 75 ? 'Warning (<75%)' : 'Eligible'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance Daily Logs */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Recent Session Attendance Logs</h3>
              <div className="space-y-2">
                {attendanceLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-[#9BA6BC] py-6 text-center">
                    No classroom roll call records logged yet for this academic period.
                  </p>
                ) : (
                  attendanceLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">{log.subjectName}</span>
                        <span className="text-slate-500 dark:text-[#9BA6BC] text-[11px] font-mono">
                          {log.date} · {log.period} · Instructor: {log.facultyName}
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          log.status === 'Present'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TIMETABLE */}
        {activeTab === 'timetable' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Weekly Academic Schedule</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Semester 5 · Section A · Autonomous Timetable</p>
              </div>

              {/* Day filter tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#080B14] p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      selectedDay === day
                        ? 'bg-white dark:bg-[#36D9FF]/20 text-[#0284C7] dark:text-[#36D9FF] border border-slate-200 dark:border-[#36D9FF]/30 font-semibold shadow-sm'
                        : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentDaySchedule.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-500 dark:text-[#9BA6BC] bg-slate-50 dark:bg-[#080B14] rounded-xl border border-slate-200 dark:border-slate-800">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#0284C7] dark:text-[#36D9FF]" />
                  <p className="text-sm">No scheduled lectures on {selectedDay}</p>
                </div>
              ) : (
                currentDaySchedule.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 hover:border-[#0284C7]/40 dark:hover:border-[#36D9FF]/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">
                          {slot.periodStart} – {slot.periodEnd}
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-mono bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-200 dark:border-transparent">
                          {slot.roomNumber}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{slot.subjectName}</h4>
                      <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1">{slot.facultyName}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Course Assignments &amp; Submissions</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Submit laboratory programs, problem sets, and capstone briefs</p>
              </div>
            </div>

            <div className="space-y-4">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF] mb-1 font-semibold">
                      <span>{asg.subjectName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Instructor: {asg.facultyName}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{asg.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1.5 leading-relaxed">{asg.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#9BA6BC]">
                      <span>Due: <strong className="text-slate-800 dark:text-white font-mono">{new Date(asg.dueDate).toLocaleDateString()}</strong></span>
                      <span>Max Marks: <strong className="text-slate-800 dark:text-white font-mono">{asg.maxMarks}</strong></span>
                      {asg.submissionFile && (
                        <span>Submitted File: <code className="text-[#0284C7] dark:text-[#36D9FF]">{asg.submissionFile}</code></span>
                      )}
                    </div>

                    {asg.feedback && (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
                        <strong>Faculty Evaluation:</strong> {asg.feedback} (Score: {asg.marksObtained}/{asg.maxMarks})
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        asg.status === 'Graded'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                          : asg.status === 'Submitted'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {asg.status}
                    </span>

                    {asg.status === 'Pending' && (
                      <button
                        onClick={() => {
                          setSubmittingAssignment(asg);
                          setUploadFileName('');
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Submit Work</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STUDY MATERIALS */}
        {activeTab === 'materials' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Subject-Wise Study Resources</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Authoritative lecture slides, laboratory handouts, and research papers</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 hover:border-[#0284C7]/40 dark:hover:border-[#36D9FF]/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#9BA6BC] mb-2">
                      <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{mat.subjectName}</span>
                      <span className="font-mono">{mat.fileSize}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{mat.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1">Uploaded by {mat.uploadedBy} on {mat.uploadedAt}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 dark:text-[#9BA6BC] font-mono">{mat.downloadCount} downloads</span>
                    <a
                      href={mat.downloadUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Downloading "${mat.title}" (${mat.fileSize})...`);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-200 dark:bg-slate-800 hover:bg-[#36D9FF] hover:text-[#080B14] rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300 dark:border-transparent"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download {mat.fileType}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: EXAMINATIONS */}
        {activeTab === 'examinations' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Examination Schedules &amp; Hall Tickets</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Internal mid-terms, practical assessments, and semester-end schedules</p>
            </div>

            <div className="space-y-4">
              {exams.map((ex) => (
                <div key={ex.id} className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#0284C7] dark:text-[#36D9FF] px-2 py-0.5 rounded bg-sky-500/10 dark:bg-[#36D9FF]/10">
                      {ex.type}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                      Window: {ex.startDate} to {ex.endDate}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{ex.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed">{ex.instructions}</p>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Hall Ticket Verified</span>
                    <button
                      onClick={() => alert(`Generating official Examination Hall Ticket for ${user?.fullName}...`)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-transparent"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF]" />
                      <span>Download Hall Ticket (PDF)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: RESULTS */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {results.length === 0 ? (
              <div className="p-10 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm dark:shadow-none">
                <Award className="w-10 h-10 mx-auto text-slate-400 opacity-40 dark:text-slate-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Grade Sheets Pending</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] max-w-md mx-auto">
                  Examination evaluation records and SGPA/CGPA summaries will be published following institutional review by the Controller of Examinations.
                </p>
              </div>
            ) : (
              results.map((semResult) => (
                <div key={semResult.semester} className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">Semester {semResult.semester} Official Grade Sheet</h3>
                      <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Autonomous Evaluation · Academic Year 2025-2026</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800">
                        SGPA: <strong className="text-[#0284C7] dark:text-[#36D9FF] text-sm tabular-nums">{semResult.sgpa}</strong>
                      </div>
                      <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800">
                        CGPA: <strong className="text-purple-600 dark:text-[#B46AFF] text-sm tabular-nums">{semResult.cgpa}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Subject Code</th>
                          <th className="py-2.5 px-3">Subject Name</th>
                          <th className="py-2.5 px-3 text-right">Internal</th>
                          <th className="py-2.5 px-3 text-right">External</th>
                          <th className="py-2.5 px-3 text-right">Total</th>
                          <th className="py-2.5 px-3 text-center">Grade</th>
                          <th className="py-2.5 px-3 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                        {semResult.results.map((res) => (
                          <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-[#0284C7] dark:text-[#36D9FF]">{res.subjectCode}</td>
                            <td className="py-2.5 px-3 font-sans text-slate-900 dark:text-white font-medium">{res.subjectName}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">{res.internalMarks}</td>
                            <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">{res.externalMarks}</td>
                            <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">{res.totalMarks}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="px-2 py-0.5 rounded bg-sky-500/10 dark:bg-[#36D9FF]/10 text-[#0284C7] dark:text-[#36D9FF] font-bold border border-sky-500/20 dark:border-[#36D9FF]/20">
                                {res.grade}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">{res.gradePoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 8: FEES */}
        {activeTab === 'fees' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Fee Structure &amp; Verified Payment Records</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Institutional ledger verified by the Office of Accounts &amp; Finance</p>
            </div>

            <div className="space-y-4">
              {fees.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-[#9BA6BC] bg-slate-50 dark:bg-[#080B14] rounded-xl border border-slate-200 dark:border-slate-800">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30 text-[#0284C7] dark:text-[#36D9FF]" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">No outstanding fee dues or receipts found</p>
                  <p className="text-[11px] mt-1">Institutional accounts are reconciled each semester cycle.</p>
                </div>
              ) : (
                fees.map((f) => (
                <div
                  key={f.id}
                  className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#9BA6BC] mb-1">
                      <span>Semester {f.semester}</span>
                      <span aria-hidden="true">·</span>
                      <span>Academic Year {f.academicYear}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      Institutional Tuition &amp; Laboratory Dues
                    </h4>

                    <div className="mt-2 text-xs text-slate-600 dark:text-[#9BA6BC] space-x-3">
                      <span>Tuition: ${f.tuitionFee}</span>
                      <span>Lab: ${f.labFee}</span>
                      <span>Library: ${f.libraryFee}</span>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-4">
                    <div>
                      <span className="text-xl font-bold font-mono text-slate-900 dark:text-white block tabular-nums">
                        ${f.totalAmount}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          f.status === 'Paid'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>

                    {f.status === 'Paid' ? (
                      <button
                        onClick={() => setActiveReceipt(f)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300 dark:border-transparent"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => alert('Online fee payment gateway connects directly to your authorized campus bank portal.')}
                        className="px-3.5 py-1.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
                      >
                        Pay Online
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

        {/* TAB 9: COMPLAINTS */}
        {activeTab === 'complaints' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Grievances &amp; Feedback</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Track resolution status directly with campus administration</p>
              </div>

              <button
                onClick={() => setShowComplaintModal(true)}
                className="px-4 py-2 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Log New Ticket
              </button>
            </div>

            <div className="space-y-4">
              {complaints.map((c) => (
                <div key={c.id} className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{c.category} Grievance</span>
                    <span
                      className={`px-2 py-0.5 rounded font-semibold ${
                        c.status === 'Resolved'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{c.subject}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed">{c.description}</p>

                  {c.response && (
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      <strong className="text-[#0284C7] dark:text-[#36D9FF] block mb-1">Administrative Action Taken:</strong>
                      {c.response}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 dark:text-[#9BA6BC] font-mono">
                    Logged on {c.createdAt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none max-w-2xl transition-colors">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Student Profile Information</h3>
            <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mb-6">Manage permitted personal contacts and review academic record</p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSaved && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-[#9BA6BC] block mb-1 font-medium">Full Legal Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ''}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-[#9BA6BC] block mb-1 font-medium">Enrollment Number</label>
                  <input
                    type="text"
                    disabled
                    value={user?.enrollmentNo || ''}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-[#9BA6BC] block mb-1 font-medium">Institutional Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 block mb-1 font-medium">Mobile Contact (Editable)</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-600 dark:text-[#9BA6BC] block mb-1 font-medium">Department</label>
                  <input
                    type="text"
                    disabled
                    value={user?.department || ''}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-[#9BA6BC] block mb-1 font-medium">Academic Year</label>
                  <input
                    type="text"
                    disabled
                    value={user?.academicYear || '2026-2027'}
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Save Permitted Changes
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Assignment Submission Modal */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Upload Assignment</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">{submittingAssignment.title}</p>
              </div>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Work Submitted Successfully</h4>
                <p className="text-xs">Logged into institutional evaluation ledger.</p>
              </div>
            ) : (
              <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Select File / Archive to Upload (.zip, .pdf, .ipynb)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFileName(e.target.files[0].name);
                      }
                    }}
                    className="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-500/15 dark:file:bg-[#36D9FF]/20 file:text-[#0284C7] dark:file:text-[#36D9FF] hover:file:bg-sky-500/25 dark:hover:file:bg-[#36D9FF]/30 cursor-pointer"
                  />
                  {uploadFileName && (
                    <span className="block mt-2 text-xs font-mono text-[#0284C7] dark:text-[#36D9FF]">
                      Selected: {uploadFileName}
                    </span>
                  )}
                </div>

                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-[#9BA6BC]">
                  Max file size: 50MB. Plagiarism scanning is automatically triggered upon submission.
                </div>

                <button
                  type="submit"
                  disabled={!uploadFileName}
                  className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] disabled:opacity-50"
                >
                  Confirm &amp; Finalize Submission
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* New Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Log Academic or Campus Grievance</h3>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Grievance Category</label>
                <select
                  value={complaintCategory}
                  onChange={(e) => setComplaintCategory(e.target.value as Complaint['category'])}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                >
                  <option value="Infrastructure">Infrastructure &amp; Lab Facilities</option>
                  <option value="Academic">Academic &amp; Course Evaluation</option>
                  <option value="Hostel">Hostel &amp; Dormitory Maintenance</option>
                  <option value="Canteen">Canteen &amp; Food Quality</option>
                  <option value="Transportation">Transportation &amp; Bus Routes</option>
                  <option value="Other">Other Administrative Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Subject Brief</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GPU Driver Upgrade in Lab Alpha"
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide precise location, room number, or instructor details..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Dispatch to Ombudsman Cell
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 space-y-4 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">Official Payment Receipt</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white font-mono">{activeReceipt.receiptNo}</h4>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-[#9BA6BC]">
              <div className="flex justify-between">
                <span>Student Name:</span>
                <strong className="text-slate-900 dark:text-white">{user?.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Enrollment No:</span>
                <strong className="text-slate-900 dark:text-white font-mono">{user?.enrollmentNo}</strong>
              </div>
              <div className="flex justify-between">
                <span>Transaction Ref:</span>
                <strong className="text-[#0284C7] dark:text-[#36D9FF] font-mono">{activeReceipt.transactionRef}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Date:</span>
                <span className="text-slate-900 dark:text-white font-mono">{activeReceipt.paymentDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Amount Paid:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">${activeReceipt.paidAmount}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Printing official fee receipt with university QR watermark...');
                setActiveReceipt(null);
              }}
              className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-200 dark:border-transparent"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

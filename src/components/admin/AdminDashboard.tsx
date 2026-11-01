import React, { useState } from 'react';
import {
  Shield,
  Users,
  GraduationCap,
  Building2,
  Calendar,
  AlertTriangle,
  Award,
  Bell,
  FileSpreadsheet,
  History,
  CheckCircle2,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  Check,
  X,
  ExternalLink,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  UserProfile,
  Department,
  Notice,
  AuditLog,
  AttendanceRecord
} from '../../types';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_NOTICES,
  INITIAL_ATTENDANCE,
  getStoredData,
  setStoredData,
  clearAllStoredData
} from '../../integrations/supabase/mockDb';

type AdminTab =
  | 'overview'
  | 'users'
  | 'departments'
  | 'attendance'
  | 'examinations'
  | 'notices'
  | 'audit_logs'
  | 'reports';

interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'faculty';
  department: string;
  enrollmentNo?: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
}

const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr_admin_ajay',
    fullName: 'Ajay Shewale',
    email: 'ajayshewale211@gmail.com',
    role: 'admin' as any,
    department: 'Administration',
    status: 'Active',
  },
];

export const AdminDashboard: React.FC = () => {
  const { user, auditLogs, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Interactive user management - synchronized with registered_users
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() =>
    getStoredData('admin_managed_users', INITIAL_MANAGED_USERS)
  );
  const [userSearch, setUserSearch] = useState('');

  // Department management (initially empty per user request)
  const [departments, setDepartments] = useState<Department[]>(() =>
    getStoredData('admin_departments', INITIAL_DEPARTMENTS)
  );

  // Notices management
  const [notices, setNotices] = useState<Notice[]>(() =>
    getStoredData('notices', INITIAL_NOTICES)
  );

  // Attendance overview
  const [attendance] = useState<AttendanceRecord[]>(() =>
    getStoredData('attendance', INITIAL_ATTENDANCE)
  );

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'faculty'>('student');
  const [newUserDept, setNewUserDept] = useState('Computer Science');

  const [showCreateNoticeModal, setShowCreateNoticeModal] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<Notice['category']>('academic');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeAudience, setNewNoticeAudience] = useState<Notice['targetAudience']>('all');
  const [newNoticePinned, setNewNoticePinned] = useState(false);

  // New Department modal
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHod, setNewDeptHod] = useState('');
  const [newDeptIntake, setNewDeptIntake] = useState('120');

  // Approve / Toggle User status - synced to registered_users so student/faculty can immediately log in
  const handleToggleUserStatus = (id: string) => {
    const updated = managedUsers.map((u) => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? ('Suspended' as const) : ('Active' as const);
        addAuditLog(
          'USER_STATUS_UPDATE',
          'UserProfile',
          u.id,
          `Administrator changed status of ${u.fullName} to ${nextStatus}`
        );
        return { ...u, status: nextStatus, isApproved: nextStatus === 'Active' };
      }
      return u;
    });
    setManagedUsers(updated);
    setStoredData('admin_managed_users', updated);
    setStoredData('registered_users', updated);
  };

  const handleApproveUser = (id: string) => {
    const updated = managedUsers.map((u) => {
      if (u.id === id) {
        addAuditLog('APPROVE_REGISTRATION', 'UserProfile', u.id, `Approved access request for ${u.fullName} (${u.email})`);
        return { ...u, status: 'Active' as const, isApproved: true };
      }
      return u;
    });
    setManagedUsers(updated);
    setStoredData('admin_managed_users', updated);
    setStoredData('registered_users', updated);
  };

  const handleRejectUser = (id: string) => {
    const target = managedUsers.find((u) => u.id === id);
    const updated = managedUsers.filter((u) => u.id !== id);
    setManagedUsers(updated);
    setStoredData('admin_managed_users', updated);
    setStoredData('registered_users', updated);
    addAuditLog('REJECT_REGISTRATION', 'UserProfile', id, `Administrator rejected access request for ${target?.fullName || id}`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser: ManagedUser = {
      id: 'u_' + Date.now(),
      fullName: newUserName,
      email: newUserEmail,
      role: newUserRole,
      department: newUserDept,
      enrollmentNo: newUserRole === 'student' ? `NX-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      status: 'Active',
    };

    const updated = [newUser, ...managedUsers];
    setManagedUsers(updated);
    setStoredData('admin_managed_users', updated);
    addAuditLog('ADMIN_ADD_USER', 'UserProfile', newUser.id, `Created ${newUser.role}: ${newUser.fullName}`);

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    const newNotice: Notice = {
      id: 'not_' + Date.now(),
      title: newNoticeTitle,
      category: newNoticeCategory,
      targetAudience: newNoticeAudience,
      content: newNoticeContent,
      publishedBy: 'Provost & Office of the Director',
      isPinned: newNoticePinned,
      date: new Date().toISOString().substring(0, 10),
    };

    const updated = [newNotice, ...notices];
    setNotices(updated);
    setStoredData('notices', updated);
    addAuditLog('PUBLISH_NOTICE', 'Notice', newNotice.id, `Published notice: ${newNotice.title}`);

    setShowCreateNoticeModal(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
  };

  const handleDeleteNotice = (id: string) => {
    const target = notices.find((n) => n.id === id);
    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    setStoredData('notices', updated);
    addAuditLog('DELETE_NOTICE', 'Notice', id, `Removed notice: ${target?.title}`);
  };

  const handleCreateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode || !newDeptName) return;

    const newDept: Department = {
      id: 'dept_' + Date.now(),
      code: newDeptCode.toUpperCase(),
      name: newDeptName,
      description: 'Department established with autonomous research charter and industry collaboration.',
      hodName: newDeptHod || 'Faculty Incharge',
      establishedYear: 2026,
      totalIntake: parseInt(newDeptIntake, 10) || 120,
      icon: 'Building2',
    };

    const updated = [...departments, newDept];
    setDepartments(updated);
    setStoredData('admin_departments', updated);
    addAuditLog('CREATE_DEPARTMENT', 'Department', newDept.id, `Created school of ${newDept.name} (${newDept.code})`);

    setShowAddDeptModal(false);
    setNewDeptCode('');
    setNewDeptName('');
    setNewDeptHod('');
  };

  const exportCSV = (type: string) => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (type === 'users') {
      csvContent += 'ID,Name,Email,Role,Department,EnrollmentNo,Status\n';
      managedUsers.forEach((u) => {
        csvContent += `"${u.id}","${u.fullName}","${u.email}","${u.role}","${u.department}","${u.enrollmentNo || ''}","${u.status}"\n`;
      });
    } else if (type === 'audit') {
      csvContent += 'Timestamp,UserEmail,Action,EntityType,Details\n';
      auditLogs.forEach((l) => {
        csvContent += `"${l.timestamp}","${l.userEmail}","${l.action}","${l.entityType}","${l.details}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_${type}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addAuditLog('EXPORT_REPORT', 'Report', type, `Exported ${type} dataset as CSV`);
  };

  const filteredUsers = managedUsers.filter((u) =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.enrollmentNo && u.enrollmentNo.toLowerCase().includes(userSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#101629]/90 border border-slate-200 dark:border-emerald-500/20 shadow-sm dark:shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shrink-0 bg-slate-100 dark:bg-slate-900 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'Administrator'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                <span>Executive Provost Authority</span>
                <span aria-hidden="true">·</span>
                <span>Super Administrator</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user?.fullName || 'Ajay Shewale'}
              </h1>
              <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-0.5">
                Central Academic Senate &amp; Institutional Governance · {user?.email || 'ajayshewale211@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-[#9BA6BC] block text-[10px]">Registered Scholars</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">4,850 Total</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-500 dark:text-[#9BA6BC] block text-[10px]">Pending Approvals</span>
              <span className="text-amber-500 dark:text-amber-400 font-mono font-bold text-sm">
                {managedUsers.filter((u) => u.status === 'Pending Approval').length} Accounts
              </span>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {[
            { id: 'overview', label: 'Institutional Overview', icon: Building2 },
            { id: 'users', label: 'User Management', icon: Users },
            { id: 'departments', label: 'Departments & Schools', icon: Building2 },
            { id: 'attendance', label: 'Attendance Audits', icon: CheckCircle2 },
            { id: 'notices', label: 'Notices & Circulars', icon: Bell },
            { id: 'audit_logs', label: 'System Audit Logs', icon: History },
            { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold'
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Total Enrolled</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">4,850</span>
                <span className="text-[11px] text-[#0284C7] dark:text-[#36D9FF] block mt-1">98.2% Active Accounts</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Faculty &amp; Staff</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">280</span>
                <span className="text-[11px] text-purple-600 dark:text-[#B46AFF] block mt-1">5 Academic Schools</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Pending Approvals</span>
                <span className="text-3xl font-extrabold font-mono text-amber-500 dark:text-amber-400 tabular-nums">
                  {managedUsers.filter((u) => u.status === 'Pending Approval').length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#9BA6BC] block mt-1">Require Provost review</span>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
                <span className="text-xs text-slate-500 dark:text-[#9BA6BC] block mb-1">Campus Attendance Avg</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">84.6%</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block mt-1">Above 75% threshold</span>
              </div>
            </div>

            {/* Split: Pending Approvals & Recent Audit Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span>Pending Account Approvals</span>
                  </h3>
                  <button onClick={() => setActiveTab('users')} className="text-xs text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold">
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {managedUsers
                    .filter((u) => u.status === 'Pending Approval')
                    .map((pendingUser) => (
                      <div
                        key={pendingUser.id}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs transition-colors"
                      >
                        <div>
                          <strong className="text-slate-900 dark:text-white block text-sm">{pendingUser.fullName}</strong>
                          <span className="text-slate-500 dark:text-[#9BA6BC]">
                            {pendingUser.email} · {pendingUser.department} ({pendingUser.role})
                          </span>
                        </div>
                        <button
                          onClick={() => handleApproveUser(pendingUser.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#080B14] bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-[#0284C7] dark:text-[#36D9FF]" />
                    <span>Recent Administrative Audit Logs</span>
                  </h3>
                  <button onClick={() => setActiveTab('audit_logs')} className="text-xs text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold">
                    Full Trail
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 rounded-lg bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800/80 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{log.action}</span>
                        <span className="font-mono text-[10px] text-slate-500 dark:text-[#9BA6BC]">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional User Directory</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Manage student &amp; faculty profiles, access controls, and permissions</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#9BA6BC] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search name, email, enrollment..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF]"
                  />
                </div>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Account</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Email &amp; Enrollment</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">{u.fullName}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        <span className="block">{u.email}</span>
                        {u.enrollmentNo && <span className="text-[10px] text-[#0284C7] dark:text-[#36D9FF]">{u.enrollmentNo}</span>}
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize font-sans px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-300">{u.department}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-sans text-[11px] font-semibold ${
                            u.status === 'Active'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : u.status === 'Pending Approval'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {u.status === 'Pending Approval' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleApproveUser(u.id)}
                              className="px-2.5 py-1 text-xs text-[#080B14] bg-emerald-400 hover:bg-emerald-300 rounded font-sans font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleRejectUser(u.id)}
                              className="px-2.5 py-1 text-xs text-rose-600 dark:text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500 rounded font-sans font-semibold flex items-center gap-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : u.id === 'usr_admin_ajay' ? (
                          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Primary Admin</span>
                        ) : (
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`px-2.5 py-1 text-xs rounded font-sans font-medium transition-colors ${
                              u.status === 'Active'
                                ? 'text-rose-600 dark:text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500'
                                : 'text-emerald-600 dark:text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500'
                            }`}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Department Governance</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Configure academic schools, assign Department Heads, and manage intakes</p>
              </div>

              <button
                onClick={() => setShowAddDeptModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Department</span>
              </button>
            </div>

            {departments.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 bg-slate-50 dark:bg-[#080B14]">
                <Building2 className="w-10 h-10 text-[#0284C7] dark:text-[#36D9FF] mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">All Departments Removed</h4>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-1 max-w-md mx-auto">
                  All departments have been cleared. As Administrator Ajay Shewale, you can charter new academic departments anytime by clicking below.
                </p>
                <button
                  onClick={() => setShowAddDeptModal(true)}
                  className="mt-4 px-4 py-2 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg inline-flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Charter New Department</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-5 rounded-xl bg-white dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-[#0284C7] dark:text-[#36D9FF] font-semibold">{dept.code}</span>
                      <span className="font-mono text-slate-500 dark:text-slate-400">Intake: {dept.totalIntake} Scholars</span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{dept.name}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1">{dept.description}</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-[#9BA6BC]">
                      <span>HOD: <strong className="text-slate-800 dark:text-white">{dept.hodName}</strong></span>
                      <span>Est. {dept.establishedYear}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ATTENDANCE AUDITS */}
        {activeTab === 'attendance' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Institutional Attendance Deficit Watchlist</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Automated detection of students with cumulative attendance below 75.0%</p>
              </div>

              <button
                onClick={() => alert('Automated SMS and Email notifications dispatched to students below 75%.')}
                className="px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-200 bg-amber-500/15 border border-amber-500/30 rounded-lg hover:bg-amber-500/25 transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                <span>Broadcast Low Attendance Warnings</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-right">Attended</th>
                    <th className="py-2.5 px-3 text-right">Total Sessions</th>
                    <th className="py-2.5 px-3 text-right">Current %</th>
                    <th className="py-2.5 px-3 text-center">Eligibility Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {attendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-white">{rec.subjectName}</td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">{rec.attendedClasses}</td>
                      <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">{rec.totalClasses}</td>
                      <td className="py-3 px-3 text-right font-bold">
                        <span className={rec.percentage < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                          {rec.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-sans font-semibold ${
                            rec.percentage < 75
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {rec.percentage < 75 ? 'Debarred Warning' : 'Normal Standing'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: NOTICES */}
        {activeTab === 'notices' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Notice Board Publisher</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Broadcast official circulars to student and faculty portals</p>
              </div>

              <button
                onClick={() => setShowCreateNoticeModal(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors flex items-center gap-1.5 shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Circular</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-[#9BA6BC] mb-1">
                      <span className="text-[#0284C7] dark:text-[#36D9FF] uppercase">{n.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Audience: {n.targetAudience}</span>
                      {n.isPinned && <span className="text-amber-500 dark:text-amber-400 font-semibold">· Pinned</span>}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-[#9BA6BC] mt-1 line-clamp-1">{n.content}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteNotice(n.id)}
                    className="p-2 text-slate-400 dark:text-[#9BA6BC] hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOGS */}
        {activeTab === 'audit_logs' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Immutable Institutional Audit Log</h3>
                <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Cryptographically sequenced audit trail for institutional compliance</p>
              </div>

              <button
                onClick={() => exportCSV('audit')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200 dark:border-transparent"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-[#080B14] text-slate-700 dark:text-[#9BA6BC] border-b border-slate-200 dark:border-slate-800 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Operator</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Target</th>
                    <th className="py-2.5 px-3">Audit Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 text-slate-500 dark:text-[#9BA6BC] whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{log.userEmail}</td>
                      <td className="py-2.5 px-3 text-[#0284C7] dark:text-[#36D9FF] font-bold">{log.action}</td>
                      <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">{log.entityType}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300 leading-relaxed">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: REPORTS & EXPORT */}
        {activeTab === 'reports' && (
          <div className="p-6 rounded-2xl bg-white dark:bg-[#101629] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none space-y-6 transition-colors">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Statutory &amp; Academic Reports</h3>
              <p className="text-xs text-slate-500 dark:text-[#9BA6BC]">Generate official CSV datasets for institutional accreditation bodies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Student Enrollment Register</h4>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-0.5">Complete scholar list with departments &amp; statuses</p>
                </div>
                <button
                  onClick={() => exportCSV('users')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg flex items-center gap-1.5 shadow-[0_0_12px_-2px_rgba(54,217,255,0.4)]"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Audit Ledger</h4>
                  <p className="text-xs text-slate-500 dark:text-[#9BA6BC] mt-0.5">Full trail of grade entries, attendance &amp; approvals</p>
                </div>
                <button
                  onClick={() => exportCSV('audit')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-200 dark:border-transparent transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Records Purge */}
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-500/30 space-y-4 transition-colors">
              <div className="flex items-center gap-2.5">
                <Trash2 className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Database &amp; Records Management (Danger Zone)</h4>
                  <p className="text-xs text-rose-700 dark:text-rose-200/80">Purge or wipe data records from the database &amp; local application state</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-[#080B14] border border-rose-300 dark:border-rose-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  To clear all data records from your remote Supabase PostgreSQL database, execute this SQL statement in your Supabase SQL editor:
                </p>
                <pre className="p-3 bg-slate-900 dark:bg-black/60 rounded-lg font-mono text-[11px] text-[#36D9FF] overflow-x-auto border border-slate-800">
{`TRUNCATE TABLE
    public.audit_logs,
    public.complaints,
    public.fee_records,
    public.notifications,
    public.examination_results,
    public.examinations,
    public.study_materials,
    public.assignment_submissions,
    public.assignments,
    public.attendance_records,
    public.attendance_sessions,
    public.timetables,
    public.faculty_assignments,
    public.subjects,
    public.courses,
    public.departments,
    public.notices,
    public.profiles
CASCADE;`}
                </pre>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`TRUNCATE TABLE
    public.audit_logs,
    public.complaints,
    public.fee_records,
    public.notifications,
    public.examination_results,
    public.examinations,
    public.study_materials,
    public.assignment_submissions,
    public.assignments,
    public.attendance_records,
    public.attendance_sessions,
    public.timetables,
    public.faculty_assignments,
    public.subjects,
    public.courses,
    public.departments,
    public.notices,
    public.profiles
CASCADE;`);
                      alert('Copied Supabase TRUNCATE SQL command to clipboard!');
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-transparent"
                  >
                    <span>Copy Supabase Truncate SQL</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to wipe all local application records? This will clear all stored attendance, notices, submissions, and complaints.')) {
                        clearAllStoredData();
                        alert('All local application records have been cleared! The page will now refresh.');
                        window.location.reload();
                      }
                    }}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-[0_0_15px_-3px_rgba(244,63,94,0.4)]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe All Local Application Records</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Provision Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arthur Pendelton"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  placeholder="arthur.pendelton@nexora.edu"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Artificial Intelligence & Data Science">AI &amp; Data Science</option>
                    <option value="Computer Science & Engineering">Computer Science</option>
                    <option value="Electronics & Telecommunication">Electronics</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Provision Account Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Notice Modal */}
      {showCreateNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Publish Official Notice</h3>
              <button onClick={() => setShowCreateNoticeModal(false)} className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Autumn 2026 Practical Examinations"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="academic">Academic</option>
                    <option value="examination">Examination</option>
                    <option value="events">Events</option>
                    <option value="admission">Admission</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={newNoticeAudience}
                    onChange={(e) => setNewNoticeAudience(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="all">All Campus</option>
                    <option value="students">Students Only</option>
                    <option value="faculty">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Circular Content</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Complete text of institutional circular..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF] resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNoticePinned}
                  onChange={(e) => setNewNoticePinned(e.target.checked)}
                  className="rounded text-[#36D9FF]"
                />
                <label htmlFor="pinCheck" className="text-xs text-slate-700 dark:text-slate-300">
                  Pin to top of public notice board
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Publish Circular Live
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Department Modal */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#101629] border border-slate-200 dark:border-[#36D9FF]/30 rounded-2xl shadow-2xl p-6 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Academic Department</h3>
              <button onClick={() => setShowAddDeptModal(false)} className="p-1 text-slate-400 hover:text-slate-700 dark:text-[#9BA6BC] dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDepartment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Dept Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BIOTECH"
                    value={newDeptCode}
                    onChange={(e) => setNewDeptCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Intake</label>
                  <input
                    type="number"
                    value={newDeptIntake}
                    onChange={(e) => setNewDeptIntake(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biotechnology & Computational Genomics"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Head of Department (HOD)</label>
                <input
                  type="text"
                  placeholder="Dr. Samantha Ward, Ph.D."
                  value={newDeptHod}
                  onChange={(e) => setNewDeptHod(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
              >
                Charter Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

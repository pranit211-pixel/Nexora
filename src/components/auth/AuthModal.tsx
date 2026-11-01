import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, GraduationCap, Briefcase, Phone, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [semester, setSemester] = useState('5');
  const [academicYear, setAcademicYear] = useState('2026-2027');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password, selectedRole);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to authenticate');
      }
    } catch (err: any) {
      setError(err?.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate per security specification: admin cannot be self-registered
    if (selectedRole === 'admin') {
      setError('Administrator accounts cannot be registered publicly. Contact the Provost Office.');
      return;
    }

    if (!fullName || !email) {
      setError('Please provide full name and institutional email');
      return;
    }

    setLoading(true);
    try {
      const res = await register({
        fullName,
        email,
        phone,
        role: 'faculty',
        department,
      }, password);

      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('ajayshewale211@gmail.com');
      setPassword('ajay123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#101629] border border-[#36D9FF]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">
              {mode === 'login' ? 'NEXORA Portal Access' : mode === 'register' ? 'New Portal Registration' : 'Password Recovery'}
            </h3>
            <p className="text-xs text-[#9BA6BC]">Secure institutional credential verification</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA6BC] hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Demo Evaluation Bar */}
        <div className="px-6 py-3 bg-[#080B14] border-b border-slate-800">
          <span className="text-[11px] font-mono text-[#9BA6BC] block mb-2">Instant 1-Click Demo Sign-In:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickDemo('student')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-[#36D9FF]/20 hover:text-[#36D9FF] hover:border-[#36D9FF]/30 border border-transparent rounded-lg text-xs font-medium text-slate-300 transition-all text-center flex items-center justify-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => handleQuickDemo('faculty')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-[#B46AFF]/20 hover:text-[#B46AFF] hover:border-[#B46AFF]/30 border border-transparent rounded-lg text-xs font-medium text-slate-300 transition-all text-center flex items-center justify-center gap-1"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent rounded-lg text-xs font-medium text-slate-300 transition-all text-center flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role selector for Login, or Notice for Registration */}
          {mode === 'login' ? (
            <div className="flex rounded-lg bg-[#080B14] p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedRole('student')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedRole === 'student'
                    ? 'bg-[#101629] text-[#36D9FF] shadow-sm font-semibold'
                    : 'text-[#9BA6BC] hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('faculty')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-[#101629] text-[#B46AFF] shadow-sm font-semibold'
                    : 'text-[#9BA6BC] hover:text-white'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-[#101629] text-emerald-400 shadow-sm font-semibold'
                    : 'text-[#9BA6BC] hover:text-white'
                }`}
              >
                Admin
              </button>
            </div>
          ) : (
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs space-y-1">
              <span className="font-bold text-[#B46AFF] block">Faculty Account Registration</span>
              <p className="text-[11px] text-slate-300">
                Notice: Students cannot self-register. Student accounts must be created by Course Faculty or the Administrator.
              </p>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Institutional Email / ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9BA6BC] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder={
                      selectedRole === 'admin'
                        ? 'admin.provost@nexora.edu'
                        : selectedRole === 'faculty'
                        ? 'dr.marcus@nexora.edu'
                        : 'alex.chen@nexora.edu'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#36D9FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9BA6BC] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : `Enter ${selectedRole.toUpperCase()} Portal`}
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9BA6BC] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9BA6BC] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="jordan.miller@nexora.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                  />
                </div>
                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Enrollment No.</label>
                    <input
                      type="text"
                      placeholder="NX-2026-AIDS-099"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Academic Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                >
                  <option value="Artificial Intelligence & Data Science">AI &amp; Data Science</option>
                  <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
                  <option value="Electronics & Telecommunication">Electronics &amp; Telecommunication</option>
                  <option value="Mechanical & Robotics Engineering">Mechanical &amp; Robotics</option>
                  <option value="Civil & Smart Infrastructure">Civil &amp; Smart Infrastructure</option>
                </select>
              </div>

              {selectedRole === 'student' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Register Institutional Account'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <div className="space-y-3">
              <p className="text-xs text-[#9BA6BC]">
                Enter your registered NEXORA student or faculty email address. A password reset link will be dispatched through the institutional SMTP server.
              </p>
              <div>
                <input
                  type="email"
                  placeholder="your.name@nexora.edu"
                  className="w-full px-3 py-2 text-xs bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>
              <button
                onClick={() => {
                  setSuccessMsg('Reset token dispatched to your institutional inbox.');
                  setTimeout(() => setMode('login'), 2000);
                }}
                className="w-full py-2 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-all"
              >
                Send Password Reset Token
              </button>
            </div>
          )}
        </div>

        {/* Footer Toggle */}
        <div className="px-6 py-3 bg-[#080B14] border-t border-slate-800 text-center text-xs text-[#9BA6BC]">
          {mode === 'login' ? (
            <span>
              New student or faculty member?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#36D9FF] font-semibold hover:underline"
              >
                Register Here
              </button>
            </span>
          ) : (
            <span>
              Already hold credentials?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#36D9FF] font-semibold hover:underline"
              >
                Return to Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

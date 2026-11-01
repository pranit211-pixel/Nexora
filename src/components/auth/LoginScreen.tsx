import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Briefcase,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ThemeToggle } from '../common/ThemeToggle';

interface LoginScreenProps {
  onBrowsePublicSite: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBrowsePublicSite }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Registration fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [department, setDepartment] = useState('Artificial Intelligence & Data Science');
  const [semester, setSemester] = useState('1');

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please provide your institutional email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password, selectedRole);
      if (!res.success) {
        setError(res.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError('Please fill in all mandatory fields.');
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
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failure.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleToFill: UserRole) => {
    setSelectedRole(roleToFill);
    if (roleToFill === 'admin') {
      setEmail('ajayshewale211@gmail.com');
      setPassword('ajay123');
    } else {
      setEmail('');
      setPassword('');
    }
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080B14] text-slate-900 dark:text-[#F5F7FF] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200">
      {/* Floating Theme Switcher at Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Brand Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#36D9FF]/20 via-[#B46AFF]/20 to-[#36D9FF]/30 border border-[#36D9FF]/40 shadow-[0_0_25px_-4px_rgba(54,217,255,0.4)] mb-4">
          <Sparkles className="w-7 h-7 text-[#36D9FF]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          NEXORA <span className="text-[#36D9FF]">PORTAL</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-[#9BA6BC] mt-1.5 font-medium">
          Autonomous Institute of Technology · Secure Access Gate
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white/95 dark:bg-[#101629]/90 border border-slate-200 dark:border-[#36D9FF]/25 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl transition-colors">
        {/* Role Segment Tabs */}
        {mode === 'login' && (
          <div className="p-3 bg-slate-100/80 dark:bg-[#080B14]/80 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-[11px] font-mono text-slate-500 dark:text-[#9BA6BC] block mb-2 px-1">
              Select Portal Type:
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-white dark:bg-[#101629] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('student');
                  fillCredentials('student');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'student'
                    ? 'bg-[#36D9FF]/20 text-[#0284C7] dark:text-[#36D9FF] border border-[#36D9FF]/40 shadow-sm'
                    : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('faculty');
                  fillCredentials('faculty');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'faculty'
                    ? 'bg-[#B46AFF]/20 text-purple-600 dark:text-[#B46AFF] border border-[#B46AFF]/40 shadow-sm'
                    : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  fillCredentials('admin');
                }}
                className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'admin'
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-600 dark:text-[#9BA6BC] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 sm:p-7 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs space-y-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setSuccessMsg(null);
                }}
                className="mt-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {selectedRole === 'admin' ? (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-600 dark:text-emerald-300 flex items-center justify-between mb-2">
                  <span>Primary Admin: <strong>ajayshewale211@gmail.com</strong></span>
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin')}
                    className="text-[10px] font-bold text-[#080B14] bg-emerald-400 hover:bg-emerald-300 px-2 py-0.5 rounded transition-colors"
                  >
                    Auto-fill
                  </button>
                </div>
              ) : (
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-[11px] text-sky-700 dark:text-sky-300 mb-2 leading-relaxed">
                  Student/Faculty accounts require approval. Once you register, Administrator Ajay Shewale (<span className="font-mono">ajayshewale211@gmail.com</span>) must approve your account before login.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Institutional Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-[#9BA6BC] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder={
                      selectedRole === 'student'
                        ? 'student.applicant@domain.com'
                        : selectedRole === 'faculty'
                        ? 'faculty.applicant@domain.com'
                        : 'ajayshewale211@gmail.com'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
                    className="text-[11px] text-[#0284C7] dark:text-[#36D9FF] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 dark:text-[#9BA6BC] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-[#36D9FF] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 dark:text-[#9BA6BC] hover:text-slate-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-xl transition-all shadow-[0_0_20px_-3px_rgba(54,217,255,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{loading ? 'Authenticating...' : `Sign In to ${selectedRole.toUpperCase()} Portal`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE: REGISTER - ONLY FACULTY CAN REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="p-3 bg-purple-50 dark:bg-[#B46AFF]/10 border border-purple-200 dark:border-[#B46AFF]/30 rounded-xl text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-purple-700 dark:text-[#B46AFF]">
                  <Briefcase className="w-4 h-4" />
                  <span>Faculty Registration Portal</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Notice:</strong> Students cannot self-register. All student accounts are created directly by Course Faculty or the Institutional Administrator with an assigned password.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@nexora.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science / AI / Electronics"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>

              <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                Notice: Account will be reviewed by Administrator Ajay Shewale (ajayshewale211@gmail.com). You will be granted access once approved.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-xl transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)] disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Request for Admin Approval'}
              </button>
            </form>
          )}

          {/* MODE: FORGOT */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-[#9BA6BC] leading-relaxed">
                Enter your institutional email address. We will dispatch a password reset link to your official inbox.
              </p>
              <div>
                <input
                  type="email"
                  placeholder="your.email@nexora.edu"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#080B14] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#36D9FF]"
                />
              </div>
              <button
                onClick={() => {
                  setSuccessMsg('Reset instructions sent to your email.');
                  setTimeout(() => setMode('login'), 2000);
                }}
                className="w-full py-2.5 text-xs font-bold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-xl transition-all"
              >
                Send Recovery Link
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-[#080B14] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-[#9BA6BC]">
          {mode === 'login' ? (
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className="text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold"
            >
              Need an account? Register
            </button>
          ) : (
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="text-[#0284C7] dark:text-[#36D9FF] hover:underline font-semibold"
            >
              Back to Login
            </button>
          )}

          <button
            onClick={onBrowsePublicSite}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-[#0284C7] dark:text-[#36D9FF]" />
            <span>Public Website</span>
          </button>
        </div>
      </div>
    </div>
  );
};

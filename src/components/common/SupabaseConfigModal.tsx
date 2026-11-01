import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testDatabaseConnectivity,
  DatabaseDiagnosticResult,
  sanitizeSupabaseUrl
} from '../../integrations/supabase/client';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeployGuide: () => void;
}

const FULL_SQL_MIGRATION = `-- ==============================================================================
-- NEXORA SMART COLLEGE & CAMPUS PORTAL - SUPABASE POSTGRESQL SCHEMA
-- Migration: 20261031_init_nexora_schema.sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
    department TEXT NOT NULL,
    enrollment_no TEXT UNIQUE,
    phone TEXT,
    semester INT DEFAULT 1,
    academic_year TEXT DEFAULT '2026-2027',
    avatar_url TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    hod_name TEXT,
    established_year INT DEFAULT 2012,
    total_intake INT DEFAULT 120,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COURSES
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    level TEXT NOT NULL CHECK (level IN ('UG', 'PG', 'Diploma', 'Doctoral')),
    duration_semesters INT DEFAULT 8,
    credits INT DEFAULT 160,
    eligibility TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    credits INT DEFAULT 4,
    type TEXT DEFAULT 'Theory' CHECK (type IN ('Theory', 'Practical', 'Elective', 'Seminar')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TIMETABLES
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    section TEXT DEFAULT 'A',
    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
    period_start TIME NOT NULL,
    period_end TIME NOT NULL,
    subject_name TEXT NOT NULL,
    faculty_name TEXT NOT NULL,
    room_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ATTENDANCE SESSIONS & RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    section TEXT DEFAULT 'A',
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_present BOOLEAN NOT NULL DEFAULT TRUE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ASSIGNMENTS & SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    max_marks INT DEFAULT 100,
    file_attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_date TIMESTAMPTZ DEFAULT NOW(),
    file_url TEXT NOT NULL,
    marks_obtained INT,
    status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Graded', 'Late', 'Resubmission Requested')),
    feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- 8. STUDY MATERIALS
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    file_type TEXT NOT NULL DEFAULT 'PDF',
    file_url TEXT NOT NULL,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTICES
CREATE TABLE IF NOT EXISTS public.notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'examination', 'events', 'admission', 'general')),
    target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'students', 'faculty')),
    content TEXT NOT NULL,
    published_by TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial departments
INSERT INTO public.departments (code, name, description, hod_name, established_year, total_intake, icon)
VALUES
('CSE', 'Computer Science & Engineering', 'Distributed cloud computing and quantum systems.', 'Dr. Elena Vance, Ph.D. (MIT)', 2012, 180, 'Cpu'),
('AIDS', 'Artificial Intelligence & Data Science', 'Deep neural architectures and autonomous robotics.', 'Dr. Marcus Sterling, Ph.D. (Stanford)', 2018, 120, 'BrainCircuit'),
('ECE', 'Electronics & Telecommunication', 'Advanced VLSI and 6G communications.', 'Dr. Rajesh Nair, Ph.D. (IIT Bombay)', 2012, 120, 'Radio')
ON CONFLICT (code) DO NOTHING;

-- Seed initial notices
INSERT INTO public.notices (title, category, target_audience, content, published_by, is_pinned)
VALUES
('Autumn 2026 Examination Schedule Announced', 'examination', 'all', 'Mid-Semester Examinations commence November 15, 2026.', 'Office of the Controller of Examinations', true),
('NEXORA Global AI & Robotics Hackathon 2026', 'events', 'all', 'Annual hackathon with $50,000 prize pool.', 'Department of AI & Data Science', true)
ON CONFLICT DO NOTHING;
`;

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onOpenDeployGuide,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [testing, setTesting] = useState(false);
  const [diagResult, setDiagResult] = useState<DatabaseDiagnosticResult | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  useEffect(() => {
    if (isOpen) {
      handleRunDiagnostics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRunDiagnostics = async () => {
    setTesting(true);
    const result = await testDatabaseConnectivity();
    setDiagResult(result);
    setTesting(false);
  };

  const handleSave = () => {
    const cleanedUrl = sanitizeSupabaseUrl(url);
    saveSupabaseCredentials(cleanedUrl, anonKey);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const copyFullSql = () => {
    navigator.clipboard.writeText(FULL_SQL_MIGRATION);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const copyMigrationPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20261031_init_nexora_schema.sql');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#101629] border border-[#36D9FF]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#36D9FF]/10 text-[#36D9FF] border border-[#36D9FF]/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Database Connection &amp; Diagnostics</h3>
              <p className="text-xs text-[#9BA6BC]">Supabase PostgreSQL &amp; Auth Connectivity Status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA6BC] hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Diagnostic Status Box */}
          <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-[#36D9FF]" />
                Live Connection Diagnostic Report
              </span>
              <button
                onClick={handleRunDiagnostics}
                disabled={testing}
                className="px-2.5 py-1 text-xs text-[#36D9FF] hover:text-white bg-[#101629] border border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${testing ? 'animate-spin' : ''}`} />
                <span>Re-Test</span>
              </button>
            </div>

            {diagResult ? (
              <div className="space-y-3 text-xs">
                {/* 3 Step Pill Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#101629] border border-slate-800">
                    <span className="text-[10px] text-[#9BA6BC] block mb-1">1. Project URL</span>
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      {diagResult.url ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="truncate">Active</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>Not set</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#101629] border border-slate-800">
                    <span className="text-[10px] text-[#9BA6BC] block mb-1">2. Auth Service (GoTrue)</span>
                    <div className="flex items-center gap-1.5 font-semibold">
                      {diagResult.authConnected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Connected (HTTP 200)</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-slate-400">Offline</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#101629] border border-slate-800">
                    <span className="text-[10px] text-[#9BA6BC] block mb-1">3. PostgreSQL Tables</span>
                    <div className="flex items-center gap-1.5 font-semibold">
                      {diagResult.schemaReady ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Tables Ready</span>
                        </>
                      ) : diagResult.missingTables && diagResult.missingTables.length > 0 ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-300">Migration Needed</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">Local DB Mode</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Explanation text */}
                <div
                  className={`p-3.5 rounded-lg border leading-relaxed ${
                    diagResult.status === 'ready'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : diagResult.status === 'migration_needed'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-slate-800/40 border-slate-700 text-slate-300'
                  }`}
                >
                  <p>{diagResult.message}</p>

                  {diagResult.status === 'migration_needed' && (
                    <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2">
                      <p className="font-semibold text-white">
                        Next Step to Connect Your Supabase PostgreSQL Tables:
                      </p>
                      <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-100">
                        <li>Click the <strong>"Copy Full SQL Migration"</strong> button below.</li>
                        <li>Open your Supabase project in your browser &rarr; <strong>SQL Editor</strong>.</li>
                        <li>Paste and click <strong>"Run"</strong>.</li>
                        <li>Return here and click <strong>"Re-Test"</strong>. Your tables will be verified instantly!</li>
                      </ol>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={copyFullSql}
                          className="px-3 py-1.5 bg-[#36D9FF] hover:bg-[#36D9FF]/90 text-[#080B14] font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
                        >
                          {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedSql ? 'SQL Script Copied!' : 'Copy Full SQL Migration Script'}</span>
                        </button>
                        <button
                          onClick={() => setShowSqlViewer(!showSqlViewer)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>{showSqlViewer ? 'Hide SQL' : 'View SQL in App'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#9BA6BC] py-2 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#36D9FF]" />
                <span>Running database diagnostics...</span>
              </div>
            )}
          </div>

          {/* Collapsible SQL Script View */}
          {showSqlViewer && (
            <div className="p-4 rounded-xl bg-[#080B14] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#36D9FF]">supabase/migrations/20261031_init_nexora_schema.sql</span>
                <button
                  onClick={copyFullSql}
                  className="text-xs text-[#36D9FF] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSql ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-black/60 rounded-lg text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto border border-slate-800">
                {FULL_SQL_MIGRATION}
              </pre>
            </div>
          )}

          {/* Form Credentials */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300">
                  VITE_SUPABASE_URL
                </label>
                <span className="text-[11px] text-[#9BA6BC]">Base URL (without /rest/v1/)</span>
              </div>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                VITE_SUPABASE_ANON_KEY (Public Publishable Key)
              </label>
              <textarea
                rows={2}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2 text-xs font-mono bg-[#080B14] border border-slate-800 rounded-lg text-white focus:outline-none focus:border-[#36D9FF] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Migration Path Copy */}
          <div className="p-3.5 rounded-xl bg-[#080B14] border border-slate-800 flex items-center justify-between text-xs text-[#9BA6BC]">
            <div>
              <span className="font-semibold text-white block">Migration File Location</span>
              <span className="text-[11px] font-mono text-[#36D9FF]">/supabase/migrations/20261031_init_nexora_schema.sql</span>
            </div>
            <button
              onClick={copyMigrationPath}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs flex items-center gap-1 transition-colors"
            >
              {copiedPath ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPath ? 'Copied' : 'Copy Path'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#080B14]/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenDeployGuide();
            }}
            className="text-xs text-[#B46AFF] hover:underline flex items-center gap-1"
          >
            <span>Read Deployment Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-[#080B14] bg-[#36D9FF] hover:bg-[#36D9FF]/90 rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(54,217,255,0.4)]"
            >
              Save Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

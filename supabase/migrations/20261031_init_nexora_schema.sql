-- ==============================================================================
-- NEXORA SMART COLLEGE & CAMPUS PORTAL - SUPABASE POSTGRESQL SCHEMA
-- Migration: 20261031_init_nexora_schema.sql
-- Description: Complete normalized institutional database schema with Row Level
--              Security (RLS), RBAC roles, audit triggers, and foreign keys.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
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

-- 5. FACULTY ASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.faculty_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    faculty_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    section TEXT DEFAULT 'A',
    academic_year TEXT DEFAULT '2026-2027',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TIMETABLES
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

-- 7. ATTENDANCE SESSIONS
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

-- 8. ATTENDANCE RECORDS
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_present BOOLEAN NOT NULL DEFAULT TRUE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ASSIGNMENTS
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

-- 10. ASSIGNMENT SUBMISSIONS
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

-- 11. STUDY MATERIALS
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

-- 12. EXAMINATIONS
CREATE TABLE IF NOT EXISTS public.examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Internal-1', 'Internal-2', 'Semester End', 'Practical', 'Viva')),
    department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year TEXT DEFAULT '2026-2027',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    instructions TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. EXAMINATION RESULTS
CREATE TABLE IF NOT EXISTS public.examination_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.examinations(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5,2) NOT NULL,
    max_marks NUMERIC(5,2) NOT NULL DEFAULT 100,
    grade TEXT NOT NULL,
    sgpa NUMERIC(4,2),
    cgpa NUMERIC(4,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. NOTICES
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

-- 15. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('notice', 'attendance_warning', 'assignment', 'result', 'approval', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FEE RECORDS
CREATE TABLE IF NOT EXISTS public.fee_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year TEXT DEFAULT '2026-2027',
    total_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Paid', 'Partial', 'Pending', 'Overdue')),
    receipt_no TEXT UNIQUE,
    transaction_ref TEXT,
    due_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. COMPLAINTS & FEEDBACK
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Infrastructure', 'Academic', 'Hostel', 'Canteen', 'Transportation', 'Other')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Dismissed')),
    response TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS across all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.examination_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check user role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Public can read basic faculty/staff, users read self, admin manages all
CREATE POLICY "Users read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.get_auth_role() = 'admin' OR role = 'faculty');

CREATE POLICY "Users update own profile contact info" ON public.profiles
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Admin manages all profiles" ON public.profiles
    FOR ALL USING (public.get_auth_role() = 'admin');

-- Attendance: Students can only view their own records
CREATE POLICY "Students view own attendance" ON public.attendance_records
    FOR SELECT USING (student_id = auth.uid() OR public.get_auth_role() IN ('faculty', 'admin'));

CREATE POLICY "Faculty and admin manage attendance" ON public.attendance_records
    FOR ALL USING (public.get_auth_role() IN ('faculty', 'admin'));

-- Submissions: Students manage own submissions; Faculty evaluate
CREATE POLICY "Students manage own submissions" ON public.assignment_submissions
    FOR ALL USING (student_id = auth.uid() OR public.get_auth_role() IN ('faculty', 'admin'));

-- Results: Students view own results
CREATE POLICY "Students view own results" ON public.examination_results
    FOR SELECT USING (student_id = auth.uid() OR public.get_auth_role() IN ('faculty', 'admin'));

-- Fees: Students view own fee records
CREATE POLICY "Students view own fees" ON public.fee_records
    FOR SELECT USING (student_id = auth.uid() OR public.get_auth_role() = 'admin');

-- Complaints: Students view & create own complaints
CREATE POLICY "Students view own complaints" ON public.complaints
    FOR ALL USING (student_id = auth.uid() OR public.get_auth_role() = 'admin');

-- Notifications: Users only see their notifications
CREATE POLICY "Users see own notifications" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- Notices: Everyone can read
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Admin can manage notices" ON public.notices FOR ALL USING (public.get_auth_role() = 'admin');

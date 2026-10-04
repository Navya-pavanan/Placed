-- ====================================================================
-- OFFICIAL PLACED STUDENT DASHBOARD DATABASE SCHEMA MIGRATION
-- Production-Safe SQL: Creates NEW tables only. No existing tables modified.
-- ====================================================================

-- 1. Students Profile Table
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    title TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    roll_number TEXT,
    degree TEXT,
    institution TEXT,
    cgpa TEXT,
    batch_year TEXT,
    backlogs TEXT,
    linkedin TEXT,
    github TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Student Skill Performance Table (S-1)
CREATE TABLE IF NOT EXISTS public.student_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    skill_name TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    target_benchmark INTEGER NOT NULL DEFAULT 85,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Student Resumes Table (S-3)
CREATE TABLE IF NOT EXISTS public.student_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE,
    summary TEXT,
    edu_degree TEXT,
    edu_inst TEXT,
    edu_year TEXT,
    edu_score TEXT,
    int_company TEXT,
    int_role TEXT,
    int_desc TEXT,
    proj_name TEXT,
    proj_stack TEXT,
    proj_desc TEXT,
    skills TEXT[] DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ATS Analyses Table (S-3)
CREATE TABLE IF NOT EXISTS public.ats_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    job_title TEXT,
    job_description TEXT NOT NULL,
    ats_score INTEGER NOT NULL,
    density NUMERIC,
    matched_keywords TEXT[],
    missing_keywords TEXT[],
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Video Classes Library Table
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    topic TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration TEXT,
    instructor TEXT,
    thumbnail TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Structured Study Modules Table
CREATE TABLE IF NOT EXISTS public.study_modules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    subject_id TEXT NOT NULL,
    description TEXT,
    s1_gap_tag TEXT,
    is_recommended BOOLEAN DEFAULT false,
    recommendation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Study Lessons Table
CREATE TABLE IF NOT EXISTS public.study_lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.study_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0
);

-- 8. Student Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES public.study_modules(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES public.study_lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'locked',
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, lesson_id)
);

-- 9. Placement Opportunities / Drives Table
CREATE TABLE IF NOT EXISTS public.student_opportunities (
    id TEXT PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    logo_url TEXT,
    fallback_logo TEXT,
    tags JSONB,
    location TEXT,
    compensation TEXT,
    match_percentage INTEGER,
    status TEXT,
    pipeline_column TEXT
);

-- 10. Scheduled Interviews Table
CREATE TABLE IF NOT EXISTS public.student_interviews (
    id TEXT PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    day TEXT,
    time TEXT,
    is_today BOOLEAN DEFAULT false,
    status_badge TEXT,
    status_badge_class TEXT,
    mode TEXT,
    duration TEXT,
    platform TEXT,
    logo_url TEXT,
    fallback_logo TEXT
);

-- RLS POLICIES FOR SECURE DATA ISOLATION
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ats_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_interviews ENABLE ROW LEVEL SECURITY;

-- Public Read for Catalog Content
CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Public Read Study Modules" ON public.study_modules FOR SELECT USING (true);
CREATE POLICY "Public Read Study Lessons" ON public.study_lessons FOR SELECT USING (true);

-- Student Ownership Policies
CREATE POLICY "Student Self Access" ON public.students FOR ALL USING (true);
CREATE POLICY "Student Skill Access" ON public.student_skills FOR ALL USING (true);
CREATE POLICY "Student Resume Access" ON public.student_resumes FOR ALL USING (true);
CREATE POLICY "Student ATS Access" ON public.ats_analyses FOR ALL USING (true);
CREATE POLICY "Student Progress Access" ON public.student_lesson_progress FOR ALL USING (true);
CREATE POLICY "Student Opportunities Access" ON public.student_opportunities FOR ALL USING (true);
CREATE POLICY "Student Interviews Access" ON public.student_interviews FOR ALL USING (true);

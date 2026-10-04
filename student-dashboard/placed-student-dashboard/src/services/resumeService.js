import { supabase } from '../lib/supabaseClient.js';
import { persistentStorage } from '../lib/persistentStorage.js';
import { studentService } from './studentService.js';

export const INITIAL_SECTION_IDS = [
  'personal',
  'summary',
  'education',
  'skills',
  'projects',
  'internships',
  'certifications'
];

export const AVAILABLE_SECTIONS_CATALOG = [
  { id: 'personal', title: 'Personal Details', isEssential: true, canDelete: false, icon: 'User' },
  { id: 'summary', title: 'Professional Summary', isEssential: true, canDelete: true, icon: 'FileText' },
  { id: 'education', title: 'Education', isEssential: true, canDelete: true, icon: 'GraduationCap' },
  { id: 'skills', title: 'Technical Skills & Keywords', isEssential: true, canDelete: true, icon: 'Code' },
  { id: 'projects', title: 'Featured Projects', isEssential: true, canDelete: true, icon: 'FolderGit2' },
  { id: 'internships', title: 'Internships', isEssential: true, canDelete: true, icon: 'Briefcase' },
  { id: 'experience', title: 'Work Experience', isEssential: false, canDelete: true, icon: 'Briefcase' },
  { id: 'certifications', title: 'Certifications', isEssential: true, canDelete: true, icon: 'Award' },
  { id: 'achievements', title: 'Key Achievements & Awards', isEssential: false, canDelete: true, icon: 'Trophy' },
  { id: 'hackathons', title: 'Hackathons & Competitions', isEssential: false, canDelete: true, icon: 'Flame' },
  { id: 'workshops', title: 'Workshops & Seminars', isEssential: false, canDelete: true, icon: 'Presentation' },
  { id: 'courses', title: 'Relevant Coursework', isEssential: false, canDelete: true, icon: 'BookOpen' },
  { id: 'languages', title: 'Languages', isEssential: false, canDelete: true, icon: 'Languages' },
  { id: 'volunteer', title: 'Volunteer Experience', isEssential: false, canDelete: true, icon: 'HeartHandshake' },
  { id: 'responsibilities', title: 'Positions of Responsibility', isEssential: false, canDelete: true, icon: 'Users' },
  { id: 'publications', title: 'Publications & Research', isEssential: false, canDelete: true, icon: 'ScrollText' },
  { id: 'extracurricular', title: 'Extracurricular Activities', isEssential: false, canDelete: true, icon: 'Compass' },
  { id: 'interests', title: 'Areas of Interest', isEssential: false, canDelete: true, icon: 'Sparkles' }
];

export const RESUME_TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic ATS',
    tagline: 'Traditional & proven corporate standard',
    badge: 'High ATS Pass Rate'
  },
  {
    id: 'modern',
    name: 'Modern Clean',
    tagline: 'Sleek header with subtle brand styling',
    badge: 'Popular for Tech'
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    tagline: 'Clean whitespace & distraction-free layout',
    badge: 'Crisp & Direct'
  },
  {
    id: 'technical',
    name: 'Technical / Developer',
    tagline: 'Prioritizes tech stacks, code links & projects',
    badge: 'Dev Focused'
  },
  {
    id: 'graduate',
    name: 'Graduate / Campus',
    tagline: 'Tailored for freshers & campus placement drives',
    badge: 'Campus Choice'
  }
];

export const DEFAULT_RESUME_DATA = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
  template: 'classic',
  activeSections: [...INITIAL_SECTION_IDS],
  sectionTitles: {}, // allows custom rename per section: { [id]: 'Custom Title' }

  // Multi-entry arrays
  education: [],
  projects: [],
  internships: [],
  experience: [],
  certifications: [],
  achievements: [],
  hackathons: [],
  workshops: [],
  courses: [],
  languages: [],
  volunteer: [],
  responsibilities: [],
  publications: [],
  extracurricular: [],
  interests: [],
  customSections: [], // array of { id, title, items: [...] }

  // Legacy flat fields for backward compatibility
  eduDegree: '',
  eduInst: '',
  eduYear: '',
  eduScore: '',
  intCompany: '',
  intRole: '',
  intDesc: '',
  projName: '',
  projStack: '',
  projDesc: ''
};

/**
 * Normalizes loaded resume data, ensuring all multi-entry arrays and fields exist.
 */
export const normalizeResumeData = (raw = {}) => {
  const data = { ...DEFAULT_RESUME_DATA, ...raw };

  // Normalize education array (migrate legacy flat fields if education is empty)
  if (!Array.isArray(data.education) || data.education.length === 0) {
    if (data.eduDegree || data.eduInst) {
      data.education = [
        {
          id: 'edu-legacy-1',
          degree: data.eduDegree || '',
          institution: data.eduInst || '',
          boardOrUniversity: '',
          startYear: '',
          endYear: data.eduYear || '',
          scoreType: 'cgpa',
          score: data.eduScore || '',
          location: ''
        }
      ];
    } else {
      data.education = [];
    }
  }

  // Normalize projects array
  if (!Array.isArray(data.projects) || data.projects.length === 0) {
    if (data.projName || data.projStack || data.projDesc) {
      data.projects = [
        {
          id: 'proj-legacy-1',
          title: data.projName || '',
          role: 'Lead Developer',
          techStack: data.projStack || '',
          link: '',
          date: '',
          description: data.projDesc || ''
        }
      ];
    } else {
      data.projects = [];
    }
  }

  // Normalize internships array
  if (!Array.isArray(data.internships) || data.internships.length === 0) {
    if (data.intCompany || data.intRole || data.intDesc) {
      data.internships = [
        {
          id: 'int-legacy-1',
          company: data.intCompany || '',
          role: data.intRole || '',
          location: '',
          duration: '',
          description: data.intDesc || ''
        }
      ];
    } else {
      data.internships = [];
    }
  }

  // Ensure all other arrays exist
  [
    'experience', 'certifications', 'achievements', 'hackathons',
    'workshops', 'courses', 'languages', 'volunteer',
    'responsibilities', 'publications', 'extracurricular', 'interests', 'customSections'
  ].forEach(field => {
    if (!Array.isArray(data[field])) {
      data[field] = [];
    }
  });

  // Ensure activeSections has required baseline
  if (!Array.isArray(data.activeSections) || data.activeSections.length === 0) {
    data.activeSections = [...INITIAL_SECTION_IDS];
  } else {
    // Ensure 'personal' is always present
    if (!data.activeSections.includes('personal')) {
      data.activeSections.unshift('personal');
    }
  }

  if (!data.template) {
    data.template = 'classic';
  }

  if (!data.sectionTitles || typeof data.sectionTitles !== 'object') {
    data.sectionTitles = {};
  }

  return data;
};

/**
 * S-3 Resume Management Service
 * Provides real persistence for student resume data & skill tags across sessions.
 */
export const resumeService = {
  /**
   * Fetch current student resume content & skill tags from database / local persistent storage.
   */
  async getResume() {
    const student = await studentService.getOrCreateStudent();

    const formData = await persistentStorage.get(
      'resume_form',
      async () => {
        if (!student?.id) return DEFAULT_RESUME_DATA;

        const { data, error } = await supabase
          .from('student_resumes')
          .select('*')
          .eq('student_id', student.id)
          .maybeSingle();

        if (error) throw error;
        if (!data) return DEFAULT_RESUME_DATA;

        return {
          name: student.full_name || '',
          title: student.title || '',
          email: student.email || '',
          phone: student.phone || '',
          linkedin: student.linkedin || '',
          github: student.github || '',
          summary: data.summary || '',
          eduDegree: data.edu_degree || '',
          eduInst: data.edu_inst || '',
          eduYear: data.edu_year || '',
          eduScore: data.edu_score || '',
          intCompany: data.int_company || '',
          intRole: data.int_role || '',
          intDesc: data.int_desc || '',
          projName: data.proj_name || '',
          projStack: data.proj_stack || '',
          projDesc: data.proj_desc || ''
        };
      },
      DEFAULT_RESUME_DATA
    );

    const skills = await persistentStorage.get(
      'resume_skills',
      async () => {
        if (!student?.id) return [];

        const { data, error } = await supabase
          .from('student_resumes')
          .select('skills')
          .eq('student_id', student.id)
          .maybeSingle();

        if (error) throw error;
        return data?.skills || [];
      },
      []
    );

    const normalized = normalizeResumeData(formData);

    // If profile info exists on student, pre-fill empty contact fields
    if (student) {
      if (!normalized.name && student.full_name) normalized.name = student.full_name;
      if (!normalized.email && student.email) normalized.email = student.email;
      if (!normalized.phone && student.phone) normalized.phone = student.phone;
      if (!normalized.linkedin && student.linkedin) normalized.linkedin = student.linkedin;
      if (!normalized.github && student.github) normalized.github = student.github;
      if (!normalized.title && student.title) normalized.title = student.title;
    }

    return { formData: normalized, skills };
  },

  /**
   * Persist updated student resume form data directly to persistentStorage & Supabase.
   * @param {Object} formData 
   */
  async updateResume(formData) {
    const student = await studentService.getOrCreateStudent();
    const { skills } = await this.getResume();
    
    // Normalize and keep legacy fields synced
    const normalized = normalizeResumeData(formData);

    // Legacy sync
    const firstEdu = normalized.education?.[0];
    const firstProj = normalized.projects?.[0];
    const firstInt = normalized.internships?.[0];

    normalized.eduDegree = firstEdu?.degree || normalized.eduDegree || '';
    normalized.eduInst = firstEdu?.institution || normalized.eduInst || '';
    normalized.eduYear = firstEdu?.endYear || normalized.eduYear || '';
    normalized.eduScore = firstEdu?.score || normalized.eduScore || '';

    normalized.projName = firstProj?.title || normalized.projName || '';
    normalized.projStack = firstProj?.techStack || normalized.projStack || '';
    normalized.projDesc = firstProj?.description || normalized.projDesc || '';

    normalized.intCompany = firstInt?.company || normalized.intCompany || '';
    normalized.intRole = firstInt?.role || normalized.intRole || '';
    normalized.intDesc = firstInt?.description || normalized.intDesc || '';

    return persistentStorage.set(
      'resume_form',
      async () => {
        if (!student?.id) return;

        const payload = {
          student_id: student.id,
          summary: normalized.summary,
          edu_degree: normalized.eduDegree,
          edu_inst: normalized.eduInst,
          edu_year: normalized.eduYear,
          edu_score: normalized.eduScore,
          int_company: normalized.intCompany,
          int_role: normalized.intRole,
          int_desc: normalized.intDesc,
          proj_name: normalized.projName,
          proj_stack: normalized.projStack,
          proj_desc: normalized.projDesc,
          skills: skills,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('student_resumes')
          .upsert(payload, { onConflict: 'student_id' });

        if (error) throw error;
      },
      normalized
    );
  },

  /**
   * Persist updated skill tags list directly to Supabase and storage.
   * @param {string[]} skills 
   */
  async updateSkills(skills) {
    const student = await studentService.getOrCreateStudent();
    const updatedSkills = [...skills];

    return persistentStorage.set(
      'resume_skills',
      async () => {
        if (!student?.id) return;

        const { error } = await supabase
          .from('student_resumes')
          .upsert({ 
            student_id: student.id,
            skills: updatedSkills, 
            updated_at: new Date().toISOString() 
          }, { onConflict: 'student_id' });

        if (error) throw error;
      },
      updatedSkills
    );
  }
};

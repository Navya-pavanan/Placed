export const MOCK_RESUME_DATA = {
  name: 'Kavya Kulothungan',
  title: 'Aspiring Full Stack Engineer & CS Undergraduate',
  email: 'kavya.k@example.com',
  phone: '+91 98765 43210',
  location: 'Chennai, Tamil Nadu, India',
  linkedin: 'linkedin.com/in/kavyakulothungan',
  github: 'github.com/kavyakulothungan01',
  portfolio: 'kavya-portfolio.dev',
  summary: 'Passionate and detail-oriented Computer Science student with a solid foundation in Data Structures, React, Node.js, and Cloud APIs. Seeking an entry-level software engineering or internship role to build scalable digital products and solve challenging engineering problems.',
  template: 'classic',
  activeSections: [
    'personal',
    'summary',
    'education',
    'skills',
    'projects',
    'internships',
    'certifications',
    'achievements'
  ],
  sectionTitles: {},

  education: [
    {
      id: 'edu-1',
      degree: 'BCA (Bachelor of Computer Applications)',
      institution: 'TC Arts & Science College',
      boardOrUniversity: 'University of Madras',
      startYear: '2024',
      endYear: '2027',
      scoreType: 'cgpa',
      score: '8.8 CGPA',
      location: 'Chennai, India'
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (Class XII)',
      institution: 'ABC Higher Secondary School',
      boardOrUniversity: 'Tamil Nadu State Board',
      startYear: '2023',
      endYear: '2024',
      scoreType: 'percentage',
      score: '91.4%',
      location: 'Chennai, India'
    },
    {
      id: 'edu-3',
      degree: 'Secondary School Examination (Class X)',
      institution: 'XYZ Matriculation School',
      boardOrUniversity: 'CBSE',
      startYear: '2021',
      endYear: '2022',
      scoreType: 'percentage',
      score: '94.2%',
      location: 'Chennai, India'
    }
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'PLACED Student Placement & Career Readiness Platform',
      role: 'Full-Stack Developer',
      techStack: 'React 19, Node.js, Supabase, Tailwind CSS, Vite',
      link: 'https://github.com/kavyakulothungan01/placed',
      date: 'Jan 2025 – Present',
      description: '• Architected an end-to-end career readiness dashboard with real-time ATS scoring, placement tracking, and skill deficit analytics.\n• Implemented persistent data sync with Supabase and interactive simulation assessments for coding and HR rounds.'
    },
    {
      id: 'proj-2',
      title: 'Distributed Real-Time Task Management System',
      role: 'Backend Developer',
      techStack: 'Node.js, Express, MongoDB, Redis, WebSockets',
      link: 'https://github.com/kavyakulothungan01/taskflow',
      date: 'Aug 2024 – Nov 2024',
      description: '• Engineered low-latency WebSocket event streams enabling concurrent task updates for over 2,000 active connections.\n• Reduced Redis query cache response latency by 35% through structured hashing and memoization.'
    }
  ],

  internships: [
    {
      id: 'int-1',
      company: 'TechNovation Labs',
      role: 'Frontend Engineering Intern',
      location: 'Bengaluru (Remote)',
      duration: 'May 2024 – Jul 2024',
      description: '• Developed 12+ reusable React UI components conforming to accessibility (WCAG AA) standards.\n• Collaborated with senior engineers using Git branching workflows, reducing frontend bundle size by 18%.'
    }
  ],

  experience: [],

  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      issueDate: '2024',
      credentialUrl: 'aws.amazon.com/verify/12345'
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      issueDate: '2024',
      credentialUrl: 'coursera.org/verify/meta-react'
    }
  ],

  achievements: [
    {
      id: 'ach-1',
      title: 'Finalist – Smart India Hackathon (SIH)',
      subtitle: 'Ministry of Education & AICTE',
      date: '2024',
      description: 'Developed an automated crop disease detection prototype using machine learning and mobile web.'
    },
    {
      id: 'ach-2',
      title: 'First Place – State Inter-College Coding Challenge',
      subtitle: 'CodeFest 2024',
      date: '2024',
      description: 'Ranked 1st among 250+ collegiate participants in competitive programming and data structure algorithms.'
    }
  ],

  hackathons: [],
  workshops: [],
  courses: [],
  languages: [
    { id: 'lang-1', language: 'English', proficiency: 'Professional' },
    { id: 'lang-2', language: 'Tamil', proficiency: 'Native' }
  ],
  volunteer: [],
  responsibilities: [],
  publications: [],
  extracurricular: [],
  interests: ['Open Source Software', 'Cloud Architecture', 'Competitive Coding'],
  customSections: [],

  // Legacy sync fields
  eduDegree: 'BCA (Bachelor of Computer Applications)',
  eduInst: 'TC Arts & Science College',
  eduYear: '2024 - 2027',
  eduScore: '8.8 CGPA',
  intCompany: 'TechNovation Labs',
  intRole: 'Frontend Engineering Intern',
  intDesc: 'Developed reusable React UI components conforming to accessibility standards.',
  projName: 'PLACED Student Placement & Career Readiness Platform',
  projStack: 'React 19, Node.js, Supabase, Tailwind CSS, Vite',
  projDesc: 'Architected an end-to-end career readiness dashboard with real-time ATS scoring.'
};

export const MOCK_RESUME_SKILLS = [
  'React', 'JavaScript (ES6+)', 'Node.js', 'Python', 'SQL',
  'PostgreSQL', 'MongoDB', 'Git', 'GitHub', 'REST API',
  'Data Structures', 'Algorithms', 'HTML5', 'CSS3', 'Docker'
];

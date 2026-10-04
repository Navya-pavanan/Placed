// Mock Data Layer for Classes and Study Modules
// Structured cleanly so it can consume real S-1 skill gap metrics and backend API data later.

export const SUBJECT_CATEGORIES = [
  { id: 'quant', name: 'Quantitative Aptitude', icon: 'Calculator', color: 'blue' },
  { id: 'tech', name: 'Technical Coding', icon: 'Terminal', color: 'green' },
  { id: 'english', name: 'English Communication', icon: 'MessageSquare', color: 'amber' },
  { id: 'reasoning', name: 'Logical Reasoning', icon: 'Brain', color: 'purple' }
];

export const CLASSES_DATA = [
  // Quantitative Aptitude
  {
    id: 'cls-quant-1',
    subjectId: 'quant',
    subjectName: 'Quantitative Aptitude',
    topic: 'Percentages',
    title: 'Percentages Masterclass: Core Formulas & Fast Calculation Tricks',
    description: 'Learn rapid Mental Math tricks, fraction-to-percentage conversions, and formula shortcuts for placement aptitude tests.',
    duration: '42 mins',
    instructor: 'Prof. Rajesh Verma',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_percentages'
  },
  {
    id: 'cls-quant-2',
    subjectId: 'quant',
    subjectName: 'Quantitative Aptitude',
    topic: 'Profit & Loss',
    title: 'Profit & Loss: Cost Price, Selling Price & Discount Math',
    description: 'Master marked price, trade discount, profit margins, and tricky multi-item transaction problems.',
    duration: '50 mins',
    instructor: 'Prof. Rajesh Verma',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_profit_loss'
  },
  {
    id: 'cls-quant-3',
    subjectId: 'quant',
    subjectName: 'Quantitative Aptitude',
    topic: 'Time & Work',
    title: 'Time & Work: Efficiency Ratios and Pipe & Cistern Problems',
    description: 'Step-by-step methodology for solving combined work rates, individual efficiency, and pipe flow calculations.',
    duration: '38 mins',
    instructor: 'Dr. Sunita Rao',
    thumbnail: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_time_work'
  },
  {
    id: 'cls-quant-4',
    subjectId: 'quant',
    subjectName: 'Quantitative Aptitude',
    topic: 'Time, Speed & Distance',
    title: 'Time, Speed & Distance: Trains, Boats & Relative Speed',
    description: 'Master relative speed concept for crossing trains, upstream/downstream boat currents, and race tracks.',
    duration: '45 mins',
    instructor: 'Dr. Sunita Rao',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_speed_distance'
  },

  // Technical Coding
  {
    id: 'cls-tech-1',
    subjectId: 'tech',
    subjectName: 'Technical Coding',
    topic: 'C Programming',
    title: 'C Language Core: Memory Allocation, Pointers & Structures',
    description: 'Deep dive into pointer arithmetic, stack vs heap allocation, malloc/free safety, and struct padding.',
    duration: '60 mins',
    instructor: 'Er. Amit Kulkarni',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_c_prog'
  },
  {
    id: 'cls-tech-2',
    subjectId: 'tech',
    subjectName: 'Technical Coding',
    topic: 'Java',
    title: 'Java Object-Oriented Programming & Collection Framework',
    description: 'Comprehensive guide to Inheritance, Interfaces, Polymorphism, HashMap, and ArrayList internals.',
    duration: '55 mins',
    instructor: 'Ananya Deshmukh',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_java_oop'
  },
  {
    id: 'cls-tech-3',
    subjectId: 'tech',
    subjectName: 'Technical Coding',
    topic: 'Python',
    title: 'Python for Data Structures & Algorithmic Problem Solving',
    description: 'Write clean Pythonic code using list comprehensions, generators, dictionaries, and built-in bisect/heapq.',
    duration: '48 mins',
    instructor: 'Ananya Deshmukh',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_python'
  },
  {
    id: 'cls-tech-4',
    subjectId: 'tech',
    subjectName: 'Technical Coding',
    topic: 'Data Structures',
    title: 'Data Structures: Trees, Graphs & Dynamic Programming Patterns',
    description: 'Learn Binary Search Tree traversals, Graph BFS/DFS, Dijkstra, and DP memoization frameworks.',
    duration: '75 mins',
    instructor: 'Er. Amit Kulkarni',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_dsa'
  },

  // English Communication
  {
    id: 'cls-eng-1',
    subjectId: 'english',
    subjectName: 'English Communication',
    topic: 'Grammar',
    title: 'Placement Verbal Ability: Subject-Verb Agreement & Tenses',
    description: 'Avoid common error-spotting pitfalls in campus placement verbal rounds and sentence correction tests.',
    duration: '35 mins',
    instructor: 'Ms. Priya Nambiar',
    thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_grammar'
  },
  {
    id: 'cls-eng-2',
    subjectId: 'english',
    subjectName: 'English Communication',
    topic: 'Vocabulary',
    title: 'Corporate Vocabulary: High-Frequency Words, Synonyms & Antonyms',
    description: 'Expand your vocabulary bank with 100+ frequently tested GRE/Placement words and contextual usage.',
    duration: '40 mins',
    instructor: 'Ms. Priya Nambiar',
    thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_vocab'
  },
  {
    id: 'cls-eng-3',
    subjectId: 'english',
    subjectName: 'English Communication',
    topic: 'Communication Skills',
    title: 'Group Discussion (GD) & Corporate HR Accent & Articulation',
    description: 'Key strategies for opening GDs, framing structured arguments, handling interruptions, and confidence.',
    duration: '45 mins',
    instructor: 'Karan Mehra',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_gd'
  },

  // Logical Reasoning
  {
    id: 'cls-lr-1',
    subjectId: 'reasoning',
    subjectName: 'Logical Reasoning',
    topic: 'Blood Relations',
    title: 'Blood Relations: Family Tree Diagrams & Symbol Decoding',
    description: 'Solve complex multi-generational family trees and coded relation statements in under 60 seconds.',
    duration: '30 mins',
    instructor: 'Vikramaditya Singh',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_blood_relations'
  },
  {
    id: 'cls-lr-2',
    subjectId: 'reasoning',
    subjectName: 'Logical Reasoning',
    topic: 'Directions',
    title: 'Direction Sense Test: Cardinal Angles & Pythagoras Distance',
    description: 'Master turns, shadow directions, final position vectors, and shortest distance calculations.',
    duration: '32 mins',
    instructor: 'Vikramaditya Singh',
    thumbnail: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_directions'
  },
  {
    id: 'cls-lr-3',
    subjectId: 'reasoning',
    subjectName: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    title: 'Letter & Symbol Coding-Decoding Patterns',
    description: 'Identify alphabet shift patterns, reverse position numbers, and matrix coding rules efficiently.',
    duration: '36 mins',
    instructor: 'Vikramaditya Singh',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_coding_decoding'
  },
  {
    id: 'cls-lr-4',
    subjectId: 'reasoning',
    subjectName: 'Logical Reasoning',
    topic: 'Number/Logical Series',
    title: 'Number & Alphabet Series Pattern Identification',
    description: 'Cracking double difference series, Fibonacci variants, exponential leaps, and odd-one-out puzzles.',
    duration: '40 mins',
    instructor: 'Vikramaditya Singh',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://www.youtube.com/embed/placeholder_number_series'
  }
];

export const STUDY_MODULES_DATA = [
  {
    id: 'mod-1',
    title: 'Java Object-Oriented Programming (OOP)',
    subject: 'Technical Coding',
    subjectId: 'tech',
    description: 'Master core Java object-oriented principles, memory lifecycle, polymorphic methods, and design patterns required for SDE interviews.',
    s1GapTag: 'Technical Deficit',
    isRecommended: false,
    lessons: [
      { id: 'les-1-1', title: 'Classes & Objects Essentials', status: 'completed', classId: 'cls-tech-2' },
      { id: 'les-1-2', title: 'Constructors, Static & Memory Model', status: 'completed', classId: 'cls-tech-2' },
      { id: 'les-1-3', title: 'Inheritance & Super Keyword', status: 'active', classId: 'cls-tech-2' },
      { id: 'les-1-4', title: 'Polymorphism & Method Overriding', status: 'locked', classId: 'cls-tech-2' },
      { id: 'les-1-5', title: 'Abstraction & Interfaces', status: 'locked', classId: 'cls-tech-2' }
    ]
  },
  {
    id: 'mod-2',
    title: 'Quantitative Aptitude — Percentages & Data Interpretation',
    subject: 'Quantitative Aptitude',
    subjectId: 'quant',
    description: 'Structured module targeting speed calculation, percentage change benchmarks, and pie chart/bar graph interpretation.',
    s1GapTag: 'High S-1 Skill Gap (-12% Deficit)',
    isRecommended: true,
    recommendationReason: 'Targeted fix for Quantitative Aptitude deficit identified in S-1 Readiness Audit.',
    lessons: [
      { id: 'les-2-1', title: 'Core Percentage Formulas & Mental Math', status: 'completed', classId: 'cls-quant-1' },
      { id: 'les-2-2', title: 'Successive Percentage Changes', status: 'active', classId: 'cls-quant-1' },
      { id: 'les-2-3', title: 'Profit & Loss Applications', status: 'locked', classId: 'cls-quant-2' },
      { id: 'les-2-4', title: 'Data Interpretation Charts & Tables', status: 'locked', classId: 'cls-quant-1' }
    ]
  },
  {
    id: 'mod-3',
    title: 'Logical Reasoning — Spatial & Directional Mastery',
    subject: 'Logical Reasoning',
    subjectId: 'reasoning',
    description: 'Complete series on directional mapping, family tree deduction, and symbol sequence decoding.',
    s1GapTag: 'Moderate S-1 Gap',
    isRecommended: false,
    lessons: [
      { id: 'les-3-1', title: 'Family Tree Diagrams & Coded Relations', status: 'completed', classId: 'cls-lr-1' },
      { id: 'les-3-2', title: 'Direction Vectors & Shadow Problems', status: 'completed', classId: 'cls-lr-2' },
      { id: 'les-3-3', title: 'Coding-Decoding Matrix Patterns', status: 'completed', classId: 'cls-lr-3' },
      { id: 'les-3-4', title: 'Logical Number Series & Odd-One-Out', status: 'active', classId: 'cls-lr-4' }
    ]
  },
  {
    id: 'mod-4',
    title: 'English Communication — Corporate GD & HR Articulation',
    subject: 'English Communication',
    subjectId: 'english',
    description: 'Enhance sentence structuring, error spotting in written English, and active listening tactics for HR screening rounds.',
    s1GapTag: 'S-1 Recommended Fix',
    isRecommended: true,
    recommendationReason: 'Boost verbal confidence score before upcoming corporate interview drives.',
    lessons: [
      { id: 'les-4-1', title: 'Subject-Verb Agreement Rules', status: 'completed', classId: 'cls-eng-1' },
      { id: 'les-4-2', title: 'High-Frequency Placement Vocabulary', status: 'completed', classId: 'cls-eng-2' },
      { id: 'les-4-3', title: 'GD Opening Tactics & Argument Framing', status: 'active', classId: 'cls-eng-3' }
    ]
  }
];

// Initial Progress Tracking Data Structure (empty map for authenticated students)
export const INITIAL_STUDENT_PROGRESS = {
  studentId: '',
  lastUpdated: new Date().toISOString(),
  modulesProgress: {}
};


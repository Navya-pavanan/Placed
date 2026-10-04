export const ATS_KEYWORD_DICTIONARY = [
  'react', 'react.js', 'node.js', 'nodejs', 'javascript', 'typescript', 'python', 'c++', 'c', 'java',
  'sql', 'postgresql', 'mysql', 'mongodb', 'sqlite', 'redis',
  'git', 'github', 'gitlab', 'agile', 'scrum', 'aws', 'docker', 'kubernetes', 'azure', 'gcp',
  'html', 'html5', 'css', 'css3', 'sass', 'tailwind', 'bootstrap',
  'data structures', 'algorithms', 'system design', 'rest api', 'restful api', 'graphql', 'microservices',
  'express', 'express.js', 'next.js', 'django', 'fastapi', 'spring boot', 'flask',
  'redux', 'state management', 'ci/cd', 'linux', 'bash', 'unit testing', 'jest',
  'object-oriented programming', 'oop', 'problem solving', 'communication', 'teamwork',
  'machine learning', 'deep learning', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch',
  'cybersecurity', 'networking', 'responsive design', 'api integration', 'full stack', 'frontend', 'backend'
];

/**
 * Parses job description text against dictionary to find target keywords.
 * @param {string} jdText 
 * @returns {string[]} Matching keywords requested by JD
 */
export const extractRequiredKeywords = (jdText) => {
  if (!jdText) return [];
  const normalizedJD = jdText.trim().toLowerCase();
  return ATS_KEYWORD_DICTIONARY.filter(kw => {
    // Check whole word or phrase match
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(?:^|[\\s,.;:()/\\[\\]-])${escaped}(?:$|[\\s,.;:()/\\[\\]-])`, 'i');
    return regex.test(normalizedJD) || normalizedJD.includes(kw);
  });
};

/**
 * Compiles all text representation from structured resume data.
 * @param {Object} formData 
 * @param {string[]} skills 
 * @returns {string} Combined lowercased resume text
 */
export const extractResumeText = (formData = {}, skills = []) => {
  const parts = [];

  if (formData.name) parts.push(formData.name);
  if (formData.title) parts.push(formData.title);
  if (formData.summary) parts.push(formData.summary);

  // Education entries
  if (Array.isArray(formData.education)) {
    formData.education.forEach(edu => {
      if (edu.degree) parts.push(edu.degree);
      if (edu.institution) parts.push(edu.institution);
      if (edu.boardOrUniversity) parts.push(edu.boardOrUniversity);
      if (edu.description) parts.push(edu.description);
    });
  } else if (formData.eduDegree || formData.eduInst) {
    if (formData.eduDegree) parts.push(formData.eduDegree);
    if (formData.eduInst) parts.push(formData.eduInst);
  }

  // Technical Skills
  const allSkills = [...(skills || []), ...(formData.skills || [])];
  allSkills.forEach(s => {
    if (s) parts.push(s);
  });

  // Projects
  if (Array.isArray(formData.projects)) {
    formData.projects.forEach(p => {
      if (p.title) parts.push(p.title);
      if (p.techStack) parts.push(p.techStack);
      if (p.description) parts.push(p.description);
      if (p.role) parts.push(p.role);
    });
  } else if (formData.projName || formData.projStack || formData.projDesc) {
    if (formData.projName) parts.push(formData.projName);
    if (formData.projStack) parts.push(formData.projStack);
    if (formData.projDesc) parts.push(formData.projDesc);
  }

  // Internships
  if (Array.isArray(formData.internships)) {
    formData.internships.forEach(i => {
      if (i.company) parts.push(i.company);
      if (i.role) parts.push(i.role);
      if (i.description) parts.push(i.description);
    });
  } else if (formData.intCompany || formData.intRole || formData.intDesc) {
    if (formData.intCompany) parts.push(formData.intCompany);
    if (formData.intRole) parts.push(formData.intRole);
    if (formData.intDesc) parts.push(formData.intDesc);
  }

  // Experience
  if (Array.isArray(formData.experience)) {
    formData.experience.forEach(e => {
      if (e.company) parts.push(e.company);
      if (e.role) parts.push(e.role);
      if (e.description) parts.push(e.description);
    });
  }

  // Certifications
  if (Array.isArray(formData.certifications)) {
    formData.certifications.forEach(c => {
      if (c.name) parts.push(c.name);
      if (c.issuer) parts.push(c.issuer);
    });
  }

  // Achievements & Hackathons
  ['achievements', 'hackathons', 'workshops', 'courses', 'volunteer', 'responsibilities'].forEach(sec => {
    if (Array.isArray(formData[sec])) {
      formData[sec].forEach(item => {
        if (item.title) parts.push(item.title);
        if (item.subtitle) parts.push(item.subtitle);
        if (item.description) parts.push(item.description);
      });
    }
  });

  return parts.join(' ').toLowerCase();
};

/**
 * Calculates ATS compatibility score, breakdown metrics, matched, and missing keywords.
 * @param {Object} formData - Resume text fields
 * @param {string[]} skills - Active skills tags array
 * @param {string} jdText - Job description text
 * @returns {Object} Comprehensive ATS result object
 */
export const analyzeATSCompatibility = (formData = {}, skills = [], jdText = '') => {
  const requiredKeywords = extractRequiredKeywords(jdText);

  if (requiredKeywords.length === 0) {
    return {
      score: 0,
      skillsMatch: 0,
      keywordMatch: 0,
      formatting: 95,
      educationMatch: 100,
      density: 0,
      matched: [],
      missing: [],
      suggestions: [
        'Paste a specific job description with technical requirements to analyze compatibility.'
      ]
    };
  }

  const resumeText = extractResumeText(formData, skills);
  const activeSkillsList = [...(skills || []), ...(formData.skills || [])].map(s => s.toLowerCase());

  const matched = [];
  const missing = [];
  let matchCount = 0;

  requiredKeywords.forEach(kw => {
    if (resumeText.includes(kw)) {
      matched.push(kw);
      matchCount++;
    } else {
      missing.push(kw);
    }
  });

  // Calculate Keyword Match
  const keywordMatch = Math.round((matchCount / requiredKeywords.length) * 100);

  // Calculate Skills Match: explicitly in skills list or project tech stack
  let techSkillsMatchCount = 0;
  let techSkillsRequiredCount = 0;
  requiredKeywords.forEach(kw => {
    techSkillsRequiredCount++;
    if (activeSkillsList.some(s => s.includes(kw) || kw.includes(s))) {
      techSkillsMatchCount++;
    } else if (Array.isArray(formData.projects) && formData.projects.some(p => (p.techStack || '').toLowerCase().includes(kw))) {
      techSkillsMatchCount += 0.8;
    }
  });
  const skillsMatch = techSkillsRequiredCount > 0 
    ? Math.min(100, Math.round((techSkillsMatchCount / techSkillsRequiredCount) * 100))
    : keywordMatch;

  // Calculate Formatting Score based on ATS best practices
  let formattingScore = 100;
  if (!formData.name || !formData.email || !formData.phone) formattingScore -= 15;
  if (!formData.education || formData.education.length === 0) formattingScore -= 15;
  if (!formData.summary || formData.summary.trim().length < 30) formattingScore -= 10;
  if ((!formData.projects || formData.projects.length === 0) && (!formData.internships || formData.internships.length === 0)) formattingScore -= 15;
  const formatting = Math.max(50, formattingScore);

  // Education match
  let educationMatch = 100;
  const jdLower = jdText.toLowerCase();
  const hasDegreeRequirement = jdLower.includes('degree') || jdLower.includes('bachelor') || jdLower.includes('bca') || jdLower.includes('b.tech') || jdLower.includes('computer science') || jdLower.includes('engineering');
  const hasEducation = (Array.isArray(formData.education) && formData.education.length > 0) || formData.eduDegree;
  if (hasDegreeRequirement && !hasEducation) {
    educationMatch = 40;
  } else if (!hasEducation) {
    educationMatch = 70;
  }

  // Weighted overall ATS score
  const overallScore = Math.round(
    (keywordMatch * 0.40) +
    (skillsMatch * 0.30) +
    (formatting * 0.15) +
    (educationMatch * 0.15)
  );

  const totalWords = resumeText.split(/\s+/).filter(w => w.length > 2).length;
  const density = totalWords > 0 ? parseFloat(((matchCount / totalWords) * 100).toFixed(1)) : 0;

  // Generate practical suggestions
  const suggestions = [];

  if (missing.length > 0) {
    const topMissing = missing.slice(0, 4).map(k => k.toUpperCase()).join(', ');
    suggestions.push(`High priority keywords requested by the job description: ${topMissing}. If you possess experience with these, add them to your Technical Skills or Project Stack.`);
  }

  if (!formData.github) {
    suggestions.push('Add your GitHub profile link to showcase proof of work and open-source contributions to recruiters.');
  }

  if (Array.isArray(formData.projects) && formData.projects.length > 0) {
    const hasMetrics = formData.projects.some(p => /\d+%|\d+x|\d+\s*(users|requests|ms|seconds|stars)/i.test(p.description || ''));
    if (!hasMetrics) {
      suggestions.push('Quantify project results where possible (e.g., "improved load time by 30%", "handled 500+ requests/sec").');
    }
  } else {
    suggestions.push('Add at least 1-2 featured academic or personal projects to demonstrate practical coding skills.');
  }

  if (!formData.summary || formData.summary.length < 50) {
    suggestions.push('Include a 2-3 sentence Professional Summary tailored with your core placement objectives and strengths.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Your resume aligns exceptionally well with the target job requirements! Keep entries updated and proofread.');
  }

  return {
    score: overallScore,
    skillsMatch,
    keywordMatch,
    formatting,
    educationMatch,
    density,
    matched,
    missing,
    suggestions
  };
};

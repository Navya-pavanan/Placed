/**
 * @typedef {Object} EducationEntry
 * @property {string} id - Unique entry ID
 * @property {string} degree - Degree or qualification (e.g., BCA, B.Tech, Class XII, Class X)
 * @property {string} institution - School or College name
 * @property {string} boardOrUniversity - Board (CBSE, State Board) or University
 * @property {string} startYear - Start year (e.g. 2024)
 * @property {string} endYear - End year / passing year (e.g. 2027)
 * @property {'cgpa' | 'percentage'} scoreType - Scoring metric ('cgpa' or 'percentage')
 * @property {string} score - CGPA (e.g. "8.8") or Percentage (e.g. "91%")
 * @property {string} [location] - City, State / Country (optional)
 * @property {string} [description] - Relevant coursework, honors, or highlights
 */

/**
 * @typedef {Object} ProjectEntry
 * @property {string} id - Unique entry ID
 * @property {string} title - Project title
 * @property {string} role - Role in project (e.g. Full-Stack Developer)
 * @property {string} techStack - Technologies used (e.g. React, Node.js, PostgreSQL)
 * @property {string} link - Project URL or GitHub repository link
 * @property {string} date - Year or timeframe (e.g. 2025)
 * @property {string} description - Impactful bullet points and features
 */

/**
 * @typedef {Object} InternshipEntry
 * @property {string} id - Unique entry ID
 * @property {string} company - Organization or Company name
 * @property {string} role - Internship title
 * @property {string} location - Location or Remote
 * @property {string} duration - Timeframe (e.g. Jun 2024 – Aug 2024)
 * @property {string} description - Responsibilities, achievements, and impact
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} id - Unique entry ID
 * @property {string} company - Employer or Organization
 * @property {string} role - Job title
 * @property {string} location - Location or Remote
 * @property {string} duration - Timeframe (e.g. 2023 – Present)
 * @property {string} description - Core duties and deliverables
 */

/**
 * @typedef {Object} CertificationEntry
 * @property {string} id - Unique entry ID
 * @property {string} name - Certification name
 * @property {string} issuer - Issuing organization (e.g., AWS, Coursera, HackerRank)
 * @property {string} issueDate - Issue year or date
 * @property {string} [credentialUrl] - Verification URL or ID
 */

/**
 * @typedef {Object} SimpleEntry
 * @property {string} id - Unique entry ID
 * @property {string} title - Title or accomplishment
 * @property {string} [subtitle] - Organization, rank, or context
 * @property {string} [date] - Year or date
 * @property {string} [description] - Summary description
 */

/**
 * @typedef {Object} ResumeSectionMeta
 * @property {string} id - Unique section ID
 * @property {string} title - Display title
 * @property {boolean} isEssential - Essential section flag
 * @property {boolean} canDelete - Whether section can be removed
 * @property {string} icon - Lucide icon name identifier
 */

/**
 * @typedef {Object} ResumeData
 * @property {string} name - Full name
 * @property {string} title - Target career role or title
 * @property {string} email - Email contact
 * @property {string} phone - Phone contact
 * @property {string} location - Location (e.g. Chennai, India)
 * @property {string} linkedin - LinkedIn URL or username
 * @property {string} github - GitHub URL or username
 * @property {string} portfolio - Personal website or portfolio URL
 * @property {string} summary - Professional bio summary
 * @property {string} template - Selected template ('classic' | 'modern' | 'minimal' | 'technical' | 'graduate')
 * @property {string[]} sectionOrder - Ordered array of section IDs
 * @property {EducationEntry[]} education - List of educational qualifications
 * @property {string[]} skills - Technical skills tag array
 * @property {ProjectEntry[]} projects - List of featured projects
 * @property {InternshipEntry[]} internships - List of internships
 * @property {ExperienceEntry[]} experience - List of work experiences
 * @property {CertificationEntry[]} certifications - List of certifications
 * @property {SimpleEntry[]} achievements - Academic / extra achievements
 * @property {SimpleEntry[]} hackathons - Hackathons and competitions
 * @property {SimpleEntry[]} workshops - Workshops and seminars attended
 * @property {SimpleEntry[]} courses - Specialized coursework or training
 * @property {SimpleEntry[]} volunteer - Volunteering or community work
 * @property {SimpleEntry[]} responsibilities - Positions of responsibility
 * @property {SimpleEntry[]} publications - Research papers or publications
 * @property {SimpleEntry[]} extracurricular - Extracurricular activities
 * @property {string[]} languages - Spoken/written languages
 * @property {string[]} interests - Areas of interest
 * @property {Array<{ id: string, title: string, items: SimpleEntry[] }>} customSections - Custom user-added sections
 */

/**
 * @typedef {Object} ATSAnalysisResult
 * @property {number} score - Overall ATS compatibility match score (0-100)
 * @property {number} skillsMatch - Skills match score (0-100)
 * @property {number} keywordMatch - Keyword density and coverage match score (0-100)
 * @property {number} formatting - ATS document formatting score (0-100)
 * @property {number} educationMatch - Education alignment score (0-100)
 * @property {number} density - Keyword density percentage
 * @property {string[]} matched - List of matched keywords found in resume
 * @property {string[]} missing - List of missing keywords required by JD
 * @property {string[]} suggestions - Actionable improvements
 */

import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

const LinkedinIcon = ({ size = 11, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 11, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ResumePreview = ({ resumeData = {}, skills = [], previewRef = null }) => {
  const {
    name = '',
    title = '',
    email = '',
    phone = '',
    location = '',
    linkedin = '',
    github = '',
    portfolio = '',
    summary = '',
    template = 'classic',
    activeSections = [],
    sectionTitles = {},
    education = [],
    projects = [],
    internships = [],
    experience = [],
    certifications = [],
    achievements = [],
    hackathons = [],
    workshops = [],
    courses = [],
    languages = [],
    volunteer = [],
    responsibilities = [],
    publications = [],
    extracurricular = [],
    interests = [],
    customSections = []
  } = resumeData;

  const combinedSkills = skills.length > 0 ? skills : (resumeData.skills || []);

  const getSectionTitle = (id, fallback) => {
    return sectionTitles[id] || fallback;
  };

  const formatUrl = (url = '') => {
    if (!url) return '';
    return url.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  };

  // Render individual sections based on section ID
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        if (!summary || !summary.trim()) return null;
        return (
          <div className="rp-section" key="summary">
            <h2 className="rp-sec-head">{getSectionTitle('summary', 'PROFESSIONAL SUMMARY')}</h2>
            <p className="rp-text">{summary}</p>
          </div>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <div className="rp-section" key="education">
            <h2 className="rp-sec-head">{getSectionTitle('education', 'EDUCATION')}</h2>
            <div className="rp-list">
              {education.map((edu, idx) => (
                <div className="rp-item" key={edu.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{edu.degree || 'Degree / Qualification'}</strong>
                      {edu.institution && (
                        <div className="rp-item-sub">
                          {edu.institution}
                          {edu.boardOrUniversity ? ` • ${edu.boardOrUniversity}` : ''}
                          {edu.location ? ` (${edu.location})` : ''}
                        </div>
                      )}
                    </div>
                    <div className="rp-item-meta">
                      {(edu.startYear || edu.endYear) && (
                        <span className="rp-date">
                          {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : (edu.endYear || edu.startYear)}
                        </span>
                      )}
                      {edu.score && (
                        <span className="rp-score">
                          {edu.score.includes('%') || edu.score.toLowerCase().includes('cgpa')
                            ? edu.score
                            : `${edu.score} ${edu.scoreType === 'percentage' ? '%' : 'CGPA'}`}
                        </span>
                      )}
                    </div>
                  </div>
                  {edu.description && <p className="rp-item-desc">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (combinedSkills.length === 0) return null;
        return (
          <div className="rp-section" key="skills">
            <h2 className="rp-sec-head">{getSectionTitle('skills', 'TECHNICAL SKILLS')}</h2>
            <div className="rp-skills-content">
              {template === 'technical' ? (
                <div className="rp-tech-tags">
                  {combinedSkills.map((s, i) => (
                    <span className="rp-tech-pill" key={i}>{s}</span>
                  ))}
                </div>
              ) : (
                <p className="rp-text">
                  <strong>Key Competencies:</strong> {combinedSkills.join(' • ')}
                </p>
              )}
            </div>
          </div>
        );

      case 'projects':
        if (!projects || projects.length === 0) return null;
        return (
          <div className="rp-section" key="projects">
            <h2 className="rp-sec-head">{getSectionTitle('projects', 'FEATURED PROJECTS')}</h2>
            <div className="rp-list">
              {projects.map((proj, idx) => (
                <div className="rp-item" key={proj.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{proj.title || 'Project Name'}</strong>
                      {proj.role && <span className="rp-item-role"> | {proj.role}</span>}
                    </div>
                    <div className="rp-item-meta">
                      {proj.date && <span className="rp-date">{proj.date}</span>}
                      {proj.link && (
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="rp-link">
                          Link
                        </a>
                      )}
                    </div>
                  </div>
                  {proj.techStack && (
                    <p className="rp-item-stack"><strong>Tech Stack:</strong> {proj.techStack}</p>
                  )}
                  {proj.description && (
                    <div className="rp-item-bullets">
                      {proj.description.split('\n').filter(Boolean).map((line, lIdx) => (
                        <p key={lIdx} className="rp-bullet">
                          {line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'internships':
        if (!internships || internships.length === 0) return null;
        return (
          <div className="rp-section" key="internships">
            <h2 className="rp-sec-head">{getSectionTitle('internships', 'INTERNSHIPS')}</h2>
            <div className="rp-list">
              {internships.map((item, idx) => (
                <div className="rp-item" key={item.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{item.role || 'Intern'}</strong>
                      <span className="rp-item-company"> — {item.company || 'Company'}</span>
                      {item.location && <span className="rp-item-loc"> ({item.location})</span>}
                    </div>
                    {item.duration && <span className="rp-date">{item.duration}</span>}
                  </div>
                  {item.description && (
                    <div className="rp-item-bullets">
                      {item.description.split('\n').filter(Boolean).map((line, lIdx) => (
                        <p key={lIdx} className="rp-bullet">
                          {line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'experience':
        if (!experience || experience.length === 0) return null;
        return (
          <div className="rp-section" key="experience">
            <h2 className="rp-sec-head">{getSectionTitle('experience', 'WORK EXPERIENCE')}</h2>
            <div className="rp-list">
              {experience.map((item, idx) => (
                <div className="rp-item" key={item.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{item.role || 'Role'}</strong>
                      <span className="rp-item-company"> — {item.company || 'Company'}</span>
                      {item.location && <span className="rp-item-loc"> ({item.location})</span>}
                    </div>
                    {item.duration && <span className="rp-date">{item.duration}</span>}
                  </div>
                  {item.description && (
                    <div className="rp-item-bullets">
                      {item.description.split('\n').filter(Boolean).map((line, lIdx) => (
                        <p key={lIdx} className="rp-bullet">
                          {line.startsWith('•') || line.startsWith('-') ? line : `• ${line}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'certifications':
        if (!certifications || certifications.length === 0) return null;
        return (
          <div className="rp-section" key="certifications">
            <h2 className="rp-sec-head">{getSectionTitle('certifications', 'CERTIFICATIONS')}</h2>
            <div className="rp-list">
              {certifications.map((cert, idx) => (
                <div className="rp-item" key={cert.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{cert.name}</strong>
                      {cert.issuer && <span className="rp-item-issuer"> — {cert.issuer}</span>}
                    </div>
                    <div className="rp-item-meta">
                      {cert.issueDate && <span className="rp-date">{cert.issueDate}</span>}
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`} target="_blank" rel="noopener noreferrer" className="rp-link">
                          Verify
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        if (!achievements || achievements.length === 0) return null;
        return (
          <div className="rp-section" key="achievements">
            <h2 className="rp-sec-head">{getSectionTitle('achievements', 'KEY ACHIEVEMENTS & AWARDS')}</h2>
            <div className="rp-list">
              {achievements.map((ach, idx) => (
                <div className="rp-item" key={ach.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{ach.title}</strong>
                      {ach.subtitle && <span className="rp-item-sub"> — {ach.subtitle}</span>}
                    </div>
                    {ach.date && <span className="rp-date">{ach.date}</span>}
                  </div>
                  {ach.description && <p className="rp-item-desc">{ach.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hackathons':
        if (!hackathons || hackathons.length === 0) return null;
        return (
          <div className="rp-section" key="hackathons">
            <h2 className="rp-sec-head">{getSectionTitle('hackathons', 'HACKATHONS & COMPETITIONS')}</h2>
            <div className="rp-list">
              {hackathons.map((h, idx) => (
                <div className="rp-item" key={h.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{h.title}</strong>
                      {h.subtitle && <span className="rp-item-sub"> ({h.subtitle})</span>}
                    </div>
                    {h.date && <span className="rp-date">{h.date}</span>}
                  </div>
                  {h.description && <p className="rp-item-desc">{h.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'workshops':
        if (!workshops || workshops.length === 0) return null;
        return (
          <div className="rp-section" key="workshops">
            <h2 className="rp-sec-head">{getSectionTitle('workshops', 'WORKSHOPS & SEMINARS')}</h2>
            <div className="rp-list">
              {workshops.map((w, idx) => (
                <div className="rp-item" key={w.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{w.title}</strong>
                      {w.subtitle && <span className="rp-item-sub"> — {w.subtitle}</span>}
                    </div>
                    {w.date && <span className="rp-date">{w.date}</span>}
                  </div>
                  {w.description && <p className="rp-item-desc">{w.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'courses':
        if (!courses || courses.length === 0) return null;
        return (
          <div className="rp-section" key="courses">
            <h2 className="rp-sec-head">{getSectionTitle('courses', 'RELEVANT COURSEWORK')}</h2>
            <div className="rp-list">
              {courses.map((courseItem, idx) => (
                <div className="rp-item" key={courseItem.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{courseItem.title}</strong>
                      {courseItem.subtitle && <span className="rp-item-sub"> — {courseItem.subtitle}</span>}
                    </div>
                    {courseItem.date && <span className="rp-date">{courseItem.date}</span>}
                  </div>
                  {courseItem.description && <p className="rp-item-desc">{courseItem.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!languages || languages.length === 0) return null;
        return (
          <div className="rp-section" key="languages">
            <h2 className="rp-sec-head">{getSectionTitle('languages', 'LANGUAGES')}</h2>
            <div className="rp-list">
              {languages.map((lang, idx) => (
                <div className="rp-item" key={lang.id || idx}>
                  <div className="rp-item-top">
                    <strong className="rp-item-title">{lang.language}</strong>
                    {lang.proficiency && <span className="rp-date">{lang.proficiency}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'volunteer':
        if (!volunteer || volunteer.length === 0) return null;
        return (
          <div className="rp-section" key="volunteer">
            <h2 className="rp-sec-head">{getSectionTitle('volunteer', 'VOLUNTEER EXPERIENCE')}</h2>
            <div className="rp-list">
              {volunteer.map((v, idx) => (
                <div className="rp-item" key={v.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{v.title}</strong>
                      {v.subtitle && <span className="rp-item-sub"> — {v.subtitle}</span>}
                    </div>
                    {v.date && <span className="rp-date">{v.date}</span>}
                  </div>
                  {v.description && <p className="rp-item-desc">{v.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'responsibilities':
        if (!responsibilities || responsibilities.length === 0) return null;
        return (
          <div className="rp-section" key="responsibilities">
            <h2 className="rp-sec-head">{getSectionTitle('responsibilities', 'POSITIONS OF RESPONSIBILITY')}</h2>
            <div className="rp-list">
              {responsibilities.map((r, idx) => (
                <div className="rp-item" key={r.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{r.title}</strong>
                      {r.subtitle && <span className="rp-item-sub"> — {r.subtitle}</span>}
                    </div>
                    {r.date && <span className="rp-date">{r.date}</span>}
                  </div>
                  {r.description && <p className="rp-item-desc">{r.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'publications':
        if (!publications || publications.length === 0) return null;
        return (
          <div className="rp-section" key="publications">
            <h2 className="rp-sec-head">{getSectionTitle('publications', 'PUBLICATIONS')}</h2>
            <div className="rp-list">
              {publications.map((pub, idx) => (
                <div className="rp-item" key={pub.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{pub.title}</strong>
                      {pub.subtitle && <span className="rp-item-sub"> — {pub.subtitle}</span>}
                    </div>
                    {pub.date && <span className="rp-date">{pub.date}</span>}
                  </div>
                  {pub.description && <p className="rp-item-desc">{pub.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'extracurricular':
        if (!extracurricular || extracurricular.length === 0) return null;
        return (
          <div className="rp-section" key="extracurricular">
            <h2 className="rp-sec-head">{getSectionTitle('extracurricular', 'EXTRACURRICULAR ACTIVITIES')}</h2>
            <div className="rp-list">
              {extracurricular.map((ext, idx) => (
                <div className="rp-item" key={ext.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{ext.title}</strong>
                      {ext.subtitle && <span className="rp-item-sub"> — {ext.subtitle}</span>}
                    </div>
                    {ext.date && <span className="rp-date">{ext.date}</span>}
                  </div>
                  {ext.description && <p className="rp-item-desc">{ext.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      case 'interests':
        if (!interests || interests.length === 0) return null;
        return (
          <div className="rp-section" key="interests">
            <h2 className="rp-sec-head">{getSectionTitle('interests', 'INTERESTS')}</h2>
            <div className="rp-list">
              {interests.map((interest, idx) => (
                <div className="rp-item" key={interest.id || idx}>
                  <div className="rp-item-top">
                    <div>
                      <strong className="rp-item-title">{interest.title}</strong>
                      {interest.subtitle && <span className="rp-item-sub"> — {interest.subtitle}</span>}
                    </div>
                    {interest.date && <span className="rp-date">{interest.date}</span>}
                  </div>
                  {interest.description && <p className="rp-item-desc">{interest.description}</p>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Build contact items array
  const contactItems = [];
  if (email) contactItems.push({ icon: Mail, label: email, href: `mailto:${email}` });
  if (phone) contactItems.push({ icon: Phone, label: phone, href: `tel:${phone}` });
  if (location) contactItems.push({ icon: MapPin, label: location });
  if (linkedin) contactItems.push({ icon: LinkedinIcon, label: formatUrl(linkedin), href: linkedin.startsWith('http') ? linkedin : `https://${linkedin}` });
  if (github) contactItems.push({ icon: GithubIcon, label: formatUrl(github), href: github.startsWith('http') ? github : `https://${github}` });
  if (portfolio) contactItems.push({ icon: Globe, label: formatUrl(portfolio), href: portfolio.startsWith('http') ? portfolio : `https://${portfolio}` });

  return (
    <div className={`resume-paper template-${template}`} ref={previewRef} id="resume-document">
      {/* Header */}
      <header className="rp-header">
        <h1 className="rp-name">{name || 'Your Full Name'}</h1>
        {title && <p className="rp-title">{title}</p>}
        
        {contactItems.length > 0 && (
          <div className="rp-contact-row">
            {contactItems.map((c, i) => (
              <span className="rp-contact-item" key={i}>
                <c.icon size={11} className="rp-contact-icon" />
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    {c.label}
                  </a>
                ) : (
                  <span>{c.label}</span>
                )}
                {i < contactItems.length - 1 && <span className="rp-dot">•</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="rp-divider" />

      {/* Render active sections in user's specified order */}
      <div className="rp-body">
        {activeSections
          .filter(secId => secId !== 'personal') // Personal is rendered in header
          .map(secId => renderSection(secId))}
      </div>
    </div>
  );
};

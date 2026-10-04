import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const calculateCompleteness = (formData = {}, skills = []) => {
  const items = [];
  let score = 0;

  // 1. Personal Details (20%)
  const hasPersonal = Boolean(formData.name && formData.email && formData.phone);
  if (hasPersonal) score += 20;
  items.push({
    id: 'personal',
    label: 'Contact Information (Name, Email, Phone)',
    complete: hasPersonal,
    tip: 'Add your full name, student email, and active phone number.'
  });

  // 2. Summary (10%)
  const hasSummary = Boolean(formData.summary && formData.summary.trim().length >= 25);
  if (hasSummary) score += 10;
  items.push({
    id: 'summary',
    label: 'Professional Summary',
    complete: hasSummary,
    tip: 'Add a 2-3 sentence overview of your career focus & placement readiness.'
  });

  // 3. Education (20%)
  const eduCount = (formData.education || []).length;
  const hasEdu = eduCount > 0 || Boolean(formData.eduDegree);
  if (hasEdu) score += 20;
  items.push({
    id: 'education',
    label: `Education Qualifications (${eduCount > 0 ? `${eduCount} added` : 'None'})`,
    complete: hasEdu,
    tip: 'Include your college degree (BCA, B.Tech) and school (Class XII, X).'
  });

  // 4. Skills (20%)
  const skillCount = skills.length > 0 ? skills.length : (formData.skills || []).length;
  const hasSkills = skillCount >= 3;
  if (hasSkills) score += 20;
  items.push({
    id: 'skills',
    label: `Technical Skills (${skillCount} added / min 3)`,
    complete: hasSkills,
    tip: 'Add at least 3-5 core technical skills to pass ATS parsing filters.'
  });

  // 5. Projects (20%)
  const projCount = (formData.projects || []).length;
  const hasProj = projCount > 0 || Boolean(formData.projName);
  if (hasProj) score += 20;
  items.push({
    id: 'projects',
    label: `Featured Projects (${projCount > 0 ? `${projCount} added` : 'None'})`,
    complete: hasProj,
    tip: 'Showcase at least 1-2 practical academic, web, or mobile projects.'
  });

  // 6. Practical Credentials (10%) - Freshers can use Certifications or Achievements
  const hasInternship = (formData.internships || []).length > 0 || (formData.experience || []).length > 0;
  const hasCert = (formData.certifications || []).length > 0;
  const hasAch = (formData.achievements || []).length > 0 || (formData.hackathons || []).length > 0;
  const hasBonus = hasInternship || hasCert || hasAch;
  if (hasBonus) score += 10;
  items.push({
    id: 'credentials',
    label: hasInternship
      ? 'Internship / Experience Added'
      : hasCert
      ? 'Certifications Added'
      : hasAch
      ? 'Achievements / Hackathons Added'
      : 'Internship, Certification, or Achievement',
    complete: hasBonus,
    tip: 'Freshers can include online certifications, hackathons, or academic awards.'
  });

  return { score: Math.min(100, score), items };
};

export const ResumeCompleteness = ({ formData = {}, skills = [] }) => {
  const { score, items } = calculateCompleteness(formData, skills);

  const getScoreColor = (val) => {
    if (val >= 80) return '#16A34A'; // green
    if (val >= 60) return '#2563EB'; // primary blue
    if (val >= 40) return '#D97706'; // amber
    return '#DC2626'; // red
  };

  return (
    <div className="resume-completeness-card card">
      <div className="completeness-header">
        <div className="completeness-title-row">
          <div className="completeness-icon-box">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="completeness-title">Resume Completeness</h3>
            <p className="completeness-sub">
              Placement readiness checklist for campus recruitments
            </p>
          </div>
        </div>
        <div className="completeness-score-badge" style={{ color: getScoreColor(score) }}>
          <span className="score-val">{score}%</span>
        </div>
      </div>

      <div className="completeness-bar-bg">
        <div
          className="completeness-bar-fill"
          style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }}
        />
      </div>

      <div className="completeness-checklist">
        {items.map((item) => (
          <div
            key={item.id}
            className={`completeness-check-item ${item.complete ? 'is-complete' : 'is-pending'}`}
          >
            {item.complete ? (
              <CheckCircle2 size={15} className="check-icon text-success" />
            ) : (
              <AlertCircle size={15} className="check-icon text-warning" />
            )}
            <div className="check-text">
              <span className="check-label">{item.label}</span>
              {!item.complete && <span className="check-tip">{item.tip}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

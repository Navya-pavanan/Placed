import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Save,
  Eye,
  Sparkles,
  ScanSearch,
  CheckCircle2,
  Plus,
  X,
  HelpCircle,
  User,
  GraduationCap,
  Code,
  Briefcase,
  FolderGit2,
  Award,
  Trophy,
  Flame,
  Presentation,
  BookOpen,
  Languages,
  HeartHandshake,
  Users,
  ScrollText,
  Compass,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Check,
  Printer,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { resumeService, RESUME_TEMPLATES, AVAILABLE_SECTIONS_CATALOG } from '../../services/resumeService';
import { atsService } from '../../services/atsService';
import { ResumePreview } from './resume/ResumePreview';
import { AddSectionModal } from './resume/AddSectionModal';
import {
  PersonalDetailsEditor,
  SummaryEditor,
  EducationEditor,
  SkillsEditor,
  ProjectsEditor,
  ExperienceOrInternshipEditor,
  CertificationsEditor,
  SimpleEntriesEditor,
  LanguagesEditor
} from './resume/SectionEditors';

// Map section IDs → icon components (for the form-sec-title)
const SECTION_ICONS = {
  personal:         User,
  summary:          FileText,
  education:        GraduationCap,
  skills:           Code,
  projects:         FolderGit2,
  internships:      Briefcase,
  experience:       Briefcase,
  certifications:   Award,
  achievements:     Trophy,
  hackathons:       Flame,
  workshops:        Presentation,
  courses:          BookOpen,
  languages:        Languages,
  volunteer:        HeartHandshake,
  responsibilities: Users,
  publications:     ScrollText,
  extracurricular:  Compass,
  interests:        Sparkles,
};

// Ordered section labels matching the deployed UI numbers
const SECTION_LABELS = {
  personal:         'Personal Details',
  summary:          'Professional Summary',
  education:        'Education',
  skills:           'Technical Skills / Keywords',
  internships:      'Internships / Experience',
  experience:       'Work Experience',
  projects:         'Featured Projects',
  certifications:   'Certifications',
  achievements:     'Key Achievements & Awards',
  hackathons:       'Hackathons & Competitions',
  workshops:        'Workshops & Seminars',
  courses:          'Relevant Coursework',
  languages:        'Languages',
  volunteer:        'Volunteer Experience',
  responsibilities: 'Positions of Responsibility',
  publications:     'Publications & Research',
  extracurricular:  'Extracurricular Activities',
  interests:        'Areas of Interest',
};

const ResumeBuilder = () => {
  const [formData, setFormData]               = useState(null);
  const [skills, setSkills]                   = useState([]);
  const [atsJobDescription, setAtsJobDescription] = useState('');
  const [atsResults, setAtsResults]           = useState(null);
  const [isAnalyzing, setIsAnalyzing]         = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen]       = useState(false);
  const [previewZoom, setPreviewZoom]                     = useState(1);
  const [saveToast, setSaveToast]                         = useState(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPreviewModalOpen(false);
        setIsAddSectionModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load initial data
  useEffect(() => {
    resumeService.getResume().then(({ formData: loaded, skills: loadedSkills }) => {
      setFormData(loaded);
      setSkills(loadedSkills || []);
    });
    atsService.getRecentAnalysis().then((recent) => {
      if (recent) setAtsResults(recent);
    });
  }, []);

  const triggerToast = (msg) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const persistResume = (updatedData) => {
    setFormData(updatedData);
    resumeService.updateResume(updatedData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    persistResume({ ...formData, [name]: value });
  };

  const handleSkillsChange = (newSkills) => {
    setSkills(newSkills);
    resumeService.updateSkills(newSkills);
    persistResume({ ...formData, skills: newSkills });
  };

  const handleSaveDraft = async () => {
    if (!formData) return;
    await resumeService.updateResume(formData);
    await resumeService.updateSkills(skills);
    triggerToast('Draft saved successfully!');
  };

  const handlePrint = () => window.print();

  const runAtsAudit = async () => {
    if (!atsJobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const results = await atsService.analyzeResume(formData, skills, atsJobDescription);
      setAtsResults(results);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddSection = (sectionId) => {
    if (formData.activeSections.includes(sectionId)) return;
    persistResume({ ...formData, activeSections: [...formData.activeSections, sectionId] });
  };

  const handleAddCustomSection = (title) => {
    const customId = `custom-${Date.now()}`;
    const customSections = [...(formData.customSections || []), { id: customId, title, items: [] }];
    persistResume({ ...formData, customSections, activeSections: [...formData.activeSections, customId] });
  };

  const [editingSectionId, setEditingSectionId]           = useState(null);
  const [tempTitle, setTempTitle]                         = useState('');

  const handleMoveSection = (index, direction) => {
    const newActive = [...formData.activeSections];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newActive.length) return;
    const temp = newActive[index];
    newActive[index] = newActive[targetIdx];
    newActive[targetIdx] = temp;
    persistResume({ ...formData, activeSections: newActive });
  };

  const handleDeleteSection = (sectionId) => {
    const newActive = formData.activeSections.filter((id) => id !== sectionId);
    persistResume({ ...formData, activeSections: newActive });
  };

  const handleRenameSection = (sectionId, newTitle) => {
    if (!newTitle.trim()) return;
    const sectionTitles = { ...(formData.sectionTitles || {}), [sectionId]: newTitle.trim() };
    persistResume({ ...formData, sectionTitles });
  };

  if (!formData) {
    return (
      <main className="dashboard-content">
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading your resume…
        </div>
      </main>
    );
  }

  // Render the editor content for a given section ID
  const renderSectionContent = (sectionId) => {
    const customSec = (formData.customSections || []).find((c) => c.id === sectionId);

    switch (sectionId) {
      case 'personal':
        return <PersonalDetailsEditor formData={formData} onChange={handleInputChange} />;

      case 'summary':
        return <SummaryEditor formData={formData} onChange={handleInputChange} />;

      case 'education':
        return (
          <EducationEditor
            education={formData.education || []}
            onChange={(upd) => persistResume({ ...formData, education: upd })}
          />
        );

      case 'skills':
        return <SkillsEditor skills={skills} onChange={handleSkillsChange} />;

      case 'projects':
        return (
          <ProjectsEditor
            projects={formData.projects || []}
            onChange={(upd) => persistResume({ ...formData, projects: upd })}
          />
        );

      case 'internships':
        return (
          <ExperienceOrInternshipEditor
            type="internship"
            items={formData.internships || []}
            onChange={(upd) => persistResume({ ...formData, internships: upd })}
          />
        );

      case 'experience':
        return (
          <ExperienceOrInternshipEditor
            type="experience"
            items={formData.experience || []}
            onChange={(upd) => persistResume({ ...formData, experience: upd })}
          />
        );

      case 'certifications':
        return (
          <CertificationsEditor
            certifications={formData.certifications || []}
            onChange={(upd) => persistResume({ ...formData, certifications: upd })}
          />
        );

      case 'achievements':
        return (
          <SimpleEntriesEditor
            sectionName="Achievement" titleLabel="Award / Honor Title" subLabel="Conferring Body / Context"
            items={formData.achievements || []}
            onChange={(upd) => persistResume({ ...formData, achievements: upd })}
          />
        );

      case 'hackathons':
        return (
          <SimpleEntriesEditor
            sectionName="Hackathon" titleLabel="Event / Hackathon Name" subLabel="Project Title or Rank"
            items={formData.hackathons || []}
            onChange={(upd) => persistResume({ ...formData, hackathons: upd })}
          />
        );

      case 'workshops':
        return (
          <SimpleEntriesEditor
            sectionName="Workshop" titleLabel="Workshop / Seminar Topic" subLabel="Organizer / Institution"
            items={formData.workshops || []}
            onChange={(upd) => persistResume({ ...formData, workshops: upd })}
          />
        );

      case 'courses':
        return (
          <SimpleEntriesEditor
            sectionName="Course" titleLabel="Course Title" subLabel="Platform / University"
            items={formData.courses || []}
            onChange={(upd) => persistResume({ ...formData, courses: upd })}
          />
        );

      case 'languages':
        return (
          <LanguagesEditor
            languages={formData.languages || []}
            onChange={(upd) => persistResume({ ...formData, languages: upd })}
          />
        );

      case 'volunteer':
        return (
          <SimpleEntriesEditor
            sectionName="Volunteering" titleLabel="Role / Cause" subLabel="Organization / NGO"
            items={formData.volunteer || []}
            onChange={(upd) => persistResume({ ...formData, volunteer: upd })}
          />
        );

      case 'responsibilities':
        return (
          <SimpleEntriesEditor
            sectionName="Responsibility" titleLabel="Position Title" subLabel="Club / Department"
            items={formData.responsibilities || []}
            onChange={(upd) => persistResume({ ...formData, responsibilities: upd })}
          />
        );

      case 'publications':
        return (
          <SimpleEntriesEditor
            sectionName="Publication" titleLabel="Paper Title" subLabel="Journal / Conference"
            items={formData.publications || []}
            onChange={(upd) => persistResume({ ...formData, publications: upd })}
          />
        );

      case 'extracurricular':
        return (
          <SimpleEntriesEditor
            sectionName="Activity" titleLabel="Activity / Sport" subLabel="Team / Role"
            items={formData.extracurricular || []}
            onChange={(upd) => persistResume({ ...formData, extracurricular: upd })}
          />
        );

      default:
        if (customSec) {
          return (
            <SimpleEntriesEditor
              sectionName={customSec.title} titleLabel="Item Title" subLabel="Subtitle / Organization"
              items={customSec.items || []}
              onChange={(updatedItems) => {
                const updatedCustoms = (formData.customSections || []).map((cs) =>
                  cs.id === customSec.id ? { ...cs, items: updatedItems } : cs
                );
                persistResume({ ...formData, customSections: updatedCustoms });
              }}
            />
          );
        }
        return null;
    }
  };

  const getRawTitle = (sectionId) => {
    const catalogMeta = AVAILABLE_SECTIONS_CATALOG.find((s) => s.id === sectionId);
    const customSec   = (formData.customSections || []).find((c) => c.id === sectionId);
    return formData.sectionTitles?.[sectionId]
      || catalogMeta?.title
      || customSec?.title
      || SECTION_LABELS[sectionId]
      || sectionId;
  };

  // Get a display label + number for each section
  const getLabel = (sectionId, idx) => {
    return `${idx + 1}. ${getRawTitle(sectionId)}`;
  };

  const getIcon = (sectionId) => {
    const Icon = SECTION_ICONS[sectionId] || Layers;
    return <Icon size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />;
  };

  return (
    <main className="dashboard-content">

      {/* ── Page Header ── */}
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <FileText size={21} /> Resume Maker &amp; Analyzer
          </h1>
          <p className="view-sub">
            Build a professional, ATS-friendly resume and test it against real job descriptions.
          </p>
        </div>
        <div className="view-actions">
          <button className="btn btn-outline btn-sm" onClick={handleSaveDraft}>
            <Save size={14} /> Save Draft
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setIsPreviewModalOpen(true)}>
            <Eye size={14} /> Preview
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      {/* Toast */}
      {saveToast && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: '#F0FDF4', border: '1px solid #BBF7D0',
          color: '#16A34A', borderRadius: 'var(--radius-sm)',
          padding: '9px 14px', fontSize: '13px', fontWeight: 600
        }}>
          <CheckCircle2 size={15} /> {saveToast}
        </div>
      )}

      {/* ── Two-Column Grid ── */}
      <div className="resume-builder-grid">

        {/* ══════════════════════════════════════
            LEFT — Interactive Builder Card
        ══════════════════════════════════════ */}
        <div className="builder-editor-card card">
          <div className="card-header">
            <h2 className="card-title" style={{ fontSize: '14px' }}>Interactive Builder</h2>
          </div>

          <div className="builder-form-body">
            {formData.activeSections.map((sectionId, idx) => {
              const content = renderSectionContent(sectionId);
              if (!content) return null;
              return (
                <div
                  key={sectionId}
                  className="form-section"
                  style={idx === formData.activeSections.length - 1 ? { borderBottom: 'none' } : {}}
                >
                  <div
                    className="form-section-header"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                      {getIcon(sectionId)}
                      {editingSectionId === sectionId ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRenameSection(sectionId, tempTitle);
                            setEditingSectionId(null);
                          }}
                          style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}
                        >
                          <input
                            type="text"
                            className="form-input form-input-sm"
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            autoFocus
                            style={{ height: '28px', padding: '4px 8px', fontSize: '13px' }}
                          />
                          <button type="submit" className="btn-icon text-success" title="Save Title">
                            <Check size={14} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setEditingSectionId(null)}
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </form>
                      ) : (
                        <h3 className="form-sec-title" style={{ margin: 0 }}>
                          {getLabel(sectionId, idx)}
                        </h3>
                      )}
                    </div>

                    <div className="section-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {editingSectionId !== sectionId && (
                        <button
                          type="button"
                          className="btn-icon"
                          title="Rename Section"
                          onClick={() => {
                            setEditingSectionId(sectionId);
                            setTempTitle(getRawTitle(sectionId));
                          }}
                        >
                          <Edit2 size={13} />
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-icon"
                        title="Move Section Up"
                        disabled={idx === 0}
                        onClick={() => handleMoveSection(idx, -1)}
                      >
                        <ArrowUp size={13} />
                      </button>

                      <button
                        type="button"
                        className="btn-icon"
                        title="Move Section Down"
                        disabled={idx === formData.activeSections.length - 1}
                        onClick={() => handleMoveSection(idx, 1)}
                      >
                        <ArrowDown size={13} />
                      </button>

                      {sectionId !== 'personal' && (
                        <button
                          type="button"
                          className="btn-icon text-danger"
                          title="Remove Section"
                          onClick={() => handleDeleteSection(sectionId)}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                  {content}
                </div>
              );
            })}

            {/* Add Section */}
            <div style={{ padding: '16px 0 4px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setIsAddSectionModalOpen(true)}
                style={{ gap: '6px', width: '100%', justifyContent: 'center' }}
              >
                <Plus size={14} /> Add Resume Section
              </button>
            </div>
          </div>

          {/* ── ATS Keyword Analyzer (inside editor card, below form) ── */}
          <div style={{ borderTop: '1px solid var(--border-light)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={15} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text)' }}>ATS Keyword Analyzer</span>
              <span className="status-badge info" style={{ marginLeft: 'auto', fontSize: '11px' }}>Job Description Match</span>
            </div>

            <div className="form-group">
              <label>Paste Target Job Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Paste the job description or placement JD here to audit ATS compatibility…"
                value={atsJobDescription}
                onChange={(e) => setAtsJobDescription(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={runAtsAudit}
              disabled={!atsJobDescription.trim() || isAnalyzing}
              style={{ alignSelf: 'flex-start', gap: '6px' }}
            >
              <ScanSearch size={14} />
              {isAnalyzing ? 'Analyzing…' : 'Run Compatibility Audit'}
            </button>

            {/* ATS Results */}
            {atsResults && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="ats-audit-footer" style={{ border: 'none', padding: 0, background: 'none', flexWrap: 'wrap', gap: '12px' }}>
                  <div className="ats-score-box">
                    <span className="ats-lbl">Overall ATS</span>
                    <span className="ats-val" style={{
                      color: atsResults.score >= 75 ? '#16A34A'
                           : atsResults.score >= 50 ? 'var(--primary)'
                           : 'var(--danger)'
                    }}>{atsResults.score}%</span>
                  </div>
                  <div className="ats-score-box">
                    <span className="ats-lbl">Skills Match</span>
                    <span className="ats-val" style={{ color: 'var(--primary)' }}>
                      {atsResults.skillsMatch ?? atsResults.score}%
                    </span>
                  </div>
                  <div className="ats-score-box" style={{ borderRight: 'none' }}>
                    <span className="ats-lbl">Keywords</span>
                    <span className="ats-val" style={{ color: 'var(--text)' }}>
                      {atsResults.keywordMatch ?? Math.round((atsResults.score || 0) * 0.9)}%
                    </span>
                  </div>
                </div>

                {atsResults.matched?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A', marginBottom: '6px' }}>
                      ✓ Matched ({atsResults.matched.length})
                    </p>
                    <div className="skills-tag-editor">
                      {atsResults.matched.slice(0, 14).map((kw, i) => (
                        <span key={i} className="skill-chip"
                          style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {atsResults.missing?.length > 0 && (
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--danger)', marginBottom: '6px' }}>
                      ✗ Missing / Gaps ({atsResults.missing.length})
                    </p>
                    <div className="skills-tag-editor">
                      {atsResults.missing.slice(0, 10).map((kw, i) => (
                        <span key={i} className="skill-chip"
                          style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {atsResults.suggestions?.length > 0 && (
                  <div className="ats-tips-box">
                    {atsResults.suggestions.slice(0, 4).map((s, i) => (
                      <div key={i} className="ats-tip amber"><HelpCircle size={12} /> {s}</div>
                    ))}
                  </div>
                )}

                <div style={{
                  display: 'flex', gap: '6px', alignItems: 'flex-start',
                  fontSize: '11px', color: 'var(--text-muted)',
                  background: 'var(--bg)', padding: '8px 10px', borderRadius: 'var(--radius-sm)'
                }}>
                  <HelpCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                  Only add keywords that genuinely match your actual skills and experience.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Live ATS Document Preview
        ══════════════════════════════════════ */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: 'calc(var(--topbar-h, 64px) + 16px)', maxHeight: 'calc(100vh - 90px)', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ padding: '12px 18px', flexShrink: 0 }}>
            <h2 className="card-title" style={{ fontSize: '13.5px', gap: '6px' }}>
              <Eye size={15} style={{ color: 'var(--primary)' }} />
              Real-Time ATS Document Preview
            </h2>
            <span className="status-badge success" style={{ fontSize: '11px', gap: '4px' }}>
              <CheckCircle2 size={11} /> ATS Compatible Format
            </span>
          </div>
          <div className="resume-paper-wrapper" style={{ flex: 1, overflowY: 'auto' }}>
            <ResumePreview resumeData={formData} skills={skills} />
          </div>
        </div>

      </div>

      {/* ── Add Section Modal ── */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        activeSections={formData.activeSections}
        onAddSection={handleAddSection}
        onAddCustomSection={handleAddCustomSection}
      />

      {/* ── Fullscreen Preview Modal ── */}
      {isPreviewModalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(8px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            overflowY: 'auto'
          }}
          onClick={() => setIsPreviewModalOpen(false)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              width: '92vw',
              maxWidth: '860px',
              height: '84vh',
              maxHeight: '84vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              margin: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: '1px solid #E2E8F0',
                background: '#FFFFFF',
                flexShrink: 0,
                zIndex: 10,
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EFF6FF',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #DBEAFE',
                  flexShrink: 0
                }}>
                  <Eye size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{
                      fontWeight: 800,
                      fontSize: '15.5px',
                      color: '#0F172A',
                      margin: 0,
                      lineHeight: 1.2
                    }}>
                      Resume Full Preview
                    </h3>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      background: '#F0FDF4',
                      color: '#16A34A',
                      border: '1px solid #BBF7D0',
                      padding: '2px 8px',
                      borderRadius: '99px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={11} /> ATS-Ready
                    </span>
                  </div>
                  <p style={{
                    fontSize: '11.5px',
                    color: '#64748B',
                    margin: '2px 0 0 0',
                    lineHeight: 1.2
                  }}>
                    A4 Standard • Ready for placements &amp; job applications
                  </p>
                </div>
              </div>

              {/* Center / Zoom */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: '#F8FAFC',
                padding: '3px 6px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0'
              }}>
                <button
                  type="button"
                  className="btn-icon"
                  title="Zoom Out"
                  disabled={previewZoom <= 0.75}
                  onClick={() => setPreviewZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(2)))}
                  style={{ width: '26px', height: '26px' }}
                >
                  <ZoomOut size={13} />
                </button>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: '#334155',
                  minWidth: '38px',
                  textAlign: 'center'
                }}>
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  type="button"
                  className="btn-icon"
                  title="Zoom In"
                  disabled={previewZoom >= 1.3}
                  onClick={() => setPreviewZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(2)))}
                  style={{ width: '26px', height: '26px' }}
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  title="Reset Zoom"
                  onClick={() => setPreviewZoom(1)}
                  style={{
                    width: '32px',
                    height: '26px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#64748B'
                  }}
                >
                  100%
                </button>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handlePrint}
                  style={{ gap: '6px', padding: '6px 12px', fontSize: '12.5px', borderRadius: '8px' }}
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handlePrint}
                  style={{
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(37,99,235,0.25)'
                  }}
                >
                  <Download size={13} /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  title="Close Preview (Esc)"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#64748B';
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Viewer Canvas */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              background: '#334155',
              padding: '28px 16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              <div style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.12s ease-out',
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '640px'
              }}>
                <ResumePreview resumeData={formData} skills={skills} />
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default ResumeBuilder;

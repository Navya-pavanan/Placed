import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Plus,
  Check,
  X,
  User,
  FileText,
  GraduationCap,
  Code,
  FolderGit2,
  Briefcase,
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
  Sparkles,
  Layers
} from 'lucide-react';

const ICON_MAP = {
  personal: User,
  summary: FileText,
  education: GraduationCap,
  skills: Code,
  projects: FolderGit2,
  internships: Briefcase,
  experience: Briefcase,
  certifications: Award,
  achievements: Trophy,
  hackathons: Flame,
  workshops: Presentation,
  courses: BookOpen,
  languages: Languages,
  volunteer: HeartHandshake,
  responsibilities: Users,
  publications: ScrollText,
  extracurricular: Compass,
  interests: Sparkles
};

// Reusable Section Container Card with reorder, title edit, delete, and collapse
export const SectionWrapper = ({
  id,
  title,
  canDelete = true,
  canMoveUp = true,
  canMoveDown = true,
  onMoveUp,
  onMoveDown,
  onDelete,
  onRename,
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState(title);

  const IconComponent = ICON_MAP[id] || Layers;

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (customTitle.trim()) {
      onRename(id, customTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className={`form-section-card card ${collapsed ? 'is-collapsed' : ''}`} id={`section-card-${id}`}>
      <div className="section-card-header">
        <div className="section-card-title-group" onClick={() => !isEditingTitle && setCollapsed(!collapsed)}>
          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
            aria-label="Toggle section collapse"
          >
            {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>

          <span className="section-header-icon">
            <IconComponent size={16} />
          </span>

          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input form-input-sm"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn-icon text-success" title="Save Title">
                <Check size={14} />
              </button>
              <button type="button" className="btn-icon" onClick={() => setIsEditingTitle(false)} title="Cancel">
                <X size={14} />
              </button>
            </form>
          ) : (
            <h3 className="section-header-title">
              {title}
            </h3>
          )}
        </div>

        <div className="section-header-actions">
          {!isEditingTitle && (
            <button
              type="button"
              className="btn-icon"
              title="Rename Section"
              onClick={() => setIsEditingTitle(true)}
            >
              <Edit2 size={13} />
            </button>
          )}

          <button
            type="button"
            className="btn-icon"
            title="Move Section Up"
            disabled={!canMoveUp}
            onClick={onMoveUp}
          >
            <ArrowUp size={13} />
          </button>

          <button
            type="button"
            className="btn-icon"
            title="Move Section Down"
            disabled={!canMoveDown}
            onClick={onMoveDown}
          >
            <ArrowDown size={13} />
          </button>

          {canDelete && (
            <button
              type="button"
              className="btn-icon text-danger"
              title="Remove Section"
              onClick={onDelete}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {!collapsed && <div className="section-card-content">{children}</div>}
    </div>
  );
};

// 1. Personal Details Editor
export const PersonalDetailsEditor = ({ formData, onChange }) => {
  return (
    <div className="form-grid-2">
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={onChange}
          placeholder="e.g. Kavya Kulothungan"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Target Professional Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={onChange}
          placeholder="e.g. Aspiring Full Stack Engineer / CS Undergraduate"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Email Address *</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={onChange}
          placeholder="e.g. student@college.edu"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={onChange}
          placeholder="e.g. +91 98765 43210"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Location (City, State / Country)</label>
        <input
          type="text"
          name="location"
          value={formData.location || ''}
          onChange={onChange}
          placeholder="e.g. Chennai, Tamil Nadu"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>LinkedIn Profile</label>
        <input
          type="text"
          name="linkedin"
          value={formData.linkedin || ''}
          onChange={onChange}
          placeholder="linkedin.com/in/username"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>GitHub Profile / Portfolio</label>
        <input
          type="text"
          name="github"
          value={formData.github || ''}
          onChange={onChange}
          placeholder="github.com/username"
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>Portfolio / Personal Website</label>
        <input
          type="text"
          name="portfolio"
          value={formData.portfolio || ''}
          onChange={onChange}
          placeholder="e.g. portfolio.dev"
          className="form-input"
        />
      </div>
    </div>
  );
};

// 2. Summary Editor
export const SummaryEditor = ({ formData, onChange }) => {
  return (
    <div className="form-group">
      <label>Professional Bio / Objective for Recruiters</label>
      <textarea
        name="summary"
        rows="3"
        value={formData.summary || ''}
        onChange={onChange}
        placeholder="Write a concise 2-3 sentence overview highlighting your degree, programming strengths, core projects, and career aspirations..."
        className="form-textarea"
      />
      <span className="field-hint">
        Tip: Focus on your problem-solving abilities, core tech stack, and motivation to learn during campus placements.
      </span>
    </div>
  );
};

// 3. Education Editor (Supports Multiple Entries: Degree, Institution, Board/University, Start/End Year, CGPA or Percentage, Location)
export const EducationEditor = ({ education = [], onChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    degree: '',
    institution: '',
    boardOrUniversity: '',
    startYear: '',
    endYear: '',
    scoreType: 'cgpa',
    score: '',
    location: '',
    description: ''
  });

  const handleStartAdd = () => {
    setDraft({
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      boardOrUniversity: '',
      startYear: '',
      endYear: '',
      scoreType: 'cgpa',
      score: '',
      location: '',
      description: ''
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setDraft({ ...item });
    setEditingId(item.id);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.degree.trim() && !draft.institution.trim()) return;

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...education, { ...draft, id: draft.id || `edu-${Date.now()}` }];
    } else {
      updatedList = education.map((it) => (it.id === editingId ? { ...draft } : it));
    }
    onChange(updatedList);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = education.filter((it) => it.id !== id);
    onChange(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= education.length) return;
    const copy = [...education];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <div className="repeatable-section">
      {/* Existing Education Entries List */}
      <div className="entries-list">
        {education.map((item, idx) => (
          <div key={item.id || idx} className="entry-card">
            <div className="entry-card-header">
              <div>
                <strong className="entry-main-text">{item.degree || 'Degree / Qualification'}</strong>
                <p className="entry-sub-text">
                  {item.institution}
                  {item.boardOrUniversity ? ` • ${item.boardOrUniversity}` : ''}
                  {item.location ? ` (${item.location})` : ''}
                </p>
                <span className="entry-pill">
                  {item.startYear && item.endYear ? `${item.startYear} – ${item.endYear}` : (item.endYear || item.startYear)}
                  {item.score ? ` • ${item.score} ${item.scoreType === 'percentage' ? '%' : (item.score.toLowerCase().includes('cgpa') ? '' : 'CGPA')}` : ''}
                </span>
              </div>
              <div className="entry-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === education.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleStartEdit(item)}
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon text-danger"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inline Form when Adding or Editing */}
      {editingId !== null && (
        <form onSubmit={handleSaveDraft} className="entry-editor-form">
          <h4 className="editor-form-title">
            {editingId === 'new' ? 'Add Education Qualification' : 'Edit Education Qualification'}
          </h4>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Qualification / Degree *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BCA, B.Tech CSE, Class XII, Class X"
                value={draft.degree}
                onChange={(e) => setDraft({ ...draft, degree: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Institution / School *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TC Arts College, ABC Higher Secondary School"
                value={draft.institution}
                onChange={(e) => setDraft({ ...draft, institution: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Board / University</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. University of Madras, CBSE, State Board"
                value={draft.boardOrUniversity}
                onChange={(e) => setDraft({ ...draft, boardOrUniversity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Location (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Chennai, India"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Start Year</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2024"
                value={draft.startYear}
                onChange={(e) => setDraft({ ...draft, startYear: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Year / Passing Year *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2027 or 2024"
                value={draft.endYear}
                onChange={(e) => setDraft({ ...draft, endYear: e.target.value })}
              />
            </div>

            {/* Score Type Selection (CGPA vs Percentage) */}
            <div className="form-group">
              <label>Evaluation Metric</label>
              <div className="metric-toggle-group">
                <button
                  type="button"
                  className={`btn btn-sm ${draft.scoreType === 'cgpa' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDraft({ ...draft, scoreType: 'cgpa' })}
                >
                  CGPA
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${draft.scoreType === 'percentage' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDraft({ ...draft, scoreType: 'percentage' })}
                >
                  Percentage (%)
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>{draft.scoreType === 'percentage' ? 'Percentage Score' : 'CGPA Score'}</label>
              <input
                type="text"
                className="form-input"
                placeholder={draft.scoreType === 'percentage' ? 'e.g. 91.5%' : 'e.g. 8.8'}
                value={draft.score}
                onChange={(e) => setDraft({ ...draft, score: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Relevant Coursework or Achievements (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Core Java, DBMS, Operating Systems, Academic Merit Scholar"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="editor-form-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} style={{ marginRight: '4px' }} /> Save Education
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Add Button */}
      {editingId === null && (
        <button
          type="button"
          className="btn btn-outline btn-sm add-entry-btn"
          onClick={handleStartAdd}
        >
          <Plus size={14} style={{ marginRight: '6px' }} /> + Add Education
        </button>
      )}
    </div>
  );
};

// 4. Technical Skills Editor with suggested tags & quick remove
export const SkillsEditor = ({ skills = [], onChange }) => {
  const [newSkill, setNewSkill] = useState('');

  const SUGGESTED_SKILLS = [
    'React', 'JavaScript', 'Node.js', 'Python', 'SQL',
    'PostgreSQL', 'MongoDB', 'Git', 'GitHub', 'REST API',
    'C++', 'Java', 'HTML5', 'CSS3', 'Docker', 'AWS'
  ];

  const handleAdd = (val) => {
    const trimmed = (val || newSkill).trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
    setNewSkill('');
  };

  const handleRemove = (skillToRemove) => {
    onChange(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      <div className="skills-tag-editor">
        {skills.map((skill, index) => (
          <span className="skill-chip" key={index}>
            {skill}
            <X
              size={12}
              style={{ cursor: 'pointer', marginLeft: '6px' }}
              onClick={() => handleRemove(skill)}
            />
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Type a skill and press Enter (e.g. React, SQL, Git)..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => handleAdd()}
          disabled={!newSkill.trim()}
        >
          <Plus size={14} style={{ marginRight: '4px' }} /> Add
        </button>
      </div>

      <div className="suggested-skills-box">
        <span className="suggested-title">Quick Add Popular Skills:</span>
        <div className="suggested-chips">
          {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).slice(0, 8).map((s, idx) => (
            <button
              type="button"
              key={idx}
              className="suggested-chip-btn"
              onClick={() => handleAdd(s)}
            >
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 5. Featured Projects Editor
export const ProjectsEditor = ({ projects = [], onChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: '',
    role: '',
    techStack: '',
    link: '',
    date: '',
    description: ''
  });

  const handleStartAdd = () => {
    setDraft({
      id: `proj-${Date.now()}`,
      title: '',
      role: '',
      techStack: '',
      link: '',
      date: '',
      description: ''
    });
    setEditingId('new');
  };

  const handleStartEdit = (proj) => {
    setDraft({ ...proj });
    setEditingId(proj.id);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...projects, { ...draft, id: draft.id || `proj-${Date.now()}` }];
    } else {
      updatedList = projects.map((p) => (p.id === editingId ? { ...draft } : p));
    }
    onChange(updatedList);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    onChange(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <div className="repeatable-section">
      <div className="entries-list">
        {projects.map((proj, idx) => (
          <div key={proj.id || idx} className="entry-card">
            <div className="entry-card-header">
              <div>
                <strong className="entry-main-text">{proj.title || 'Project Name'}</strong>
                {proj.role && <span className="entry-role-tag"> | {proj.role}</span>}
                {proj.techStack && <p className="entry-sub-text">Stack: {proj.techStack}</p>}
              </div>
              <div className="entry-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === projects.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleStartEdit(proj)}
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon text-danger"
                  onClick={() => handleDelete(proj.id)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSaveDraft} className="entry-editor-form">
          <h4 className="editor-form-title">
            {editingId === 'new' ? 'Add Featured Project' : 'Edit Project'}
          </h4>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. PLACED Campus Portal"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Your Role (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Full-Stack Developer, Team Lead"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Tech Stack *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Node.js, Express, MongoDB"
                value={draft.techStack}
                onChange={(e) => setDraft({ ...draft, techStack: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Project Link / GitHub URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. github.com/username/project"
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Year / Timeline</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Jan 2025 – Present"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Project Description / Bullet Points *</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="• Engineered a scalable REST API handling 500+ requests/sec&#10;• Implemented responsive UI with React and Tailwind CSS&#10;• Reduced page load times by 28% using code splitting"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
            <span className="field-hint">
              Tip: Use action verbs (Engineered, Architected, Designed) and quantify results with metrics where possible.
            </span>
          </div>

          <div className="editor-form-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} style={{ marginRight: '4px' }} /> Save Project
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId === null && (
        <button
          type="button"
          className="btn btn-outline btn-sm add-entry-btn"
          onClick={handleStartAdd}
        >
          <Plus size={14} style={{ marginRight: '6px' }} /> + Add Project
        </button>
      )}
    </div>
  );
};

// 6. Internships / Experience Editor
export const ExperienceOrInternshipEditor = ({ items = [], onChange, type = 'internship' }) => {
  const isIntern = type === 'internship';
  const label = isIntern ? 'Internship' : 'Experience';

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    company: '',
    role: '',
    location: '',
    duration: '',
    description: ''
  });

  const handleStartAdd = () => {
    setDraft({
      id: `${type}-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      duration: '',
      description: ''
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setDraft({ ...item });
    setEditingId(item.id);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.company.trim() && !draft.role.trim()) return;

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...items, { ...draft, id: draft.id || `${type}-${Date.now()}` }];
    } else {
      updatedList = items.map((it) => (it.id === editingId ? { ...draft } : it));
    }
    onChange(updatedList);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = items.filter((it) => it.id !== id);
    onChange(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <div className="repeatable-section">
      <div className="entries-list">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="entry-card">
            <div className="entry-card-header">
              <div>
                <strong className="entry-main-text">{item.role || 'Role'}</strong>
                <span className="entry-company-text"> — {item.company}</span>
                <p className="entry-sub-text">
                  {item.duration} {item.location ? `• ${item.location}` : ''}
                </p>
              </div>
              <div className="entry-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleStartEdit(item)}
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon text-danger"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSaveDraft} className="entry-editor-form">
          <h4 className="editor-form-title">
            {editingId === 'new' ? `Add ${label}` : `Edit ${label}`}
          </h4>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Company / Organization *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TechCorp Solutions"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Role / Designation *</label>
              <input
                type="text"
                className="form-input"
                placeholder={isIntern ? "e.g. Frontend Engineering Intern" : "e.g. Junior Software Engineer"}
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Location (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, Remote"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Duration / Timeframe</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. May 2024 – Jul 2024"
                value={draft.duration}
                onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Key Responsibilities & Deliverables</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="• Developed user interfaces with React and Redux&#10;• Collaborated with backend engineers to integrate REST APIs&#10;• Conducted automated testing with Jest"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="editor-form-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} style={{ marginRight: '4px' }} /> Save {label}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId === null && (
        <button
          type="button"
          className="btn btn-outline btn-sm add-entry-btn"
          onClick={handleStartAdd}
        >
          <Plus size={14} style={{ marginRight: '6px' }} /> + Add {label}
        </button>
      )}
    </div>
  );
};

// 7. Certifications Editor
export const CertificationsEditor = ({ certifications = [], onChange }) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    credentialUrl: ''
  });

  const handleStartAdd = () => {
    setDraft({
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      credentialUrl: ''
    });
    setEditingId('new');
  };

  const handleStartEdit = (cert) => {
    setDraft({ ...cert });
    setEditingId(cert.id);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.name.trim()) return;

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...certifications, { ...draft, id: draft.id || `cert-${Date.now()}` }];
    } else {
      updatedList = certifications.map((c) => (c.id === editingId ? { ...draft } : c));
    }
    onChange(updatedList);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = certifications.filter((c) => c.id !== id);
    onChange(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= certifications.length) return;
    const copy = [...certifications];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <div className="repeatable-section">
      <div className="entries-list">
        {certifications.map((cert, idx) => (
          <div key={cert.id || idx} className="entry-card">
            <div className="entry-card-header">
              <div>
                <strong className="entry-main-text">{cert.name}</strong>
                {cert.issuer && <span className="entry-sub-text"> — {cert.issuer}</span>}
                {cert.issueDate && <span className="entry-pill"> • {cert.issueDate}</span>}
              </div>
              <div className="entry-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === certifications.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleStartEdit(cert)}
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon text-danger"
                  onClick={() => handleDelete(cert.id)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSaveDraft} className="entry-editor-form">
          <h4 className="editor-form-title">
            {editingId === 'new' ? 'Add Certification' : 'Edit Certification'}
          </h4>

          <div className="form-grid-2">
            <div className="form-group">
              <label>Certification Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS Certified Cloud Practitioner"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Issuing Organization *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Amazon Web Services / Coursera"
                value={draft.issuer}
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Issue Year / Date</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2024"
                value={draft.issueDate}
                onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Verification URL (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. verify.link/cert-id"
                value={draft.credentialUrl}
                onChange={(e) => setDraft({ ...draft, credentialUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="editor-form-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} style={{ marginRight: '4px' }} /> Save Certification
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId === null && (
        <button
          type="button"
          className="btn btn-outline btn-sm add-entry-btn"
          onClick={handleStartAdd}
        >
          <Plus size={14} style={{ marginRight: '6px' }} /> + Add Certification
        </button>
      )}
    </div>
  );
};

// 8. Generic Repeatable Simple Entries Editor (Achievements, Hackathons, Workshops, Courses, Volunteer, Responsibilities, Custom Sections)
export const SimpleEntriesEditor = ({
  items = [],
  onChange,
  sectionName = 'Entry',
  titleLabel = 'Title',
  subLabel = 'Organization / Subtitle',
  dateLabel = 'Year / Date'
}) => {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    title: '',
    subtitle: '',
    date: '',
    description: ''
  });

  const handleStartAdd = () => {
    setDraft({
      id: `entry-${Date.now()}`,
      title: '',
      subtitle: '',
      date: '',
      description: ''
    });
    setEditingId('new');
  };

  const handleStartEdit = (item) => {
    setDraft({ ...item });
    setEditingId(item.id);
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    if (!draft.title.trim()) return;

    let updatedList;
    if (editingId === 'new') {
      updatedList = [...items, { ...draft, id: draft.id || `entry-${Date.now()}` }];
    } else {
      updatedList = items.map((it) => (it.id === editingId ? { ...draft } : it));
    }
    onChange(updatedList);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updated = items.filter((it) => it.id !== id);
    onChange(updated);
    if (editingId === id) setEditingId(null);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange(copy);
  };

  return (
    <div className="repeatable-section">
      <div className="entries-list">
        {items.map((item, idx) => (
          <div key={item.id || idx} className="entry-card">
            <div className="entry-card-header">
              <div>
                <strong className="entry-main-text">{item.title}</strong>
                {item.subtitle && <span className="entry-sub-text"> — {item.subtitle}</span>}
                {item.date && <span className="entry-pill"> • {item.date}</span>}
              </div>
              <div className="entry-actions">
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, -1)}
                  title="Move Up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, 1)}
                  title="Move Down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => handleStartEdit(item)}
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  className="btn-icon text-danger"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSaveDraft} className="entry-editor-form">
          <h4 className="editor-form-title">
            {editingId === 'new' ? `Add ${sectionName}` : `Edit ${sectionName}`}
          </h4>

          <div className="form-grid-2">
            <div className="form-group">
              <label>{titleLabel} *</label>
              <input
                type="text"
                className="form-input"
                placeholder={`e.g. ${titleLabel}`}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{subLabel} (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder={`e.g. ${subLabel}`}
                value={draft.subtitle}
                onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>{dateLabel} (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2024"
                value={draft.date}
                onChange={(e) => setDraft({ ...draft, date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '10px' }}>
            <label>Description / Details</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="Highlight details, ranks, or key takeaways..."
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>

          <div className="editor-form-buttons">
            <button type="submit" className="btn btn-primary btn-sm">
              <Check size={14} style={{ marginRight: '4px' }} /> Save {sectionName}
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {editingId === null && (
        <button
          type="button"
          className="btn btn-outline btn-sm add-entry-btn"
          onClick={handleStartAdd}
        >
          <Plus size={14} style={{ marginRight: '6px' }} /> + Add {sectionName}
        </button>
      )}
    </div>
  );
};

// 9. Languages Editor
export const LanguagesEditor = ({ languages = [], onChange }) => {
  const [lang, setLang] = useState('');
  const [proficiency, setProficiency] = useState('Fluent');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!lang.trim()) return;
    onChange([...languages, { id: `lang-${Date.now()}`, language: lang.trim(), proficiency }]);
    setLang('');
  };

  const handleRemove = (id) => {
    onChange(languages.filter((l) => (typeof l === 'string' ? l !== id : l.id !== id)));
  };

  return (
    <div>
      <div className="skills-tag-editor" style={{ marginBottom: '14px' }}>
        {languages.map((item, idx) => {
          const name = typeof item === 'string' ? item : item.language;
          const prof = typeof item === 'object' && item.proficiency ? ` (${item.proficiency})` : '';
          const id = typeof item === 'string' ? item : (item.id || idx);
          return (
            <span className="skill-chip" key={id}>
              {name}{prof}
              <X
                size={12}
                style={{ cursor: 'pointer', marginLeft: '6px' }}
                onClick={() => handleRemove(id)}
              />
            </span>
          );
        })}
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 2, minWidth: '150px' }}
          placeholder="Language name (e.g. English, Tamil, Hindi)..."
          value={lang}
          onChange={(e) => setLang(e.target.value)}
        />
        <select
          className="form-input"
          style={{ flex: 1, minWidth: '130px' }}
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
        >
          <option value="Native">Native</option>
          <option value="Fluent">Fluent</option>
          <option value="Professional">Professional</option>
          <option value="Conversational">Conversational</option>
        </select>
        <button type="submit" className="btn btn-outline" disabled={!lang.trim()}>
          <Plus size={14} style={{ marginRight: '4px' }} /> Add Language
        </button>
      </form>
    </div>
  );
};

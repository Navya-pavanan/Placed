'use client';
import React, { useState, useEffect } from 'react';
import { Award, FileText, TrendingUp, Calendar, ClipboardCheck, Minus, Briefcase, BarChart2, ArrowRight, PlayCircle, Columns3, Edit3, Video, User, PlusCircle } from 'lucide-react';
import { Link } from '../../utils/navigation';
import { studentService } from '../../services/studentService';
import { readinessService } from '../../services/readinessService';
import { opportunityService } from '../../services/opportunityService';
import { interviewService } from '../../services/interviewService';
import { resumeService } from '../../services/resumeService';

const MainDashboard = () => {
  const [student, setStudent] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [roleFits, setRoleFits] = useState([]);
  const [deficits, setDeficits] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    studentService.getStudentProfile().then(setStudent);
    readinessService.getReadinessMetrics().then(setMetrics);
    readinessService.getCorporateRoleFit().then(setRoleFits);
    readinessService.getSkillGaps().then(setDeficits);
    opportunityService.getOpportunities().then(setOpportunities);
    interviewService.getInterviews().then(setInterviews);
    resumeService.getResume().then(r => setResumeData(r.formData));
  }, []);

  const topDeficit = deficits.find(d => d.gap < 0);
  const todayInterview = interviews.find(i => i.isToday) || interviews[0];
  const appliedOpps = opportunities.filter(o => o.pipelineColumn === 'applied' || o.status === 'applied');
  const shortlistedOpps = opportunities.filter(o => o.pipelineColumn === 'shortlisted' || o.status === 'shortlisted');

  // Dynamic Resume completeness score calculation
  const calcResumeScore = () => {
    if (!resumeData) return 0;
    let filled = 0;
    const fields = ['name', 'email', 'phone', 'summary', 'eduDegree', 'intCompany', 'projName'];
    fields.forEach(f => { if (resumeData[f] && resumeData[f].trim() !== '') filled++; });
    return Math.round((filled / fields.length) * 100);
  };

  const resumeScore = calcResumeScore();

  return (
    <main className="dashboard-content">

      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="welcome-text">
          <p className="welcome-greeting">
            {student?.name ? `Welcome back, ${student.name}! 👋` : 'Welcome to PLACED! 👋'}
          </p>
          <h1 className="welcome-heading">Student Dashboard</h1>
          <p className="welcome-sub">
            {metrics?.hasRecordedSkills 
              ? `Placement Readiness Score: ${metrics.overallScore}/100 (${metrics.tier?.label || 'Moderate'}). ${shortlistedOpps.length} shortlisted drives.` 
              : 'Record your skill scores in the Readiness Dashboard to compute your Placement Readiness Score.'}
          </p>
          <div className="welcome-actions">
            <Link to="/readiness" className="btn btn-ghost"><Award size={16} style={{ marginRight: '6px' }} /> View Readiness Analysis</Link>
            <Link to="/resume" className="btn btn-ghost"><FileText size={16} style={{ marginRight: '6px' }} /> Open Resume Maker</Link>
            <Link to="/profile" className="btn btn-ghost"><User size={16} style={{ marginRight: '6px' }} /> Edit Profile</Link>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="placement-ring">
            <svg viewBox="0 0 120 120" className="ring-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10"/>
              <circle 
                cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="10" 
                strokeDasharray="314" strokeDashoffset={metrics?.hasRecordedSkills ? 314 - (metrics.overallScore / 100) * 314 : 314} 
                strokeLinecap="round" transform="rotate(-90 60 60)" className="ring-progress"
              />
            </svg>
            <div className="ring-center">
              <span className="ring-pct">{metrics?.hasRecordedSkills ? metrics.overallScore : '—'}</span>
              <span className="ring-lbl">Score / 100</span>
            </div>
          </div>
          <div className="banner-stats">
            <div className="banner-stat">
              <span className="bs-val">{metrics?.hasRecordedSkills ? metrics.tier?.label : 'Unranked'}</span>
              <span className="bs-key">Readiness Tier</span>
            </div>
            <div className="banner-stat">
              <span className="bs-val">{metrics?.deficitsLeft || 0}</span>
              <span className="bs-key">Deficits Left</span>
            </div>
            <div className="banner-stat">
              <span className="bs-val">{opportunities.length}</span>
              <span className="bs-key">Active Drives</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="kpi-grid">
        <Link to="/readiness" className="kpi-card" style={{ textDecoration: 'none' }}>
          <div className="kpi-icon" style={{ color: '#2563EB' }}><Award size={22} /></div>
          <div className="kpi-info">
            <p className="kpi-label">Placement Readiness Score</p>
            <h3 className="kpi-value">{metrics?.hasRecordedSkills ? `${metrics.overallScore} / 100` : '— / 100'}</h3>
            <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${metrics?.overallScore || 0}%`, background: '#2563EB' }}></div></div>
          </div>
          <span className="kpi-trend up"><TrendingUp size={12} style={{ marginRight: '4px' }} /> {metrics?.batchPercentile || 'Not Audited Yet'}</span>
        </Link>

        <Link to="/interviews" className="kpi-card" style={{ textDecoration: 'none' }}>
          <div className="kpi-icon" style={{ color: '#8B5CF6' }}><Video size={22} /></div>
          <div className="kpi-info">
            <p className="kpi-label">Interview Readiness</p>
            <h3 className="kpi-value">{metrics?.hasRecordedSkills ? `${metrics.interviewReadinessScore} / 100` : '— / 100'}</h3>
            <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${metrics?.interviewReadinessScore || 0}%`, background: '#8B5CF6' }}></div></div>
          </div>
          <span className="kpi-trend neutral"><Calendar size={12} style={{ marginRight: '4px' }} /> {interviews.length > 0 ? `${interviews.length} upcoming interviews` : 'No upcoming interviews'}</span>
        </Link>


        <Link to="/modules" className="kpi-card" style={{ textDecoration: 'none' }}>
          <div className="kpi-icon" style={{ color: '#F59E0B' }}><ClipboardCheck size={22} /></div>
          <div className="kpi-info">
            <p className="kpi-label">Skill Deficits Identified</p>
            <h3 className="kpi-value">{metrics?.deficitsLeft || 0} Gaps</h3>
            <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${(metrics?.deficitsLeft || 0) * 25}%`, background: '#F59E0B' }}></div></div>
          </div>
          <span className="kpi-trend neutral"><Minus size={12} style={{ marginRight: '4px' }} /> Target resolution in Study Modules</span>
        </Link>

        <Link to="/opportunities" className="kpi-card" style={{ textDecoration: 'none' }}>
          <div className="kpi-icon" style={{ color: '#22C55E' }}><Briefcase size={22} /></div>
          <div className="kpi-info">
            <p className="kpi-label">Applied Opportunities</p>
            <h3 className="kpi-value">{appliedOpps.length} Drives</h3>
            <div className="kpi-bar"><div className="kpi-fill" style={{ width: `${opportunities.length > 0 ? (appliedOpps.length / opportunities.length) * 100 : 0}%`, background: '#22C55E' }}></div></div>
          </div>
          <span className="kpi-trend up"><TrendingUp size={12} style={{ marginRight: '4px' }} /> {shortlistedOpps.length} shortlisted</span>
        </Link>
      </section>

      {/* Main Dashboard Grid */}
      <div className="main-grid">
        <div className="col-left">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title"><BarChart2 size={18} style={{ marginRight: '8px' }} /> Skill Performance & Corporate Readiness Fit</h2>
              <Link to="/readiness" className="card-link">Details <ArrowRight size={14} style={{ marginLeft: '4px' }} /></Link>
            </div>
            <div className="role-fit-container">
              {roleFits.slice(0, 2).map(fit => (
                <div key={fit.id} className={`role-fit-card ${fit.active ? 'active' : ''}`}>
                  <div className="rf-header">
                    <span className="rf-title">{fit.title}</span>
                    <span className="rf-match">{fit.fitPercentage}% Fit</span>
                  </div>
                  <div className="rf-bar"><div className="rf-fill" style={{ width: `${fit.fitPercentage}%`, background: fit.color }}></div></div>
                  <p className="rf-desc">{fit.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title"><ClipboardCheck size={18} style={{ marginRight: '8px' }} /> Top Skill Deficits & High-Impact Gaps</h2>
              <Link to="/readiness" className="card-link">View All Deficits <ArrowRight size={14} style={{ marginLeft: '4px' }} /></Link>
            </div>
            <div className="gaps-list">
              {topDeficit ? (
                <div className="gap-item">
                  <div className="gap-info">
                    <div className={`gap-badge ${topDeficit.priorityClass}`}>{topDeficit.priorityText}</div>
                    <div>
                      <h4 className="gap-title">{topDeficit.name}</h4>
                      <p className="gap-desc">
                        Current Score: {topDeficit.score}% • Target: {topDeficit.target}% • <strong>Gap: {topDeficit.gapDisplay}</strong>
                      </p>
                    </div>
                  </div>
                  <Link to="/modules" className="btn btn-outline btn-sm"><PlayCircle size={14} style={{ marginRight: '4px' }} /> Fix Deficit</Link>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No skill deficits recorded yet. Update your scores in <Link to="/readiness" style={{ color: 'var(--primary)', fontWeight: 600 }}>Readiness Intelligence</Link>.
                </div>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title"><Columns3 size={18} style={{ marginRight: '8px' }} /> Application Pipeline</h2>
              <Link to="/opportunities" className="card-link">View All Drives <ArrowRight size={14} style={{ marginLeft: '4px' }} /></Link>
            </div>
            <div className="tracker-board">
              <div className="tracker-col">
                <div className="tracker-col-header" style={{ color: '#6B7280' }}>Applied <span className="tracker-count">{appliedOpps.length}</span></div>
                {appliedOpps.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px 0' }}>No drives applied yet</div>
                ) : (
                  appliedOpps.slice(0, 2).map(opp => (
                    <div className="tracker-card" key={opp.id}>
                      <img src={opp.logoUrl || opp.fallbackLogo} className="tc-logo" alt={opp.company} onError={(e) => { e.target.src = opp.fallbackLogo; }} />
                      <div><p className="tc-company">{opp.company}</p><p className="tc-role">{opp.role}</p></div>
                    </div>
                  ))
                )}
              </div>
              <div className="tracker-col">
                <div className="tracker-col-header" style={{ color: '#F59E0B' }}>Shortlisted <span className="tracker-count">{shortlistedOpps.length}</span></div>
                {shortlistedOpps.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '12px 0' }}>No shortlisted drives yet</div>
                ) : (
                  shortlistedOpps.slice(0, 2).map(opp => (
                    <div className="tracker-card highlight" key={opp.id}>
                      <img src={opp.logoUrl || opp.fallbackLogo} className="tc-logo" alt={opp.company} onError={(e) => { e.target.src = opp.fallbackLogo; }} />
                      <div><p className="tc-company">{opp.company}</p><p className="tc-role">{opp.role}</p></div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="col-right">
          <section className="card resume-score-card">
            <div className="card-header">
              <h2 className="card-title"><FileText size={18} style={{ marginRight: '8px' }} /> Resume Score</h2>
              <Link to="/resume" className="card-link">Open Builder <ArrowRight size={14} style={{ marginLeft: '4px' }} /></Link>
            </div>
            <div className="resume-score-body">
              <div className="score-ring-wrap">
                <svg viewBox="0 0 100 100" className="score-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#EEF2FF" strokeWidth="9"/>
                  <circle 
                    cx="50" cy="50" r="42" fill="none" stroke="url(#scoreGrad)" strokeWidth="9" 
                    strokeDasharray="263.9" strokeDashoffset={263.9 - (resumeScore / 100) * 263.9} 
                    strokeLinecap="round" transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563EB"/>
                      <stop offset="100%" stopColor="#7C3AED"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-center"><span className="score-val">{resumeScore > 0 ? resumeScore : '—'}</span><span className="score-max">{resumeScore > 0 ? '/100' : ''}</span></div>
              </div>
              <div className="score-meta">
                <p className="score-label">Resume Completeness</p>
                <span className={`score-status ${resumeScore >= 70 ? 'success-badge' : 'warn-badge'}`}>
                  {resumeScore === 0 ? 'No resume data yet' : resumeScore >= 70 ? 'Complete' : 'Incomplete — Add details in Resume Maker'}
                </span>
              </div>
            </div>
            <div className="resume-actions">
              <Link to="/resume" className="btn btn-primary btn-full"><Edit3 size={14} style={{ marginRight: '6px' }} /> Open Resume Maker Page</Link>
            </div>
          </section>


          <section className="card">
            <div className="card-header">
              <h2 className="card-title"><Video size={18} style={{ marginRight: '8px' }} /> Scheduled Interviews</h2>
              <Link to="/interviews" className="card-link">View All <ArrowRight size={14} style={{ marginLeft: '4px' }} /></Link>
            </div>
            {todayInterview ? (
              <div className="interview-timeline">
                <div className="interview-item today">
                  <div className="it-date-col"><span className="it-day">{todayInterview.day}</span><span className="it-time">{todayInterview.time}</span></div>
                  <div className="it-connector"><div className="it-dot pulse"></div></div>
                  <div className="it-card">
                    <div className="it-card-top">
                      <img src={todayInterview.logoUrl || todayInterview.fallbackLogo} alt={todayInterview.company} onError={(e) => { e.target.src = todayInterview.fallbackLogo; }} className="it-logo"/>
                      <div><p className="it-company">{todayInterview.company}</p><p className="it-role">{todayInterview.role}</p></div>
                      <span className={`status-badge ${todayInterview.statusBadgeClass}`}>{todayInterview.statusBadge}</span>
                    </div>
                    <div className="it-actions" style={{ marginTop: '6px' }}>
                      <button className="btn btn-primary btn-sm"><Video size={14} style={{ marginRight: '4px' }} /> Join Call</button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No interviews scheduled for today.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default MainDashboard;

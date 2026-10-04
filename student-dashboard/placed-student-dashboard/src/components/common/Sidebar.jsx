'use client';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Award, ClipboardCheck, TrendingUp, MonitorPlay, FileText, Briefcase, Video, User, LogOut, PanelLeftClose, PanelLeftOpen, Users, BookOpen, ArrowLeft } from 'lucide-react';
import { NavLink } from '../../utils/navigation';
import { studentService } from '../../services/studentService';
import { readinessService } from '../../services/readinessService';
import { classService } from '../../services/classService';
import { studyModuleService } from '../../services/studyModuleService';
import { opportunityService } from '../../services/opportunityService';
import { interviewService } from '../../services/interviewService';
import { atsService } from '../../services/atsService';
import { supabase } from '../../lib/supabaseClient';
import { handleAppLogout } from '../../utils/authUtils';

const Sidebar = ({ collapsed, setCollapsed, mobileSidebarOpen, onMobileClose }) => {
  const [student, setStudent] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [counts, setCounts] = useState({
    classes: 0,
    modules: 0,
    opportunities: 0,
    interviews: 0,
    atsScore: null
  });

  const handleLogout = () => {
    if (onMobileClose) onMobileClose();
    handleAppLogout();
  };

  const loadData = async () => {
    studentService.getStudentProfile().then(setStudent);
    readinessService.getReadinessMetrics().then(setMetrics);
    
    Promise.all([
      classService.getClasses(),
      studyModuleService.getStudyModules(),
      opportunityService.getOpportunities(),
      interviewService.getInterviews(),
      atsService.getRecentAnalysis()
    ]).then(([cls, mods, opps, ints, ats]) => {
      setCounts({
        classes: cls.length,
        modules: mods.length,
        opportunities: opps.length,
        interviews: ints.length,
        atsScore: ats?.score ?? null
      });
    });
  };

  useEffect(() => {
    loadData();

    // Supabase Realtime Channels to reactively update counts & student state
    const channel = supabase
      .channel('sidebar_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_skills' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_opportunities' }, loadData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_interviews' }, loadData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink 
          to="/" 
          className="logo-wrap" 
          onClick={(e) => {
            if (collapsed) {
              e.preventDefault();
              setCollapsed(false);
            } else if (onMobileClose) {
              onMobileClose();
            }
          }}
          title={collapsed ? "Expand sidebar" : "PLACED"}
        >
          <div className="sidebar-logo-container">
            <img 
              src="/placeduplogo.jpg" 
              alt="Placed Logo" 
              loading="eager"
              className="sidebar-logo-fixed"
            />
          </div>
          <div className="sidebar-student-info">
            <span className="sidebar-student-name">
              {student?.name || "Student Profile"}
            </span>
            <div className="sidebar-student-status">
              <span className="status-dot"></span>
              <span className="status-text">
                {student?.degree ? student.degree.slice(0, 15) : 'Student'} | {student?.batchYear ? `Batch '${student.batchYear.slice(-2)}` : 'Active'}
              </span>
            </div>
          </div>
        </NavLink>
        <button 
          className="sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-section-label">Core Track</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/" title={collapsed ? "Dashboard" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><LayoutDashboard size={18} /></span>
              <span className="nav-label">Dashboard</span>
              <span className="nav-badge active-dot"></span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/readiness" title={collapsed ? "Career Readiness" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Award size={18} /></span>
              <span className="nav-label">Career Readiness</span>
              {metrics?.hasRecordedSkills ? (
                <span className="nav-count new">{metrics.overallScore}%</span>
              ) : (
                <span className="nav-count">—</span>
              )}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/assessments" title={collapsed ? "Assessments" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><ClipboardCheck size={18} /></span>
              <span className="nav-label">Assessments</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/improvement" title={collapsed ? "Improvement Path" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><TrendingUp size={18} /></span>
              <span className="nav-label">Improvement Path</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/simulations" title={collapsed ? "Practice & Simulations" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><MonitorPlay size={18} /></span>
              <span className="nav-label">Practice & Simulations</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/classes" title={collapsed ? "Classes" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Users size={18} /></span>
              <span className="nav-label">Classes</span>
              {counts.classes > 0 && <span className="nav-count new">{counts.classes}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/modules" title={collapsed ? "Study Modules" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><BookOpen size={18} /></span>
              <span className="nav-label">Study Modules</span>
              {counts.modules > 0 && <span className="nav-count">{counts.modules}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Tools & Drives</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/resume" title={collapsed ? "Resume Maker & Analyzer" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><FileText size={18} /></span>
              <span className="nav-label">Resume Maker & Analyzer</span>
              {counts.atsScore !== null && <span className="nav-count new">ATS {counts.atsScore}%</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/opportunities" title={collapsed ? "Opportunities / Drives" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Briefcase size={18} /></span>
              <span className="nav-label">Opportunities / Drives</span>
              {counts.opportunities > 0 && <span className="nav-count">{counts.opportunities}</span>}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/interviews" title={collapsed ? "Interviews" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><Video size={18} /></span>
              <span className="nav-label">Interviews</span>
              {counts.interviews > 0 && <span className="nav-count new">{counts.interviews}</span>}
            </NavLink>
          </li>
        </ul>

        <p className="nav-section-label">Account</p>
        <ul>
          <li className="nav-item">
            <NavLink to="/profile" title={collapsed ? "Profile & Settings" : undefined} className={({ isActive }) => (isActive ? 'active' : '')} onClick={onMobileClose}>
              <span className="nav-icon"><User size={18} /></span>
              <span className="nav-label">Profile & Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="placement-badge-mini">
          <Award size={14} />
          <span>Readiness: {metrics?.hasRecordedSkills ? `${metrics.overallScore}/100` : '— / 100'}</span>
        </div>
        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
          aria-label="Log Out"
          title={collapsed ? "Log Out" : undefined}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
        <a 
          href="/" 
          className="main-site-btn" 
          title={collapsed ? "Main Site" : undefined}
          onClick={onMobileClose}
        >
          <ArrowLeft size={16} />
          <span>Main Site</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;


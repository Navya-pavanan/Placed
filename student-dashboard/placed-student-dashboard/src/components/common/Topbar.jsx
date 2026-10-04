'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Settings, X, ArrowRight, LayoutDashboard, Award, ClipboardCheck, TrendingUp, MonitorPlay, Users, BookOpen, FileText, Briefcase, Video, User, Menu, LogOut } from 'lucide-react';
import { useNavigate } from '../../utils/navigation';
import { studentService } from '../../services/studentService';
import { opportunityService } from '../../services/opportunityService';
import { classService } from '../../services/classService';
import { studyModuleService } from '../../services/studyModuleService';
import { handleAppLogout } from '../../utils/authUtils';

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchData, setSearchData] = useState({
    opportunities: [],
    classes: [],
    modules: []
  });
  const inputRef = useRef(null);
  const searchWrapRef = useRef(null);

  // Static searchable pages index
  const PAGES = [
    { title: 'Dashboard Overview', path: '/', icon: <LayoutDashboard size={14} />, cat: 'Page' },
    { title: 'Career Readiness Intelligence', path: '/readiness', icon: <Award size={14} />, cat: 'Page' },
    { title: 'Assessments & Diagnostic Tests', path: '/assessments', icon: <ClipboardCheck size={14} />, cat: 'Page' },
    { title: 'Personalized Improvement Path', path: '/improvement', icon: <TrendingUp size={14} />, cat: 'Page' },
    { title: 'Practice & Recruitment Simulations', path: '/simulations', icon: <MonitorPlay size={14} />, cat: 'Page' },
    { title: 'Placement Video Classes Library', path: '/classes', icon: <Users size={14} />, cat: 'Page' },
    { title: 'Structured Study Modules', path: '/modules', icon: <BookOpen size={14} />, cat: 'Page' },
    { title: 'Resume Maker & ATS Analyzer', path: '/resume', icon: <FileText size={14} />, cat: 'Page' },
    { title: 'Job Opportunities & Campus Drives', path: '/opportunities', icon: <Briefcase size={14} />, cat: 'Page' },
    { title: 'Scheduled Corporate Interviews', path: '/interviews', icon: <Video size={14} />, cat: 'Page' },
    { title: 'Profile & Account Settings', path: '/profile', icon: <User size={14} />, cat: 'Page' },
  ];

  useEffect(() => {
    studentService.getStudentProfile().then(setStudent);
    
    // Load search data from services
    Promise.all([
      opportunityService.getOpportunities(),
      classService.getClasses(),
      studyModuleService.getStudyModules()
    ]).then(([opps, cls, mods]) => {
      setSearchData({ opportunities: opps, classes: cls, modules: mods });
    });
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanQuery = query.trim().toLowerCase();

  // Search filtering logic
  const filteredPages = cleanQuery 
    ? PAGES.filter(p => p.title.toLowerCase().includes(cleanQuery)) 
    : [];

  const filteredOpps = cleanQuery 
    ? searchData.opportunities.filter(o => 
        o.company.toLowerCase().includes(cleanQuery) || 
        o.role.toLowerCase().includes(cleanQuery)
      ) 
    : [];

  const filteredClasses = cleanQuery 
    ? searchData.classes.filter(c => 
        c.title.toLowerCase().includes(cleanQuery) || 
        c.topic.toLowerCase().includes(cleanQuery) ||
        c.subjectName.toLowerCase().includes(cleanQuery)
      ) 
    : [];

  const filteredModules = cleanQuery 
    ? searchData.modules.filter(m => 
        m.title.toLowerCase().includes(cleanQuery) || 
        m.subject.toLowerCase().includes(cleanQuery)
      ) 
    : [];

  const hasResults = filteredPages.length > 0 || filteredOpps.length > 0 || filteredClasses.length > 0 || filteredModules.length > 0;

  const handleSelectResult = (path) => {
    navigate(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger button — visible only on mobile via CSS */}
        <button
          className="topbar-menu-btn mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <div className="search-wrap" ref={searchWrapRef} style={{ position: 'relative' }}>
          <Search size={16} className="search-icon" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search pages, assessments, drives, classes..." 
            className="search-input global-search" 
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
          />
          {query ? (
            <button 
              onClick={() => { setQuery(''); setIsOpen(false); }} 
              style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          ) : null}

          {/* Functional Search Overlay */}
          {isOpen && cleanQuery !== '' && (
            <div 
              className="search-results-dropdown"
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1',
                borderRadius: '12px', boxShadow: '0 20px 40px -4px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                maxHeight: '380px', overflowY: 'auto', zIndex: 99999, padding: '12px 8px'
              }}
            >
              {!hasResults ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>
                  No matching results found for "<strong style={{ color: '#0F172A' }}>{query}</strong>"
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Pages Section */}
                  {filteredPages.length > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', padding: '4px 8px', display: 'block' }}>Pages</span>
                      {filteredPages.map(page => (
                        <div 
                          key={page.path}
                          onClick={() => handleSelectResult(page.path)}
                          style={{ padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s ease' }}
                          className="search-item-hover"
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                            {page.icon} {page.title}
                          </span>
                          <ArrowRight size={12} style={{ color: '#94A3B8' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Opportunities Section */}
                  {filteredOpps.length > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', padding: '4px 8px', display: 'block' }}>Campus Drives</span>
                      {filteredOpps.map(opp => (
                        <div 
                          key={opp.id}
                          onClick={() => handleSelectResult('/opportunities')}
                          style={{ padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          className="search-item-hover"
                        >
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{opp.company} — {opp.role}</p>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{opp.location} • {opp.compensation}</span>
                          </div>
                          <span className="tag green" style={{ fontSize: '10px' }}>{opp.matchPercentage}% match</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Classes Section */}
                  {filteredClasses.length > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', padding: '4px 8px', display: 'block' }}>Video Classes</span>
                      {filteredClasses.map(cls => (
                        <div 
                          key={cls.id}
                          onClick={() => handleSelectResult(`/classes?classId=${cls.id}`)}
                          style={{ padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          className="search-item-hover"
                        >
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{cls.title}</p>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{cls.subjectName} • {cls.duration}</span>
                          </div>
                          <Users size={12} style={{ color: '#2563EB' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Study Modules Section */}
                  {filteredModules.length > 0 && (
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', padding: '4px 8px', display: 'block' }}>Study Modules</span>
                      {filteredModules.map(mod => (
                        <div 
                          key={mod.id}
                          onClick={() => handleSelectResult('/modules')}
                          style={{ padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                          className="search-item-hover"
                        >
                          <div>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{mod.title}</p>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{mod.subject}</span>
                          </div>
                          <BookOpen size={12} style={{ color: '#2563EB' }} />
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button className="icon-btn tooltip" data-tooltip={searchData.opportunities.length + searchData.classes.length > 0 ? "Notifications" : "No Notifications"} onClick={() => navigate('/opportunities')}>
          <Bell size={20} />
          {searchData.opportunities.length > 0 && (
            <span className="notif-badge">{searchData.opportunities.length}</span>
          )}
        </button>
        <button className="icon-btn tooltip" data-tooltip="Settings" onClick={() => navigate('/profile')}>
          <Settings size={20} />
        </button>
        <div className="topbar-divider"></div>
        <div className="topbar-profile" id="profileDropdownTrigger" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <img src={student?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Student&backgroundColor=b6e3f4"} alt={student?.name || "Student"} className="topbar-avatar" />
          <div className="topbar-profile-info topbar-profile-info--desktop">
            <span className="topbar-name">{student?.name || "Student Profile"}</span>
            <span className="topbar-role">{student?.batchYear ? `Batch '${student.batchYear.slice(-2)}` : "Student"}</span>
          </div>
        </div>
        <button 
          className="topbar-logout-btn" 
          onClick={handleAppLogout} 
          aria-label="Log Out" 
          title="Log Out"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>

    </header>
  );
};

export default Topbar;

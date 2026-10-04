'use client';
import React, { useState, useEffect } from 'react';
import { Users, Play, Clock, User, Calculator, Terminal, MessageSquare, Brain, Search, X, CheckCircle } from 'lucide-react';
import { useSearchParams } from '../../utils/navigation';
import { classService } from '../../services/classService';

const ClassesModule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState(null);

  const [classes, setClasses] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    classService.getClasses().then(setClasses);
    classService.getSubjectCategories().then(setCategories);
  }, []);

  // Auto-open video if class parameter is present in URL
  useEffect(() => {
    const classIdParam = searchParams.get('classId');
    if (classIdParam && classes.length > 0) {
      const matchedClass = classes.find(c => c.id === classIdParam);
      if (matchedClass) {
        setActiveVideoModal(matchedClass);
      }
    }
  }, [searchParams, classes]);

  // Icon helper
  const getSubjectIcon = (id) => {
    switch (id) {
      case 'quant': return <Calculator size={16} />;
      case 'tech': return <Terminal size={16} />;
      case 'english': return <MessageSquare size={16} />;
      case 'reasoning': return <Brain size={16} />;
      default: return <Tv size={16} />;
    }
  };

  // Filter logic
  const filteredClasses = classes.filter(cls => {
    const matchesCategory = activeCategory === 'all' || cls.subjectId === activeCategory;
    const matchesTopic = selectedTopic === 'all' || cls.topic === selectedTopic;
    const matchesSearch = searchQuery === '' || 
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cls.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesTopic && matchesSearch;
  });

  // Unique topics for current category
  const availableTopics = Array.from(new Set(
    classes
      .filter(cls => activeCategory === 'all' || cls.subjectId === activeCategory)
      .map(cls => cls.topic)
  ));

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSelectedTopic('all');
  };

  return (
    <main className="dashboard-content">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <Users size={24} style={{ marginRight: '10px' }} /> Placement Video Classes Library
          </h1>
          <p className="view-sub">Video lectures organized by placement subjects and key skill topics.</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="class-category-tabs" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button 
          className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleCategoryChange('all')}
        >
          All Placement Subjects
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleCategoryChange(cat.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {getSubjectIcon(cat.id)}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Topic Filters */}
      <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', color: '#64748B', pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="text"
              className="classes-search-input"
              placeholder="Search classes, topics, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Showing {filteredClasses.length} class video{filteredClasses.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Topic Pills */}
        {availableTopics.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>Topics:</span>
            <button 
              className={`skill-chip ${selectedTopic === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedTopic('all')}
              style={{ cursor: 'pointer', background: selectedTopic === 'all' ? 'var(--primary)' : 'var(--bg-card)', color: selectedTopic === 'all' ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}
            >
              All Topics
            </button>
            {availableTopics.map(topic => (
              <button 
                key={topic}
                className={`skill-chip ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
                style={{ cursor: 'pointer', background: selectedTopic === topic ? 'var(--primary)' : 'var(--bg-card)', color: selectedTopic === topic ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Class Cards Grid */}
      <div className="job-cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredClasses.map(cls => (
          <div className="job-card" key={cls.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Thumbnail Header */}
            <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', background: '#1e293b' }}>
              <img src={cls.thumbnail} alt={cls.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', padding: '12px' }}>
                <span className="sim-badge" style={{ background: 'rgba(37,99,235,0.9)', color: '#fff', fontSize: '11px' }}>
                  {cls.topic}
                </span>
              </div>
              <button 
                onClick={() => setActiveVideoModal(cls)}
                style={{ 
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                  width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(37,99,235,0.9)', 
                  color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', transition: 'transform 0.2s ease'
                }}
                className="play-hover-btn"
                title="Play Video"
              >
                <Play size={20} style={{ marginLeft: '3px' }} />
              </button>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                {cls.subjectName}
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.3 }}>
                {cls.title}
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {cls.description}
              </p>

              {/* Meta & Button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {cls.duration}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {cls.instructor}
                  </span>
                </div>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setActiveVideoModal(cls)}
                >
                  <Play size={12} style={{ marginRight: '4px' }} /> Access Class
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div 
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999, 
            background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}
          onClick={() => { setActiveVideoModal(null); setSearchParams({}); }}
        >
          <div 
            className="card" 
            style={{ width: '100%', maxWidth: '760px', background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="sim-badge" style={{ marginBottom: '4px', display: 'inline-block' }}>{activeVideoModal.subjectName} • {activeVideoModal.topic}</span>
                <h3 className="card-title" style={{ fontSize: '16px' }}>{activeVideoModal.title}</h3>
              </div>
              <button 
                onClick={() => { setActiveVideoModal(null); setSearchParams({}); }} 
                className="btn btn-ghost" 
                style={{ padding: '6px', borderRadius: '50%' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player Container */}
            <div style={{ width: '100%', height: '380px', background: '#090d16', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(37,99,235,0.2)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '16px' }}>
                <Play size={36} style={{ marginLeft: '4px' }} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Class Video Player Placeholder</h4>
              <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', maxWidth: '480px', padding: '0 16px' }}>
                Mock streaming player for <strong>"{activeVideoModal.title}"</strong> ({activeVideoModal.duration}).
              </p>
              <div style={{ marginTop: '16px', padding: '6px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', fontSize: '12px', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} style={{ color: '#22c55e' }} /> Ready for backend video source URL connection
              </div>
            </div>

            {/* Video Footer Details */}
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Instructor: <strong>{activeVideoModal.instructor}</strong></p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Duration: {activeVideoModal.duration}</p>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => { setActiveVideoModal(null); setSearchParams({}); }}>
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ClassesModule;

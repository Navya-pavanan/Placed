import React, { useState, useEffect } from 'react';
import { Award, RotateCw, BarChart2, TrendingUp, Target, AlertTriangle, Calculator, Brain, MessageSquare, Terminal, PlayCircle, CheckCircle, Edit2 } from 'lucide-react';
import { readinessService } from '../../services/readinessService';

const ReadinessRingGauge = ({ score, activeTier, percentile }) => {
  const circumference = 2 * Math.PI * 50;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    setTimeout(() => {
      setOffset(circumference - (score / 100) * circumference);
    }, 100);
  }, [score, circumference]);

  useEffect(() => {
    if (score !== null) {
      setTimeout(() => {
        setOffset(circumference - (score / 100) * circumference);
      }, 100);
    }
  }, [score, circumference]);

  return (
    <div className="readiness-snapshot-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div className="placement-ring" style={{ width: '160px', height: '160px', position: 'relative' }}>
        <svg viewBox="0 0 120 120" className="ring-svg" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" strokeWidth="12" />
          <circle 
            cx="60" cy="60" r="50" fill="none" 
            stroke={activeTier?.color || 'var(--primary)'} strokeWidth="12" strokeDasharray={circumference} 
            strokeDashoffset={score !== null ? offset : circumference} strokeLinecap="round" transform="rotate(-90 60 60)" 
            className="ring-progress" style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.3s ease' }} 
          />
        </svg>
        <div className="ring-center" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="ring-pct" style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{score !== null ? score : '—'}</span>
          <span className="ring-lbl" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>Score / 100</span>
        </div>
      </div>
      <div className="readiness-tier" style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, background: activeTier?.bg || '#F1F5F9', color: activeTier?.color || '#64748B' }}>
        {activeTier?.label || 'Not Audited Yet'}
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0, textAlign: 'center' }}>Batch Percentile: <strong>{percentile}</strong></p>
    </div>
  );
};


const SkillWeaknessRadar = ({ data }) => {
  const size = 220;
  const center = size / 2;
  const radius = 80;
  const numAxes = data.length;
  if (numAxes === 0) return null;
  const angleStep = (Math.PI * 2) / numAxes;

  const renderGrids = () => {
    let grids = [];
    for (let level = 1; level <= 5; level++) {
      let r = (radius / 5) * level;
      let points = '';
      for (let i = 0; i < numAxes; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        points += `${x},${y} `;
      }
      grids.push(<polygon key={`grid-${level}`} points={points.trim()} fill="none" stroke="#E5E7EB" strokeWidth="1" />);
    }
    return grids;
  };

  const renderAxesAndLabels = () => {
    return data.map((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      const labelRadius = radius + 20;
      const lx = center + labelRadius * Math.cos(angle);
      const ly = center + labelRadius * Math.sin(angle) + 4;
      
      let textAnchor = 'middle';
      if (Math.cos(angle) > 0.1) textAnchor = 'start';
      if (Math.cos(angle) < -0.1) textAnchor = 'end';
      
      const shortName = item.name.split(' ')[0];

      return (
        <g key={`axis-${i}`}>
          <line x1={center} y1={center} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />
          <text x={lx} y={ly} textAnchor={textAnchor} fill="#6B7280" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">{shortName}</text>
        </g>
      );
    });
  };

  const renderDataPolygon = () => {
    let points = '';
    data.forEach((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (item.score / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points += `${x},${y} `;
    });
    return <polygon points={points.trim()} fill="rgba(37,99,235,0.2)" stroke="#2563EB" strokeWidth="2" />;
  };

  const renderDataDots = () => {
    return data.map((item, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (item.score / 100) * radius;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return <circle key={`dot-${i}`} cx={x} cy={y} r="4" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1.5" />;
    });
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {renderGrids()}
      {renderAxesAndLabels()}
      {renderDataPolygon()}
      {renderDataDots()}
    </svg>
  );
};

const SkillGapDeficitCards = ({ gaps }) => {
  if (!gaps || gaps.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No skill deficits recorded yet. Update your skill scores to see high-impact gap analysis.
      </div>
    );
  }

  return (
    <div className="gaps-list">
      {gaps.map((skill, index) => {
        return (
          <div className="gap-item" key={index}>
            <div className="gap-info">
              <div className={`gap-badge ${skill.priorityClass}`}>{skill.priorityText}</div>
              <div>
                <h4 className="gap-title">{skill.name}</h4>
                <p className="gap-desc">Current: {skill.score}% • Target: {skill.target}% • <strong>Gap: {skill.gapDisplay}</strong></p>
              </div>
            </div>
            {skill.gap < 0 ? (
              <a href="/modules" className="btn btn-outline btn-sm"><PlayCircle size={14} style={{ marginRight: '4px' }} /> Fix Gap</a>
            ) : (
              <CheckCircle size={18} style={{ color: '#22C55E' }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const ReadinessDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [skillScores, setSkillScores] = useState([]);
  const [skillGaps, setSkillGaps] = useState([]);
  const [roleFitList, setRoleFitList] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);

  const loadData = async () => {
    const m = await readinessService.getReadinessMetrics();
    const s = await readinessService.getSkillScores();
    const g = await readinessService.getSkillGaps();
    const r = await readinessService.getCorporateRoleFit();
    setMetrics(m);
    setSkillScores(s);
    setSkillGaps(g);
    setRoleFitList(r);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleScoreChange = async (skillName, newScore) => {
    await readinessService.updateSkillScore(skillName, newScore);
    await loadData();
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Calculator': return <Calculator size={18} />;
      case 'Brain': return <Brain size={18} />;
      case 'MessageSquare': return <MessageSquare size={18} />;
      case 'Terminal': return <Terminal size={18} />;
      default: return <Calculator size={18} />;
    }
  };

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title"><Award size={24} style={{ marginRight: '10px' }} /> Career Readiness Intelligence</h1>
          <p className="view-sub">Real-time assessment of placement preparedness, skill benchmarks, and role fitness derived from your active skill records.</p>
        </div>
        <button className="btn btn-primary" onClick={loadData}><RotateCw size={16} style={{ marginRight: '6px' }} /> Recalculate Metrics</button>
      </div>

      <div className="main-grid">
        <div className="col-left">
          <section className="card">
            <div className="card-header"><h2 className="card-title"><Award size={18} style={{ marginRight: '8px' }} /> Corporate Role Alignment & Fit Index</h2></div>
            <p style={{ padding: '0 20px 16px', fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Dynamically calculated match percentage for target career paths based on your real skill scores.</p>
            <div className="role-fit-container">
              {roleFitList.map((rf) => (
                <div className={`role-fit-card ${rf.active ? 'active' : ''}`} key={rf.id}>
                  <div className="rf-header"><span className="rf-title">{rf.title}</span><span className="rf-match">{rf.fitPercentage}% Match</span></div>
                  <div className="rf-bar"><div className="rf-fill" style={{ width: `${rf.fitPercentage}%`, background: rf.color }}></div></div>
                  <p className="rf-desc">{rf.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="card-header"><h2 className="card-title"><BarChart2 size={18} style={{ marginRight: '8px' }} /> Skill Category Diagnostics & Interactive Score Editor</h2></div>
            <p style={{ padding: '0 20px 12px', fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Adjust slider values to update your actual evaluated skill scores and see real-time readiness recalculation.</p>
            <div className="skill-performance-grid">
              {skillScores.map((skill, index) => (
                <div className="sp-card" key={index} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={`sp-icon ${skill.color}`}>{renderIcon(skill.iconName)}</div>
                    <div className="sp-details" style={{ flex: 1 }}>
                      <div className="sp-top">
                        <span className="sp-name">{skill.name}</span>
                        <span className="sp-score" style={{ fontWeight: 800 }}>{skill.score} / 100</span>
                      </div>
                      <div className="sp-bar">
                        <div className="sp-fill" style={{ width: `${skill.score}%`, background: skill.color === 'blue' ? '' : (skill.color === 'purple' ? '#7C3AED' : (skill.color === 'amber' ? '#F59E0B' : '#22C55E')) }}></div>
                      </div>
                      <span className="sp-sub">Target: {skill.target}% • {skill.score >= skill.target ? 'Met Target ✓' : `Deficit: ${skill.score - skill.target}%`}</span>
                    </div>
                  </div>

                  {/* Interactive Range Input */}
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Update Score:</span>
                    <input 
                      type="range" 
                      min="0" max="100" 
                      value={skill.score} 
                      onChange={(e) => handleScoreChange(skill.name, e.target.value)}
                      style={{ flex: 1, cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <input 
                      type="number" 
                      min="0" max="100" 
                      value={skill.score} 
                      onChange={(e) => handleScoreChange(skill.name, e.target.value)}
                      style={{ width: '50px', padding: '2px 6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-right">
          <section className="card">
            <div className="card-header"><h2 className="card-title"><TrendingUp size={18} style={{ marginRight: '8px' }} /> Readiness Snapshot</h2></div>
            {metrics && <ReadinessRingGauge score={metrics.overallScore} activeTier={metrics.tier} percentile={metrics.batchPercentile} />}
          </section>

          <section className="card">
            <div className="card-header"><h2 className="card-title"><Target size={18} style={{ marginRight: '8px' }} /> Skill Weakness Radar</h2></div>
            <div className="radar-chart-container" style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '240px' }}>
              <SkillWeaknessRadar data={skillScores} />
            </div>
          </section>

          <section className="card">
            <div className="card-header"><h2 className="card-title"><AlertTriangle size={18} style={{ marginRight: '8px' }} /> Skill Gap Deficits</h2></div>
            <SkillGapDeficitCards gaps={skillGaps} />
          </section>
        </div>
      </div>
    </main>
  );
};

export default ReadinessDashboard;

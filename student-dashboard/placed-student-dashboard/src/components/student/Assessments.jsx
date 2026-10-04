import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Lock,
  CheckCircle2,
  PlayCircle,
  Award,
  FileText,
  RotateCcw,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Terminal,
  FileQuestion,
  Sparkles
} from 'lucide-react';
import GenericTestUI from './simulation/GenericTestUI';
import CodingRoundUI from './simulation/CodingRoundUI';
import HRInterviewUI from './simulation/HRInterviewUI';
import TestResultUI from './simulation/TestResultUI';
import MockTestRunnerUI from './simulation/MockTestRunnerUI';
import { assessmentService } from '../../services/assessmentService';
import './AssessmentTest.css';

/*
  ASSESSMENTS:
  1. Scheduled Official Assessments (created by Admin) with strict time-window locking.
  2. Sequential 4-Stage Diagnostic Benchmark Pipeline.
*/

const STAGES = [
  {
    id: 1,
    key: 'aptitude',
    title: 'Aptitude Test',
    description: 'Standardized evaluation of quantitative aptitude, logical reasoning, and verbal ability.',
    duration: '30 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 30,
    questionCount: 30,
  },
  {
    id: 2,
    key: 'technical',
    title: 'Technical Assessment',
    description: 'Core computer science assessment covering DBMS, data structures, and programming fundamentals.',
    duration: '40 Minutes',
    questions: '30 Questions',
    timeLimitMinutes: 40,
    questionCount: 30,
  },
  {
    id: 3,
    key: 'coding',
    title: 'Coding Round',
    description: 'Timed live coding challenge testing algorithmic problem-solving and clean code execution.',
    duration: '60 Minutes',
    questions: '4 Coding Problems',
    timeLimitMinutes: 60,
    questionCount: 4,
  },
  {
    id: 4,
    key: 'hr',
    title: 'HR Interview',
    description: 'Comprehensive behavioral and situational interview evaluating communication and culture fit.',
    duration: '20 Minutes',
    questions: '5 Questions',
    timeLimitMinutes: 20,
    questionCount: 5,
  }
];

const Assessments = () => {
  const [view, setView] = useState('overview'); // 'overview' | 'test-custom' | 'test-aptitude' | ... | 'final-report'
  const [scheduledAssessments, setScheduledAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);
  const [activeCustomAss, setActiveCustomAss] = useState(null);
  const [customResult, setCustomResult] = useState(null);

  // Completed stages for 4-stage track
  const [completedStages, setCompletedStages] = useState(() => {
    try {
      const saved = localStorage.getItem('placed_assessment_completed_stages');
      return saved ? Math.min(4, Math.max(0, parseInt(saved, 10) || 0)) : 0;
    } catch {
      return 0;
    }
  });

  const [stageResults, setStageResults] = useState(() => {
    try {
      const saved = localStorage.getItem('placed_assessment_results');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Fetch official scheduled assessments from Supabase
  const loadAssessments = async () => {
    try {
      setLoadingAssessments(true);
      const all = await assessmentService.getAssessments();
      // Filter strictly for Type === 'Assessment'
      const onlyAssessments = all.filter(a => a.assessmentType === 'Assessment');
      setScheduledAssessments(onlyAssessments);
    } catch (err) {
      console.error('Failed to load scheduled assessments:', err);
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const progressPercentage = Math.round((completedStages / 4) * 100);

  // ─── CUSTOM SCHEDULED ASSESSMENT LAUNCH ──────────────────
  const handleStartCustomAssessment = (ass) => {
    if (ass.isUpcoming) {
      alert(`This assessment is scheduled for ${ass.startDate ? new Date(ass.startDate).toLocaleString() : 'a future date'} and is currently locked.`);
      return;
    }
    if (ass.isExpired) {
      alert('This assessment has concluded.');
      return;
    }

    setActiveCustomAss(ass);
    setView('test-custom');
  };

  const handleCustomComplete = (results) => {
    setCustomResult(results);
    setView('result-custom');
  };

  // ─── STRICT STAGE ACCESS ENFORCEMENT ─────────────────────
  const handleStartStage = (stageId) => {
    if (stageId < 1 || stageId > 4) return;
    if (stageId > completedStages + 1) return;
    const stage = STAGES.find((s) => s.id === stageId);
    if (stage) setView(`test-${stage.key}`);
  };

  const handleStartAssessment = () => {
    if (completedStages === 0) {
      setView('test-aptitude');
    } else if (completedStages < 4) {
      handleStartStage(completedStages + 1);
    } else {
      setView('final-report');
    }
  };

  const handleStageComplete = (stageKey, results) => {
    const updated = { ...stageResults, [stageKey]: results };
    setStageResults(updated);
    try {
      localStorage.setItem('placed_assessment_results', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to cache assessment results:', e);
    }
    setView(`result-${stageKey}`);
  };

  const handleContinueFromResult = (stageKey) => {
    const stageIndex = STAGES.findIndex((s) => s.key === stageKey);
    const newCompleted = Math.max(completedStages, stageIndex + 1);
    setCompletedStages(newCompleted);

    try {
      localStorage.setItem('placed_assessment_completed_stages', String(newCompleted));
    } catch (e) {
      console.error('Failed to cache completed stages:', e);
    }

    if (newCompleted >= 4) {
      setView('final-report');
    } else {
      const nextStage = STAGES[newCompleted];
      setView(`test-${nextStage.key}`);
    }
  };

  const resetAssessment = () => {
    setCompletedStages(0);
    setStageResults({});
    try {
      localStorage.removeItem('placed_assessment_completed_stages');
      localStorage.removeItem('placed_assessment_results');
    } catch (e) {
      console.error('Failed to clear assessment cache:', e);
    }
    setView('overview');
  };

  // ─── RENDER ACTIVE CUSTOM ASSESSMENT ─────────────────────
  if (view === 'test-custom' && activeCustomAss) {
    const isMock = activeCustomAss.topic === 'Mock Test';
    const isCoding = activeCustomAss.topic === 'Coding Challenge';
    const duration = parseInt(activeCustomAss.duration, 10) || 60;

    if (isMock) {
      return (
        <MockTestRunnerUI
          assessment={activeCustomAss}
          onComplete={handleCustomComplete}
          onExit={() => { setActiveCustomAss(null); setView('overview'); }}
        />
      );
    }

    if (isCoding) {
      return (
        <main className="dashboard-content" style={{ padding: 0 }}>
          <CodingRoundUI
            title={activeCustomAss.title}
            durationMinutes={duration}
            customProblems={activeCustomAss.codingProblems?.length ? activeCustomAss.codingProblems : activeCustomAss.questions}
            onComplete={handleCustomComplete}
            onExit={() => { setActiveCustomAss(null); setView('overview'); }}
          />
        </main>
      );
    }

    return (
      <main className="dashboard-content">
        <GenericTestUI
          stage={activeCustomAss.topic?.toLowerCase().includes('comm') ? 'communication' : 'aptitude'}
          stageLabel={activeCustomAss.title}
          questionCount={activeCustomAss.questions?.length || 20}
          timeLimitMinutes={duration}
          customQuestions={activeCustomAss.questions}
          onComplete={handleCustomComplete}
          onExit={() => { setActiveCustomAss(null); setView('overview'); }}
        />
      </main>
    );
  }

  // ─── RENDER CUSTOM RESULT VIEW ───────────────────────────
  if (view === 'result-custom' && activeCustomAss && customResult) {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title={activeCustomAss.title}
          subtitle="Official Assessment Completed"
          continueLabel="Return to Assessments Overview"
          results={customResult}
          onContinue={() => { setActiveCustomAss(null); setCustomResult(null); setView('overview'); }}
          onRetake={() => handleStartCustomAssessment(activeCustomAss)}
        />
      </main>
    );
  }

  // ─── RENDER STANDARD TEST VIEWS ───────────────────────────
  if (view === 'test-aptitude') {
    return (
      <main className="dashboard-content">
        <GenericTestUI
          stage="aptitude"
          stageLabel="Stage 01: Aptitude Test"
          questionCount={30}
          timeLimitMinutes={30}
          onComplete={(r) => handleStageComplete('aptitude', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-technical') {
    if (completedStages < 1) {
      return (
        <main className="dashboard-content">
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={32} color="#B45309" style={{ marginBottom: '12px' }} />
            <h3>Stage 02 is Locked</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
              Please complete Stage 01 (Aptitude Test) before taking the Technical Assessment.
            </p>
            <button className="btn btn-primary" onClick={() => setView('overview')}>
              Return to Assessment Overview
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="dashboard-content">
        <GenericTestUI
          stage="technical"
          stageLabel="Stage 02: Technical Assessment"
          questionCount={30}
          timeLimitMinutes={40}
          onComplete={(r) => handleStageComplete('technical', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-coding') {
    if (completedStages < 2) {
      return (
        <main className="dashboard-content">
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={32} color="#B45309" style={{ marginBottom: '12px' }} />
            <h3>Stage 03 is Locked</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
              Please complete Stage 02 (Technical Assessment) before taking the Coding Round.
            </p>
            <button className="btn btn-primary" onClick={() => setView('overview')}>
              Return to Assessment Overview
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="dashboard-content" style={{ padding: 0 }}>
        <CodingRoundUI
          onComplete={(r) => handleStageComplete('coding', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  if (view === 'test-hr') {
    if (completedStages < 3) {
      return (
        <main className="dashboard-content">
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <AlertTriangle size={32} color="#B45309" style={{ marginBottom: '12px' }} />
            <h3>Stage 04 is Locked</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
              Please complete Stage 03 (Coding Round) before taking the HR Interview.
            </p>
            <button className="btn btn-primary" onClick={() => setView('overview')}>
              Return to Assessment Overview
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="dashboard-content">
        <HRInterviewUI
          onComplete={(r) => handleStageComplete('hr', r)}
          onExit={() => setView('overview')}
        />
      </main>
    );
  }

  // ─── RENDER STANDARD RESULT VIEWS ─────────────────────────
  if (view === 'result-aptitude') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Stage 01: Aptitude Test"
          subtitle="Stage 01 Completed"
          continueLabel="Continue to Stage 02 (Technical)"
          results={stageResults.aptitude}
          onContinue={() => handleContinueFromResult('aptitude')}
        />
      </main>
    );
  }

  if (view === 'result-technical') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Stage 02: Technical Assessment"
          subtitle="Stage 02 Completed"
          continueLabel="Continue to Stage 03 (Coding)"
          results={stageResults.technical}
          onContinue={() => handleContinueFromResult('technical')}
        />
      </main>
    );
  }

  if (view === 'result-coding') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Stage 03: Coding Round"
          subtitle="Stage 03 Completed"
          continueLabel="Continue to Stage 04 (HR Interview)"
          results={stageResults.coding}
          onContinue={() => handleContinueFromResult('coding')}
        />
      </main>
    );
  }

  if (view === 'result-hr') {
    return (
      <main className="dashboard-content">
        <TestResultUI
          title="Stage 04: HR Interview"
          subtitle="Stage 04 Completed"
          continueLabel="View Placement Readiness Report"
          results={stageResults.hr}
          onContinue={() => handleContinueFromResult('hr')}
        />
      </main>
    );
  }

  // ─── FINAL REPORT VIEW ────────────────────────────────────
  if (view === 'final-report') {
    const apt = stageResults.aptitude || {};
    const tech = stageResults.technical || {};
    const code = stageResults.coding || {};
    const hr = stageResults.hr || {};
    const overallPercentage = ((apt.percentage || 0) + (tech.percentage || 0) + (code.percentage || 0) + (hr.percentage || 0)) / 4;

    return (
      <main className="dashboard-content">
        <div className="test-wrapper">
          <div className="results-card">
            <div className="results-banner">
              <Award size={40} style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
                Assessment Completed
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Comprehensive Placement Readiness Report</h2>
              <div className="results-score-highlight">
                {overallPercentage.toFixed(0)}%
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>
                Overall Readiness
              </div>
            </div>

            <div className="results-stats-row">
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{apt.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Stage 01: Aptitude</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{tech.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Stage 02: Technical</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{code.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Stage 03: Coding</span>
              </div>
              <div className="result-stat-chip">
                <span className="result-stat-num" style={{ color: 'var(--primary)' }}>{hr.percentage?.toFixed(1) || 0}%</span>
                <span className="result-stat-lbl">Stage 04: HR Interview</span>
              </div>
            </div>

            <div className="review-section">
              <h3 className="review-section-title">Assessment Feedback & Next Steps</h3>

              <div className="review-item-card">
                <div className="review-item-header">
                  <span className="review-item-qnum" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={16} color="var(--success)" /> Strengths
                  </span>
                </div>
                <div className="review-answers-box" style={{ marginTop: '8px' }}>
                  {(apt.percentage || 0) >= 70 && <div className="review-answer-line">• Strong quantitative aptitude and logical reasoning.</div>}
                  {(tech.percentage || 0) >= 70 && <div className="review-answer-line">• Solid technical foundations and core computer science knowledge.</div>}
                  {(code.percentage || 0) >= 70 && <div className="review-answer-line">• Proficient problem-solving agility and coding accuracy.</div>}
                  {(hr.percentage || 0) >= 70 && <div className="review-answer-line">• Clear communication and professional interview presentation.</div>}
                  {overallPercentage < 70 && <div className="review-answer-line">• Successfully completed all 4 stages of the comprehensive assessment.</div>}
                </div>
              </div>

              <div className="review-item-card">
                <div className="review-item-header">
                  <span className="review-item-qnum" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} color="#B45309" /> Areas for Improvement
                  </span>
                </div>
                <div className="review-answers-box" style={{ marginTop: '8px' }}>
                  {(apt.percentage || 0) < 70 && <div className="review-answer-line">• Spend extra practice on quantitative speed and pattern reasoning.</div>}
                  {(tech.percentage || 0) < 70 && <div className="review-answer-line">• Revise DBMS normalization, SQL queries, and basic data structures.</div>}
                  {(code.percentage || 0) < 70 && <div className="review-answer-line">• Practice more LeetCode/HackerRank medium algorithmic problems.</div>}
                  {(hr.percentage || 0) < 70 && <div className="review-answer-line">• Structure answers using the STAR method for behavioral questions.</div>}
                  {overallPercentage >= 70 && <div className="review-answer-line">• Keep your skills sharp with regular practice sessions.</div>}
                </div>
              </div>

              <div className="review-explanation-box" style={{ marginTop: '16px' }}>
                <strong>Recommendation: </strong>
                {overallPercentage >= 80
                  ? 'Outstanding placement readiness! You meet the qualification benchmarks for top-tier campus recruitment drives.'
                  : overallPercentage >= 60
                    ? 'Good foundation! Target the specific weak areas highlighted above using the Practice & Simulations module.'
                    : 'Focus on strengthening fundamentals. Use the Study Modules and Practice & Simulations tests to build mastery.'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button className="btn btn-outline" onClick={resetAssessment}>
                <RotateCcw size={14} /> Reset & Retake Assessment
              </button>
              <button className="btn btn-primary" onClick={() => setView('overview')}>
                <FileText size={14} /> Return to Assessment Overview
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── OVERVIEW VIEW ────────────────────────────────────────
  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <ClipboardCheck size={24} style={{ marginRight: '10px' }} /> Scheduled Assessments & Evaluations
          </h1>
          <p className="view-sub">Official campus recruitment evaluations and scheduled benchmark assessments.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadAssessments}>
          <RotateCcw size={14} /> Refresh Assessments
        </button>
      </div>

      <div className="test-wrapper">
        {/* SECTION 1: OFFICIAL SCHEDULED ASSESSMENTS FROM ADMIN */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
                <Calendar size={18} color="var(--primary)" /> Scheduled Campus Assessments ({scheduledAssessments.length})
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
                Official tests unlocked strictly during the scheduled assessment window.
              </p>
            </div>
          </div>

          {loadingAssessments ? (
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              Loading scheduled assessments from Supabase...
            </div>
          ) : scheduledAssessments.length === 0 ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--surface-alt, #F8FAFC)', borderRadius: '12px', border: '1.5px dashed var(--border-light)' }}>
              <FileQuestion size={32} color="var(--text-muted)" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>No Scheduled Assessments Active</div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                When your administrator creates a scheduled assessment, it will appear here with its scheduled date and time window.
              </p>
            </div>
          ) : (
            <div className="simulations-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {scheduledAssessments.map((ass) => {
                const isCoding = ass.topic === 'Coding Challenge';
                const isUpcoming = ass.isUpcoming;
                const isExpired = ass.isExpired;
                const isLive = ass.isLive;

                let statusColor = { background: '#EFF6FF', color: '#1E40AF' };
                let badgeLabel = '🟢 Live Assessment';

                if (isUpcoming) {
                  statusColor = { background: '#FEF3C7', color: '#92400E' };
                  badgeLabel = ass.startDate ? `🔒 Opens ${new Date(ass.startDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}` : '🔒 Upcoming';
                } else if (isExpired) {
                  statusColor = { background: '#F1F5F9', color: '#64748B' };
                  badgeLabel = 'Concluded';
                }

                return (
                  <div
                    key={ass.id}
                    className={`sim-card ${isLive ? 'active' : ''}`}
                    style={{ opacity: isExpired ? 0.65 : 1, border: isLive ? '1.5px solid var(--primary)' : '1px solid var(--border-light)' }}
                  >
                    <div className="sim-header">
                      <span className="sim-badge" style={statusColor}>
                        {badgeLabel}
                      </span>
                      <span className="sim-time">
                        <Clock size={14} style={{ marginRight: '4px' }} /> {ass.duration || '60 mins'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '4px 0 8px' }}>
                      {isCoding ? (
                        <span style={{ fontSize: '11px', fontWeight: '700', background: '#F0FDF4', color: '#16A34A', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Terminal size={12} /> LeetCode IDE
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: '700', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={12} /> 4-Option MCQ
                        </span>
                      )}
                      <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)' }}>
                        • {ass.topic || 'Assessment'}
                      </span>
                    </div>

                    <h4 className="sim-title" style={{ fontSize: '16px' }}>{ass.title}</h4>
                    <p className="sim-sub">{ass.cleanDescription || 'Standardized campus assessment evaluating candidate competency.'}</p>

                    <div className="sim-footer" style={{ minHeight: '36px' }}>
                      <span className="sim-score">
                        {ass.questionCount}
                      </span>

                      {isLive ? (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartCustomAssessment(ass)}
                        >
                          Start Assessment <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      ) : isUpcoming ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled
                          style={{ opacity: 0.6, cursor: 'not-allowed', background: '#FEF3C7', borderColor: '#FDE68A', color: '#92400E' }}
                        >
                          <Lock size={13} style={{ marginRight: '4px' }} /> Locked
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled
                          style={{ opacity: 0.5, cursor: 'not-allowed' }}
                        >
                          Expired
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION 2: SEQUENTIAL 4-STAGE BENCHMARK PIPELINE */}
        <div className="instructions-card" style={{ marginTop: '20px' }}>
          <div className="instructions-header">
            <h2 className="instructions-title" style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
              <Sparkles size={22} color="var(--primary)" /> Campus Placement Assessment
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: '4px 0 0 0' }}>
              Complete the recruitment stages sequentially to unlock subsequent rounds and generate your Placement Readiness Report.            </p>
          </div>

          {completedStages > 0 && (
            <div className="instructions-meta-grid" style={{ marginTop: '0' }}>
              <div className="instructions-meta-box" style={{ background: '#EFF6FF', borderColor: '#BFDBFE' }}>
                <span className="instructions-meta-label">Assessment Progress</span>
                <span className="instructions-meta-value" style={{ color: 'var(--primary)' }}>{progressPercentage}% Completed</span>
              </div>
            </div>
          )}

          <div className="instructions-actions" style={{ display: 'flex', gap: '10px', marginTop: completedStages > 0 ? '12px' : '0' }}>
            {completedStages === 0 ? (
              <button className="btn btn-primary" onClick={handleStartAssessment}>
                Start Diagnostic Track <PlayCircle size={14} />
              </button>
            ) : completedStages < 4 ? (
              <>
                <button className="btn btn-primary" onClick={handleStartAssessment}>
                  Continue: Stage 0{completedStages + 1} ({STAGES[completedStages].title}) <ArrowRight size={14} />
                </button>
                <button className="btn btn-outline" onClick={resetAssessment}>
                  <RotateCcw size={14} /> Reset Track
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => setView('final-report')}>
                  <Award size={14} /> View Readiness Report
                </button>
                <button className="btn btn-outline" onClick={resetAssessment}>
                  <RotateCcw size={14} /> Reset Track
                </button>
              </>
            )}
          </div>
        </div>

        <div className="simulations-grid">
          {STAGES.map((stage) => {
            const isCompleted = completedStages >= stage.id;
            const isUnlocked = stage.id <= completedStages + 1;
            const isReady = stage.id === completedStages + 1;
            const isLocked = !isUnlocked;

            let badgeText = 'Locked';
            let statusColor = { background: '#F1F5F9', color: '#64748B' };

            if (isCompleted) {
              badgeText = 'Completed';
              statusColor = { background: '#DCFCE7', color: '#15803D' };
            } else if (isReady) {
              badgeText = 'Ready to Start';
              statusColor = { background: '#EFF6FF', color: '#1E40AF' };
            }

            return (
              <div
                className={`sim-card ${isReady ? 'active' : ''}`}
                key={stage.id}
                style={{ opacity: isLocked ? 0.6 : 1 }}
              >
                <div className="sim-header">
                  <span className="sim-badge" style={statusColor}>
                    Stage 0{stage.id} - {badgeText}
                  </span>
                  <span className="sim-time">
                    <Clock size={14} style={{ marginRight: '4px' }} /> {stage.duration}
                  </span>
                </div>
                <h4 className="sim-title">{stage.title}</h4>
                <p className="sim-sub">{stage.description}</p>

                <div className="sim-footer" style={{ minHeight: '30px' }}>
                  <span className="sim-score" style={isCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                    {isCompleted && stageResults[stage.key]
                      ? `Score: ${stageResults[stage.key].score} / ${stageResults[stage.key].total}`
                      : stage.questions}
                  </span>

                  {isCompleted ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled
                      style={{ opacity: 0.9, cursor: 'default', color: '#15803D', borderColor: '#BBF7D0', background: '#DCFCE7' }}
                    >
                      <CheckCircle size={13} style={{ marginRight: '4px' }} /> Completed
                    </button>
                  ) : isReady ? (
                    stage.id === 1 ? null : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStartStage(stage.id)}
                      >
                        Start Stage <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      disabled
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                    >
                      <Lock size={13} style={{ marginRight: '4px' }} /> Locked
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Assessments;

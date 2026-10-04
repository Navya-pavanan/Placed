import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Terminal, 
  FileText, 
  CheckCircle,
  Play
} from 'lucide-react';
import GenericTestUI from './simulation/GenericTestUI';
import CodingRoundUI from './simulation/CodingRoundUI';
import HRInterviewUI from './simulation/HRInterviewUI';
import TestResultUI from './simulation/TestResultUI';
import MockTestRunnerUI from './simulation/MockTestRunnerUI';
import { assessmentService } from '../../services/assessmentService';
import './AssessmentTest.css';

/*
  PRACTICE & SIMULATIONS:
  Individual practice tests & simulation modules.
  Students can take any test independently at any time (24/7 Unlimited Access).
  No sequential locking.
*/

const DEFAULT_PRACTICE_TESTS = [
  {
    id: 'p_aptitude',
    key: 'aptitude',
    title: 'Aptitude Practice Set',
    topic: 'Aptitude Test',
    description: 'Practice your quantitative aptitude, logical reasoning, and verbal ability with randomized practice sets.',
    duration: '30 mins',
    questionCount: '30 Questions',
    timeLimitMinutes: 30,
    isCoding: false
  },
  {
    id: 'p_technical',
    key: 'technical',
    title: 'Technical & CS Fundamentals',
    topic: 'Technical Assessment',
    description: 'Practice programming fundamentals, data structures, DBMS, and core computer science concepts.',
    duration: '40 mins',
    questionCount: '30 Questions',
    timeLimitMinutes: 40,
    isCoding: false
  },
  {
    id: 'p_coding',
    key: 'coding',
    title: 'LeetCode Algorithmic Coding',
    topic: 'Coding Challenge',
    description: 'Interactive IDE to solve programming problems in Python, Java, C, C++, or JavaScript with 5 automated test cases.',
    duration: '60 mins',
    questionCount: '4 Coding Problems',
    timeLimitMinutes: 60,
    isCoding: true
  },
  {
    id: 'p_hr',
    key: 'hr',
    title: 'HR Behavioral Interview',
    topic: 'Communication',
    description: 'Practice HR interview questions and evaluate your communication and interview presentation.',
    duration: '20 mins',
    questionCount: '5 Questions',
    timeLimitMinutes: 20,
    isCoding: false
  }
];

const Simulations = () => {
  const [activeTest, setActiveTest] = useState(null); // 'aptitude' | 'technical' | 'coding' | 'hr' | custom Object
  const [viewState, setViewState] = useState('overview'); // 'overview' | 'test' | 'result'
  const [customPracticeSets, setCustomPracticeSets] = useState([]);
  const [loadingCustom, setLoadingCustom] = useState(true);

  const [practiceResults, setPracticeResults] = useState(() => {
    try {
      const saved = localStorage.getItem('placed_practice_results');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const loadPracticeSets = async () => {
    try {
      setLoadingCustom(true);
      const all = await assessmentService.getAssessments();
      // Filter for Type === 'Practice/Simulation'
      const customSets = all.filter(a => a.assessmentType === 'Practice/Simulation');
      setCustomPracticeSets(customSets);
    } catch (err) {
      console.error('Failed to load practice simulations:', err);
    } finally {
      setLoadingCustom(false);
    }
  };

  useEffect(() => {
    loadPracticeSets();
  }, []);

  const handleStartTest = (testItem) => {
    setActiveTest(testItem);
    setViewState('test');
  };

  const handleTestComplete = (testKeyOrId, results) => {
    const updated = { ...practiceResults, [testKeyOrId]: results };
    setPracticeResults(updated);
    try {
      localStorage.setItem('placed_practice_results', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to cache practice result:', e);
    }
    setViewState('result');
  };

  const handleBackToOverview = () => {
    setActiveTest(null);
    setViewState('overview');
  };

  // ─── RENDER ACTIVE TEST VIEW ──────────────────────────────
  if (viewState === 'test' && activeTest) {
    // 1. Custom Practice Set created by Admin
    if (typeof activeTest === 'object' && (activeTest.questions || activeTest.sections || activeTest.codingProblems)) {
      const isMock = activeTest.topic === 'Mock Test';
      const isCoding = activeTest.topic === 'Coding Challenge';
      const duration = parseInt(activeTest.duration, 10) || 60;

      if (isMock) {
        return (
          <MockTestRunnerUI
            assessment={activeTest}
            onComplete={(r) => handleTestComplete(activeTest.id, r)}
            onExit={handleBackToOverview}
          />
        );
      }

      if (isCoding) {
        return (
          <main className="dashboard-content" style={{ padding: 0 }}>
            <CodingRoundUI
              title={activeTest.title}
              durationMinutes={duration}
              customProblems={activeTest.codingProblems?.length ? activeTest.codingProblems : activeTest.questions}
              onComplete={(r) => handleTestComplete(activeTest.id, r)}
              onExit={handleBackToOverview}
            />
          </main>
        );
      }

      return (
        <main className="dashboard-content">
          <GenericTestUI
            stage={activeTest.topic?.toLowerCase().includes('comm') ? 'communication' : 'aptitude'}
            stageLabel={activeTest.title}
            questionCount={activeTest.questions?.length || 20}
            timeLimitMinutes={duration}
            customQuestions={activeTest.questions}
            onComplete={(r) => handleTestComplete(activeTest.id, r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    // 2. Default Standard Practice Track
    const testKey = typeof activeTest === 'string' ? activeTest : activeTest.key;

    if (testKey === 'aptitude') {
      return (
        <main className="dashboard-content">
          <GenericTestUI
            stage="aptitude"
            stageLabel="Aptitude Practice Set"
            questionCount={30}
            timeLimitMinutes={30}
            onComplete={(r) => handleTestComplete('aptitude', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (testKey === 'technical') {
      return (
        <main className="dashboard-content">
          <GenericTestUI
            stage="technical"
            stageLabel="Technical Assessment Practice"
            questionCount={30}
            timeLimitMinutes={40}
            onComplete={(r) => handleTestComplete('technical', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (testKey === 'coding') {
      return (
        <main className="dashboard-content" style={{ padding: 0 }}>
          <CodingRoundUI
            title="LeetCode Algorithmic Practice"
            onComplete={(r) => handleTestComplete('coding', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }

    if (testKey === 'hr') {
      return (
        <main className="dashboard-content">
          <HRInterviewUI
            onComplete={(r) => handleTestComplete('hr', r)}
            onExit={handleBackToOverview}
          />
        </main>
      );
    }
  }

  // ─── RENDER TEST RESULT VIEW ──────────────────────────────
  if (viewState === 'result' && activeTest) {
    const testKeyOrId = typeof activeTest === 'object' ? (activeTest.id || activeTest.key) : activeTest;
    const resultData = practiceResults[testKeyOrId] || {};
    const title = typeof activeTest === 'object' ? activeTest.title : (DEFAULT_PRACTICE_TESTS.find(t => t.key === activeTest)?.title || 'Practice Simulation');

    return (
      <main className="dashboard-content">
        <TestResultUI
          title={title}
          subtitle="Practice Completed"
          continueLabel="Back to Practice Simulations"
          results={resultData}
          onContinue={handleBackToOverview}
          onRetake={() => handleStartTest(activeTest)}
        />
      </main>
    );
  }

  // ─── OVERVIEW (INDIVIDUAL PRACTICE DASHBOARD) ─────────────
  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <MonitorPlay size={24} style={{ marginRight: '10px' }} /> Practice & Simulations
          </h1>
          <p className="view-sub">Practice individual recruitment rounds 24/7 at your own pace with unlimited attempts.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={loadPracticeSets}>
          <RotateCcw size={14} /> Refresh Practice Sets
        </button>
      </div>

      <div className="test-wrapper">
        {/* SECTION 1: CUSTOM PRACTICE & SIMULATION SETS FROM ADMIN */}
        {customPracticeSets.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="var(--primary)" /> Instructor Practice Modules ({customPracticeSets.length})
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
              Custom practice question sets and coding challenges published by your institution.
            </p>

            <div className="simulations-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
              {customPracticeSets.map((test) => {
                const isCoding = test.topic === 'Coding Challenge';
                const res = practiceResults[test.id];
                const hasCompleted = Boolean(res);

                return (
                  <div className="sim-card active" key={test.id} style={{ border: '1.5px solid var(--border-light)' }}>
                    <div className="sim-header">
                      <span className="sim-badge" style={hasCompleted ? { background: '#DCFCE7', color: '#15803D' } : { background: '#EFF6FF', color: '#1E40AF' }}>
                        {hasCompleted ? '✓ Completed' : '24/7 Practice'}
                      </span>
                      <span className="sim-time">
                        <Clock size={14} style={{ marginRight: '4px' }} /> {test.duration || '60 mins'}
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
                        • {test.topic || 'Practice'}
                      </span>
                    </div>

                    <h4 className="sim-title" style={{ fontSize: '16px' }}>{test.title}</h4>
                    <p className="sim-sub">{test.cleanDescription || 'Comprehensive self-paced practice module.'}</p>

                    <div className="sim-footer">
                      <span className="sim-score" style={hasCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                        {hasCompleted ? `Score: ${res.score} / ${res.total}` : test.questionCount}
                      </span>

                      {hasCompleted ? (
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => handleStartTest(test)}
                        >
                          <RotateCcw size={13} style={{ marginRight: '4px' }} /> Retake
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStartTest(test)}
                        >
                          Start Practice <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: CORE RECRUITMENT DOMAIN SIMULATIONS */}
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text)', margin: '0 0 4px 0' }}>
            Core Skill Practice Tracks
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 14px 0' }}>
            Master individual rounds with real-time feedback and detailed answer explanations.
          </p>

          <div className="simulations-grid">
            {DEFAULT_PRACTICE_TESTS.map((test) => {
              const result = practiceResults[test.key];
              const hasCompleted = Boolean(result);

              return (
                <div className="sim-card active" key={test.id}>
                  <div className="sim-header">
                    <span
                      className="sim-badge"
                      style={
                        hasCompleted
                          ? { background: '#DCFCE7', color: '#15803D' }
                          : { background: '#EFF6FF', color: '#1E40AF' }
                      }
                    >
                      {hasCompleted ? 'Completed' : 'Available 24/7'}
                    </span>
                    <span className="sim-time">
                      <Clock size={14} style={{ marginRight: '4px' }} /> {test.duration}
                    </span>
                  </div>
                  <h4 className="sim-title">{test.title}</h4>
                  <p className="sim-sub">{test.description}</p>

                  <div className="sim-footer">
                    <span className="sim-score" style={hasCompleted ? { fontWeight: '700', color: 'var(--primary)' } : {}}>
                      {hasCompleted
                        ? `Score: ${result.score} / ${result.total}`
                        : test.questionCount}
                    </span>

                    {hasCompleted ? (
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartTest(test.key)}
                      >
                        <RotateCcw size={13} style={{ marginRight: '4px' }} /> Retake Practice
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => handleStartTest(test.key)}
                      >
                        Start Practice <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Simulations;

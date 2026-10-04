import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Award
} from 'lucide-react';
import { assessmentService, selectRandomQuestions } from '../../services/assessmentService';
import './AssessmentTest.css';

const AssessmentTest = ({ 
  assessmentId = 'aptitude-diagnostic-01', 
  questionCount = 20, 
  durationMinutes = 30,
  assessmentTitle = 'Aptitude Diagnostic Test',
  assessmentDescription = 'Standardized benchmark assessment evaluating Quantitative Aptitude, Logical Reasoning, and Problem-Solving agility.',
  onBack 
}) => {
  const durationSeconds = durationMinutes * 60;

  // Navigation & view states: 'instructions' | 'loading' | 'testing' | 'submitting' | 'results' | 'error'
  const [viewState, setViewState] = useState('instructions');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Test data
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [question_id]: 'A' | 'B' | 'C' | 'D' }
  const [_attemptRecord, setAttemptRecord] = useState(null); // reserved for future auth-integration
  const [resultsData, setResultsData] = useState(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
  };

  // Check correctness safely
  const checkIsCorrect = (selected, correct) => {
    if (!selected || !correct) return false;
    const s = String(selected).trim().toUpperCase();
    const c = String(correct).trim().toUpperCase();
    return s === c || c === `OPTION_${s}`;
  };

  // ── Shared local score calculator ──────────────────────────────────────
  // Used by both manual Submit and timer auto-submit so results are always
  // identical. No Supabase writes — pure in-memory computation.
  // TODO(auth-integration): after auth is wired in, call
  //   assessmentService.saveAssessmentAnswers() and
  //   assessmentService.completeAssessmentAttempt() here.
  const computeResults = useCallback((qs, answers) => {
    let marksObtained = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let answeredCount = 0;

    qs.forEach((q) => {
      const qMarks = Number(q.marks) || 1;
      totalMarks += qMarks;
      const selected = answers[q.id] || null;
      if (selected) answeredCount += 1;
      const isCorrect = checkIsCorrect(selected, q.correct_answer);
      if (isCorrect) {
        correctCount += 1;
        marksObtained += qMarks;
      }
    });

    const unansweredCount = qs.length - answeredCount;
    const incorrectCount = answeredCount - correctCount;
    const percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;

    return {
      score: marksObtained,
      totalMarks,
      percentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      answeredCount,
      questions: qs,
      answers,
    };
  }, []);

  // ── Submit handler (manual button + timer auto-submit) ──────────────────
  const handleSubmitTest = useCallback(() => {
    // Stop timer regardless of how submit was triggered
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setShowSubmitModal(false);
    setViewState('submitting');

    setTimeout(() => {
      try {
        const results = computeResults(questions, selectedAnswers);

        console.log('[AssessmentTest] Local results computed:', {
          score: results.score,
          totalMarks: results.totalMarks,
          percentage: results.percentage,
          correct: results.correctCount,
          incorrect: results.incorrectCount,
          unanswered: results.unansweredCount,
        });

        setResultsData(results);
        setViewState('results');
      } catch (err) {
        console.error('[AssessmentTest] Error computing results:', err);
        setErrorMessage(err.message || 'Failed to calculate results. Please try again.');
        setViewState('error');
      }
    }, 300);
  }, [questions, selectedAnswers, computeResults]);

  // Handle countdown timer ticking
  useEffect(() => {
    if (viewState === 'testing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [viewState, handleSubmitTest]);

  // Start test click handler
  const handleStartTest = async () => {
    setViewState('loading');
    setErrorMessage('');

    console.log('[AssessmentTest] handleStartTest — assessmentId:', assessmentId, '| required questionCount:', questionCount);

    try {
      // Local assessment mode — no attempt DB write until auth is integrated
      const attempt = null;

      // 1. Fetch the full question bank for this assessment from Supabase
      const bank = await assessmentService.getAssessmentQuestions(assessmentId);

      if (!bank || bank.length === 0) {
        throw new Error(
          `No questions found for assessment '${assessmentId}' in Supabase (received 0 rows). ` +
          `Check table name, assessment_id value, RLS policy, and Supabase project URL/anon key.`
        );
      }

      // 2. Randomly select the required number of questions (Fisher-Yates shuffle)
      //    - bank.length > questionCount → pick questionCount unique questions
      //    - bank.length <= questionCount → use all, still shuffled
      const selected = selectRandomQuestions(bank, questionCount);

      console.log('[AssessmentTest] Question bank:', bank.length, '| Selected for this attempt:', selected.length);
      console.log('[AssessmentTest] First question:', selected[0]?.question_text?.slice(0, 60));
      console.log('[AssessmentTest] Last question: ', selected[selected.length - 1]?.question_text?.slice(0, 60));

      setQuestions(selected);
      setAttemptRecord(attempt); // null for this diagnostic pass
      setTimeLeft(durationSeconds);
      setCurrentIdx(0);
      setSelectedAnswers({});
      setViewState('testing');
    } catch (err) {
      console.error('[AssessmentTest] Failed to start assessment:', err);
      setErrorMessage(err.message || 'An error occurred while preparing your test. Please try again.');
      setViewState('error');
    }
  };

  // Option selection
  const handleSelectOption = (questionId, optionLetter) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionLetter
    }));
  };

  // Helper to get option display text
  const getOptionLabel = (q, letter) => {
    if (!letter) return 'Not Answered';
    const l = String(letter).toUpperCase();
    if (l === 'A') return `A) ${q.option_a}`;
    if (l === 'B') return `B) ${q.option_b}`;
    if (l === 'C') return `C) ${q.option_c}`;
    if (l === 'D') return `D) ${q.option_d}`;
    return letter;
  };

  // =============================================
  // RENDER: LOADING VIEW
  // =============================================
  if (viewState === 'loading' || viewState === 'submitting') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
          <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
            <Clock size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
              {viewState === 'submitting' ? 'Submitting Assessment...' : `Preparing ${assessmentTitle}...`}
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {viewState === 'submitting' 
                ? 'Validating answers, computing benchmarks, and updating your profile.' 
                : 'Fetching verified questions from Supabase and initializing your test session.'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =============================================
  // RENDER: ERROR VIEW
  // =============================================
  if (viewState === 'error') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper">
          <div className="test-error-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
              <AlertCircle size={20} /> Assessment Notice
            </div>
            <p style={{ fontSize: '13px', margin: 0 }}>{errorMessage}</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button className="btn btn-outline btn-sm" onClick={onBack}>
                <ArrowLeft size={14} /> Back to Assessments
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleStartTest}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =============================================
  // RENDER: INSTRUCTIONS VIEW
  // =============================================
  if (viewState === 'instructions') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper">
          <div className="instructions-card">
            <div className="instructions-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="sim-badge">DIAGNOSTIC TEST</span>
              </div>
              <h1 className="instructions-title">
                <ClipboardCheck size={26} color="var(--primary)" /> {assessmentTitle}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>
                {assessmentDescription}
              </p>
            </div>

            <div className="instructions-meta-grid">
              <div className="instructions-meta-box">
                <span className="instructions-meta-label">Total Questions</span>
                <span className="instructions-meta-value">{questionCount} Questions</span>
              </div>
              <div className="instructions-meta-box">
                <span className="instructions-meta-label">Allocated Time</span>
                <span className="instructions-meta-value">{durationMinutes} Minutes</span>
              </div>
              <div className="instructions-meta-box">
                <span className="instructions-meta-label">Total Marks</span>
                <span className="instructions-meta-value">{questionCount} Marks (1 per question)</span>
              </div>
            </div>

            <div className="instructions-rules-card">
              <h3 className="instructions-rules-title">Rules & Assessment Guidelines:</h3>
              <ul className="instructions-rules-list">
                <li className="instructions-rule-item">
                  <span className="instructions-rule-bullet">•</span>
                  <span>Select one answer for each question.</span>
                </li>
                <li className="instructions-rule-item">
                  <span className="instructions-rule-bullet">•</span>
                  <span>You can move between questions using the Question Navigator or Previous / Next buttons.</span>
                </li>
                <li className="instructions-rule-item">
                  <span className="instructions-rule-bullet">•</span>
                  <span>You can change an answer at any point before submitting.</span>
                </li>
                <li className="instructions-rule-item">
                  <span className="instructions-rule-bullet">•</span>
                  <span>The assessment automatically submits when the countdown timer reaches 00:00.</span>
                </li>
                <li className="instructions-rule-item">
                  <span className="instructions-rule-bullet">•</span>
                  <span>Unanswered questions receive zero marks. There is no negative marking.</span>
                </li>
              </ul>
            </div>

            <div className="instructions-actions">
              <button className="btn btn-outline" onClick={onBack}>
                <ArrowLeft size={14} /> Back to Assessments
              </button>
              <button className="btn btn-primary" onClick={handleStartTest}>
                Start Test <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =============================================
  // RENDER: RESULTS VIEW
  // =============================================
  if (viewState === 'results' && resultsData) {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper">
          <div className="results-card">
            {/* Header Banner */}
            <div className="results-banner">
              <Award size={40} style={{ marginBottom: '4px' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
                Assessment Completed
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{assessmentTitle}</h2>
              <div className="results-score-highlight">
                {resultsData.score} / {resultsData.totalMarks}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>
                Final Score: {resultsData.percentage}%
              </div>
            </div>

            {/* Stat Chips */}
            <div className="results-stats-row">
              <div className="result-stat-chip correct">
                <span className="result-stat-num">{resultsData.correctCount}</span>
                <span className="result-stat-lbl">Correct Answers</span>
              </div>
              <div className="result-stat-chip incorrect">
                <span className="result-stat-num">{resultsData.incorrectCount}</span>
                <span className="result-stat-lbl">Incorrect Answers</span>
              </div>
              <div className="result-stat-chip unanswered">
                <span className="result-stat-num">{resultsData.unansweredCount}</span>
                <span className="result-stat-lbl">Unanswered</span>
              </div>
            </div>

            {/* Question-by-Question Review */}
            <div className="review-section">
              <h3 className="review-section-title">Question-by-Question Review</h3>
              
              {resultsData.questions.map((q, idx) => {
                const selected = resultsData.answers[q.id];
                const isCorrect = checkIsCorrect(selected, q.correct_answer);
                const isUnanswered = !selected;

                return (
                  <div className="review-item-card" key={q.id}>
                    <div className="review-item-header">
                      <span className="review-item-qnum">Question {idx + 1} of {resultsData.questions.length}</span>
                      {isUnanswered ? (
                        <span className="review-badge unanswered">Not Answered</span>
                      ) : isCorrect ? (
                        <span className="review-badge correct">
                          <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px' }} /> Correct (+1 Mark)
                        </span>
                      ) : (
                        <span className="review-badge incorrect">
                          <AlertCircle size={12} style={{ display: 'inline', marginRight: '4px' }} /> Incorrect (0 Marks)
                        </span>
                      )}
                    </div>

                    <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text)' }}>
                      {q.question_text}
                    </div>

                    <div className="review-answers-box">
                      <div className="review-answer-line">
                        <strong style={{ minWidth: '110px', color: 'var(--text-secondary)' }}>Your Answer:</strong>
                        <span style={{ 
                          fontWeight: '600', 
                          color: isCorrect ? 'var(--success)' : isUnanswered ? 'var(--text-muted)' : 'var(--danger)' 
                        }}>
                          {getOptionLabel(q, selected)}
                        </span>
                      </div>
                      <div className="review-answer-line">
                        <strong style={{ minWidth: '110px', color: 'var(--text-secondary)' }}>Correct Answer:</strong>
                        <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                          {getOptionLabel(q, q.correct_answer)}
                        </span>
                      </div>
                    </div>

                    {q.explanation && (
                      <div className="review-explanation-box">
                        <strong>Explanation: </strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Back Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button className="btn btn-primary" onClick={onBack}>
                <ArrowLeft size={14} /> Back to Assessments
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =============================================
  // RENDER: ACTIVE TEST VIEW
  // =============================================
  const currentQuestion = questions[currentIdx] || {};
  const currentAnswer = selectedAnswers[currentQuestion.id] || null;
  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]).length;
  const unansweredCount = questions.length - answeredCount;
  const is5MinWarning = timeLeft <= 300;

  const options = [
    { letter: 'A', text: currentQuestion.option_a },
    { letter: 'B', text: currentQuestion.option_b },
    { letter: 'C', text: currentQuestion.option_c },
    { letter: 'D', text: currentQuestion.option_d },
  ];

  return (
    <main className="dashboard-content">
      <div className="test-wrapper">
        {/* Top Status Bar */}
        <div className="test-topbar">
          <div className="test-title-area">
            <span className="test-title">{assessmentTitle}</span>
            <span className="test-progress-tag">
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {is5MinWarning && (
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={14} /> 5 Minutes Remaining
              </span>
            )}
            <div className={`test-timer ${is5MinWarning ? 'timer-warning' : ''} ${timeLeft <= 60 ? 'timer-danger' : ''}`}>
              <Clock size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Test Grid: Question Card & Question Palette */}
        <div className="test-grid">
          {/* Main Question Card */}
          <div className="question-card">
            <div className="question-header">
              <span className="question-num-badge">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="question-marks-badge">
                {currentQuestion.marks || 1} Mark
              </span>
            </div>

            <div className="question-text">
              {currentQuestion.question_text}
            </div>

            {/* Options List */}
            <div className="options-list">
              {options.map(opt => (
                <button
                  key={opt.letter}
                  type="button"
                  className={`option-button ${currentAnswer === opt.letter ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.letter)}
                >
                  <span className="option-letter">{opt.letter}</span>
                  <span>{opt.text}</span>
                </button>
              ))}
            </div>

            {/* Navigation Actions Bar */}
            <div className="question-nav-bar">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                style={{ opacity: currentIdx === 0 ? 0.5 : 1 }}
              >
                <ArrowLeft size={14} /> Previous
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Submit Assessment <CheckCircle2 size={14} />
                  </button>
                )}
                
                {currentIdx < questions.length - 1 && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Submit Assessment
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side Question Navigator */}
          <div className="navigator-card">
            <h4 className="navigator-title">Question Navigator</h4>

            <div className="navigator-grid">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAnswered = Boolean(selectedAnswers[q.id]);

                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`nav-item-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : 'unanswered'}`}
                    onClick={() => setCurrentIdx(idx)}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="navigator-legend">
              <div className="legend-item">
                <span className="legend-dot answered"></span>
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot unanswered"></span>
                <span>Unanswered ({unansweredCount})</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot current"></span>
                <span>Current Question</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title">Submit Assessment?</h3>
                <p className="modal-sub">Are you sure you want to finalize and submit your test now?</p>
              </div>

              <div className="modal-stats-grid">
                <div className="modal-stat-box">
                  <div className="modal-stat-num" style={{ color: 'var(--primary)' }}>{answeredCount}</div>
                  <div className="modal-stat-lbl">Answered</div>
                </div>
                <div className="modal-stat-box">
                  <div className="modal-stat-num" style={{ color: unansweredCount > 0 ? '#B45309' : 'var(--text-muted)' }}>
                    {unansweredCount}
                  </div>
                  <div className="modal-stat-lbl">Unanswered</div>
                </div>
              </div>

              {unansweredCount > 0 && (
                <p style={{ fontSize: '12px', color: '#B45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
                </p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitTest}
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AssessmentTest;

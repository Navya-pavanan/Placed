import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ArrowRight, ArrowLeft, AlertTriangle, Loader, CheckCircle2 } from 'lucide-react';
import { simulationService } from '../../../services/simulationService';
import SubmitConfirmationModal from './SubmitConfirmationModal';
import '../AssessmentTest.css';

const GenericTestUI = ({ stage, stageLabel, questionCount, timeLimitMinutes, onComplete, onExit, customQuestions }) => {
  const [questions, setQuestions] = useState(customQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState((timeLimitMinutes || 30) * 60);
  const [isLoading, setIsLoading] = useState(!customQuestions || customQuestions.length === 0);
  const [error, setError] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Fetch questions
  useEffect(() => {
    if (customQuestions && customQuestions.length > 0) {
      setQuestions(customQuestions);
      setCurrentIndex(0);
      setSelectedAnswers({});
      setTimeRemaining((timeLimitMinutes || 30) * 60);
      setIsLoading(false);
      startTimeRef.current = Date.now();
      return;
    }

    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data = [];

        // Aptitude Test:
        // 10 Quantitative + 10 Logical + 10 Verbal
        if (stage === 'aptitude') {
          data = await simulationService.getAptitudeQuestions();
        } else if (stage === 'technical') {
          data = await simulationService.getTechnicalQuestions();
        } else {
          data = await simulationService.getSimulationQuestions(
            stage,
            questionCount
          );
        }

        if (!data || data.length === 0) {
          setError('No questions available for this stage. Please contact your administrator.');
          return;
        }

        setQuestions(data);
        setCurrentIndex(0);
        setSelectedAnswers({});
        setTimeRemaining((timeLimitMinutes || 30) * 60);

        // Start the timer only after questions are loaded
        startTimeRef.current = Date.now();

      } catch (error) {
        console.error('Failed to load questions:', error);
        setError('Failed to load questions. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [stage, questionCount, timeLimitMinutes, customQuestions]);

  // Timer countdown
  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, questions.length]);

  const handleAutoSubmit = useCallback(() => {
    clearInterval(timerRef.current);
    calculateAndSubmit();
  }, [questions, selectedAnswers]);

  const calculateAndSubmit = () => {
    clearInterval(timerRef.current);
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeTaken = `${minutes}m ${seconds}s`;

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    questions.forEach((q) => {
      const answer = selectedAnswers[q.id];
      if (!answer) {
        unansweredCount++;
      } else if (answer === q.correct_answer) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const total = questions.length;
    const score = correctCount;
    const percentage = total > 0 ? (score / total) * 100 : 0;

    onComplete({
      score,
      total,
      percentage,
      timeTaken,
      correctCount,
      incorrectCount,
      unansweredCount,
      questions,
      selectedAnswers
    });
  };

  const handleSelectAnswer = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const unansweredCount = questions.length - answeredCount;

  // Loading state
  if (isLoading) {
    return (
      <div className="test-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <Loader size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Loading {stageLabel} questions...</h3>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="test-wrapper">
        <div className="test-error-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <AlertTriangle size={20} /> Unable to Load Questions
          </div>
          <p style={{ fontSize: '13px', margin: 0 }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn btn-outline btn-sm" onClick={onExit}>
              <ArrowLeft size={14} /> Return to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="test-wrapper">
        <div className="test-error-box" style={{ background: '#FEF3C7', borderColor: '#F59E0B', color: '#92400E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <AlertTriangle size={20} /> No questions available
          </div>
          <p style={{ fontSize: '13px', margin: 0 }}>Questions for this stage haven't been added yet.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn btn-outline btn-sm" onClick={onExit}>
              <ArrowLeft size={14} /> Return to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentQuestion.id] || null;
  const options = [
    { letter: 'A', text: currentQuestion.option_a },
    { letter: 'B', text: currentQuestion.option_b },
    { letter: 'C', text: currentQuestion.option_c },
    { letter: 'D', text: currentQuestion.option_d },
  ];
  const isLastQuestion = currentIndex === questions.length - 1;
  const is5MinWarning = timeRemaining <= 300;

  return (
    <div className="test-wrapper">
      {/* Top Status Bar */}
      <div className="test-topbar">
        <div className="test-title-area">
          <span className="test-title">{stageLabel}</span>
          <span className="test-progress-tag">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {is5MinWarning && (
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> 5 Minutes Remaining
            </span>
          )}
          <div className={`test-timer ${is5MinWarning ? 'timer-warning' : ''} ${timeRemaining <= 60 ? 'timer-danger' : ''}`}>
            <Clock size={16} />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Test Grid: Question Card & Question Palette */}
      <div className="test-grid">
        {/* Main Question Card */}
        <div className="question-card">
          <div className="question-header">
            <span className="question-num-badge">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {currentQuestion.category && (
              <span className="question-marks-badge">
                {currentQuestion.category}
              </span>
            )}
          </div>

          <div className="question-text">
            {currentQuestion.question}
          </div>

          {/* Options List */}
          <div className="options-list">
            {options.map(opt => (
              <button
                key={opt.letter}
                type="button"
                className={`option-button ${currentAnswer === opt.letter ? 'selected' : ''}`}
                onClick={() => handleSelectAnswer(currentQuestion.id, opt.letter)}
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
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ArrowLeft size={14} /> Previous
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              {isLastQuestion ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Test <CheckCircle2 size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                >
                  Next <ArrowRight size={14} />
                </button>
              )}
              
              {!isLastQuestion && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowSubmitModal(true)}
                >
                  Submit Test
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
              const isCurrent = idx === currentIndex;
              const isAnswered = Boolean(selectedAnswers[q.id]);

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`nav-item-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : 'unanswered'}`}
                  onClick={() => setCurrentIndex(idx)}
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

      {showSubmitModal && (
        <SubmitConfirmationModal
          answeredCount={answeredCount}
          totalCount={questions.length}
          onCancel={() => setShowSubmitModal(false)}
          onSubmit={calculateAndSubmit}
        />
      )}
    </div>
  );
};

export default GenericTestUI;

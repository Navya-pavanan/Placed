import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ArrowLeft, ArrowRight, Send, Loader, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { simulationService } from '../../../services/simulationService';
import '../AssessmentTest.css';


const HRInterviewUI = ({ onComplete, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(20 * 60);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await simulationService.getHRQuestions(5);

        if (!data || data.length === 0) {
          setError(
            'No HR interview questions are available. Please contact your administrator.'
          );
          return;
        }

        setQuestions(data);
        setCurrentIndex(0);
        setAnswers({});
        setTimeRemaining(20 * 60);

        startTimeRef.current = Date.now();

      } catch (err) {
        console.error('Failed to load HR questions:', err);

        setError(
          'Failed to load HR interview questions. Please check your connection and try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, questions.length]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAnswerChange = (e) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }));
  };

  const handleSubmit = useCallback(() => {
    clearInterval(timerRef.current);

    const elapsedSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const answeredCount = Object.values(answers).filter(
      (answer) => answer && answer.trim().length > 0
    ).length;

    const total = questions.length;

    onComplete({
      score: answeredCount,
      total,
      percentage: total > 0
        ? (answeredCount / total) * 100
        : 0,
      timeTaken: `${minutes}m ${seconds}s`,
      correctCount: answeredCount,
      incorrectCount: 0,
      unansweredCount: total - answeredCount
    });
  }, [answers, questions, onComplete]);

  const answeredCount = Object.values(answers).filter(
    (answer) => answer && answer.trim().length > 0
  ).length;
  const unansweredCount = questions.length - answeredCount;

  if (isLoading) {
    return (
      <div className="test-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <Loader size={36} color="var(--primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Loading HR interview questions...</h3>
        </div>
      </div>
    );
  }

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

  const isLastQuestion = currentIndex === questions.length - 1;
  const isTimeLow = timeRemaining <= 300; // 5 mins

  return (
    <div className="test-wrapper">
      {/* Header */}
      <div className="test-topbar">
        <div className="test-title-area">
          <span className="test-title">HR Interview</span>
          <span className="test-progress-tag">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTimeLow && (
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> 5 Minutes Remaining
            </span>
          )}
          <div className={`test-timer ${isTimeLow ? 'timer-warning' : ''} ${timeRemaining <= 60 ? 'timer-danger' : ''}`}>
            <Clock size={16} />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="test-grid">
        <div className="question-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="question-header">
            <span className="question-num-badge">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="question-text" style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>
            {questions[currentIndex]?.question}
          </div>

          <textarea
            value={answers[currentIndex] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            style={{
              flex: 1,
              minHeight: '250px',
              padding: '20px',
              borderRadius: 'var(--radius)',
              border: '1.5px solid var(--border-light)',
              backgroundColor: 'var(--bg)',
              fontSize: '15px',
              lineHeight: 1.7,
              color: 'var(--text)',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
          />

          {/* Navigation */}
          <div className="question-nav-bar" style={{ marginTop: '24px' }}>
            <button
              className="btn btn-outline"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
              style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
            >
              <ArrowLeft size={14} /> Previous
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              {isLastQuestion ? (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit Interview <CheckCircle2 size={14} />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => setCurrentIndex((i) => i + 1)}>
                  Next <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="navigator-card">
          <h4 className="navigator-title">Questions</h4>

          <div className="navigator-grid">
            {questions.map((_, i) => {
              const isAnswered = answers[i] && answers[i].trim().length > 0;
              const isCurrent = i === currentIndex;
              
              return (
                <button
                  key={i}
                  type="button"
                  className={`nav-item-btn ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : 'unanswered'}`}
                  onClick={() => setCurrentIndex(i)}
                  title={`Question ${i + 1}`}
                >
                  {i + 1}
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
    </div>
  );
};

export default HRInterviewUI;

import React from 'react';
import { Award, ArrowLeft, ArrowRight } from 'lucide-react';
import '../AssessmentTest.css';

const TestResultUI = ({ title, results, onContinue, continueLabel = "Continue to Next Stage", subtitle = "Stage Completed", onRetake }) => {
  const { score, total, percentage, timeTaken, correctCount, incorrectCount, unansweredCount } = results;

  let message = "";
  if (percentage >= 90) {
    message = "Excellent performance! You are highly prepared.";
  } else if (percentage >= 70) {
    message = "Good performance! You have successfully completed this stage.";
  } else if (percentage >= 50) {
    message = "Fair performance. Review the recommended areas.";
  } else {
    message = "More practice is recommended before progressing.";
  }

  return (
    <div className="test-wrapper">
      <div className="results-card">
        {/* Banner */}
        <div className="results-banner">
          <Award size={40} style={{ marginBottom: '4px' }} />
          <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', opacity: 0.9 }}>
            {subtitle}
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{title}</h2>
          <div className="results-score-highlight">
            {score} / {total}
          </div>
          <div style={{ fontSize: '15px', fontWeight: '600', opacity: 0.9 }}>
            Score: {percentage.toFixed(1)}%
          </div>
        </div>

        {/* Message */}
        <p style={{ textAlign: 'center', fontSize: '15px', fontWeight: 600, margin: '24px 0', color: 'var(--text)' }}>
          {message}
        </p>

        {/* Stat Chips */}
        <div className="results-stats-row">
          <div className="result-stat-chip correct">
            <span className="result-stat-num">{correctCount}</span>
            <span className="result-stat-lbl">Correct Answers</span>
          </div>
          <div className="result-stat-chip incorrect">
            <span className="result-stat-num">{incorrectCount}</span>
            <span className="result-stat-lbl">Incorrect Answers</span>
          </div>
          <div className="result-stat-chip unanswered">
            <span className="result-stat-num">{unansweredCount}</span>
            <span className="result-stat-lbl">Unanswered</span>
          </div>
        </div>

        {/* Time Taken */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="result-stat-chip" style={{ width: 'auto', padding: '12px 28px' }}>
            <span className="result-stat-num" style={{ color: 'var(--text)' }}>{timeTaken}</span>
            <span className="result-stat-lbl">Total Time Taken</span>
          </div>
        </div>

        {/* Question Explanations Review Section */}
        {results.questions && results.questions.length > 0 && (
          <div className="review-section" style={{ marginTop: '16px', textAlign: 'left' }}>
            <h3 className="review-section-title" style={{ fontSize: '16px', fontWeight: '800', marginBottom: '14px' }}>
              💡 Questions & Detailed Explanations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {results.questions.map((q, idx) => {
                const selected = results.selectedAnswers?.[q.id];
                const isCorrect = selected === q.correct_answer;
                const isUnanswered = !selected;

                return (
                  <div 
                    key={q.id || idx}
                    className="review-item-card"
                    style={{
                      borderLeft: `4px solid ${isCorrect ? 'var(--success, #10B981)' : isUnanswered ? '#94A3B8' : 'var(--danger, #EF4444)'}`,
                      padding: '16px',
                      background: 'var(--surface-alt, #F8FAFC)',
                      borderRadius: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>
                        Question {idx + 1} {q.category ? `• ${q.category}` : ''}
                      </span>
                      <span 
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          background: isCorrect ? '#DCFCE7' : isUnanswered ? '#F1F5F9' : '#FEE2E2',
                          color: isCorrect ? '#15803D' : isUnanswered ? '#64748B' : '#B91C1C'
                        }}
                      >
                        {isCorrect ? '✓ Correct' : isUnanswered ? '— Unanswered' : '✗ Incorrect'}
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text)', marginBottom: '12px' }}>
                      {q.question}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                      {[
                        { k: 'A', t: q.option_a },
                        { k: 'B', t: q.option_b },
                        { k: 'C', t: q.option_c },
                        { k: 'D', t: q.option_d }
                      ].map(opt => {
                        const isThisSelected = selected === opt.k;
                        const isThisCorrect = q.correct_answer === opt.k;

                        let optBg = 'transparent';
                        let optBorder = '1px solid var(--border-light, #E2E8F0)';
                        let optColor = 'var(--text-secondary)';

                        if (isThisCorrect) {
                          optBg = '#DCFCE7';
                          optBorder = '1.5px solid #22C55E';
                          optColor = '#15803D';
                        } else if (isThisSelected && !isThisCorrect) {
                          optBg = '#FEE2E2';
                          optBorder = '1.5px solid #EF4444';
                          optColor = '#B91C1C';
                        }

                        return (
                          <div 
                            key={opt.k}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: optBg,
                              border: optBorder,
                              color: optColor,
                              fontSize: '12.5px',
                              fontWeight: isThisCorrect || isThisSelected ? 700 : 500
                            }}
                          >
                            <strong>({opt.k})</strong> {opt.t} {isThisCorrect && ' ✓ (Correct)'} {isThisSelected && !isThisCorrect && ' ✗ (Your Answer)'}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div 
                        style={{
                          padding: '10px 12px',
                          background: '#EFF6FF',
                          borderRadius: '8px',
                          border: '1px solid #BFDBFE',
                          fontSize: '13px',
                          color: '#1E40AF',
                          lineHeight: '1.5'
                        }}
                      >
                        <strong>💡 Explanation: </strong>{q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          {onRetake && (
            <button className="btn btn-outline" onClick={onRetake}>
              Retake Test
            </button>
          )}
          <button className="btn btn-primary" onClick={onContinue}>
            {continueLabel} <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResultUI;

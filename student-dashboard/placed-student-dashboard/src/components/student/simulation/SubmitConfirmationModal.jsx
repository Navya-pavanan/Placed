import React from 'react';
import { AlertTriangle } from 'lucide-react';

const SubmitConfirmationModal = ({ answeredCount, totalCount, onCancel, onSubmit }) => {
  const unansweredCount = totalCount - answeredCount;

  return (
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
            onClick={onCancel}
          >
            Continue Test
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmationModal;

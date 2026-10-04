import React from 'react';
import { PlayCircle } from 'lucide-react';

const STAGES = [
  {
    id: '01',
    title: 'Aptitude Test',
    meta: '30 Questions • 30 Minutes',
    desc: 'Test quantitative, logical reasoning and verbal ability.'
  },
  {
    id: '02',
    title: 'Technical Assessment',
    meta: '30 Questions • 40 Minutes',
    desc: 'Programming fundamentals and core technical knowledge.'
  },
  {
    id: '03',
    title: 'Coding Round',
    meta: '4 Coding Problems • 60 Minutes',
    desc: 'Test problem-solving and programming.'
  },
  {
    id: '04',
    title: 'HR Interview',
    meta: '5 Questions • 20 Minutes',
    desc: 'Test communication and interview readiness.'
  }
];

const SimulationStartModal = ({ onClose, onStart }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '500px' }}>

        {/* Modal Header */}
        <div className="modal-header">
          <h3 className="modal-title">
            Campus Placement Simulation
          </h3>
          <p className="modal-sub">
            You are about to begin a complete placement simulation.
          </p>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Simulation Stages
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {STAGES.map((stage) => (
              <div key={stage.id} style={{ display: 'flex', gap: '16px', padding: '12px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#1E40AF', fontSize: '12px', fontWeight: 700, flexShrink: 0 }}>
                  {stage.id}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text)' }}>
                    {stage.title}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>
                    {stage.meta}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {stage.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onStart}>
            Start Aptitude Test <PlayCircle size={14} style={{ marginLeft: '4px' }} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SimulationStartModal;

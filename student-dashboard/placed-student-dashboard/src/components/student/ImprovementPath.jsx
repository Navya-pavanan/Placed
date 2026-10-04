import React, { useState, useEffect } from 'react';
import { TrendingUp, Route, Check, Loader, Play, Sparkles } from 'lucide-react';
import { improvementService } from '../../services/improvementService';

const ImprovementPath = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    improvementService.getImprovementPath().then(setSteps);
  }, []);

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <TrendingUp size={24} style={{ marginRight: '10px' }} /> Personalized Improvement Path
          </h1>
          <p className="view-sub">Step-by-step development journey to eliminate skill deficits and boost your readiness index.</p>
        </div>
      </div>

      <div className="main-grid">
        <div className="col-left">
          <section className="card">
            <div className="card-header">
              <h2 className="card-title">
                <Route size={18} style={{ marginRight: '8px' }} /> Milestone Learning Path
              </h2>
            </div>
            <div className="roadmap-steps">
              {steps.map((step) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';
                const isRecommended = step.status === 'recommended';

                return (
                  <div key={step.id} className={`roadmap-step ${isCompleted ? 'completed' : isActive ? 'active' : 'recommended'}`}>
                    <div className={`rs-marker ${isActive ? 'active' : isRecommended ? 'rec' : ''}`}>
                      {isCompleted && <Check size={14} />}
                      {isActive && <Loader size={14} />}
                      {isRecommended && <Sparkles size={14} />}
                    </div>
                    <div className="rs-content">
                      <span className="rs-stage">{step.stage}</span>
                      <h4 className="rs-name">{step.title}</h4>
                      <p className="rs-sub">{step.description}</p>
                      {step.actionText && (
                        <button className="btn btn-primary btn-sm rs-btn">
                          <Play size={12} style={{ marginRight: '4px' }} /> {step.actionText}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ImprovementPath;

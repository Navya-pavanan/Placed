import React, { useState, useEffect } from 'react';
import { Video, Clock, Link as LinkIcon, Building, MapPin } from 'lucide-react';
import { interviewService } from '../../services/interviewService';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    interviewService.getInterviews().then(setInterviews);
  }, []);

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <Video size={24} style={{ marginRight: '10px' }} /> Scheduled Corporate Interviews
          </h1>
          <p className="view-sub">Track upcoming video calls, in-person rounds, and join active interview rooms.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {interviews.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No corporate interviews currently scheduled in your database.
          </div>
        ) : (
          <div className="interview-timeline">
            {interviews.map((item) => (
              <div className={`interview-item ${item.isToday ? 'today' : ''}`} key={item.id}>
                <div className="it-date-col">
                  <span className="it-day">{item.day}</span>
                  <span className="it-time">{item.time}</span>
                </div>
                <div className="it-connector">
                  <div className={`it-dot ${item.isToday ? 'pulse' : ''}`}></div>
                  {item.isToday && <div className="it-line"></div>}
                </div>
                <div className="it-card">
                  <div className="it-card-top">
                    <img 
                      src={item.logoUrl} 
                      alt={item.company} 
                      onError={(e) => { e.target.src = item.fallbackLogo; }} 
                      className="it-logo"
                    />
                    <div>
                      <p className="it-company">{item.company}</p>
                      <p className="it-role">{item.role}</p>
                    </div>
                    <span className={`status-badge ${item.statusBadgeClass}`}>{item.statusBadge}</span>
                  </div>
                  <div className="it-meta">
                    {item.mode === 'Video Call' ? (
                      <>
                        <span><Video size={12} style={{ marginRight: '4px' }} /> {item.mode}</span>
                        <span><Clock size={12} style={{ marginRight: '4px' }} /> {item.duration}</span>
                        <span><LinkIcon size={12} style={{ marginRight: '4px' }} /> {item.platform}</span>
                      </>
                    ) : (
                      <>
                        <span><Building size={12} style={{ marginRight: '4px' }} /> {item.mode}</span>
                        <span><MapPin size={12} style={{ marginRight: '4px' }} /> {item.platform}</span>
                      </>
                    )}
                  </div>
                  {item.isToday && (
                    <div className="it-actions">
                      <button className="btn btn-primary btn-sm">
                        <Video size={14} style={{ marginRight: '4px' }} /> Join Call Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Interviews;

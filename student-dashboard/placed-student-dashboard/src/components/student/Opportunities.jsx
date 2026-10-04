import React, { useState, useEffect } from 'react';
import { Briefcase, Bookmark, MapPin, IndianRupee } from 'lucide-react';
import { opportunityService } from '../../services/opportunityService';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    opportunityService.getOpportunities().then(setOpportunities);
  }, []);

  const handleApply = async (id) => {
    const updated = await opportunityService.applyToOpportunity(id);
    setOpportunities(updated);
  };

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <Briefcase size={24} style={{ marginRight: '10px' }} /> Job Opportunities & Campus Placement Drives
          </h1>
          <p className="view-sub">Explore active corporate recruitment drives matched to your eligibility profile.</p>
        </div>
      </div>

      <div className="job-cards-grid">
        {opportunities.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No placement drives currently available in database.
          </div>
        ) : (
          opportunities.map((opp) => (
            <div className="job-card" key={opp.id}>
              <div className="jc-top">
                <div className="jc-logo-wrap">
                  <img 
                    src={opp.logoUrl} 
                    alt={opp.company} 
                    onError={(e) => { e.target.src = opp.fallbackLogo; }} 
                    className="jc-logo"
                  />
                </div>
                <button className="jc-save" aria-label="Save job"><Bookmark size={16} /></button>
              </div>
              <p className="jc-company">{opp.company}</p>
              <h4 className="jc-role">{opp.role}</h4>
              <div className="jc-tags">
                {(opp.tags || []).map((tag, idx) => (
                  <span className={`tag ${tag.type}`} key={idx}>{tag.label}</span>
                ))}
              </div>
              <div className="jc-meta">
                <span><MapPin size={12} style={{ marginRight: '4px' }} /> {opp.location}</span>
                <span><IndianRupee size={12} style={{ marginRight: '2px' }} /> {opp.compensation}</span>
              </div>
              <div className="jc-footer">
                <span className="jc-match">{opp.matchPercentage}% match</span>
                <button 
                  className={`btn ${opp.status === 'applied' ? 'btn-outline' : 'btn-primary'} btn-sm`}
                  onClick={() => handleApply(opp.id)}
                  disabled={opp.status === 'applied'}
                >
                  {opp.status === 'applied' ? 'Applied ✓' : 'Apply Now'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default Opportunities;

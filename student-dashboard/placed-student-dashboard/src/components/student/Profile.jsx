import React, { useState, useEffect } from 'react';
import { UserCircle, Save, User, Mail, Phone, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { studentService } from '../../services/studentService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    studentService.getStudentProfile().then(setProfile);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleSave = async () => {
    if (!profile) return;
    if (!profile.name || profile.name.trim() === '') {
      setErrorMsg('Full Name cannot be empty.');
      return;
    }

    setSaving(true);
    setErrorMsg('');
    try {
      await studentService.updateStudentProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setErrorMsg('Unable to save profile to database. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return (
      <main className="dashboard-content">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading student profile from database...
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-content">
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <UserCircle size={24} style={{ marginRight: '10px' }} /> Profile & Account Settings
          </h1>
          <p className="view-sub">Manage your academic records, skills profile, and placement preferences.</p>
        </div>
        <button 
          className="btn btn-primary" 
          id="btnSaveProfile" 
          onClick={handleSave}
          disabled={saving}
        >
          <Save size={16} style={{ marginRight: '6px' }} /> {saving ? 'Saving to Database...' : saved ? 'Profile Saved ✓' : 'Save Profile Details'}
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {saved && (
        <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#16A34A', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
          <CheckCircle size={16} /> Student profile updated successfully and persisted to database.
        </div>
      )}

      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={16} /> Academic Credentials
        </h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={profile.name} onChange={handleChange} className="form-input" placeholder="e.g. Ananya Sharma" />
          </div>
          <div className="form-group">
            <label>Professional Title</label>
            <input type="text" name="title" value={profile.title} onChange={handleChange} className="form-input" placeholder="e.g. Software Development Engineer" />
          </div>
          <div className="form-group">
            <label>Enrollment / Roll Number</label>
            <input type="text" name="rollNumber" value={profile.rollNumber} onChange={handleChange} className="form-input" placeholder="e.g. 2024CS101" />
          </div>
          <div className="form-group">
            <label>Degree & Branch</label>
            <input type="text" name="degree" value={profile.degree} onChange={handleChange} className="form-input" placeholder="e.g. B.Tech in Computer Science" />
          </div>
          <div className="form-group">
            <label>CGPA</label>
            <input type="text" name="cgpa" value={profile.cgpa} onChange={handleChange} className="form-input" placeholder="e.g. 8.5 / 10.0" />
          </div>
          <div className="form-group">
            <label>Batch Passing Year</label>
            <input type="text" name="batchYear" value={profile.batchYear} onChange={handleChange} className="form-input" placeholder="e.g. 2025" />
          </div>
          <div className="form-group form-group-full" style={{ gridColumn: 'span 2' }}>
            <label>Active Backlogs</label>
            <input type="text" name="backlogs" value={profile.backlogs} onChange={handleChange} className="form-input" placeholder="e.g. 0 (Eligible)" />
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} /> Contact & Online Profiles
        </h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" value={profile.email} onChange={handleChange} className="form-input" placeholder="student@college.edu" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="form-input" placeholder="+91 98765 43210" />
          </div>
          <div className="form-group">
            <label>LinkedIn Profile URL</label>
            <input type="text" name="linkedin" value={profile.linkedin} onChange={handleChange} className="form-input" placeholder="linkedin.com/in/username" />
          </div>
          <div className="form-group">
            <label>GitHub Repository URL</label>
            <input type="text" name="github" value={profile.github} onChange={handleChange} className="form-input" placeholder="github.com/username" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;


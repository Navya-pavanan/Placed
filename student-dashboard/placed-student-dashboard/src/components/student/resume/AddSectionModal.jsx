import React, { useState } from 'react';
import {
  X,
  Plus,
  Trophy,
  Flame,
  Presentation,
  BookOpen,
  Languages,
  HeartHandshake,
  Users,
  ScrollText,
  Compass,
  Sparkles,
  Briefcase,
  Layers
} from 'lucide-react';
import { AVAILABLE_SECTIONS_CATALOG } from '../../../services/resumeService';

const ICON_MAP = {
  Trophy,
  Flame,
  Presentation,
  BookOpen,
  Languages,
  HeartHandshake,
  Users,
  ScrollText,
  Compass,
  Sparkles,
  Briefcase,
  Layers
};

export const AddSectionModal = ({ isOpen, onClose, activeSections = [], onAddSection, onAddCustomSection }) => {
  const [customTitle, setCustomTitle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  if (!isOpen) return null;

  // Filter out sections already active
  const availableToAdd = AVAILABLE_SECTIONS_CATALOG.filter(
    (sec) => !activeSections.includes(sec.id)
  );

  const handleAdd = (sectionId) => {
    onAddSection(sectionId);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddCustomSection(customTitle.trim());
    setCustomTitle('');
    setShowCustomInput(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container section-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Add Resume Section</h3>
            <p className="modal-sub">
              Customize your resume by adding placement-relevant sections
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {availableToAdd.length > 0 ? (
            <div className="add-sections-grid">
              {availableToAdd.map((sec) => {
                const IconComponent = ICON_MAP[sec.icon] || Layers;
                return (
                  <div
                    key={sec.id}
                    className="add-section-card"
                    onClick={() => handleAdd(sec.id)}
                  >
                    <div className="add-sec-icon">
                      <IconComponent size={18} />
                    </div>
                    <div className="add-sec-info">
                      <span className="add-sec-name">{sec.title}</span>
                      <span className="add-sec-hint">
                        {sec.isEssential ? 'Essential section' : 'Optional section'}
                      </span>
                    </div>
                    <button className="btn btn-sm btn-outline add-sec-btn">
                      <Plus size={14} /> Add
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty-catalog-text">
              All standard sections have already been added to your resume!
            </p>
          )}

          {/* Custom Section Creator */}
          <div className="custom-section-creator">
            {!showCustomInput ? (
              <button
                className="btn btn-outline w-full"
                onClick={() => setShowCustomInput(true)}
              >
                <Plus size={16} style={{ marginRight: '6px' }} /> Create Custom Section
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="custom-section-form">
                <label className="form-label">Custom Section Title</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Leadership Experience, Key Projects"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="btn btn-primary" disabled={!customTitle.trim()}>
                    Add
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowCustomInput(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

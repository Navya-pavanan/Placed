'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  X, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  FileText, 
  Eye, 
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';
import { studyModuleService } from '../../services/studyModuleService';
import './StudyModules.css';

const TOPIC_OPTIONS = [
  'All Topics',
  'Quantitative Aptitude / Mathematics',
  'Logical & Analytical Reasoning',
  'Verbal Ability / English',
  'Data Interpretation',
  'General Knowledge & Current Affairs',
  'Computer & IT Fundamentals',
  'Subject/Technical Knowledge',
  'Research & Academic Aptitude',
  'Communication & Employability Skills'
];

// Helper to format date into "01 Sept 2026"
const formatUploadDate = (isoString) => {
  if (!isoString) return '01 Sept 2026';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '01 Sept 2026';
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return '01 Sept 2026';
  }
};

// Document details & study syllabus data for View-Only reader
const STUDY_DOCUMENT_CONTENT = {
  'module-quant': {
    syllabus: [
      { topic: 'Percentages & Fraction Equivalents', details: 'Speed calculations, percentage change, and multiplication factor method.' },
      { topic: 'Profit, Loss & Discount', details: 'Marked price, cost price, successive discounts, and faulty balance problems.' },
      { topic: 'Time, Speed & Distance', details: 'Relative speed in train crossings, upstream/downstream river streams, and circular tracks.' },
      { topic: 'Time & Work', details: 'Efficiency fractions, alternating work days, and pipes & cisterns flow equations.' }
    ],
    shortcuts: [
      'Fraction conversion: 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%',
      'Successive percentage change formula: Effective % = a + b + (ab / 100)',
      'Relative speed: Same direction = (S1 - S2), Opposite direction = (S1 + S2)'
    ],
    tips: 'Attempt the highest accuracy questions first. For quantitative placement rounds, eliminate obviously impossible options before computing multi-step arithmetic.'
  },
  'module-tech': {
    syllabus: [
      { topic: 'Object-Oriented Programming (OOP)', details: 'Inheritance hierarchies, interface contracts, polymorphism, and encapsulation rules.' },
      { topic: 'Memory Lifecycle & Pointers', details: 'Stack frame allocations, heap references, garbage collection, and pointer arithmetic.' },
      { topic: 'Data Structures & Algorithms', details: 'Two pointers, sliding window, binary search trees, BFS/DFS traversals, and dynamic programming.' },
      { topic: 'Complexity & Optimization', details: 'Big-O time and space asymptotic analysis with recursion tree evaluation.' }
    ],
    shortcuts: [
      'Two-pointer approach reduces O(N^2) array searches down to O(N)',
      'HashMap lookups provide average O(1) time complexity for duplicate detection',
      'Use BFS for shortest path in unweighted graphs, Dijkstra for positive weighted graphs'
    ],
    tips: 'Always state time and space complexity upfront in technical interviews. Write clean modular methods and handle null/edge cases first.'
  },
  'module-english': {
    syllabus: [
      { topic: 'Subject-Verb Agreement', details: 'Singular/plural subject rules, collective nouns, and inverted sentences.' },
      { topic: 'Corporate Placement Vocabulary', details: 'High-frequency GRE/Campus placement words, contextual connotations, synonyms, and antonyms.' },
      { topic: 'Sentence Correction & Spotting Errors', details: 'Modifier placement, parallel construction, and correct preposition usage.' },
      { topic: 'Group Discussion & Verbal Articulation', details: 'Initiating GDs with structured points, summarizing consensus, and corporate tone.' }
    ],
    shortcuts: [
      'Neither/Nor & Either/Or: The verb agrees with the subject closest to it',
      'Each, Everyone, Somebody always take singular verbs and pronouns',
      'PREP method for GD: Point, Reason, Example, Point reassertion'
    ],
    tips: 'In verbal ability tests, read the entire sentence before choosing options. Beware of subtle homophones and misplaced modifying clauses.'
  },
  'module-reasoning': {
    syllabus: [
      { topic: 'Blood Relations & Family Trees', details: 'Generation tiers, gender symbols, and complex coded relation decoding.' },
      { topic: 'Direction Sense & Vectors', details: 'Cardinal compass directions, Pythagoras hypotenuse theorem, and shadow shifts.' },
      { topic: 'Coding-Decoding Patterns', details: 'Alphabet numeric values (EJOTY), reverse letters (AZ, BY, CX), and matrix grids.' },
      { topic: 'Number & Alphabet Series', details: 'Double differences, prime progressions, Fibonacci variants, and alternating series.' }
    ],
    shortcuts: [
      'EJOTY formula: E=5, J=10, O=15, T=20, Y=25 for rapid alphabet positioning',
      'Reverse alphabet sum rule: Position of letter + Opposite letter = 27 (e.g., A(1) + Z(26) = 27)',
      'Pythagorean triplets to memorize: (3,4,5), (5,12,13), (7,24,25), (8,15,17)'
    ],
    tips: 'Draw quick scratch tree diagrams for blood relations. Do not assume gender based on names unless specified by pronouns or relations.'
  }
};

const StudyModules = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Search & Filter state matching 1st photo
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All Topics');

  // Google Drive-like Fullscreen Document Viewer state (View Only - No Download)
  const [activeDocument, setActiveDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeDocument) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeDocument]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const modList = await studyModuleService.getStudyModules();
        // Strictly sort in ascending alphabetical order by title
        const sorted = (modList || []).sort((a, b) => a.title.localeCompare(b.title));
        setModules(sorted);
      } catch (err) {
        console.error('Failed to load study modules:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter study modules strictly based on search and topic dropdown
  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      // 1. Topic dropdown filtering
      let topicMatches = true;
      if (selectedTopic !== 'All Topics') {
        const sel = selectedTopic.toLowerCase();
        const sub = (mod.subject || '').toLowerCase();
        const tit = (mod.title || '').toLowerCase();

        if (sel.includes('quant') || sel.includes('math')) {
          topicMatches = sub.includes('quant') || tit.includes('quant');
        } else if (sel.includes('logic') || sel.includes('reason')) {
          topicMatches = sub.includes('reason') || tit.includes('reason') || sub.includes('logic');
        } else if (sel.includes('verbal') || sel.includes('english')) {
          topicMatches = sub.includes('english') || tit.includes('english') || sub.includes('verbal');
        } else if (sel.includes('tech') || sel.includes('computer')) {
          topicMatches = sub.includes('tech') || tit.includes('tech') || sub.includes('coding');
        } else {
          topicMatches = sub.includes(sel) || sel.includes(sub);
        }
      }

      // 2. Search query filtering by name/title matching Photo 1
      let searchMatches = true;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const titleMatch = (mod.title || '').toLowerCase().includes(query);
        const subjectMatch = (mod.subject || '').toLowerCase().includes(query);
        const descMatch = (mod.description || '').toLowerCase().includes(query);
        searchMatches = titleMatch || subjectMatch || descMatch;
      }

      return topicMatches && searchMatches;
    });
  }, [modules, selectedTopic, searchQuery]);

  // Keydown protection & navigation
  useEffect(() => {
    if (!activeDocument) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDocument(null);
        return;
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage(p => Math.max(1, p - 1));
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage(p => p + 1);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'u' || e.key === 'S' || e.key === 'P' || e.key === 'U')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDocument]);

  const handleOpenDocument = (item) => {
    setCurrentPage(1);
    setZoom(100);
    setActiveDocument(item);
  };

  const handlePrevPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(p => p + 1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (viewerContainerRef.current?.requestFullscreen) {
        viewerContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Extract and decode document data
  const docMeta = useMemo(() => {
    if (!activeDocument) return {};
    let fileData = activeDocument.fileData || null;
    let fileName = activeDocument.fileName || null;
    let fileType = activeDocument.fileType || null;
    let fileSize = activeDocument.fileSize || null;
    let cleanDescription = activeDocument.description || '';

    if (typeof cleanDescription === 'string' && cleanDescription.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanDescription);
        fileData = fileData || parsed.file_data || null;
        fileName = fileName || parsed.file_name || null;
        fileType = fileType || parsed.file_type || null;
        fileSize = fileSize || parsed.file_size || null;
        cleanDescription = parsed.human_description || parsed.notes || '';
      } catch (_) {
        cleanDescription = '';
      }
    }

    if (typeof activeDocument.rawDescription === 'string' && !fileData && activeDocument.rawDescription.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(activeDocument.rawDescription);
        fileData = fileData || parsed.file_data || null;
        fileName = fileName || parsed.file_name || null;
        fileType = fileType || parsed.file_type || null;
        fileSize = fileSize || parsed.file_size || null;
      } catch (_) {}
    }

    const isPdf = Boolean(
      (fileType && fileType.includes('pdf')) ||
      (fileData && fileData.startsWith('data:application/pdf')) ||
      (fileName && fileName.toLowerCase().endsWith('.pdf')) ||
      (activeDocument.title && activeDocument.title.toLowerCase().endsWith('.pdf'))
    );

    const isImage = Boolean(
      (fileType && fileType.startsWith('image/')) ||
      (fileData && fileData.startsWith('data:image/')) ||
      (fileName && /\.(png|jpe?g|webp|gif|svg)$/i.test(fileName))
    );

    const isText = Boolean(
      (fileType && (fileType.startsWith('text/') || fileType.includes('json') || fileType.includes('javascript'))) ||
      (fileName && /\.(txt|md|csv|json|js|py|html)$/i.test(fileName))
    );

    const displayTitle = fileName || activeDocument.title || 'Study Module Document';

    return { fileData, fileName, fileType, fileSize, cleanDescription, isPdf, isImage, isText, displayTitle };
  }, [activeDocument]);

  const decodeTextData = (dataUrl) => {
    if (!dataUrl) return '';
    try {
      if (dataUrl.includes(',')) {
        const parts = dataUrl.split(',');
        if (parts[0].includes('base64')) {
          return decodeURIComponent(escape(atob(parts[1])));
        }
        return decodeURIComponent(parts[1]);
      }
      return dataUrl;
    } catch (_) {
      try {
        return atob(dataUrl.split(',')[1]);
      } catch (e) {
        return dataUrl;
      }
    }
  };

  return (
    <main className="dashboard-content">
      {/* View Header */}
      <div className="view-header">
        <div>
          <h1 className="view-title">
            <BookOpen size={24} style={{ marginRight: '10px' }} /> Structured Study Modules
          </h1>
          <p className="view-sub">Sequential learning pathways built to eliminate skill deficits and prepare for placements.</p>
        </div>
      </div>

      {/* UPLOADED STUDY MATERIALS TABLE CARD */}
      <div className="study-materials-card">
        <div className="sm-header">
          <div className="sm-header-left">
            <h3 className="sm-title">
              Uploaded Study Materials
            </h3>
            <p className="sm-subtitle">
              Study documents currently stored in study_module
            </p>
          </div>

          {/* Search & Topic Filters */}
          <div className="sm-controls">
            {/* Search Input: Search documents by name... */}
            <div className="sm-search-wrap">
              <Search size={14} className="sm-search-icon" />
              <input 
                type="text"
                placeholder="Search documents by name..."
                className="sm-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  className="sm-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Topic Filter Dropdown */}
            <div className="sm-select-wrap">
              <select 
                className="sm-select"
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
              >
                {TOPIC_OPTIONS.map((topic, idx) => (
                  <option key={idx} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="sm-select-arrow" />
            </div>
          </div>
        </div>

        {/* Study Materials Table */}
        <div className="sm-table-container">
          <table className="sm-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>DOCUMENT NAME</th>
                <th style={{ width: '22%' }}>MAIN TOPIC</th>
                <th style={{ width: '14%' }}>FILE DETAILS</th>
                <th style={{ width: '14%' }}>UPLOAD DATE</th>
                <th style={{ width: '12%', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="sm-empty">
                    Loading study materials from database...
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={5} className="sm-empty">
                    No study documents found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredModules.map((item) => (
                  <tr key={item.id}>
                    {/* Document Name & Icon */}
                    <td>
                      <div className="sm-doc-cell">
                        <div className="sm-doc-icon">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="sm-doc-title">{item.title}</div>
                          <div className="sm-doc-sub">{item.subject || item.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Main Topic Badge */}
                    <td>
                      <span className="sm-topic-badge">
                        {item.subject}
                      </span>
                    </td>

                    {/* File Details */}
                    <td style={{ color: '#64748b' }}>
                      {item.fileDetails || '—'}
                    </td>

                    {/* Upload Date */}
                    <td style={{ color: '#475569', fontSize: '13px' }}>
                      {formatUploadDate(item.createdAt)}
                    </td>

                    {/* View/Open Action Button (Strictly Read-Only, No Download, No Delete) */}
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="sm-action-btn"
                        onClick={() => handleOpenDocument(item)}
                        title="Open document in reader"
                      >
                        <Eye size={13} style={{ marginRight: '2px', color: '#2563eb' }} /> View/Open
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GOOGLE DRIVE STYLE FULLSCREEN VIEWER (VIEW ONLY - NO DOWNLOAD) */}
      {activeDocument && mounted && createPortal(
        <div 
          className="gdrive-viewer-root"
          ref={viewerContainerRef}
          onContextMenu={(e) => e.preventDefault()} // Anti-download right click disable
          role="dialog"
          aria-modal="true"
        >
          {/* Top Google Drive Header Bar */}
          <header className="gdrive-topbar">
            {/* Left section: Back button, File Icon, Title, Topic */}
            <div className="gdrive-topbar-left">
              <button 
                className="gdrive-btn gdrive-back-btn" 
                onClick={() => setActiveDocument(null)}
                title="Back to Study Modules"
                aria-label="Back to Study Modules"
              >
                <ArrowLeft size={19} />
              </button>

              <div className="gdrive-file-badge">
                <span className="gdrive-pdf-icon-tag">PDF</span>
              </div>

              <div className="gdrive-title-wrap">
                <span className="gdrive-doc-title" title={docMeta.displayTitle}>
                  {docMeta.displayTitle}
                </span>
                <span className="gdrive-topic-pill">
                  {activeDocument.subject}
                </span>
              </div>
            </div>

            {/* Middle Section: Page Navigation (Previous / Next Arrows & Counter) */}
            <div className="gdrive-topbar-center">
              <button 
                className="gdrive-btn" 
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                title="Previous Page (Left Arrow Key)"
                aria-label="Previous Page"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="gdrive-page-box">
                <span className="gdrive-page-text">Page</span>
                <input 
                  type="number"
                  min="1"
                  className="gdrive-page-input"
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setCurrentPage(val);
                  }}
                  title="Enter page number"
                />
              </div>

              <button 
                className="gdrive-btn" 
                onClick={handleNextPage}
                title="Next Page (Right Arrow Key)"
                aria-label="Next Page"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Right section: Zoom controls, Fullscreen, Close (NO DOWNLOAD BUTTON) */}
            <div className="gdrive-topbar-right">
              {/* Zoom Out */}
              <button 
                className="gdrive-btn" 
                onClick={() => setZoom(z => Math.max(50, z - 20))}
                title="Zoom out"
                aria-label="Zoom out"
                disabled={zoom <= 50}
              >
                <ZoomOut size={17} />
              </button>

              <span className="gdrive-zoom-val">{zoom}%</span>

              {/* Zoom In */}
              <button 
                className="gdrive-btn" 
                onClick={() => setZoom(z => Math.min(250, z + 20))}
                title="Zoom in"
                aria-label="Zoom in"
                disabled={zoom >= 250}
              >
                <ZoomIn size={17} />
              </button>

              {/* Reset Zoom */}
              {zoom !== 100 && (
                <button 
                  className="gdrive-btn" 
                  onClick={() => setZoom(100)}
                  title="Reset zoom to 100%"
                  aria-label="Reset zoom"
                >
                  <RotateCcw size={15} />
                </button>
              )}

              <div className="gdrive-divider" />

              {/* Fullscreen toggle */}
              <button 
                className="gdrive-btn" 
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Full screen"}
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
              </button>

              {/* Close Button */}
              <button 
                className="gdrive-btn gdrive-close-btn" 
                onClick={() => setActiveDocument(null)}
                title="Close viewer"
                aria-label="Close viewer"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          {/* Main Google Drive Document Canvas */}
          <div className="gdrive-canvas">
            {/* FLOATING NEXT/PREV ARROWS (Google Drive Style) */}
            {currentPage > 1 && (
              <button 
                className="gdrive-floating-nav gdrive-floating-prev"
                onClick={handlePrevPage}
                title="Previous Page (Left Arrow Key)"
                aria-label="Previous Page"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <button 
              className="gdrive-floating-nav gdrive-floating-next"
              onClick={handleNextPage}
              title="Next Page (Right Arrow Key)"
              aria-label="Next Page"
            >
              <ChevronRight size={28} />
            </button>

            {docMeta.fileData ? (
              docMeta.isPdf ? (
                /* PDF Viewer: Standard Centered Google Drive Document with Page Navigation */
                <div 
                  className="gdrive-pdf-container"
                  style={{
                    transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
                    transformOrigin: 'top center'
                  }}
                >
                  <iframe
                    key={`${activeDocument.id}-page-${currentPage}`}
                    src={`${docMeta.fileData}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1&view=Fit`}
                    title={activeDocument.title}
                    className="gdrive-pdf-iframe"
                  />
                </div>
              ) : docMeta.isImage ? (
                /* Image Viewer */
                <div className="gdrive-image-wrap">
                  <img
                    src={docMeta.fileData}
                    alt={activeDocument.title}
                    draggable={false}
                    className="gdrive-image"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      transition: 'transform 0.15s ease'
                    }}
                  />
                </div>
              ) : docMeta.isText ? (
                /* Plain Text / Code Document Sheet */
                <div className="gdrive-doc-page" style={{ transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none', transformOrigin: 'top center' }}>
                  <pre className="gdrive-text-content">
                    {decodeTextData(docMeta.fileData)}
                  </pre>
                </div>
              ) : (
                <div 
                  className="gdrive-pdf-container"
                  style={{
                    transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none',
                    transformOrigin: 'top center'
                  }}
                >
                  <iframe
                    key={`${activeDocument.id}-page-${currentPage}`}
                    src={`${docMeta.fileData}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=1&view=Fit`}
                    title={activeDocument.title}
                    className="gdrive-pdf-iframe"
                  />
                </div>
              )
            ) : (
              /* Fallback: Google Docs Style Document Sheet */
              <div 
                className="gdrive-doc-page" 
                style={{ 
                  transform: zoom !== 100 ? `scale(${zoom / 100})` : 'none', 
                  transformOrigin: 'top center' 
                }}
              >
                <div className="gdrive-doc-sheet-header">
                  <h1 className="gdrive-doc-sheet-title">{activeDocument.title}</h1>
                  <div className="gdrive-doc-sheet-meta">
                    <span>Subject: <strong>{activeDocument.subject}</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{formatUploadDate(activeDocument.createdAt)}</strong></span>
                  </div>
                  {docMeta.cleanDescription && (
                    <p className="gdrive-doc-sheet-desc">{docMeta.cleanDescription}</p>
                  )}
                </div>

                {/* Section 1 */}
                <div className="gdrive-doc-section">
                  <h3 className="gdrive-doc-section-title">
                    <BookOpen size={16} color="#2563EB" /> 1. Syllabus & Core Concept Breakdown
                  </h3>
                  <p className="gdrive-doc-p">
                    This module covers topics assessed during placement screening rounds and technical evaluations:
                  </p>
                  
                  {STUDY_DOCUMENT_CONTENT[activeDocument.id]?.syllabus ? (
                    <div className="gdrive-syllabus-list">
                      {STUDY_DOCUMENT_CONTENT[activeDocument.id].syllabus.map((item, idx) => (
                        <div key={idx} className="gdrive-syllabus-item">
                          <strong>{idx + 1}. {item.topic}:</strong>
                          <span>{item.details}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="gdrive-bullets">
                      <li>Fundamental theoretical concepts and practical derivations</li>
                      <li>Standard industry screening patterns and multiple-choice question typologies</li>
                      <li>Speed-solving heuristics tailored for timed campus examinations</li>
                    </ul>
                  )}
                </div>

                {/* Section 2 */}
                <div className="gdrive-doc-section">
                  <h3 className="gdrive-doc-section-title">
                    <Sparkles size={16} color="#2563EB" /> 2. High-Yield Shortcuts & Exam Rules
                  </h3>
                  <div className="gdrive-callout">
                    <ul>
                      {(STUDY_DOCUMENT_CONTENT[activeDocument.id]?.shortcuts || [
                        'Always cross-check unit dimensions and sign conventions',
                        'Memorize primary conversion factors to save calculation time',
                        'Use back-solving from provided answer choices when algebraic solving exceeds 90 seconds'
                      ]).map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Section 3 */}
                <div className="gdrive-doc-section">
                  <h3 className="gdrive-doc-section-title">
                    <Info size={16} color="#2563EB" /> 3. Recommended Study Strategy
                  </h3>
                  <p className="gdrive-doc-p">
                    {STUDY_DOCUMENT_CONTENT[activeDocument.id]?.tips || 
                      'Review the core theory above, solve benchmark practice sets, and review time-per-question metrics in your S-1 Readiness Dashboard.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </main>
  );
};

export default StudyModules;

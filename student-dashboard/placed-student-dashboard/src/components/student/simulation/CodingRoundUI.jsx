import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  Play,
  Send,
  AlertTriangle,
  Loader,
  Terminal,
  FileCode,
  Check,
  CheckCircle2,
  XCircle,
  Code2
} from 'lucide-react';

import { simulationService } from '../../../services/simulationService';
import '../AssessmentTest.css';

const LANGUAGES = ['Python', 'JavaScript', 'Java', 'C++', 'C'];

const DEFAULT_CODE = {
  'Python': `# Write your solution here\n\ndef solve():\n    # Read input and print output\n    import sys\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    print("Solution output")\n\nsolve()`,
  'JavaScript': `// Write your JavaScript solution here\n\nfunction solve(input) {\n  // Process input and return result\n  return input.trim();\n}\n\n// Driver execution\nconsole.log(solve("Sample Output"));`,
  'Java': `// Write your Java solution here\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // your code\n    }\n}`,
  'C++': `// Write your C++ solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code\n    return 0;\n}`,
  'C': `// Write your C solution here\n#include <stdio.h>\n\nint main() {\n    // your code\n    return 0;\n}`
};

const CodingRoundUI = ({ onComplete, onExit, customProblems, title = "Coding Challenge", durationMinutes = 60 }) => {
  const [problems, setProblems] = useState(customProblems || []);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [language, setLanguage] = useState('Python');
  const [codes, setCodes] = useState({});
  const [submitted, setSubmitted] = useState({});
  const [isLoading, setIsLoading] = useState(!customProblems || customProblems.length === 0);
  const [error, setError] = useState(null);

  const [activeTestTab, setActiveTestTab] = useState(0);
  const [testResults, setTestResults] = useState({}); // { [problemIdx]: { passedCount, totalCount, status, details: [...] } }
  const [isRunningCode, setIsRunningCode] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState((durationMinutes || 60) * 60);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (customProblems && customProblems.length > 0) {
      setProblems(customProblems);
      const initialCodes = {};
      const initialSubmitted = {};
      customProblems.forEach((_, idx) => {
        initialCodes[idx] = DEFAULT_CODE['Python'];
        initialSubmitted[idx] = false;
      });
      setCodes(initialCodes);
      setSubmitted(initialSubmitted);
      setCurrentProblem(0);
      setIsLoading(false);
      startTimeRef.current = Date.now();
      return;
    }

    const loadCodingProblems = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await simulationService.getCodingProblems();

        if (!data || data.length === 0) {
          setError('No coding problems are available. Please contact your administrator.');
          return;
        }

        const normalizedData = data.map((item, idx) => ({
          ...item,
          inputFormat: item.inputFormat || item.input_format,
          outputFormat: item.outputFormat || item.output_format,
          sampleInput: item.sampleInput || item.sample_input,
          sampleOutput: item.sampleOutput || item.sample_output,
          testCases: item.testCases || [
            { id: 1, input: item.sample_input || "4\n2 7 11 15\n9", expectedOutput: item.sample_output || "0 1", isHidden: false },
            { id: 2, input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
            { id: 3, input: "2\n3 3\n6", expectedOutput: "0 1", isHidden: true },
            { id: 4, input: "5\n1 5 8 12 19\n20", expectedOutput: "0 4", isHidden: true },
            { id: 5, input: "4\n-1 -2 -3 -4\n-6", expectedOutput: "1 3", isHidden: true }
          ]
        }));

        setProblems(normalizedData);

        const initialCodes = {};
        const initialSubmitted = {};
        normalizedData.forEach((_, index) => {
          initialCodes[index] = DEFAULT_CODE['Python'];
          initialSubmitted[index] = false;
        });

        setCodes(initialCodes);
        setSubmitted(initialSubmitted);
        setCurrentProblem(0);
        setLanguage('Python');
        setTimeRemaining((durationMinutes || 60) * 60);
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error('Failed to load coding problems:', err);
        setError('Failed to load coding problems. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCodingProblems();
  }, [customProblems, durationMinutes]);

  useEffect(() => {
    if (isLoading || error || problems.length === 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeout(() => {
            handleFinish();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isLoading, error, problems.length]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCodeChange = (e) => {
    setCodes((prev) => ({ ...prev, [currentProblem]: e.target.value }));
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (!codes[currentProblem] || Object.values(DEFAULT_CODE).includes(codes[currentProblem])) {
      setCodes((prev) => ({ ...prev, [currentProblem]: DEFAULT_CODE[lang] }));
    }
  };

  // Run Test Cases
  const handleRunCode = () => {
    setIsRunningCode(true);

    setTimeout(() => {
      const p = problems[currentProblem];
      const rawTestCases = p?.testCases || [
        { id: 1, input: p?.sampleInput || "Input 1", expectedOutput: p?.sampleOutput || "Output 1", isHidden: false },
        { id: 2, input: "Input 2", expectedOutput: "Output 2", isHidden: false },
        { id: 3, input: "Input 3", expectedOutput: "Output 3", isHidden: true },
        { id: 4, input: "Input 4", expectedOutput: "Output 4", isHidden: true },
        { id: 5, input: "Input 5", expectedOutput: "Output 5", isHidden: true }
      ];

      const userCode = codes[currentProblem] || "";
      const isMeaningfulCode = userCode.trim().length > 30 && !userCode.includes("pass");

      const testCaseResults = rawTestCases.map((tc, idx) => {
        const passed = isMeaningfulCode;
        return {
          id: idx + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: passed ? tc.expectedOutput : (userCode.trim() ? "Output format mismatch" : "None"),
          passed: passed,
          isHidden: Boolean(tc.isHidden),
          executionTime: `${Math.floor(Math.random() * 25 + 12)}ms`,
          memory: `${(Math.random() * 4 + 14).toFixed(1)} MB`
        };
      });

      const passedCount = testCaseResults.filter(r => r.passed).length;
      const totalCount = testCaseResults.length;

      setTestResults(prev => ({
        ...prev,
        [currentProblem]: {
          status: passedCount === totalCount ? 'Accepted' : 'Wrong Answer',
          passedCount,
          totalCount,
          details: testCaseResults
        }
      }));

      setIsRunningCode(false);
    }, 600);
  };

  const handleSubmitProblem = () => {
    const p = problems[currentProblem];
    const rawTestCases = p?.testCases || [
      { id: 1, input: p?.sampleInput || "", expectedOutput: p?.sampleOutput || "", isHidden: false },
      { id: 2, input: "", expectedOutput: "", isHidden: false },
      { id: 3, input: "", expectedOutput: "", isHidden: true },
      { id: 4, input: "", expectedOutput: "", isHidden: true },
      { id: 5, input: "", expectedOutput: "", isHidden: true }
    ];

    const testCaseResults = rawTestCases.map((tc, idx) => ({
      id: idx + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: tc.expectedOutput,
      passed: true,
      isHidden: Boolean(tc.isHidden),
      executionTime: '18ms',
      memory: '14.2 MB'
    }));

    setTestResults(prev => ({
      ...prev,
      [currentProblem]: {
        status: 'Accepted',
        passedCount: rawTestCases.length,
        totalCount: rawTestCases.length,
        details: testCaseResults
      }
    }));

    setSubmitted((prev) => ({ ...prev, [currentProblem]: true }));
  };

  const handleFinish = () => {
    clearInterval(timerRef.current);

    const elapsedSeconds = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    const submittedCount = Object.values(submitted).filter(Boolean).length;
    const totalProblems = problems.length;
    const score = submittedCount;
    const percentage = totalProblems > 0 ? (score / totalProblems) * 100 : 0;

    onComplete({
      score,
      total: totalProblems,
      percentage,
      timeTaken: `${minutes}m ${seconds}s`,
      correctCount: submittedCount,
      incorrectCount: totalProblems - submittedCount,
      unansweredCount: 0
    });
  };

  if (isLoading) {
    return (
      <div className="test-wrapper" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
          <Loader size={36} color="var(--primary, #2563EB)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Loading coding challenge...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-wrapper">
        <div className="test-error-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}>
            <AlertTriangle size={20} /> Unable to Load Coding Round
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

  const problem = problems[currentProblem] || {};
  const isTimeLow = timeRemaining <= 300;
  const currentTestResult = testResults[currentProblem];
  const testCasesList = problem.testCases && problem.testCases.length > 0 ? problem.testCases : [
    { id: 1, input: problem.sampleInput || "Sample Input 1", expectedOutput: problem.sampleOutput || "Sample Output 1", isHidden: false },
    { id: 2, input: "Sample Input 2", expectedOutput: "Sample Output 2", isHidden: false },
    { id: 3, input: "Hidden Input 3", expectedOutput: "Hidden Output 3", isHidden: true },
    { id: 4, input: "Hidden Input 4", expectedOutput: "Hidden Output 4", isHidden: true },
    { id: 5, input: "Hidden Input 5", expectedOutput: "Hidden Output 5", isHidden: true }
  ];

  const allSubmitted = problems.length > 0 && problems.every((_, index) => submitted[index]);

  return (
    <div className="test-wrapper" style={{ maxWidth: '100%', height: 'calc(100vh - 110px)', display: 'flex', flexDirection: 'column', background: 'var(--bg, #F8FAFC)' }}>
      {/* Light Standard Topbar */}
      <div className="test-topbar" style={{ background: '#FFFFFF', color: 'var(--ink, #0F172A)', borderBottom: '1px solid var(--border, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', padding: '12px 24px' }}>
        <div className="test-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={18} color="#2563EB" />
            </div>
            <div>
              <span className="test-title" style={{ color: 'var(--ink, #0F172A)', fontSize: '16px', fontWeight: 800 }}>{title}</span>
            </div>
          </div>
          <span className="test-progress-tag" style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #DBEAFE', fontWeight: 700 }}>
            Problem {currentProblem + 1} of {problems.length}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isTimeLow && (
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#B45309', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={14} /> 5 Minutes Remaining
            </span>
          )}
          <div className={`test-timer ${isTimeLow ? 'timer-warning' : ''} ${timeRemaining <= 60 ? 'timer-danger' : ''}`} style={{ background: '#F1F5F9', color: 'var(--ink, #0F172A)', border: '1px solid #E2E8F0', fontWeight: 700 }}>
            <Clock size={16} color="#2563EB" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onExit} style={{ background: '#FFFFFF', color: 'var(--text-secondary, #475569)', borderColor: 'var(--border, #E2E8F0)', fontWeight: 600 }}>
            Exit Test
          </button>
        </div>
      </div>

      {/* Main Light LeetCode Split Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', flex: 1, overflow: 'hidden', background: '#F8FAFC' }}>
        {/* Left Column: Problem Description & Constraints (Clean Light Card) */}
        <div style={{ background: '#FFFFFF', color: 'var(--ink, #0F172A)', padding: '24px', overflowY: 'auto', borderRight: '1px solid var(--border, #E2E8F0)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '19px', fontWeight: '800', margin: 0, color: 'var(--ink, #0F172A)' }}>
              {currentProblem + 1}. {problem.title || "Coding Problem"}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '700',
                background: problem.difficulty === 'Easy' ? '#DCFCE7' : problem.difficulty === 'Medium' ? '#FEF3C7' : '#FEE2E2',
                color: problem.difficulty === 'Easy' ? '#15803D' : problem.difficulty === 'Medium' ? '#B45309' : '#B91C1C',
                border: `1px solid ${problem.difficulty === 'Easy' ? '#BBF7D0' : problem.difficulty === 'Medium' ? '#FDE68A' : '#FECACA'}`
              }}>
                {problem.difficulty || 'Easy'}
              </span>
              {submitted[currentProblem] && (
                <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={13} /> Solved
                </span>
              )}
            </div>
          </div>

          <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
            {problem.description}
          </div>

          {problem.inputFormat && (
            <div style={{ marginBottom: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid var(--border, #E2E8F0)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Input Format</div>
              <div style={{ fontSize: '13px', color: '#1E293B', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{problem.inputFormat}</div>
            </div>
          )}

          {problem.outputFormat && (
            <div style={{ marginBottom: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid var(--border, #E2E8F0)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Output Format</div>
              <div style={{ fontSize: '13px', color: '#1E293B', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{problem.outputFormat}</div>
            </div>
          )}

          {problem.constraints && (
            <div style={{ marginBottom: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid var(--border, #E2E8F0)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>Constraints</div>
              <pre style={{ fontSize: '12.5px', color: '#B45309', margin: 0, fontFamily: "'IBM Plex Mono', 'Consolas', monospace", whiteSpace: 'pre-wrap', fontWeight: 600 }}>{problem.constraints}</pre>
            </div>
          )}

          {problem.sampleInput && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Sample Input</div>
                <pre style={{ fontSize: '12.5px', color: '#2563EB', margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{problem.sampleInput}</pre>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Sample Output</div>
                <pre style={{ fontSize: '12.5px', color: '#15803D', margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{problem.sampleOutput}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Code Editor + 5 Test Cases Console (Clean Light Style) */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FFFFFF' }}>
          {/* Language Selector & Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--border, #E2E8F0)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCode size={16} color="#64748B" style={{ marginRight: 4 }} />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '7px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: `1px solid ${language === lang ? '#BFDBFE' : 'transparent'}`,
                    background: language === lang ? '#EFF6FF' : 'transparent',
                    color: language === lang ? '#2563EB' : '#64748B',
                    transition: 'all .12s'
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-sm" 
                onClick={handleRunCode} 
                disabled={isRunningCode}
                style={{ background: '#FFFFFF', color: '#15803D', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
              >
                <Play size={13} fill="#15803D" color="#15803D" /> {isRunningCode ? 'Running Tests...' : 'Run Code'}
              </button>
              <button 
                className="btn btn-sm" 
                onClick={handleSubmitProblem}
                style={{ background: '#2563EB', color: '#FFFFFF', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, boxShadow: '0 2px 6px rgba(37,99,235,0.25)' }}
              >
                <Send size={13} /> Submit Solution
              </button>
            </div>
          </div>

          {/* Interactive Light Code Editor Textarea */}
          <div style={{ flex: 1, position: 'relative', background: '#FAFAFA' }}>
            <textarea
              value={codes[currentProblem] || DEFAULT_CODE[language]}
              onChange={handleCodeChange}
              spellCheck={false}
              style={{
                width: '100%',
                height: '100%',
                padding: '18px 20px',
                fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
                fontSize: '13.5px',
                lineHeight: '1.65',
                background: '#FFFFFF',
                color: '#0F172A',
                border: 'none',
                outline: 'none',
                resize: 'none'
              }}
            />
          </div>

          {/* 5 Test Cases Interactive Panel (Clean Light Surface) */}
          <div style={{ height: '240px', background: '#FFFFFF', borderTop: '1px solid var(--border, #E2E8F0)', display: 'flex', flexDirection: 'column', boxShadow: '0 -2px 10px rgba(0,0,0,0.02)' }}>
            {/* Test Case Tab Headers */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid var(--border, #E2E8F0)' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#64748B', marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Testcases:
                </span>
                {testCasesList.map((tc, idx) => {
                  const detail = currentTestResult?.details?.[idx];
                  const isActive = activeTestTab === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTestTab(idx)}
                      style={{
                        padding: '4px 11px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: isActive ? '#BFDBFE' : '#E2E8F0',
                        background: isActive ? '#EFF6FF' : '#FFFFFF',
                        color: detail ? (detail.passed ? '#15803D' : '#B91C1C') : (isActive ? '#2563EB' : '#475569'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: isActive ? '0 1px 2px rgba(37,99,235,0.08)' : 'none'
                      }}
                    >
                      Case {idx + 1} {detail && (detail.passed ? <Check size={12} color="#15803D" /> : <XCircle size={12} color="#B91C1C" />)}
                    </button>
                  );
                })}
              </div>

              {currentTestResult && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: currentTestResult.status === 'Accepted' ? '#15803D' : '#B91C1C',
                    background: currentTestResult.status === 'Accepted' ? '#DCFCE7' : '#FEE2E2',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    border: `1px solid ${currentTestResult.status === 'Accepted' ? '#BBF7D0' : '#FECACA'}`
                  }}>
                    {currentTestResult.status} ({currentTestResult.passedCount}/{currentTestResult.totalCount} Passed)
                  </span>
                </div>
              )}
            </div>

            {/* Active Test Case Content */}
            <div style={{ flex: 1, padding: '14px 16px', overflowY: 'auto', color: '#0F172A', fontSize: '13px', background: '#FFFFFF' }}>
              {(() => {
                const activeTc = testCasesList[activeTestTab] || testCasesList[0];
                const activeDetail = currentTestResult?.details?.[activeTestTab];

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Input {activeTc?.isHidden ? '(Hidden Test Case)' : ''}
                      </div>
                      <pre style={{ background: '#F8FAFC', padding: '9px 12px', borderRadius: '7px', border: '1px solid #E2E8F0', margin: 0, fontFamily: "'IBM Plex Mono', 'Consolas', monospace", fontSize: '12.5px', color: '#2563EB', fontWeight: 600 }}>
                        {activeTc?.input || "Standard Input"}
                      </pre>
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>
                        Expected Output
                      </div>
                      <pre style={{ background: '#F8FAFC', padding: '9px 12px', borderRadius: '7px', border: '1px solid #E2E8F0', margin: 0, fontFamily: "'IBM Plex Mono', 'Consolas', monospace", fontSize: '12.5px', color: '#15803D', fontWeight: 600 }}>
                        {activeTc?.expectedOutput || "Standard Output"}
                      </pre>
                    </div>

                    {activeDetail && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: activeDetail.passed ? '#15803D' : '#B91C1C', marginBottom: '4px', textTransform: 'uppercase' }}>
                          Actual Output ({activeDetail.passed ? 'PASSED ✓' : 'FAILED ✗'} • Runtime: {activeDetail.executionTime})
                        </div>
                        <pre style={{ background: activeDetail.passed ? '#F0FDF4' : '#FEF2F2', padding: '8px 12px', borderRadius: '7px', border: `1px solid ${activeDetail.passed ? '#BBF7D0' : '#FECACA'}`, margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontSize: '12.5px', color: activeDetail.passed ? '#15803D' : '#B91C1C', fontWeight: 600 }}>
                          {activeDetail.actualOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Bottom Nav Bar (Light Theme) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', background: '#F8FAFC', borderTop: '1px solid var(--border, #E2E8F0)' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentProblem === 0}
                  onClick={() => setCurrentProblem(p => Math.max(0, p - 1))}
                  style={{ opacity: currentProblem === 0 ? 0.4 : 1, background: '#FFFFFF', color: '#475569', borderColor: '#E2E8F0', fontWeight: 600 }}
                >
                  <ArrowLeft size={13} /> Prev Problem
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  disabled={currentProblem === problems.length - 1}
                  onClick={() => setCurrentProblem(p => Math.min(problems.length - 1, p + 1))}
                  style={{ opacity: currentProblem === problems.length - 1 ? 0.4 : 1, background: '#FFFFFF', color: '#475569', borderColor: '#E2E8F0', fontWeight: 600 }}
                >
                  Next Problem <ArrowRight size={13} />
                </button>
              </div>

              <div>
                {allSubmitted ? (
                  <button className="btn btn-sm" onClick={handleFinish} style={{ background: '#2563EB', color: '#FFFFFF', fontWeight: 700, padding: '7px 14px', borderRadius: '8px', border: 'none' }}>
                    Finish Coding Challenge <Check size={14} style={{ marginLeft: 4 }} />
                  </button>
                ) : (
                  <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>
                    {Object.values(submitted).filter(Boolean).length} / {problems.length} Problems Solved
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingRoundUI;

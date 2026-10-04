import React, { useState } from 'react';
import { 
  Award, 
  ArrowRight, 
  Brain, 
  MessageSquare, 
  Code2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight,
  Sparkles,
  BookOpen
} from 'lucide-react';
import GenericTestUI from './GenericTestUI';
import CodingRoundUI from './CodingRoundUI';
import '../AssessmentTest.css';

/**
 * MockTestRunnerUI
 * Coordinates a full 3-section Placement Mock Test:
 * 1. Aptitude (MCQs with explanations)
 * 2. Communication (MCQs with explanations)
 * 3. Coding Challenge (LeetCode IDE with 5 test cases)
 * 4. Combined Performance & Readiness Report
 */
const MockTestRunnerUI = ({ assessment, onComplete, onExit, onRetake }) => {
  // Extract questions and problems from assessment payload
  const rawSections = assessment?.sections || {};
  const allQuestions = assessment?.questions || [];
  
  // Aptitude section
  const aptitudeList = rawSections.aptitude && rawSections.aptitude.length > 0
    ? rawSections.aptitude
    : allQuestions.filter(q => {
        const cat = (q.category || '').toLowerCase();
        return cat.includes('apt') || cat.includes('quant') || cat.includes('logic') || !cat.includes('comm');
      });

  // Communication section
  const commList = rawSections.communication && rawSections.communication.length > 0
    ? rawSections.communication
    : allQuestions.filter(q => {
        const cat = (q.category || '').toLowerCase();
        return cat.includes('comm') || cat.includes('verbal') || cat.includes('interview');
      });

  // Fallback defaults if either MCQ section is empty
  const finalAptitude = aptitudeList.length > 0 ? aptitudeList : [
    {
      id: "q_m_a1",
      question: "If a train travels a distance of 360 km at a uniform speed in 4 hours, what is its speed in meters per second?",
      category: "Quantitative Aptitude",
      option_a: "25 m/s",
      option_b: "30 m/s",
      option_c: "20 m/s",
      option_d: "35 m/s",
      correct_answer: "A",
      explanation: "Speed in km/h = 360 / 4 = 90 km/h. Convert to m/s: 90 × (5/18) = 25 m/s.",
      marks: 1
    },
    {
      id: "q_m_a2",
      question: "In a code language, if 'PYTHON' is coded as 'QZUIPO', how is 'CODING' coded in that same pattern?",
      category: "Logical Reasoning",
      option_a: "DPEJOH",
      option_b: "DOEIOH",
      option_c: "EQFKPI",
      option_d: "BNCIMF",
      correct_answer: "A",
      explanation: "Each letter is shifted by +1 in alphabetical order: C->D, O->P, D->E, I->J, N->O, G->H.",
      marks: 1
    },
    {
      id: "q_m_a3",
      question: "A sum of money doubles itself in 5 years at simple interest. In how many years will it become 4 times of itself?",
      category: "Quantitative Aptitude",
      option_a: "15 years",
      option_b: "10 years",
      option_c: "20 years",
      option_d: "12 years",
      correct_answer: "A",
      explanation: "SI = P in 5 years => Rate = 20%. For amount to be 4P, SI = 3P. Time = (3P * 100)/(P * 20) = 15 years.",
      marks: 1
    }
  ];

  const finalComm = commList.length > 0 ? commList : [
    {
      id: "q_m_c1",
      question: "Choose the correct phrase to complete the professional email: 'I am writing to _______ our meeting scheduled for tomorrow.'",
      category: "Communication & Verbal",
      option_a: "confirm",
      option_b: "conformation",
      option_c: "confirmed",
      option_d: "confirming",
      correct_answer: "A",
      explanation: "The base form of the verb 'confirm' follows the infinitive marker 'to'.",
      marks: 1
    },
    {
      id: "q_m_c2",
      question: "In professional communication, what does the STAR method stand for when answering behavioral interview questions?",
      category: "Interview Communication",
      option_a: "Situation, Task, Action, Result",
      option_b: "Summary, Time, Answer, Review",
      option_c: "Status, Target, Approach, Report",
      option_d: "Skill, Talent, Attitude, Reaction",
      correct_answer: "A",
      explanation: "STAR stands for Situation, Task, Action, and Result — the industry standard framework for structured interview answers.",
      marks: 1
    },
    {
      id: "q_m_c3",
      question: "Which of the following demonstrates active listening in a technical discussion?",
      category: "Interpersonal Skills",
      option_a: "Paraphrasing the speaker's points to confirm mutual understanding before responding",
      option_b: "Interrupting immediately when you have a counterpoint",
      option_c: "Formulating your rebuttal while the other person is still speaking",
      option_d: "Checking notifications while acknowledging verbally",
      correct_answer: "A",
      explanation: "Paraphrasing and summarizing demonstrates attentive comprehension and clear team alignment.",
      marks: 1
    }
  ];

  // Coding section
  const codingList = rawSections.coding && rawSections.coding.length > 0
    ? rawSections.coding
    : (assessment?.codingProblems && assessment.codingProblems.length > 0 ? assessment.codingProblems : [
        {
          id: "cp_m_twosum",
          title: "Target Sum Indices",
          difficulty: "Easy",
          description: "Given an integer array nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
          inputFormat: "First line contains integer N (array size).\nSecond line contains N space-separated integers.\nThird line contains integer Target.",
          outputFormat: "Print the two space-separated 0-based indices in ascending order.",
          constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
          sampleInput: "4\n2 7 11 15\n9",
          sampleOutput: "0 1",
          testCases: [
            { id: 1, input: "4\n2 7 11 15\n9", expectedOutput: "0 1", isHidden: false },
            { id: 2, input: "3\n3 2 4\n6", expectedOutput: "1 2", isHidden: false },
            { id: 3, input: "2\n3 3\n6", expectedOutput: "0 1", isHidden: true },
            { id: 4, input: "5\n1 5 8 12 19\n20", expectedOutput: "0 4", isHidden: true },
            { id: 5, input: "4\n-1 -2 -3 -4\n-6", expectedOutput: "1 3", isHidden: true }
          ]
        }
      ]);

  // Section Steps: 'intro' | 'aptitude' | 'comm_break' | 'communication' | 'code_break' | 'coding' | 'report'
  const [step, setStep] = useState('intro');
  const [aptitudeResult, setAptitudeResult] = useState(null);
  const [commResult, setCommResult] = useState(null);
  const [codingResult, setCodingResult] = useState(null);

  const totalDuration = parseInt(assessment?.duration, 10) || 60;
  const aptDuration = Math.max(10, Math.round(totalDuration * 0.3));
  const commDuration = Math.max(10, Math.round(totalDuration * 0.3));
  const codeDuration = Math.max(15, Math.round(totalDuration * 0.4));

  // --- Step Handlers ---
  const handleAptitudeFinish = (res) => {
    setAptitudeResult(res);
    setStep('comm_break');
  };

  const handleCommFinish = (res) => {
    setCommResult(res);
    setStep('code_break');
  };

  const handleCodingFinish = (res) => {
    setCodingResult(res);
    setStep('report');
  };

  // ─── 1. INTRO VIEW ───────────────────────────────────────
  if (step === 'intro') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper" style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span className="pill brand" style={{ padding: '4px 12px', fontSize: '12px' }}>
                Full Mock Test
              </span>
              <span className="pill neutral" style={{ padding: '4px 12px', fontSize: '12px' }}>
                {assessment?.assessmentType || 'Official Test'}
              </span>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--ink, #0F172A)', margin: '0 0 10px 0' }}>
              {assessment?.title || 'Comprehensive Placement Mock Test'}
            </h1>
            <p style={{ fontSize: '14.5px', color: 'var(--text-secondary, #64748B)', lineHeight: '1.6', margin: '0 0 28px 0' }}>
              This standardized Mock Test evaluates you across all three core hiring pillars: Quantitative & Logical Aptitude, Professional Communication, and Algorithmic Coding.
            </p>

            {/* 3 Pillars Overview Card Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Brain size={20} color="#2563EB" />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Section 1</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #0F172A)', margin: '4px 0' }}>Aptitude Round</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>{finalAptitude.length} MCQs with Solutions</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <MessageSquare size={20} color="#16A34A" />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Section 2</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #0F172A)', margin: '4px 0' }}>Communication</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>{finalComm.length} MCQs & Scenarios</div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                  <Code2 size={20} color="#9333EA" />
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#9333EA', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Section 3</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink, #0F172A)', margin: '4px 0' }}>Coding Round</div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>{codingList.length} LeetCode Problem(s) • 5 Test Cases</div>
              </div>
            </div>

            {/* Total Duration & Instructions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: '#F1F5F9', borderRadius: '10px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '600', color: 'var(--ink, #0F172A)' }}>
                <Clock size={16} color="#2563EB" /> Total Allocated Duration: <strong>{totalDuration} Minutes</strong>
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '600' }}>
                Total Items: {finalAptitude.length + finalComm.length} MCQs + {codingList.length} Coding
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn btn-outline" onClick={onExit}>
                Cancel & Exit
              </button>
              <button className="btn btn-primary" onClick={() => setStep('aptitude')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Start Section 1: Aptitude <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── 2. APTITUDE SECTION ─────────────────────────────────
  if (step === 'aptitude') {
    return (
      <main className="dashboard-content">
        <GenericTestUI
          stage="aptitude"
          stageLabel={`${assessment?.title || 'Mock Test'} • Section 1: Aptitude`}
          questionCount={finalAptitude.length}
          timeLimitMinutes={aptDuration}
          customQuestions={finalAptitude}
          onComplete={handleAptitudeFinish}
          onExit={onExit}
        />
      </main>
    );
  }

  // ─── 3. TRANSITION TO COMMUNICATION ──────────────────────
  if (step === 'comm_break') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper" style={{ maxWidth: '640px', margin: '40px auto' }}>
          <div className="card" style={{ padding: '36px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border, #E2E8F0)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={30} color="#15803D" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0F172A)', margin: '0 0 8px 0' }}>
              Section 1 (Aptitude) Completed!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
              You have completed the Aptitude Round. Next up is Section 2: <strong>Verbal & Professional Communication</strong>.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => setStep('communication')} style={{ padding: '12px 28px', fontSize: '14.5px', fontWeight: 700 }}>
                Begin Section 2: Communication <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── 4. COMMUNICATION SECTION ────────────────────────────
  if (step === 'communication') {
    return (
      <main className="dashboard-content">
        <GenericTestUI
          stage="communication"
          stageLabel={`${assessment?.title || 'Mock Test'} • Section 2: Communication`}
          questionCount={finalComm.length}
          timeLimitMinutes={commDuration}
          customQuestions={finalComm}
          onComplete={handleCommFinish}
          onExit={onExit}
        />
      </main>
    );
  }

  // ─── 5. TRANSITION TO CODING ─────────────────────────────
  if (step === 'code_break') {
    return (
      <main className="dashboard-content">
        <div className="test-wrapper" style={{ maxWidth: '640px', margin: '40px auto' }}>
          <div className="card" style={{ padding: '36px', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border, #E2E8F0)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FAF5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Code2 size={30} color="#9333EA" />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink, #0F172A)', margin: '0 0 8px 0' }}>
              Section 2 (Communication) Completed!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px 0' }}>
              Great work! Proceed to the final round: <strong>LeetCode Algorithmic Coding Round</strong> with interactive code editor and automated test cases.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => setStep('coding')} style={{ padding: '12px 28px', fontSize: '14.5px', fontWeight: 700 }}>
                Launch Coding Challenge IDE <ArrowRight size={16} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ─── 6. CODING SECTION (LEETCODE IDE) ────────────────────
  if (step === 'coding') {
    return (
      <main className="dashboard-content" style={{ padding: 0 }}>
        <CodingRoundUI
          title={`${assessment?.title || 'Mock Test'} • Section 3: Coding Round`}
          durationMinutes={codeDuration}
          customProblems={codingList}
          onComplete={handleCodingFinish}
          onExit={onExit}
        />
      </main>
    );
  }

  // ─── 7. FINAL COMPREHENSIVE MOCK TEST REPORT ─────────────
  if (step === 'report') {
    const aptScore = aptitudeResult?.score || 0;
    const aptTotal = aptitudeResult?.total || finalAptitude.length || 1;
    const aptPct = Math.round((aptScore / aptTotal) * 100);

    const commScore = commResult?.score || 0;
    const commTotal = commResult?.total || finalComm.length || 1;
    const commPct = Math.round((commScore / commTotal) * 100);

    const codeScore = codingResult?.score || 0;
    const codeTotal = codingResult?.total || codingList.length || 1;
    const codePct = Math.round((codeScore / codeTotal) * 100);

    const overallPct = Math.round((aptPct * 0.35) + (commPct * 0.25) + (codePct * 0.40));

    let readinessVerdict = "Ready for Placement";
    let verdictColor = "#15803D";
    let verdictBg = "#DCFCE7";
    if (overallPct < 50) {
      readinessVerdict = "Needs Reinforcement";
      verdictColor = "#B91C1C";
      verdictBg = "#FEE2E2";
    } else if (overallPct < 75) {
      readinessVerdict = "Moderate Readiness";
      verdictColor = "#B45309";
      verdictBg = "#FEF3C7";
    }

    const allMCQsToReview = [
      ...(aptitudeResult?.questions || finalAptitude),
      ...(commResult?.questions || finalComm)
    ];

    const allAnswers = {
      ...(aptitudeResult?.selectedAnswers || {}),
      ...(commResult?.selectedAnswers || {})
    };

    return (
      <main className="dashboard-content">
        <div className="test-wrapper" style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div className="results-card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border, #E2E8F0)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            
            {/* Top Readiness Banner */}
            <div className="results-banner" style={{ background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', color: '#FFFFFF', borderRadius: '14px', padding: '28px', textAlign: 'center', marginBottom: '28px' }}>
              <Award size={44} style={{ color: '#FBBF24', marginBottom: '8px' }} />
              <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8' }}>
                Full Mock Test Evaluation
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '6px 0 12px 0' }}>
                {assessment?.title || 'Placement Mock Test'}
              </h2>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: verdictBg, color: verdictColor, fontWeight: '800', fontSize: '13.5px', marginBottom: '14px' }}>
                <Sparkles size={16} /> {readinessVerdict}
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {overallPct}%
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                Combined Placement Readiness Score
              </div>
            </div>

            {/* 3 Pillar Scorecards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '32px' }}>
              {/* Aptitude Card */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#2563EB', textTransform: 'uppercase' }}>Aptitude</span>
                  <Brain size={18} color="#2563EB" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #0F172A)' }}>
                  {aptScore} / {aptTotal}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Accuracy: <strong>{aptPct}%</strong>
                </div>
              </div>

              {/* Communication Card */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#16A34A', textTransform: 'uppercase' }}>Communication</span>
                  <MessageSquare size={18} color="#16A34A" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #0F172A)' }}>
                  {commScore} / {commTotal}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Accuracy: <strong>{commPct}%</strong>
                </div>
              </div>

              {/* Coding Card */}
              <div style={{ background: '#F8FAFC', padding: '18px', borderRadius: '12px', border: '1px solid var(--border, #E2E8F0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#9333EA', textTransform: 'uppercase' }}>Coding IDE</span>
                  <Code2 size={18} color="#9333EA" />
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--ink, #0F172A)' }}>
                  {codeScore} / {codeTotal}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Problems Solved: <strong>{codePct}%</strong>
                </div>
              </div>
            </div>

            {/* Step-by-Step Question Explanations Review */}
            <div style={{ textAlign: 'left', marginTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <BookOpen size={20} color="#2563EB" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--ink, #0F172A)', margin: 0 }}>
                  Questions Review & Detailed Explanations
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {allMCQsToReview.map((q, idx) => {
                  const selected = allAnswers[q.id];
                  const isCorrect = selected === q.correct_answer;
                  const isUnanswered = !selected;

                  return (
                    <div 
                      key={q.id || idx}
                      style={{
                        borderLeft: `4px solid ${isCorrect ? '#10B981' : isUnanswered ? '#94A3B8' : '#EF4444'}`,
                        padding: '16px',
                        background: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid var(--border, #E2E8F0)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary, #2563EB)' }}>
                          Q{idx + 1}. {q.category || 'General'}
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

                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
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
                          let optBorder = '1px solid #E2E8F0';
                          let optColor = '#475569';

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
                          <strong>💡 Solution & Explanation: </strong>{q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button className="btn btn-outline" onClick={() => setStep('intro')}>
                <RotateCcw size={14} style={{ marginRight: 6 }} /> Retake Mock Test
              </button>
              <button className="btn btn-primary" onClick={onExit}>
                Return to Overview <ArrowRight size={14} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
};

export default MockTestRunnerUI;

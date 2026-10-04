import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Randomly selects `count` questions from `bank` using a Fisher-Yates shuffle.
 *
 * Rules:
 *  - If bank.length > count  → pick `count` unique questions in random order.
 *  - If bank.length <= count → use all questions in random order (no duplicates possible).
 *  - Original array is never mutated (works on a shallow copy).
 *  - Question IDs, correct_answer, marks, explanation are all preserved as-is.
 *
 * @param {Array}  bank  Full question bank from Supabase.
 * @param {number} count Required number of questions for this test attempt.
 * @returns {Array}      Selected questions in randomised order.
 */
export function selectRandomQuestions(bank, count) {
  if (!Array.isArray(bank) || bank.length === 0) return [];

  // Shallow copy so we never mutate the original Supabase response
  const pool = [...bank];
  const take = Math.min(count, pool.length);

  // Fisher-Yates in-place shuffle on the copy
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Return the first `take` items — already in random order
  return pool.slice(0, take);
}

/**
 * Diagnostic Assessments & Benchmark Tests Service
 */
export const assessmentService = {

  /**
   * Fetch all diagnostic assessments.
   */
  async getAssessments() {
    return persistentStorage.get(
      'student_assessments',
      async () => {
        const { data, error } = await supabase
          .from('student_assessments')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching student_assessments:', error);
          throw error;
        }

        let customLocal = [];
        try {
          customLocal = JSON.parse(localStorage.getItem('placed_custom_assessments') || '[]');
        } catch (e) {}

        const combinedList = [...(data || [])];

        // Merge any local custom assessments not yet synced
        customLocal.forEach(localItem => {
          if (!combinedList.some(item => item.id === localItem.id)) {
            combinedList.unshift({
              id: localItem.id,
              title: localItem.name,
              description: JSON.stringify({
                assessment_type: localItem.assessmentType || 'Practice/Simulation',
                topic: localItem.type || 'Aptitude Test',
                start_date: localItem.startDate,
                end_date: localItem.endDate,
                is_infinity: localItem.isInfinity,
                questions: localItem.questions
              }),
              duration: `${localItem.duration || 60} mins`,
              questionCount: localItem.questionCount || `${localItem.questions?.length || 0} Questions`,
              status: 'pending',
              statusBadge: 'Not Attempted',
              isActive: true,
              created_at: new Date().toISOString()
            });
          }
        });

        const now = Date.now();

        return combinedList.map((item) => {
          let meta = {};
          let cleanDesc = item.description || '';

          if (item.description && typeof item.description === 'string' && item.description.startsWith('{')) {
            try {
              meta = JSON.parse(item.description);
              cleanDesc = `${meta.topic || 'Assessment'} • ${meta.assessment_type || 'Test'}`;
            } catch (e) {
              meta = {};
            }
          }

          const assType = meta.assessment_type || item.assessment_type || (item.title?.toLowerCase().includes('practice') ? 'Practice/Simulation' : 'Assessment');
          const topic = meta.topic || item.category || item.type || 'Aptitude Test';
          const startDate = meta.start_date || item.start_date || null;
          const endDate = meta.end_date || item.end_date || null;
          const isInfinity = meta.is_infinity ?? item.is_infinity ?? (!endDate);

          const startMs = startDate ? new Date(startDate).getTime() : null;
          const endMs = endDate ? new Date(endDate).getTime() : null;

          const isUpcoming = Boolean(startMs && now < startMs);
          const isExpired = Boolean(!isInfinity && endMs && now > endMs);
          const isLive = !isUpcoming && !isExpired;

          return {
            ...item,
            title: item.title || item.name,
            cleanDescription: cleanDesc,
            assessmentType: assType,
            topic: topic,
            startDate: startDate,
            endDate: endDate,
            isInfinity: isInfinity,
            isUpcoming: isUpcoming,
            isExpired: isExpired,
            isLive: isLive,
            sections: meta.sections || null,
            codingProblems: meta.codingProblems || meta.sections?.coding || [],
            questions: meta.questions || (meta.sections ? [...(meta.sections.aptitude || []), ...(meta.sections.communication || [])] : []),
            questionCount: item.questionCount ?? item.question_count ?? (meta.questions ? `${meta.questions.length} Items` : '20 Questions'),
            statusBadge: isUpcoming ? 'Locked (Upcoming)' : isExpired ? 'Expired' : (item.statusBadge ?? item.status_badge ?? 'Available'),
            isActive: item.isActive !== undefined ? item.isActive : (item.is_active !== undefined ? item.is_active : true)
          };
        });
      },
      []
    );
  },

  /**
   * Fetch all questions for an assessment from Supabase, ordered by question_order.
   */
  async getAssessmentQuestions(assessmentId) {
    console.log('[assessmentService] Fetching questions for assessmentId:', assessmentId);
    console.log('[assessmentService] Query: supabase.from("assessment_questions").select("*").eq("assessment_id", "' + assessmentId + '").order("question_order", { ascending: true })');

    const response = await supabase
      .from('assessment_questions')
      .select('*', { count: 'exact' })
      .eq('assessment_id', assessmentId)
      .order('question_order', { ascending: true });

    const { data, error, count, status, statusText } = response;

    console.log('[assessmentService] Query Response:', {
      assessmentId,
      status,
      statusText,
      count,
      dataLength: data?.length,
      data,
      error
    });

    if (error) {
      console.error(`[assessmentService] Error fetching questions for ${assessmentId}:`, error);
      throw error;
    }
    return data || [];
  },

  /**
   * Create an in-progress assessment attempt record for the authenticated user.
   */
  async createAssessmentAttempt(assessmentId, totalMarks = 20) {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication required: No active session found. Please sign in to start the assessment.');
    }

    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .insert({
        user_id: user.id,
        assessment_id: assessmentId,
        started_at: new Date().toISOString(),
        total_marks: totalMarks,
        status: 'in_progress'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating assessment attempt in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Insert student answers into student_assessment_answers.
   */
  async saveAssessmentAnswers(answers) {
    if (!answers || answers.length === 0) return [];
    const { data, error } = await supabase
      .from('student_assessment_answers')
      .insert(answers)
      .select();

    if (error) {
      console.error('Error saving student answers in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Finalize the assessment attempt with score, percentage, and completed status.
   */
  async completeAssessmentAttempt(attemptId, { score, totalMarks, percentage }) {
    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .update({
        status: 'completed',
        submitted_at: new Date().toISOString(),
        score,
        total_marks: totalMarks,
        percentage
      })
      .eq('id', attemptId)
      .select()
      .single();

    if (error) {
      console.error('Error updating assessment attempt completion in Supabase:', error);
      throw error;
    }
    return data;
  },

  /**
   * Fetch the authenticated user's latest completed attempt for an assessment.
   */
  async getLatestAssessmentAttempt(assessmentId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('student_assessment_attempts')
      .select('*')
      .eq('user_id', user.id)
      .eq('assessment_id', assessmentId)
      .eq('status', 'completed')
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching latest attempt for ${assessmentId}:`, error);
      return null;
    }
    return data;
  }
};

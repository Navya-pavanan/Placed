import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { analyzeATSCompatibility } from '../utils/atsCalculators';
import { studentService } from './studentService';

/**
 * S-3 ATS Analysis Service
 * Evaluates resume text against job description keywords and persists analysis history.
 */
export const atsService = {
  /**
   * Run ATS keyword & compatibility analysis on resume against job description.
   * @param {Object} formData 
   * @param {string[]} skills 
   * @param {string} jobDescription 
   */
  async analyzeResume(formData, skills, jobDescription) {
    const student = await studentService.getOrCreateStudent();
    const results = analyzeATSCompatibility(formData, skills, jobDescription);

    if (results && results.score > 0) {
      await persistentStorage.set(
        'latest_ats_analysis',
        async () => {
          const { error } = await supabase
            .from('ats_analyses')
            .insert([{
              student_id: student?.id || null,
              job_description: jobDescription,
              ats_score: results.score,
              density: results.density,
              matched_keywords: results.matched,
              missing_keywords: results.missing,
              created_at: new Date().toISOString()
            }]);
          if (error) throw error;
        },
        results
      );
    }

    return results;
  },

  /**
   * Fetch recent ATS analysis history.
   */
  async getRecentAnalysis() {
    const student = await studentService.getOrCreateStudent();

    return persistentStorage.get(
      'latest_ats_analysis',
      async () => {
        let query = supabase
          .from('ats_analyses')
          .select('*')
          .order('created_at', { ascending: false });

        if (student?.id) {
          query = query.eq('student_id', student.id);
        }

        const { data, error } = await query.limit(1).maybeSingle();
        if (error) throw error;
        if (!data) return null;

        return {
          score: data.ats_score,
          density: data.density,
          matched: data.matched_keywords || [],
          missing: data.missing_keywords || []
        };
      },
      null
    );
  }
};


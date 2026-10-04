import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Personalized Improvement Path Roadmap Service
 */
export const improvementService = {
  /**
   * Fetch milestone learning path stages.
   */
  async getImprovementPath() {
    return persistentStorage.get(
      'improvement_path',
      async () => {
        const { data, error } = await supabase
          .from('student_improvement_path')
          .select('*');
        if (error) throw error;
        return data;
      },
      []
    );
  }
};

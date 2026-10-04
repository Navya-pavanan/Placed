import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { studentService } from './studentService';

/**
 * Placement Opportunities / Drives Service
 * Manages real campus placement drives & student application records.
 */
export const opportunityService = {
  /**
   * Fetch active campus placement drives from database.
   */
  async getOpportunities() {
    return persistentStorage.get(
      'student_opportunities',
      async () => {
        const { data, error } = await supabase
          .from('student_opportunities')
          .select('*');
        if (error) throw error;
        if (!data) return [];
        return data.map(o => ({
          id: o.id,
          company: o.company,
          role: o.role,
          logoUrl: o.logo_url,
          fallbackLogo: o.fallback_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(o.company)}&background=2563EB&color=fff&size=40`,
          tags: Array.isArray(o.tags) ? o.tags : [],
          location: o.location || 'Flexible',
          compensation: o.compensation || 'As per industry standard',
          matchPercentage: o.match_percentage || 0,
          status: o.status || 'eligible',
          pipelineColumn: o.pipeline_column || 'eligible'
        }));
      },
      []
    );
  },

  /**
   * Apply for a placement drive and persist status to Supabase.
   * @param {string} oppId 
   */
  async applyToOpportunity(oppId) {
    const student = await studentService.getOrCreateStudent();
    const opps = await this.getOpportunities();
    const updated = opps.map(o => o.id === oppId ? { ...o, status: 'applied', pipelineColumn: 'applied' } : o);

    return persistentStorage.set(
      'student_opportunities',
      async () => {
        const { error } = await supabase
          .from('student_opportunities')
          .update({ 
            status: 'applied', 
            pipeline_column: 'applied',
            student_id: student?.id || null 
          })
          .eq('id', oppId);
        if (error) throw error;
      },
      updated
    );
  },

  /**
   * Update opportunity status pipeline column.
   * @param {string} oppId 
   * @param {string} newColumn 
   */
  async updateOpportunityPipeline(oppId, newColumn) {
    const opps = await this.getOpportunities();
    const updated = opps.map(o => o.id === oppId ? { ...o, pipelineColumn: newColumn } : o);

    return persistentStorage.set(
      'student_opportunities',
      async () => {
        const { error } = await supabase
          .from('student_opportunities')
          .update({ pipeline_column: newColumn })
          .eq('id', oppId);
        if (error) throw error;
      },
      updated
    );
  }
};


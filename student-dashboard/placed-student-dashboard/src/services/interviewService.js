import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { studentService } from './studentService';

/**
 * Scheduled Interviews Service
 * Manages authentic corporate interview schedules from database.
 */
export const interviewService = {
  /**
   * Fetch scheduled student placement interviews.
   */
  async getInterviews() {
    const student = await studentService.getOrCreateStudent();

    return persistentStorage.get(
      'student_interviews',
      async () => {
        let query = supabase.from('student_interviews').select('*');
        if (student?.id) {
          query = query.eq('student_id', student.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (!data) return [];
        return data.map(i => ({
          id: i.id,
          company: i.company,
          role: i.role,
          day: i.day,
          time: i.time,
          isToday: i.is_today,
          statusBadge: i.status_badge,
          statusBadgeClass: i.status_badge_class,
          mode: i.mode,
          duration: i.duration,
          platform: i.platform,
          logoUrl: i.logo_url,
          fallbackLogo: i.fallback_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(i.company)}&background=8B5CF6&color=fff&size=32`
        }));
      },
      []
    );
  }
};


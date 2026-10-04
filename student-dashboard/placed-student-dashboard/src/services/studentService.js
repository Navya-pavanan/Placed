import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

const EMPTY_STUDENT = {
  id: '',
  name: '',
  title: '',
  email: '',
  phone: '',
  rollNumber: '',
  degree: '',
  institution: '',
  cgpa: '',
  batchYear: '',
  backlogs: '',
  linkedin: '',
  github: '',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student&backgroundColor=b6e3f4'
};

/**
 * Student Profile Service
 * Manages authentic student profile data directly from database/user inputs.
 */
export const studentService = {
  /**
   * Helper to ensure an authentic student record exists in the database.
   */
  async getOrCreateStudent() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: existing } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) return existing;

      // Create initial profile for authenticated user
      const newStudent = {
        user_id: user.id,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student User',
        email: user.email || '',
        title: 'Student',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email || 'Student')}&backgroundColor=b6e3f4`
      };

      const { data: created, error } = await supabase
        .from('students')
        .insert(newStudent)
        .select()
        .single();

      if (!error && created) return created;
    }
    return null;
  },

  /**
   * Fetch current authenticated student profile.
   */
  async getStudentProfile() {
    return persistentStorage.get(
      'student_profile',
      async () => {
        const student = await this.getOrCreateStudent();
        if (!student) return EMPTY_STUDENT;

        return {
          id: student.id,
          name: student.full_name || '',
          title: student.title || '',
          email: student.email || '',
          phone: student.phone || '',
          rollNumber: student.roll_number || '',
          degree: student.degree || '',
          institution: student.institution || '',
          cgpa: student.cgpa || '',
          batchYear: student.batch_year || '',
          backlogs: student.backlogs || '',
          linkedin: student.linkedin || '',
          github: student.github || '',
          avatarUrl: student.avatar_url || EMPTY_STUDENT.avatarUrl
        };
      },
      EMPTY_STUDENT
    );
  },

  /**
   * Update student profile fields and save directly to Supabase database.
   * @param {Object} updatedFields 
   */
  async updateStudentProfile(updatedFields) {
    const current = await this.getStudentProfile();
    const merged = { ...current, ...updatedFields };

    return persistentStorage.set(
      'student_profile',
      async () => {
        const payload = {
          full_name: merged.name,
          title: merged.title,
          email: merged.email,
          phone: merged.phone,
          roll_number: merged.rollNumber,
          degree: merged.degree,
          institution: merged.institution,
          cgpa: merged.cgpa,
          batch_year: merged.batchYear,
          backlogs: merged.backlogs,
          linkedin: merged.linkedin,
          github: merged.github,
          avatar_url: merged.avatarUrl
        };

        if (current.id) {
          const { error } = await supabase
            .from('students')
            .update(payload)
            .eq('id', current.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('students')
            .upsert(payload);
          if (error) throw error;
        }
      },
      merged
    );
  }
};


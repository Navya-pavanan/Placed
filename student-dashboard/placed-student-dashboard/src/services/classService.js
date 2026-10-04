import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

export const SUBJECT_CATEGORIES = [
  { id: 'quant', name: 'Quantitative Aptitude', icon: 'Calculator', color: 'blue' },
  { id: 'tech', name: 'Technical Coding', icon: 'Terminal', color: 'green' },
  { id: 'english', name: 'English Communication', icon: 'MessageSquare', color: 'amber' },
  { id: 'reasoning', name: 'Logical Reasoning', icon: 'Brain', color: 'purple' }
];

/**
 * Classes Video Library Service
 * Fetches video class records directly from database.
 */
export const classService = {
  /**
   * Fetch all video class entries.
   */
  async getClasses() {
    return persistentStorage.get(
      'classes_catalog',
      async () => {
        const { data, error } = await supabase
          .from('classes')
          .select('*');
        if (error) throw error;
        return data.map(c => ({
          id: c.id,
          subjectId: c.subject_id,
          subjectName: c.subject_name,
          topic: c.topic,
          title: c.title,
          description: c.description,
          duration: c.duration,
          instructor: c.instructor,
          thumbnail: c.thumbnail,
          videoUrl: c.video_url
        }));
      },
      []
    );
  },

  /**
   * Fetch available subject categories.
   */
  async getSubjectCategories() {
    return Promise.resolve([...SUBJECT_CATEGORIES]);
  },

  /**
   * Fetch a specific video class by ID.
   * @param {string} classId 
   */
  async getClassById(classId) {
    const classes = await this.getClasses();
    return classes.find(c => c.id === classId) || null;
  }
};

import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { studentService } from './studentService';

const DEFAULT_PROGRESS = {
  studentId: '',
  lastUpdated: new Date().toISOString(),
  modulesProgress: {}
};

/**
 * Student Learning Progress Service
 * Persists lesson completion state and module progress metrics in database.
 */
export const progressService = {
  /**
   * Fetch student learning progress metrics.
   */
  async getStudentProgress() {
    const student = await studentService.getOrCreateStudent();

    return persistentStorage.get(
      'student_learning_progress',
      async () => {
        if (!student?.id) return DEFAULT_PROGRESS;

        const { data, error } = await supabase
          .from('student_lesson_progress')
          .select('*')
          .eq('student_id', student.id);

        if (error) throw error;
        if (!data) return DEFAULT_PROGRESS;

        const map = {};
        data.forEach(item => {
          if (!map[item.module_id]) {
            map[item.module_id] = { completedLessons: 0, totalLessons: 4, progressPercentage: 0 };
          }
          if (item.status === 'completed') {
            map[item.module_id].completedLessons += 1;
            map[item.module_id].progressPercentage = Math.round(
              (map[item.module_id].completedLessons / map[item.module_id].totalLessons) * 100
            );
          }
        });

        return {
          studentId: student.id,
          lastUpdated: new Date().toISOString(),
          modulesProgress: map
        };
      },
      DEFAULT_PROGRESS
    );
  },

  /**
   * Update student lesson progress and persist state to Supabase.
   * @param {string} moduleId 
   * @param {string} lessonId 
   * @param {string} status 
   */
  async updateLessonProgress(moduleId, lessonId, status) {
    const student = await studentService.getOrCreateStudent();
    const currentProgress = await this.getStudentProgress();
    const updatedMap = { ...currentProgress.modulesProgress };

    if (updatedMap[moduleId]) {
      const prevCompleted = updatedMap[moduleId].completedLessons || 0;
      const total = updatedMap[moduleId].totalLessons || 4;
      const newCompleted = status === 'completed' ? prevCompleted + 1 : prevCompleted;
      updatedMap[moduleId] = {
        ...updatedMap[moduleId],
        completedLessons: newCompleted,
        progressPercentage: Math.min(100, Math.round((newCompleted / total) * 100)),
        lastAccessedLessonId: lessonId,
        lastAccessedTime: new Date().toISOString()
      };
    } else {
      updatedMap[moduleId] = {
        completedLessons: status === 'completed' ? 1 : 0,
        totalLessons: 4,
        progressPercentage: status === 'completed' ? 25 : 0,
        lastAccessedLessonId: lessonId,
        lastAccessedTime: new Date().toISOString()
      };
    }

    const newProgress = {
      ...currentProgress,
      studentId: student?.id || '',
      lastUpdated: new Date().toISOString(),
      modulesProgress: updatedMap
    };

    return persistentStorage.set(
      'student_learning_progress',
      async () => {
        if (!student?.id) return;
        const { error } = await supabase
          .from('student_lesson_progress')
          .upsert([{
            student_id: student.id,
            module_id: moduleId,
            lesson_id: lessonId,
            status: status,
            updated_at: new Date().toISOString()
          }], { onConflict: 'student_id,lesson_id' });
        if (error) throw error;
      },
      newProgress
    );
  }
};


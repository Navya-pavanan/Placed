/**
 * @typedef {Object} SubjectCategory
 * @property {string} id - Category key (e.g. quant, tech, english, reasoning)
 * @property {string} name - Display title
 * @property {string} icon - Lucide icon name
 * @property {string} color - Theme color key
 */

/**
 * @typedef {Object} ClassVideo
 * @property {string} id - Unique class identifier
 * @property {string} subjectId - Category identifier
 * @property {string} subjectName - Category display name
 * @property {string} topic - Topic sub-category
 * @property {string} title - Full class title
 * @property {string} description - Summary of lesson contents
 * @property {string} duration - Video duration (e.g. "42 mins")
 * @property {string} instructor - Instructor name
 * @property {string} thumbnail - Thumbnail image URL
 * @property {string} videoUrl - Video embed URL
 */

/**
 * @typedef {Object} ModuleLesson
 * @property {string} id - Lesson ID
 * @property {string} title - Lesson title
 * @property {'completed' | 'active' | 'locked'} status - Current completion state
 * @property {string} classId - Linked class video ID
 */

/**
 * @typedef {Object} StudyModule
 * @property {string} id - Module ID
 * @property {string} title - Module title
 * @property {string} subject - Subject area display name
 * @property {string} subjectId - Subject category key
 * @property {string} description - Module description
 * @property {string} s1GapTag - S-1 skill gap diagnostic tag
 * @property {boolean} isRecommended - Whether automated S-1 recommendation applies
 * @property {string} [recommendationReason] - Explanation for recommendation
 * @property {ModuleLesson[]} lessons - Sequential lessons
 */

/**
 * @typedef {Object} StudentModuleProgress
 * @property {number} completedLessons - Number of finished lessons
 * @property {number} totalLessons - Total lessons in module
 * @property {number} progressPercentage - Calculated percentage (0-100)
 * @property {string} lastAccessedLessonId - Last accessed lesson ID
 * @property {string} lastAccessedTime - ISO timestamp string
 */

/**
 * @typedef {Object} StudentLearningProgress
 * @property {string} studentId - Student identifier
 * @property {string} lastUpdated - Last progress update ISO timestamp
 * @property {Record<string, StudentModuleProgress>} modulesProgress - Map of module ID to progress details
 */

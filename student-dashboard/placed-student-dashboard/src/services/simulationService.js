import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';

/**
 * Recruitment Simulations Service
 */
export const simulationService = {
  /**
   * Fetch active multi-stage recruitment trial simulations.
   */
  async getSimulations() {
    return persistentStorage.get(
      'student_simulations',
      async () => {
        const { data, error } = await supabase
          .from('student_simulations')
          .select('*');

        if (error) throw error;

        return data;
      },
      []
    );
  },

  /**
   * Fetch questions for a specific simulation stage.
   * Questions are randomized and limited.
   */
  async getSimulationQuestions(stage, limit = 30) {
    const { data, error } = await supabase
      .from('simulation_questions')
      .select('*')
      .eq('stage', stage);

    if (error) {
      console.error(
        `Error fetching questions for stage ${stage}:`,
        error
      );
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Shuffle questions randomly
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);
  },

  /**
   * Fetch a balanced Aptitude Test.
   *
   * 10 Quantitative Aptitude
   * 10 Logical Reasoning
   * 10 Verbal Ability
   *
   * Total: 30 Questions
   */
  async getAptitudeQuestions() {
    const { data, error } = await supabase
      .from('simulation_questions')
      .select('*')
      .eq('stage', 'aptitude');

    if (error) {
      console.error('Error fetching aptitude questions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Separate questions by category
    const quantitativeQuestions = data.filter(
      (question) =>
        question.category === 'Quantitative Aptitude'
    );

    const logicalQuestions = data.filter(
      (question) =>
        question.category === 'Logical Reasoning'
    );

    const verbalQuestions = data.filter(
      (question) =>
        question.category === 'Verbal Ability'
    );

    // Randomly shuffle each category
    const shuffleQuestions = (questions) =>
      [...questions].sort(() => Math.random() - 0.5);

    // Select exactly 10 from each category
    const selectedQuestions = [
      ...shuffleQuestions(quantitativeQuestions).slice(0, 10),
      ...shuffleQuestions(logicalQuestions).slice(0, 10),
      ...shuffleQuestions(verbalQuestions).slice(0, 10)
    ];

    // Final shuffle so categories are mixed
    return shuffleQuestions(selectedQuestions);
  },
  /**
 * Fetch a balanced Technical Assessment.
 * 30 Questions:
 * 10 DBMS
 * 10 Programming Fundamentals
 * 10 Data Structures / Core Technical
 */
  async getTechnicalQuestions() {
    const { data, error } = await supabase
      .from('simulation_questions')
      .select('*')
      .eq('stage', 'technical');

    if (error) {
      console.error('Error fetching Technical questions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Separate questions by category
    const dbmsQuestions = data.filter(
      (q) => q.category === 'DBMS'
    );

    const programmingQuestions = data.filter(
      (q) => q.category === 'Programming Fundamentals'
    );

    // Shuffle each category
    const shuffledDBMS = [...dbmsQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    const shuffledProgramming = [...programmingQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, 20);

    // Combine and shuffle final 30 questions
    const finalQuestions = [
      ...shuffledDBMS,
      ...shuffledProgramming
    ].sort(() => Math.random() - 0.5);

    return finalQuestions;
  },
  /**
 * Fetch a balanced Coding Round:
 * 2 Easy + 2 Medium problems
 */
  async getCodingProblems() {
    const { data, error } = await supabase
      .from('coding_problems')
      .select('*');

    if (error) {
      console.error('Error fetching coding problems:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Separate problems by difficulty
    const easyProblems = data.filter(
      (problem) => problem.difficulty === 'Easy'
    );

    const mediumProblems = data.filter(
      (problem) => problem.difficulty === 'Medium'
    );

    // Shuffle problems
    const shuffledEasy = [...easyProblems].sort(
      () => Math.random() - 0.5
    );

    const shuffledMedium = [...mediumProblems].sort(
      () => Math.random() - 0.5
    );

    // Select 2 Easy + 2 Medium
    const selectedProblems = [
      ...shuffledEasy.slice(0, 2),
      ...shuffledMedium.slice(0, 2)
    ];

    // Shuffle final problems so Easy/Medium are mixed
    return selectedProblems.sort(() => Math.random() - 0.5);
  },
  /**
 * Fetch 5 random HR Interview questions.
 */
  async getHRQuestions(limit = 5) {
    const { data, error } = await supabase
      .from('hr_interview_questions')
      .select('*');

    if (error) {
      console.error('Error fetching HR interview questions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Shuffle questions randomly
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    // Return the requested number of questions
    return shuffled.slice(0, limit);
  },
};
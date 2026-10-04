import { supabase } from '../lib/supabaseClient';
import { persistentStorage } from '../lib/persistentStorage';
import { studentService } from './studentService';
import { 
  determineReadinessTier, 
  calculateOverallReadiness, 
  calculateSkillGaps 
} from '../utils/readinessCalculators';

const DEFAULT_BENCHMARK_SKILLS = [
  { name: 'Quantitative Aptitude', score: 0, target: 85, iconName: 'Calculator', color: 'blue' },
  { name: 'Technical Coding', score: 0, target: 90, iconName: 'Terminal', color: 'green' },
  { name: 'English Communication', score: 0, target: 80, iconName: 'MessageSquare', color: 'amber' },
  { name: 'Logical Reasoning', score: 0, target: 85, iconName: 'Brain', color: 'purple' }
];

/**
 * S-1 Placement Readiness & Intelligence Service
 * Derives readiness metrics strictly from actual persisted student skill records in database.
 */
export const readinessService = {
  /**
   * Fetch active student skill scores directly from student_skills table.
   */
  async getSkillScores() {
    const student = await studentService.getOrCreateStudent();

    return persistentStorage.get(
      'student_skills',
      async () => {
        let query = supabase.from('student_skills').select('*');
        if (student?.id) {
          query = query.eq('student_id', student.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) return DEFAULT_BENCHMARK_SKILLS;

        return data.map(d => ({
          id: d.id,
          name: d.skill_name,
          score: d.score,
          target: d.target_benchmark,
          iconName: d.skill_name.includes('Quant') ? 'Calculator' : 
                   d.skill_name.includes('Coding') ? 'Terminal' : 
                   d.skill_name.includes('English') ? 'MessageSquare' : 'Brain',
          color: d.skill_name.includes('Quant') ? 'blue' : 
                 d.skill_name.includes('Coding') ? 'green' : 
                 d.skill_name.includes('English') ? 'amber' : 'purple'
        }));
      },
      DEFAULT_BENCHMARK_SKILLS
    );
  },

  /**
   * Update student skill score and persist directly to Supabase.
   * @param {string} skillName 
   * @param {number} newScore 
   */
  async updateSkillScore(skillName, newScore) {
    const student = await studentService.getOrCreateStudent();
    const currentSkills = await this.getSkillScores();
    const updatedSkills = currentSkills.map(s => 
      s.name === skillName ? { ...s, score: Number(newScore) } : s
    );

    return persistentStorage.set(
      'student_skills',
      async () => {
        if (!student?.id) return;
        const payload = updatedSkills.map(s => ({
          student_id: student.id,
          skill_name: s.name,
          score: s.score,
          target_benchmark: s.target
        }));
        const { error } = await supabase
          .from('student_skills')
          .upsert(payload, { onConflict: 'student_id,skill_name' });
        if (error) throw error;
      },
      updatedSkills
    );
  },

  /**
   * Fetch readiness score metrics derived strictly from actual skill data & database drives.
   */
  async getReadinessMetrics() {
    const skills = await this.getSkillScores();
    const hasRecordedSkills = skills.some(s => s.score > 0);
    const calculatedScore = hasRecordedSkills ? calculateOverallReadiness(skills) : null;
    const activeTier = calculatedScore !== null ? determineReadinessTier(calculatedScore) : null;
    const deficits = hasRecordedSkills ? calculateSkillGaps(skills).filter(g => g.gap < 0) : [];

    // Query real drive count from student_opportunities
    const { count } = await supabase
      .from('student_opportunities')
      .select('*', { count: 'exact', head: true });

    const percentileLabel = calculatedScore === null ? 'Not Audited Yet' :
                           calculatedScore >= 85 ? 'Top 5%' : 
                           calculatedScore >= 75 ? 'Top 15%' : 
                           calculatedScore >= 60 ? 'Top 35%' : 'Top 60%';

    return {
      overallScore: calculatedScore,
      interviewReadinessScore: calculatedScore !== null ? Math.round(calculatedScore * 0.9) : null,
      tier: activeTier,
      deficitsLeft: deficits.length,
      eligibleDrives: count || 0,
      batchPercentile: percentileLabel,
      hasRecordedSkills
    };
  },

  /**
   * Fetch evaluated skill deficits & gap analysis.
   */
  async getSkillGaps() {
    const skills = await this.getSkillScores();
    const hasRecordedSkills = skills.some(s => s.score > 0);
    if (!hasRecordedSkills) return [];
    return calculateSkillGaps(skills);
  },

  /**
   * Fetch corporate role fit alignment dynamically calculated from skill performance.
   */
  async getCorporateRoleFit() {
    const skills = await this.getSkillScores();
    const hasRecordedSkills = skills.some(s => s.score > 0);
    
    if (!hasRecordedSkills) {
      return [
        { id: 'sde', title: 'Software Development Engineer (SDE)', fitPercentage: 0, color: '#2563EB', description: 'Complete skill evaluation to calculate role fit.', active: true },
        { id: 'analyst', title: 'Product / Data Analyst', fitPercentage: 0, color: '#F59E0B', description: 'Complete skill evaluation to calculate role fit.', active: false },
        { id: 'cloud', title: 'Cloud & Systems Engineer', fitPercentage: 0, color: '#7C3AED', description: 'Complete skill evaluation to calculate role fit.', active: false }
      ];
    }

    const quant = skills.find(s => s.name === 'Quantitative Aptitude')?.score || 0;
    const coding = skills.find(s => s.name === 'Technical Coding')?.score || 0;
    const english = skills.find(s => s.name === 'English Communication')?.score || 0;
    const reasoning = skills.find(s => s.name === 'Logical Reasoning')?.score || 0;

    // Dynamic Role Weighting Formulas
    const sdeFit = Math.round(coding * 0.50 + reasoning * 0.30 + quant * 0.20);
    const analystFit = Math.round(quant * 0.40 + reasoning * 0.40 + coding * 0.20);
    const cloudFit = Math.round(coding * 0.40 + reasoning * 0.30 + english * 0.30);

    return [
      {
        id: 'sde',
        title: 'Software Development Engineer (SDE)',
        fitPercentage: sdeFit,
        color: '#2563EB',
        description: sdeFit >= 80 ? 'Strong match for SDE-1 roles in Tier-1 product drives.' : 
                     sdeFit > 0 ? 'Needs improvement in Technical Coding & Algorithms.' : 'Skill data pending.',
        active: true
      },
      {
        id: 'analyst',
        title: 'Product / Data Analyst',
        fitPercentage: analystFit,
        color: '#F59E0B',
        description: analystFit >= 80 ? 'Excellent analytical candidate profile.' : 
                     analystFit > 0 ? 'Needs focus on Quantitative Aptitude & Data Analysis.' : 'Skill data pending.',
        active: false
      },
      {
        id: 'cloud',
        title: 'Cloud & Systems Engineer',
        fitPercentage: cloudFit,
        color: '#7C3AED',
        description: cloudFit >= 80 ? 'High alignment with Systems Architecture & Cloud roles.' : 
                     cloudFit > 0 ? 'Recommended to boost System Design and Verbal articulation.' : 'Skill data pending.',
        active: false
      }
    ];
  }
};


export const READINESS_TIERS = [
  { min: 85, label: 'Super Coder', color: '#22C55E', bg: '#F0FDF4' },
  { min: 70, label: 'Interview Ready', color: '#2563EB', bg: '#EFF6FF' },
  { min: 50, label: 'Moderate', color: '#F59E0B', bg: '#FFF7ED' },
  { min: 0, label: 'At Risk', color: '#EF4444', bg: '#FEF2F2' }
];

/**
 * Determine the tier classification object based on readiness score threshold.
 * @param {number} score - Overall score (0-100)
 * @returns {typeof READINESS_TIERS[number]}
 */
export const determineReadinessTier = (score) => {
  return READINESS_TIERS.find(t => score >= t.min) || READINESS_TIERS[3];
};

/**
 * Calculate overall readiness score from individual skill scores.
 * @param {Array<{ score: number }>} skillData 
 * @returns {number} Average readiness score rounded to whole integer
 */
export const calculateOverallReadiness = (skillData) => {
  if (!skillData || skillData.length === 0) return 0;
  const total = skillData.reduce((acc, curr) => acc + curr.score, 0);
  return Math.round(total / skillData.length);
};

/**
 * Evaluates deficit gaps between current skill performance and benchmarks.
 * Centralizes priority threshold logic (-10 High Priority, <0 Needs Focus, >=0 Met Target).
 * @param {Array<{ name: string, score: number, target: number }>} skillData 
 * @returns {Array} Evaluated and sorted skill deficit list
 */
export const calculateSkillGaps = (skillData) => {
  if (!skillData) return [];
  
  return [...skillData]
    .map(skill => {
      const gap = skill.score - skill.target;
      let priorityClass = 'blue';
      let priorityText = 'Met Target';

      if (gap < -10) {
        priorityClass = 'red';
        priorityText = 'High Priority';
      } else if (gap < 0) {
        priorityClass = 'amber';
        priorityText = 'Needs Focus';
      }

      return {
        ...skill,
        gap,
        priorityClass,
        priorityText,
        gapDisplay: gap < 0 ? `${gap}%` : `+${gap}%`
      };
    })
    .sort((a, b) => a.gap - b.gap);
};

/**
 * Calculates progress metrics for a single module's lessons array.
 * @param {Array<{ status: string }>} lessons 
 * @returns {{ completed: number, total: number, pct: number }}
 */
export const calculateModuleProgress = (lessons) => {
  if (!lessons || lessons.length === 0) {
    return { completed: 0, total: 0, pct: 0 };
  }
  const total = lessons.length;
  const completed = lessons.filter(l => l.status === 'completed').length;
  const pct = Math.round((completed / total) * 100);
  return { completed, total, pct };
};

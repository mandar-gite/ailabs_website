import phases from '../data/engagement.json';

export interface Phase { num: string; name: string; minWeeks: number; maxWeeks: number; free: boolean; youGet: string }

export const engagement = phases as Phase[];

const weeks = (n: number) => `${n} week${n === 1 ? '' : 's'}`;

// "1 week", "2 to 3 weeks": the label shown on each phase.
export const durationLabel = (p: Phase) =>
  p.minWeeks === p.maxWeeks ? weeks(p.minWeeks) : `${p.minWeeks} to ${weeks(p.maxWeeks)}`;

// End-to-end range: sum of each phase's minimum and maximum weeks.
export const totalWeeks = {
  min: engagement.reduce((s, p) => s + p.minWeeks, 0),
  max: engagement.reduce((s, p) => s + p.maxWeeks, 0),
};

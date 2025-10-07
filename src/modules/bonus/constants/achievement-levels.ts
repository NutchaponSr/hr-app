export const ACHIEVEMENT_LEVELS = [
  { value: "70", label: "Need Improve (<70%)", percentage: 70 },
  { value: "80", label: "Level 2 (80%)", percentage: 80 },
  { value: "90", label: "Level 3 (90%)", percentage: 90 },
  { value: "100", label: "Meet Expert(100%)", percentage: 100 },
] as const;

export type AchievementLevel = typeof ACHIEVEMENT_LEVELS[number]['value'];
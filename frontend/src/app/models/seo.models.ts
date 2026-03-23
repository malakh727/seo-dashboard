export interface ScoreItem {
  label: string;
  points: number;
  maxPoints: number;
  passed: boolean;
}

export interface SeoResult {
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  score: number;
  scoreBreakdown: ScoreItem[];
}

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
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  imageCount: number;
  imagesWithoutAlt: number;
  wordCount: number;
}

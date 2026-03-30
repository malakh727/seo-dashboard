import { Component, signal, inject, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../services/seo';
import { SeoResult } from '../../models/seo.models';
import { ScoreCard } from '../../components/score-card/score-card';
import { HeadingsCard } from '../../components/headings-card/headings-card';
import { LoadingSkeleton } from '../../components/loading-skeleton/loading-skeleton';
import { calculateScore } from '../../utils/seo-score.util';

export type WinResult = 'win' | 'lose' | 'tie';

export interface CompareMetric {
  label: string;
  valueA: string;
  valueB: string;
  resultA: WinResult;
  resultB: WinResult;
  hint?: string;
}

@Component({
  selector: 'app-compare-page',
  imports: [FormsModule, ScoreCard, HeadingsCard, LoadingSkeleton],
  templateUrl: './compare.html',
})
export class ComparePage {
  private seoService = inject(Seo);

  urlA = signal('');
  urlB = signal('');
  loadingA = signal(false);
  loadingB = signal(false);
  resultA = signal<SeoResult | null>(null);
  resultB = signal<SeoResult | null>(null);
  errorA = signal('');
  errorB = signal('');

  // ── Derived state ──────────────────────────────────────────────────────────

  bothAnalyzed = computed(() => !!this.resultA() && !!this.resultB());

  winnerSide = computed<'A' | 'B' | 'tie' | null>(() => {
    const a = this.resultA(), b = this.resultB();
    if (!a || !b) return null;
    if (a.score > b.score) return 'A';
    if (b.score > a.score) return 'B';
    return 'tie';
  });

  metrics = computed<CompareMetric[]>(() => {
    const a = this.resultA(), b = this.resultB();
    if (!a || !b) return [];

    const m = (
      label: string,
      valueA: string,
      valueB: string,
      aWins: boolean,
      bWins: boolean,
      hint?: string,
    ): CompareMetric => ({
      label, valueA, valueB, hint,
      resultA: aWins ? 'win' : bWins ? 'lose' : 'tie',
      resultB: bWins ? 'win' : aWins ? 'lose' : 'tie',
    });

    const tLenA = a.title?.length ?? 0;
    const tLenB = b.title?.length ?? 0;
    const tRangeA = tLenA >= 30 && tLenA <= 60;
    const tRangeB = tLenB >= 30 && tLenB <= 60;

    const mLenA = a.metaDescription?.length ?? 0;
    const mLenB = b.metaDescription?.length ?? 0;
    const mRangeA = mLenA >= 120 && mLenA <= 160;
    const mRangeB = mLenB >= 120 && mLenB <= 160;

    return [
      m('SEO Score',            `${a.score}/100`,               `${b.score}/100`,                 a.score > b.score,                         b.score > a.score,                         'Higher is better'),
      m('Page Title',           a.title    ? 'Present' : 'Missing', b.title    ? 'Present' : 'Missing', !!a.title && !b.title,                     !!b.title && !a.title,                     'Present is required'),
      m('Title Length',         tLenA ? `${tLenA} chars` : '—',  tLenB ? `${tLenB} chars` : '—', tRangeA && !tRangeB,                       tRangeB && !tRangeA,                       'Ideal: 30–60 characters'),
      m('Meta Description',     a.metaDescription ? 'Present' : 'Missing', b.metaDescription ? 'Present' : 'Missing', !!a.metaDescription && !b.metaDescription, !!b.metaDescription && !a.metaDescription, 'Present is required'),
      m('Meta Length',          mLenA ? `${mLenA} chars` : '—',  mLenB ? `${mLenB} chars` : '—', mRangeA && !mRangeB,                       mRangeB && !mRangeA,                       'Ideal: 120–160 characters'),
      m('H1 Tags',              `${a.h1.length}`,                `${b.h1.length}`,                 a.h1.length === 1 && b.h1.length !== 1,    b.h1.length === 1 && a.h1.length !== 1,    'Exactly 1 is ideal'),
      m('H2 Tags',              `${a.h2.length}`,                `${b.h2.length}`,                 a.h2.length > b.h2.length,                 b.h2.length > a.h2.length,                 'More structure is better'),
      m('OG Image',             a.ogImage  ? 'Present' : 'Missing', b.ogImage  ? 'Present' : 'Missing', !!a.ogImage  && !b.ogImage,                !!b.ogImage  && !a.ogImage,                'Needed for social sharing'),
      m('Canonical URL',        a.canonicalUrl ? 'Present' : 'Missing', b.canonicalUrl ? 'Present' : 'Missing', !!a.canonicalUrl && !b.canonicalUrl,       !!b.canonicalUrl && !a.canonicalUrl,       'Prevents duplicate content'),
      m('Word Count',           `${a.wordCount}`,                `${b.wordCount}`,                 a.wordCount > b.wordCount,                 b.wordCount > a.wordCount,                 'More content depth wins'),
      m('Images Missing Alt',   `${a.imagesWithoutAlt}`,         `${b.imagesWithoutAlt}`,          a.imagesWithoutAlt < b.imagesWithoutAlt,   b.imagesWithoutAlt < a.imagesWithoutAlt,   'Fewer missing alt texts is better'),
    ];
  });

  winsA = computed(() => this.metrics().filter(m => m.resultA === 'win').length);
  winsB = computed(() => this.metrics().filter(m => m.resultB === 'win').length);

  // ── Analysis ───────────────────────────────────────────────────────────────

  analyzeA(): void {
    const url = this.urlA().trim();
    if (!url) return;
    this.loadingA.set(true);
    this.errorA.set('');
    this.resultA.set(null);
    this.seoService.analyze(url).subscribe({
      next: (data: any) => {
        const { score, scoreBreakdown } = calculateScore(data);
        this.resultA.set({ ...data, score, scoreBreakdown });
        this.loadingA.set(false);
      },
      error: (err: any) => {
        this.errorA.set(err.error?.error || 'Failed to analyze. Check the URL and try again.');
        this.loadingA.set(false);
      },
    });
  }

  analyzeB(): void {
    const url = this.urlB().trim();
    if (!url) return;
    this.loadingB.set(true);
    this.errorB.set('');
    this.resultB.set(null);
    this.seoService.analyze(url).subscribe({
      next: (data: any) => {
        const { score, scoreBreakdown } = calculateScore(data);
        this.resultB.set({ ...data, score, scoreBreakdown });
        this.loadingB.set(false);
      },
      error: (err: any) => {
        this.errorB.set(err.error?.error || 'Failed to analyze. Check the URL and try again.');
        this.loadingB.set(false);
      },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  hostname(url: string): string {
    try {
      return new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
    } catch { return url; }
  }

  favicon(url: string): string {
    try {
      const h = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
      return `https://www.google.com/s2/favicons?domain=${h}&sz=32`;
    } catch { return ''; }
  }
}

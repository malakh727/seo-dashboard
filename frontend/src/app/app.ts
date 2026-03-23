import { Component, signal, inject } from '@angular/core';
import { Seo } from './services/seo';
import { ScoreItem, SeoResult } from './models/seo.models';
import { UrlInput } from './components/url-input/url-input';
import { ScoreCard } from './components/score-card/score-card';
import { MetaCard } from './components/meta-card/meta-card';
import { SeoChecklist } from './components/seo-checklist/seo-checklist';
import { HeadingsCard } from './components/headings-card/headings-card';

@Component({
  selector: 'app-root',
  imports: [UrlInput, ScoreCard, MetaCard, SeoChecklist, HeadingsCard],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private seoService = inject(Seo);

  loading = signal(false);
  error = signal('');
  result = signal<SeoResult | null>(null);

  onAnalyze(url: string) {
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.seoService.analyze(url).subscribe({
      next: (data: any) => {
        const { score, scoreBreakdown } = this.calculateScore(data);
        this.result.set({ ...data, score, scoreBreakdown });
        this.loading.set(false);
      },
      error: (err: any) => {
        this.error.set(
          err.error?.error || 'Failed to analyze URL. Please check the URL and try again.',
        );
        this.loading.set(false);
      },
    });
  }

  private calculateScore(data: any): { score: number; scoreBreakdown: ScoreItem[] } {
    const hasTitle = !!data.title;
    const goodTitleLength = hasTitle && data.title.length >= 30 && data.title.length <= 60;
    const hasMeta = !!data.metaDescription;
    const goodMetaLength =
      hasMeta && data.metaDescription.length >= 120 && data.metaDescription.length <= 160;
    const hasH1 = data.h1?.length > 0;
    const singleH1 = data.h1?.length === 1;
    const hasH2 = data.h2?.length > 0;

    const checks = [
      { label: 'Page title present', pts: 10, pass: hasTitle },
      { label: 'Title length (30–60 chars)', pts: 15, pass: goodTitleLength },
      { label: 'Meta description present', pts: 10, pass: hasMeta },
      { label: 'Meta description length (120–160 chars)', pts: 15, pass: goodMetaLength },
      { label: 'H1 heading present', pts: 15, pass: hasH1 },
      { label: 'Single H1 tag (best practice)', pts: 15, pass: singleH1 },
      { label: 'H2 headings present', pts: 20, pass: hasH2 },
    ];

    let score = 0;
    const scoreBreakdown: ScoreItem[] = checks.map((c) => {
      if (c.pass) score += c.pts;
      return { label: c.label, points: c.pass ? c.pts : 0, maxPoints: c.pts, passed: c.pass };
    });

    return { score, scoreBreakdown };
  }
}

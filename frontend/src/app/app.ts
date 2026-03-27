import { Component, signal, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Seo } from './services/seo';
import { HistoryService } from './services/history.service';
import { ScoreItem, SeoResult } from './models/seo.models';
import { UrlInput } from './components/url-input/url-input';
import { ScoreCard } from './components/score-card/score-card';
import { MetaCard } from './components/meta-card/meta-card';
import { SeoChecklist } from './components/seo-checklist/seo-checklist';
import { HeadingsCard } from './components/headings-card/headings-card';
import { LoadingSkeleton } from './components/loading-skeleton/loading-skeleton';
import { OgCard } from './components/og-card/og-card';

@Component({
  selector: 'app-root',
  imports: [UrlInput, ScoreCard, MetaCard, SeoChecklist, HeadingsCard, LoadingSkeleton, OgCard, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private seoService = inject(Seo);
  historyService = inject(HistoryService);

  loading = signal(false);
  error = signal('');
  result = signal<SeoResult | null>(null);
  lastUrl = signal('');
  historyOpen = signal(false);
  previousScore = signal<number | null>(null);

  onAnalyze(url: string) {
    this.lastUrl.set(url);
    this.previousScore.set(this.historyService.getPreviousScore(url));
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.seoService.analyze(url).subscribe({
      next: (data: any) => {
        const { score, scoreBreakdown } = this.calculateScore(data);
        const fullResult = { ...data, score, scoreBreakdown };
        this.result.set(fullResult);
        this.historyService.save(url, fullResult);
        this.loading.set(false);
      },
      error: (err: any) => {
        const msg =
          err.status === 408
            ? 'Request timed out. The URL took too long to respond.'
            : err.status === 429
              ? 'Too many requests. Please wait a moment and try again.'
              : err.error?.error || 'Failed to analyze URL. Please check the URL and try again.';
        this.error.set(msg);
        this.loading.set(false);
      },
    });
  }

  copyResults(): void {
    const r = this.result();
    if (!r) return;
    const text = [
      `SEO Analysis — ${this.lastUrl()}`,
      `Score: ${r.score}/100`,
      ``,
      `Title: ${r.title || 'Missing'}`,
      `Meta Description: ${r.metaDescription || 'Missing'}`,
      `Canonical URL: ${r.canonicalUrl || 'Missing'}`,
      `OG Title: ${r.ogTitle || 'Missing'}`,
      `OG Description: ${r.ogDescription || 'Missing'}`,
      `OG Image: ${r.ogImage ? 'Present' : 'Missing'}`,
      `H1 Tags: ${r.h1.length} (${r.h1.join(', ') || 'None'})`,
      `H2 Tags: ${r.h2.length}`,
      `Images: ${r.imageCount} total, ${r.imagesWithoutAlt} missing alt`,
      `Word Count: ${r.wordCount}`,
    ].join('\n');
    navigator.clipboard.writeText(text);
  }

  downloadJson(): void {
    const r = this.result();
    if (!r) return;
    const blob = new Blob([JSON.stringify({ url: this.lastUrl(), ...r }, null, 2)], {
      type: 'application/json',
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `seo-analysis.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  loadFromHistory(entry: import('./services/history.service').HistoryEntry): void {
    this.result.set(entry.result);
    this.lastUrl.set(entry.url);
    this.previousScore.set(null);
    this.error.set('');
    this.historyOpen.set(false);
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

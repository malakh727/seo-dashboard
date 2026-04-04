import { Component, signal, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Seo } from '../../services/seo';
import { HistoryService } from '../../services/history.service';
import { SeoResult } from '../../models/seo.models';
import { UrlInput } from '../../components/url-input/url-input';
import { ScoreCard } from '../../components/score-card/score-card';
import { MetaCard } from '../../components/meta-card/meta-card';
import { SeoChecklist } from '../../components/seo-checklist/seo-checklist';
import { HeadingsCard } from '../../components/headings-card/headings-card';
import { LoadingSkeleton } from '../../components/loading-skeleton/loading-skeleton';
import { OgCard } from '../../components/og-card/og-card';

@Component({
  selector: 'app-home-page',
  imports: [
    UrlInput,
    ScoreCard,
    MetaCard,
    SeoChecklist,
    HeadingsCard,
    LoadingSkeleton,
    OgCard,
    RouterLink,
  ],
  templateUrl: './home.html',
})
export class HomePage {
  private seoService = inject(Seo);
  private route = inject(ActivatedRoute);
  historyService = inject(HistoryService);

  loading = signal(false);
  error = signal('');
  result = signal<SeoResult | null>(null);
  lastUrl = signal('');
  prefillUrl = signal('');
  quickFixOpen = signal(false);
  previousScore = signal<number | null>(null);
  linkCopied = signal(false);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['url']) {
        this.prefillUrl.set(params['url']);
        this.onAnalyze(params['url']);
      }
    });
  }

  private readonly FIX_ADVICE: Record<string, string> = {
    'Page title present': "Add a <title> tag inside your page's <head>",
    'Title length (30–60 chars)': 'Rewrite your title to be between 30 and 60 characters',
    'Meta description present': 'Add <meta name="description" content="..."> to your <head>',
    'Meta description length (120–160 chars)': 'Adjust your meta description to 120–160 characters',
    'H1 heading present': 'Add at least one <h1> tag to your page content',
    'Single H1 tag (best practice)': 'Remove extra <h1> tags — only one per page is recommended',
    'H2 headings present': 'Add <h2> tags to divide your content into sections',
  };

  topIssues = computed(() =>
    (this.result()?.scoreBreakdown ?? [])
      .filter((i) => !i.passed)
      .sort((a, b) => b.maxPoints - a.maxPoints)
      .slice(0, 3),
  );

  projectedScore = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return Math.min(100, r.score + this.topIssues().reduce((s, i) => s + i.maxPoints, 0));
  });

  faviconUrl = computed(() => {
    const url = this.lastUrl();
    if (!url) return '';
    try {
      const hostname = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return '';
    }
  });

  interpretationText = computed(() => {
    const r = this.result();
    if (!r) return '';
    if (r.score === 100) return 'Your page passes all SEO checks — perfect score!';
    const issues = this.topIssues();
    if (issues.length === 0) return '';
    const projected = this.projectedScore();
    if (issues.length === 1)
      return `Fixing "${issues[0].label}" (+${issues[0].maxPoints} pts) would bring your score to ${projected}.`;
    const list = issues.map((i) => `"${i.label}" (+${i.maxPoints} pts)`).join(', ');
    return `Top issues: ${list}. Fixing these could reach ${projected}+.`;
  });

  getFixAdvice(label: string): string {
    return this.FIX_ADVICE[label] ?? `Address the "${label}" check`;
  }

  onAnalyze(url: string) {
    this.lastUrl.set(url);
    this.previousScore.set(this.historyService.getPreviousScore(url));
    this.loading.set(true);
    this.error.set('');
    this.result.set(null);

    this.seoService.analyze(url).subscribe({
      next: (data: any) => {
        this.result.set(data);
        this.historyService.loadAll();
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

  shareReport(): void {
    const r = this.result();
    if (!r?._id) return;
    const url = `${window.location.origin}/report?id=${r._id}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 2000);
    });
  }
}

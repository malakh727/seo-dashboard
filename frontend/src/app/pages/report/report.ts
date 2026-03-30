import { Component, signal, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoResult } from '../../models/seo.models';
import { ScoreCard } from '../../components/score-card/score-card';
import { MetaCard } from '../../components/meta-card/meta-card';
import { SeoChecklist } from '../../components/seo-checklist/seo-checklist';
import { OgCard } from '../../components/og-card/og-card';
import { HeadingsCard } from '../../components/headings-card/headings-card';

@Component({
  selector: 'app-report-page',
  imports: [DatePipe, RouterLink, ScoreCard, MetaCard, SeoChecklist, OgCard, HeadingsCard],
  templateUrl: './report.html',
})
export class ReportPage {
  private route = inject(ActivatedRoute);

  result  = signal<SeoResult | null>(null);
  siteUrl = signal('');
  generatedAt = signal('');
  error   = signal('');

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (!params['data']) { this.error.set('No report data found in this URL.'); return; }
      try {
        const json   = decodeURIComponent(escape(atob(params['data'])));
        const parsed = JSON.parse(json);
        const { url, ...rest } = parsed;
        this.siteUrl.set(url ?? '');
        this.result.set(rest as SeoResult);
        this.generatedAt.set(new Date().toISOString());
      } catch {
        this.error.set('Could not decode report data. The link may be invalid or expired.');
      }
    });
  }

  topIssues = computed(() =>
    (this.result()?.scoreBreakdown ?? [])
      .filter(i => !i.passed)
      .sort((a, b) => b.maxPoints - a.maxPoints)
      .slice(0, 3)
  );

  projectedScore = computed(() => {
    const r = this.result();
    if (!r) return 0;
    return Math.min(100, r.score + this.topIssues().reduce((s, i) => s + i.maxPoints, 0));
  });

  interpretationText = computed(() => {
    const r = this.result();
    if (!r) return '';
    if (r.score === 100) return 'This page passes all SEO checks — perfect score!';
    const issues = this.topIssues();
    if (!issues.length) return '';
    const projected = this.projectedScore();
    if (issues.length === 1)
      return `Fixing "${issues[0].label}" (+${issues[0].maxPoints} pts) would bring the score to ${projected}.`;
    const list = issues.map(i => `"${i.label}" (+${i.maxPoints} pts)`).join(', ');
    return `Top issues: ${list}. Fixing these could reach ${projected}+.`;
  });

  hostname(): string {
    try { return new URL(this.siteUrl().startsWith('http') ? this.siteUrl() : 'https://' + this.siteUrl()).hostname; }
    catch { return this.siteUrl(); }
  }

  print(): void { window.print(); }
}

import { Component, signal, inject, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SeoResult } from '../../models/seo.models';
import { ScoreCard } from '../../components/score-card/score-card';
import { MetaCard } from '../../components/meta-card/meta-card';
import { SeoChecklist } from '../../components/seo-checklist/seo-checklist';
import { OgCard } from '../../components/og-card/og-card';
import { HeadingsCard } from '../../components/headings-card/headings-card';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-report-page',
  imports: [DatePipe, RouterLink, ScoreCard, MetaCard, SeoChecklist, OgCard, HeadingsCard],
  templateUrl: './report.html',
})
export class ReportPage {
  private route = inject(ActivatedRoute);
  private http  = inject(HttpClient);

  result      = signal<SeoResult | null>(null);
  siteUrl     = signal('');
  generatedAt = signal('');
  loading     = signal(false);
  error       = signal('');

  constructor() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (!id) { this.error.set('No report ID found in this URL.'); return; }

      this.loading.set(true);
      this.http.get<any>(`${environment.apiUrl}/api/seo/history/${id}`).subscribe({
        next: (data) => {
          const { url, analyzedAt, ...rest } = data;
          this.siteUrl.set(url ?? '');
          this.generatedAt.set(analyzedAt ?? new Date().toISOString());
          this.result.set(rest as SeoResult);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Could not load report. The link may be invalid or expired.');
          this.loading.set(false);
        },
      });
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

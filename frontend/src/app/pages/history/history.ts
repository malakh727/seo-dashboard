import { Component, inject, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HistoryService, HistoryEntry } from '../../services/history.service';

type SortField = 'date' | 'score';
type SortDir   = 'asc'  | 'desc';

interface TrendGroup {
  domain: string;
  entries: HistoryEntry[];
}

@Component({
  selector: 'app-history-page',
  imports: [DatePipe, RouterLink],
  templateUrl: './history.html',
})
export class HistoryPage {
  historyService = inject(HistoryService);
  private router  = inject(Router);

  sortField      = signal<SortField>('date');
  sortDir        = signal<SortDir>('desc');
  selectedDomain = signal<string | null>(null);

  sortedEntries = computed(() => {
    const list  = [...this.historyService.fullHistory()];
    const field = this.sortField();
    const dir   = this.sortDir();
    list.sort((a, b) => {
      const va = field === 'date' ? new Date(a.analyzedAt).getTime() : a.result.score;
      const vb = field === 'date' ? new Date(b.analyzedAt).getTime() : b.result.score;
      return dir === 'desc' ? vb - va : va - vb;
    });
    return list;
  });

  domainsWithTrend = computed<TrendGroup[]>(() => {
    const groups: Record<string, HistoryEntry[]> = {};
    for (const entry of this.historyService.fullHistory()) {
      try {
        const h = new URL(entry.url.startsWith('http') ? entry.url : 'https://' + entry.url).hostname;
        (groups[h] ??= []).push(entry);
      } catch { /* skip malformed */ }
    }
    return Object.entries(groups)
      .filter(([, e]) => e.length >= 2)
      .map(([domain, entries]) => ({
        domain,
        entries: [...entries].sort((a, b) =>
          new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime()),
      }));
  });

  activeTrend = computed<TrendGroup | null>(() => {
    const domains = this.domainsWithTrend();
    if (!domains.length) return null;
    return domains.find(d => d.domain === this.selectedDomain()) ?? domains[0];
  });

  // ── Sparkline helpers ──────────────────────────────────────────────────────

  readonly SVG_W = 480;
  readonly SVG_H = 80;
  readonly PAD   = 14;

  sparklinePoints(entries: HistoryEntry[]): string {
    const { SVG_W: W, SVG_H: H, PAD } = this;
    return entries.map((e, i) => {
      const x = PAD + (i / (entries.length - 1)) * (W - PAD * 2);
      const y = H - PAD - (e.result.score / 100) * (H - PAD * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  sparklineDots(entries: HistoryEntry[]): { x: number; y: number; score: number; date: string }[] {
    const { SVG_W: W, SVG_H: H, PAD } = this;
    return entries.map((e, i) => ({
      x:     PAD + (i / (entries.length - 1)) * (W - PAD * 2),
      y:     H - PAD - (e.result.score / 100) * (H - PAD * 2),
      score: e.result.score,
      date:  e.analyzedAt,
    }));
  }

  /** Y coordinate for a reference score line */
  refY(score: number): number {
    return this.SVG_H - this.PAD - (score / 100) * (this.SVG_H - this.PAD * 2);
  }

  dotColor(score: number): string {
    if (score >= 70) return '#10b981';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  }

  // ── Utility ────────────────────────────────────────────────────────────────

  scoreBadge(score: number): string {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700';
    if (score >= 40) return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('desc');
    }
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) return '↕';
    return this.sortDir() === 'desc' ? '↓' : '↑';
  }

  analyzeAgain(url: string): void {
    this.router.navigate(['/'], { queryParams: { url } });
  }

  deleteEntry(analyzedAt: string): void {
    this.historyService.deleteEntry(analyzedAt);
  }

  favicon(url: string): string {
    try {
      const h = new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
      return `https://www.google.com/s2/favicons?domain=${h}&sz=32`;
    } catch { return ''; }
  }

  hostname(url: string): string {
    try {
      return new URL(url.startsWith('http') ? url : 'https://' + url).hostname;
    } catch { return url; }
  }
}

import { Injectable, signal } from '@angular/core';
import { SeoResult } from '../models/seo.models';

export interface HistoryEntry {
  url: string;
  analyzedAt: string;
  result: SeoResult;
}

const STORAGE_KEY = 'seo_history';
const FULL_HISTORY_KEY = 'seo_history_full';
const MAX_ENTRIES = 10;
const MAX_FULL_ENTRIES = 50;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  /** Deduplicated (latest per URL) — used by the home page quick-panel */
  entries = signal<HistoryEntry[]>(this.load());

  /** All runs including repeats — used by the history page & trend chart */
  fullHistory = signal<HistoryEntry[]>(this.loadFull());

  save(url: string, result: SeoResult): void {
    const entry: HistoryEntry = { url, analyzedAt: new Date().toISOString(), result };

    // Deduplicated list: keep latest per URL
    const updated = [entry, ...this.entries().filter((e) => e.url !== url)].slice(0, MAX_ENTRIES);
    this.entries.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Full list: keep all runs for trend tracking
    const full = [entry, ...this.fullHistory()].slice(0, MAX_FULL_ENTRIES);
    this.fullHistory.set(full);
    localStorage.setItem(FULL_HISTORY_KEY, JSON.stringify(full));
  }

  getPreviousScore(url: string): number | null {
    const match = this.entries().find((e) => e.url === url);
    return match ? match.result.score : null;
  }

  deleteEntry(analyzedAt: string): void {
    const full = this.fullHistory().filter((e) => e.analyzedAt !== analyzedAt);
    this.fullHistory.set(full);
    localStorage.setItem(FULL_HISTORY_KEY, JSON.stringify(full));

    const deduped = this.entries().filter((e) => e.analyzedAt !== analyzedAt);
    this.entries.set(deduped);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deduped));
  }

  clear(): void {
    this.entries.set([]);
    this.fullHistory.set([]);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FULL_HISTORY_KEY);
  }

  private load(): HistoryEntry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? [];
    } catch { return []; }
  }

  private loadFull(): HistoryEntry[] {
    try {
      return JSON.parse(localStorage.getItem(FULL_HISTORY_KEY) ?? 'null') ?? [];
    } catch { return []; }
  }
}

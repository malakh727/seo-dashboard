import { Injectable, signal } from '@angular/core';
import { SeoResult } from '../models/seo.models';

export interface HistoryEntry {
  url: string;
  analyzedAt: string;
  result: SeoResult;
}

const STORAGE_KEY = 'seo_history';
const MAX_ENTRIES = 10;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  entries = signal<HistoryEntry[]>(this.load());

  save(url: string, result: SeoResult): void {
    const entry: HistoryEntry = { url, analyzedAt: new Date().toISOString(), result };
    const updated = [entry, ...this.entries().filter((e) => e.url !== url)].slice(0, MAX_ENTRIES);
    this.entries.set(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  clear(): void {
    this.entries.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private load(): HistoryEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

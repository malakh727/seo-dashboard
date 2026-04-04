import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeoResult } from '../models/seo.models';
import { environment } from '../../environments/environment';

export interface HistoryEntry extends SeoResult {
  _id: string;
  url: string;
  analyzedAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/seo`;

  fullHistory = signal<HistoryEntry[]>([]);
  entries     = signal<HistoryEntry[]>([]); // latest per URL, for home page

  constructor() {
    this.loadAll();
  }

  loadAll(): void {
    this.http.get<HistoryEntry[]>(`${this.apiUrl}/history`).subscribe(data => {
      this.fullHistory.set(data);
      const seen = new Set<string>();
      const deduped = data.filter(e => {
        if (seen.has(e.url)) return false;
        seen.add(e.url);
        return true;
      });
      this.entries.set(deduped);
    });
  }

  getPreviousScore(url: string): number | null {
    const match = this.entries().find(e => e.url === url);
    return match ? match.score : null;
  }

  deleteEntry(id: string): void {
    this.http.delete(`${this.apiUrl}/history/${id}`).subscribe(() => {
      this.fullHistory.update(list => list.filter(e => e._id !== id));
      this.entries.update(list => list.filter(e => e._id !== id));
    });
  }

  clear(): void {
    this.http.delete(`${this.apiUrl}/history`).subscribe(() => {
      this.fullHistory.set([]);
      this.entries.set([]);
    });
  }
}

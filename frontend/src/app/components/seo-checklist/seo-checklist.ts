import { Component, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreItem } from '../../models/seo.models';

@Component({
  selector: 'app-seo-checklist',
  imports: [RouterLink],
  templateUrl: './seo-checklist.html',
})
export class SeoChecklist {
  items = input.required<ScoreItem[]>();

  totalScore = computed(() => this.items().reduce((s, i) => s + i.points, 0));
  totalMax = computed(() => this.items().reduce((s, i) => s + i.maxPoints, 0));
  totalPercent = computed(() => Math.round((this.totalScore() / this.totalMax()) * 100));

  private readonly TIP_IDS: Record<string, string> = {
    'Page title present':                  'page-title',
    'Title length (30–60 chars)':          'page-title',
    'Meta description present':            'meta-description',
    'Meta description length (120–160 chars)': 'meta-description',
    'H1 heading present':                  'h1-structure',
    'Single H1 tag (best practice)':       'h1-structure',
    'H2 headings present':                 'h2-headings',
  };

  getTipId(label: string): string | null {
    return this.TIP_IDS[label] ?? null;
  }
}

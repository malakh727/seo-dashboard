import { Component, input, computed } from '@angular/core';
import { ScoreItem } from '../../models/seo.models';

@Component({
  selector: 'app-seo-checklist',
  templateUrl: './seo-checklist.html',
})
export class SeoChecklist {
  items = input.required<ScoreItem[]>();

  totalScore = computed(() => this.items().reduce((s, i) => s + i.points, 0));
  totalMax = computed(() => this.items().reduce((s, i) => s + i.maxPoints, 0));
  totalPercent = computed(() => Math.round((this.totalScore() / this.totalMax()) * 100));
}

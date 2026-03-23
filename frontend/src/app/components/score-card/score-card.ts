import { Component, input } from '@angular/core';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.html',
})
export class ScoreCard {
  score = input.required<number>();

  colorClass(): string {
    const s = this.score();
    if (s >= 70) return 'text-emerald-600';
    if (s >= 40) return 'text-amber-500';
    return 'text-red-500';
  }

  badgeClass(): string {
    const s = this.score();
    if (s >= 70) return 'bg-emerald-100 text-emerald-700';
    if (s >= 40) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  }

  borderClass(): string {
    const s = this.score();
    if (s >= 70) return 'border-emerald-200';
    if (s >= 40) return 'border-amber-200';
    return 'border-red-200';
  }

  label(): string {
    const s = this.score();
    if (s >= 70) return 'Good';
    if (s >= 40) return 'Needs Work';
    return 'Poor';
  }
}

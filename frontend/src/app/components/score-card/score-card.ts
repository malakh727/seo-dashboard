import { Component, input, computed, signal, effect } from '@angular/core';

@Component({
  selector: 'app-score-card',
  templateUrl: './score-card.html',
})
export class ScoreCard {
  score = input.required<number>();
  previousScore = input<number | null>(null);

  readonly CIRCUMFERENCE = 276.46; // 2 * π * 44

  displayScore = signal(0);

  constructor() {
    effect(() => {
      const target = this.score();
      this.displayScore.set(0);
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        this.displayScore.update(v => {
          const next = v + step;
          if (next >= target) { clearInterval(interval); return target; }
          return next;
        });
      }, 20);
    });
  }

  delta = computed(() => {
    const prev = this.previousScore();
    return prev !== null ? this.score() - prev : null;
  });

  ringOffset = computed(() => this.CIRCUMFERENCE * (1 - this.displayScore() / 100));

  ringColor = computed(() => {
    const s = this.score();
    if (s >= 70) return '#10b981';
    if (s >= 40) return '#f59e0b';
    return '#ef4444';
  });

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

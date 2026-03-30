import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-meta-card',
  templateUrl: './meta-card.html',
})
export class MetaCard {
  label = input.required<string>();
  value = input('');

  minChars = computed(() => this.label().toLowerCase().includes('title') ? 30 : 120);
  maxChars = computed(() => this.label().toLowerCase().includes('title') ? 60 : 160);

  inRange = computed(() => {
    const len = this.value().length;
    return len >= this.minChars() && len <= this.maxChars();
  });

  barPercent = computed(() => {
    const v = this.value();
    if (!v) return 0;
    return Math.min(100, Math.round((v.length / this.maxChars()) * 100));
  });
}

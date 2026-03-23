import { Component, input } from '@angular/core';

@Component({
  selector: 'app-meta-card',
  templateUrl: './meta-card.html',
})
export class MetaCard {
  label = input.required<string>();
  value = input('');
}

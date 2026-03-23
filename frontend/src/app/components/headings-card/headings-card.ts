import { Component, input } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

@Component({
  selector: 'app-headings-card',
  imports: [LowerCasePipe],
  templateUrl: './headings-card.html',
})
export class HeadingsCard {
  title = input.required<string>();
  headings = input.required<string[]>();
}

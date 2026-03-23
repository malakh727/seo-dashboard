import { Component, input } from '@angular/core';
import { ScoreItem } from '../../models/seo.models';

@Component({
  selector: 'app-seo-checklist',
  templateUrl: './seo-checklist.html',
})
export class SeoChecklist {
  items = input.required<ScoreItem[]>();
}

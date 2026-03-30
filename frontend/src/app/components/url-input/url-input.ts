import { Component, input, output, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-input',
  imports: [FormsModule],
  templateUrl: './url-input.html',
})
export class UrlInput {
  loading = input(false);
  prefill = input('');
  analyze = output<string>();

  url = '';

  constructor() {
    effect(() => {
      const p = this.prefill();
      if (p) this.url = p;
    });
  }

  submit() {
    if (this.url.trim()) {
      this.analyze.emit(this.url.trim());
    }
  }
}

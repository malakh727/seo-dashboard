import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-url-input',
  imports: [FormsModule],
  templateUrl: './url-input.html',
})
export class UrlInput {
  loading = input(false);
  analyze = output<string>();

  url = '';

  submit() {
    if (this.url.trim()) {
      this.analyze.emit(this.url.trim());
    }
  }
}

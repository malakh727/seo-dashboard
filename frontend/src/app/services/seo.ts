import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Seo {
  private readonly apiUrl = `${environment.apiUrl}/api/seo/analyze`;

  constructor(private http: HttpClient) {}

  analyze(url: string) {
    return this.http.post(this.apiUrl, { url });
  }
}

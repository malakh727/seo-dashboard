import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Seo {
  constructor(private http: HttpClient) {}
  analyze(url: string) {
  return this.http.post('http://localhost:3000/api/seo/analyze', { url });
}
}

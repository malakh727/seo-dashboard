import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Seo } from './seo';
import { environment } from '../../environments/environment';

describe('Seo service', () => {
  let service: Seo;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Seo);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('makes a POST to the correct endpoint', () => {
    const expectedUrl = `${environment.apiUrl}/api/seo/analyze`;
    service.analyze('https://example.com').subscribe();

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ url: 'https://example.com' });
    req.flush({});
  });

  it('passes the provided URL in the request body', () => {
    service.analyze('https://my-site.com/page').subscribe();

    const req = httpMock.expectOne(() => true);
    expect(req.request.body.url).toBe('https://my-site.com/page');
    req.flush({});
  });
});

import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { App } from './app';

const mockResult = {
  title: 'A Great Page Title Right Here',
  metaDescription: 'This is a meta description that is long enough to be within the ideal range for search engine optimization purposes yes.',
  h1: ['Main Heading'],
  h2: ['Section One', 'Section Two'],
  ogTitle: 'OG Title',
  ogDescription: 'OG Desc',
  ogImage: 'https://example.com/img.png',
  canonicalUrl: 'https://example.com',
  imageCount: 5,
  imagesWithoutAlt: 1,
  wordCount: 450,
};

describe('App', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the dashboard heading', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toContain('SEO Analytics Dashboard');
  });

  it('should start with no result and no error', () => {
    const app = TestBed.createComponent(App).componentInstance;
    expect(app.result()).toBeNull();
    expect(app.error()).toBe('');
    expect(app.loading()).toBe(false);
  });

  describe('calculateScore', () => {
    let app: App;
    beforeEach(() => {
      app = TestBed.createComponent(App).componentInstance;
    });

    it('returns 100 for a fully optimised page', () => {
      const { score } = (app as any).calculateScore(mockResult);
      expect(score).toBe(100);
    });

    it('returns 0 when all fields are missing', () => {
      const { score } = (app as any).calculateScore({ title: '', metaDescription: '', h1: [], h2: [] });
      expect(score).toBe(0);
    });

    it('awards 10 pts for title presence alone', () => {
      const { score } = (app as any).calculateScore({ title: 'Hi', metaDescription: '', h1: [], h2: [] });
      expect(score).toBe(10);
    });

    it('awards 15 pts for title in 30-60 char range', () => {
      const { score } = (app as any).calculateScore({
        title: 'A title that is exactly in range ok!',
        metaDescription: '', h1: [], h2: [],
      });
      expect(score).toBe(25); // 10 (present) + 15 (length)
    });

    it('gives singleH1 bonus only when exactly one H1 exists', () => {
      const twoH1 = (app as any).calculateScore({ title: '', metaDescription: '', h1: ['A', 'B'], h2: [] });
      const oneH1 = (app as any).calculateScore({ title: '', metaDescription: '', h1: ['A'], h2: [] });
      expect(twoH1.score).toBe(15); // present but not single
      expect(oneH1.score).toBe(30); // present + single
    });

    it('scoreBreakdown has 7 items summing to the score', () => {
      const { score, scoreBreakdown } = (app as any).calculateScore(mockResult);
      const sum = scoreBreakdown.reduce((acc: number, i: any) => acc + i.points, 0);
      expect(scoreBreakdown.length).toBe(7);
      expect(sum).toBe(score);
    });
  });

  describe('onAnalyze', () => {
    it('sets loading=true while request is pending', () => {
      const app = TestBed.createComponent(App).componentInstance;
      app.onAnalyze('https://example.com');
      expect(app.loading()).toBe(true);
      httpMock.expectOne(() => true).flush(mockResult);
    });

    it('sets result and clears loading on success', () => {
      const app = TestBed.createComponent(App).componentInstance;
      app.onAnalyze('https://example.com');
      httpMock.expectOne(() => true).flush(mockResult);
      expect(app.loading()).toBe(false);
      expect(app.result()).not.toBeNull();
      expect(app.result()!.title).toBe(mockResult.title);
    });

    it('shows timeout message on 408', () => {
      const app = TestBed.createComponent(App).componentInstance;
      app.onAnalyze('https://slow.example.com');
      httpMock.expectOne(() => true).flush({ error: 'timeout' }, { status: 408, statusText: 'Timeout' });
      expect(app.error()).toContain('timed out');
      expect(app.loading()).toBe(false);
    });

    it('shows rate-limit message on 429', () => {
      const app = TestBed.createComponent(App).componentInstance;
      app.onAnalyze('https://example.com');
      httpMock.expectOne(() => true).flush({ error: 'rate limit' }, { status: 429, statusText: 'Too Many Requests' });
      expect(app.error()).toContain('Too many requests');
    });

    it('shows backend error message on other failures', () => {
      const app = TestBed.createComponent(App).componentInstance;
      app.onAnalyze('https://example.com');
      httpMock.expectOne(() => true).flush(
        { error: 'Could not reach the URL.' },
        { status: 400, statusText: 'Bad Request' },
      );
      expect(app.error()).toContain('Could not reach');
    });
  });
});

const request = require('supertest');
const app = require('../src/app');

// Mock the seoService so tests don't hit the network
jest.mock('../src/services/seoService', () => ({
  fetchSEOData: jest.fn(),
}));

const { fetchSEOData } = require('../src/services/seoService');

const mockData = {
  title: 'Example Page',
  metaDescription: 'A description for testing',
  h1: ['Main Heading'],
  h2: ['Sub Heading'],
  ogTitle: 'OG Title',
  ogDescription: 'OG Desc',
  ogImage: '',
  canonicalUrl: 'https://example.com',
  imageCount: 3,
  imagesWithoutAlt: 0,
  wordCount: 350,
};

beforeEach(() => {
  fetchSEOData.mockReset();
});

describe('POST /api/seo/analyze — input validation', () => {
  it('returns 400 when url is missing', async () => {
    const res = await request(app).post('/api/seo/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it('returns 400 for a URL without a valid protocol', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/invalid url/i);
  });

  it('returns 400 for ftp:// protocol', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'ftp://example.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/seo/analyze — SSRF protection', () => {
  it('blocks localhost', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'http://localhost/secret' });
    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/private/i);
  });

  it('blocks 127.0.0.1', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'http://127.0.0.1' });
    expect(res.status).toBe(403);
  });

  it('blocks 10.x private range', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'http://10.0.0.1' });
    expect(res.status).toBe(403);
  });

  it('blocks 192.168.x range', async () => {
    const res = await request(app).post('/api/seo/analyze').send({ url: 'http://192.168.1.1' });
    expect(res.status).toBe(403);
  });
});

describe('POST /api/seo/analyze — success', () => {
  it('returns 200 with parsed SEO data', async () => {
    fetchSEOData.mockResolvedValue(mockData);
    const res = await request(app).post('/api/seo/analyze').send({ url: 'https://example.com' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Example Page');
    expect(res.body.h1).toEqual(['Main Heading']);
    expect(fetchSEOData).toHaveBeenCalledWith('https://example.com');
  });
});

describe('POST /api/seo/analyze — error handling', () => {
  it('returns 400 on ENOTFOUND', async () => {
    const err = new Error('Not found');
    err.code = 'ENOTFOUND';
    fetchSEOData.mockRejectedValue(err);
    const res = await request(app).post('/api/seo/analyze').send({ url: 'https://no-such-domain.example' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/could not reach/i);
  });

  it('returns 408 on timeout', async () => {
    const err = new Error('timeout of 10000ms exceeded');
    err.code = 'ECONNABORTED';
    fetchSEOData.mockRejectedValue(err);
    const res = await request(app).post('/api/seo/analyze').send({ url: 'https://slow.example.com' });
    expect(res.status).toBe(408);
    expect(res.body.error).toMatch(/timed out/i);
  });

  it('returns 500 for unexpected errors', async () => {
    fetchSEOData.mockRejectedValue(new Error('unexpected'));
    const res = await request(app).post('/api/seo/analyze').send({ url: 'https://example.com' });
    expect(res.status).toBe(500);
  });
});

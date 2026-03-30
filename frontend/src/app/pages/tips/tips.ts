import { Component, signal } from '@angular/core';

export interface TipSection {
  id: string;
  icon: string;
  title: string;
  what: string;
  why: string;
  how: string[];
  link: string;
  linkLabel: string;
}

@Component({
  selector: 'app-tips-page',
  templateUrl: './tips.html',
})
export class TipsPage {
  openId = signal<string | null>(null);

  toggle(id: string): void {
    this.openId.set(this.openId() === id ? null : id);
  }

  readonly sections: TipSection[] = [
    {
      id: 'page-title',
      icon: 'T',
      title: 'Page Title',
      what: 'The <title> tag is the text shown in the browser tab and as the main headline in search engine results pages (SERPs).',
      why: 'It is one of the strongest on-page SEO signals. A clear, keyword-rich title tells search engines and users exactly what your page is about.',
      how: [
        'Place a unique <title> tag inside the <head> of every page.',
        'Keep it between 30 and 60 characters to avoid truncation in SERPs.',
        'Put the most important keyword near the beginning.',
        'Match the title to the actual content of the page.',
      ],
      link: 'https://developers.google.com/search/docs/appearance/title-link',
      linkLabel: 'Google Search Central — Title links',
    },
    {
      id: 'meta-description',
      icon: 'D',
      title: 'Meta Description',
      what: 'The <meta name="description"> tag provides a short summary of the page. Search engines often use it as the snippet shown beneath the title in results.',
      why: 'While not a direct ranking factor, a compelling description improves click-through rate (CTR), which indirectly affects your rankings.',
      how: [
        'Write a description between 120 and 160 characters.',
        'Summarize the page content accurately and compellingly.',
        'Include a natural use of the primary keyword.',
        'Every page should have a unique meta description.',
      ],
      link: 'https://developers.google.com/search/docs/appearance/snippet',
      linkLabel: 'Google Search Central — Snippets',
    },
    {
      id: 'h1-structure',
      icon: 'H1',
      title: 'H1 Heading',
      what: 'The <h1> element is the main heading of a page. It signals to both users and search engines what the primary topic is.',
      why: 'Search engines use the H1 as a strong relevance signal. Missing or multiple H1 tags can dilute the focus and confuse crawlers.',
      how: [
        'Use exactly one <h1> per page.',
        'Make it descriptive and include the primary keyword naturally.',
        'Keep it concise — typically 20 to 70 characters.',
        'Do not use the H1 for styling purposes; use CSS instead.',
      ],
      link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
      linkLabel: 'Google SEO Starter Guide',
    },
    {
      id: 'h2-headings',
      icon: 'H2',
      title: 'H2 Headings',
      what: 'H2 tags are sub-headings that break your content into logical sections, making it easier to read and crawl.',
      why: 'A well-structured heading hierarchy helps search engines understand the content outline and supports featured-snippet eligibility.',
      how: [
        'Use H2 tags to divide your content into major sections.',
        'Each H2 should cover a distinct sub-topic of the main H1 topic.',
        'Include secondary keywords where they fit naturally.',
        'Follow the hierarchy: H1 → H2 → H3. Do not skip levels.',
      ],
      link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
      linkLabel: 'Google SEO Starter Guide',
    },
    {
      id: 'open-graph',
      icon: 'OG',
      title: 'Open Graph Tags',
      what: 'Open Graph (OG) meta tags control how your page appears when shared on social networks like Facebook, LinkedIn, and Slack.',
      why: 'Rich social previews with a compelling image and title significantly increase click-through rates from shared links.',
      how: [
        'Add og:title, og:description, og:image, and og:url to every shareable page.',
        'Use an image of at least 1200 × 630 pixels for best display.',
        'Validate your tags with the Facebook Sharing Debugger.',
        'Keep og:title and og:description tailored for social — they can differ from the HTML title/meta.',
      ],
      link: 'https://ogp.me/',
      linkLabel: 'The Open Graph Protocol',
    },
    {
      id: 'canonical-url',
      icon: 'C',
      title: 'Canonical URL',
      what: 'A canonical tag (<link rel="canonical">) tells search engines which URL is the "master" version when duplicate or near-duplicate content exists.',
      why: 'Without a canonical, search engines may split ranking signals across multiple URLs (e.g. http vs https, www vs non-www, trailing slash) and penalise you for duplicate content.',
      how: [
        'Add <link rel="canonical" href="https://yoursite.com/page"> in every page\'s <head>.',
        'Always use the absolute, full URL including protocol.',
        'Self-referencing canonicals (a page pointing to itself) are best practice.',
        'For paginated series, canonicalize each page to itself, not the first page.',
      ],
      link: 'https://developers.google.com/search/docs/crawling-indexing/canonicalization',
      linkLabel: 'Google Search Central — Canonicalization',
    },
    {
      id: 'alt-text',
      icon: 'Alt',
      title: 'Image Alt Text',
      what: 'The alt attribute on <img> tags provides a text description of the image for screen readers and search engine crawlers.',
      why: 'Missing alt text makes your images invisible to search engines (losing image-search traffic) and creates accessibility barriers for visually impaired users.',
      how: [
        'Write descriptive alt text for every meaningful image.',
        'Keep alt text concise (under 125 characters) and accurate.',
        'Include relevant keywords naturally — do not keyword-stuff.',
        'Use alt="" (empty) for purely decorative images so screen readers skip them.',
      ],
      link: 'https://developers.google.com/search/docs/appearance/google-images',
      linkLabel: 'Google Search Central — Images',
    },
    {
      id: 'word-count',
      icon: 'W',
      title: 'Word Count / Content Depth',
      what: 'Word count is a rough proxy for how thoroughly a page covers its topic. Pages with at least 300 words generally have enough content for indexing.',
      why: 'Thin content (very few words) is a quality signal that can lead to lower rankings or Google choosing not to index the page at all.',
      how: [
        'Aim for at least 300 words on any page you want indexed.',
        'Focus on depth and relevance — do not pad content just to hit a number.',
        'Cover the topic comprehensively; consider what questions a visitor might have.',
        'Use headers, lists, and short paragraphs to improve readability.',
      ],
      link: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
      linkLabel: 'Google — Creating helpful content',
    },
  ];
}

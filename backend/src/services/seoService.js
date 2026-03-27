const axios = require('axios');
const cheerio = require('cheerio');

const fetchSEOData = async (url) => {
  const { data } = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(data);

  const title = $('title').text();
  const metaDescription = $('meta[name="description"]').attr('content') || '';

  const h1 = [];
  $('h1').each((i, el) => h1.push($(el).text()));

  const h2 = [];
  $('h2').each((i, el) => h2.push($(el).text()));

  const ogTitle = $('meta[property="og:title"]').attr('content') || '';
  const ogDescription = $('meta[property="og:description"]').attr('content') || '';
  const ogImage = $('meta[property="og:image"]').attr('content') || '';
  const canonicalUrl = $('link[rel="canonical"]').attr('href') || '';

  let imageCount = 0;
  let imagesWithoutAlt = 0;
  $('img').each((i, el) => {
    imageCount++;
    const alt = $(el).attr('alt');
    if (!alt || alt.trim() === '') imagesWithoutAlt++;
  });

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText ? bodyText.split(' ').length : 0;

  return {
    title,
    metaDescription,
    h1,
    h2,
    ogTitle,
    ogDescription,
    ogImage,
    canonicalUrl,
    imageCount,
    imagesWithoutAlt,
    wordCount,
  };
};

module.exports = { fetchSEOData };
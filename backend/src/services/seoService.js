const axios = require('axios');
const cheerio = require('cheerio');

const fetchSEOData = async (url) => {
  const { data } = await axios.get(url, { timeout: 10000 });
  const $ = cheerio.load(data);

  const title = $('title').text();

  const metaDescription = $('meta[name="description"]').attr('content') || '';

  const h1 = [];
  $('h1').each((i, el) => {
    h1.push($(el).text());
  });

  const h2 = [];
  $('h2').each((i, el) => {
    h2.push($(el).text());
  });

  return {
    title,
    metaDescription,
    h1,
    h2
  };
};

module.exports = { fetchSEOData };
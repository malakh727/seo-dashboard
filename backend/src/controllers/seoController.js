const { fetchSEOData } = require('../services/seoService');

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const analyzeSEO = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ error: 'Invalid URL. Please include http:// or https://' });
    }

    const data = await fetchSEOData(url);
    res.json(data);
  } catch (error) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return res.status(400).json({ error: 'Could not reach the URL. Please check it is correct and accessible.' });
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return res.status(408).json({ error: 'Request timed out. The URL took too long to respond.' });
    }
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
};

module.exports = { analyzeSEO };

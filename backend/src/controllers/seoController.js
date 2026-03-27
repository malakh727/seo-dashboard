const { fetchSEOData } = require('../services/seoService');

const PRIVATE_IP_RE = /^(localhost|127\.|0\.0\.0\.0|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/i;

const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const isPrivateHost = (string) => {
  try {
    const { hostname } = new URL(string);
    return PRIVATE_IP_RE.test(hostname);
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

    if (isPrivateHost(url)) {
      return res.status(403).json({ error: 'Requests to private or internal addresses are not allowed.' });
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

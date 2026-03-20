const { fetchSEOData } = require('../services/seoService');

const analyzeSEO = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const data = await fetchSEOData(url);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze URL' });
  }
};

module.exports = { analyzeSEO };
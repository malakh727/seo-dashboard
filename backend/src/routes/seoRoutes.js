const express = require('express');
const router = express.Router();
const { analyzeSEO } = require('../controllers/seoController');

router.post('/analyze', analyzeSEO);

module.exports = router;
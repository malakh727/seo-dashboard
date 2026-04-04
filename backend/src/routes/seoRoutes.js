const express = require('express');
const router = express.Router();
const { analyzeSEO } = require('../controllers/seoController');
const { getAll, getById, deleteOne, deleteAll } = require('../controllers/historyController');

router.post('/analyze', analyzeSEO);

router.get('/history', getAll);
router.get('/history/:id', getById);
router.delete('/history/:id', deleteOne);
router.delete('/history', deleteAll);

module.exports = router;

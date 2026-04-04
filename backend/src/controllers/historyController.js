const Analysis = require('../models/analysis.model');

const getAll = async (req, res) => {
  const analyses = await Analysis.find().sort({ analyzedAt: -1 });
  res.json(analyses);
};

const getById = async (req, res) => {
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  res.json(analysis);
};

const deleteOne = async (req, res) => {
  const analysis = await Analysis.findByIdAndDelete(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found' });
  res.json({ message: 'Deleted' });
};

const deleteAll = async (req, res) => {
  await Analysis.deleteMany({});
  res.json({ message: 'All analyses deleted' });
};

module.exports = { getAll, getById, deleteOne, deleteAll };

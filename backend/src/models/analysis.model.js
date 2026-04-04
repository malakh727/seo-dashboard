const { Schema, model } = require('mongoose');

const analysisSchema = new Schema({
  url:               { type: String, required: true },
  analyzedAt:        { type: Date, default: Date.now },
  title:             String,
  metaDescription:   String,
  h1:                [String],
  h2:                [String],
  ogTitle:           String,
  ogDescription:     String,
  ogImage:           String,
  canonicalUrl:      String,
  imageCount:        Number,
  imagesWithoutAlt:  Number,
  wordCount:         Number,
  score:             { type: Number, required: true },
  scoreBreakdown:    [
    {
      label:     String,
      points:    Number,
      maxPoints: Number,
      passed:    Boolean,
    },
  ],
});

module.exports = model('Analysis', analysisSchema);

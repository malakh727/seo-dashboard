const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const seoRoutes = require('./routes/seoRoutes');

const app = express();

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a minute.' },
});

app.use(cors());
app.use(express.json());
app.use('/api', apiLimiter);
app.use('/api/seo', seoRoutes);

module.exports = app;

if (require.main === module) {
  const PORT = 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
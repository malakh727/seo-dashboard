const express = require('express');
const cors = require('cors');
const seoRoutes = require('./routes/seoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/seo', seoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
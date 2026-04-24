const express = require('express');
const cors = require('cors');
const graphRoutes = require('./routes/graph');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/bfhl', graphRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

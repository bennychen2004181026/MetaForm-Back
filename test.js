const express = require('express');

const PORT = process.env.PORT || 5001;
const app = express();
app.get('/', (req, res) => {
  res.json([]);
});
app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});

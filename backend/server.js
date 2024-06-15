const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

const products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

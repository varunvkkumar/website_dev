const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/products.json');

// Helper function to read products from the JSON file
const readProducts = () => {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
};

// Helper function to write products to the JSON file
const writeProducts = (products) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Get all products
router.get('/', (req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

// Create a new product
router.post('/', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: 'Server error while creating product' });
  }
});

module.exports = router;


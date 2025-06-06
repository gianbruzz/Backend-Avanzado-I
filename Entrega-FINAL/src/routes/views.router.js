const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const products = await Product.find().lean();
  res.render('home', { products });
});

router.get('/realtimeproducts', async (req, res) => {
  const products = await Product.find().lean();
  res.render('realTimeProducts', { products });
});

module.exports = router;

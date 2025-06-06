const express = require('express');
const router = express.Router();
const controller = require('../controllers/products.controller');

router.get('/', controller.getProducts);
router.get('/:pid', controller.getProductById);
router.post('/', controller.createProduct);
router.put('/:pid', controller.updateProduct);
router.delete('/:pid', controller.deleteProduct);

module.exports = router;

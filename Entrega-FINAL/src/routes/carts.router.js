const express = require('express');
const router = express.Router();
const controller = require('../controllers/carts.controller');

router.get('/:cid', controller.getCartById);
router.post('/', controller.createCart);
router.post('/:cid/product/:pid', controller.addProductToCart);
router.put('/:cid', controller.updateCart);
router.put('/:cid/product/:pid', controller.updateProductQuantity);
router.delete('/:cid/product/:pid', controller.deleteProduct);
router.delete('/:cid', controller.deleteAllProducts);

module.exports = router;

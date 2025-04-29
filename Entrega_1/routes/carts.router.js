const express = require("express");
const CartsManager = require('../managers/CartsManager.js');

const router = express.Router();
const cartManager = new CartsManager('./utils/carts.json');


router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(id);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        const cart = await cartManager.addProductToCart(cid, pid);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;

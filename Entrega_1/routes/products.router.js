const express = require("express");
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const productManager = new ProductManager('./utils/products.json');



router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const product = await productManager.getProductById(id);
        res.json({ product });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ newProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const updatedProduct = await productManager.updateProduct(id, req.body);
        res.json({ updatedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const result = await productManager.deleteProduct(id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});


module.exports = router;



const fs = require('fs').promises;
const path = require('path');

const ProductManager = require('../managers/ProductManager.js');
const productManager = new ProductManager('./utils/products.json');

class CartManager {
    constructor(filePath) {
        this.path = path.resolve(filePath);
    }

    async _readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async _writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
    }

    async createCart() {
        const carts = await this._readFile();
        const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

        const newCart = {
            id: newId,
            products: []
        };

        carts.push(newCart);
        await this._writeFile(carts);

        return newCart;
    }

    async getCartById(id) {
        const carts = await this._readFile();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cid, pid) {
        const carts = await this._readFile();
        const cartIndex = carts.findIndex(c => c.id === cid);
    
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado.');
        }
    
        // Buscar el producto real para chequear stock
        const product = await productManager.getProductById(parseInt(pid));
        if (!product) {
            throw new Error('Producto no encontrado.');
        }
    
        // Buscar si el producto ya existe en el carrito
        const existingProductIndex = carts[cartIndex].products.findIndex(p => p.product === pid);
    
        if (existingProductIndex !== -1) {
            // Ya existe en carrito
            const currentQuantity = carts[cartIndex].products[existingProductIndex].quantity;
    
            if (currentQuantity + 1 > product.stock) {
                throw new Error('No hay suficiente stock disponible.');
            }
    
            carts[cartIndex].products[existingProductIndex].quantity += 1;
        } else {
            // No existe todavía
            if (product.stock < 1) {
                throw new Error('Producto sin stock disponible.');
            }
    
            carts[cartIndex].products.push({ product: pid, quantity: 1 });
        }
    
        await this._writeFile(carts);
        return carts[cartIndex];
    }
    
}

module.exports = CartManager;

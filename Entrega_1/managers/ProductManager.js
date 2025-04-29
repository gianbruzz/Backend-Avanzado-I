const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

    async addProduct(product) {
        const products = await this._readFile();

        if (!product.title || !product.description || !product.price || !product.status || !product.thumbnail || !product.code || !product.stock) {
            throw new Error('Todos los campos son obligatorios.');
        }

        const codeExists = products.some(p => p.code === product.code);
        if (codeExists) {
            throw new Error('El código ya existe.');
        }

        // ID autoincrementable
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = { id: newId, ...product };
        products.push(newProduct);

        await this._writeFile(products);
        return newProduct;
    }

    async getProducts() {
        return await this._readFile();
    }

    async getProductById(id) {
        const products = await this._readFile();
        const product = products.find(p => p.id === id);

        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this._readFile();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error('Producto no encontrado.');
        }

        products[index] = { ...products[index], ...updatedFields };
        await this._writeFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this._readFile();
        const newProducts = products.filter(p => p.id !== id);

        if (products.length === newProducts.length) {
            throw new Error('Producto no encontrado.');
        }

        await this._writeFile(newProducts);
        return { message: 'Producto eliminado.' };
    }
}

module.exports = ProductManager;

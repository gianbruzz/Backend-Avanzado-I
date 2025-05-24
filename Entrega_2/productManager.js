const { error } = require('console');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'products.json');

function readProducts() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function saveProducts(products) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
}

function addProduct(productData) {
  const { title, price } = productData;

  if (!title || !price) {
    throw new Error('Completar los campos obligatorios!');
  }
  if (typeof price !== 'number'){
    throw new Error ('El precio debe ser un número!')
  }

  const products = readProducts();
  const lastProduct = products[products.length - 1];
  const nextId = lastProduct ? parseInt(lastProduct.id) + 1 : 1;

  const newProduct = {
    id: nextId.toString(),
    title,
    price
  };

  products.push(newProduct);
  saveProducts(products);
  return products;
}

function deleteProduct(id) {
  let products = readProducts();
  products = products.filter(p => p.id !== id);
  saveProducts(products);
  return products;
}

module.exports = {
  readProducts,
  addProduct,
  deleteProduct
};

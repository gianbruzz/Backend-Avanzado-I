const mongoose = require('mongoose');
const Product = require('./models/Product.js'); 
require('dotenv').config();

const categories = ['anillo', 'collar', 'pulsera', 'aros'];

const generateRandomProduct = () => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  return {
    title: `Producto ${Math.random().toString(36).substring(7)}`,
    description: 'Producto generado automáticamente',
    price: Math.floor(Math.random() * 10000) + 1000,
    stock: Math.floor(Math.random() * 20) + 1,
    category: randomCategory,
    available: Math.random() > 0.2,
    code: Math.random().toString(36).substring(2, 8)
  };
};

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a Mongo Atlas para insertar productos...');
    await Product.deleteMany(); 
    const products = Array.from({ length: 50 }, generateRandomProduct);
    await Product.insertMany(products);
    console.log('Productos insertados con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('Error al insertar productos:', err);
    process.exit(1);
  }
};

seedDB();

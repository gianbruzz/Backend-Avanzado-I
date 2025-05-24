const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const exphbs = require('express-handlebars');
const { readProducts, addProduct, deleteProduct } = require('./productManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
  const products = readProducts();
  res.render('home', { products });
});

app.get('/realtimeproducts', (req, res) => {
  const products = readProducts();
  res.render('realTimeProducts', { products });
});

// WebSocket
io.on('connection', socket => {
  console.log('Cliente conectado');

  socket.emit('productList', readProducts());

  socket.on('newProduct', product => {
    try {
      const updatedProducts = addProduct(product);
      io.emit('productList', updatedProducts);
    } catch (error) {
      socket.emit('errorMessage', error.message);
    }
  });

  socket.on('deleteProduct', id => {
    const updatedProducts = deleteProduct(id);
    io.emit('productList', updatedProducts);
  });
});

server.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});

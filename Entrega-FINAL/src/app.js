require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const productRouter = require('./routes/products.router');
const cartRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);

// WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('newProduct', (product) => {
        io.emit('updateProductList', product);
    });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB Atlas');
    server.listen(process.env.PORT || 8080, () => {
        console.log(`Servidor escuchando en el puerto ${process.env.PORT || 8080}`);
    });
}).catch(error => {
    console.error('Error de conexión a MongoDB:', error);
});

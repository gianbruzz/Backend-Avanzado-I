const Cart = require('../models/Cart');

exports.getCartById = async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
  res.json(cart);
};

exports.createCart = async (req, res) => {
  try {
    // Crear un nuevo carrito con products vacío
    const newCart = await Cart.create({ products: [] });

    // Responder con éxito y el carrito creado
    res.status(201).json({
      status: 'success',
      payload: newCart
    });
  } catch (error) {
    // En caso de error, devolver error 500 con mensaje
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
};

exports.addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params; // IDs del carrito y producto

    // Buscar el carrito por id
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ status: 'error', error: 'Carrito no encontrado' });
    }

    // Buscar si el producto ya existe en el carrito
    const productIndex = cart.products.findIndex(
      (prod) => prod.product.toString() === pid
    );

    if (productIndex !== -1) {
      // Si ya existe, incrementar la cantidad
      cart.products[productIndex].quantity += 1;
    } else {
      // Si no existe, agregar el producto con cantidad 1
      cart.products.push({ product: pid, quantity: 1 });
    }

    // Guardar el carrito actualizado
    await cart.save();

    // Responder con éxito y carrito actualizado
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};


exports.updateCart = async (req, res) => {
  const updated = await Cart.findByIdAndUpdate(req.params.cid, { products: req.body.products }, { new: true });
  res.json({ status: 'success', payload: updated });
};

exports.updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findById(cid);
  const product = cart.products.find(p => p.id.toString() === pid);
  if (product) product.quantity = quantity;
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.deleteProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  cart.products = cart.products.filter(p => p.id.toString() !== pid);
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.deleteAllProducts = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  cart.products = [];
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

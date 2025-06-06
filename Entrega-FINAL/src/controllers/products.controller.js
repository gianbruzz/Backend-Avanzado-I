const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    // Se obtienen los parámetros de la URL: límite de productos, página, orden y filtro
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = {};

    // Si viene un query, se interpreta como "campo:valor"
    // Ej: si se quiere filtrar por la category "pulsera" en postman -- http://localhost:8080/api/products?query=category:pulsera 
    if (query) {
      const [field, value] = query.split(':');

      if (field && value) {
        // Se usa expresión regular para hacer la búsqueda "case insensitive"
        filter[field] = { $regex: value, $options: 'i' };
      }
    }

    // Opciones para paginate: límite, página actual, ordenamiento y lean
    const options = {
      limit: parseInt(limit), // número de productos por página
      page: parseInt(page),   // página actual
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}, // orden por precio
      lean: true              // convierte los documentos a objetos JS simples
    };

    // Ej: http://localhost:8080/api/products?limit=1
    // Ej: http://localhost:8080/api/products?page=1
    // Ej: http://localhost:8080/api/products?sort=asc

    // Se realiza la búsqueda paginada 
    const result = await Product.paginate(filter, options);

    
    //Se chequea si no existen resultados
     if (result.docs.length === 0) {
    return res.status(404).json({
      status: 'error',
      error: 'No se encontraron productos con los filtros especificados.'
    });
  }
    // Se arma el resultado con los datos requeridos
    res.json({
      status: 'success', 
      payload: result.docs,             // productos obtenidos
      totalPages: result.totalPages,    // cantidad total de páginas
      prevPage: result.prevPage,        // página anterior
      nextPage: result.nextPage,        // página siguiente
      page: result.page,                // página actual
      hasPrevPage: result.hasPrevPage,  // hay página anterior?
      hasNextPage: result.hasNextPage,  // hay página siguiente?
      prevLink: result.hasPrevPage ? `?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `?page=${result.nextPage}` : null
    });

  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    // Buscamos el producto por ID y lo convertimos a objeto JS plano
    const product = await Product.findById(pid).lean();

    // Si no se encuentra el producto (ID válido pero no existente)
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `Producto con ID ${pid} no encontrado`
      });
    }
    // Si se encuentra, lo devolvemos
    res.json({ status: 'success', payload: product });

  } catch (error) {
    // Si el ID tiene un formato inválido (por ejemplo, no es un ObjectId válido)
    res.status(400).json({
      status: 'error',
      message: 'ID inválido o error al buscar el producto',
      error: error.message
    });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ status: 'success', payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: 'error', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { pid } = req.params; // ID del producto a actualizar
    const updateData = req.body; // Datos que se van a actualizar

    // Busca el producto por ID y lo actualiza con los nuevos datos
    const updatedProduct = await Product.findByIdAndUpdate(pid, updateData, {
      new: true, // Retorna el documento ya actualizado
      runValidators: true // Valida los datos antes de actualizar
    });

    if (!updatedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params; // ID del producto a eliminar

    const deletedProduct = await Product.findByIdAndDelete(pid);

    if (!deletedProduct) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }

    res.json({ status: 'success', message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
};



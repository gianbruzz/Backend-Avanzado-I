
# 🛒 E-Commerce Backend con MongoDB

Este proyecto es un backend para un e-commerce construido con Node.js, Express y MongoDB (usando Mongoose). Implementa funcionalidades CRUD para productos y carritos, con paginación, filtros, ordenamiento, y asociación de productos a carritos.

## 🚀 Tecnologías utilizadas

- Node.js
- Express.js
- Socket.io
- MongoDB Atlas
- Mongoose
- mongoose-paginate-v2
- Dotenv
- Handlebars (para vistas)
- Postman (para pruebas)


## 🌐 Endpoints disponibles

### 🔹 Productos

#### `GET /api/products`

Obtener productos con filtros, paginación y ordenamiento.

**Parámetros opcionales (query):**

| Parámetro | Tipo    | Descripción                                       |
|-----------|---------|---------------------------------------------------|
| `limit`   | Number  | Número de productos por página (default: 10)     |
| `page`    | Number  | Página a visualizar (default: 1)                 |
| `sort`    | String  | Orden por precio: `asc` o `desc`                  |
| `query`   | String  | Filtro por categoría o disponibilidad (`true/false`) |

**Ejemplo:**

```
GET /api/products?limit=5&page=2&sort=asc&query=category:anillo
```

**Respuesta esperada:**

```json
{
  "status": "success",
  "payload": [ ... ],
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "?page=1",
  "nextLink": "?page=3"
}
```

---

#### `GET /api/products/:pid`

Obtener un producto por su ID.

```
GET /api/products/665f9bd1c1573b21c70be073
```

---

#### `POST /api/products`

Crear un nuevo producto.

```json
POST /api/products
Content-Type: application/json

{
  "title": "Pulsera de Plata",
  "description": "Pulsera 925 hecha a mano",
  "price": 22000,
  "stock": 8,
  "category": "pulsera",
  "status": true
}
```

---

#### `PUT /api/products/:pid`

Actualizar un producto existente.

```json
PUT /api/products/665f9bd1c1573b21c70be073
{
  "price": 24000
}
```

---

#### `DELETE /api/products/:pid`

Eliminar un producto por ID.

---

### 🔸 Carritos

#### `POST /api/carts`

Crea un nuevo carrito vacío.

---

#### `GET /api/carts/:cid`

Obtiene los productos de un carrito específico.

---

#### `POST /api/carts/:cid/product/:pid`

Agrega un producto al carrito indicado. Si ya existe, suma +1 en la cantidad.

---

#### `PUT /api/carts/:cid/product/:pid`

Actualiza la cantidad del producto específico dentro del carrito.

```json
PUT /api/carts/665faec3d31a0f27d8eacc12/product/665f9bd1c1573b21c70be073
{
  "quantity": 3
}
```

---

#### `PUT /api/carts/:cid`

Reemplaza **todos** los productos del carrito por los enviados en un array.

```json
PUT /api/carts/665faec3d31a0f27d8eacc12
{
  "products": [
    { "product": "665f9bd1c1573b21c70be073", "quantity": 2 },
    { "product": "665f9bd1c1573b21c70be088", "quantity": 1 }
  ]
}
```

---

#### `DELETE /api/carts/:cid/products/:pid`

Elimina un producto específico del carrito.

---

#### `DELETE /api/carts/:cid`

Vacía por completo el carrito.

---

## 🧩 Organización del código

```
📦 src
 ┣ 📂controllers
 ┣ 📂dao
 ┣ 📂models
 ┣ 📂routes
 ┣ 📂views
 ┣ 📜app.js
 ┣ 📜seeder.js
 ┣ 📜utils.js
```

> Proyecto desarrollado como práctica final del curso **Programación Backend I: Desarrollo Avanzado de Backend**.

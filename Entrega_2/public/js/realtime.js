const socket = io();
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

// Agrega nuevo producto
productForm.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const price = parseFloat(document.getElementById('price').value);

  socket.emit('newProduct', { title, price });
  productForm.reset();
});

// Recibe lista actualizada
socket.on('productList', products => {
  productList.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `ID: ${p.id} - ${p.title} - $${p.price}`;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.onclick = () => socket.emit('deleteProduct', p.id);
    li.appendChild(btn);
    productList.appendChild(li);
  });
});

// Muestra errores
socket.on('errorMessage', msg => {
  alert(`Error: ${msg}`);
});

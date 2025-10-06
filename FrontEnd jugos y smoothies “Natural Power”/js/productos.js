// productos.js
// Renderiza los productos en función de su categoría

document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector(".row");
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  // Detecta tipo de página
  let categoria = "";
  if (location.pathname.includes("Productos_jugos.html")) categoria = "jugos";
  if (location.pathname.includes("Productos_smoothies.html")) categoria = "smoothies";

  const productosFiltrados = categoria
    ? productos.filter(p => p.categoria === categoria)
    : productos;

  contenedor.innerHTML = "";

  productosFiltrados.forEach(producto => {
    const stockTexto = producto.stock > 5
      ? `<span class="badge bg-success">Disponible</span>`
      : producto.stock > 0
      ? `<span class="badge bg-warning text-dark">Últimas unidades</span>`
      : `<span class="badge bg-danger">Agotado</span>`;

    const btn = producto.stock > 0
      ? `<button class="btn btn-primary agregar-carrito" data-id="${producto.id}">Agregar al carro</button>`
      : `<button class="btn btn-secondary" disabled>Agotado</button>`;

    contenedor.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body text-center">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="card-img-top">
            <h5 class="card-title mt-2">${producto.nombre}</h5>
            ${stockTexto}
            <p class="mt-2 text-success fw-bold">$${producto.precio.toLocaleString()}</p>
            ${btn}
          </div>
        </div>
      </div>
    `;
  });

  // Evento de agregar al carrito
  contenedor.addEventListener("click", e => {
    if (e.target.classList.contains("agregar-carrito")) {
      const id = Number(e.target.dataset.id);
      agregarAlCarrito(id);
    }
  });
});

// Agregar al carrito
function agregarAlCarrito(idProducto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productos = JSON.parse(localStorage.getItem("productos"));
  const producto = productos.find(p => p.id === idProducto);

  if (!producto) return;

  const existente = carrito.find(item => item.id === producto.id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`✅ ${producto.nombre} agregado al carrito`);
}


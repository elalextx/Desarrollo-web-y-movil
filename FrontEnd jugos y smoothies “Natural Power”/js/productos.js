document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.querySelector(".row");
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    let categoria = "";
    if (location.pathname.includes("jugos.html")) categoria = "jugos";
    if (location.pathname.includes("smoothies.html")) categoria = "smoothies";

    const productosFiltrados = categoria ? productos.filter(p => p.categoria === categoria) : productos;
    contenedor.innerHTML = "";

    productosFiltrados.forEach(producto => {
        const stockTexto = producto.stock > 5
            ? `<span class="badge bg-success">Disponible</span>`
            : producto.stock > 0
            ? `<span class="badge bg-warning text-dark">Últimas unidades</span>`
            : `<span class="badge bg-danger">Agotado</span>`;

        const btn = producto.stock > 0
            ? `<button class="btn btn-primary agregar-carrito" data-nombre="${producto.nombre}">Agregar al carrito</button>`
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

    contenedor.addEventListener("click", e => {
        if (e.target.classList.contains("agregar-carrito")) {
            const cliente = JSON.parse(localStorage.getItem("clienteActual"));
            if (!cliente) {
                alert("Debes iniciar sesión para agregar productos al carrito.");
                location.href = "login_cliente.html";
                return;
            }

            const carritoKey = `carrito_${cliente.id}`;
            const nombre = e.target.dataset.nombre;
            agregarAlCarrito(nombre, carritoKey);
        }
    });
});

function agregarAlCarrito(nombre, carritoKey) {
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    const productos = JSON.parse(localStorage.getItem("productos"));
    const producto = productos.find(p => p.nombre === nombre);
    if (!producto) return;

    const existente = carrito.find(item => item.nombre === producto.nombre);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);

    if (typeof actualizarNavbarCarrito === "function") {
        actualizarNavbarCarrito();
    }
}

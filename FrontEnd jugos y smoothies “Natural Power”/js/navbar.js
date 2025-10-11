document.addEventListener("DOMContentLoaded", renderNavbar);

function renderNavbar() {
    const navbarContainer = document.getElementById("navbarContainer");
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));

    let totalItems = 0;
    if (cliente) {
        const carrito = JSON.parse(localStorage.getItem(`carrito_${cliente.id}`)) || [];
        totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    }

    navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-success" href="index.html">Natural Power</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="jugos.html">Jugos naturales</a></li>
                    <li class="nav-item"><a class="nav-link" href="smoothies.html">Smoothies</a></li>
                </ul>

                <ul class="navbar-nav ms-auto">
                    ${
                        cliente
                            ? `
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="perfilDropdown" role="button" data-bs-toggle="dropdown">
                                    ${cliente.nombre} (${cliente.email})
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="perfilDropdown">
                                    <li><a class="dropdown-item" href="compras.html">Mis compras</a></li>
                                    <li><a class="dropdown-item text-danger" href="#" id="btnLogout">Cerrar sesión</a></li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link position-relative" href="carrito.html">
                                    🛒 Carrito
                                    ${
                                        totalItems > 0
                                            ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                                ${totalItems}
                                            </span>`
                                            : ""
                                    }
                                </a>
                            </li>
                            `
                            : `
                            <li class="nav-item">
                                <a class="nav-link" href="login_cliente.html">Inicia sesión</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="registro_cliente.html">Regístrate</a>
                            </li>
                            `
                    }
                </ul>
            </div>
        </div>
    </nav>
    `;

    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", cerrarSesion);
    }
}

function cerrarSesion() {
    if (confirm("¿Deseas cerrar sesión?")) {
        localStorage.removeItem("clienteActual");
        location.href = "index.html";
    }
}

function actualizarContadorCarrito() {
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));
    if (!cliente) return;

    const carrito = JSON.parse(localStorage.getItem(`carrito_${cliente.id}`)) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const carritoLink = document.querySelector('a[href="carrito.html"]');
    if (carritoLink) {
        carritoLink.innerHTML = `
            🛒 Carrito
            ${
                totalItems > 0
                    ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        ${totalItems}
                    </span>`
                    : ""
            }
        `;
    }
}
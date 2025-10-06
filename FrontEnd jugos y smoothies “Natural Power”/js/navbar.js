// navbar.js
function renderNavbar() {
    const navbarContainer = document.getElementById("navbarContainer");

    // Obtenemos usuario desde localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioActual"));

    navbarContainer.innerHTML = `
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="FrontEnd.html">Natural Power</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavbar">
                <ul class="navbar-nav">
                    <li class="nav-item"><a class="nav-link" href="Productos_jugos.html">Jugos naturales</a></li>
                    <li class="nav-item"><a class="nav-link" href="Productos_smoothies.html">Smoothies</a></li>
                    <li class="nav-item"><a class="nav-link" href="Carrito.html">Ver carrito</a></li>
                    <li class="nav-item"><a class="nav-link" href="Compras.html">Compras</a></li>
                </ul>
                <ul class="navbar-nav ms-auto">
                    ${usuarioLogueado ? `
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                ${usuarioLogueado.email}
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="cerrarSesion()">Cerrar sesión</a></li>
                            </ul>
                        </li>
                    ` : `
                        <li class="nav-item"><a class="nav-link" href="Inicio_sesion.html">Inicia sesión / Registrate</a></li>
                    `}
                </ul>
            </div>
        </div>
    </nav>
    `;
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActual");
    renderNavbar();
}

document.addEventListener("DOMContentLoaded", renderNavbar);

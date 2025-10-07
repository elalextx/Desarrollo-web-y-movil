// navbar.js
function renderNavbar() {
  const navbarContainer = document.getElementById("navbarContainer");
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));

  navbarContainer.innerHTML = `
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="index.html">Natural Power</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link" href="jugos.html">Jugos naturales</a></li>
          <li class="nav-item"><a class="nav-link" href="smoothies.html">Smoothies</a></li>
          <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
          <li class="nav-item"><a class="nav-link" href="compras.html">Compras</a></li>
          ${usuario && (usuario.rol === "empleado" || usuario.rol === "admin")
            ? `<li class="nav-item"><a class="nav-link text-success" href="admin.html">Panel Admin</a></li>` : ''}
        </ul>
        <ul class="navbar-nav ms-auto">
          ${usuario
            ? `<li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  ${usuario.email}
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="cerrarSesion()">Cerrar sesión</a></li>
                </ul>
              </li>`
            : `<li class="nav-item"><a class="nav-link" href="inicio_sesion.html">Inicia sesión / Regístrate</a></li>`}
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

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const nav = document.querySelector(".navbar-nav");

  if (usuario && nav) {

    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link text-danger" href="#" id="logout">Cerrar sesión (${usuario.email})</a>`;
    nav.appendChild(li);

    document.getElementById("logout").addEventListener("click", e => {
      e.preventDefault();
      localStorage.removeItem("usuarioActual");
      alert("Sesión cerrada");
      location.href = "index.html";
    });
  }
});


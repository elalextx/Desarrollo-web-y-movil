// auth.js

document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;

  if (path.includes("Registro.html")) {
    const btn = document.querySelector("button");
    btn.addEventListener("click", registrarUsuario);
  }

  if (path.includes("Inicio_sesion.html")) {
    const btn = document.querySelector("button");
    btn.addEventListener("click", iniciarSesion);
  }
});

function registrarUsuario() {
  const email = document.querySelector('input[type="email"]').value.trim();
  const password = document.querySelector('input[type="password"]').value.trim();

  if (!email || !password) return alert("Complete todos los campos");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    alert("El usuario ya existe");
    return;
  }

  usuarios.push({ email, password });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("✅ Registro exitoso, ahora puedes iniciar sesión");
  location.href = "Inicio_sesion.html";
}

function iniciarSesion() {
  const email = document.querySelector('input[type="email"]').value.trim();
  const password = document.querySelector('input[type="password"]').value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    alert("✅ Bienvenido " + usuario.email);
    location.href = "FrontEnd.html";
  } else {
    alert("❌ Credenciales incorrectas");
  }
}


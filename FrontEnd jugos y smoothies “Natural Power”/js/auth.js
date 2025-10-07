document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname;

  if (path.includes("registro.html")) {
    document.getElementById("btnRegister").addEventListener("click", registrarUsuario);
  }

  if (path.includes("inicio_sesion.html")) {
    document.getElementById("btnLogin").addEventListener("click", iniciarSesion);
  }
});

function registrarUsuario() {
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPass").value.trim();
  const rol = "cliente"; // Todos los registros nuevos son clientes

  if (!email || !password) return alert("Complete todos los campos");

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  if (usuarios.find(u => u.email === email)) {
    alert("El usuario ya existe");
    return;
  }

  usuarios.push({ email, password, rol });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso, ahora puedes iniciar sesión");
  location.href = "inicio_sesion.html";
}

function iniciarSesion() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPass").value.trim();

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (usuario) {
    localStorage.setItem("usuarioActual", JSON.stringify(usuario));
    alert("Bienvenido " + usuario.email);
    
    // Redirigir según rol
    if (usuario.rol === "empleado" || usuario.rol === "admin") {
      location.href = "admin.html";
    } else {
      location.href = "index.html";
    }
  } else {
    alert("Credenciales incorrectas");
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const path = location.pathname;

    const btnRegister = document.getElementById("btnRegister");
    const btnLogin = document.getElementById("btnLogin");

    if (path.includes("registro_cliente.html") && btnRegister) {
        btnRegister.addEventListener("click", registrarCliente);
    }

    if (path.includes("registro_empleado.html") && btnRegister) {
        btnRegister.addEventListener("click", registrarEmpleado);
    }

    if (path.includes("login_cliente.html") && btnLogin) {
        btnLogin.addEventListener("click", loginCliente);
    }

    if (path.includes("login_empleado.html") && btnLogin) {
        btnLogin.addEventListener("click", loginEmpleado);
    }
});

function generarId(lista) {
    if (!Array.isArray(lista) || lista.length === 0) return 1;
    const maxId = Math.max(...lista.map(item => Number(item.id) || 0));
    return maxId + 1;
}

function registrarCliente() {
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPass")?.value.trim();
    const nombre = document.getElementById("registerName")?.value.trim();
    const rut = document.getElementById("registerRUT")?.value.trim();

    if (!email || !password || !nombre || !rut) return alert("Complete todos los campos");

    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    if (clientes.find(u => u.email === email) || clientes.find(u => u.rut === rut)) {
        alert("El usuario ya existe");
        return;
    }

    const id = generarId(clientes);
    const fechaRegistro = new Date().toISOString();
    const nuevoCliente = { id, email, password, nombre, rut, fechaRegistro };

    clientes.push(nuevoCliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));
    alert("Registro exitoso, ahora puedes iniciar sesión");
    location.href = "login_cliente.html";
}

function loginCliente() {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPass")?.value.trim();

    if (!email || !password) return alert("Complete todos los campos");

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const cliente = clientes.find(u => u.email === email && u.password === password);

    if (cliente) {
        localStorage.setItem("clienteActual", JSON.stringify(cliente));
        alert("Bienvenido " + cliente.email);
        location.href = "index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}

function registrarEmpleado() {
    const email = document.getElementById("registerEmail")?.value.trim();
    const password = document.getElementById("registerPass")?.value.trim();
    const nombre = document.getElementById("registerName")?.value.trim();
    const rut = document.getElementById("registerRUT")?.value.trim();
    const cargo = document.getElementById("registerCargo")?.value.trim();

    if (!email || !password || !nombre || !rut || !cargo) return alert("Complete todos los campos");

    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];

    if (empleados.find(u => u.email === email) || empleados.find(u => u.rut === rut)) {
        alert("Empleado ya registrado");
        return;
    }

    const id = generarId(empleados);
    const nuevoEmpleado = { id, email, password, nombre, rut, cargo };

    empleados.push(nuevoEmpleado);
    localStorage.setItem("empleados", JSON.stringify(empleados));
    alert("Registro exitoso, ahora puedes iniciar sesión");
    location.href = "login_empleado.html";
}

function loginEmpleado() {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPass")?.value.trim();

    if (!email || !password) return alert("Complete todos los campos");

    const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    const empleado = empleados.find(u => u.email === email && u.password === password);

    if (empleado) {
        localStorage.setItem("empleadoActual", JSON.stringify(empleado));
        alert("Bienvenido " + empleado.email);
        location.href = "admin.html";
    } else {
        alert("Credenciales incorrectas");
    }
}
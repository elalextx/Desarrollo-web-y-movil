document.addEventListener("DOMContentLoaded", () => {
    const empleadoActual = JSON.parse(localStorage.getItem("empleadoActual"));
    const clienteActual = JSON.parse(localStorage.getItem("clienteActual"));

    if (!empleadoActual || clienteActual) {
        alert("Acceso denegado. Solo empleados pueden acceder a esta sección, si tiene iniciada una sesión de cliente cierre sesión");
        location.href = "login_empleado.html";
        return;
    }

    const nombreElemento = document.getElementById("nombreEmpleado");
    if (nombreElemento) {
        nombreElemento.textContent = empleadoActual.nombre;
    }

    console.log("Empleado autenticado:", empleadoActual);
});

document.getElementById("btnLogout")?.addEventListener("click", () => {
    localStorage.removeItem("empleadoActual");
    location.href = "login_empleado.html";
});
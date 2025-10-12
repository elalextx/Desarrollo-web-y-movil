document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tablaEmpleados");
    const formEditar = document.getElementById("formEditarEmpleado");
    const modal = new bootstrap.Modal(document.getElementById("modalEditarEmpleado"));

    let empleados = JSON.parse(localStorage.getItem("empleados")) || [];
    let empleadoEditando = null;

    function cargarEmpleados() {
        tabla.innerHTML = "";
        empleados.forEach(empleado => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${empleado.nombre}</td>
                <td>${empleado.email}</td>
                <td>${empleado.rut}</td>
                <td>${empleado.cargo}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-id="${empleado.id}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${empleado.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    tabla.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("btn-warning")) {
            empleadoEditando = empleados.find(emp => emp.id == id);
            if (!empleadoEditando) return;

            document.getElementById("editarNombreEmpleado").value = empleadoEditando.nombre;
            document.getElementById("editarEmailEmpleado").value = empleadoEditando.email;
            document.getElementById("editarRUTEmpleado").value = empleadoEditando.rut;
            document.getElementById("editarCargoEmpleado").value = empleadoEditando.cargo;

            modal.show();
        }

        if (e.target.classList.contains("btn-danger")) {
            if (confirm("¿Seguro que deseas eliminar este empleado?")) {
                empleados = empleados.filter(emp => emp.id != id);
                localStorage.setItem("empleados", JSON.stringify(empleados));
                cargarEmpleados();
            }
        }
    });

    formEditar.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!empleadoEditando) return;

        empleadoEditando.nombre = document.getElementById("editarNombreEmpleado").value.trim();
        empleadoEditando.email = document.getElementById("editarEmailEmpleado").value.trim();
        empleadoEditando.rut = document.getElementById("editarRUTEmpleado").value.trim();
        empleadoEditando.cargo = document.getElementById("editarCargoEmpleado").value.trim();

        localStorage.setItem("empleados", JSON.stringify(empleados));
        cargarEmpleados();
        modal.hide();
    });

    cargarEmpleados();
});
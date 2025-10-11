document.addEventListener("DOMContentLoaded", () => {
    const tablaClientes = document.getElementById("tablaClientes");
    let clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    let clienteEditandoId = null;

    function renderClientes() {
        tablaClientes.innerHTML = "";
        clientes.forEach(cliente => {
            tablaClientes.innerHTML += `
                <tr>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.rut}</td>
                    <td>
                        <button class="btn btn-sm btn-warning btn-editar" data-id="${cliente.id}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${cliente.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        document.querySelectorAll(".btn-editar").forEach(btn => {
            btn.addEventListener("click", e => {
                clienteEditandoId = parseInt(e.target.dataset.id);
                const cliente = clientes.find(c => c.id === clienteEditandoId);
                abrirModalEditar(cliente);
            });
        });

        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", e => {
                const id = parseInt(e.target.dataset.id);
                if (confirm("¿Deseas eliminar este cliente?")) {
                    clientes = clientes.filter(c => c.id !== id);
                    localStorage.setItem("clientes", JSON.stringify(clientes));
                    renderClientes();
                }
            });
        });
    }

    renderClientes();

    const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
    const formEditar = document.getElementById("formEditarCliente");
    const inputNombre = document.getElementById("editarNombre");
    const inputEmail = document.getElementById("editarEmail");
    const inputRUT = document.getElementById("editarRUT");

    function abrirModalEditar(cliente) {
        inputNombre.value = cliente.nombre;
        inputEmail.value = cliente.email;
        inputRUT.value = cliente.rut;
        modal.show();
    }

    formEditar.addEventListener("submit", e => {
        e.preventDefault();
        if (clienteEditandoId !== null) {
            const cliente = clientes.find(c => c.id === clienteEditandoId);
            cliente.nombre = inputNombre.value.trim();
            cliente.email = inputEmail.value.trim();
            cliente.rut = inputRUT.value.trim();

            localStorage.setItem("clientes", JSON.stringify(clientes));
            renderClientes();
            modal.hide();
            clienteEditandoId = null;
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#clientesTable tbody");
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    const hoy = new Date();

    const clientesHoy = clientes.filter(c => {
        const fechaCliente = new Date(c.fechaRegistro);
        return fechaCliente.getFullYear() === hoy.getFullYear() &&
               fechaCliente.getMonth() === hoy.getMonth() &&
               fechaCliente.getDate() === hoy.getDate();
    });

    if (clientesHoy.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay registros pendientes hoy</td></tr>`;
        return;
    }

    clientesHoy.forEach(cliente => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${cliente.nombre}</td>
            <td>${cliente.email}</td>
            <td>${cliente.rut}</td>
            <td>
                <button class="btn btn-success btn-sm aceptar">Aceptar</button>
                <button class="btn btn-danger btn-sm rechazar">Rechazar</button>
            </td>
        `;

        tr.querySelector(".aceptar").addEventListener("click", () => {
            alert(`Cliente ${cliente.nombre} aceptado`);
            tr.remove();
        });

        tr.querySelector(".rechazar").addEventListener("click", () => {
            if (confirm(`¿Seguro que deseas eliminar al cliente ${cliente.nombre}?`)) {
                const index = clientes.findIndex(c => c.id === cliente.id);
                if (index !== -1) {
                    clientes.splice(index, 1);
                    localStorage.setItem("clientes", JSON.stringify(clientes));
                }
                tr.remove();
            }
        });

        tbody.appendChild(tr);
    });
});
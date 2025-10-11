function getCompras() {
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));
    if (!cliente) return [];

    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    return compras.filter(c => c.clienteId === cliente.id);
}

function solicitarReembolso(index) {
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));
    if (!cliente) {
        alert("Debes iniciar sesión para solicitar un reembolso");
        return;
    }

    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    const comprasCliente = compras.filter(c => c.clienteId === cliente.id);
    const compra = comprasCliente[index];
    if (!compra) return;

    if (compra.estado === "Reembolso solicitado") {
        alert("Ya solicitaste un reembolso para esta compra.");
        return;
    }

    compra.estado = "Reembolso solicitado";
    localStorage.setItem("compras", JSON.stringify(compras));

    alert(`Reembolso solicitado para la compra #${compra.id}`);
}
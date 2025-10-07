function getCompras() {
    return JSON.parse(localStorage.getItem("compras")) || [];
}

function solicitarReembolso(index) {
    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    const compra = compras[index];
    if (!compra) return;

    alert(`Reembolso solicitado para la compra de ${compra.productos.join(", ")}`);
}

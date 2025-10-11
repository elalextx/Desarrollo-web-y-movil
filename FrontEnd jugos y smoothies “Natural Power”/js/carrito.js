document.addEventListener("DOMContentLoaded", () => {
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));
    if (!cliente) {
        alert("Debes iniciar sesión para acceder al carrito");
        location.href = "login_cliente.html";
        return;
    }

    const carritoKey = `carrito_${cliente.id}`;
    const tabla = document.querySelector("tbody");
    const carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    renderizarCarrito(tabla, carrito, carritoKey);

    document.getElementById("btnSeguir").addEventListener("click", () => location.href = "index.html");
    document.getElementById("btnConfirmar").addEventListener("click", () => confirmarCompra(carritoKey));

    document.getElementById("aplicarPromo").addEventListener("click", () => {
        let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
        const codigo = document.getElementById("codigoPromo").value.trim().toUpperCase();
        const codigos = JSON.parse(localStorage.getItem("codigos")) || [];
        const valido = codigos.find(c => c.codigo === codigo);

        if (!valido) return alert("Código inválido");
        if (carrito.descuentoAplicado) return alert("El descuento ya fue aplicado.");

        if (codigo === "DESC10") {
            carrito.forEach(item => { item.precio *= 0.9; });
            carrito.descuentoAplicado = true;
            localStorage.setItem(carritoKey, JSON.stringify(carrito));
            renderizarCarrito(tabla, carrito, carritoKey);
            alert("Descuento aplicado correctamente (10%)");
        }
    });
});

function renderizarCarrito(tabla, carrito, carritoKey) {
    tabla.innerHTML = "";
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>x${item.cantidad}</td>
                <td>$${item.precio.toLocaleString()}</td>
                <td>$${subtotal.toLocaleString()}</td>
                <td><button class="btn btn-danger btn-sm eliminar" data-nombre="${item.nombre}">Eliminar</button></td>
            </tr>
        `;
    });

    tabla.innerHTML += `
        <tr class="table-bordered">
            <td colspan="3" class="text-end"><strong>Total a pagar:</strong></td>
            <td colspan="2"><strong>$${total.toLocaleString()}</strong></td>
        </tr>
    `;

    tabla.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", e => {
            eliminarDelCarrito(e.target.dataset.nombre, carritoKey);
        });
    });
}

function eliminarDelCarrito(nombre, carritoKey) {
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    carrito = carrito.filter(item => item.nombre !== nombre);
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    location.reload();
}

function confirmarCompra(carritoKey) {
    const cliente = JSON.parse(localStorage.getItem("clienteActual"));
    if (!cliente) {
        alert("Debes iniciar sesión para comprar");
        location.href = "login_cliente.html";
        return;
    }

    const carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];
    if (carrito.length === 0) return alert("El carrito está vacío");

    let compras = JSON.parse(localStorage.getItem("compras")) || [];

    const fecha = new Date().toISOString();

    const compraId = Date.now();

    const nuevaCompra = {
        id: compraId,
        productos: carrito.map(item => item.nombre),
        cantidades: carrito.map(item => item.cantidad),
        total: carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
        fecha,
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        estado: "Completada"
    };

    compras.push(nuevaCompra);
    localStorage.setItem("compras", JSON.stringify(compras));
    localStorage.setItem(carritoKey, JSON.stringify([]));
    alert("Compra realizada con éxito");
    location.reload();
}
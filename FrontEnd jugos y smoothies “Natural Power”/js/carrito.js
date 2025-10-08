document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
        alert("Debes iniciar sesión para acceder al carrito");
        location.href = "inicio_sesion.html";
        return;
    }

    const tabla = document.querySelector("tbody");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    renderizarCarrito(tabla, carrito);

    document.getElementById("btnSeguir").addEventListener("click", () => {
        location.href = "index.html";
    });

    document.getElementById("btnConfirmar").addEventListener("click", confirmarCompra);

    document.getElementById("aplicarPromo").addEventListener("click", () => {
        const codigo = document.getElementById("codigoPromo").value.trim().toUpperCase();
        const validos = ["DESC10", "ENVIOGRATIS"];
        if (validos.includes(codigo)) {
            alert("Código válido, se aplicó la promoción");
        } else {
            alert("Código inválido");
        }
    });
});

function renderizarCarrito(tabla, carrito) {
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
                <td>
                    <button class="btn btn-danger btn-sm eliminar" data-id="${item.id}">Eliminar</button>
                </td>
            </tr>
        `;
    });

    tabla.innerHTML += `
        <tr class="table-bordered">
            <td colspan="3" class="text-end"><strong>Total a pagar:</strong></td>
            <td colspan="2"><strong>$${total.toLocaleString()}</strong></td>
        </tr>
    `;

    tabla.addEventListener("click", e => {
        if (e.target.classList.contains("eliminar")) {
            const id = Number(e.target.dataset.id);
            eliminarDelCarrito(id);
        }
    });
}

function eliminarDelCarrito(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    location.reload();
}

function confirmarCompra() {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuario) {
        alert("Debes iniciar sesión para comprar");
        location.href = "inicio_sesion.html";
        return;
    }

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let compras = JSON.parse(localStorage.getItem("compras")) || [];
    const fecha = new Date().toLocaleString();

    const nuevaCompra = {
        productos: carrito.map(item => item.nombre),
        cantidades: carrito.map(item => item.cantidad),
        total: carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
        fecha,
        usuario: usuario.email
    };

    compras.push(nuevaCompra);
    localStorage.setItem("compras", JSON.stringify(compras));
    localStorage.removeItem("carrito"); // Vacía el carrito
    alert("Compra realizada con éxito");
    location.reload();
}


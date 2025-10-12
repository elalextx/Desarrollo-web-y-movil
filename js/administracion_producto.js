document.addEventListener("DOMContentLoaded", () => {
    const tabla = document.getElementById("tablaProductos");
    const formAgregar = document.getElementById("formAgregarProducto");
    const formEditar = document.getElementById("formEditarProducto");
    const modalAgregar = new bootstrap.Modal(document.getElementById("modalAgregarProducto"));
    const modalEditar = new bootstrap.Modal(document.getElementById("modalEditarProducto"));

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let productoEditando = null;

    function guardarProductos() {
        localStorage.setItem("productos", JSON.stringify(productos));
    }

    function cargarProductos() {
        tabla.innerHTML = "";
        productos.forEach(producto => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.id}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>${producto.categoria}</td>
                <td>
                    <button class="btn btn-warning btn-sm" data-id="${producto.id}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    formAgregar.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevoProducto = {
            id: Date.now(),
            nombre: document.getElementById("nombreProducto").value.trim(),
            precio: parseFloat(document.getElementById("precioProducto").value.trim()),
            stock: parseInt(document.getElementById("stockProducto").value.trim()),
            categoria: document.getElementById("categoriaProducto").value.trim()
        };

        productos.push(nuevoProducto);
        guardarProductos();
        cargarProductos();
        formAgregar.reset();
        modalAgregar.hide();
    });

    tabla.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("btn-warning")) {
            productoEditando = productos.find(p => p.id == id);
            if (!productoEditando) return;

            document.getElementById("editarNombreProducto").value = productoEditando.nombre;
            document.getElementById("editarPrecioProducto").value = productoEditando.precio;
            document.getElementById("editarStockProducto").value = productoEditando.stock;
            document.getElementById("editarCategoriaProducto").value = productoEditando.categoria;

            modalEditar.show();
        }

        if (e.target.classList.contains("btn-danger")) {
            if (confirm("¿Seguro que deseas eliminar este producto?")) {
                productos = productos.filter(p => p.id != id);
                guardarProductos();
                cargarProductos();
            }
        }
    });

    formEditar.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!productoEditando) return;

        productoEditando.nombre = document.getElementById("editarNombreProducto").value.trim();
        productoEditando.precio = parseFloat(document.getElementById("editarPrecioProducto").value.trim());
        productoEditando.stock = parseInt(document.getElementById("editarStockProducto").value.trim());
        productoEditando.categoria = document.getElementById("editarCategoriaProducto").value.trim();

        guardarProductos();
        cargarProductos();
        modalEditar.hide();
    });

    cargarProductos();
});
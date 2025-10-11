const productosDB = [
    { id: 1, nombre: "Jugo de manzana verde", categoria: "jugos", precio: 8500, imagen: "img/jugo_manzana.png", stock: 10 },
    { id: 2, nombre: "Jugo de mango", categoria: "jugos", precio: 9200, imagen: "img/jugo_mango.png", stock: 15 },
    { id: 3, nombre: "Jugo de piña", categoria: "jugos", precio: 12500, imagen: "img/jugo_piña.png", stock: 5 },
    { id: 4, nombre: "Smoothie tropical: mango + piña + coco", categoria: "smoothies", precio: 12500, imagen: "img/smoothie_tropical.png", stock: 7 },
    { id: 5, nombre: "Smoothie verde: espinaca + kiwi + banana + agua de coco", categoria: "smoothies", precio: 7900, imagen: "img/smoothie_verde.png", stock: 9 },
    { id: 6, nombre: "Smoothie de frambuesa y plátano", categoria: "smoothies", precio: 10800, imagen: "img/smoothie-de-frambuesa-y-platano.png", stock: 3 }
];

const empleadoDB = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", password: "Clave2024", cargo: "Analista", rut: "12345678-9" },
    { id: 2, nombre: "María López", email: "maria@example.com", password: "Clave2025", cargo: "Analista", rut: "98765432-1" }
];

const clienteDB = [
    { id: 1, nombre: "Ana María", email: "mariana@example.com", password: "Clave2023", rut: "11223344-5" },
    { id: 2, nombre: "José Torres", email: "jose@example.com", password: "Clave2022", rut: "55667788-9" }
];

const promoDB = [{ id: 1, codigo: "DESC10" }];

if (!localStorage.getItem("productos")) localStorage.setItem("productos", JSON.stringify(productosDB));
if (!localStorage.getItem("clientes")) localStorage.setItem("clientes", JSON.stringify(clienteDB));
if (!localStorage.getItem("empleados")) localStorage.setItem("empleados", JSON.stringify(empleadoDB));
if (!localStorage.getItem("carrito")) localStorage.setItem("carrito", JSON.stringify([]));
if (!localStorage.getItem("compras")) localStorage.setItem("compras", JSON.stringify([]));
if (!localStorage.getItem("codigos")) localStorage.setItem("codigos", JSON.stringify(promoDB));
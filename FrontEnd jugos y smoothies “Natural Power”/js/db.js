// db.js
// Simula una base de datos local (en memoria o en localStorage)

// ----- Productos iniciales -----
const productosDB = [
  {
    id: 1,
    nombre: "Jugo de manzana verde",
    categoria: "jugos",
    precio: 8500,
    imagen: "img/jugo_manzana.png",
    stock: 10
  },
  {
    id: 2,
    nombre: "Jugo de mango",
    categoria: "jugos",
    precio: 9200,
    imagen: "img/jugo_mango.png",
    stock: 15
  },
  {
    id: 3,
    nombre: "Jugo de piña",
    categoria: "jugos",
    precio: 12500,
    imagen: "img/jugo_piña.png",
    stock: 5
  },
  {
    id: 4,
    nombre: "Smoothie tropical: mango + piña + coco",
    categoria: "smoothies",
    precio: 12500,
    imagen: "img/smoothie_tropical.png",
    stock: 7
  },
  {
    id: 5,
    nombre: "Smoothie verde: espinaca + kiwi + banana + agua de coco",
    categoria: "smoothies",
    precio: 7900,
    imagen: "img/smoothie_verde.png",
    stock: 9
  },
  {
    id: 6,
    nombre: "Smoothie de frambuesa y plátano",
    categoria: "smoothies",
    precio: 10800,
    imagen: "img/smoothie-de-frambuesa-y-platano.png",
    stock: 3
  }
];

// ----- Usuarios simulados -----
const usuariosDB = JSON.parse(localStorage.getItem("usuarios")) || [];

// ----- Inicialización -----
if (!localStorage.getItem("productos")) {
  localStorage.setItem("productos", JSON.stringify(productosDB));
}


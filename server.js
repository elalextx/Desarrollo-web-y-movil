const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');

const Usuario = require('./models/usuario');
const Cliente = require('./models/cliente');
const Empleado = require('./models/empleado');
const Producto = require('./models/producto');
const ItemCarrito = require('./models/itemCarrito');
const Carrito = require('./models/carrito');
const Compra = require('./models/compra');

mongoose.connect('mongodb://localhost:27017/naturalpower');

const typeDefs = gql`
    type Usuario {
        id: ID!
        nombre: String!
        email: String
        pass: String
        rut: String
        fechaRegistro: String
        perfilTipo: String!
        perfil: Perfil
    }

    union Perfil = Cliente | Empleado

    type Cliente {
        id: ID!
        usuario: Usuario!
        estado: String!
        historialCompras: [Compra]
    }

    type Empleado {
        id: ID!
        usuario: Usuario!
        cargo: String!
    }

    type Producto {
        id: ID!
        nombre: String!
        categoria: String!
        precio: Float!
        stock: Int!
        imagen: String
    }

    type ItemCarrito {
        id: ID!
        producto: Producto!
        cantidad: Int!
    }

    type Carrito {
        id: ID!
        cliente: Cliente!
        items: [ItemCarrito!]!
        total: Float!
        descuento: Boolean
    }

    type Compra {
        id: ID!
        cliente: Cliente!
        items: [ItemCarrito!]!
        total: Float!
        fechaCompra: String
        estado: String
    }

    input UsuarioInput {
        nombre: String!
        email: String
        pass: String
        rut: String
        perfilTipo: String!
        perfilId: ID!
    }

    input ClienteInput {
        usuarioId: ID!
        estado: String
    }

    input EmpleadoInput {
        usuarioId: ID!
        cargo: String!
    }

    input ProductoInput {
        nombre: String!
        categoria: String!
        precio: Float!
        stock: Int!
        imagen: String
    }

    input ItemCarritoInput {
        productoId: ID!
        cantidad: Int!
    }

    input CarritoInput {
        clienteId: ID!
        items: [ID!]!
        total: Float
        descuento: Boolean
    }

    input CompraInput {
        clienteId: ID!
        items: [ID!]!
        total: Float!
        estado: String
    }

    type Response {
        status: String!
        message: String!
    }

    type Query {
        # Usuarios
        getUsuarios: [Usuario]
        getUsuario(id: ID!): Usuario
        
        # Productos
        getProductos: [Producto]
        getProducto(id: ID!): Producto
        getProductosByCategoria(categoria: String!): [Producto]
        
        # Clientes
        getClientes: [Cliente]
        getCliente(id: ID!): Cliente
        getClientesPendientes: [Cliente]
        
        # Empleados
        getEmpleados: [Empleado]
        getEmpleado(id: ID!): Empleado
        getEmpleadoByNombre(nombre: String!): Empleado
        getEmpleadoByRut(rut: String!): Empleado
        
        # Compras
        getCompras: [Compra]
        getCompra(id: ID!): Compra
        getComprasReembolso: [Compra]
        getComprasDia: [Compra]
        getCompraByCliente(clienteId: ID!): [Compra]
        
        # Carrito
        getCarritoByCliente(clienteId: ID!): Carrito
        getItemsCarritoByCarrito(carritoId: ID!): [ItemCarrito]
    }

    type Mutation {
        # Usuario
        addUsuario(input: UsuarioInput): Usuario
        updUsuario(id: ID!, input: UsuarioInput): Usuario
        delUsuario(id: ID!): Response
        login(email: String!, pass: String!): String

        # Cliente
        addCliente(input: ClienteInput): Cliente
        updCliente(id: ID!, input: ClienteInput): Cliente
        delCliente(id: ID!): Response
        confirmarCliente(id: ID!, aprobacion: Boolean!): Response

        # Empleado
        addEmpleado(input: EmpleadoInput): Empleado
        updEmpleado(id: ID!, input: EmpleadoInput): Empleado
        delEmpleado(id: ID!): Response

        # Producto
        addProducto(input: ProductoInput): Producto
        updProducto(id: ID!, input: ProductoInput): Producto
        delProducto(id: ID!): Response

        # ItemCarrito
        addItemCarrito(input: ItemCarritoInput): ItemCarrito
        updItemCarrito(id: ID!, input: ItemCarritoInput): ItemCarrito
        delItemCarrito(id: ID!): Response

        # Carrito
        crearCarrito(clienteId: ID!): Carrito
        agregarItemCarrito(carritoId: ID!, itemCarritoId: ID!): Carrito
        calcularTotal(id: ID!): Float
        eliminarItem(carritoId: ID!, itemId: ID!): Carrito
        aplicarDescuento(id: ID!, aplicar: Boolean!): Carrito
        confirmarCompra(carritoId: ID!): Compra

        # Compra
        solicitudReembolso(id: ID!): Response
        validarAnulacion(id: ID!): Response
        generarTicket(id: ID!): String

        # Reportes
        generarReporte(inicio: String, final: String): String
        generarReporteFiltro(filtro: String): String
    }
`;

const resolvers = {
    Perfil: {
        __resolveType(obj, context, info) {
            if (obj.cargo) {
                return 'Empleado';
            }
            if (obj.estado !== undefined) {
                return 'Cliente';
            }
            return null;
        },
    },

    Query: {

        async getUsuarios() {
            return await Usuario.find()
                .populate('perfil');
        },

        async getUsuario(_, { id }) {
            return await Usuario.findById(id).populate('perfil');
        },

        async getProductos() {
            return await Producto.find();
        },

        async getProducto(_, { id }) {
            return await Producto.findById(id);
        },

        async getProductosByCategoria(_, { categoria }) {
            return await Producto.find({ categoria: new RegExp(categoria, 'i') });
        },

        async getClientes() {
            return await Cliente.find()
                .populate('usuario')
                .populate('historialCompras');
        },

        async getCliente(_, { id }) {
            return await Cliente.findById(id)
                .populate('usuario')
                .populate('historialCompras');
        },

        async getClientesPendientes() {
            return await Cliente.find({ estado: "pendiente" })
                .populate('usuario')
                .populate('historialCompras');
        },

        async getEmpleados() {
            return await Empleado.find().populate('usuario');
        },

        async getEmpleado(_, { id }) {
            return await Empleado.findById(id).populate('usuario');
        },

        async getEmpleadoByNombre(_, { nombre }) {
            const usuario = await Usuario.findOne({ nombre: new RegExp(nombre, 'i') });
            if (!usuario) return null;
            return await Empleado.findOne({ usuario: usuario._id }).populate('usuario');
        },

        async getEmpleadoByRut(_, { rut }) {
            const usuario = await Usuario.findOne({ rut: rut });
            if (!usuario) return null;
            return await Empleado.findOne({ usuario: usuario._id }).populate('usuario');
        },

        async getCompras() {
            return await Compra.find()
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async getCompra(_, { id }) {
            return await Compra.findById(id)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async getComprasReembolso() {
            return await Compra.find({ estado: "Reembolso solicitado" })
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async getComprasDia() {
            const hoy = new Date();
            const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
            const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
            
            return await Compra.find({
                fechaCompra: {
                    $gte: inicioDia,
                    $lt: finDia
                }
            }).populate('cliente');
        },

        async getCompraByCliente(_, { clienteId }) {
            return await Compra.find({ cliente: clienteId })
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                })
                .populate('cliente');
        },

        async getCarritoByCliente(_, { clienteId }) {
            return await Carrito.findOne({ cliente: clienteId })
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async getItemsCarritoByCarrito(_, { carritoId }) {
            const carrito = await Carrito.findById(carritoId)
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
            return carrito ? carrito.items : [];
        }
    },

    Mutation: {

        async addUsuario(_, { input }) {
            const { perfilId, ...usuarioData } = input;
            
            let perfil;
            if (input.perfilTipo === 'Cliente') {
                perfil = new Cliente({ usuario: null, estado: 'pendiente' });
            } else {
                perfil = new Empleado({ usuario: null, cargo: 'Empleado' });
            }
            await perfil.save();

            const usuario = new Usuario({
                ...usuarioData,
                perfil: perfil._id
            });
            await usuario.save();

            perfil.usuario = usuario._id;
            await perfil.save();

            return await Usuario.findById(usuario._id).populate('perfil');
        },

        async updUsuario(_, { id, input }) {
            const { perfilId, ...usuarioData } = input;
            const usuario = await Usuario.findByIdAndUpdate(
                id, 
                usuarioData, 
                { new: true }
            ).populate('perfil');
            return usuario;
        },

        async delUsuario(_, { id }) {
            const usuario = await Usuario.findById(id);
            if (usuario) {
                // Eliminar también el perfil asociado
                if (usuario.perfilTipo === 'Cliente') {
                    await Cliente.findByIdAndDelete(usuario.perfil);
                } else {
                    await Empleado.findByIdAndDelete(usuario.perfil);
                }
                await Usuario.findByIdAndDelete(id);
            }
            return {
                status: "200",
                message: "Usuario eliminado correctamente"
            };
        },

        async login(_, { email, pass }) {
            const usuario = await Usuario.findOne({ email, pass }).populate('perfil');
            if (!usuario) {
                throw new Error("Credenciales inválidas");
            }
            return `Login exitoso - Bienvenido ${usuario.nombre}`;
        },

        async addCliente(_, { input }) {
            const cliente = new Cliente(input);
            await cliente.save();
            return await Cliente.findById(cliente._id).populate('usuario');
        },

        async updCliente(_, { id, input }) {
            const cliente = await Cliente.findByIdAndUpdate(id, input, { new: true })
                .populate('usuario');
            return cliente;
        },

        async delCliente(_, { id }) {
            await Cliente.findByIdAndDelete(id);
            return {
                status: "200",
                message: "Cliente eliminado correctamente"
            };
        },

        async confirmarCliente(_, { id, aprobacion }) {
            const cliente = await Cliente.findById(id);
            if (!cliente) {
                return {
                    status: "404",
                    message: "Cliente no encontrado"
                };
            }
            cliente.estado = aprobacion ? "aprobado" : "rechazado";
            await cliente.save();
            return {
                status: "200",
                message: "Estado del cliente actualizado"
            };
        },

        async addEmpleado(_, { input }) {
            const empleado = new Empleado(input);
            await empleado.save();
            return await Empleado.findById(empleado._id).populate('usuario');
        },

        async updEmpleado(_, { id, input }) {
            const empleado = await Empleado.findByIdAndUpdate(id, input, { new: true })
                .populate('usuario');
            return empleado;
        },

        async delEmpleado(_, { id }) {
            await Empleado.findByIdAndDelete(id);
            return {
                status: "200",
                message: "Empleado eliminado correctamente"
            };
        },

        async addProducto(_, { input }) {
            const producto = new Producto(input);
            await producto.save();
            return producto;
        },

        async updProducto(_, { id, input }) {
            const producto = await Producto.findByIdAndUpdate(id, input, { new: true });
            return producto;
        },

        async delProducto(_, { id }) {
            await Producto.findByIdAndDelete(id);
            return {
                status: "200",
                message: "Producto eliminado correctamente"
            };
        },

        async addItemCarrito(_, { input }) {
            const item = new ItemCarrito(input);
            await item.save();
            return await ItemCarrito.findById(item._id).populate('producto');
        },

        async updItemCarrito(_, { id, input }) {
            const item = await ItemCarrito.findByIdAndUpdate(id, input, { new: true })
                .populate('producto');
            return item;
        },

        async delItemCarrito(_, { id }) {
            await ItemCarrito.findByIdAndDelete(id);
            return {
                status: "200",
                message: "Item del carrito eliminado correctamente"
            };
        },

        async crearCarrito(_, { clienteId }) {
            const carritoExistente = await Carrito.findOne({ cliente: clienteId });
            if (carritoExistente) {
                return carritoExistente;
            }
            
            const carrito = new Carrito({
                cliente: clienteId,
                items: [],
                total: 0,
                descuento: false
            });
            await carrito.save();
            return await Carrito.findById(carrito._id).populate('cliente');
        },

        async agregarItemCarrito(_, { carritoId, itemCarritoId }) {
            const carrito = await Carrito.findById(carritoId);
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            
            carrito.items.push(itemCarritoId);
            await carrito.save();
            
            return await Carrito.findById(carritoId)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async calcularTotal(_, { id }) {
            const carrito = await Carrito.findById(id).populate({
                path: 'items',
                populate: { path: 'producto' }
            });
            
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            
            const total = carrito.items.reduce((acc, item) => {
                return acc + (item.cantidad * item.producto.precio);
            }, 0);
            
            carrito.total = carrito.descuento ? total * 0.9 : total;
            await carrito.save();
            
            return carrito.total;
        },

        async eliminarItem(_, { carritoId, itemId }) {
            const carrito = await Carrito.findById(carritoId);
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            
            carrito.items = carrito.items.filter(item => item.toString() !== itemId);
            await carrito.save();
            
            await ItemCarrito.findByIdAndDelete(itemId);
            
            return await Carrito.findById(carritoId)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async aplicarDescuento(_, { id, aplicar }) {
            const carrito = await Carrito.findById(id);
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            
            carrito.descuento = aplicar;
            await carrito.save();
            
            await resolvers.Mutation.calcularTotal(null, { id });
            
            return await Carrito.findById(id)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async confirmarCompra(_, { carritoId }) {
            const carrito = await Carrito.findById(carritoId)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
                
            if (!carrito) {
                throw new Error("Carrito no encontrado");
            }
            
            const compra = new Compra({
                cliente: carrito.cliente._id,
                items: carrito.items.map(item => item._id),
                total: carrito.total,
                fechaCompra: new Date(),
                estado: "confirmada"
            });
            await compra.save();
            
            await Cliente.findByIdAndUpdate(
                carrito.cliente._id,
                { $push: { historialCompras: compra._id } }
            );
            
            carrito.items = [];
            carrito.total = 0;
            carrito.descuento = false;
            await carrito.save();
            
            return await Compra.findById(compra._id)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
        },

        async solicitudReembolso(_, { id }) {
            const compra = await Compra.findById(id);
            if (!compra) {
                return {
                    status: "404",
                    message: "Compra no encontrada"
                };
            }
            
            compra.estado = "Reembolso solicitado";
            await compra.save();
            
            return {
                status: "200",
                message: "Solicitud de reembolso enviada"
            };
        },

        async validarAnulacion(_, { id }) {
            const compra = await Compra.findById(id);
            if (!compra) {
                return {
                    status: "404",
                    message: "Compra no encontrada"
                };
            }
            
            compra.estado = "anulada";
            await compra.save();
            
            return {
                status: "200",
                message: "Compra anulada correctamente"
            };
        },

        async generarTicket(_, { id }) {
            const compra = await Compra.findById(id)
                .populate('cliente')
                .populate({
                    path: 'items',
                    populate: { path: 'producto' }
                });
                
            if (!compra) {
                throw new Error("Compra no encontrada");
            }
            
            const itemsDetalle = compra.items.map(item => 
                `${item.producto.nombre} x${item.cantidad} - $${item.producto.precio * item.cantidad}`
            ).join('\n');
            
            return `=== TICKET DE COMPRA ===
N°: ${compra._id}
Cliente: ${compra.cliente.usuario ? compra.cliente.usuario.nombre : 'N/A'}
Fecha: ${compra.fechaCompra}
Items:
${itemsDetalle}
Total: $${compra.total}
Estado: ${compra.estado}
=====================`;
        },

        async generarReporte(_, { inicio, final }) {
            return `Reporte generado desde ${inicio || "inicio"} hasta ${final || "actual"}.`;
        },

        async generarReporteFiltro(_, { filtro }) {
            return `Reporte generado con filtro: ${filtro}`;
        }
    }
};

let apolloServer = null;

const corsOptions = {
    origin: 'http://localhost:8092',
    credentials: false
};

async function startServer() {
    apolloServer = new ApolloServer({ typeDefs, resolvers, corsOptions});
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
};

startServer();

const app = express();
app.use(cors());
app.listen(8092, function(){
    console.log('Servidor iniciado en el puerto 8092');
    console.log(`GraphQL endpoint: http://localhost:8092${apolloServer.graphqlPath}`);
});
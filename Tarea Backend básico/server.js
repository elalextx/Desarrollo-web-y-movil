const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { ApolloServer, gql } = require('apollo-server-express');

const Usuario = require('./models/usuario');
const Perfil = require('./models/perfil');
const perfil = require('./models/perfil');

mongoose.connect('mongodb://localhost:27017/bdunab');
const typeDefs = gql`

    type Perfil {
        id: ID!
        nombre: String!
    }
    type Usuario {
        id: ID!
        nombre: String!
        pass: String!
        perfil: Perfil!
    }
    input UsuarioInput {
        nombre: String!
        pass: String!
        perfil: String!
    }
    input PerfilInput {
        nombre: String!
    }
    type Response {
        status: String
        message: String
    }
    type Query {
        getUsuarios: [Usuario]
        getUsuariosPerfil: [Usuario]
        getUsuarioById(id: ID!): Usuario
        getUsuarioByIdPerfil(id: ID!): Usuario
        getPerfiles: [Perfil]
        getPerfilById(id: ID!): Perfil
    }
    type Mutation {
        addUsuario(input: UsuarioInput): Usuario
        updUsuario(id: ID!, input: UsuarioInput): Usuario
        delUsuario(id: ID!): Response
        addPerfil(input: PerfilInput): Perfil
        updPerfil(id: ID!, input: PerfilInput): Perfil
        delPerfil(id: ID!): Response
    }
`;

const resolvers = {
    Query: {
        async getUsuarios(obj) {
            const usuarios = await Usuario.find();
            return usuarios;
        },
        async getUsuariosPerfil(obj) {
            const usuarios = await Usuario.find().populate('perfil');
            return usuarios;
        },
        async getUsuarioById(obj, { id }) {
            const usuarioBus = await Usuario.findById(id);
            if (usuarioBus == null) {
                return null;
            } else {
                return usuarioBus;
            }
        },
        async getUsuarioByIdPerfil(obj, { id }) {
            const usuarioBus = await Usuario.findById(id).populate('perfil');
            if (usuarioBus == null) {
                return null;
            } else {
                return usuarioBus;
            }
        },
        async getPerfiles(obj) {
            const perfiles = await Perfil.find();
            return perfiles;
        },
        async getPerfilById(obj, { id }) {
            const perfilBus = await Perfil.findById(id);
            if (perfilBus == null) {
                return null;
            } else {
                return perfilBus;
            }
        }
    },
    Mutation: {
        async addUsuario(obj, { input }) {
            const nombre = input.nombre;
            const pass = input.pass;
            const perfilId = input.perfil;
            const perfilbus = await Perfil.findById(perfilId);
            if (perfilbus == null) {
                return null;
            } else {
            const usuario = new Usuario({ nombre: nombre, pass: pass, perfil: perfilbus });
            await usuario.save();
            return usuario;
            }
        },
        async addPerfil(obj, { input }) {
            const perfil = new Perfil(input);
            await perfil.save();
            return perfil;
        },
        async updUsuario(obj, { id, input }) {
            const nombre = input.nombre;
            const pass = input.pass;
            const perfilId = input.perfil;
            const perfilObj = await Perfil.findById(perfilId);
            if (perfilObj == null) {
                return null;
            } else {
                const usuario = await Usuario.findByIdAndUpdate(id, { nombre: nombre, pass: pass, perfil: perfilObj });
                return usuario;
            }
        },
        async updPerfil(obj, { id, input }) {
            const perfil = await Perfil.findByIdAndUpdate(id, input);
            return perfil;
        },
        async delUsuario(obj, { id }) {
            await Usuario.deleteOne({ _id: id });
            return {
                status: "200",
                message: "Usuario eliminado"
            }
        }
    }
}

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
});
const mongoose = require('mongoose');
const usuarioSchema = mongoose.Schema({
    nombre: String,
    pass: String,
    perfil: { type: mongoose.Schema.Types.ObjectId, ref: 'Perfil' }

});

module.exports = mongoose.model('Usuario', usuarioSchema);
const mongoose = require('mongoose');
const clienteSchema = new mongoose.Schema({
    historialCompras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compra' }],
    estado: { type: String, default: 'pendiente' }
});

module.exports = mongoose.model('Cliente', clienteSchema);

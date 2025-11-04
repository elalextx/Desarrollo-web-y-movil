const mongoose = require('mongoose');

const compraSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente', 
        required: true
    },
    items: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemCarrito',
        required: true
        }
    ],
    total: { type: Number, required: true },
    fechaCompra: { type: Date, default: Date.now },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'enviada', 'completada', 'cancelada'],
        default: 'pendiente'
    }
});

module.exports = mongoose.model('Compra', compraSchema);

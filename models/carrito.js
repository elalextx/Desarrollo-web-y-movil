const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
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
    total: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    descuento: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Carrito', carritoSchema);

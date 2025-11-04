const mongoose = require('mongoose');

const itemCarritoSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
});

module.exports = mongoose.model('ItemCarrito', itemCarritoSchema);
